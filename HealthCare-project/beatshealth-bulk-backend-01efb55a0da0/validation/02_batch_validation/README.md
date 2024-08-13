# Data validation for batch eligibility status and claim status

### Language: Python
### March 20, 2020

This program assumes that the input for validation is a `.csv` file. Please adapt as necessary in the context of the batch program, perhaps replace `read_csv()` with `DataFrame(List[List])`.

Inputs:
    - file_path: LOCAL file path, str
    - client_id: created_by column filter in payer-alias table, str
    - eligibility_claims_era: str {"eligibility", "claims", "era"}

### Design requirements

[Here](https://docs.google.com/spreadsheets/d/1_MuTMxhvykF2Aow6FAniy8uaIH3gsnBn/edit#gid=2147021972)