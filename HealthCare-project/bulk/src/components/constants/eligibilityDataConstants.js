import moment from 'moment';

export const ELIGIBILITY_DROPDOWN_DATA = [
    { 'value': 'from_date_of_service', 'Label': 'Date of Service' },
    { 'value': 'patient_name', 'Label': 'Patient Name' },
    { 'value': 'date_of_birth', 'Label': 'Date of Birth' },
    { 'value': 'member_id', 'Label': 'Member ID' },
    { 'value': 'service_name', 'Label': 'Service Type' },
    { 'value': 'payer_alias', 'Label': 'Payer Alias' },
    { 'value': 'payer_id', 'Label': 'External Payer ID' },
    { 'value': 'client_id', 'Label': 'Client ID' },
    { 'value': 'payer_alias_name', 'Label': 'Payer Name' },
    { 'value': 'mrn_patient_account_no', 'Label': 'MRN / Patient Account #' },
    { 'value': 'group_name', 'Label': 'Group Name' },
    { 'value': 'provider_npi', 'Label': 'Rendering NPI' },
    { 'value': 'created_on', 'Label': 'Uploaded date' },
    { 'value': 'processing_status', 'Label': 'Processing Status' }
];

export const ELIGIBILITY_TABLE_COLUMNS = [
    {
        headerName: 'PATIENT FIRST NAME',
        field: 'first_name',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'PATIENT LAST NAME',
        field: 'last_name',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'DATE OF BIRTH',
        field: 'date_of_birth',
        width: 200,
        renderCell: (params) => (
            <span>
                {params.value && moment(params.value).isValid() ? moment(params.value).format('MM/DD/YYYY') : ''}
            </span>
        ),
        align: 'left'
    },
    {
        headerName: 'FROM DATE OF SERVICE',
        field: 'from_date_of_service',
        width: 200,
        renderCell: (params) => (
            <span>
                {params.value && moment(params.value).isValid() ? moment(params.value).format('MM/DD/YYYY') : ''}
            </span>
        ),
        align: 'left'
    },
    {
        headerName: 'TO DATE OF SERVICE',
        field: 'to_date_of_service',
        width: 200,
        renderCell: (params) => (
            <span>
                {params.value && moment(params.value).isValid() ? moment(params.value).format('MM/DD/YYYY') : ''}
            </span>
        ),
        align: 'left'
    },
    {
        headerName: 'MRN/PATIENT ACCOUNT#',
        field: 'mrn_patient_account_no',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'PAYER ALIAS',
        field: 'payer_alias',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'SERVICE TYPE',
        field: 'service_type_id',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'MEMBER ID',
        field: 'member_id',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'RENDERING NPI',
        field: 'provider_npi',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'CLIENT ID',
        field: 'client_id',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'PAYER NAME',
        field: 'external_payer_name',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'EXTERNAL PAYER ID',
        field: 'payer_id',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'ELIGIBILITY STATUS',
        field: 'eligibility_status',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'GROUP NAME',// no value
        field: 'group_name',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'UPLOAD DATE',
        field: 'created_on',
        width: 200,
        renderCell: (params) => (
            <span>
                {params.value && moment(params.value).isValid() ? moment(params.value).format('MM/DD/YYYY HH:mm:ss') : ''}
            </span>
        ),
        align: 'left'
    },
    {
        headerName: 'LAST VERIFIED',
        field: 'modified_on',
        width: 200,
        renderCell: (params) => (
            <span>
                {params.value && moment(params.value).isValid() ? moment(params.value).format('MM/DD/YYYY') : ''}
            </span>
        ),
        align: 'left'
    },
    {
        headerName: 'PROCESSING STATUS',
        field: 'processing_status',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'COMMENTS/RESONS',
        field: 'comments',
        width: 200,
        align: 'left'
    }
 ]