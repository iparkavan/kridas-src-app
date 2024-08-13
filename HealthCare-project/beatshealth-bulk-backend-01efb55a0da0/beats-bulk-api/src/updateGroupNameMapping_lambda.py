import os
import sys
import json
import time
import boto3 
import datetime
import logging 
import traceback
import pandas as pd 

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):

    """Update/replace Group Mapping.
    Assumes Lambda proxy integration.
    
    """
    try:
        logger.info(f'event: {event}')

        # grab the user email id from cognito requestContext
        user = event.get("requestContext").get("authorizer").get("claims").get("email")

        # grab the body of the event 
        event_body = json.loads(event.get("body"))
        groupNameMapping = event_body.get("mapping")

        groupNameMapping_df = pd.DataFrame(groupNameMapping)
        groupNameMapping_columns = ['Client ID', 'Client Name', 'Group Name', 'Provider NPI', 'Billing NPI']
        groupNameMapping_df.columns = groupNameMapping_columns 
        groupNameMapping_df.to_excel("/tmp/bulk.xlsx", index=False) 
        
        path = f"group-mapping/upload/{user}/GroupNameMapping.xlsx"

        s3 = boto3.client("s3")
        ssm = boto3.client("ssm")
        s3_bucket = ssm.get_parameter(Name="S3_BUCKET_NAME")["Parameter"]["Value"]
        s3.upload_file("/tmp/bulk.xlsx", s3_bucket, path) 

        sqs_queue_name = ssm.get_parameter(Name="MAPPING_QUEUE")["Parameter"]["Value"].split("/")[-1]
        sqs = boto3.resource('sqs')
        queue = sqs.get_queue_by_name(QueueName=sqs_queue_name)
        res = queue.send_message(MessageBody=path)

        out_dict = {}
        responceObject = {}

        if "MessageId" in res:
            responceObject["statusCode"] = "200"
            out_dict["status"] = "Group Name Mapping changes submitted. "
        else:
            out_dict = {}
            responceObject["statusCode"] = "400"
            out_dict["status"] = "Error"
            out_dict["errorMessage"] = "Invalid request."
            
        responceObject["headers"] = {}
        responceObject["headers"]["Content-Type"] = "application/json"
        responceObject["body"] = json.dumps(out_dict)
        logger.info(f'responceObject: {responceObject}')

        # Return responce object and terminate
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
