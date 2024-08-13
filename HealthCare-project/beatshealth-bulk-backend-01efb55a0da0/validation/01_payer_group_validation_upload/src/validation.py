# lambda handler for payer mapping validation
# benedict au, beats health
# march 2022

# keywords: medical billing, data validation, payer mapping

import boto3 
import os
import sys
import json
import time  
import pymysql
import datetime
import logging 
import traceback
import numpy as np
import pandas as pd


logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):

    # establish connection to db
    ssm = boto3.client("ssm")

    rds_db = ssm.get_parameter(Name="RDS_DATABASE")["Parameter"]["Value"]
    rds_host = ssm.get_parameter(Name="RDS_HOSTNAME")["Parameter"]["Value"]
    name = ssm.get_parameter(Name="RDS_USERNAME")["Parameter"]["Value"]
    password = ssm.get_parameter(Name="RDS_PASSWORD")["Parameter"]["Value"]
    db_name = ""
    port = int(ssm.get_parameter(Name="RDS_PORT")["Parameter"]["Value"])

    conn = pymysql.connect(host=rds_host, user=name, port=port,
                            passwd=password, db=db_name, connect_timeout=5)

    def db_query(query):
        with conn.cursor() as cur:
            cur.execute(query)
            conn.commit()

            return cur.fetchall()


    for record in event.get("Records"):
    
        try:

            start_time = time.time()

            # assumes SQS event
            print(f"--> Now processing record in queue: {record}")

            # read event
            S3_PATH = record.get("body")    # "payer-mapping/upload/admin123/PayerIDMapping.xlsx"
            
            # figure out the correct bucket
            ssm = boto3.client("ssm")
            S3_BUCKET = ssm.get_parameter(Name="S3_BUCKET_NAME")["Parameter"]["Value"]

            assert len(S3_PATH.split("/")) == 4, "Invalid S3 URI."

            FILE_TYPE, DIR, ADMIN_ID, FILE = S3_PATH.split("/")

            # 0 byte in_progress file
            s3 = boto3.client('s3')
            s3.put_object(Bucket=S3_BUCKET,Key=f'{FILE_TYPE}/{DIR}/{ADMIN_ID}/in_progress.txt')

            if FILE_TYPE == "group-mapping":

                print("--> This is a group mapping file.")
                
                # write file to file_upload table
                db_query(query=f"""INSERT INTO {rds_db}.file_upload
                                    (file_name, file_type, file_processing_status, summary_dashboard_display, s3_bucket_url, created_on, created_by) 
                                VALUES 
                                    ('{FILE}', 'group_mapping', 'Processing', 0, '{S3_PATH}', NOW(), '{ADMIN_ID}');
                                """)
                FILE_ID = db_query(query=f"""SELECT LAST_INSERT_ID();""")[0][0]

                print(f"{FILE_ID=}")


                tic = time.time()

                # read group map file
                s3 = boto3.client("s3")
                s3.download_file(S3_BUCKET, S3_PATH, f"/tmp/{FILE}")

                group_mapping_df = pd.read_excel(f"/tmp/{FILE}", index_col=None, header=0, na_filter=False, dtype=str)

                print("--> Read group map file.")

                toc = time.time()
                print(f"[TIMER] Download + read group map file: {toc-tic:.2f} sec.")

                if all(group_mapping_df.columns[:5] != ['Client ID', 'Client Name', 'Group Name', 'Rendering NPI', 'Billing NPI']):
                    print("Group mapping file contains invalid column headers.")
                    db_query(query=f"""UPDATE {rds_db}.file_upload
                                        SET file_processing_status = 'Failed'
                                        WHERE file_upload_id = {FILE_ID};""")
                    assert all(group_mapping_df.columns[:5] == ['Client ID', 'Client Name', 'Group Name', 'Rendering NPI', 'Billing NPI']), "Invalid headers in group mapping file. "

                def validate_group_mapping(df):
                    
                    validation_matrix = []
                    validation_matrix.append( ["Missing Client ID" if (name and not cid) else "" for cid, name in zip(df["Client ID"], df["Client Name"]) ] )

                    validation_matrix.append( ["" if name and len(name)>1 else "Missing Group Name. " for name in df["Group Name"]] )
                    validation_matrix.append( ["" if npi.isdigit() and len(npi)==10 else "Missing 10-digit Rendering NPI. " for npi in df["Rendering NPI"]] )
                    validation_matrix.append( ["" if npi.isdigit() and len(npi)==10 else "Missing 10-digit Billing NPI. " for npi in df["Billing NPI"]] )

                    validation_matrix.append( list(np.where(df.duplicated(["Group Name", "Rendering NPI"], keep=False), "Duplicate Rendering NPI for Group. ", "")) )
                    
                    df["Errors"] = ["".join(x) for x in zip(*validation_matrix)]
                    df["Validation_Result"] = ["Success" if not error else "Fail" for error in df["Errors"]]
                    
                    return df

                tic = time.time()

                group_mapping_df = validate_group_mapping(group_mapping_df)
                print("--> validation complete.")

                toc = time.time()
                print(f"[TIMER] Validation: {toc-tic:.2f} sec.")

                group_mapping_df.to_excel(f"/tmp/{FILE}", index=False)

                from collections import Counter
                validation_result_count = Counter(group_mapping_df.Validation_Result)
                num_success, num_fail = validation_result_count.get("Success", 0), validation_result_count.get("Fail", 0)

                if (num_success > 0 and num_fail == 0):

                    print("--> File passed validation checks. Writing to DB...")

                    tic = time.time()

                    # move group records into history
                    db_query(query=f"""INSERT INTO {rds_db}.client_master_history SELECT * FROM {rds_db}.client_master WHERE created_by='{ADMIN_ID}';""")
                    db_query(query=f"""INSERT INTO {rds_db}.group_master_history SELECT * FROM {rds_db}.group_master WHERE created_by='{ADMIN_ID}';""")
                    db_query(query=f"""INSERT INTO {rds_db}.group_mapping_history SELECT * FROM {rds_db}.group_mapping WHERE created_by='{ADMIN_ID}';""")

                    db_query(query="SET SQL_SAFE_UPDATES = 0;")
                    db_query(query=f"""DELETE FROM {rds_db}.group_mapping WHERE created_by='{ADMIN_ID}';""")
                    db_query(query=f"""DELETE FROM {rds_db}.group_master WHERE created_by='{ADMIN_ID}';""")
                    db_query(query=f"""DELETE FROM {rds_db}.client_master WHERE created_by='{ADMIN_ID}';""")
                    db_query(query="SET SQL_SAFE_UPDATES = 1;")

                    toc = time.time()
                    print(f"[TIMER] Move old group records into history: {toc-tic:.2f} sec.")

                    out_df = group_mapping_df.loc[group_mapping_df.Validation_Result=="Success", ["Client ID", "Client Name", "Group Name", 'Rendering NPI', 'Billing NPI']]
                    clients = [[i,j] for i,j in out_df[["Client ID", "Client Name"]].drop_duplicates(subset="Client ID").values.tolist() if i]
                    groups =  [[i,j] for i,j in out_df[["Client ID", "Group Name"]].drop_duplicates(subset="Group Name").values.tolist() if j]
                    npis = [[i,j,k] for i,j,k in out_df[["Group Name", "Rendering NPI", "Billing NPI"]].drop_duplicates(subset=["Rendering NPI", 'Billing NPI']).values.tolist() if j and k]


                    # write to db

                    tic = time.time()

                    for client_id, client_name in clients:
                        db_query(query=f"""INSERT INTO {rds_db}.client_master(client_id, client_name, created_on, created_by)
                                                VALUES ('{client_id}', '{client_name}', NOW(), '{ADMIN_ID}');""")

                    for client_id, group_name in groups:
                        if client_id:
                            db_query(query=f"""INSERT INTO {rds_db}.group_master(client_master_id, group_name, created_on, created_by)
                                                VALUES ((SELECT client_master_id FROM {rds_db}.client_master WHERE client_id='{client_id}' AND created_by='{ADMIN_ID}'), '{group_name}', NOW(), '{ADMIN_ID}');""")
                        else: 
                            db_query(query=f"""INSERT INTO {rds_db}.group_master(group_name, created_on, created_by)
                                                VALUES ('{group_name}', NOW(), '{ADMIN_ID}');""")

                    for group_name, provider_npi, billing_npi in npis:
                        db_query(query=f"""INSERT INTO {rds_db}.group_mapping(provider_npi, billing_npi, group_master_id, created_on, created_by)
                                                VALUES ('{provider_npi}', '{billing_npi}',  (SELECT group_master_id FROM {rds_db}.group_master WHERE group_name='{group_name}' AND created_by='{ADMIN_ID}'), NOW(), '{ADMIN_ID}');""")
                            

                    toc = time.time()
                    print(f"[TIMER] Write to db: {toc-tic:.2f} sec.")

                    tic = time.time()

                    s3.upload_file(f"/tmp/{FILE}", S3_BUCKET, f"{FILE_TYPE}/download/{ADMIN_ID}/{FILE}")
                    s3.delete_object(Bucket=S3_BUCKET, Key=S3_PATH)

                    toc = time.time()
                    print(f"[TIMER] Uploaded file to Downloads folder and deleted original: {toc-tic:.2f} sec.")

                    # s3.Object(S3_BUCKET, S3_PATH).delete()

                    db_query(query=f"""UPDATE {rds_db}.file_upload
                                        SET file_processing_status = 'Completed'
                                        WHERE file_upload_id = {FILE_ID};""")

                    print("--> group mapping processing complete.")

                    print(f"[TIMER END] Processing time: {toc-start_time:.2f} sec.")


                else: 
                    s3.upload_file(f"/tmp/{FILE}", S3_BUCKET, S3_PATH)

                    db_query(query=f"""UPDATE {rds_db}.file_upload
                                        SET file_processing_status = 'Failed'
                                        WHERE file_upload_id = {FILE_ID};""")

                    print("--> group mapping validation failed, writing to S3...")

                s3.delete_object(Bucket=S3_BUCKET, Key=f'{FILE_TYPE}/{DIR}/{ADMIN_ID}/in_progress.txt')

            elif FILE_TYPE == "payer-mapping":

                print("--> This is a payer mapping file.")
                
                # write file to file_upload table
                db_query(query=f"""INSERT INTO {rds_db}.file_upload
                                    (file_name, file_type, file_processing_status, summary_dashboard_display, s3_bucket_url, created_on, created_by) 
                                VALUES 
                                    ('{FILE}', 'payer_mapping', 'Processing', 0, '{S3_PATH}', NOW(), '{ADMIN_ID}');
                                """)
                FILE_ID = db_query(query=f"""SELECT LAST_INSERT_ID();""")[0][0]
                
                print(f"{FILE_ID=}")

                # read master file
                s3 = boto3.client("s3")
                ssm = boto3.client("ssm")
                s3_master_bucket = ssm.get_parameter(Name="S3_BUCKET_NAME")["Parameter"]["Value"]

                tic = time.time()
                
                if not os.path.exists("/tmp/payer_map_master.xlsx"): 

                    s3.download_file(s3_master_bucket, "payer-mapping/template/PayerIDMapping.xlsx", "/tmp/payer_map_master.xlsx")
                    print("--> downloaded master file.")
                
                payer_map_master_df = pd.read_excel("/tmp/payer_map_master.xlsx", index_col=None, header=0, na_filter=False, dtype=str)

                toc = time.time()
                print(f"[TIMER] Download and read master payer map file: {toc-tic:.2f} sec.")

                file_required_headers = payer_map_master_df.columns.tolist()
                print("--> loaded master file.")

                # read payer map file

                tic = time.time()

                s3.download_file(S3_BUCKET, S3_PATH, f"/tmp/{FILE}")

                payer_map_df = pd.read_excel(f"/tmp/{FILE}", index_col=None, header=0, na_filter=False, dtype=str)
                payer_map_headers = payer_map_df.columns.tolist()

                print("--> read payer map file.")

                toc = time.time()
                print(f"[TIMER] Download and read client payer map file: {toc-tic:.2f} sec.")

                # validate payer map file shape
                if payer_map_headers[:len(file_required_headers)] != file_required_headers:
                    pass
                    # return error_block(message=f"Invalid column headers in file. Require: {*payer_map_headers,}. ") # terminate
                else:
                    payer_map_df = payer_map_df[file_required_headers] # drop validation check columns

                if len(payer_map_df) != len(payer_map_master_df):
                    pass
                    # return error_block(message=f"Invalid file. Row mismatch. ") # terminate

                # validate mapping
                print("--> validating mapping")

                tic = time.time()

                def validate_payer_map(df):
                    payer_alias_df = df.iloc[:, [9,11,13,15,17]] # payer alias ID columns only, no name columns
                    payer_alias_val_count_df = payer_alias_df.apply(lambda x: x.value_counts(dropna=True))
                    payer_alias_val_count_df.drop("", inplace=True, errors='ignore') # drop empty string "" count, ignore error which only happens if the whole sheet is filled in.

                    # create list of duplicate values that are across the spreadsheet
                    duplicate_values_list = payer_alias_val_count_df.index[payer_alias_val_count_df.sum(axis=1, skipna=True)>1].to_list()
                    # print(f"{duplicate_values_list=}")

                    # for each duplicate value, we get the source row indicies
                    validation_results = [""]*len(payer_alias_df)
                    
                    for val in duplicate_values_list:
                        rows = payer_alias_df.loc[payer_alias_df.eq(val).any(axis=1)].index.tolist()
                        error_msg = f"Alias ID `{val}` duplicated in rows {[int(row+2) for row in rows]}. "
                        for row in rows:
                            validation_results[row] += error_msg

                    df["Errors"] = validation_results
                    
                    return df

                def val_res(row):
                    if all(row[-11: -1]==([""]*10)):
                        return ""
                    elif not row.Errors:
                        return "Success"
                    else:
                        return "Fail"

                payer_map_df = validate_payer_map(payer_map_df)
                payer_map_df["Validation_Result"] = payer_map_df.apply(val_res, axis=1)

                # build the output dataframe

                out_df = payer_map_df.loc[payer_map_df.Validation_Result=="Success", file_required_headers]
                out_df["id"] = out_df.index
                out_df = pd.wide_to_long(out_df, ["Payer Alias ID", "Payer Alias Name"], i="id", j="alias") 
                # for now grab either conditon below so we can yell later
                out_df = out_df.loc[(out_df["Payer Alias ID"]!="") | (out_df["Payer Alias Name"]!="")]
                
                # If not alias name but alias id then External Payer Name -> Alias name
                out_df.loc[out_df["Payer Alias Name"] == '','Payer Alias Name'] = out_df["External Payer Name"]

                # yell if payer alias name but no id
                alias_list = out_df[["Payer Alias ID", "Payer Alias Name"]].values.tolist() 
                validation_results = [""]*len(payer_map_df)
                for row, alias in enumerate(alias_list):
                    if not alias[0]: # if alias id was left blank
                        payer_map_df.at[[i for i,_ in out_df.index.to_list()][row], 'Errors'] += f"Payer Alias ID missing. "
                payer_map_df["Validation_Result"] = payer_map_df.apply(val_res, axis=1)

                # now only grab alias id items
                out_df = out_df.loc[(out_df["Payer Alias ID"]!="")]


                # Reminder for enrollment with Availity
                def remind_eligibility_enrollment(cell):
                    if cell == "Y":
                        return "Provider eligibility enrollment is required. "
                    elif cell == "N/A":
                        return "Provider eligibility enrollment information is unavailable. "
                    elif cell == "N":
                        return ""  
                    else:
                        return ""
                       
                def remind_claims_enrollment(cell):
                    if cell == "Y":
                        return "Provider claims verification enrollment is required. "
                    elif cell == "N/A":
                        return "Provider claims verification enrollment information is unavailable. "
                    elif cell == "N":
                        return ""  
                    else:
                        return ""

                # def remind_era_enrollment(cell):               
                #     if cell == "Y":
                #         return "Provider ERA enrollment is required. "
                #     elif cell == "N/A":
                #         return "Provider ERA enrollment information is unavailable. "
                #     elif cell == "N":
                #         return ""  
                #     else:
                #         return ""

                validation_matrix = []
                validation_matrix.append(payer_map_df["Errors"].tolist())

                validation_matrix.append( [remind_eligibility_enrollment(idx) if payer_on else "" for idx, payer_on in zip(payer_map_df["Eligibility_Enrollment_Required"], payer_map_df["Payer Alias ID1"])] )
                validation_matrix.append( [remind_claims_enrollment(idx) if payer_on else "" for idx, payer_on in zip(payer_map_df["Claims_Enrollment_Required"], payer_map_df["Payer Alias ID1"])] )
                # validation_matrix.append( [remind_era_enrollment(idx) for idx in payer_map_df["Enrollment_Required"]] )

                payer_map_df["Errors"] = ["".join(x) for x in zip(*validation_matrix)]

                print("--> validation complete.")

                toc = time.time()
                print(f"[TIMER] Validation: {toc-tic:.2f} sec.")


                from collections import Counter
                validation_result_count = Counter(payer_map_df.Validation_Result)
                num_success, num_fail = validation_result_count.get("Success", 0), validation_result_count.get("Fail", 0)

                payer_map_df.to_excel(f"/tmp/{FILE}", index=False)


                if (num_success > 0 and num_fail == 0 and len(out_df) > 0):

                    print("--> File passed validation checks. Writing to DB...")

                    out_df = out_df[["Payer Alias ID", "Payer Alias Name", "Unique Identifier"]]
                    
                    out_df["created_by"] = ADMIN_ID

                    # delete existing records

                    tic = time.time()

                    db_query(query="SET SQL_SAFE_UPDATES = 0;")
                    db_query(query=f"""DELETE FROM {rds_db}.payer_alias WHERE created_by='{ADMIN_ID}';""")
                    db_query(query="SET SQL_SAFE_UPDATES = 1;")

                    toc = time.time()
                    print(f"[TIMER] Delete existing records: {toc-tic:.2f} sec.")

                    tic = time.time()

                    # insert new records
                    with conn.cursor() as cur:
                        #cur.execute("SET foreign_key_checks = 0")
                        cur.executemany(f"""INSERT INTO {rds_db}.payer_alias(payer_alias_identifier, 
                                                payer_alias_name, payer_mapping_id, created_on, created_by) 
                                            VALUES (%s, %s, %s, NOW(), %s)""", 
                                        out_df.values.tolist())
                        #cur.execute("SET foreign_key_checks = 1")
                        conn.commit()
                    
                    toc = time.time()
                    print(f"[TIMER] Inserted new records: {toc-tic:.2f} sec.")

                    tic = time.time()

                    s3.upload_file(f"/tmp/{FILE}", S3_BUCKET, f"{FILE_TYPE}/download/{ADMIN_ID}/{FILE}")
                    s3.delete_object(Bucket=S3_BUCKET, Key=S3_PATH)
                    # s3.Object(S3_BUCKET, S3_PATH).delete()
                    print("--> payer mapping processing complete.")

                    toc = time.time()
                    print(f"[TIMER] Uploaded file to Downloads folder and deleted original: {toc-tic:.2f} sec.")

                    print(f"[TIMER END] Processing time: {toc-start_time:.2f} sec.")

                    db_query(query=f"""UPDATE {rds_db}.file_upload
                                        SET file_processing_status = 'Completed'
                                        WHERE file_upload_id = {FILE_ID};""")


                else: 
                    print("--> File failed validation checks. Writing to S3...")
                    s3.upload_file(f"/tmp/{FILE}", S3_BUCKET, S3_PATH)

                    db_query(query=f"""UPDATE {rds_db}.file_upload
                                        SET file_processing_status = 'Failed'
                                        WHERE file_upload_id = {FILE_ID};""")

                
                print("--> Saved to s3. Done with item in SQS queue.")
                s3.delete_object(Bucket=S3_BUCKET, Key=f'{FILE_TYPE}/{DIR}/{ADMIN_ID}/in_progress.txt')


            else:

                # should not be here
                db_query(query=f"""INSERT INTO {rds_db}.file_upload
                                (file_name, file_type, file_processing_status, summary_dashboard_display, s3_bucket_url, created_on, created_by) 
                            VALUES 
                                ('{FILE}', 'UNKNOWN_{FILE_TYPE}', 'Failed', 0, '{S3_PATH}', NOW(), '{ADMIN_ID}'...);
                            SELECT LAST_INSERT_ID();""")

        except Exception as exp:
            exception_type, exception_value, exception_traceback = sys.exc_info()
            traceback_string = traceback.format_exception(exception_type, exception_value, exception_traceback)
            err_msg = json.dumps({
                "errorType": exception_type.__name__,
                "errorMessage": str(exception_value),
                "stackTrace": traceback_string
            })
            logger.error(err_msg)

            try: 
                db_query(query=f"""UPDATE {rds_db}.file_upload
                                        SET file_processing_status = 'Failed'
                                        WHERE file_upload_id = {FILE_ID};""")
            except:
                pass 

            # s3.delete_object(Bucket=S3_BUCKET, Key=f'{FILE_TYPE}/{DIR}/{ADMIN_ID}/in_progress.txt')


