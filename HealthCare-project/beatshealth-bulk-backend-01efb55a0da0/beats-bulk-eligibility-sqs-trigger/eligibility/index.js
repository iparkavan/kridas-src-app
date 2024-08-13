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
const url = require('url');
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

function processEligibilityBenefits(eligibilityResponseBenefits, serviceType) {
    console.log("**** Entering processEligibilityBenefits ****" + serviceType);
    let generalBenefits = { "outOfPocket": '', "deductible": '', "limitations": '' };
    let otherServiceTypes = {};
    let eligibilityBenefitStatus = '';
    if (null != eligibilityResponseBenefits) {
        console.log("Records fetched " + eligibilityResponseBenefits.length);
        for (var i = 0; i < eligibilityResponseBenefits.length; i++) {
            console.log("Service Type " + eligibilityResponseBenefits[i].type);
            console.log("Benefits " + JSON.stringify(eligibilityResponseBenefits[i]));
            let tempGeneralBenefits = generalBenefitsProcessing(eligibilityResponseBenefits[i]);
            generalBenefits.outOfPocket = generalBenefits.outOfPocket + tempGeneralBenefits.outOfPocket;
            generalBenefits.deductible = generalBenefits.deductible + tempGeneralBenefits.deductible;
            generalBenefits.limitations = generalBenefits.limitations + tempGeneralBenefits.limitations;
            console.log("generalBenefits " + JSON.stringify(generalBenefits));
            if (serviceType === "30" || serviceType === "35") {
                eligibilityBenefitStatus = eligibilityResponseBenefits[i].status;
                console.log(" Break : GeneralBenefits " + JSON.stringify(generalBenefits));
                break;
            } else if (eligibilityResponseBenefits[i].type === serviceType) {
                otherServiceTypes = otherServiceTypesProcessing(eligibilityResponseBenefits[i]);
                eligibilityBenefitStatus = eligibilityResponseBenefits[i].status;
                console.log("otherServiceTypes " + JSON.stringify(otherServiceTypes));
            }
        }
    }
    let specificServiceTypeLimitations = otherServiceTypes.limitations != undefined ? otherServiceTypes.limitations : '';
    return {
        "outOfPocket": generalBenefits.outOfPocket,
        "deductible": generalBenefits.deductible,
        "coPayment": otherServiceTypes.coPayment,
        "coInsurance": otherServiceTypes.coInsurance,
        "limitations": generalBenefits.limitations + specificServiceTypeLimitations,
        "eligibilityBenefitStatus": eligibilityBenefitStatus
    }
}

function otherServiceTypesProcessing(benefitResponse) {
    let coPayment = "";
    let coInsurance = "";
    let limitations = "";
    console.log("In otherServiceTypesProcessing " + JSON.stringify(benefitResponse.amounts));
    if (benefitResponse.amounts != null) {
        if (benefitResponse.amounts.coPayment != null) {
            let inNetwork = benefitResponse.amounts.coPayment.inNetwork;
            let outOfNetwork = benefitResponse.amounts.coPayment.outOfNetwork;
            coPayment = coPaymentProcessing(inNetwork, 'In-Network-') + coPaymentProcessing(outOfNetwork, 'Out-Of-Network-');
        }
        if (benefitResponse.amounts.coInsurance != null) {
            let inNetwork = benefitResponse.amounts.coInsurance.inNetwork;
            let outOfNetwork = benefitResponse.amounts.coInsurance.outOfNetwork;
            coInsurance = coInsuranceProcessing(inNetwork, 'In-Network-') + coInsuranceProcessing(outOfNetwork, 'Out-Of-Network-');
        }
        if (benefitResponse.limitations != null) {
            let inNetwork = benefitResponse.limitations.inNetwork;
            let outOfNetwork = benefitResponse.limitations.outOfNetwork;
            limitations = limitationsProcessing(inNetwork, 'In-Network-') + limitationsProcessing(outOfNetwork, 'Out-Of-Network-');
            console.log("limitations " + limitations);
        }

    }
    return {
        "coPayment": coPayment,
        "coInsurance": coInsurance,
        "limitations": limitations
    }
}

function coPaymentProcessing(network, type) {
    let finalStr = "";
    if (null != network) {
        for (var j = 0; j < network.length; j++) {
            let placeOfService = network[j].placeOfService != undefined ? '-' + network[j].placeOfService : '';
            finalStr = finalStr + type + network[j].level + placeOfService + ':$' + network[j].amount + '-Notes:' + network[j].payerNotes + '; ';
        }
    }
    return finalStr;
}

