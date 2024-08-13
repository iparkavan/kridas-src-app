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
let CognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: process.env.region,
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

var headers = {
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods":
    "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
  "X-Requested-With": "*",
};


exports.saveAdminConfig = async (event, context, callback) => {
  console.log("******Entering saveAdminConfig*******");
  console.log("Event : ", JSON.stringify(event));
  const userId = event.requestContext.authorizer.claims["sub"];
  const userEmail = event.requestContext.authorizer.claims["email"];
  const payLoad = JSON.parse(event.body);
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  });
  try {
    var query = "select users_id from users where email='" + userEmail + "'";
    let result = await db.query(query);
    var fromUserId = result[0].users_id;
    console.log(" userEmail : ", userEmail);
    query = "insert into admin_config SET ?";
    var bindParams = {
      "dashboard_cleanup_frequency": payLoad.dashboardCleanupFrequency,
      "summary_status_cleanup": payLoad.summaryStatusCleanup,
      "company_domain": payLoad.companyDomain,
      "created_by": userEmail,
      "created_on": currentDateTime(),
      "modified_by": userEmail,
      "modified_on": currentDateTime(),
      "users_id": fromUserId
    };
    console.log(bindParams);
    await db.query(query, bindParams);
    //for manage client 
    if (null != payLoad.clients && undefined != payLoad.clients) {
      for (var i = 0; i < payLoad.clients.length; i++) {
        var query2 = "insert into client SET ?";
        var bindParams2 = {
          "name": payLoad.clients[i].clientName,
          "description": payLoad.clients[i].clientDescription,
          "created_by": userEmail,
          "created_on": currentDateTime(),
        };
        await db.query(query2, bindParams2);
      }
    }

    for (var i = 0; i < payLoad.users.length; i++) {
      let cognitoUserID;
      try {
        var data = await CognitoIdentityServiceProvider.signUp({
          ClientId: process.env.ClientId,
          Username: payLoad.users[i].email,
          Password: process.env.DefaultPass,
        })
          .promise();
        console.log("Cognito User ID", data.UserSub);
        cognitoUserID = data.UserSub;
        var query2 = "insert into users SET ?";
        var bindParams2 = {
          "userid": payLoad.users[i].firstName.substring(0, 3) + payLoad.users[i].lastName.substring(0, 3),
          "first_name": payLoad.users[i].firstName,
          "last_name": payLoad.users[i].lastName,
          "email": payLoad.users[i].email,
          "cognito_id": cognitoUserID,
          "role": "User",
          "created_by": userEmail,
          "created_on": currentDateTime(),
          "modified_by": userEmail,
          "modified_on": currentDateTime()
        };
        let result = await db.query(query2, bindParams2);
        var userRowId = result.insertId;
        console.log("created Row ID is =", userRowId);

        if (null != payLoad.users[i].clients && payLoad.users[i].clients.length > 0) {
          for (var j = 0; j < payLoad.users[i].clients.length; j++) {
            var query4 = "insert into user_client SET ?";
            var bindParams4 = {
              "users_id": userRowId,
              "client_id": payLoad.users[i].clients[j],
            };
            await db.query(query4, bindParams4);
          }
        }


      }

      catch (error) {
        console.log("error:", error);
        return callback(null, {
          statusCode: 502,
          body: JSON.stringify({ error: error.message }),
          headers: headers,
        });
      };
    }


    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ msg: "Configuration Created" }),
      headers: headers,
    });
  } catch (err) {
    console.log("error while fetching service Type data", err);
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({ error: err.join(" ") }),
      headers: headers,
    });
  } finally {
    await db.close();
  }
};

exports.fetchAdminConfig = async (event, context, callback) => {
  console.log("******Entering fetchAdminConfig********");
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
    var query = "select admin_config_id as adminConfigId,dashboard_cleanup_frequency as dashboardCleanupFrequency,summary_status_cleanup as summaryStatusCleanup,company_domain as companyDomain from admin_config where users_id in (select users_id from users where email='" + userEmail + "')";
    let result = await db.query(query);
    console.log("query : ", query);
    console.log("result :", JSON.stringify(result));
    var successResponse = result[0] == undefined ? {} : result[0];
    console.log("successResponse : ", JSON.stringify(successResponse));
    var query1 = "select users_id,userid,first_name as firstName,last_name as lastName,email,role from users where created_by='" + userEmail + "' and role='User'";
    let result1 = await db.query(query1);
    console.log("result1 : ", result1);
    successResponse.users = result1;
    // adding client-id along with users
    for (var i = 0; i < successResponse.users.length; i++) {
      var clientQuery = "select distinct client_id from user_client where users_id = ?";
      var clientResult = await db.query(clientQuery, successResponse.users[i].users_id);
      let clientData = clientResult.map(function (element) {
        return element.client_id;
      })
      successResponse.users[i].clients = clientData;
    }
    var query2 = "select client_id as clientId,name as clientName,description as clientDescription from client where created_by='" + userEmail + "'";
    let result2 = await db.query(query2);
    console.log("result2 : ", result2);
    successResponse.clients = result2;
    let data = JSON.stringify(successResponse);

    return callback(null, {
      statusCode: 200,
      body: data,
      headers: headers
    });

  } catch (err) {
    console.log("error while fetching service Type data", err);
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({ error: error.join(" ") }),
      headers: headers,
    });
  } finally {
    await db.close();
  }
};

