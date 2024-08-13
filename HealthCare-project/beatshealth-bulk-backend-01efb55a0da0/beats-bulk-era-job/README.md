Step 1:
Create a new file called Dockerfile.

Step 2:
Add the following to the Dockerfile

    FROM python:3.8-slim

    COPY requirements.txt .
    RUN python -m pip install -r requirements.txt

    COPY script.py .
    COPY README.md .

    WORKDIR /script
    COPY . /script

    CMD ["python", "script.py"]

Step 3:
docker build -t python-script:latest .


Step 4:
//DEV
aws ecr get-login-password --region us-east-2 --profile beats-bulk-dev | docker login --username AWS --password-stdin 519922284892.dkr.ecr.us-east-2.amazonaws.com

//UAT
aws ecr get-login-password --region us-east-2 --profile beats-bulk-uat | docker login --username AWS --password-stdin 982520066726.dkr.ecr.us-east-2.amazonaws.com

//PROD
aws ecr get-login-password --region us-east-2 --profile beats-bulk-prod | docker login --username AWS --password-stdin 823528597868.dkr.ecr.us-east-2.amazonaws.com

Step 5:
//DEV
docker tag python-script:latest 519922284892.dkr.ecr.us-east-2.amazonaws.com/beats-bulk-era-repo:latest

//UAT
docker tag python-script:latest 982520066726.dkr.ecr.us-east-2.amazonaws.com/beats-bulk-era-repo:latest

//PROD
docker tag python-script:latest 823528597868.dkr.ecr.us-east-2.amazonaws.com/beats-bulk-era-repo:latest

Step 6:
//DEV
docker push 519922284892.dkr.ecr.us-east-2.amazonaws.com/beats-bulk-era-repo:latest

//UAT
docker push 982520066726.dkr.ecr.us-east-2.amazonaws.com/beats-bulk-era-repo:latest

//PROD
docker push 823528597868.dkr.ecr.us-east-2.amazonaws.com/beats-bulk-era-repo:latest
