import os
import sys
print("Python version", sys.version)
import json
import time
import glob
import boto3 
import datetime
import logging 
import pymysql
import edi_835_parser
import traceback 
import pandas as pd 

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):

    """Parses 835 file into DB.
    Assumes s3 eventbridge as trigger

    """
    print("*** Lambda Triggered ***")
    logger.info(f'{event=}')
    
    try:

        # check s3 filename
        s3_bucket = event['detail']['bucket']['name']
        s3_key = event['detail']['object']['key']
        assert len(s3_key.split("/")) == 3, "Invalid S3 object key."
        filetype, user, filename = s3_key.split("/")  
        assert filetype == "bulk-era-upload", "Invalid S3 file: not from ./bulk-era-upload/"
        print(f"{user=}, {filename=}")

        # db 
        ssm = boto3.client("ssm") 
        region = ssm.get_parameter(Name="region")["Parameter"]["Value"]
        accessKeyId = ssm.get_parameter(Name="accessKeyId")["Parameter"]["Value"]
        secretAccessKey = ssm.get_parameter(Name="secretAccessKey")["Parameter"]["Value"]

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

        # grab file
        s3 = boto3.client('s3')
        s3.download_file(s3_bucket, s3_key, f'/tmp/{user}_{filename}')

        # write to file_upload table
        _ = db_query(query=f"""INSERT INTO {rds_db}.file_upload
                            (file_name, file_type, file_processing_status, summary_dashboard_display, s3_bucket_url, created_on, created_by) 
                        VALUES 
                            ('{filename}', 'era', 'Processing', 0, '{s3_key}', NOW(), '{user}');
                        """)
        file_upload_id = db_query(query=f"""SELECT LAST_INSERT_ID();""")[0][0]
            
        # try to parse the file
        try: 
            records = edi_835_parser.parse(f'/tmp/{user}_{filename}') 
        except Exception as exp:
            exception_type, exception_value, exception_traceback = sys.exc_info()
            traceback_string = traceback.format_exception(exception_type, exception_value, exception_traceback)
            err_msg = json.dumps({
                "errorType": exception_type.__name__,
                "errorMessage": str(exception_value),
                "stackTrace": traceback_string
            })
            logger.error(err_msg)

            _ = db_query(query=f"""UPDATE {rds_db}.file_upload
                    SET file_processing_status = 'Failed -> parser'
                    WHERE file_upload_id = {file_upload_id};""")
            
            return          # terminates lambda_handler

        # we need records in dict form to grab NPI and Payment Method Info
        dump_default = lambda k: getattr(k, '__dict__', str(k))
        get_json = lambda x: json.loads(json.dumps(x, default=dump_default))
        records_dict = get_json(dump_default(records))

        logger.info(f"{records_dict=}")
        
        # get Rendering Provider NPI
        rp_npi_set = set()
        for claim in records_dict.get('transaction_sets', [])[0].get('claims'):
            rp_npi_set.add(
                next(entity for entity in claim.get('entities') if entity.get('_entity')=='rendering provider').get("identification_code")
            )
        assert len(rp_npi_set) == 1, "Error: Multiple NPIs in transaction set/file."
        provider_npi ,= rp_npi_set
        assert len(provider_npi) == 10, "Error: NPI not 10 digits."

        # get payment method
        payment_method = records_dict.get('transaction_sets', [])[0].get('financial_information').get('_payment_method')

        records = records.to_dataframe()
        records = records.where(pd.notnull(records), None).fillna("").to_dict('records')

        logger.info(f"{records=}")

        # this thing saves the ids of inserted rows in db
        new_records = {}
        for record in records:
            query = f"""INSERT INTO {rds_db}.era 
                (claims_number, patient_name, procedure_code, modifier, qualifier, allowed_units, billed_units, transaction_date, 
                charge_amount, allowed_amount, paid_amount, payer_name, provider_name, 
                file_upload_id, provider_npi, payment_type,
                created_on, created_by)
                VALUES 
                ('{record.get('marker', '')}', '{record.get('patient', '')}', '{record.get('code', '')}', '{record.get('modifier', '')}', 
                '{record.get('qualifier', '')}', '{record.get('allowed_units', '')}', '{record.get('billed_units', '')}', 
                '{record.get('transaction_date', '')}', '{record.get('charge_amount', '')}', '{record.get('allowed_amount', '')}', 
                '{record.get('paid_amount', '')}', '{record.get('payer', '')}', '{record.get('rendering_provider', '')}', 
                '{file_upload_id}', '{provider_npi}', '{payment_method}',
                NOW(), '{user}');"""
            _ = db_query(query=query)
            last_insert_id = db_query('SELECT LAST_INSERT_ID();')[0][0]
            
            new_records[last_insert_id] = []
            i = 0

            # make sure mappings are in lambda layer            
            with open('/opt/python/claim_adj_group_codes.json') as f:
                group_codes = json.load(f)
            with open('/opt/python/claim_adj_reason_codes.json') as f:
                reason_codes = json.load(f)

            while f'adj_{i}_amount' in record:
                adjustment_reason_code = ""
                adjustment_reason_description = ""

                adj_group = record.get(f'adj_{i}_group', '')
                if adj_group != "":
                    adjustment_reason_code += adj_group
                    adjustment_reason_description += group_codes.get(adj_group, '')

                adj_code = record.get(f'adj_{i}_code', '')
                if adj_code != "":
                    if adjustment_reason_code != "":
                        adjustment_reason_code += "-"
                    adjustment_reason_code += adj_code
                    adj_code_des = reason_codes.get(adj_code, '')
                    if adj_code_des != "":
                        if adjustment_reason_description != "":
                            adjustment_reason_description += ": "
                        adjustment_reason_description += adj_code_des

                # print(f"{record.get(f'adj_{i}_amount', '')=}")
                if adjustment_reason_code != "" and record.get(f'adj_{i}_amount', '') != "":
                    _ = db_query(f"""INSERT INTO {rds_db}.adjustment
                            (adjustment_amount, adjustment_reason_code, adjustment_reason_description, era_id, created_on, created_by)
                            VALUES
                            ('{record.get(f'adj_{i}_amount', '')}', 
                            '{adjustment_reason_code}', '{adjustment_reason_description}',
                            '{last_insert_id}', NOW(), '{user}'); """
                    )
                    last_insert_id2 = db_query('SELECT LAST_INSERT_ID();')[0][0]
                    new_records[last_insert_id].append(last_insert_id2)

                i += 1
            
        # call AWS Batch - make sure permissions in template.yml

        batch = boto3.client('batch')
        _ = batch.submit_job(
                jobName=f'era-{file_upload_id}',
                jobQueue='beats-bulk-era-queue',
                jobDefinition='beats-bulk-era-job',
                containerOverrides={
                    "environment": [
                        {"name": "FILE_UPLOAD_ID", "value": str(file_upload_id)},
                        {"name": "REGION", "value": region},
                        {"name": "ACCESS_KEY", "value": accessKeyId},
                        {"name": "SECRET_KEY", "value": secretAccessKey}
                    ]
                })

        _ = db_query(query=f"""UPDATE {rds_db}.file_upload
                SET file_processing_status = 'Completed'
                WHERE file_upload_id = {file_upload_id};""")

        print("*** Complete! ***")

    except Exception as exp:
        exception_type, exception_value, exception_traceback = sys.exc_info()
        traceback_string = traceback.format_exception(exception_type, exception_value, exception_traceback)
        err_msg = json.dumps({
            "errorType": exception_type.__name__,
            "errorMessage": str(exception_value),
            "stackTrace": traceback_string
        })
        logger.error(err_msg)

        _ = db_query(query=f"""UPDATE {rds_db}.file_upload
                SET 
                file_processing_status = 'Failed'
                WHERE file_upload_id = {file_upload_id};""")