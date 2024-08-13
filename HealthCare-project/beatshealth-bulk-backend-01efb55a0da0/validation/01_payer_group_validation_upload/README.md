# Data Validation - Group and Payer Mapping

### Lambda 
- Name: `beats-bulk-group-payer-validation`
- Timeout: `5` min `0` sec
- Memory: `512` MB
- IAM Role: `beats-bulk-group-payer-validation-lambda-role`
    - Policies:
        - `AWSLambdaBasicExecutionRole`
        - `AWSLambdaSQSPollerExecutionRole`
        - `AmazonS3FullAccess`
        - `AmazonSSMReadOnlyAccess`
- Layers:
    - `arn:aws:lambda:us-east-2:770693421928:layer:Klayers-p38-pandas:1`
    - `arn:aws:lambda:us-east-2:770693421928:layer:Klayers-python38-openpyxl:9`
    - `arn:aws:lambda:us-east-2:770693421928:layer:Klayers-python38-PyMySQL:4`
- Tests:
    - `test-group-map-success`: tests group map validation, success case
    - `test-group-map`: tests group map validation, fail case
    - `test-payer-map-success`: tests payer map validation, success case
    - `test-payer-map`: tests group payer validation, fail case
- ⚠️ Open Issues :
    - `template.yml` is incomplete; unable to assign correct permissions to read receive sqs message


### SQS
- Name: `beats-bulk-mapping-sqs-dev`
- body: 
    - str: "payer-mapping/upload/admin123/PayerIDMapping.xlsx"


