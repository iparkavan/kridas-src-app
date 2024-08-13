
FROM python:3.8-slim

COPY requirements.txt .
RUN python -m pip install -r requirements.txt

COPY script.py .
COPY README.md .

WORKDIR /script
COPY . /script

CMD ["python", "script.py"]
