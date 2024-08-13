import os
import re
import sys
import json
import time
import boto3 
import pymysql
import datetime
import logging 
import traceback

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):

    """
    Grabs bulk patient level data for eligibility    
    """

    try:

        # Set up
        cloudformation = boto3.client('cloudformation')
        cf_exports = cloudformation.list_exports()
        api_url = [export.get('Value') for export in cf_exports.get("Exports") if export.get("Name")=='beats-bulk-api'][0]

        # unpack event
        logger.info(f'event: {event}')
        transaction_id = event.get('pathParameters').get("transaction_id")
        patient_id = event.get('pathParameters').get("patient_id")

        if patient_id != "all":
            assert patient_id.isdigit(), f"Given patient_id invalid, {patient_id=}, {type(patient_id)=}. "

        user = event.get("requestContext").get("authorizer").get("claims").get("email")

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

                return cur.fetchall(), [i[0] for i in cur.description]

        """
        1. Check whether the file_upload_id and the Authentication Token matches the same user email
            - SELECT file_upload_id, file_processing_status, file_type, widget_name, created_on, created_by 
              FROM {rds_db}.file_upload 
              WHERE file_upload_id = {transaction_id};
        2. If not, then throw error
        3. If so, return 
        
        """
        
        # 1. Check whether the file_upload_id and the Authentication Token matches the same user email

        transaction_details, _ = db_query(query=f"""SELECT 
                    file_processing_status, file_type, widget_name, created_on, created_by 
                FROM {rds_db}.file_upload 
                WHERE file_upload_id = {transaction_id};""") 
                
        # grab and unpack first item of tuple of tuples, should only be ((x1, x2, ...),)
        file_processing_status, file_type, widget_name, created_on, created_by = transaction_details[-1]

        # 2. If not, then throw error

        if user != created_by:

            # this transaction_id/file_upload_id does not belong to the sender
            out_dict = {}
            out_dict["status"] = "Error"
            out_dict["errorMessage"] = "Invalid request." # "Transaction ID and authentication token mismatch. "

            responceObject = {}
            responceObject["statusCode"] = "400"
            responceObject["headers"] = {}
            responceObject["headers"]["Content-Type"] = "application/json"
            # note that JSON requires `dumps` in the responce
            responceObject["body"] = json.dumps(out_dict)
            logger.info(f'responceObject: {responceObject}')

            # Return responce dict and terminate
            return responceObject

        # 3. If so, grab all patients and patient_claimns under that transaction_id

        filter_by_patient_eligibility_id = "" if patient_id == "all" else f"AND pc.patient_eligibility_id = {patient_id}"

        patient_details, col_names = db_query(query=f"""SELECT 
            pc.patient_eligibility_id AS 'PATIENT ID',
            first_name AS 'PATIENT FIRST NAME',
            last_name AS 'PATIENT LAST NAME',
            DATE_FORMAT(date_of_birth, '%m/%d/%Y') AS 'DATE OF BIRTH',
            DATE_FORMAT(from_date_of_service, '%m/%d/%Y') AS 'FROM DATE OF SERVICE',
            DATE_FORMAT(to_date_of_service, '%m/%d/%Y') AS 'TO DATE OF SERVICE',
            mrn_patient_account_no AS 'MRN',
            pc.payer_alias AS 'PAYER ALIAS',
            st.service_type_name AS 'SERVICE TYPE',
            member_id AS 'MEMBER ID',
            pc.provider_npi AS 'RENDERING NPI',
            gmp.billing_npi AS 'BILLING NPI',
            pc.client_id AS 'CLIENT ID',
            relationship_to_subscriber AS 'RELATIONSHIP TO SUBSCRIBER',
            pm.external_payer_name AS 'PAYER NAME',
            payer_id AS 'EXTERNAL PAYER ID',
            p.eligibility_status AS 'ELIGIBILITY STATUS',
            p.copay AS 'COPAY',
            p.coinsurance AS 'COINSURANCE',
            p.deductible AS 'DEDUCTIBLE',
            p.limitations AS 'LIMITATIONS',
            p.out_of_pocket AS 'OUT_OF_POCKET',
            gm.group_name AS 'GROUP NAME',
            DATE_FORMAT(pc.created_on, '%m/%d/%Y') AS 'UPLOADED DATE',
            DATE_FORMAT(pc.modified_on, '%m/%d/%Y %H:%i:%S') AS 'LAST VERIFIED DATE',
            processing_status AS 'PROCESSING STATUS',
            pc.comments AS 'COMMENTS',
            pc.created_by AS 'USER ID'
        FROM
            {rds_db}.patient_eligibility pc
                LEFT JOIN
            {rds_db}.patient_insurance_records p ON p.patient_eligibility_id = pc.patient_eligibility_id
                LEFT JOIN
            {rds_db}.payer_alias pa ON pa.payer_alias_identifier = pc.payer_alias
                AND pa.created_by = '{user}'
                AND pc.delete_flag = 'N'
                LEFT JOIN
            {rds_db}.payer_mapping pm ON pm.claims_payer_id = pc.payer_id
                AND pm.payer_mapping_id = pa.payer_mapping_id
                LEFT JOIN
            {rds_db}.service_types st ON st.service_type_Id = pc.service_type_id
                LEFT JOIN
            {rds_db}.group_mapping gmp ON gmp.provider_npi = pc.provider_npi
                AND gmp.created_by = '{user}'
                LEFT JOIN
            {rds_db}.group_master gm ON gmp.group_master_id = gm.group_master_id
        WHERE
            pc.delete_flag = 'N'
                AND pc.created_by IN ('{user}')
                AND pc.file_upload_id = {transaction_id} {filter_by_patient_eligibility_id}; """)

        assert len(patient_details) > 0, "Transaction_id patient_id mismatch."
        
        snake_to_camel_case = lambda x: ''.join(word.title() for word in x.replace('/', ' ').replace('_', ' ').split(' '))
        lower_case_first_letter = lambda x: x[:1].lower() + x[1:] if x else ''
        col_names = [lower_case_first_letter(snake_to_camel_case(col_name)) for col_name in col_names]

        patient_details = [dict(zip(col_names, detail)) for detail in patient_details]

        out_dict = {}
        out_dict["transactionId"] = transaction_id 
        # out_dict["patients"] = {}
        # 
        # for detail in patient_details:
            # patient_id = list(detail.values())[0]
            # out_dict["patients"][patient_id] = dict(list(detail.items())[1:])
        out_dict["patients"] = patient_details

        responceObject = {}
        responceObject["statusCode"] = "200"
        responceObject["headers"] = {}
        responceObject["headers"]["Content-Type"] = "application/json"
        # note that JSON requires `dumps` in the responce
        responceObject["body"] = json.dumps(out_dict)
        logger.info(f'responceObject: {responceObject}')

        # Return responce dict & terminate
        return responceObject

    except Exception as exp:
        exception_type, exception_value, exception_traceback = sys.exc_info()
        traceback_string = traceback.format_exception(exception_type, exception_value, exception_traceback)
        err_msg = json.dumps({
            "errorType": exception_type.__name__,
            "errorMessage": str(exception_value),
            "stackTrace": traceback_string
        })
        logger.error(err_msg)

        out_dict = {}
        out_dict["status"] = "Error"
        out_dict["errorMessage"] = "Invalid request."
        responceObject = {}
        responceObject["statusCode"] = "400"
        responceObject["headers"] = {}
        responceObject["headers"]["Content-Type"] = "application/json"
        # note that JSON requires `dumps` in the responce
        responceObject["body"] = json.dumps(out_dict)
        logger.info(f'responceObject: {responceObject}')

        # Return responce object and  terminate
        return responceObject