function coInsuranceProcessing(network, type) {
    let finalStr = "";
    if (null != network) {
        for (var j = 0; j < network.length; j++) {
            let placeOfService = network[j].placeOfService != undefined ? '-' + network[j].placeOfService : '';
            finalStr = finalStr + type + network[j].level + placeOfService + ':' + network[j].amount * 100 + '%' + '-Notes:' + network[j].payerNotes + ';';
        }
    }
    return finalStr;
}

function generalBenefitsProcessing(benefitResponse) {
    let outOfPocket = "";
    let deductible = "";
    let limitations = "";
    console.log("Benefits in GB Processing " + JSON.stringify(benefitResponse.amounts));
    console.log("Limitations in GB Processing " + JSON.stringify(benefitResponse.limitations));
    if (benefitResponse.amounts != null) {
        if (benefitResponse.amounts.outOfPocket != null) {
            let inNetwork = benefitResponse.amounts.outOfPocket.inNetwork;
            let outOfNetwork = benefitResponse.amounts.outOfPocket.outOfNetwork;
            outOfPocket = outofPocketProcessing(inNetwork, 'In-Network-') + outofPocketProcessing(outOfNetwork, 'Out-Of-Network-');
            console.log("outOfPocket " + outOfPocket);
        }
        if (benefitResponse.amounts.deductibles != null) {
            let inNetwork = benefitResponse.amounts.deductibles.inNetwork;
            let outOfNetwork = benefitResponse.amounts.deductibles.outOfNetwork;
            deductible = deductibleProcessing(inNetwork, 'In-Network-') + deductibleProcessing(outOfNetwork, 'Out-Of-Network-');
            console.log("deductible " + deductible);
        }
    }
    if (benefitResponse.limitations != null) {
        let notApplicableNetwork = benefitResponse.limitations.notApplicableNetwork;
        let noNetwork = benefitResponse.limitations.noNetwork;
        limitations = limitationsProcessing(notApplicableNetwork, 'Not Applicable Network-') + limitationsProcessing(noNetwork, 'No Network-');
        console.log("limitations " + limitations);
    }
    return {
        "outOfPocket": outOfPocket,
        "deductible": deductible,
        "limitations": limitations
    }
}

function limitationsProcessing(network, type) {
    let finalStr = "";
    if (null != network) {
        for (var j = 0; j < network.length; j++) {
            let placeOfService = network[j].placeOfService != undefined ? '-' + network[j].placeOfService + '; ' : '';
            finalStr = finalStr + type + network[j].level + placeOfService + '-' + network[j].payerNotes + '; ';
        }
    }
    return finalStr;
}

function outofPocketProcessing(network, type) {
    let finalStr = "";
    var finalObject = {};
    let values = {};
    if (null != network) {
        console.log("Whole Network " + JSON.stringify(network));
        for (var j = 0; j < network.length; j++) {
            console.log("Network " + JSON.stringify(network[j]));
            level = network[j].level;
            values = finalObject[level] == null ? {} : values;
            console.log("Values in loop " + JSON.stringify(values) + ":" + level);
            if (network[j].amount != null && network[j].amountTimePeriod == "Year to Date") {
                values["amountYearToDate"] = network[j].amount;
                finalObject[level] = values;
            } else if (network[j].total != null && network[j].totalTimePeriod == "Year to Date") {
                values["totalYearToDate"] = network[j].total;
                finalObject[level] = values;
            } else {
                if (network[j].amount != null) {
                    values["amount"] = network[j].amount;
                } else if (network[j].total != null) {
                    values["total"] = network[j].total;
                } else {
                    values["remaining"] = network[j].remaining;
                }
                console.log("Values setting " + JSON.stringify(values) + ": " + level);
                finalObject[level] = values;
                console.log("finalObject " + JSON.stringify(finalObject));
            }
        }
        console.log("finalObject after loop " + JSON.stringify(finalObject));
        for (const [key, value] of Object.entries(finalObject)) {
            console.log("Key and Value" + key + ":" + value);
            let ytd = 0, remaining = 0, total = 0, amount = 0;
            if (value["amountYearToDate"] != null) {
                ytd = value["amountYearToDate"];
            } else if (value["totalYearToDate"] != null) {
                ytd = value["totalYearToDate"];
            } else {
                total = value["total"] == null ? 0 : value["total"];
                amount = value["amount"] == null ? 0 : value["amount"];
                remaining = value["remaining"] == null ? 0 : value["remaining"];
                if (amount != 0 && total == 0 && remaining == 0) {
                    finalStr = finalStr + type + key + '-Total Limit:$' + isEmpty(amount) + '; ';
                } else if (amount == 0 && total != 0 && remaining == 0) {
                    finalStr = finalStr + type + key + '-Total Limit:$' + isEmpty(total) + '; ';
                } else if (amount == 0 && total == 0 && remaining != 0) {
                    finalStr = finalStr + type + key + '-Total Limit:$' + isEmpty(remaining) + '; ';
                } else {
                    ytd = computeYTD(total, amount, remaining);
                    finalStr = finalStr + type + key + '-Year to date:$' + isEmpty(ytd) + '; ';
                    finalStr = finalStr + type + key + '-Remaining:$' + isEmpty(remaining) + '; ';
                }
            }
        }
    }
    return finalStr;
}

