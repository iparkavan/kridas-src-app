import pandas as pd
from sqlalchemy import *
import sqlalchemy
import pymysql
import boto3
import os
import numpy
import logging

BATCH_SIZE=100

def main():

    aws_access_key_id = os.environ['ACCESS_KEY']
    aws_secret_access_key = os.environ['SECRET_KEY']
    region_name = os.environ['REGION']
    file_upload_id = os.environ['FILE_UPLOAD_ID']

    ssm = boto3.client("ssm", region_name=region_name, aws_access_key_id=aws_access_key_id,
                       aws_secret_access_key=aws_secret_access_key)
    rds_host = ssm.get_parameter(Name="RDS_HOSTNAME")["Parameter"]["Value"]
    name = ssm.get_parameter(Name="RDS_USERNAME")["Parameter"]["Value"]
    password = ssm.get_parameter(Name="RDS_PASSWORD")["Parameter"]["Value"]
    db_name = ssm.get_parameter(Name="RDS_DATABASE")["Parameter"]["Value"]
    port = ssm.get_parameter(Name="RDS_PORT")["Parameter"]["Value"]
    
    global uri,conn
    uri = 'mysql+pymysql://%s:%s@%s:%s/%s' % (
        name, password, rds_host, port, db_name)

    engine = sqlalchemy.create_engine(uri)
    conn = engine.connect()
    all_era = conn.execute("SELECT * FROM era WHERE file_upload_id='%s'" % file_upload_id).all()
    era_claims_number = []
    era_procedure_code = []

    for i in range(len(all_era)):
        era_claims_number.append(str(all_era[i][1]))
        era_procedure_code.append(str(all_era[i][3]))
    
    print("ERA Claims number: %s" % era_claims_number)
    print("ERA Procedure Code: %s" % era_procedure_code)

    claims_id= conn.execute("Select patient_claims_id from patient_claims where claim_number in ('%s')"
        % ','.join(era_claims_number)).all()
    patient_claims_id=[]
    for i in range(len(claims_id)):
        patient_claims_id.append(str(claims_id[i][0]))
    
    print("Patients Claims: %s" % patient_claims_id)

    #update claims_procedure table
    for i in range((len(patient_claims_id)//BATCH_SIZE)+1):
        if len(patient_claims_id)-i*BATCH_SIZE>BATCH_SIZE:
            temp_patient_claims_id=patient_claims_id[i*BATCH_SIZE:i*BATCH_SIZE+BATCH_SIZE]
            conn.execute("UPDATE claims_procedure SET era_matched = 'Y' WHERE patient_claims_id IN ('%s') AND procedure_code IN ('%s')" 
                % ('\',\''.join(temp_patient_claims_id),'\',\''.join(era_procedure_code)))
            print("Temp claims %s : %s "% (i,temp_patient_claims_id))
        else:
            temp_patient_claims_id=patient_claims_id[i*BATCH_SIZE:len(era_procedure_code)]
            conn.execute("UPDATE claims_procedure SET era_matched = 'Y' WHERE patient_claims_id IN ('%s') AND procedure_code IN ('%s')" 
                % ('\',\''.join(patient_claims_id),'\',\''.join(era_procedure_code)))
            print("Updated patient claims: %s" % temp_patient_claims_id)
    
    #update era table
    for i in range((len(era_procedure_code)//BATCH_SIZE)+1):
        if len(era_procedure_code)-i*BATCH_SIZE>BATCH_SIZE:
            temp_era_procedure_code=era_procedure_code[i*BATCH_SIZE:i*BATCH_SIZE+BATCH_SIZE]
            conn.execute("UPDATE era e, patient_claims c, claims_procedure cp SET e.era_matched = 'Y' WHERE (cp.procedure_code in ('%s') and c.claim_number in ('%s') and cp.patient_claims_id = c.patient_claims_id and era_id <> 0);" 
                % ('\',\''.join(temp_era_procedure_code),'\',\''.join(era_claims_number)))
            print("Temp era procedure code %s : %s "% (i,temp_era_procedure_code))
        else:
            temp_era_procedure_code=era_procedure_code[i*BATCH_SIZE:len(era_procedure_code)]
            conn.execute("UPDATE era e, patient_claims c, claims_procedure cp SET e.era_matched = 'Y' WHERE (cp.procedure_code in ('%s') and c.claim_number in ('%s') and cp.patient_claims_id = c.patient_claims_id and era_id <> 0);" 
                % ('\',\''.join(era_procedure_code),'\',\''.join(era_claims_number)))
            print("Updated era: %s" % temp_era_procedure_code)


    era_adjustment=pd.read_sql("select b.patient_claims_id, c.adjustment_amount, c.adjustment_reason_code from era a, patient_claims b, adjustment c where a.claims_number = b.claim_number and a.era_id = c.era_id and a.file_upload_id='%s' AND a.era_matched='Y'"
         % file_upload_id,engine)

    patient_claims=pd.read_sql("SELECT patient_claims_id, deductible, coinsurance, copay, providers_writeoff FROM patient_claims WHERE patient_claims_id IN ('%s')" % ('\',\''.join(era_adjustment['patient_claims_id'].astype(str).to_list())),engine)

    era_adjustment_joined=era_adjustment.merge(patient_claims,how='left',on='patient_claims_id')
   
    era_adjustment_joined['deductible'] = era_adjustment_joined['deductible'].fillna(0)
    era_adjustment_joined['coinsurance'] = era_adjustment_joined['coinsurance'].fillna(0)
    era_adjustment_joined['copay'] = era_adjustment_joined['copay'].fillna(0)
    era_adjustment_joined['providers_writeoff'] = era_adjustment_joined['providers_writeoff'].fillna(0)

    #Accumulation logic
    temp_era_adj = pd.DataFrame(columns=['patient_claims_id','adjustment_amount','adjustment_reason_code','deductible','coinsurance','copay','providers_writeoff'])
    
    for index, row in era_adjustment_joined.iterrows():

        if row['patient_claims_id'] in temp_era_adj['patient_claims_id'].to_list():
            if row['adjustment_reason_code'] == 'PR-1':
                temp_era_adj.loc [ temp_era_adj['patient_claims_id'] == row['patient_claims_id'] , ['deductible'] ] += row['adjustment_amount']
            if row['adjustment_reason_code'] == 'PR-2':
                temp_era_adj.loc [ temp_era_adj['patient_claims_id'] == row['patient_claims_id'] , ['coinsurance'] ] += row['adjustment_amount']
            if row['adjustment_reason_code'] == 'PR-3':
                temp_era_adj.loc [ temp_era_adj['patient_claims_id'] == row['patient_claims_id'] , ['copay'] ] += row['adjustment_amount']
            if row['adjustment_reason_code'] == 'CO-45':
                temp_era_adj.loc [ temp_era_adj['patient_claims_id'] == row['patient_claims_id'] , ['providers_writeoff'] ] += row['adjustment_amount']

        else:
            temp_era_adj.loc[-1] = row
            temp_era_adj.index = temp_era_adj.index + 1
            temp_era_adj=temp_era_adj.sort_index()

    era_adjustment_joined=temp_era_adj
    era_adjustment_joined.drop('adjustment_reason_code', inplace=True, axis=1)
    era_adjustment_joined.drop('adjustment_amount', inplace=True, axis=1)
   
    print('After accumulation: %s' % era_adjustment_joined)

    #Format for insert into patient claims
    if not era_adjustment_joined.index.empty:

        print('After accumulation: %s' % era_adjustment_joined)

        for i in range((len(era_adjustment_joined.index) // BATCH_SIZE)+1):
            if len(era_adjustment_joined.index)-  i*BATCH_SIZE > BATCH_SIZE:
                temp_era_adjustment = era_adjustment_joined.iloc[i * BATCH_SIZE : i * BATCH_SIZE + BATCH_SIZE]
                temp_list ='%s' % temp_era_adjustment.values.tolist()
                for r in (("[", "("), ("]", ")")):
                    temp_list = temp_list.replace(*r)
                temp_list = temp_list[1:-1]
                conn.execute("INSERT INTO patient_claims (patient_claims_id, deductible, coinsurance, copay, providers_writeoff) VALUES %s ON DUPLICATE KEY UPDATE patient_claims_id=VALUES(patient_claims_id), deductible=VALUES(deductible), coinsurance=VALUES(coinsurance), copay=VALUES(copay), providers_writeoff=VALUES(providers_writeoff)" % temp_list)
                print("Temp claims %s : %s "% (i,temp_era_adjustment))

            else:
            
                temp_era_adjustment = era_adjustment_joined.iloc[i * BATCH_SIZE : len(era_adjustment_joined.index)]
                temp_list ='%s' % temp_era_adjustment.values.tolist()
                for r in (("[", "("), ("]", ")")):
                    temp_list = temp_list.replace(*r)
                temp_list = temp_list[1:-1]
            
                conn.execute("INSERT INTO patient_claims (patient_claims_id, deductible, coinsurance, copay, providers_writeoff) VALUES %s ON DUPLICATE KEY UPDATE patient_claims_id=VALUES(patient_claims_id), deductible=VALUES(deductible), coinsurance=VALUES(coinsurance), copay=VALUES(copay), providers_writeoff=VALUES(providers_writeoff)" % temp_list)
                print("Updated patient claims: %s" % temp_era_adjustment)
    else:
        print("No records to update!")


if __name__ == '__main__':
    main()
