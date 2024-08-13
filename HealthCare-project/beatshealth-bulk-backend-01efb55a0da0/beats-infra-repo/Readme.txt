//For Dev Environment-AWS ECR creation

aws cloudformation deploy --template-file ecr.yaml --stack-name beats-bulk-upload-job --profile beats-bulk-dev --region us-east-2

aws cloudformation delete-stack --stack-name beats-bulk-upload-job --profile beats-bulk-dev --region us-east-2

aws cloudformation deploy --template-file ecr_era.yaml --stack-name beats-bulk-era-repo --profile beats-bulk-dev --region us-east-2

aws cloudformation delete-stack --stack-name beats-bulk-era-repo --profile beats-bulk-dev --region us-east-2




//For UAT Environment-AWS ECR creation

aws cloudformation deploy --template-file ecr.yaml --stack-name beats-bulk-upload-job --profile beats-bulk-uat --region us-east-2

aws cloudformation delete-stack --stack-name beats-bulk-upload-job --profile beats-bulk-uat --region us-east-2

aws cloudformation deploy --template-file ecr_era.yaml --stack-name beats-bulk-era-repo --profile beats-bulk-uat --region us-east-2

aws cloudformation delete-stack --stack-name beats-bulk-era-repo --profile beats-bulk-uat --region us-east-2




//For PROD Environment-AWS ECR creation

aws cloudformation deploy --template-file ecr.yaml --stack-name beats-bulk-upload-job --profile beats-bulk-prod --region us-east-2

aws cloudformation delete-stack --stack-name beats-bulk-upload-job --profile beats-bulk-prod --region us-east-2

aws cloudformation deploy --template-file ecr_era.yaml --stack-name beats-bulk-era-repo --profile beats-bulk-prod --region us-east-2

aws cloudformation delete-stack --stack-name beats-bulk-era-repo --profile beats-bulk-prod --region us-east-2






//For Dev Environment Bulk Upload Job-AWS Batch creation

aws cloudformation deploy --template-file beats-bulk-aws-batch-fargate.yml --stack-name beats-bulk-aws-batch-fargate --capabilities CAPABILITY_NAMED_IAM --parameter-overrides VpcId=vpc-05d8943a972bebaaa SubnetIds=subnet-0f4942bb876211e25,subnet-0bca6f108d367b9cb --profile beats-bulk-dev --region us-east-2

aws cloudformation delete-stack --stack-name beats-bulk-aws-batch-fargate --profile beats-bulk-dev --region us-east-2




//For UAT Environment Bulk Upload Job-AWS Batch creation

aws cloudformation deploy --template-file beats-bulk-aws-batch-fargate-uat.yml --stack-name beats-bulk-aws-batch-fargate-uat --capabilities CAPABILITY_NAMED_IAM --parameter-overrides VpcId=vpc-050935fe063eacf0d SubnetIds=subnet-0e4ffd173a2324088,subnet-0db3fe7b60b06c178 --profile beats-bulk-uat --region us-east-2

aws cloudformation delete-stack --stack-name beats-bulk-aws-batch-fargate-uat --profile beats-bulk-uat --region us-east-2


//For PROD Environment Bulk Upload Job-AWS Batch creation

aws cloudformation deploy --template-file beats-bulk-aws-batch-fargate-prod.yml --stack-name beats-bulk-aws-batch-fargate-prod --capabilities CAPABILITY_NAMED_IAM --parameter-overrides VpcId=vpc-0af0b679b40202891 SubnetIds=subnet-02ac39df0f9e4fc53,subnet-08b308df56451a14a --profile beats-bulk-prod --region us-east-2

aws cloudformation delete-stack --stack-name beats-bulk-aws-batch-fargate-prod --profile beats-bulk-prod --region us-east-2



//For Dev Environment-ERA Job Creation

aws cloudformation deploy --template-file beats-bulk-aws-era-fargate.yml --stack-name beats-bulk-era-fargate --capabilities CAPABILITY_NAMED_IAM --parameter-overrides VpcId=vpc-05d8943a972bebaaa SubnetIds=subnet-0f4942bb876211e25,subnet-0bca6f108d367b9cb --profile beats-bulk-dev --region us-east-2

aws cloudformation delete-stack --stack-name beats-bulk-era-fargate --profile beats-bulk-dev --region us-east-2



//For UAT Environment-ERA Job Creation

aws cloudformation deploy --template-file beats-bulk-aws-era-fargate-uat.yml --stack-name beats-bulk-era-fargate-uat --capabilities CAPABILITY_NAMED_IAM --parameter-overrides VpcId=vpc-050935fe063eacf0d SubnetIds=subnet-0e4ffd173a2324088,subnet-0db3fe7b60b06c178 --profile beats-bulk-uat --region us-east-2

aws cloudformation delete-stack --stack-name beats-bulk-era-fargate-uat --profile beats-bulk-uat --region us-east-2



//For PROD Environment-ERA Job Creation

aws cloudformation deploy --template-file beats-bulk-aws-era-fargate-prod.yml --stack-name beats-bulk-era-fargate-prod --capabilities CAPABILITY_NAMED_IAM --parameter-overrides VpcId=vpc-0af0b679b40202891 SubnetIds=subnet-02ac39df0f9e4fc53,subnet-08b308df56451a14a --profile beats-bulk-prod --region us-east-2

aws cloudformation delete-stack --stack-name beats-bulk-era-fargate-prod --profile beats-bulk-prod --region us-east-2

