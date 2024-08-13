let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
let AWS = require("aws-sdk");
AWS.config.update({
  apiVersion: "2016-04-19",
  region: process.env.region,
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
});
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESSKEYID,
  secretAccessKey: process.env.S3_SECRETACCESSKEY
});
AWS.config.setPromisesDependency(require("bluebird"));

const util = require("util");
const mysql = require("mysql");
const XLSX = require("xlsx");

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

var headers = {
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods":
    "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
  "X-Requested-With": "*",
};

exports.searchClaim = async (event, context, callback) => {
  console.log("******Entering searchClaim********");
  console.log("event : ", event);
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  });
  try {
    const userEmail = event.requestContext.authorizer.claims["email"];
    const payLoad = JSON.parse(event.body);
    console.log("payLoad " + JSON.stringify(payLoad));
    console.log("User email " + userEmail);

    var userQuery = "select role,created_by from users where email = '" + userEmail + "'";
    let userQueryResult = await db.query(userQuery);
    var adminUser = userQueryResult[0].created_by;
    var userEmails = userEmail;

    var tempEmail = [];
    var clientUserQuery = "select email from users where users_id in (select distinct a.users_id from user_client a inner join ";
    clientUserQuery = clientUserQuery + "(select client_id,users_id from user_client where users_id=(select users_id from users where ";
    clientUserQuery = clientUserQuery + "email='" + userEmail + "')) b on a.client_id=b.client_id)";
    console.log("clientUserQuery " + clientUserQuery);
    let clientUserQueryResult = await db.query(clientUserQuery);
    if (clientUserQueryResult != null) {
      for (var j = 0; j < clientUserQueryResult.length; j++) {
        tempEmail.push(clientUserQueryResult[j].email);
      }
    }
    console.log("tempEmail " + tempEmail);

    if (userQueryResult[0].role === "Admin") {
      let retrieveUserEmails = "select email from users where created_by ='" + userEmail + "'";
      let userEmailResult = await db.query(retrieveUserEmails);
      var tempEmail = [];
      for (var i = 0; i < userEmailResult.length; i++) {
        tempEmail.push(userEmailResult[i].email);
      }
    }

    userEmails = tempEmail.join(',');
    userEmails = userEmails.replace(/,/g, "','");
    userEmails = "'" + userEmails + "'";

    var totalRecordCount = 0;
    var query = "select p.*,pc.patient_claims_id as patient_claims_id,CONCAT('$',pc.claimed_amount) as claimed_amount, CONCAT('$',pc.paid_amount) as paid_amount,";
    query = query + "pc.check_eft_number as check_eft_number,pc.claim_number as claim_number,pc.claim_status as claim_status,";
    query = query + "pc.delete_flag as delete_flag,pc.effective_date as effective_date,pc.adjudication_date as adjudication_date,";
    query = query + "pc.remittance_date as remittance_date,CONCAT('$',pc.allowed_amount) as allowed_amount,CONCAT('$',pc.deductible) as deductible,CONCAT('$',pc.coinsurance) as coinsurance,";
    query = query + "CONCAT('$',pc.copay) as copay,CONCAT('$',pc.providers_writeoff) as providers_writeoff,st.service_name,pm.external_payer_name,pa.payer_alias_identifier,";
    query = query + "gm.group_name as group_name,gmp.billing_npi as billing_npi from patient p ";
    query = query + "left join payer_alias pa on pa.payer_alias_identifier = p.payer_alias and pa.created_by = '" + adminUser + "' ";
    query = query + "left join payer_mapping pm on pm.claims_payer_id=p.payer_id and pm.payer_mapping_id = pa.payer_mapping_id ";
    query = query + "left join patient_claims pc on pc.patient_id = p.patient_id and pc.delete_flag='N' ";
    query = query + "left join service_types st on st.service_type_Id=p.service_type_id left join group_mapping gmp on ";
    query = query + "gmp.provider_npi = p.provider_npi AND gmp.created_by = '" + adminUser + "' ";
    query = query + "left join group_master gm ON gmp.group_master_id = gm.group_master_id ";
    query = query + "where p.record_type='claims' and p.delete_flag='N' and p.created_by in (" + userEmails + ")"
    if (payLoad.fromDate && payLoad.fromDate != "" && payLoad.toDate && payLoad.toDate != "") {
      query = query + " and DATE(p.created_on) between '" + payLoad.fromDate + "' and '" + payLoad.toDate + "' "
    }
    if (payLoad.searchKey && payLoad.searchKey != "" && payLoad.searchValue && payLoad.searchValue != "") {
      console.log("Query " + query);
      let totalRecords = await db.query(query);
      totalRecordCount = totalRecords.length;
      var patientArray = ["from_date_of_service", "patient_name", "date_of_birth", "member_id",
        "eligibility_status", "mrn_patient_account_no", "provider_npi", "created_on", "processing_status",
        "service_name", "payer_alias_name", "group_name", "payer_alias", "client_id", "payer_id"];
      var searchKey = payLoad.searchKey;
      var searchValue = payLoad.searchValue;
      if (payLoad.searchKey === "claim_number" || payLoad.searchKey === "claim_status") {
        searchKey = "pc." + searchKey;
        query = query + " and " + searchKey + " like '%" + searchValue + "%' "
      } else if (patientArray.indexOf(payLoad.searchKey) > -1) {
        if (payLoad.searchKey === "from_date_of_service" || payLoad.searchKey === "date_of_birth" ||
          payLoad.searchKey === "created_on") {
          searchKey = "DATE(p." + searchKey + ")";
          query = query + " and " + searchKey + "='" + searchValue + "' "
        } else if (payLoad.searchKey === "service_name") {
          query = query + " and p.service_type_id in (select service_type_id from service_types where service_name like '%" + searchValue + "%')";
        } else if (payLoad.searchKey === "payer_alias_name") {
          query = query + " and p.payer_id in (select claims_payer_id from payer_mapping where external_payer_name like '%" + searchValue + "%' and claims_payer_id !='N/A')";
        } else if (payLoad.searchKey === "group_name") {
          query = query + " and p.provider_npi in (select gmp.provider_npi from group_mapping gmp inner join group_master gm on";
          query = query + " gm.group_master_id=gmp.group_master_id where gm.group_name like '%" + searchValue + "%' and gmp.created_by='" + adminUser + "')";
        } else if (payLoad.searchKey === "patient_name") {
          query = query + " and (p.first_name like '%" + searchValue + "%' or p.last_name like '%" + searchValue + "%')"
        } else {
          searchKey = "p." + searchKey;
          query = query + " and " + searchKey + " like '%" + searchValue + "%' "
        }
      }
      console.log("searchValue" + searchValue);
    }
    console.log("Query " + query);
    let filteredResult = await db.query(query);
    var successResponse = filteredResult;
    if (totalRecordCount === 0) {
      totalRecordCount = filteredResult.length;
    }
    console.log("Total Record count " + totalRecordCount);
    console.log("Filtered Record count " + filteredResult.length);
    console.log("Retrieved Claims Records " + JSON.stringify(successResponse));
    for (var i = 0; i < successResponse.length; i++) {
      if (null != successResponse[i].patient_claims_id) {
        successResponse[i].allowed_amount = successResponse[i].allowed_amount != '$0.00' ? successResponse[i].allowed_amount : null;
        successResponse[i].deductible = successResponse[i].deductible != '$0.00' ? successResponse[i].deductible : null;
        successResponse[i].coinsurance = successResponse[i].coinsurance != '$0.00' ? successResponse[i].coinsurance : null;
        successResponse[i].copay = successResponse[i].copay != '$0.00' ? successResponse[i].copay : null;
        successResponse[i].providers_writeoff = successResponse[i].providers_writeoff != '$0.00' ? successResponse[i].providers_writeoff : null;
        let era_matched = 'Y';
        if (payLoad.searchKey && payLoad.searchKey != "" && payLoad.searchValue && payLoad.searchValue != "" && payLoad.searchKey == "era_matched") {
          era_matched = payLoad.searchValue.toUpperCase();
        }
        query = "SELECT cp.claims_procedure_id, cp.procedure_code, CASE WHEN cp.era_matched = '" + era_matched + "' THEN CONCAT('$',e.allowed_amount) ";
        query = query + "ELSE null END AS allowed_amount, CASE WHEN cp.era_matched = '" + era_matched + "' THEN CONCAT('$',e.charge_amount) ";
        query = query + "ELSE CONCAT('$',cp.charge_amount) END AS charge_amount, CASE WHEN cp.era_matched = '" + era_matched + "' THEN CONCAT('$',e.paid_amount) ";
        query = query + "ELSE CONCAT('$',cp.paid_amount) END AS paid_amount FROM claims_procedure cp LEFT JOIN patient_claims c ON c.patient_claims_id = cp.patient_claims_id ";
        query = query + "LEFT JOIN era e ON c.claim_number = e.claims_number AND cp.procedure_code = e.procedure_code WHERE cp.patient_claims_id = " + successResponse[i].patient_claims_id + "";
        console.log("Claim Procedure Query " + query);
        let result2 = await db.query(query);
        console.log("Result 2" + result2);
        successResponse[i].claimProcedure = result2;
      } else {
        successResponse[i].claimProcedure = [];
      }
    }
    var searchResponse = {
      "totalRecordCount": totalRecordCount,
      "filteredRecordCount": filteredResult.length,
      "patientRecords": successResponse
    };
    console.log("Retrieved Claims with Procedure Records " + JSON.stringify(searchResponse));
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(searchResponse),
      headers: headers
    });
  } catch (err) {
    console.log("error : ", err);
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({ error: err.join(" ") }),
      headers: headers,
    });
  } finally {
    await db.close();
  }
};

