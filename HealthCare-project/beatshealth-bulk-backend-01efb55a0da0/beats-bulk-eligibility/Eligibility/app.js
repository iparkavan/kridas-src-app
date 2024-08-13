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


exports.searchPatientEligibility = async (event, context, callback) => {
  console.log("******Entering searchPatientEligibility********");
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
      for (let j = 0; j < clientUserQueryResult.length; j++) {
        tempEmail.push(clientUserQueryResult[j].email)
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

    var totalRecordCount = 0;
    var query = "SELECT pc.*,gm.group_name,st.service_type_name,pm.external_payer_name,gmp.billing_npi,p.*, pc.patient_eligibility_id AS patient_eligibility_id";
    query = query + " FROM patient_eligibility pc LEFT JOIN patient_insurance_records p ON p.patient_eligibility_id = pc.patient_eligibility_id ";
    query = query + "LEFT JOIN payer_alias pa ON pa.payer_alias_identifier = pc.payer_alias AND pa.created_by = '" + adminUser + "' AND pc.delete_flag = 'N' ";
    query = query + "LEFT JOIN payer_mapping pm ON pm.claims_payer_id = pc.payer_id and pm.payer_mapping_id = pa.payer_mapping_id ";

    query = query + "LEFT JOIN service_types st ON st.service_type_Id = pc.service_type_id LEFT JOIN group_mapping gmp ON gmp.provider_npi = pc.provider_npi AND gmp.created_by = '" + adminUser + "' ";
    query = query + "LEFT JOIN group_master gm ON gmp.group_master_id = gm.group_master_id WHERE pc.delete_flag = 'N' AND pc.created_by IN ";
    query = query + " (" + userEmails + ")";
    if (payLoad.fromDate && payLoad.fromDate != "" && payLoad.toDate && payLoad.toDate != "") {
      query = query + " and DATE(pc.created_on) between '" + payLoad.fromDate + "' and '" + payLoad.toDate + "' "
    }
    if (payLoad.searchKey && payLoad.searchKey != "" && payLoad.searchValue && payLoad.searchValue != "") {
      console.log("Query " + query);
      let totalRecords = await db.query(query);
      totalRecordCount = totalRecords.length;
      var patientArray = ["from_date_of_service", "patient_name", "date_of_birth", "member_id",
        "eligibility_status", "mrn_patient_account_no", "provider_npi", "created_on", "processing_status",
        "service_name", "payer_name", "group_name", "payer_alias", "client_id", "payer_id"];
      var searchKey = payLoad.searchKey;
      var searchValue = payLoad.searchValue;
      if (payLoad.searchKey === "patient_eligibility_id") {
        searchKey = "pc." + searchKey;
        query = query + " and " + searchKey + " like '%" + searchValue + "%' "
      } else if (patientArray.indexOf(payLoad.searchKey) > -1) {
        if (payLoad.searchKey === "from_date_of_service" || payLoad.searchKey === "date_of_birth" ||
          payLoad.searchKey === "created_on") {
          searchKey = "DATE(pc." + searchKey + ")";
          query = query + " and " + searchKey + "='" + searchValue + "' "
        } else if (payLoad.searchKey === "service_name") {
          query = query + " and pc.service_type_id in (select service_type_id from service_types where service_type_name like '%" + searchValue + "%')";
        } else if (payLoad.searchKey === "payer_name") {
          query = query + " AND pc.payer_alias like '%" + searchValue + "%'";
        } else if (payLoad.searchKey === "group_name") {
          query = query + " AND gm.group_name like '%" + searchValue + "%'";
        } else if (payLoad.searchKey === "patient_name") {
          query = query + " and (pc.first_name like '%" + searchValue + "%' or pc.middle_name like '%" + searchValue + "%' or pc.last_name like '%" + searchValue + "%')"
        } else if (payLoad.searchKey === "eligibility_status") {
          searchKey = "p." + searchKey;
          query = query + " and " + searchKey + " like '%" + searchValue + "%' "
        } else {
          searchKey = "pc." + searchKey;
          query = query + " and " + searchKey + " like '%" + searchValue + "%' "
        }
      }
      console.log("searchValue" + searchValue);
    }
    console.log("Query " + query);
    let filteredResult = await db.query(query);
    for (let j = 0; j < filteredResult.length; j++) {
      filteredResult[j].service_type_id = filteredResult[j].service_type_name;
    }

    var successResponse = filteredResult;
    if (totalRecordCount === 0) {
      totalRecordCount = filteredResult.length;
    }
    console.log("Total Record count " + totalRecordCount);
    console.log("Filtered Record count " + filteredResult.length);
    console.log("Retrieved Eligibility Records " + JSON.stringify(successResponse));
    var searchResponse = {
      "totalRecordCount": totalRecordCount,
      "filteredRecordCount": filteredResult.length,
      "patientRecords": successResponse
    };
    console.log("Retrieved Eligibility Records " + JSON.stringify(searchResponse));
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


exports.deleteEligibility = async (event, context, callback) => {
  console.log("******Entering deleteEligibility********");
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
    console.log(payLoad);
    for (var i = 0; i < payLoad.length; i++) {
      console.log("Payload record " + JSON.stringify(payLoad[i]));
      if (payLoad[i].patient_eligibility_id != null && payLoad[i].patient_eligibility_id != "") {

        var query = "update patient_eligibility set delete_flag='Y' where patient_eligibility_id=" + payLoad[i].patient_eligibility_id;
        await db.query(query);
      }
      query = "select patient_eligibility_id from patient_eligibility where delete_flag='N' and patient_eligibility_id=" + payLoad[i].patient_eligibility_id;
      var claimRecords = await db.query(query);
      console.log("claimRecords " + JSON.stringify(claimRecords));
      if (claimRecords.length == 0) {
        query = "update patient_eligibility set delete_flag='Y' where patient_eligibility_id=" + payLoad[i].patient_eligibility_id;
        await db.query(query);
        console.log(query);
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

exports.saveEligibilityDetails = async (event, context, callback) => {
  console.log("******Entering saveEligibilityDetails********");
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
    var query = "insert into patient_eligibility SET ?";
    var bindParams = {
      "first_name": payLoad.patientFirstName,
      "middle_name": payLoad.patientMiddleName,
      "last_name": payLoad.patientLastName,
      "date_of_birth": payLoad.patientBirthDate,
      "from_date_of_service": payLoad.fromDateOfService,
      "to_date_of_service": payLoad.toDateOfService,
      "mrn_patient_account_no": payLoad.mrnPatientAccountNo,
      "payer_id": payLoad.payerId,
      "patient_unique_id": payLoad.patientUniqueId,
      "service_type_id": payLoad.serviceType,
      "member_id": payLoad.memberId,
      "relationship_to_subscriber": payLoad.relationship,
      "processing_status": "In Progress",
      "provider_npi": payLoad.providerNpi,
      "client_id": payLoad.clientID,
      "record_type": payLoad.recordType,
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
      'patient_unique_id': payLoad.patientUniqueId,
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
      QueueUrl: process.env.AVAILITY_ELIGIBILITY_INPUT_SQS
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


exports.exportEligibility = async (event, context, callback) => {
  console.log("******Entering exportEligibility********");
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
    query = query + "as 'MRN',pc.payer_alias as 'PAYER ALIAS',st.service_type_name as 'SERVICE TYPE',member_id as 'MEMBER ID', ";
    query = query + "pc.provider_npi as 'RENDERING NPI',gmp.billing_npi as 'BILLING NPI',pc.client_id as 'CLIENT ID',relationship_to_subscriber as 'RELATIONSHIP TO SUBSCRIBER',pm.external_payer_name as 'PAYER NAME', ";
    query = query + "payer_id as 'EXTERNAL PAYER ID',p.eligibility_status as 'ELIGIBILITY STATUS',p.copay as 'COPAY',p.coinsurance as 'COINSURANCE',p.deductible as 'DEDUCTIBLE',p.limitations as 'LIMITATIONS', ";
    query = query + "p.out_of_pocket as 'OUT_OF_POCKET',gm.group_name as 'GROUP NAME',date_format(pc.created_on, '%m/%d/%Y') as 'UPLOADED DATE',date_format(pc.modified_on, '%m/%d/%Y %H:%i:%S') as 'LAST VERIFIED DATE',";
    query = query + "processing_status as 'PROCESSING STATUS',pc.comments as 'COMMENTS', ";
    query = query + "pc.created_by as 'USER ID' ";
    query = query + " FROM patient_eligibility pc LEFT JOIN patient_insurance_records p ON p.patient_eligibility_id = pc.patient_eligibility_id ";
    query = query + "LEFT JOIN payer_alias pa ON pa.payer_alias_identifier = pc.payer_alias AND pa.created_by = '" + adminUser + "' AND pc.delete_flag = 'N' ";
    query = query + "LEFT JOIN payer_mapping pm ON pm.claims_payer_id = pc.payer_id and pm.payer_mapping_id = pa.payer_mapping_id ";
    query = query + "LEFT JOIN service_types st ON st.service_type_Id = pc.service_type_id LEFT JOIN group_mapping gmp ON gmp.provider_npi = pc.provider_npi AND gmp.created_by = '" + adminUser + "' ";
    query = query + "LEFT JOIN group_master gm ON gmp.group_master_id = gm.group_master_id WHERE pc.delete_flag = 'N'";
    query = query + "and pc.created_by in (" + userEmails + ")";


    if (payLoad.fromDate && payLoad.fromDate != "" && payLoad.toDate && payLoad.toDate != "") {
      query = query + " and DATE(pc.created_on) between '" + payLoad.fromDate + "' and '" + payLoad.toDate + "' "
    }
    if (payLoad.patientEligibilityIdList && payLoad.patientEligibilityIdList.length > 0) {
      query = query + "and ("
      for (var i = 0; i < payLoad.patientEligibilityIdList.length; i++) {
        query = query + "(";
        query = query + "pc.patient_eligibility_id=" + payLoad.patientEligibilityIdList[i].patientEligibilityId
        query = query + " )";
        if (i + 1 < payLoad.patientEligibilityIdList.length) {
          query = query + " or";
        }
      }
      query = query + " )";
    } else {
      if (payLoad.searchKey && payLoad.searchKey != "" && payLoad.searchValue && payLoad.searchValue != "") {
        console.log("Query " + query);
        let totalRecords = await db.query(query);
        totalRecordCount = totalRecords.length;
        var patientArray = ["from_date_of_service", "patient_name", "date_of_birth", "member_id",
          "eligibility_status", "mrn_patient_account_no", "provider_npi", "created_on", "processing_status",
          "service_name", "payer_alias_name", "group_name", "payer_alias", "client_id", "payer_id"];
        var searchKey = payLoad.searchKey;
        var searchValue = payLoad.searchValue;
        if (payLoad.searchKey === "patient_eligibility_id") {
          searchKey = "pc." + searchKey;
          query = query + " and " + searchKey + " like '%" + searchValue + "%' "
        } else if (patientArray.indexOf(payLoad.searchKey) > -1) {
          if (payLoad.searchKey === "from_date_of_service" || payLoad.searchKey === "date_of_birth" ||
            payLoad.searchKey === "created_on") {
            searchKey = "DATE(pc." + searchKey + ")";
            query = query + " and " + searchKey + "='" + searchValue + "' "
          } else if (payLoad.searchKey === "service_name") {
            query = query + " and pc.service_type_id in (select service_type_id from service_types where service_name like '%" + searchValue + "%')";
          } else if (payLoad.searchKey === "payer_alias_name") {
            query = query + " AND pa.payer_alias_name like '%" + searchValue + "%'";
          } else if (payLoad.searchKey === "group_name") {
            query = query + " AND gm.group_name like '%" + searchValue + "%'";
          } else if (payLoad.searchKey === "patient_name") {
            query = query + " and (pc.first_name like '%" + searchValue + "%' or pc.middle_name like '%" + searchValue + "%' or pc.last_name like '%" + searchValue + "%')"
          } else if (payLoad.searchKey === "eligibility_status") {
            searchKey = "p." + searchKey;
            query = query + " and " + searchKey + " like '%" + searchValue + "%' "
          } else {
            searchKey = "pc." + searchKey;
            query = query + " and " + searchKey + " like '%" + searchValue + "%' "
          }
        }
        console.log("searchValue" + searchValue);
      }
    }

    console.log("Query " + query);
    let result = await db.query(query);
    console.log("Result " + JSON.stringify(result));

    const fields = ['PATIENT FIRST NAME', 'PATIENT LAST NAME', 'DATE OF BIRTH', 'FROM DATE OF SERVICE', 'TO DATE OF SERVICE',
      'MRN', 'PAYER ALIAS', 'SERVICE TYPE', 'MEMBER ID', 'RENDERING NPI', 'BILLING NPI', 'CLIENT ID', 'RELATIONSHIP TO SUBSCRIBER', 'PAYER NAME',
      'EXTERNAL PAYER ID', 'ELIGIBILITY STATUS', 'COPAY', 'COINSURANCE', 'DEDUCTIBLE', 'LIMITATIONS', 'OUT_OF_POCKET',
      'GROUP NAME', 'UPLOADED DATE', 'LAST VERIFIED DATE', 'PROCESSING STATUS', 'COMMENTS', 'USER ID'
    ];

    const wb = XLSX.utils.book_new();
    //Convert JSON to sheet data
    const sheetData = XLSX.utils.json_to_sheet(result);
    XLSX.utils.sheet_add_aoa(sheetData, [fields], { origin: "A1" });
    XLSX.utils.book_append_sheet(wb, sheetData, 'Sheet 1');
    const sheetDataBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer', bookSST: false });

    var params = {
      Bucket: process.env.S3_BUCKET_NAME, // your bucket name,
      Key: 'export/' + userEmail + '/patient_Eligibility_' + Math.floor(Math.random() * 10000) + '.xlsx', // path to the object you're looking for
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





