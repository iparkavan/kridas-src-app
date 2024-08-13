import os
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

    """Grabs transactional level data for claims
        
    """

    try:
            
        # Set up
        cloudformation = boto3.client('cloudformation')
        cf_exports = cloudformation.list_exports()
        api_url = [export.get('Value') for export in cf_exports.get("Exports") if export.get("Name")=='beats-bulk-api'][0]
        # the api_url should include the Stage name, not ending in / 

        # unpack event
        logger.info(f'event: {event}')
        transaction_id = event.get('pathParameters').get("transaction_id")

        # grab the user email id from cognito requestContext
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

                return cur.fetchall()

        # 1. Check whether the file_upload_id and the Authentication Token matches the same user email

        transaction_details = db_query(query=f"""SELECT 
                    file_processing_status, file_type, widget_name, created_on, created_by 
                FROM {rds_db}.file_upload 
                WHERE file_upload_id = {transaction_id};""") 
                
        # grab and unpack first item of tuple of tuples, should only be ((x1, x2, ...),)
        file_processing_status, file_type, widget_name, created_on, created_by = transaction_details[0]

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

        # 3. If so, get the list of patients

        patients = db_query(query=f"""SELECT 
                    first_name, last_name, date_of_birth, mrn_patient_account_no, processing_status, comments, patient_id
                FROM {rds_db}.patient
                WHERE file_upload_id = {transaction_id};""")

        if len(patients) != 0:

            # 4. Create a patients list object, inside, for each patient, 
            #     dict with the patient_id, first_name, last_name, dob, mrn, processing_status
            
            patients = [ [patient_id, first_name, last_name, dob.strftime("%m/%d/%Y"), mrn, processing_status, comments, f"{api_url}/benefits/checkClaimStatus/{transaction_id}/{patient_id}"]
                for first_name, last_name, dob, mrn, processing_status, comments, patient_id in patients]
            patient_dict_keys = ("patientId", "firstName", "lastName", "dob", "mrn", "status", "message", "url")
            patients = [dict(zip(patient_dict_keys, patient)) for patient in patients]

            # 5. Compute the counts for Complete, In Progress, Retry, Transaction failed, Validation failed, totalCount

            status_possible_values = ["Complete", "In Progress", "Retry", "Transaction Failed", "Validation Failed"]
            statuses = [patient.get("status", "") for patient in patients]
            summary = {status : statuses.count(status) for status in status_possible_values}
            summary["totalCount"] = len(statuses)

        else:
            print("len(patients) == 0!")
            patients = []
            status_possible_values = ["Complete", "In Progress", "Retry", "Transaction Failed", "Validation Failed"]
            statuses = []
            summary = {status : statuses.count(status) for status in status_possible_values}
            summary["totalCount"] = len(statuses)

        # Construct the responce 
        out_dict = {}

        out_dict["status"] = file_processing_status
        out_dict["transactionId"] = transaction_id 
        out_dict["widget_name"] = widget_name
        if len(patients) != 0:
            out_dict["summary"] = summary
            out_dict["patients"] = patients
        
        responceObject = {}
        responceObject["statusCode"] = "200"
        responceObject["headers"] = {}
        responceObject["headers"]["Content-Type"] = "application/json"
        # note that JSON requires `dumps` in the responce
        responceObject["body"] = json.dumps(out_dict)
        logger.info(f'responceObject: {responceObject}')

        # Return responce dict and terminate
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

        # Return responce object and terminate
        return responceObject