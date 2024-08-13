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
const util = require("util");
const mysql = require("mysql");

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESSKEYID,
  secretAccessKey: process.env.S3_SECRETACCESSKEY,
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

exports.fetchScreenStatus = async (event, context, callback) => {
  console.log("******Entering fetchScreenStatus********");
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  });
  try {
    const userEmail = event.requestContext.authorizer.claims["email"];
    const adminConfigQuery = "select admin_config_id from admin_config where created_by = ?";
    const adminRecords = await db.query(adminConfigQuery, [userEmail]);
    console.log("adminRecords" + adminRecords);
    let response = {};
    response.screenToNavigate = "HOME";
    if (adminRecords.length === 0) {
      response.screenToNavigate = "ADMIN_CONFIG";
    }
    let data = JSON.stringify(response);
    return callback(null, {
      statusCode: 200,
      body: data,
      headers: headers
    });
  } catch (err) {
    console.log("error while fetching admin config data", err);
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({ error: error.join(" ") }),
      headers: headers,
    });
  } finally {
    await db.close();
  }
};

exports.fetchPresignedUrlForUpload = async (event, context, callback) => {
  console.log("******Entering getPresignedUrlForUpload********");
  console.log("Event BODY: ", event.body);
  if (!event && !event.body) {
    throw new Error('No payload has been received');
  }
  const body = JSON.parse(event.body);

  if (!body.key) {
    throw new Error('Invalid payload');
  }
  console.log("Key: ", body.key);
  console.log("Bucket Name " + process.env.S3_BUCKET_NAME);
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${body.key}`,
    Expires: 300
  };

  try {
    const presignedUrl = await s3.getSignedUrlPromise('putObject', params);
    console.log('The presigned URL is:', presignedUrl);
    let data = JSON.stringify(presignedUrl);
    return callback(null, {
      statusCode: 200,
      body: data,
      headers: headers
    });
  } catch (error) {
    console.error('Error while generating presigned URL:', error.message);
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({ error: error.join(" ") }),
      headers: headers,
    });
  }
};

exports.fetchPresignedUrlForDownload = async (event, context, callback) => {
  console.log("******Entering fetchPresignedUrlForDownload********");
  console.log("Eveent BODY: ", event.body);
  if (!event && !event.body) {
    throw new Error('No payload has been received');
  }
  const body = JSON.parse(event.body);

  if (!body.key) {
    throw new Error('Invalid payload');
  }
  console.log("Key: ", body.key + " Bucket Name " + process.env.S3_BUCKET_NAME);
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${body.key}`,
    Expires: 300
  };

  try {
    const presignedUrl = await s3.getSignedUrlPromise('getObject', params);
    console.log('The presigned URL is:', presignedUrl);
    let data = JSON.stringify(presignedUrl);
    return callback(null, {
      statusCode: 200,
      body: data,
      headers: headers
    });
  } catch (error) {
    console.error('Error while generating presigned URL:', error.message);
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({ error: error.join(" ") }),
      headers: headers,
    });
  }
};

exports.mappingQueueNotification = async (event, context, callback) => {
  console.log("******Entering mappingQueueNotification********");
  console.log("event body: ", event.body);
  try {
    var params = {
      DelaySeconds: 0,
      MessageBody: event.body,
      QueueUrl: process.env.MAPPING_QUEUE
    };
    console.log("params :", JSON.stringify(params));
    var result = await sqs.sendMessage(params).promise();
    console.log("Result :", result);
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ msg: "Successfully Queued" }),
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
    //await db.close();
  }
};

exports.fetchLastUploadInfo = async (event, context, callback) => {
  console.log("******Entering fetchLastUploadStatus********");
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  });
  try {
    const userEmail = event.requestContext.authorizer.claims["email"];
    const payerMappingQuery = "select file_type,file_processing_status,created_on from file_upload where file_type = 'payer_mapping' and created_by = ? order by created_on desc";
    const payerMappingRecords = await db.query(payerMappingQuery, [userEmail]);
    console.log("payerMappingRecords" + payerMappingRecords);
    let response = [];
    if (payerMappingRecords.length > 0) {
      response.push({
        "file_type": payerMappingRecords[0].file_type,
        "file_processing_status": payerMappingRecords[0].file_processing_status,
        "created_on": payerMappingRecords[0].created_on,
      });
    }
    const groupMappingQuery = "select file_type,file_processing_status,created_on from file_upload where file_type = 'group_mapping' and created_by = ? order by created_on desc";
    const groupMappingRecords = await db.query(groupMappingQuery, [userEmail]);
    console.log("groupMappingRecords" + groupMappingRecords);
    if (groupMappingRecords.length > 0) {
      response.push({
        "file_type": groupMappingRecords[0].file_type,
        "file_processing_status": groupMappingRecords[0].file_processing_status,
        "created_on": groupMappingRecords[0].created_on,
      });
    }
    let data = JSON.stringify(response);
    console.log("Final Data" + data);
    return callback(null, {
      statusCode: 200,
      body: data,
      headers: headers
    });
  } catch (err) {
    console.log("error while fetching last upload info", err);
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({ error: error.join(" ") }),
      headers: headers,
    });
  } finally {
    await db.close();
  }
};
