import os
import sys
import json
import time
import boto3 
import requests
import datetime
import logging 
import traceback
import pandas as pd 

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):

    """Uploads bulk data for claims.
    Assumes Lambda proxy integration. 
    
    """
    try:
        logger.info(f'event: {event}')

        # set up (lambda proxy)
        cloudformation = boto3.client('cloudformation')
        cf_exports = cloudformation.list_exports()
        self_api_url = [export.get('Value') for export in cf_exports.get("Exports") if export.get("Name")=='beats-bulk-api'][0]
        print(f"{self_api_url=}")

        # headers are in the event
        token = event.get("headers").get("Authorization")
        # grab the user email id from cognito requestContext
        user = event.get("requestContext").get("authorizer").get("claims").get("email")

        # grab the body of the event 
        event_body = json.loads(event.get("body"))
        widget_name = event_body.get("widget_name")
        patients = event_body.get("patients")

        patient_count = len(patients)

        # build the excel file
        df_columns = ["Patient First Name",
                        "Patient Last Name",
                        "Date of Birth",
                        "From Date of Service",
                        "To Date of Service",
                        "MRN / Patient Account #",
                        "Payer ID",
                        "Service Type",
                        "Member ID",
                        "Rendering NPI",
                        "Client ID"]
        
        df = pd.DataFrame(patients)
        df.columns = df_columns
        df.to_excel("/tmp/bulk.xlsx", index=False) 

        ssm = boto3.client("ssm")
        s3 = boto3.client("s3")
        s3_bucket = ssm.get_parameter(Name="S3_BUCKET_NAME")["Parameter"]["Value"]
        timestamp = datetime.datetime.now().strftime("%m%d%Y_%H%M%S%f")
        out_dict_timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f %z')

        s3_bucket_uri = f"bulk-claims-upload/{user}/{timestamp}_bulk.xlsx"
        print(f"{s3_bucket=}, {s3_bucket_uri=}")
        s3.upload_file("/tmp/bulk.xlsx", s3_bucket, s3_bucket_uri) 

        def call_beats_bulk_job_submit_lambda_api(api_url, token, user, file_name, widget_name):
            headers = {"Authorization": token}
            payload = {
                "email": user,
                "file_path": f"bulk-claims-upload/{user}/{file_name}",
                "file_name": file_name,
                "widget_name": widget_name,
                "file_type": "claims"
                }
            print(f"{payload=}")
            r = requests.post(api_url, headers=headers, json=payload)

            if r.status_code==200:
                return r.json()
            else: 
                return r.status_code, r.text

        # Figure out the endpoint of the Lambda responsible for Bulk Upload
        # REACT_APP_BEATS_BULK_UPLOAD_QUEUE_NOTIFICATION DEV 
        apigateway = boto3.client('apigateway')
        apis = apigateway.get_rest_apis().get('items')
        apis = [api.get('id') for api in apis if api.get('name')=='bulkUpload']
        my_api_id = next(iter(apis), None)
        url_REACT_APP_BEATS_BULK_UPLOAD_QUEUE_NOTIFICATION = f"https://{my_api_id}.execute-api.us-east-2.amazonaws.com/bulkUpload/queueNotification" 

        # call
        res = call_beats_bulk_job_submit_lambda_api(url_REACT_APP_BEATS_BULK_UPLOAD_QUEUE_NOTIFICATION, token, user, f"{timestamp}_bulk.xlsx", widget_name) 
        print(f"{res=}")
        file_id = res["fileUploadId"]
        
        # status: “Processing” string
        # transactionId: BeatsBulkDev.file_upload.file_upload_id int
        # url: the URL to make the subsequent call to get the transaction string https://beatshealth.us/benefits/checkClaimStatus/<transactionId>/
        # patientCount: the item count int
        # timeSubmitted: datetime string

        # Construct the responce 
        out_dict = {}

        out_dict["status"] = "Processing"
        out_dict["transactionId"] = file_id # currently it's file_id, but it really should be some hash
        out_dict["url"] = f"{self_api_url}/benefits/checkClaimStatus/{file_id}"
        out_dict["patientCount"] = patient_count
        out_dict["timeSubmitted"] = out_dict_timestamp

        responceObject = {}
        responceObject["statusCode"] = "200"
        responceObject["headers"] = {}
        responceObject["headers"]["Content-Type"] = "application/json"
        # note that JSON requires `dumps` in the responce
        responceObject["body"] = json.dumps(out_dict)
        logger.info(f'responceObject: {responceObject}')

        # Return responce object and  terminate
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
