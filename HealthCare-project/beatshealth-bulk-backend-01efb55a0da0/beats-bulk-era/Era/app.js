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


exports.searchEraDetails = async (event, context, callback) => {
  console.log("****** Entering search Patient ERA ********");
  console.log("event : ", event);
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  })
  try {
    const userEmail = event.requestContext.authorizer.claims["email"];
    const payLoad = JSON.parse(event.body);
    console.log("payLoad " + JSON.stringify(payLoad));
    console.log("User email " + userEmail);
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
    console.log(userEmails)
    var totalRecordCount = 0;
    var query = "SELECT e.era_id as era_id,e.claims_number as claims_number,e.patient_name as patient_name,e.procedure_code as procedure_code,e.qualifier,";
    query = query + "e.payer_name as payer_name,date_format(e.transaction_date, '%m/%d/%Y') as transaction_date,e.provider_name,";
    query = query + "e.user_id as user_id,date_format(e.processed_date, '%m/%d/%Y') as processed_date,e.matched_timestamp as matched_timestamp,";
    query = query + "e.modifier,e.allowed_units,e.billed_units,";
    query = query + "CONCAT('$',e.charge_amount) as charge_amount,CONCAT('$',e.allowed_amount) as allowed_amount,CONCAT('$',e.paid_amount) as paid_amount,";
    query = query + "e.era_matched as era_matched ";
    query = query + " from era e where created_by in ( " + userEmails + ")";
    if (payLoad.fromDate && payLoad.fromDate != "" && payLoad.toDate && payLoad.toDate != "") {
      query = query + " and DATE(e.created_on) between '" + payLoad.fromDate + "' and '" + payLoad.toDate + "' "
    }
    if (payLoad.searchKey && payLoad.searchKey != "" && payLoad.searchValue && payLoad.searchValue != "") {
      console.log("Query " + query);
      let totalRecords = await db.query(query);
      totalRecordCount = totalRecords.length;
      var patientArray = ["claims_number", "patient_name", "procedure_code", "transaction_date",
        "payer_name", "provider_name", "era_matched", "processed_date"];
      var searchKey = payLoad.searchKey;
      var searchValue = payLoad.searchValue;
      if (payLoad.searchKey === "claims_number") {
        searchKey = "e." + searchKey;
        query = query + " and " + searchKey + " like '%" + searchValue + "%' "
      } else if (patientArray.indexOf(payLoad.searchKey) > -1) {
        if (payLoad.searchKey === "transaction_date" || payLoad.searchKey === "processed_date") {
          searchKey = "DATE(e." + searchKey + ")";
          query = query + " AND " + searchKey + "='" + searchValue + "' "
        } else if (payLoad.searchKey === "patient_name" || payLoad.searchKey === "provider_name" ||
          payLoad.searchKey === "procedure_code" || payLoad.searchKey === "payer_name") {
          query = query + " AND e." + searchKey + " like '%" + searchValue + "%'";
        } else {
          searchKey = "e." + searchKey;
          query = query + " and " + searchKey + "='" + searchValue + "' ";
        }
      }
    }
    console.log("searchValue" + searchValue);
    console.log("Query " + query);
    let filteredResult = await db.query(query);
    var successResponse = filteredResult;
    if (totalRecordCount === 0) {
      totalRecordCount = filteredResult.length;
    }
    console.log("Total Record count " + totalRecordCount);
    console.log("Filtered Record count " + filteredResult.length);
    console.log("Retrieved Records " + JSON.stringify(successResponse));

    for (var i = 0; i < successResponse.length; i++) {
      if (null != successResponse[i].era_id) {
        query = "select a.adjustment_amount,a.adjustment_reason_code,a.adjustment_reason_description from adjustment as a where a.era_id = " + successResponse[i].era_id;
        console.log("adjustment query :", query)
        let result2 = await db.query(query);
        console.log("Result2 " + JSON.stringify(result2));
        successResponse[i].adjustmentInfo = result2;
      }
    }
    console.log("Record " + JSON.stringify(successResponse));
    var searchResponse = {
      "totalRecordCount": totalRecordCount,
      "filteredRecordCount": filteredResult.length,
      "patientRecords": successResponse
    };
    console.log("Retrieved era Records " + JSON.stringify(searchResponse));
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



exports.exportEra = async (event, context, callback) => {
  console.log("****** Entering Export ERA ********");
  console.log("event : ", event);
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  })
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

    var query = "select e.claims_number AS 'CLAIMS NUMBER', e.patient_name AS 'PATIENT NAME', e.procedure_code AS 'PROCEDURE CODE', e.modifier AS 'MODIFIER', ";
    query = query + "e.qualifier AS 'QUALIFIER' , e.allowed_units AS 'ALLOWED UNITS', e.billed_units AS 'BILLED UNITS', ";
    query = query + "date_format(e.transaction_date, '%m/%d/%Y') AS 'TRANSACTION DATE', CONCAT('$',e.charge_amount) AS 'CHARGE AMOUNT', ";
    query = query + "CONCAT('$',e.allowed_amount) AS 'ALLOWED AMOUNT',CONCAT('$',e.paid_amount) AS 'PAID AMOUNT', e.payer_name AS 'PAYER NAME',date_format(e.created_on, '%m/%d/%Y')  AS 'START DATE',";
    query = query + " date_format(e.modified_on, '%m/%d/%Y') AS 'END DATE',e.provider_name AS 'PROVIDER NAME', ";
    query = query + "e.created_by AS 'USER ID', e.processed_date AS 'PROCESSED DATE', date_format(e.matched_timestamp, '%m/%d/%Y %H:%i:%S') AS 'MATCHED TIMESTAMP', e.era_matched AS 'ERA MATCHED',e.era_id as era_id";
    query = query + " from era e where created_by in ( " + userEmails + ")";
    if (payLoad.fromDate && payLoad.fromDate != "" && payLoad.toDate && payLoad.toDate != "") {
      query = query + " and DATE(e.created_on) between '" + payLoad.fromDate + "' and '" + payLoad.toDate + "' "
    }
    if (payLoad.searchKey && payLoad.searchKey != "" && payLoad.searchValue && payLoad.searchValue != "") {
      console.log("Query " + query);
      let totalRecords = await db.query(query);
      totalRecordCount = totalRecords.length;
      var patientArray = ["claims_number", "patient_name", "procedure_code", "transaction_date",
        "payer_name", "provider_name", "era_matched", "processed_date"];
      var searchKey = payLoad.searchKey;
      var searchValue = payLoad.searchValue;
      if (payLoad.searchKey === "claims_number") {
        searchKey = "e." + searchKey;
        query = query + " and " + searchKey + " like '%" + searchValue + "%' "
      } else if (patientArray.indexOf(payLoad.searchKey) > -1) {
        if (payLoad.searchKey === "transaction_date" || payLoad.searchKey === "processed_date") {
          searchKey = "DATE(e." + searchKey + ")";
          query = query + " AND " + searchKey + "='" + searchValue + "' "
        } else if (payLoad.searchKey === "patient_name") {
          query = query + " AND e.patient_name like '%" + searchValue + "%'";
        } else if (payLoad.searchKey === "provider_name") {
          query = query + " AND e.provider_name like '%" + searchValue + "%'";
        } else if (payLoad.searchKey === "procedure_code") {
          query = query + " AND e.procedure_code like '%" + searchValue + "%'";
        } else if (payLoad.searchKey === "payer_name") {
          query = query + " AND e.payer_name like '%" + searchValue + "%'";
        } else {
          searchKey = "e." + searchKey;
          query = query + " and " + searchKey + "='" + searchValue + "' ";
        }
      }
    }
    console.log("searchValue" + searchValue);
    console.log("Query " + query);
    let result = await db.query(query);

    console.log("Retrieved ERA Records " + JSON.stringify(result));
    for (var i = 0; i < result.length; i++) {
      if (null != result[i].era_id) {
        query = "select * from adjustment where adjustment.era_id = " + result[i].era_id;
        console.log("adjustment query :", query)
        let result2 = await db.query(query);
        console.log("Result2 " + JSON.stringify(result2));
        for (var j = 0; j < result2.length; j++) {
          result[i]["ADJUSTMENT AMOUNT_" + j] = '$' + result2[j].adjustment_amount;
          result[i]["ADJUSTMENT REASON_" + j + " CODE"] = result2[j].adjustment_reason_code;
          result[i]["ADJUSTMENT REASON_" + j + " DESCRIPTION"] = result2[j].adjustment_reason_description;
        }
      }
      delete result[i].era_id;
    }
    console.log("Record " + JSON.stringify(result));

    const fields = ['CLAIMS NUMBER', 'PATIENT NAME', 'PROCEDURE CODE', 'MODIFIER', 'QUALIFIER',
      'ALLOWED UNITS', 'BILLED UNITS', 'TRANSACTION DATE', 'CHARGE AMOUNT', 'ALLOWED AMOUNT', 'PAID AMOUNT',
      'PAYER NAME', 'START DATE', 'END DATE', 'PROVIDER NAME', 'USER ID', 'PROCESSED DATE', 'MATCHED TIMESTAMP', 'ERA MATCHED',
      'ADJUSTMENT AMOUNT_0', 'ADJUSTMENT REASON_0 CODE', 'ADJUSTMENT REASON_0 DESCRIPTION',
      'ADJUSTMENT AMOUNT_1', 'ADJUSTMENT REASON_1 CODE', 'ADJUSTMENT REASON_1 DESCRIPTION',
      'ADJUSTMENT AMOUNT_2', 'ADJUSTMENT REASON_2 CODE', 'ADJUSTMENT REASON_2 DESCRIPTION',
      'ADJUSTMENT AMOUNT_3', 'ADJUSTMENT REASON_3 CODE', 'ADJUSTMENT REASON_3 DESCRIPTION'
    ];

    const wb = XLSX.utils.book_new();
    //Convert JSON to sheet data
    const sheetData = XLSX.utils.json_to_sheet(result);
    XLSX.utils.sheet_add_aoa(sheetData, [fields], { origin: "A1" });
    XLSX.utils.book_append_sheet(wb, sheetData, 'Sheet 1');
    const sheetDataBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer', bookSST: false });

    var params = {
      Bucket: process.env.S3_BUCKET_NAME, // your bucket name,
      Key: 'export/' + userEmail + '/patient_era_detail_' + Math.floor(Math.random() * 10000) + '.xlsx', // path to the object you're looking for
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
