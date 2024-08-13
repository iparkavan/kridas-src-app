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

const util = require("util");
const mysql = require("mysql");

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

exports.saveSubscriberDetails = async (event, context, callback) => {
  console.log("******Entering saveSubscriberDetails********");
  console.log("Event.body :: ", event.body);
  const userId = event.requestContext.authorizer.claims["sub"];
  console.log("userId : ", userId);
  const userEmail = event.requestContext.authorizer.claims["email"];
  console.log("userEmail : ", userEmail);
  const payLoad = JSON.parse(event.body);
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  });
  var query = "insert into address SET ?";
  var bindParams = {
    "address_type": 'physicalAddress',
    "address_line1": payLoad.physicalAddress.addressLine1,
    "address_line2": payLoad.physicalAddress.addressLine2,
    "country": payLoad.physicalAddress.country,
    "state": payLoad.physicalAddress.state,
    "city": payLoad.physicalAddress.city,
    "zip_code": payLoad.physicalAddress.zip,
    "work_email": payLoad.physicalAddress.workEmail,
    "contact_number": payLoad.physicalAddress.contactNmbr,
    "created_by": userEmail,
    "created_on": currentDateTime(),
    "modified_by": userEmail,
    "modified_on": currentDateTime()
  };
  try {
    let result = await db.query(query, bindParams);
    var physicalAddressId = result.insertId;

    var bindParams1 = {
      "address_type": 'blngInvcAddress',
      "address_line1": payLoad.blngInvcAddress.addressLine1,
      "address_line2": payLoad.blngInvcAddress.addressLine2,
      "country": payLoad.blngInvcAddress.country,
      "state": payLoad.blngInvcAddress.state,
      "city": payLoad.blngInvcAddress.city,
      "zip_code": payLoad.blngInvcAddress.zip,
      "work_email": payLoad.blngInvcAddress.workEmail,
      "contact_number": payLoad.blngInvcAddress.contactNmbr,
      "created_by": userEmail,
      "created_on": currentDateTime(),
      "modified_by": userEmail,
      "modified_on": currentDateTime()
    };
    let result2 = await db.query(query, bindParams1);
    var blngInvcAddressId = result2.insertId;

    query = "insert into subscriber_details SET ?";
    var bindParams2 = {
      "cognito_user_id": userId,
      "is_company_user_registered": payLoad.cmpnyRegInUs,
      "ein": payLoad.ein,
      "entity_type": payLoad.entryType,
      "legal_name_of_company": payLoad.cmpnyLegalNm,
      entity_registered_state: payLoad.registeredState,
      "physical_address": physicalAddressId,
      "invoice_address": blngInvcAddressId,
      "created_by": userEmail,
      "created_on": currentDateTime(),
      "modified_by": userEmail,
      "modified_on": currentDateTime()
    };
    await db.query(query, bindParams2);

    //await db.close();
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ msg: "successfully added the subscriber" }),
      headers: {
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
        "X-Requested-With": "*",
      },
    });
  } catch (err) {
    console.log("error while fetching service Type data", err);
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({ error: err.join(" ") }),
      headers: {
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
        "X-Requested-With": "*",
      },
    });
    // handle the error
  } finally {
    await db.close();
  }
};


exports.fetchSubscriberDetails = async (event, context, callback) => {
  console.log("******Entering fetchSubscriberDetails********");
  console.log("event : ", event);
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  });
  try {
    const userId = event.requestContext.authorizer.claims["sub"];
    var query = "select subscriber_details_id as subscriberDetailsId,physical_address,invoice_address,is_company_user_registered as cmpnyRegInUs,ein,entity_type as entryType,entity_registered_state as registeredState,legal_name_of_company as cmpnyLegalNm from subscriber_details where cognito_user_id='" + userId + "'";
    let result = await db.query(query);
    console.log("result : ", result);
    console.log("result : ", JSON.stringify(result));
    var successResponse = result[0];
    console.log("successResponse : ", JSON.stringify(successResponse));
    var query1 = "select * from address where address_id=" + successResponse.physical_address;
    var query2 = "select * from address where address_id=" + successResponse.invoice_address;
    let result1 = await db.query(query1);
    let result2 = await db.query(query2);
    console.log("result1 : ", result1);
    console.log("result1 : ", result2);
    successResponse.physicalAddress = {};
    successResponse.blngInvcAddress = {};
    successResponse.physicalAddress = result1[0];
    successResponse.blngInvcAddress = result2[0];
    let data = JSON.stringify(successResponse);

    return callback(null, {
      statusCode: 200,
      body: data,
      headers: {
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
        "X-Requested-With": "*",
      },
    });
  } catch (err) {
    console.log("error while fetching service Type data", err);
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({ error: error.join(" ") }),
      headers: {
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
        "X-Requested-With": "*",
      },
    });
    // handle the error
  } finally {
    await db.close();
  }
};


exports.updateSubscriberDetails = async (event, context, callback) => {
  console.log("******Entering updateSubscriberDetails********");
  console.log("event : ", event);
  const userId = event.requestContext.authorizer.claims["sub"];
  console.log("userId : ", userId);
  const userEmail = event.requestContext.authorizer.claims["email"];
  console.log("userEmail : ", userEmail);

  const payLoad = JSON.parse(event.body);
  console.log("payload :", payLoad);
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  });
  try {

    var addressQuery = "update address set address_line1=?, address_line2=?,country=?,state=?,city=?,zip_code=?,work_email=?,contact_number=?,modified_by=?,modified_on=? where address_id=?";

    var physicalAddressParams = [payLoad.physicalAddress.address_line1, payLoad.physicalAddress.address_line2, payLoad.physicalAddress.country,
    payLoad.physicalAddress.state, payLoad.physicalAddress.city, payLoad.physicalAddress.zip_code, payLoad.physicalAddress.work_email,
    payLoad.physicalAddress.contact_number, userEmail, currentDateTime(), payLoad.physicalAddress.address_id];

    var billingAddressParams = [payLoad.blngInvcAddress.address_line1, payLoad.blngInvcAddress.address_line2, payLoad.blngInvcAddress.country,
    payLoad.blngInvcAddress.state, payLoad.blngInvcAddress.city, payLoad.blngInvcAddress.zip_code, payLoad.blngInvcAddress.work_email,
    payLoad.blngInvcAddress.contact_number, userEmail, currentDateTime(), payLoad.blngInvcAddress.address_id];

    await db.query(addressQuery, physicalAddressParams);
    await db.query(addressQuery, billingAddressParams);

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ msg: "successfully updated the subscriber address details" }),
      headers: {
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
        "X-Requested-With": "*",
      },
    });
  } catch (err) {
    console.log("error while updating the subscriber address details", err);
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({ error: error.join(" ") }),
      headers: {
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
        "X-Requested-With": "*",
      },
    });
    // handle the error
  } finally {
    await db.close();
  }
};
