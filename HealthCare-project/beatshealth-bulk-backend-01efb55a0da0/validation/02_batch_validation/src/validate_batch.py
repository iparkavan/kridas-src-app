# batch validation script for Payer ID mapping validation
# benedict au, beats health
# march 2022

# keywords: medical billing, data validation, payer mapping

# this program assumes that the input for validation is a csv file. please adapt as necessary


import boto3 
import datetime
import pandas as pd

def validate_bulk(df, eligibility_claims_era):
        
        validation_matrix = []

        # first name
        validation_matrix.append( ["" if name and 1<len(name)<46 else "Missing First Name. " for name in df["Patient First Name"]] )
        
        # last name
        validation_matrix.append( ["" if name and 1<len(name)<46 else "Missing Last Name. " for name in df["Patient Last Name"]] )
        
        # dob
        _valid_dob = ( pd.to_datetime(pd.Timestamp(datetime.now() - relativedelta(years=120))) <  pd.to_datetime(df['Date of Birth'], format='%m/%d/%Y', errors="coerce") ) & \
                                    ( pd.to_datetime(df['Date of Birth'], format='%m/%d/%Y', errors="coerce") < pd.Timestamp(datetime.now()) )
        validation_matrix.append( ["" if i else "Invalid DOB: require MM/DD/YYYY < today. " for i in _valid_dob] )

        # dos
        _fdos = pd.to_datetime(df['From Date of Service'], format='%m/%d/%Y', errors="coerce")
        _valid_fdos = ~_fdos.isnull() & ( _fdos > pd.Timestamp(datetime.now() - relativedelta(years=120)) )
        _tdos = pd.to_datetime(df['To Date of Service'], format='%m/%d/%Y', errors="coerce")
        _valid_tdos = ~_tdos.isnull() & ( _tdos < pd.Timestamp(datetime.now() + relativedelta(years=10)) )
        validation_matrix.append( ["" if valid_fdos and valid_tdos and tdos >= fdos  \
                                   else "Invalid To/From DoS: MM/DD/YYYY and From DoS <= To DoS. "  \
                                   for valid_fdos, valid_tdos, fdos, tdos in zip(_valid_fdos, _valid_tdos, _fdos, _tdos)] )

        # payer id
        validation_matrix.append( ["" if payer_id and 1<len(payer_id)<46 else "Missing Payer ID. " for payer_id in df["Payer ID"]] )
        validation_matrix.append( ["" if payer_id in aliases else "Given Payer ID not mapped in mapping file. " for payer_id in df["Payer ID"]] )
        
        # service type
        validation_matrix.append( ["" if stype in valid_service_types else "Invalid Service Type. " for stype in df["Service Type"]] )

        # member id
        validation_matrix.append( ["" if member_id else "Missing Member ID. " for member_id in df["Member ID"]] )

        # provider npi
        validation_matrix.append( ["" if npi.isdigit() and len(npi)==10 else "Missing 10-digit NPI. " for npi in df["Provider NPI"]] )
        
        # client id
        validation_matrix.append( ["" if client_id else "Missing Client ID. " for client_id in df["Client ID"]] )

        # zip-a-dee-doo-dah 
        df["Errors"] = ["".join(x) for x in zip(*validation_matrix)]
        
        return df

def main(file_path: str, client_id: str, eligibility_claims_era: str) -> str:
    """Validate bulk file for eligibilty status and claim status.
    
    Inputs:
    - file_path: LOCAL file path <str>
    - client_id: created_by column filter in payer-alias table
    - eligibility_claims_era: {"eligibility", "claims", "era"}
    """

	df = pd.read_csv(file_path, dtype = str, keep_default_na=False)

	req_cols = ['Patient First Name',
	            'Patient Last Name',
	            'Date of Birth',
	            'From Date of Service',
	            'To Date of Service',
	            'MRN / Patient Account #',
	            'Payer ID',
	            'Service Type',
	            'Member ID',
	            'Provider NPI',
	            'Client ID']

	assert set(req_cols).issubset(set(df.columns)), "Bad file, missing required columns. "

	df = df.fillna("").apply(lambda x: x.str.strip())

	# if tDOS not given, default to fDOS
	df['To Date of Service'] = df['To Date of Service'].mask(df['To Date of Service'].eq(''),df['From Date of Service'])

    if eligibility_claims_era == "claims":
        # if service type not given, default to 30
	    df.loc[df["Service Type"] == "", 'Service Type'] = "30"

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

    valid_service_types = db_query(query=f"SELECT service_type_name FROM {rds_db}.service_types;")
    valid_service_types = [stype[0] for stype in valid_service_types]

    aliases = db_query(query=f"""SELECT payer_alias_identifier
                                    FROM {rds_db}.payer_alias 
                                    WHERE created_by='{client_id}';""")

    aliases = [alias[0] for alias in aliases]

	df = validate_bulk(df)

	# save it
	df.to_csv(file_path, index=False)

    return file_path




# if __name__ == "__main__":
#     main()