exports.deleteClaims = async (event, context, callback) => {
  console.log("******Entering deleteClaims********");
  console.log("event : ", event);
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  });
  try {
    const payLoad = JSON.parse(event.body);
    for (var i = 0; i < payLoad.length; i++) {
      console.log("Payload record " + JSON.stringify(payLoad[i]));
      if (payLoad[i].claim_id != null && payLoad[i].claim_id != "") {
        var query = "update patient_claims set delete_flag='Y' where patient_claims_id=" + payLoad[i].claim_id;
        await db.query(query);
      }
      query = "select patient_id from patient_claims where delete_flag='N' and patient_id=" + payLoad[i].patient_id;
      var claimRecords = await db.query(query);
      console.log("claimRecords " + JSON.stringify(claimRecords));
      if (claimRecords.length == 0) {
        query = "update patient set delete_flag='Y' where patient_id=" + payLoad[i].patient_id;
        await db.query(query);
      }
    }
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ msg: "Successfully Deleted" }),
      headers: headers
    });
  } catch (err) {
    console.log("error : ", err);
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({ error: err.join(" ") }),
      headers: headers,
    });
  } finally {
    await db.close();
  }
};


exports.saveClaimDetails = async (event, context, callback) => {
  console.log("******Entering saveClaimDetails********");
  console.log("event : ", event);
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  });
  try {
    const payLoad = JSON.parse(event.body);
    const userEmail = event.requestContext.authorizer.claims["email"];
    console.log("Payload record " + JSON.stringify(payLoad));
    var query = "insert into patient SET ?";
    var bindParams = {
      "first_name": payLoad.patientFirstName,
      "middle_name": payLoad.patientMiddleName,
      "last_name": payLoad.patientLastName,
      "date_of_birth": payLoad.patientBirthDate,
      "from_date_of_service": payLoad.fromDateOfService,
      "to_date_of_service": payLoad.toDateOfService,
      "mrn_patient_account_no": payLoad.mrnPatientAccountNo,
      "patient_unique_id": payLoad.patientUniqueId,
      "payer_id": payLoad.payerId,
      "service_type_id": payLoad.serviceType,
      "record_type": payLoad.recordType,
      "member_id": payLoad.memberId,
      "provider_npi": payLoad.providerNpi,
      "client_id": payLoad.clientID,
      "processing_status": "In Progress",
      "created_on": currentDateTime(),
      "created_by": userEmail,
      "modified_on": currentDateTime(),
      "modified_by": userEmail
    };
    await db.query(query, bindParams);
    const externalQueuePayload = {
      'patientFirstName': payLoad.patientFirstName,
      'patientLastName': payLoad.patientLastName,
      'patientBirthDate': payLoad.patientBirthDate,
      'payerId': payLoad.payerId,
      'patientUniqueId': payLoad.patientUniqueId,
      'serviceType': payLoad.serviceType,
      'memberId': payLoad.memberId,
      'providerNpi': payLoad.providerNpi,
      'from_date_of_service': payLoad.fromDateOfService,
      'to_date_of_service': payLoad.toDateOfService,
      'mrn_patient_account_no': payLoad.mrnPatientAccountNo,
      'email_id': userEmail,
      'record_type': payLoad.recordType
    };
    console.log("Params to API " + JSON.stringify(externalQueuePayload));
    var params = {
      DelaySeconds: 0,
      MessageBody: JSON.stringify(externalQueuePayload),
      QueueUrl: process.env.CLAIMS_EXTERNAL_API_INPUT_QUEUE
    };
    await sqs.sendMessage(params).promise();

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ msg: "Successfully Added" }),
      headers: headers
    });
  } catch (err) {
    console.log("error : ", err);
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({ error: err.join(" ") }),
      headers: headers,
    });
  } finally {
    await db.close();
  }
};