function computeYTD(total, amount, remaining) {
    let ytd = 0;
    console.log("Amount Total Remaining" + total + ":" + amount + ":" + remaining);
    if (total == 0 && amount != 0 && remaining != 0) {
        ytd = amount - remaining;
    } else if (total != 0 && amount == 0 && remaining != 0) {
        ytd = total - remaining;
    } else if (total != 0 && amount != 0 && remaining != 0) {
        ytd = amount;
    }
    return ytd;
}

function deductibleProcessing(network, type) {
    let finalStr = "";
    if (null != network) {
        for (var j = 0; j < network.length; j++) {
            console.log("Network in deductible " + JSON.stringify(network[j]));
            let amount = network[j].amount == null ? 0 : network[j].amount;
            let total = network[j].total == null ? 0 : network[j].total;
            let remaining = network[j].remaining == null ? 0 : network[j].remaining;
            let level = network[j].level;

            if (amount != 0 && network[j].amountTimePeriod == "Year to Date") {
                finalStr = finalStr + type + level + '-Year to date:$' + isEmpty(amount) + '; ';
            } else if (total != 0 && network[j].totalTimePeriod == "Year to Date") {
                finalStr = finalStr + type + level + '-Year to date:$' + isEmpty(total) + '; ';
            } else {
                if (amount != 0 && total == 0 && remaining == 0) {
                    finalStr = finalStr + type + level + '-Total Limit:$' + isEmpty(amount) + '; ';
                } else if (amount == 0 && total != 0 && remaining == 0) {
                    finalStr = finalStr + type + level + '-Total Limit:$' + isEmpty(total) + '; ';
                } else if (amount == 0 && total == 0 && remaining != 0) {
                    finalStr = finalStr + type + level + '-Total Limit:$' + isEmpty(remaining) + '; ';
                } else {
                    ytd = computeYTD(total, amount, remaining);
                    finalStr = finalStr + type + level + '-Year to date:$' + isEmpty(ytd) + '; ';
                }
            }
            if (remaining != 0) {
                finalStr = finalStr + type + network[j].level + '-Remaining:$' + isEmpty(network[j].remaining) + '; ';
            }
        }
    }
    return finalStr;
}

function isEmpty(value) {
    if (value) {
        return value;
    }
    else {
        return "0";
    }
}

