let response;


let AWS = require("aws-sdk");
AWS.config.update({
    apiVersion: "2016-04-19",
    region: process.env.region,
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
});
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const util = require("util");
const mysql = require("mysql");

function makeDb(config) {
    const connection = mysql.createConnection(config);
    return {
        query(sql, args) {
            return util.promisify(connection.query).call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        },
    };
}


function getFormattedDate(dateFromDB) {
    if (dateFromDB != null && dateFromDB != undefined && dateFromDB != "") {
        const yyyy = new Date(dateFromDB).getFullYear();
        let mm = new Date(dateFromDB).getMonth() + 1; // Months start at 0!
        let dd = new Date(dateFromDB).getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return yyyy + '-' + mm + '-' + dd;
    }
    return null;
}

async function makeEntryToSQS(result, queueName) {
    for (var i = 0; i < result.length; i++) {
        const payload = {
            'patientFirstName': result[i].first_name,
            'patientLastName': result[i].last_name,
            'patientBirthDate': getFormattedDate(result[i].date_of_birth),
            'payerId': result[i].payer_id,
            'patientUniqueId': result[i].patient_unique_id,
            'serviceType': result[i].service_type_id,
            'memberId': result[i].member_id,
            'providerNpi': result[i].provider_npi,
            'from_date_of_service': getFormattedDate(result[i].from_date_of_service),
            'to_date_of_service': getFormattedDate(result[i].to_date_of_service),
            'mrn_patient_account_no': result[i].mrn_patient_account_no,
            'email_id': result[i].created_by,
            'record_type': result[i].record_type
        };
        var params = {
            DelaySeconds: 0,
            MessageBody: JSON.stringify(payload),
            QueueUrl: queueName
        };
        console.log(params);
        await sqs.sendMessage(params).promise();
    }
}

exports.handler = async (event) => {
    console.log("******Entering In Progress Schedule Lambda  ********");

    const db = makeDb({
        connectionLimit: 10,
        host: process.env.RDS_HOSTNAME,
        user: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        port: process.env.RDS_PORT,
        database: process.env.RDS_DATABASE,
    });

    try {

        var patientQuery = "SELECT * FROM patient where api_status IN ('In Progress')";
        var result = await db.query(patientQuery);
        console.log("Patient ID " + JSON.stringify(result));
        makeEntryToSQS(result, process.env.CLAIMS_EXTERNAL_API_INPUT_QUEUE);

        var patientEligibilityQuery = "SELECT * FROM patient_eligibility where api_status IN ('In Progress')";
        var eligibilityResult = await db.query(patientEligibilityQuery);
        console.log("Patient Eligibility ID " + JSON.stringify(eligibilityResult));
        makeEntryToSQS(eligibilityResult, process.env.AVAILITY_ELIGIBILITY_INPUT_SQS);
    }
    catch (err) {
        console.log("Error while processing In Progress schedule lambda", err);
    } finally {
        await db.close();
    }
};
