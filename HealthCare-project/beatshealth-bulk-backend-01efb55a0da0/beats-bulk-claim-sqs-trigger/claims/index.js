let response;


let AWS = require("aws-sdk");
AWS.config.update({
    apiVersion: "2016-04-19",
    region: process.env.region,
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
});

const util = require("util");
const mysql = require("mysql");
const axios = require('axios');
const CircularJSON = require("circular-json");

function currentDateTime() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + ' ' + time;
}

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

exports.handler = async (event) => {
    console.log("******Entering verifyClaims  ********");
    const body = JSON.parse(event.Records[0].body);
    console.log("event.body ::: ", body);

    const db = makeDb({
        connectionLimit: 10,
        host: process.env.RDS_HOSTNAME,
        user: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        port: process.env.RDS_PORT,
        database: process.env.RDS_DATABASE,
    });
    try {
        const params = new URLSearchParams();
        params.append('client_id', process.env.AVAILITY_CLIENT_ID);
        params.append('client_secret', process.env.AVAILITY_CLIENT_SECRET);
        params.append('grant_type', 'client_credentials');
        params.append('scope', 'hipaa');
        const userEmail = body['email_id'];
        const patient_unique_id = body['patientUniqueId'];
        let provider_npi = body['providerNpi'];

        var userQuery = "select role,created_by from users where email = '" + userEmail + "'";
        let userQueryResult = await db.query(userQuery);
        console.log("User Query Result " + userQueryResult[0].created_by);
        var adminUser = userQueryResult[0].created_by;

        let transactionURLFromDB = null;
        var patientQuery = "select transaction_id,payer_id,payer_alias,processing_status from patient where patient_unique_id = '" + patient_unique_id + "'";
        var result = await db.query(patientQuery);
        if (result && Object.keys(result).length > 0) {
            transactionURLFromDB = result[0].transaction_id;
            let payer_id = result[0].payer_id;
            let payer_alias = result[0].payer_alias;
            let processing_status = result[0].processing_status;
            console.log("Transaction URL from DB" + JSON.stringify(result));

            if (processing_status != "Complete") {
                var npiTypeQuery = " select npi_type,billing_npi from payer_alias A, payer_mapping B,group_mapping C where ";
                npiTypeQuery = npiTypeQuery + "A.payer_alias_identifier = '" + payer_alias + "' and B.claims_payer_id ='" + payer_id + "' and A.created_by ='" + adminUser + "'";
                npiTypeQuery = npiTypeQuery + " and C.provider_npi = '" + provider_npi + "' and A.created_by = C.created_by";
                var result = await db.query(npiTypeQuery);

                console.log("Billing NPI and NPI Type " + JSON.stringify(result));

                if ('BN' == result[0].npi_type) {
                    provider_npi = result[0].billing_npi;
                }

                const queryParams = {
                    'payer.id': body['payerId'],
                    'submitter.lastName': process.env.AVAILITY_SUBMITTER_LAST_NAME,
                    'submitter.id': process.env.AVAILITY_SUBMITTER_ID,
                    'providers.lastName': 'Lee',
                    'providers.npi': provider_npi,
                    'fromDate': body['from_date_of_service'],
                    'toDate': body['to_date_of_service'],
                    'subscriber.memberId': body['memberId'],
                    'patient.lastName': body['patientLastName'],
                    'patient.birthDate': body['patientBirthDate'],
                    'patient.firstName': body['patientFirstName']
                };

                console.log("queryParams " + JSON.stringify(queryParams));
                const tokenConfig = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };
                const externalTokenURL = process.env.AVAILITY_TOKEN_URL;
                const externalAPIURL = process.env.AVAILITY_CLAIM_STATUS_API;
                let claimResponse = {};
                const tokenResponse = await axios.post(externalTokenURL, params, tokenConfig)
                    .catch((error) => {
                        console.log("Error during token fetch " + error);
                    });
                console.log("Access Tokenss " + tokenResponse.data.access_token);
                let apiConfig = {
                    headers: { 'Authorization': 'Bearer ' + tokenResponse.data.access_token },
                    params: queryParams
                }
                let finalConfig = {
                    headers: { 'Authorization': 'Bearer ' + tokenResponse.data.access_token },
                }
                let apiResponse = {};
                let finalAPIURL = null;
                if (transactionURLFromDB == null || transactionURLFromDB == undefined
                    || transactionURLFromDB == "") {
                    apiResponse = await axios.get(externalAPIURL, apiConfig)
                        .catch((error) => {
                            console.log("Error during API Call " + JSON.stringify(error.response.data));
                            updateErrorComments(error, patient_unique_id, db);
                        });
                    console.log("API Responses " + CircularJSON.stringify(apiResponse));
                    if (apiResponse && Object.keys(apiResponse.data).length > 0) {
                        finalAPIURL = apiResponse.data.claimStatuses[0].links.self.href;
                    }
                } else {
                    finalAPIURL = transactionURLFromDB;
                }
                if (finalAPIURL != null && finalAPIURL != undefined && finalAPIURL != "") {
                    claimResponse = await axios.get(finalAPIURL, finalConfig)
                        .catch((error) => {
                            console.log("Error during Final API Call " + JSON.stringify(error.response.data));
                            updateErrorComments(error, patient_unique_id, db);
                        });
                    console.log("claimResponse: ", claimResponse);
                    let transactionURLFromAPI = null;
                    if (claimResponse && Object.keys(claimResponse).length > 0) {
                        claimResponse = claimResponse.data;
                        var processingStatus;
                        if (claimResponse.statusCode === "0") {
                            transactionURLFromAPI = claimResponse.links.self.href;
                            console.log("transactionURL" + transactionURLFromAPI);
                            processingStatus = "In Progress";
                        } else if (claimResponse.statusCode === "7") {
                            processingStatus = "Retry";
                        } else if (claimResponse.statusCode === "4") {
                            processingStatus = "Complete";
                        } else {
                            processingStatus = "Transaction Failed";
                        }
                        var patientQuery = "select patient_id from patient where patient_unique_id = '" + patient_unique_id + "'";
                        var result = await db.query(patientQuery);
                        console.log("Patient ID " + JSON.stringify(result));
                        var patient_id = result[0].patient_id;
                        console.log("Patient ID " + patient_id);
                        patientQuery = "update patient set relationship_to_subscriber=?, api_status=?, processing_status=?, modified_on=?,transaction_id=? where patient_id=?";
                        var patientParams = [claimResponse.patient.subscriberRelationship, claimResponse.status, processingStatus, currentDateTime(), transactionURLFromAPI, patient_id];
                        await db.query(patientQuery, patientParams);
                        let external_payer_id = claimResponse.payer.id;
                        let patientClaimsId;
                        if (claimResponse.claimStatuses && Object.keys(claimResponse.claimStatuses).length > 0 && processingStatus === "Complete") {
                            for (var i = 0; i < claimResponse.claimStatuses.length; i++) {
                                var claimStatus = claimResponse.claimStatuses[i].statusDetails[0];
                                var patientClaimsQuery = "insert into patient_claims SET ?";
                                var bindParams = {
                                    "patient_id": patient_id,
                                    "external_payer_id": external_payer_id,
                                    "claimed_amount": claimStatus.claimAmount,
                                    "paid_amount": claimStatus.paymentAmount,
                                    "check_eft_number": claimStatus.checkNumber,
                                    "claim_number": claimResponse.claimStatuses[i].claimControlNumber,
                                    "claim_status": claimStatus.status,
                                    "effective_date": claimStatus.effectiveDate,
                                    "adjudication_date": claimStatus.finalizedDate,
                                    "remittance_date": claimStatus.remittanceDate,
                                    "created_by": body['email_id'],
                                    "created_on": currentDateTime(),
                                    "modified_by": body['email_id'],
                                    "modified_on": currentDateTime()
                                };
                                const data = await db.query(patientClaimsQuery, bindParams);
                                patientClaimsId = data.insertId;
                                let claimsProcedureId = [];
                                if (claimResponse.claimStatuses[i].serviceLines) {
                                    for (var j = 0; j < claimResponse.claimStatuses[i].serviceLines.length; j++) {
                                        var claimProcedure = claimResponse.claimStatuses[i].serviceLines[j];
                                        var claimsProcedureQuery = "insert into claims_procedure SET ?";
                                        console.log("Inside for loop" + patientClaimsId);
                                        var bindParams1 = {
                                            "procedure_code": claimProcedure.procedureCode,
                                            "patient_claims_id": patientClaimsId,
                                            "era_matched": 'N',
                                            "modifier": claimProcedure.modifier1,
                                            "charge_amount": claimProcedure.chargeAmount,
                                            "paid_amount": claimProcedure.paymentAmount,
                                            "created_by": body['email_id'],
                                            "created_on": currentDateTime(),
                                            "modified_by": body['email_id'],
                                            "modified_on": currentDateTime()
                                        };
                                        const cpData = await db.query(claimsProcedureQuery, bindParams1);
                                        console.log("cpData InsertID" + cpData.insertId);
                                        claimsProcedureId.push(cpData.insertId);
                                        console.log("cpData " + JSON.stringify(cpData));
                                    }
                                }
                                var claimsProcedureIDStr = claimsProcedureId.join(',');
                                console.log("patientClaimsId " + patientClaimsId);
                                console.log("claimsProcedureIDStr " + claimsProcedureIDStr);
                                if (claimsProcedureIDStr != null && claimsProcedureIDStr != undefined && claimsProcedureIDStr.trim() != "") {
                                    var updateERACPQuery = "UPDATE era e,patient_claims c,claims_procedure cp SET e.era_matched = 'Y', cp.era_matched = 'Y'";
                                    updateERACPQuery = updateERACPQuery + "WHERE c.patient_claims_id = " + patientClaimsId + " and cp.claims_procedure_id in (" + claimsProcedureIDStr + ")";
                                    updateERACPQuery = updateERACPQuery + " and e.procedure_code = cp.procedure_code and e.claims_number = c.claim_number and cp.patient_claims_id = c.patient_claims_id"
                                    console.log("updateERACPQuery " + updateERACPQuery);
                                    var result = await db.query(updateERACPQuery);
                                    console.log("Result of updateERACPQuery" + JSON.stringify(result));
                                    var eraQuery = "select e.era_id, e.allowed_amount from era e,patient_claims c, claims_procedure cp ";
                                    eraQuery = eraQuery + "WHERE c.patient_claims_id = " + patientClaimsId + " AND cp.claims_procedure_id IN (" + claimsProcedureIDStr + ")";
                                    eraQuery = eraQuery + " AND e.procedure_code = cp.procedure_code AND e.claims_number = c.claim_number";
                                    eraQuery = eraQuery + " AND cp.patient_claims_id = c.patient_claims_id AND cp.era_matched = 'Y' AND e.era_matched = 'Y';"
                                    var eraResult = await db.query(eraQuery);
                                    console.log("eraQuery" + eraQuery);
                                    console.log("Result of eraQuery" + JSON.stringify(eraResult));
                                    if (eraResult != null) {
                                        let allowedAmount = 0, deductible = 0, coinsurance = 0, copay = 0, providersWriteoff = 0;
                                        let eraIds = [];
                                        for (var j = 0; j < eraResult.length; j++) {
                                            let allowed_amount = eraResult[j].allowed_amount != null ? eraResult[j].allowed_amount : 0;
                                            allowedAmount = allowedAmount + allowed_amount;
                                            eraIds.push(eraResult[j].era_id);
                                        }
                                        console.log("allowedAmount" + allowedAmount);
                                        var eraStr = eraIds.join(',');
                                        var adjustmentQuery = "select adjustment_reason_code, adjustment_amount from adjustment where era_id in (" + eraStr + ")";
                                        var adjustmentResult = await db.query(adjustmentQuery);
                                        console.log("adjustmentQuery " + adjustmentQuery);
                                        console.log("adjustmentResult " + JSON.stringify(adjustmentResult));
                                        for (var j = 0; j < adjustmentResult.length; j++) {
                                            let reasonCode = adjustmentResult[j].adjustment_reason_code;
                                            let amount = adjustmentResult[j].adjustment_amount != null ? adjustmentResult[j].adjustment_amount : 0;
                                            if (reasonCode == 'PR-1') {
                                                deductible = deductible + amount;
                                            } else if (reasonCode == 'PR-2') {
                                                coinsurance = coinsurance + amount;
                                            } else if (reasonCode == 'PR-3') {
                                                copay = copay + amount;
                                            } else if (reasonCode == 'CO-45') {
                                                providersWriteoff = providersWriteoff + amount;
                                            }
                                        }
                                        var updateClaimsQuery = "update patient_claims set allowed_amount = " + allowedAmount + " , deductible = " + deductible + ",";
                                        updateClaimsQuery = updateClaimsQuery + "coinsurance = " + coinsurance + ",copay = " + copay + ",providers_writeoff = " + providersWriteoff + " where patient_claims_id = " + patientClaimsId + "";
                                        console.log("updateClaimsQuery " + updateClaimsQuery);
                                        await db.query(updateClaimsQuery);
                                        console.log("Updated successfully" + patientClaimsId);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.log("Error while calling external claims api", err);
    } finally {
        await db.close();
    }
};
function updateErrorComments(error, patient_unique_id, db) {
    let errorMsg = "";
    let api_status = null;
    let processing_status = null;
    if (error.response.data.errors != undefined && error.response.data.errors != null
        && error.response.data.errors.length > 0) {
        errorMsg = error.response.data.errors[0].errorMessage;
    } else {
        errorMsg = error.response.data.userMessage;
    }
    console.log("errorMsg in comments " + errorMsg);
    if (error.response.data.statusCode == 400) {
        api_status = "Complete";
        processing_status = "Complete";
    } else {
        api_status = "Bad Request";
        processing_status = "Transaction Failed";
    }
    var patientQuery = "update patient set api_status=?, processing_status=?,comments=?,modified_on=? where patient_unique_id='" + patient_unique_id + "'";
    var patientParams = [api_status, processing_status, errorMsg, currentDateTime(), patient_unique_id];
    db.query(patientQuery, patientParams);
}

