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

exports.saveAdminUsers = async (event, context, callback) => {
  console.log("******Entering addSuperAdmin********");
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

    /// checking user is SuperAdmin or not
    const preconfiguredsuperAdminQuery =
      "select * from preconfigured_users where user_email = ? and role='Platform Admin'";
    const preconfiguredRecords = await db.query(preconfiguredsuperAdminQuery, [userEmail]);
    console.log("preconfiguredRecords" + preconfiguredRecords);
    if (preconfiguredRecords.length === 0) {
      return callback(null, {
        statusCode: 502,
        body: JSON.stringify({
          error: "User is not Platform Admin. Please contact Beats Health for access.",
        }),
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
          "X-Requested-With": "*",
        },
      });
    }
    if (payLoad != null && payLoad != undefined && payLoad.length > 0) {
      for (var i = 0; i < payLoad.length; i++) {
        // adding multiple admin/ super users in users table
        let user = payLoad[i];
        console.log("User in loop " + user);
        if (user.preconfigured_users_id == null || user.preconfigured_users_id == "") {
          var query = "insert into preconfigured_users SET ?";
          var bindParams = {
            organization_name: user.organization_name,
            user_email: user.user_email,
            role: user.role,
            status: user.status,
            created_by: userEmail,
            created_on: currentDateTime(),
            modified_by: userEmail,
            modified_on: currentDateTime(),
          };
          await db.query(query, bindParams);
        } else {
          var updatePreConfigQuery = "update preconfigured_users SET status = '" + user.status + "'";
          updatePreConfigQuery = updatePreConfigQuery + " where preconfigured_users_id = " + user.preconfigured_users_id + "";
          console.log("updatePreConfigQuery " + updatePreConfigQuery);
          await db.query(updatePreConfigQuery);

          var statusUpdateQuery = "update users set status= '" + user.status + "' where users_id in (select users_id from (";
          statusUpdateQuery = statusUpdateQuery + "select users_id from users where created_by= '" + user.user_email + "') as t)";
          console.log("statusUpdateQuery " + statusUpdateQuery);
          await db.query(statusUpdateQuery);
        }
      }
    }
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ message: "success" }),
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

exports.fetchAdminUsers = async (event, context, callback) => {
  console.log("******Entering fetchAdminUsers********");
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  });
  try {
    const userEmail = event.requestContext.authorizer.claims["email"];
    console.log("User email " + userEmail);

    /// checking user is SuperAdmin or not
    var preconfiguredsuperAdminQuery =
      "select * from preconfigured_users where user_email = ? and role='Platform Admin'";
    var preconfiguredRecords = await db.query(preconfiguredsuperAdminQuery, [userEmail]);
    if (preconfiguredRecords.length === 0) {
      return callback(null, {
        statusCode: 502,
        body: JSON.stringify({
          error: "User is not Platform Admin. Please contact Beats Health for access.",
        }),
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
          "X-Requested-With": "*",
        },
      });
    }
    var allPreconfiguredQuery =
      "select * from preconfigured_users where created_by = ?";
    var allPreconfiguredRecords = await db.query(allPreconfiguredQuery, [userEmail]);
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(allPreconfiguredRecords),
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