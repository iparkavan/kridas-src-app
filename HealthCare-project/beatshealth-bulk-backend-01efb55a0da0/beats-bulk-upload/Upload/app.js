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
const batch = new AWS.Batch({ apiVersion: "2016-08-10" });

const util = require("util");
const mysql = require("mysql");

function currentDateTime() {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return date + " " + time;
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
  "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
  "X-Requested-With": "*",
};

exports.queueNotification = async (event, context, callback) => {
  console.log("******Entering queueNotification********");
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
    const payload = JSON.parse(event.body);
    console.log("userEmail " + userEmail);
    console.log("payload" + JSON.stringify(payload));
    const region = process.env.region;
    const accessKeyId = process.env.accessKeyId;
    const secretAccessKey = process.env.secretAccessKey;
    var query = "insert into file_upload SET ?";
    var bindParams = {
      file_name: payload.file_name,
      file_type: payload.file_type,
      widget_name: payload.widget_name,
      s3_bucket_url: payload.file_path,
      file_processing_status: "Processing",
      created_by: userEmail,
      created_on: currentDateTime(),
      modified_by: userEmail,
      modified_on: currentDateTime(),
    };
    console.log("File Upload Insert Params ", bindParams);

    var result = await db.query(query, bindParams);
    var fileUploadId = result.insertId.toString();
    console.log("fileUploadId " + fileUploadId);
    const params = {
      jobDefinition: "beats-bulk-upload-job",
      jobName: "beats-bulk-upload",
      jobQueue: "beats-bulk-upload-queue",
      containerOverrides: {
        environment: [
          {
            name: "EMAIL",
            value: payload.email,
          },
          {
            name: "FILE_UPLOAD_ID",
            value: fileUploadId,
          },
          {
            name: "FILE_TYPE",
            value: payload.file_type,
          },
          {
            name: "FILE_PATH",
            value: payload.file_path,
          },
          {
            name: "REGION",
            value: region,
          },
          {
            name: "ACCESS_KEY",
            value: accessKeyId,
          },
          {
            name: "SECRET_KEY",
            value: secretAccessKey,
          },
        ],
      },
    };

    console.log("params " + JSON.stringify(params));

    batch.submitJob(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(data);
        console.log("Job ID " + data.jobId);
      }
    });
    
    console.log("Batch submitted");
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        msg: "Successfully submitted job",
        fileUploadId: fileUploadId,
      }),
      headers: headers,
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

exports.getPayerNames = async (event, context, callback) => {
  
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  });

  const payLoad = JSON.parse(event.body);
  const recordType = payLoad.recordType;
  console.log("******Getting Payer Names********");
  const query =
    "select claims_payer_id, external_payer_name from payer_mapping where claims_enrollment_required != 'N/A'";
  if (recordType === "eligibility") {
    query =
      "select eligibility_payer_id, external_payer_name from payer_mapping where eligibility_enrollment_required != 'N/A'";
  }
  console.log("Query " + query);
  
  try {
    let result = await db.query(query);
    let data = JSON.stringify(result);
    await db.close();
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
    console.log("error while fetching payer name data", err);
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
