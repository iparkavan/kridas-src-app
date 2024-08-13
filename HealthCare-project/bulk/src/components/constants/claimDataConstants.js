import moment from 'moment';
export const DROPDOWN_DATA = [
    { 'value': 'from_date_of_service', 'Label': 'Date of Service' },
    { 'value': 'patient_name', 'Label': 'Patient Name' },
    { 'value': 'date_of_birth', 'Label': 'Date of Birth' },
    { 'value': 'member_id', 'Label': 'Member ID' },
    { 'value': 'service_name', 'Label': 'Service Type' },
    { 'value': 'payer_alias', 'Label': 'Payer Alias' },
    { 'value': 'payer_id', 'Label': 'External Payer ID' },
    { 'value': 'client_id', 'Label': 'Client ID' },
    { 'value': 'payer_alias_name', 'Label': 'Payer Name' },
    { 'value': 'claim_status', 'Label': 'Claim status' },
    { 'value': 'mrn_patient_account_no', 'Label': 'MRN / Patient Account #' },
    { 'value': 'group_name', 'Label': 'Group Name' },
    { 'value': 'provider_npi', 'Label': 'Rendering NPI' },
    { 'value': 'created_on', 'Label': 'Uploaded date' },
    { 'value': 'claim_number', 'Label': 'Claim Number' },
    { 'value': 'processing_status', 'Label': 'Processing Status' },
    { 'value': 'era_matched', 'Label': 'ERA Matched' }
];
export const TABLE_COLUMNS = [
    {
        headerName: 'PATIENT FIRST NAME',
        field: 'first_name',
        width: 200
    },
    {
        headerName: 'PATIENT LAST NAME',
        field: 'last_name',
        width: 200
    },
    {
        headerName: 'DATE OF BIRTH',
        field: 'date_of_birth',
        width: 200,
        renderCell: (params) => (
            <span>
                {params.value && moment(params.value).isValid() ? moment(params.value).format('MM/DD/YYYY') : ''}
            </span>
        )
    },
    {
        headerName: 'FROM DATE OF SERVICE',
        field: 'from_date_of_service',
        width: 200,
        renderCell: (params) => (
            <span>
                {params.value && moment(params.value).isValid() ? moment(params.value).format('MM/DD/YYYY') : ''}
            </span>
        )
    },
    {
        headerName: 'TO DATE OF SERVICE',
        field: 'to_date_of_service',
        width: 200,
        renderCell: (params) => (
            <span>
                {params.value && moment(params.value).isValid() ? moment(params.value).format('MM/DD/YYYY') : ''}
            </span>
        )
    },
    {
        headerName: 'MRN/PATIENT ACCOUNT#',
        field: 'mrn_patient_account_no',
        width: 200
    },
    {
        headerName: 'PAYER ALIAS',
        field: 'payer_alias',
        width: 200
    },
    {
        headerName: 'EXTERNAL PAYER ID',
        field: 'payer_id',
        width: 200
    },
    {
        headerName: 'SERVICE TYPE',
        field: 'service_type_id',
        width: 200
    },
    {
        headerName: 'MEMBER ID',
        field: 'member_id',
        width: 200
    },
    {
        headerName: 'RENDERING NPI',
        field: 'provider_npi',
        width: 200
    },
    {
        headerName: 'CLIENT ID',
        field: 'client_id',
        width: 200
    },
    {
        headerName: 'PAYER NAME',
        field: 'external_payer_name',
        width: 200
    },
    {
        headerName: 'GROUP NAME',// no value
        field: 'group_name',
        width: 200
    },
    {
        headerName: 'PROCESSING STATUS',
        field: 'processing_status',
        width: 200
    },
    {
        headerName: 'UPLOAD DATE',
        field: 'created_on',
        width: 200,
        renderCell: (params) => (
            <span>
                {params.value && moment(params.value).isValid() ? moment(params.value).format('MM/DD/YYYY HH:mm:ss') : ''}
            </span>
        )
    },
    {
        headerName: 'LAST VERIFIED',
        field: 'modified_on',
        width: 200,
        renderCell: (params) => (
            <span>
                {params.value && moment(params.value).isValid() ? moment(params.value).format('MM/DD/YYYY') : ''}
            </span>
        )
    },
    {
        headerName: 'COMMENTS/RESONS',
        field: 'comments',
        width: 200
    },
    {
        headerName: 'BILLED CHARGES',
        field: 'claimed_amount',
        width: 200
    },
    {
        headerName: 'EFFECTIVE DATE',
        field: 'effective_date',
        width: 200,
        renderCell: (params) => (
            <span>
                {params.value && moment(params.value).isValid() ? moment(params.value).format('MM/DD/YYYY') : ''}
            </span>
        )
    },
    {
        headerName: 'ADJUDICATION DATE',
        field: 'adjudication_date',
        width: 200,
        renderCell: (params) => (
            <span>
                {params.value && moment(params.value).isValid() ? moment(params.value).format('MM/DD/YYYY') : ''}
            </span>
        )
    },
    {
        headerName: 'REMITTANCE DATE',
        field: 'remittance_date',
        width: 200,
        renderCell: (params) => (
            <span>
                {params.value && moment(params.value).isValid() ? moment(params.value).format('MM/DD/YYYY') : ''}
            </span>
        )
    },
    {
        headerName: 'ALLOWED AMOUNT',
        field: 'allowed_amount',
        width: 200
    },
    {
        headerName: 'PAID AMOUNT',
        field: 'paid_amount',
        width: 200
    },
    {
        headerName: 'DEDUCTIBLE',
        field: 'deductible',
        width: 200
    },
    {
        headerName: 'COINSURANCE',
        field: 'coinsurance',
        width: 200
    },
    {
        headerName: 'COPAY',
        field: 'copay',
        width: 200
    },
    {
        headerName: 'PROVIDERS WRITEOFF',
        field: 'providers_writeoff',
        width: 200
    },
    {
        headerName: 'CLAIM NUMBER',
        field: 'claim_number',
        width: 200
    },
    {
        headerName: 'CLAIM STATUS',
        field: 'claim_status',
        width: 200
    },
    {
        headerName: 'PROCEDURE CODE 0',
        field: 'procedureCode0',
        width: 200
    },
    {
        headerName: 'CHARGE AMOUNT 0',
        field: 'chargeAmount0',
        width: 200
    },
    {
        headerName: 'ALLOWED AMOUNT 0',
        field: 'allowedAmount0',
        width: 200
    },
    {
        headerName: 'PAID AMOUNT 0',
        field: 'paidAmount0',
        width: 200
    },
    {
        headerName: 'PROCEDURE CODE 1',
        field: 'procedureCode1',
        width: 200
    },
    {
        headerName: 'CHARGE AMOUNT 1',
        field: 'chargeAmount1',
        width: 200
    },
    {
        headerName: 'ALLOWED AMOUNT 1',
        field: 'allowedAmount1',
        width: 200
    },
    {
        headerName: 'PAID AMOUNT 1',
        field: 'paidAmount1',
        width: 200
    },
    {
        headerName: 'PROCEDURE CODE 2',
        field: 'procedureCode2',
        width: 200
    },
    {
        headerName: 'CHARGE AMOUNT 2',
        field: 'chargeAmount2',
        width: 200
    },
    {
        headerName: 'ALLOWED AMOUNT 2',
        field: 'allowedAmount2',
        width: 200
    },
    {
        headerName: 'PAID AMOUNT 2',
        field: 'paidAmount2',
        width: 200
    },
    {
        headerName: 'PROCEDURE CODE 3',
        field: 'procedureCode3',
        width: 200
    },
    {
        headerName: 'CHARGE AMOUNT 3',
        field: 'chargeAmount3',
        width: 200
    },
    {
        headerName: 'ALLOWED AMOUNT 3',
        field: 'allowedAmount3',
        width: 200
    },
    {
        headerName: 'PAID AMOUNT 3',
        field: 'paidAmount3',
        width: 200
    },
    {
        headerName: 'PROCEDURE CODE 4',
        field: 'procedureCode4',
        width: 200
    },
    {
        headerName: 'CHARGE AMOUNT 4',
        field: 'chargeAmount4',
        width: 200
    },
    {
        headerName: 'ALLOWED AMOUNT 4',
        field: 'allowedAmount4',
        width: 200
    },
    {
        headerName: 'PAID AMOUNT 4',
        field: 'paidAmount4',
        width: 200
    }

]