exports.exportClaims = async (event, context, callback) => {
  console.log("******Entering exportClaims********");
  console.log("event : ", event);
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  });
  try {
    const userEmail = event.requestContext.authorizer.claims["email"];
    const payLoad = JSON.parse(event.body);

    var userQuery = "select role,created_by from users where email = '" + userEmail + "'";
    let userQueryResult = await db.query(userQuery);
    console.log("User Query Result " + userQueryResult[0].created_by);
    var adminUser = userQueryResult[0].created_by;
    var userEmails = userEmail;

    var tempEmail = [];
    var clientUserQuery = "select email from users where users_id in (select distinct a.users_id from user_client a inner join ";
    clientUserQuery = clientUserQuery + "(select client_id,users_id from user_client where users_id=(select users_id from users where ";
    clientUserQuery = clientUserQuery + "email='" + userEmail + "')) b on a.client_id=b.client_id)";
    console.log("clientUserQuery " + clientUserQuery);
    let clientUserQueryResult = await db.query(clientUserQuery);
    if (clientUserQueryResult != null) {
      for (var j = 0; j < clientUserQueryResult.length; j++) {
        tempEmail.push(clientUserQueryResult[j].email);
      }
    }
    console.log("tempEmail " + tempEmail);

    if (userQueryResult[0].role === "Admin") {
      let retrieveUserEmails = "select email from users where created_by ='" + userEmail + "'";
      let userEmailResult = await db.query(retrieveUserEmails);
      var tempEmail = [];
      for (var i = 0; i < userEmailResult.length; i++) {
        tempEmail.push(userEmailResult[i].email);
      }
    }

    userEmails = tempEmail.join(',');
    userEmails = userEmails.replace(/,/g, "','");
    userEmails = "'" + userEmails + "'";

    console.log("userEmails are =", userEmails);
    var query = "select first_name as 'PATIENT FIRST NAME',last_name as 'PATIENT LAST NAME',date_format(date_of_birth, '%m/%d/%Y') as 'DATE OF BIRTH', ";
    query = query + " date_format(from_date_of_service, '%m/%d/%Y') as 'FROM DATE OF SERVICE',date_format(to_date_of_service, '%m/%d/%Y') as 'TO DATE OF SERVICE',mrn_patient_account_no ";
    query = query + "as 'MRN',payer_alias as 'PAYER_ALIAS',st.service_name as 'SERVICE TYPE',member_id as 'MEMBER ID', p.provider_npi as 'RENDERING NPI',gmp.billing_npi as 'BILLING NPI',p.client_id as 'CLIENT ID',";
    query = query + "pm.external_payer_name as 'PAYER NAME',payer_id as 'EXTERNAL PAYER ID',gm.group_name as 'GROUP NAME',";
    query = query + "date_format(p.created_on, '%m/%d/%Y') as 'UPLOADED DATE',date_format(p.modified_on, '%m/%d/%Y %H:%i:%S') as 'LAST VERIFIED DATE', ";
    query = query + "processing_status as 'PROCESSING STATUS',p.comments as 'COMMENTS',p.created_by as 'USER ID',pc.claim_number as 'CLAIM NUMBER',pc.claim_status as 'CLAIM STATUS',";
    query = query + "CONCAT('$',pc.claimed_amount) as 'BILLED CHARGES',date_format(pc.effective_date, '%m/%d/%Y') as 'EFFECTIVE DATE', ";
    query = query + "date_format(pc.adjudication_date, '%m/%d/%Y') as 'ADJUDICATION DATE',date_format(pc.remittance_date, '%m/%d/%Y') as 'REMITTANCE DATE',CONCAT('$',pc.allowed_amount) as 'ALLOWED AMOUNT',CONCAT('$',pc.paid_amount) as 'PAID AMOUNT',";
    query = query + "CONCAT('$',pc.deductible) as 'DEDUCTIBLE',CONCAT('$',pc.coinsurance) as 'COINSURANCE',CONCAT('$',pc.copay) as 'COPAY',CONCAT('$',pc.providers_writeoff) as 'PROVIDERS WRITEOFF',"
    query = query + "pc.check_eft_number as 'CHECK/EFT NUMBER',pc.patient_claims_id from patient p ";
    query = query + "left join payer_alias pa on pa.payer_alias_identifier = p.payer_alias and pa.created_by = '" + adminUser + "' ";
    query = query + "left join payer_mapping pm on pm.claims_payer_id=p.payer_id and pm.payer_mapping_id = pa.payer_mapping_id ";
    query = query + "left join patient_claims pc on pc.patient_id = p.patient_id and pc.delete_flag='N' ";
    query = query + "left join service_types st on st.service_type_Id=p.service_type_id left join group_mapping gmp on ";
    query = query + "gmp.provider_npi = p.provider_npi AND gmp.created_by = '" + adminUser + "' ";
    query = query + "left join group_master gm ON gmp.group_master_id = gm.group_master_id ";
    query = query + "where p.record_type='claims' and p.delete_flag='N' and p.created_by in (" + userEmails + ")";
    if (payLoad.fromDate && payLoad.fromDate != "" && payLoad.toDate && payLoad.toDate != "") {
      query = query + " and DATE(p.created_on) between '" + payLoad.fromDate + "' and '" + payLoad.toDate + "' "
    }
    if (payLoad.patientClaimIdList && payLoad.patientClaimIdList.length > 0) {
      query = query + "and ("
      for (var i = 0; i < payLoad.patientClaimIdList.length; i++) {
        query = query + "(";
        query = query + "p.patient_id=" + payLoad.patientClaimIdList[i].patientId
        if (payLoad.patientClaimIdList[i].patientClaimId && payLoad.patientClaimIdList[i].patientClaimId != null && payLoad.patientClaimIdList[i].patientClaimId != "") {
          query = query + " and pc.patient_claims_id='" + payLoad.patientClaimIdList[i].patientClaimId + "'"
        }
        query = query + " )";
        if (i + 1 < payLoad.patientClaimIdList.length) {
          query = query + " or";
        }
      }
      query = query + " )";
    } else {
      if (payLoad.searchKey && payLoad.searchKey != "" && payLoad.searchValue && payLoad.searchValue != "") {
        var patientArray = ["from_date_of_service", "patient_name", "date_of_birth", "member_id",
          "eligibility_status", "mrn_patient_account_no", "provider_npi", "created_on", "processing_status",
          "service_name", "payer_alias_name", "group_name", "payer_alias", "client_id", "payer_id"];
        var searchKey = payLoad.searchKey;
        var searchValue = payLoad.searchValue;
        if (payLoad.fromDate && payLoad.fromDate != "" && payLoad.toDate && payLoad.toDate != "") {
          query = query + " and DATE(p.created_on) between '" + payLoad.fromDate + "' and '" + payLoad.toDate + "' "
        }
        if (searchKey === "claim_number" || searchKey === "claim_status") {
          searchKey = "pc." + searchKey;
          query = query + " and " + searchKey + " like '%" + searchValue + "%' "
        } else if (patientArray.indexOf(searchKey) > -1) {
          if (searchKey === "from_date_of_service" || searchKey === "date_of_birth" ||
            searchKey === "created_on") {
            searchKey = "DATE(p." + searchKey + ")";
            query = query + " and " + searchKey + "='" + searchValue + "' "
          } else if (searchKey === "service_name") {
            query = query + " and p.service_type_id in (select service_type_id from service_types where service_name like '%" + searchValue + "%')";
          } else if (searchKey === "payer_alias_name") {
            query = query + " and p.payer_id in (select claims_payer_id from payer_mapping where external_payer_name like '%" + searchValue + "%' and claims_payer_id !='N/A')";
          } else if (searchKey === "group_name") {
            query = query + " and p.provider_npi in (select gmp.provider_npi from group_mapping gmp inner join group_master gm on";
            query = query + " gm.group_master_id=gmp.group_master_id where gm.group_name like '%" + searchValue + "%' and gmp.created_by='" + adminUser + "')";
          } else if (searchKey === "patient_name") {
            query = query + " and (p.first_name like '%" + searchValue + "%' or p.last_name like '%" + searchValue + "%')"
          } else {
            searchKey = "p." + searchKey;
            query = query + " and " + searchKey + " like '%" + searchValue + "%' "
          }
        }
      }
    }

    console.log("Query " + query);
    let result = await db.query(query);
    console.log("Result " + JSON.stringify(result));

    for (var i = 0; i < result.length; i++) {
      if (null != result[i].patient_claims_id) {
        result[i]['ALLOWED AMOUNT'] = result[i]['ALLOWED AMOUNT'] != '$0.00' ? result[i]['ALLOWED AMOUNT'] : null;
        result[i]['DEDUCTIBLE'] = result[i]['DEDUCTIBLE'] != '$0.00' ? result[i]['DEDUCTIBLE'] : null;
        result[i]['COINSURANCE'] = result[i]['COINSURANCE'] != '$0.00' ? result[i]['COINSURANCE'] : null;
        result[i]['COPAY'] = result[i]['COPAY'] != '$0.00' ? result[i]['COPAY'] : null;
        result[i]['PROVIDERS WRITEOFF'] = result[i]['PROVIDERS WRITEOFF'] != '$0.00' ? result[i]['PROVIDERS WRITEOFF'] : null;
        let era_matched = 'Y';
        if (payLoad.searchKey && payLoad.searchKey != "" && payLoad.searchValue && payLoad.searchValue != "" && payLoad.searchKey == "era_matched") {
          era_matched = payLoad.searchValue.toUpperCase();
        }
        query = "SELECT e.era_id as era_id,e.payment_type as payment_type,cp.procedure_code as procedure_code, CASE WHEN cp.era_matched = '" + era_matched + "' THEN e.modifier ELSE cp.modifier END AS modifier,";
        query = query + "CASE WHEN cp.era_matched = '" + era_matched + "' THEN e.allowed_units ELSE '' END AS allowed_units, CASE WHEN cp.era_matched = '" + era_matched + "' THEN e.billed_units "
        query = query + "ELSE '' END AS billed_units, CASE WHEN cp.era_matched = '" + era_matched + "' THEN CONCAT('$',e.allowed_amount) ";
        query = query + "ELSE null END AS allowed_amount, CASE WHEN cp.era_matched = '" + era_matched + "' THEN CONCAT('$',e.charge_amount) ";
        query = query + "ELSE CONCAT('$',cp.charge_amount) END AS charge_amount, CASE WHEN cp.era_matched = '" + era_matched + "' THEN CONCAT('$',e.paid_amount) ";
        query = query + "ELSE CONCAT('$',cp.paid_amount) END AS paid_amount FROM claims_procedure cp LEFT JOIN patient_claims c ON c.patient_claims_id = cp.patient_claims_id ";
        query = query + "LEFT JOIN era e ON c.claim_number = e.claims_number AND cp.procedure_code = e.procedure_code WHERE cp.patient_claims_id = " + result[i].patient_claims_id + "";
        console.log("Claim Procedure Query " + query);
        let result2 = await db.query(query);
        console.log("Result2 " + JSON.stringify(result2));
        for (var j = 0; j < result2.length; j++) {
          result[i]["PAYMENT TYPE"] = result2[j].payment_type;
          result[i]["PROCEDURE CODE " + j] = result2[j].procedure_code;
          result[i]["MODIFIER " + j] = result2[j].modifier;
          result[i]["ALLOWED UNITS " + j] = result2[j].allowed_units;
          result[i]["BILLED UNITS " + j] = result2[j].billed_units;
          result[i]["CHARGE AMOUNT " + j] = result2[j].charge_amount;
          result[i]["ALLOWED AMOUNT " + j] = result2[j].allowed_amount;
          result[i]["PAID AMOUNT " + j] = result2[j].paid_amount;
          var query = "select * from adjustment where era_id = " + result2[j].era_id + "";
          console.log("query " + query);
          let result3 = await db.query(query);
          console.log("result3 " + JSON.stringify(result3));
          for (var k = 0; k < 4; k++) {
            if (k < result3.length) {
              result[i]["ADJUSTMENT AMOUNT_" + k + "_P" + j] = '$' + result3[k].adjustment_amount;
              result[i]["ADJUSTMENT REASON_" + k + " CODE_P" + j] = result3[k].adjustment_reason_code;
              result[i]["ADJUSTMENT REASON_" + k + " DESCRIPTION_P" + j] = result3[k].adjustment_reason_description;
            } else {
              result[i]["ADJUSTMENT AMOUNT_" + k + "_P" + j] = '';
              result[i]["ADJUSTMENT REASON_" + k + " CODE_P" + j] = '';
              result[i]["ADJUSTMENT REASON_" + k + " DESCRIPTION_P" + j] = '';
            }
          }
          console.log("Result until now" + JSON.stringify(result[i]));
        }
      }
      delete result[i].patient_claims_id;
    }
    console.log("Procedure Record " + JSON.stringify(result));

    const fields = ['PATIENT FIRST NAME', 'PATIENT LAST NAME', 'DATE OF BIRTH', 'FROM DATE OF SERVICE', 'TO DATE OF SERVICE',
      'MRN', 'PAYER_ALIAS', 'SERVICE TYPE', 'MEMBER ID', 'RENDERING NPI', 'BILLING NPI', 'CLIENT ID', 'PAYER NAME', 'EXTERNAL PAYER ID', 'GROUP NAME', 'UPLOADED DATE',
      'LAST VERIFIED DATE', 'PROCESSING STATUS', 'COMMENTS', 'USER ID', 'CLAIM NUMBER', 'CLAIM STATUS', 'BILLED CHARGES', 'EFFECTIVE DATE', 'ADJUDICATION DATE',
      'REMITTANCE DATE', 'ALLOWED AMOUNT', 'PAID AMOUNT', 'DEDUCTIBLE', 'COINSURANCE', 'COPAY', 'PROVIDERS WRITEOFF', 'CHECK/EFT NUMBER', 'PAYMENT TYPE',
      'PROCEDURE CODE 0', 'MODIFIER 0', 'ALLOWED UNITS 0', 'BILLED UNITS 0', 'CHARGE AMOUNT 0', 'ALLOWED AMOUNT 0', 'PAID AMOUNT 0',
      'ADJUSTMENT AMOUNT_0_P0', 'ADJUSTMENT REASON_0 CODE_P0', 'ADJUSTMENT REASON_0 DESCRIPTION_P0', 'ADJUSTMENT AMOUNT_1_P0', 'ADJUSTMENT REASON_1 CODE_P0', 'ADJUSTMENT REASON_1 DESCRIPTION_P0',
      'ADJUSTMENT AMOUNT_2_P0', 'ADJUSTMENT REASON_2 CODE_P0', 'ADJUSTMENT REASON_2 DESCRIPTION_P0', 'ADJUSTMENT AMOUNT_3_P0', 'ADJUSTMENT REASON_3 CODE_P0', 'ADJUSTMENT REASON_3 DESCRIPTION_P0',
      'PROCEDURE CODE 1', 'MODIFIER 1', 'ALLOWED UNITS 1', 'BILLED UNITS 1', 'CHARGE AMOUNT 1', 'ALLOWED AMOUNT 1', 'PAID AMOUNT 1',
      'ADJUSTMENT AMOUNT_0_P1', 'ADJUSTMENT REASON_0 CODE_P1', 'ADJUSTMENT REASON_0 DESCRIPTION_P1', 'ADJUSTMENT AMOUNT_1_P1', 'ADJUSTMENT REASON_1 CODE_P1', 'ADJUSTMENT REASON_1 DESCRIPTION_P1',
      'ADJUSTMENT AMOUNT_2_P1', 'ADJUSTMENT REASON_2 CODE_P1', 'ADJUSTMENT REASON_2 DESCRIPTION_P1', 'ADJUSTMENT AMOUNT_3_P1', 'ADJUSTMENT REASON_3 CODE_P1', 'ADJUSTMENT REASON_3 DESCRIPTION_P1',
      'PROCEDURE CODE 2', 'MODIFIER 2', 'ALLOWED UNITS 2', 'BILLED UNITS 2', 'CHARGE AMOUNT 2', 'ALLOWED AMOUNT 2', 'PAID AMOUNT 2',
      'ADJUSTMENT AMOUNT_0_P2', 'ADJUSTMENT REASON_0 CODE_P2', 'ADJUSTMENT REASON_0 DESCRIPTION_P2', 'ADJUSTMENT AMOUNT_1_P2', 'ADJUSTMENT REASON_1 CODE_P2', 'ADJUSTMENT REASON_1 DESCRIPTION_P2',
      'ADJUSTMENT AMOUNT_2_P2', 'ADJUSTMENT REASON_2 CODE_P2', 'ADJUSTMENT REASON_2 DESCRIPTION_P2', 'ADJUSTMENT AMOUNT_3_P2', 'ADJUSTMENT REASON_3 CODE_P2', 'ADJUSTMENT REASON_3 DESCRIPTION_P2',
      'PROCEDURE CODE 3', 'MODIFIER 3', 'ALLOWED UNITS 3', 'BILLED UNITS 3', 'CHARGE AMOUNT 3', 'ALLOWED AMOUNT 3', 'PAID AMOUNT 3',
      'ADJUSTMENT AMOUNT_0_P3', 'ADJUSTMENT REASON_0 CODE_P3', 'ADJUSTMENT REASON_0 DESCRIPTION_P3', 'ADJUSTMENT AMOUNT_1_P3', 'ADJUSTMENT REASON_1 CODE_P3', 'ADJUSTMENT REASON_1 DESCRIPTION_P3',
      'ADJUSTMENT AMOUNT_2_P3', 'ADJUSTMENT REASON_2 CODE_P3', 'ADJUSTMENT REASON_2 DESCRIPTION_P3', 'ADJUSTMENT AMOUNT_3_P3', 'ADJUSTMENT REASON_3 CODE_P3', 'ADJUSTMENT REASON_3 DESCRIPTION_P3',
      'PROCEDURE CODE 4', 'MODIFIER 4', 'ALLOWED UNITS 4', 'BILLED UNITS 4', 'CHARGE AMOUNT 4', 'ALLOWED AMOUNT 4', 'PAID AMOUNT 4',
      'ADJUSTMENT AMOUNT_0_P4', 'ADJUSTMENT REASON_0 CODE_P4', 'ADJUSTMENT REASON_0 DESCRIPTION_P4', 'ADJUSTMENT AMOUNT_1_P4', 'ADJUSTMENT REASON_1 CODE_P4', 'ADJUSTMENT REASON_1 DESCRIPTION_P4',
      'ADJUSTMENT AMOUNT_2_P4', 'ADJUSTMENT REASON_2 CODE_P4', 'ADJUSTMENT REASON_2 DESCRIPTION_P4', 'ADJUSTMENT AMOUNT_3_P4', 'ADJUSTMENT REASON_3 CODE_P4', 'ADJUSTMENT REASON_3 DESCRIPTION_P4'
    ];

    const wb = XLSX.utils.book_new();
    //Convert JSON to sheet data
    const sheetData = XLSX.utils.json_to_sheet(result);
    XLSX.utils.sheet_add_aoa(sheetData, [fields], { origin: "A1" });
    XLSX.utils.book_append_sheet(wb, sheetData, 'Sheet 1');
    const sheetDataBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer', bookSST: false });

    var params = {
      Bucket: process.env.S3_BUCKET_NAME, // your bucket name,
      Key: 'export/' + userEmail + '/patient_detail_' + Math.floor(Math.random() * 10000) + '.xlsx', // path to the object you're looking for
      Body: sheetDataBuffer
    }
    s3.putObject(params, function (err, data) {
      if (err)
        console.log('ERROR', err);
      else {
        console.log('UPLOADED SUCCESS');
      }
    });

    let data = JSON.stringify(params.Key);

    return callback(null, {
      statusCode: 200,
      body: data,
      headers: headers
    });
  } catch (err) {
    console.log("error : ", err);
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({ error: err.join(" ") }),
      headers: headers,
    });
  } finally {
    await db.close();
  }
};