exports.updateAdminConfig = async (event, context, callback) => {
  console.log("******Entering updateAdminConfig********");
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  });
  try {
    const userId = event.requestContext.authorizer.claims["sub"];
    const userEmail = event.requestContext.authorizer.claims["email"];
    const payLoad = JSON.parse(event.body);

    console.log("payLoad" + JSON.stringify(payLoad));
    var query = "update admin_config set dashboard_cleanup_frequency=?, summary_status_cleanup=?,company_domain=?,modified_by=? where admin_config_id=?";
    var bindParams = [payLoad.dashboardCleanupFrequency, payLoad.summaryStatusCleanup, payLoad.companyDomain, userEmail, payLoad.adminConfigId];
    await db.query(query, bindParams);

    payLoad.users.sort((a, b) => (a.operation < b.operation) ? 1 : -1);
    console.log("Payload users " + JSON.stringify(payLoad.users));
    for (var i = 0; i < payLoad.users.length; i++) {
      if (payLoad.users[i].operation == "d") {
        //delete the entries from user_client table
        var query5 = "delete from user_client where users_id = ?";
        await db.query(query5, [payLoad.users[i].users_id]);

        //delete the entry of user from user table
        var query1 = "delete from users where email = ?";
        await db.query(query1, [payLoad.users[i].email]);

        //Delete from Cognito
        console.log("User pool ID " + process.env.UserPoolId);
        await CognitoIdentityServiceProvider.adminDeleteUser({
          UserPoolId: process.env.UserPoolId,
          Username: payLoad.users[i].email
        })
          .promise()
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.log("error:", error);
            return callback(null, {
              statusCode: 502,
              body: JSON.stringify({ error: error.message }),
              headers: headers,
            });
          });
      } else if (payLoad.users[i].operation == "c") {
        let cognitoUserID;
        try {
          var data = await CognitoIdentityServiceProvider.signUp({
            ClientId: process.env.ClientId,
            Username: payLoad.users[i].email,
            Password: process.env.DefaultPass,
          })
            .promise();
          console.log("Cognito User ID", data.UserSub);
          cognitoUserID = data.UserSub;
          var query2 = "insert into users SET ?";
          var bindParams2 = {
            "userid": payLoad.users[i].firstName.substring(0, 3) + payLoad.users[i].lastName.substring(0, 3),
            "first_name": payLoad.users[i].firstName,
            "last_name": payLoad.users[i].lastName,
            "email": payLoad.users[i].email,
            "cognito_id": cognitoUserID,
            "role": "User",
            "created_by": userEmail,
            "modified_by": userEmail
          };
          let result = await db.query(query2, bindParams2);
          var userRowId = result.insertId;
          console.log("created Row ID is =", userRowId);

          if (null != payLoad.users[i].clients && payLoad.users[i].clients.length > 0) {
            for (let j = 0; j < payLoad.users[i].clients.length; j++) {
              var query4 = "insert into user_client SET ?";
              var bindParams4 = {
                "users_id": userRowId,
                "client_id": payLoad.users[i].clients[j],
              };
              await db.query(query4, bindParams4);
            }
          }
        }
        catch (error) {
          console.log("error:", error);
          return callback(null, {
            statusCode: 502,
            body: JSON.stringify({ error: error.message }),
            headers: headers,
          });
        };
      }
    }
    //adding and deleting client
    for (var i = 0; i < payLoad.clients.length; i++) {
      if (payLoad.clients[i].operation == "c") {
        var query2 = "insert into client SET ?";
        var bindParams2 = {
          "name": payLoad.clients[i].clientName,
          "description": payLoad.clients[i].clientDescription,
          "created_by": userEmail,
          "created_on": currentDateTime(),
        };
        await db.query(query2, bindParams2);
      } else if (payLoad.clients[i].operation == "d") {
        var query8 = "delete from user_client where client_id = ?";
        await db.query(query8, [payLoad.clients[i].client_id]);
        var query1 = "delete from client where client_id = ?";
        await db.query(query1, [payLoad.clients[i].client_id]);
      }
    }
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ msg: "Configuration Updated" }),
      headers: headers,
    });
  } catch (err) {
    console.log("error while fetching service Type data", err);
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({ error: error.join(" ") }),
      headers: headers,
    });
  } finally {
    await db.close();
  }
};
