import moment from "moment";

export const ERA_DROPDOWN_DATA = [
    { 'value': 'claim_number', 'Label': 'Claim Number' },
    { 'value': 'patient_name', 'Label': 'Patient Name' },
    { 'value': 'procedure_code', 'Label': 'Procedure Code' },
    { 'value': 'transaction_date', 'Label': 'Transaction Date' },
    { 'value': 'payer_name', 'Label': 'Payer Name' },
    { 'value': 'provider_name', 'Label': 'Provider Name' },
    { 'value': 'era_matched', 'Label': 'ERA Matched' },
    { 'value': 'processed_date', 'Label': 'Processed Date' }
];

export const ERA_TABLE_COLUMNS = [
    {
        headerName: 'CLAIMS NUMBER',
        field: 'claims_number',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'PATIENT NAME',
        field: 'patient_name',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'PROCEDURE CODE',
        field: 'procedure_code',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'MODIFIER',
        field: 'modifier',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'QUALIFIER',
        field: 'qualifier',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'ALLOWED UNITS',
        field: 'allowed_units',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'BILLED UNITS',
        field: 'billed_units',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'TRANSACTION DATE',
        field: 'transaction_date',
        width: 200,
        renderCell: (params) => (
            <span>
                {params.value && moment(params.value).isValid() ? moment(params.value).format('MM/DD/YYYY') : ''}
            </span>
        ),
        align: 'left'
    },
    {
        headerName: 'CHARGED AMOUNT',
        field: 'charge_amount',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'ALLOWED AMOUNT',
        field: 'allowed_amount',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'PAID AMOUNT',
        field: 'paid_amount',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'PAYER NAME',
        field: 'payer_name',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'PROVIDER NAME',
        field: 'provider_name',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'ADJUSTMENT AMOUNT_0',
        field: 'adjustmentAmount0',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'ADJUSTMENT REASON CODE_0',
        field: 'adjustmentReason0',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'ADJUSTMENT REASON_0 DESCRIPTION',
        field: 'adjustmentDescription0',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'ADJUSTMENT AMOUNT_1',
        field: 'adjustmentAmount1',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'ADJUSTMENT REASON CODE_1',
        field: 'adjustmentReason1',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'ADJUSTMENT REASON_1 DESCRIPTION',
        field: 'adjustmentDescription1',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'ADJUSTMENT AMOUNT_2',
        field: 'adjustmentAmount2',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'ADJUSTMENT REASON CODE_2',
        field: 'adjustmentReason2',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'ADJUSTMENT REASON_2 DESCRIPTION',
        field: 'adjustmentDescription2',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'ADJUSTMENT AMOUNT_3',
        field: 'adjustmentAmount3',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'ADJUSTMENT REASON CODE_3',
        field: 'adjustmentReason3',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'ADJUSTMENT REASON_3 DESCRIPTION',
        field: 'adjustmentDescription3',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'USER ID',
        field: 'user_id',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'PROCESSED DATE',
        field: 'processed_date',
        width: 200,
        align: 'left'
    },
    {
        headerName: 'MATCHED TIMESTAMP',
        field: 'matched_timestamp',
        width: 200,
        renderCell: (params) => (
            <span>
                {params.value && moment(params.value).isValid() ? moment(params.value).format('MM/DD/YYYY') : ''}
            </span>
        ),
        align: 'left'
    },
    {
        headerName: 'ERA MATCHED',
        field: 'era_matched',
        width: 200,
        align: 'left'
    }
]