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

AWS.config.setPromisesDependency(require("bluebird"));
const util = require("util");
const mysql = require("mysql");
const { Parser } = require('json2csv');
const XLSX = require("xlsx");

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESSKEYID,
  secretAccessKey: process.env.S3_SECRETACCESSKEY
});

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

exports.fetchSummaryDashboard = async (event, context, callback) => {
  console.log("******Entering fetchSummaryDashboard******");
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
    var summaryQuery = "select summary_status_cleanup from admin_config where created_by=(select A.created_by from users A where A.email='" + userEmail + "')";
    let summaryResult = await db.query(summaryQuery);
    var adminUser = "select role from users where email ='" + userEmail + "'";
    let adminResult = await db.query(adminUser);
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

    if (adminResult[0].role === "Admin") {
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


    var query = "select a.file_upload_id, a.file_type, a.file_processing_status, a.created_on,a.widget_name,a.s3_bucket_url,a.comments,a.modified_on,b.first_name,b.last_name,b.email from file_upload a, users b where a.file_type in ('claims','eligibility') and a.summary_dashboard_display=1 and a.created_by=b.email and a.created_by in (" + userEmails + ") and a.created_on >= DATE(NOW()) + INTERVAL -" + summaryResult[0].summary_status_cleanup + " DAY AND a.created_on < DATE(NOW()) + INTERVAL " + summaryResult[0].summary_status_cleanup + " DAY";
    console.log("Query for fetchSummary " + query);
    let result = await db.query(query);

    var preconfiguredUsers = "select user_email,organization_name from preconfigured_users where user_email in (" + userEmails + ")";
    let preConfiguredResult = await db.query(preconfiguredUsers);
    let preconfiguredObj = {};
    if (null != preConfiguredResult && undefined != preConfiguredResult) {
      for (var i = 0; i < preConfiguredResult.length; i++) {
        preconfiguredObj[preConfiguredResult[i].user_email] = preConfiguredResult[i].organization_name;
      }
    }
    console.log("preconfiguredObj " + JSON.stringify(preconfiguredObj));

    for (var i = 0; i < result.length; i++) {
      var query2 = "select processing_status,count(1) as total_processing from patient_eligibility where processing_status is not null and delete_flag ='N' and file_upload_id = " + result[i].file_upload_id + " group by processing_status";
      if (result[i].file_type === "claims") {
        query2 = "select processing_status,count(1) as total_processing from patient where processing_status is not null and delete_flag ='N' and file_upload_id = " + result[i].file_upload_id + " group by processing_status";
      }
      let result2 = await db.query(query2);
      result[i].processing_status = result2;
      result[i].total_processing = 0;
      if (result[i].first_name == null) {
        result[i].organization_name = preconfiguredObj[result[i].email];
      }
      for (var j = 0; j < result2.length; j++) {
        result[i].total_processing = result[i].total_processing + result2[j].total_processing;
      }
      var query3 = "select count(1) as era_count from claims_procedure a,patient_claims b,patient c where a.era_matched='Y' and a.patient_claims_id=b.patient_claims_id and b.patient_id=c.patient_id and c.file_upload_id=" + result[i].file_upload_id;
      let result3 = await db.query(query3);
      result[i].era_count = result3[0].era_count;
      console.log("Result object " + JSON.stringify(result[i]));
    }
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(result),
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

exports.saveWidgetName = async (event, context, callback) => {
  console.log("******Entering saveWidgetName********");
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
    var query = "update file_upload set widget_name='" + payLoad.widget_name + "' where file_upload_id=" + payLoad.file_upload_id;
    await db.query(query);
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ msg: "Widget saved successful" }),
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

exports.deleteWidget = async (event, context, callback) => {
  console.log("******Entering deleteWidget********");
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
    var query = "update file_upload set summary_dashboard_display=0 where file_upload_id=" + payLoad.file_upload_id;
    await db.query(query);
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ msg: 'widget deleted' }),
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


