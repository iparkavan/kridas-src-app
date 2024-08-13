#!/usr/bin/env python
import pandas as pd
from sqlalchemy import *
import sqlalchemy
import pymysql
import csv
import boto3
import os
import sys
import json
from uuid import uuid4
import datetime
import numpy
import logging
import traceback
import io
from xlsx2csv import Xlsx2csv

logging.basicConfig(level=logging.INFO)


def save_patient_details(table_name, uri, formated_file):
    try:
        df = formated_file
        df.to_sql(table_name, con=uri, if_exists='append', index=False)
        logging.info("Saved patient details.")
    except Exception as error:
        logging.error("Unable to save patient details. ")
        logging.error(error)
        update_file_upload_processing_satus(uri, 'Failed','Unable to process', file_upload_id)
        #raise Exception(error)     
        exit()


def get_s3_Bucket_File(file_path, s3_bucket_name, aws_access_key_id, aws_secret_access_key, region_name):
    try:
        s3_client = boto3.client('s3', region_name=region_name,
                             aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)
        obj = s3_client.get_object(
            Bucket=s3_bucket_name,
            Key='%s' % file_path)
    except Exception as error:
        logging.error("File not found in s3. ")
        logging.error(error)   
        update_file_upload_processing_satus(uri,'Failed', 'Unable to process',  file_upload_id)
        #raise Exception(error)     
        exit()
    try:
        #Xlsx2csv(io.BytesIO(obj['Body'].read()), outputencoding="utf-8").convert("converted.csv")
        #data = pd.read_csv("converted.csv", keep_default_na=False)
        #data = pd.read_excel(io.BytesIO(
        #    obj['Body'].read()), keep_default_na=False)
        data = pd.read_excel(io.BytesIO(obj['Body'].read()))
        null_cells = pd.DataFrame(False, columns=data.columns, index=data.index)
        null_cells.iloc[:,2:5]=data.iloc[:,2:5].isnull()
        data = data.astype(str).mask(null_cells, numpy.NaN)
        duplictate_series=data.duplicated()
        data.columns= data.columns.str.lower()
    except Exception as error:
        logging.error("File uploaded is not an excel file. ")
        logging.error(error)   
        update_file_upload_processing_satus(uri, 'Failed', 'File type unsupported', file_upload_id)
        #raise Exception(error)     
        exit()
    logging.info("File read from s3 bucket.")
    return data,duplictate_series