exports.handler = async (event) => {
    console.log("******Entering verifyEligibility  ********");
    const body = JSON.parse(event.Records[0].body);
    console.log("event.body ::: ", body);
    console.log("payer id ::: ", body['payerId']);

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
        const patient_unique_id = body['patientUniqueId'];
        let serviceType = body['serviceType'];

        if (serviceType != "") {
            var serviceTypeQuery = "select service_type_name from service_types where service_type_Id = " + serviceType;
            var result = await db.query(serviceTypeQuery);
            serviceType = result[0].service_type_name;
            console.log("serviceType Name" + serviceType);
        }
        const queryParams = {
            'payerId': body['payerId'],
            'submitterId': process.env.AVAILITY_SUBMITTER_ID,
            'providerLastName': 'Lee',
            'providerNpi': body['providerNpi'],
            'asOfDate': body['from_date_of_service'],
            'toDate': body['to_date_of_service'],
            'memberId': body['memberId'],
            'patientLastName': body['patientLastName'],
            'patientBirthDate': body['patientBirthDate'],
            'patientFirstName': body['patientFirstName'],
            'serviceType': serviceType,
            'placeOfService': '11',
            'providerType': 'AT'

        };
        var patientQuery = "select transaction_id,processing_status from patient_eligibility where patient_unique_id = '" + patient_unique_id + "'";
        var result = await db.query(patientQuery);
        console.log("patientQuery " + patientQuery);
        console.log("Transaction URL from DB" + JSON.stringify(result));
        if (result && Object.keys(result).length > 0) {
            let transactionURLFromDB = result[0].transaction_id;
            let processing_status = result[0].processing_status;
            if (processing_status != "Complete") {
                console.log("queryParameters " + JSON.stringify(queryParams));
                const tokenConfig = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };
                const externalTokenURL = process.env.AVAILITY_TOKEN_URL;
                const externalAPIURL = process.env.AVAILITY_COVERAGES_API;
                let eligibilityResponse = {};
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
                    if (apiResponse && Object.keys(apiResponse.data).length > 0) {
                        finalAPIURL = apiResponse.data.coverages[0].links.self.href;
                    }
                } else {
                    finalAPIURL = transactionURLFromDB;
                }
                console.log("API Responses " + CircularJSON.stringify(apiResponse));
                if (finalAPIURL != null && finalAPIURL != undefined && finalAPIURL != "") {
                    eligibilityResponse = await axios.get(finalAPIURL, finalConfig)
                        .catch((error) => {
                            console.log("Error during Final API Call " + JSON.stringify(error.response.data));
                            updateErrorComments(error, patient_unique_id, db);
                        });
                    console.log("eligibilityResponse: ", eligibilityResponse);
                    let transactionURLFromAPI = null;
                    if (eligibilityResponse && Object.keys(eligibilityResponse).length > 0) {
                        eligibilityResponse = eligibilityResponse.data;
                        var processingStatus;
                        if (eligibilityResponse.statusCode === "0") {
                            transactionURLFromAPI = eligibilityResponse.links.self.href;
                            console.log("transactionURL" + transactionURLFromAPI);
                            processingStatus = "In Progress";
                        }
                        else if (eligibilityResponse.statusCode === "7" || eligibilityResponse.statusCode === "13"
                            || eligibilityResponse.statusCode === "14" || eligibilityResponse.statusCode === "15") {
                            processingStatus = "Retry";
                        }
                        else if (eligibilityResponse.statusCode === "4") {
                            processingStatus = "Complete";
                        } else {
                            processingStatus = "Transaction Failed";
                        }
                        var patientQuery = "select patient_eligibility_id from patient_eligibility where patient_unique_id = '" + patient_unique_id + "'";
                        var result = await db.query(patientQuery);
                        console.log("Patient ID " + JSON.stringify(result));
                        var patient_id = result[0].patient_eligibility_id;
                        console.log("Patient ID " + patient_id);
                        patientQuery = "update patient_eligibility set relationship_to_subscriber=?, api_status=?, processing_status=?,modified_on=?,transaction_id=? where patient_eligibility_id=?";
                        var patientParams = [eligibilityResponse.patient.subscriberRelationship, eligibilityResponse.status, processingStatus, currentDateTime(), transactionURLFromAPI, patient_id];
                        await db.query(patientQuery, patientParams);
                        if (eligibilityResponse.plans && Object.keys(eligibilityResponse.plans).length > 0
                            && Object.keys(eligibilityResponse.plans[0].benefits).length > 0 && processingStatus === "Complete") {
                            let insuranceBenifits = processEligibilityBenefits(eligibilityResponse.plans[0].benefits, serviceType);
                            console.log("InsuranceBenifits: ", JSON.stringify(insuranceBenifits));
                            var patientInsuranceQuery = "insert into patient_insurance_records SET ?";
                            var bindParams = {
                                "patient_eligibility_id": patient_id,
                                "external_payer_id": eligibilityResponse.payer.payerId,
                                "eligibility_status": insuranceBenifits.eligibilityBenefitStatus,
                                "copay": insuranceBenifits.coPayment,
                                "coinsurance": insuranceBenifits.coInsurance,
                                "deductible": insuranceBenifits.deductible,
                                "out_of_pocket": insuranceBenifits.outOfPocket,
                                "limitations": insuranceBenifits.limitations,
                                "subscriber_id": eligibilityResponse.subscriber.memberId,
                                "created_by": body['email_id'],
                                "created_on": currentDateTime(),
                                "modified_by": body['email_id'],
                                "modified_on": currentDateTime()
                            };
                            const data = await db.query(patientInsuranceQuery, bindParams);
                            console.log("Patient insurnace record details are saved " + patient_id);
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.log("Error while calling external eligibility api", err);
    } finally {
        await db.close();
    }
};
function updateErrorComments(error, patient_unique_id, db) {
    let errorMsg = "";
    if (error.response.data.errors != undefined && error.response.data.errors != null
        && error.response.data.errors.length > 0) {
        errorMsg = error.response.data.errors[0].errorMessage;
    } else {
        errorMsg = error.response.data.userMessage;
    }
    console.log("errorMsg in comments " + errorMsg);
    var patientQuery = "update patient_eligibility set api_status=?, processing_status=?,comments=? where patient_unique_id='" + patient_unique_id + "'";
    var patientParams = ["Bad Request", "Transaction Failed", errorMsg, patient_unique_id];
    db.query(patientQuery, patientParams);
}