//export claim summary
exports.exportSummary = async (event, context, callback) => {
  console.log("******Entering exportSummary********");
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
    if (userQueryResult[0].role === "Admin") {
      let retrieveUserEmails = "select email from users where created_by ='" + userEmail + "'";
      let userEmailResult = await db.query(retrieveUserEmails);
      var tempEmail = [];
      for (var i = 0; i < userEmailResult.length; i++) {
        tempEmail.push(userEmailResult[i].email);
      }
      userEmails = tempEmail.join(',');
      userEmails = userEmails.replace(/,/g, "','");
      userEmails = "'" + userEmails + "'";
    } else {
      userEmails = "'" + userEmails + "'";
    }
    var query = "select first_name as 'PATIENT FIRST NAME',last_name as 'PATIENT LAST NAME',date_format(date_of_birth, '%m/%d/%Y') as 'DATE OF BIRTH', ";
    query = query + " date_format(from_date_of_service, '%m/%d/%Y') as 'FROM DATE OF SERVICE',date_format(to_date_of_service, '%m/%d/%Y') as 'TO DATE OF SERVICE',mrn_patient_account_no ";
    query = query + "as 'MRN',payer_alias as 'PAYER_ALIAS',st.service_type_name as 'SERVICE TYPE',member_id as 'MEMBER ID', p.provider_npi as 'RENDERING NPI',gmp.billing_npi as 'BILLING NPI',p.client_id as 'CLIENT ID',";
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
    query = query + "where p.record_type='claims' and p.delete_flag='N' ";
    query = query + "and p.file_upload_id=" + payLoad.file_upload_id + " ";
    if (payLoad.processing_status != null && payLoad.processing_status != '') {
      query = query + " and processing_status='" + payLoad.processing_status + "'";
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

//export Eligibility summary
exports.exportEligibilitySummary = async (event, context, callback) => {
  console.log("******Entering exportEligibilitySummary********");
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
    if (userQueryResult[0].role === "Admin") {
      let retrieveUserEmails = "select email from users where created_by ='" + userEmail + "'";
      let userEmailResult = await db.query(retrieveUserEmails);
      var tempEmail = [];
      for (var i = 0; i < userEmailResult.length; i++) {
        tempEmail.push(userEmailResult[i].email);
      }
      userEmails = tempEmail.join(',');
      userEmails = userEmails.replace(/,/g, "','");
      userEmails = "'" + userEmails + "'";
    } else {
      userEmails = "'" + userEmails + "'";
    }


    var query = "select first_name as 'PATIENT FIRST NAME',last_name as 'PATIENT LAST NAME',date_format(date_of_birth, '%m/%d/%Y') as 'DATE OF BIRTH', ";
    query = query + " date_format(from_date_of_service, '%m/%d/%Y') as 'FROM DATE OF SERVICE',date_format(to_date_of_service, '%m/%d/%Y') as 'TO DATE OF SERVICE',mrn_patient_account_no ";
    query = query + "as 'MRN',pc.payer_alias as 'PAYER ALIAS',st.service_type_name as 'SERVICE TYPE',member_id as 'MEMBER ID', ";
    query = query + "pc.provider_npi as 'RENDERING NPI',gmp.billing_npi as 'BILLING NPI',pc.client_id as 'CLIENT ID',relationship_to_subscriber as 'RELATIONSHIP TO SUBSCRIBER',pm.external_payer_name as 'PAYER NAME', ";
    query = query + "payer_id as 'EXTERNAL PAYER ID',p.eligibility_status as 'ELIGIBILITY STATUS',p.copay as 'COPAY',p.coinsurance as 'COINSURANCE',p.deductible as 'DEDUCTIBLE',p.limitations as 'LIMITATIONS', ";
    query = query + "p.out_of_pocket as 'OUT_OF_POCKET',gm.group_name as 'GROUP NAME',date_format(pc.created_on, '%m/%d/%Y') as 'UPLOADED DATE',date_format(pc.modified_on, '%m/%d/%Y %H:%i:%S') as 'LAST VERIFIED DATE',";
    query = query + "pc.processing_status as 'PROCESSING STATUS',pc.comments as 'COMMENTS', ";
    query = query + "pc.created_by as 'USER ID' ";
    query = query + " FROM patient_eligibility pc LEFT JOIN patient_insurance_records p ON p.patient_eligibility_id = pc.patient_eligibility_id ";
    query = query + "LEFT JOIN payer_alias pa ON pa.payer_alias_identifier = pc.payer_alias AND pa.created_by = '" + adminUser + "' AND pc.delete_flag = 'N' ";
    query = query + "LEFT JOIN payer_mapping pm ON pm.claims_payer_id = pc.payer_id and pm.payer_mapping_id = pa.payer_mapping_id ";
    query = query + "LEFT JOIN service_types st ON st.service_type_Id = pc.service_type_id LEFT JOIN group_mapping gmp ON gmp.provider_npi = pc.provider_npi AND gmp.created_by = '" + adminUser + "' ";
    query = query + "LEFT JOIN group_master gm ON gmp.group_master_id = gm.group_master_id WHERE pc.record_type='eligibility' and pc.delete_flag = 'N' "; // and pc.created_by in (" + userEmails + ") ";
    query = query + "and pc.file_upload_id=" + payLoad.file_upload_id + " ";
    if (payLoad.processing_status != null && payLoad.processing_status != '') {
      query = query + " and pc.processing_status='" + payLoad.processing_status + "'";
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
      Key: 'export/' + userEmail + '/patient_Eligibility_summary_' + Math.floor(Math.random() * 10000) + '.xlsx', // path to the object you're looking for
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