def csv_formater(file_upload_id, file, email_id, file_type):
    try:
        df = file
        df.insert(1, column='patient_unique_id', value="")
        df['patient_unique_id'] = [uuid4() for _ in range(len(df.index))]
        df.loc[pd.notnull(pd.to_datetime(df['to date of service'],errors='coerce')),['to date of service']]=pd.to_datetime(df['to date of service'],errors='coerce').dt.strftime('%Y-%m-%d')
        df.loc[pd.notnull(pd.to_datetime(df['from date of service'],errors='coerce')),['from date of service']]=pd.to_datetime(df['from date of service'],errors='coerce').dt.strftime('%Y-%m-%d')
        df.loc[pd.notnull(pd.to_datetime(df['date of birth'],errors='coerce')),['date of birth']]=pd.to_datetime(df['date of birth'],errors='coerce').dt.strftime('%Y-%m-%d')
        #df['date of birth'] = pd.to_datetime(df['date of birth'], errors="coerce").dt.strftime("%Y-%m-%d")
        #df.loc[pd.notnull(pd.to_datetime(df['date of birth'], format='%m/%d/%Y', errors="coerce")), ['date of birth']] = pd.to_datetime(df['date of birth'], format='%m/%d/%Y', errors="coerce").dt.strftime("%Y-%m-%d")
        #df.loc[pd.notnull(pd.to_datetime(df['date of birth'], format='%d-%m-%Y', errors="coerce")), ['date of birth']] = pd.to_datetime(df['date of birth'], format='%d-%m-%Y', errors="coerce").dt.strftime("%Y-%m-%d")
        df.insert(9, column="record_type", value=file_type)
        df.insert(9, column="file_upload_id", value=file_upload_id)
        df.insert(11, column="created_by", value=email_id)
        df.insert(11, column="created_on",
                value=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        df.rename(columns={
            'patient first name': 'first_name',
            'patient last name': 'last_name',
            'date of birth': 'date_of_birth',
            'from date of service': 'from_date_of_service',
            'to date of service': 'to_date_of_service',
            'mrn / patient account #': 'mrn_patient_account_no',
            'payer id': 'payer_id',
            'service type': 'service_type_id',
            'member id': 'member_id',
            'rendering npi': 'provider_npi',
            'client id': 'client_id'},
            inplace=True)
        logging.info("File formated for saving.")
    except Exception as error:
        logging.error("Unable to format file. ")
        logging.error(error)   
        update_file_upload_processing_satus(uri, 'Failed', 'Processing Failed', file_upload_id)
        #raise Exception(error)     
        exit()
    return df


def format_send_sqs(formated_file, email_id, queue_url, aws_access_key_id, aws_secret_access_key, region_name):
    df = formated_file
    df.insert(9, column="email_id", value=email_id)
   
    df = df.loc[df['processing_status'] == 'In Progress']
    df.rename(columns={
        'first_name': 'patientFirstName',
        'last_name': 'patientLastName',
        'date_of_birth': 'patientBirthDate',
        'payer_id': 'payerId',
        'patient_unique_id': 'patientUniqueId',
        'service_type_id': 'serviceType',
        'member_id': 'memberId',
        'provider_npi': 'providerNpi',
        'from_date_of_service': 'from_date_of_service',
        'to_date_of_service': 'to_date_of_service',
        'mrn_patient_account_no': 'mrn_patient_account_no',
        'email_id': 'email_id',
    },
        inplace=True)

    df.drop(['created_on', 'created_by', 'payer_alias',
            'comments'], axis=1, inplace=True)
    
    #botocore_config = botocore.config.Config(max_pool_connections=1000)
    try:
        sqs_client = boto3.client('sqs', region_name=region_name,
                                  aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)

        df.apply(send_sqs, sqs_client=sqs_client, queue_url=queue_url, axis=1)
        logging.info("%s SQS Messages have been sent. " % str(df.shape[0]))
    except Exception as error:
        logging.error("Unable to send SQS. ")
        logging.error(error)   
        update_file_upload_processing_satus(uri,'Failed', 'Unable to process', file_upload_id)
        #raise Exception(error)     
        exit()
    #json_string = df.to_json(orient='records', default_handler=str)
    #logging.info("Before load")
    #json_list = json.loads(json_string)
    #logging.info("Formated file for SQS")
   # return json_list


def send_sqs(record, sqs_client, queue_url):
    
    json_string = record.to_json(default_handler=str)
    sqs_client.send_message(
        QueueUrl=queue_url,
        MessageBody=json.dumps(json.loads(json_string))
    )
   

def validate_file(file, uri, email_id, file_type, duplictate_series):
    df = file    
    df.insert(8, 'comments', value="")
    df.insert(8, 'processing_status', value="")
    df.insert(8, 'payer_alias', value="")
    df=df.replace("nan","")

    # get from database
    engine = sqlalchemy.create_engine(uri)
    conn = engine.connect()

    admin_email = list(numpy.concatenate(conn.execute(
        "SELECT created_by FROM users WHERE email='%s';" % email_id).fetchall()).flat)[0]

    
    claims_payer_ids_dict = {}
    eligibility_payer_ids_dict = {}    

    if file_type=="claims":
        claims_payer_ids_list = conn.execute("""SELECT t1.payer_alias_identifier, t2.claims_payer_id  
        FROM (SELECT payer_alias_identifier, payer_mapping_id FROM payer_alias 
            WHERE created_by="%s") as t1 ,
        (SELECT payer_mapping_id, claims_payer_id FROM payer_mapping where payer_mapping_id 
            IN (SELECT payer_mapping_id FROM payer_alias WHERE created_by="%s")) as t2 
        WHERE t1.payer_mapping_id = t2.payer_mapping_id;""" % (admin_email, admin_email)).fetchall()

        if claims_payer_ids_list:
            for i in range(len(claims_payer_ids_list)):
                claims_payer_ids_dict[claims_payer_ids_list[i]
                                  [0]] = claims_payer_ids_list[i][1]
    elif file_type=="eligibility":
        eligibility_payer_ids_list = conn.execute("""SELECT t1.payer_alias_identifier, t2.eligibility_payer_id  
        FROM (SELECT payer_alias_identifier, payer_mapping_id FROM payer_alias 
            WHERE created_by="%s") as t1 ,
        (SELECT payer_mapping_id, eligibility_payer_id FROM payer_mapping where payer_mapping_id 
            IN (SELECT payer_mapping_id FROM payer_alias WHERE created_by="%s")) as t2 
        WHERE t1.payer_mapping_id = t2.payer_mapping_id;""" % (admin_email, admin_email)).fetchall()

        if eligibility_payer_ids_list:
            for i in range(len(eligibility_payer_ids_list)):
                eligibility_payer_ids_dict[eligibility_payer_ids_list[i]
                                  [0]] = eligibility_payer_ids_list[i][1]

    service_type_ids_list = conn.execute(
        "SELECT service_type_id, service_type_name FROM service_types;").fetchall()

    service_type_ids_dict = {}
    if service_type_ids_list:
        for i in range(len(service_type_ids_list)):
            service_type_ids_dict[service_type_ids_list[i]
                                  [0]] = service_type_ids_list[i][1]

    all_service_type_id_2d_list = conn.execute(
        "SELECT service_type_name FROM service_types").fetchall()
    if bool(all_service_type_id_2d_list):
        all_service_type_id = list(numpy.concatenate(
            all_service_type_id_2d_list).flat)
        all_service_type_id = [str(a) for a in all_service_type_id]
    else:
        all_service_type_id = []

    all_payer_id_2d_list = conn.execute(
        "SELECT payer_alias_identifier FROM payer_alias WHERE created_by='%s';" % admin_email).fetchall()
    if bool(all_payer_id_2d_list):
        all_payer_id = list(numpy.concatenate(
            all_payer_id_2d_list).flat)
        all_payer_id = [str(a) for a in all_payer_id]
    else:
        all_payer_id = []

    all_client_id_2d_list = conn.execute(
        "SELECT client_id FROM client_master WHERE created_by='%s';" % admin_email).fetchall()
    if bool(all_client_id_2d_list):
        all_client_id = list(numpy.concatenate(
            all_client_id_2d_list).flat)
        all_client_id = [str(a) for a in all_client_id]
    else:
        all_client_id = []

    all_claims_enrollment_dict = {}
    all_eligibility_enrollment_dict = {}

    if file_type=="claims":
        all_claims_enrollment_list = conn.execute("""SELECT t1.payer_alias_identifier, t2.claims_enrollment_required
            FROM (SELECT payer_alias_identifier, payer_mapping_id FROM payer_alias 
	        WHERE created_by="%s") as t1 ,
            (SELECT payer_mapping_id, claims_enrollment_required FROM payer_mapping where payer_mapping_id 
	            IN (SELECT payer_mapping_id FROM payer_mapping)) as t2 
            WHERE t1.payer_mapping_id = t2.payer_mapping_id;""" % (admin_email)).fetchall()

        if all_claims_enrollment_list:
            for i in range(len(all_claims_enrollment_list)):
                all_claims_enrollment_dict[all_claims_enrollment_list[i]
                                        [0]] = all_claims_enrollment_list[i][1]
    elif file_type=="eligibility":
        all_eligibility_enrollment_list = conn.execute("""SELECT t1.payer_alias_identifier, t2.eligibility_enrollment_required
            FROM (SELECT payer_alias_identifier, payer_mapping_id FROM payer_alias 
	        WHERE created_by="%s") as t1 ,
            (SELECT payer_mapping_id, eligibility_enrollment_required FROM payer_mapping where payer_mapping_id 
	            IN (SELECT payer_mapping_id FROM payer_mapping)) as t2 
            WHERE t1.payer_mapping_id = t2.payer_mapping_id;""" % (admin_email)).fetchall()

        if all_eligibility_enrollment_list:
            for i in range(len(all_eligibility_enrollment_list)):
                all_eligibility_enrollment_dict[all_eligibility_enrollment_list[i]
                                        [0]] = all_eligibility_enrollment_list[i][1]

    all_provider_npi_2d_list = conn.execute(
        "SELECT provider_npi FROM group_mapping WHERE created_by='%s';" % admin_email).fetchall()
    if bool(all_provider_npi_2d_list):
        all_provider_npi = list(numpy.concatenate(
            all_provider_npi_2d_list).flat)
        all_provider_npi = [str(a) for a in all_provider_npi]
    else:
        all_provider_npi = []

    print("client id: ")
    print(all_client_id)
    print("payer_id: ")
    print(all_payer_id)
    print("Claims enrollment: ")
    print(all_claims_enrollment_dict)
    print("Eligibilty enrollment: ")
    print(all_eligibility_enrollment_dict)
    print("provider npi: ")
    print(all_provider_npi)

    #mark duplicates
    df.loc[duplictate_series ,['comments']] += "Duplicate Record. " 

    # first_name
    df.loc[(df['first_name'] == "") | (df['first_name'].str.strip() == "") | (
        df['first_name'].str.len() > 46), ['comments']] += "Missing 'patient first name'. "

    # last_name
    df.loc[(df['last_name'] == "") | (df['last_name'].str.strip() == "") | (
        df['last_name'].str.len() > 46), ['comments']] += "Missing 'patient last name'. "

    # date of birth
    #df.loc[pd.isnull(pd.to_datetime(df['date_of_birth'], format='%m/%d/%Y', errors="coerce")) | pd.notnull(pd.to_datetime(df['date_of_birth'], format='%m-%d-%Y', errors="coerce")),
    #       ['comments']] = df['comments'] + 'Missing or Invalid DOB: ' + df['date_of_birth'].astype(str).replace("", "empty") + '. '
    #df.loc[pd.isnull(pd.to_datetime(df['date_of_birth'], format='%m/%d/%Y',
    #                 errors="coerce")) == True, ['date_of_birth']] = numpy.NaN
    #df.loc[pd.notnull(pd.to_datetime(df['date_of_birth'], format='%m/%d/%Y', errors="coerce")), ['date_of_birth']
    #       ] = pd.to_datetime(df['date_of_birth'], format='%m/%d/%Y', errors="coerce").dt.strftime("%Y-%m-%d")
    #df.loc[pd.notnull(df['date_of_birth']) & (df['date_of_birth'] < pd.to_datetime(datetime.datetime.now() - datetime.timedelta(days=43800))) | (df['date_of_birth'] > pd.Timestamp(datetime.datetime.now())), ['comments']] = df['comments'] + 'Missing or Invalid DOB: require ' + pd.Timestamp(datetime.datetime.now() - datetime.timedelta(days=43800)).strftime("%Y-%m-%d") + ' > ' + df['date_of_birth'] + ' < ' + pd.Timestamp(datetime.datetime.now()).strftime("%Y-%m-%d") + '. '

    #df.loc[pd.isnull(pd.to_datetime(df['date_of_birth'],errors='coerce')) | (pd.to_datetime(df['date_of_birth'],errors='coerce') < pd.to_datetime(datetime.datetime.now() - datetime.timedelta(days=43800))) | 
    #    (pd.to_datetime(df['date_of_birth'],errors='coerce') > pd.Timestamp(datetime.datetime.now())), ['comments']] = df['comments'] + 'Missing or Invalid DOB: require ' + pd.Timestamp(datetime.datetime.now() - datetime.timedelta(days=43800)).strftime("%Y-%m-%d") + ' > ' + df['date_of_birth'].astype(str) + ' < ' + pd.Timestamp(datetime.datetime.now()).strftime("%Y-%m-%d") + '. '
    df.loc[pd.isnull(df['date_of_birth']),['comments']] = df['comments'] + 'Missing or Invalid DOB: Empty. '
    df.loc[pd.notnull(df['date_of_birth']) & (pd.isnull(pd.to_datetime(df['date_of_birth'],errors='coerce')) | (pd.to_datetime(df['date_of_birth'],errors='coerce') < pd.to_datetime(datetime.datetime.now() - datetime.timedelta(days=43800))) | 
        (pd.to_datetime(df['date_of_birth'],errors='coerce') > pd.Timestamp(datetime.datetime.now()))), ['comments']] = df['comments'] + 'Missing or Invalid DOB: require ' + pd.Timestamp(datetime.datetime.now() - datetime.timedelta(days=43800)).strftime("%Y-%m-%d") + ' > ' + df['date_of_birth'].astype(str) + ' < ' + pd.Timestamp(datetime.datetime.now()).strftime("%Y-%m-%d") + '. '
    df.loc[pd.isnull(pd.to_datetime(df['date_of_birth'], errors="coerce")), ['date_of_birth']] = numpy.NaN

    # fdos
    #df.loc[pd.isnull(pd.to_datetime(df['from_date_of_service'], format='%Y-%m-%d', errors="coerce")) == True,
    #       ['comments']] = df['comments'] + 'Missing or Invalid From DoS: ' + df['from_date_of_service'].astype(str).replace("", "empty").replace("nan", "empty") + '. '
    df.loc[pd.isnull(pd.to_datetime(df['from_date_of_service'], errors="coerce")),['comments']] = df['comments'] + 'Missing or Invalid From DoS: ' + df['from_date_of_service'].astype(str).replace("", "empty").replace("nan", "empty") + '. '
    #df.loc[pd.notnull(pd.to_datetime(df['from_date_of_service'],errors='coerce')),['from_date_of_service']]=pd.to_datetime(df['from_date_of_service'],errors='coerce').dt.strftime('%Y-%m-%d')
    df.loc[pd.isnull(pd.to_datetime(df['from_date_of_service'], errors="coerce")), ['from_date_of_service']] = numpy.NaN

    # tdos
    df.loc[pd.isnull(pd.to_datetime(df['to_date_of_service'],errors='coerce')), ['to_date_of_service']] = df['from_date_of_service']
    #df.loc[(pd.isnull(df['to_date_of_service']) == False) & (pd.isnull(df['from_date_of_service']) == False) & ((pd.to_datetime(df['from_date_of_service'], format='%Y-%m-%d', errors="coerce") < pd.to_datetime(pd.Timestamp(datetime.datetime.now() - datetime.timedelta(days=43800))))
    #       | (pd.to_datetime(df['to_date_of_service'], format='%Y-%m-%d', errors="coerce") > pd.to_datetime(pd.Timestamp(datetime.datetime.now() + datetime.timedelta(days=3650))))
    #       | ((pd.to_datetime(df['from_date_of_service'], format='%Y-%m-%d', errors="coerce") > (pd.to_datetime(df['to_date_of_service'], format='%Y-%m-%d', errors="coerce"))))), ['comments']] += "Invalid To/From DoS: MM/DD/YYYY and From DoS <= To DoS. "
    df.loc[(pd.isnull(df['to_date_of_service'])) | (pd.isnull(df['from_date_of_service'])) | ((pd.to_datetime(df['from_date_of_service'], errors="coerce") < pd.to_datetime(pd.Timestamp(datetime.datetime.now() - datetime.timedelta(days=43800))))
           | (pd.to_datetime(df['to_date_of_service'], errors="coerce") > pd.to_datetime(pd.Timestamp(datetime.datetime.now() + datetime.timedelta(days=3650))))
           | ((pd.to_datetime(df['from_date_of_service'], errors="coerce") > (pd.to_datetime(df['to_date_of_service'], errors="coerce"))))), ['comments']] += "Invalid To/From DoS: MM/DD/YYYY and From DoS <= To DoS. "

    #fdos
    if file_type=="claims":
        df.loc[pd.notnull(df['to_date_of_service']) & pd.notnull(df['from_date_of_service']) & (pd.to_datetime(df['to_date_of_service'], errors="coerce") - pd.to_datetime(df['from_date_of_service'], errors="coerce") > datetime.timedelta(days=90)), ['comments']] += "Invalid To/From DoS: Number of days between From and to date of service should be less than 90 days"
    
    
    if(file_type.__eq__("eligibility")): 
        df.loc[(df['service_type_id'] == "") | (df['service_type_id'].str.strip() == "") , ['comments']] += "Missing 'service type'. "
    
    
    # service type
    df.loc[ (df['service_type_id'].str.strip() != "") & (df['service_type_id'].isin(all_service_type_id) == False),
           ['comments']] += "Given service type is not configured. "

    # client id
    df.loc[(df['client_id'] == "") | (df['client_id'].str.strip() == "") | (df['client_id'].isin(
        all_client_id) == False), ['comments']] += "Missing client id or Given client id is not configured. "

    # payer id, member id, provider npi, claims enrollment required
    df = df.apply(validate_other_fields, all_payer_id=all_payer_id, claims_payer_ids_dict=claims_payer_ids_dict,
                            all_provider_npi=all_provider_npi, all_claims_enrollment_dict=all_claims_enrollment_dict, service_type_ids_dict=service_type_ids_dict
                            ,axis=1,file_type=file_type ,all_eligibility_enrollment_dict=all_eligibility_enrollment_dict
                            ,eligibility_payer_ids_dict=eligibility_payer_ids_dict)
    

    # processing status
    df.loc[(df['comments'] != ""), ['processing_status']] = "Validation Failed"
    df.loc[(df['comments'] == ""), ['processing_status']] = "In Progress"

    logging.info("File has been validated.")
    logging.info('Total Records: ' + str(df.shape[0]))

    return df


# payer id, member id, provider npi, claims enrollment required, service type
def validate_other_fields(val, all_payer_id, claims_payer_ids_dict, all_provider_npi, all_claims_enrollment_dict, service_type_ids_dict, eligibility_payer_ids_dict, all_eligibility_enrollment_dict,file_type):
    # payer id
    if val['payer_id'] not in all_payer_id or not 1 < len(str(val['payer_id'])) < 46:
        val['payer_alias'] = val['payer_id']
        val['payer_id'] = ""
        val['comments'] += 'Given payer id not mapped in mapping file. '
    elif val['payer_id'] in claims_payer_ids_dict.keys():
        val['payer_alias'] = val['payer_id']
        val['payer_id'] = claims_payer_ids_dict[val['payer_id']]
    elif val['payer_id'] in eligibility_payer_ids_dict.keys():
        val['payer_alias'] = val['payer_id']
        val['payer_id'] = eligibility_payer_ids_dict[val['payer_id']]
    else:
        val['payer_alias'] = val['payer_id']
        val['payer_id'] = ""

    # member id
    if not bool(val['member_id']):
        val['comments'] += 'Missing member id. '

    # claims enrollment
    if file_type=="claims":
        if val['payer_alias'] in all_claims_enrollment_dict.keys():
            if all_claims_enrollment_dict[val['payer_alias']] == "N/A":
                val['comments'] += 'Claims Verification not available for this payer id. '
            if all_claims_enrollment_dict[val['payer_alias']] == "Y":
                val['comments'] += 'Provider enrollment is required. '
    
    # eligibility enrollment
    elif file_type=="eligibility":
        if val['payer_alias'] in all_eligibility_enrollment_dict.keys():
            if all_eligibility_enrollment_dict[val['payer_alias']] == "N/A":
                val['comments'] += 'Eligibility Verification not available for this payer id. '
            if all_eligibility_enrollment_dict[val['payer_alias']] == "Y":
                val['comments'] += 'Provider enrollment is required. '

    # provider npi
    if (not val['provider_npi'].isdigit()) or (len(val['provider_npi']) != 10):
        val['comments'] += 'Missing or Invalid 10-digit NPI. '
    elif (val['provider_npi'] not in all_provider_npi):
        val['comments'] += 'Given Provider NPI is not configured '

    # service type
    if ((val['service_type_id'].strip() != "") and (val['service_type_id'] in (service_type_ids_dict.values()))):
        for key, value in service_type_ids_dict.items():
            if val['service_type_id'] == value:
                val['service_type_id'] = key

    return val


def intial_validation(file):
    try:
        df = file
        headers_list=['patient first name','patient last name','date of birth','from date of service','to date of service',\
            'mrn / patient account #','payer id','service type','member id','rendering npi','client id']
        pattern = '|'.join(headers_list)
        if df.columns.str.contains(pattern).all():
           pass
        else:
            raise Exception("Invalid Column Headers")
        logging.info("Inital validation passed")
    except Exception as error:
        logging.error(error)
        update_file_upload_processing_satus(uri, 'Failed', 'Invalid Column Headers', file_upload_id)
        #raise Exception(error)        
        exit()


def update_file_upload_processing_satus(uri, file_upload_processing_satus, comments, file_upload_id):
    engine = sqlalchemy.create_engine(uri)
    conn = engine.connect()
    r = conn.execute("UPDATE file_upload SET file_processing_status='%s',comments='%s' WHERE file_upload_id='%s'" % (
        file_upload_processing_satus, comments, file_upload_id))


def main():
    aws_access_key_id = os.environ['ACCESS_KEY']
    aws_secret_access_key = os.environ['SECRET_KEY']
    region_name = os.environ['REGION']

    ssm = boto3.client("ssm", region_name=region_name, aws_access_key_id=aws_access_key_id,
                       aws_secret_access_key=aws_secret_access_key)
    rds_host = ssm.get_parameter(Name="RDS_HOSTNAME")["Parameter"]["Value"]
    name = ssm.get_parameter(Name="RDS_USERNAME")["Parameter"]["Value"]
    password = ssm.get_parameter(Name="RDS_PASSWORD")["Parameter"]["Value"]
    db_name = ssm.get_parameter(Name="RDS_DATABASE")["Parameter"]["Value"]
    port = ssm.get_parameter(Name="RDS_PORT")["Parameter"]["Value"]
    s3_bucket_name = ssm.get_parameter(Name="S3_BUCKET_NAME")[
        "Parameter"]["Value"]
    queue_url = ssm.get_parameter(Name="CLAIMS_EXTERNAL_API_INPUT_QUEUE")[
        "Parameter"]["Value"]
    availity_eligibility_queue_url = ssm.get_parameter(Name="AVAILITY_ELIGIBILITY_INPUT_SQS")[
        "Parameter"]["Value"]
    
    global uri,file_upload_id
    uri = 'mysql+pymysql://%s:%s@%s:%s/%s' % (
        name, password, rds_host, port, db_name)

    # Argument values
    #file_upload_id=20
    #file_type="eligibility"
    #email_id="techraddy@gmail.com"
    #file_path = "bulk-eligibility-upload/techraddy@gmail.com/1652844032_EligibilityTest2.xlsx"
    #widget_name="test"

    file_upload_id = os.environ['FILE_UPLOAD_ID']
    file_path = os.environ['FILE_PATH']
    file_type = os.environ['FILE_TYPE']
    email_id = os.environ['EMAIL']
    #################

    try:
        file,duplicate_series = get_s3_Bucket_File(
            file_path, s3_bucket_name, aws_access_key_id, aws_secret_access_key, region_name)
        intial_validation(file)
        formated_file = csv_formater(file_upload_id, file, email_id, file_type)
        validated_file = validate_file(formated_file, uri, email_id, file_type, duplicate_series)
        table_name = 'patient_eligibility'
        if(file_type.__eq__("claims")):
            table_name = 'patient'
        save_patient_details(table_name, uri, validated_file)

        #json_list = sqs_formater(formated_file, email_id)
        if(file_type.__eq__("eligibility")):
            queue_url = availity_eligibility_queue_url
        
        format_send_sqs(validated_file, email_id, queue_url, aws_access_key_id,
                 aws_secret_access_key, region_name)
        logging.info("Task successfully completed.")
        update_file_upload_processing_satus(uri, 'Completed', '', file_upload_id)
    except Exception as exp:
        exception_type, exception_value, exception_traceback = sys.exc_info()
        logging.error("Task failed.")
        traceback_string = traceback.format_exception(
            exception_type, exception_value, exception_traceback)
        update_file_upload_processing_satus(uri, 'Failed', 'Unable to process', file_upload_id)
        exit()
        #raise Exception(exception_type.__name__, str(
        #    exception_value), traceback_string)


if __name__ == '__main__':
    main()