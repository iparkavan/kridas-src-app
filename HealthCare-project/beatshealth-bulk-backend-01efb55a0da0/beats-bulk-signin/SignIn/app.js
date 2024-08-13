// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
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
let AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const util = require("util");
const mysql = require("mysql");
var headers = {
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
  "X-Requested-With": "*",
};

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

exports.getServiceType = async (event, context, callback) => {
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  });
  console.log("******Getting Service Types********");
  const Query = "select service_type_Id, service_name from service_types";
  try {
    let result = await db.query(Query);
    let data = JSON.stringify(result);
    console.log("Data " + data);
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
  } finally {
    await db.close();
  }
};
function asyncCognitoAuthentication(username, password, newPassword) {
  let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: username,
    Password: password,
  });
  let userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: process.env.UserPoolId,
    ClientId: process.env.ClientId,
  });
  const userData = {
    Username: username,
    Pool: userPool,
  };
  console.log("userData:", userData);

  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  console.log("cognitoUserDetails", cognitoUser);
  return new Promise(function (resolve, reject) {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        console.log("authenticate result", result);
        cognitoUser.changePassword(password, newPassword, (err, result) => {
          if (err) {
            console.log("Error while Changing password");
            reject(err);
          } else {
            console.log("Successfully changed password of the user.");
            console.log(result);
            resolve(result);
          }
        });
      },
      onFailure: function (err) {
        reject(err);
      },
    });
  });
}

exports.updateUser = async (event, context, callback) => {
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  });

  console.log("*****Update Field Function Start******");
  const payLoad = JSON.parse(event.body);
  console.log("Payload:", payLoad);
  const userId = event.requestContext.authorizer.claims["sub"];
  console.log("userid", userId);
  const password =
    payLoad.password != null && payLoad.password != ""
      ? payLoad.password
      : process.env.DefaultPass;
  console.log("password", password);
  const newPassword = payLoad.newPassword;
  console.log("newPassword", newPassword);
  let username = event.requestContext.authorizer.claims["email"];
  console.log("username", username);
  try {
    const authenticationDetail = await asyncCognitoAuthentication(
      username,
      password,
      newPassword
    );
    console.log("autenticationdetails", authenticationDetail);
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify("success"),
      headers: {
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,X-Amz-Security-Token,is-update,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
        "X-Requested-With": "*",
      },
    });
  } catch (err) {
    console.log("error while Updating patient data", err);
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({ error: error.join(" ") }),
      headers: {
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,is-update,type-of-side,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
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

function isUserAvailable(email) {
  const params = {
    UserPoolId: process.env.UserPoolId,
    AttributesToGet: ["email"],
    Filter: `email = "${email}"`,
  };
  return new Promise(function (resolve, reject) {
    CognitoIdentityServiceProvider.listUsers(params, function (err, result) {
      if (err) {
        console.log("error while fetching", err);
        reject(err);
      } else {
        console.log("successfully fetched", result);
        resolve(result);
      }
    });
  });
}

function resendSignUpVerificationLink(cognitoUser) {
  return new Promise(function (resolve, reject) {
    cognitoUser.resendConfirmationCode(function (err, result) {
      if (err) {
        console.log("error while resending", err);
        reject(err);
      } else {
        console.log("successfully sent code", result);
        resolve(result);
      }
    });
  });
}

exports.resendEmailForSignup = async (event, context, callback) => {
  console.log("****Resend SignUp Verification Link*****");
  const payLoad = JSON.parse(event.body);
  console.log("Resend Link Parameters:", payLoad);
  const email = payLoad.email;
  let userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: process.env.UserPoolId,
    ClientId: process.env.ClientId,
  });

  const userData = {
    Username: email,
    Pool: userPool,
  };

  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  console.log("cognitoUser", cognitoUser);
  try {
    let data = await resendSignUpVerificationLink(cognitoUser);
    console.log("data", data);
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(data),
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
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({
        error: err.message,
        msg: "Failed TO Send Link TO The User.",
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
};

function setForgotPassword(cognitoUser) {
  return new Promise(function (resolve, reject) {
    cognitoUser.forgotPassword({
      onSuccess: function (result) {
        console.log("Forgot Password OnSuccess Result:", result);
        resolve(result);
      },
      onFailure: function (err) {
        console.log("Forgot Password Failure:", err);
        reject(err);
      },
    });
  });
}

exports.forgotPassword = async (event, context, callback) => {
  console.log("****Forgot Password Function Starts*****");
  const payLoad = JSON.parse(event.body);
  console.log("Forgot Password Parameters:", payLoad);
  const email = payLoad.email;
  let userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: process.env.UserPoolId,
    ClientId: process.env.ClientId,
  });

  const userData = {
    Username: email,
    Pool: userPool,
  };

  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  try {
    let data = await isUserAvailable(email);
    if (data.Users.length === 0) {
      return callback(null, {
        statusCode: 404,
        body: JSON.stringify({
          msg: "Email ID is not registered with us.",
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
    let setForgotPasswordData = await setForgotPassword(cognitoUser);
    console.log("data", setForgotPasswordData);
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(setForgotPasswordData),
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
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({
        error: err.message,
        msg: "Failed TO Send Link TO The User.",
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
};

function refreshTokenFunc(cognitoUser, RefreshToken) {
  return new Promise(function (resolve, reject) {
    cognitoUser.refreshSession(RefreshToken, (err, session) => {
      if (err) {
        console.log("error", err);
        reject(err);
      } else {
        console.log("inside resolve", session);
        resolve(session);
      }
    });
  });
}

exports.refreshToken = async (event, context, callback) => {
  console.log("Starting Refresh Token Lambda Function");
  console.log("payload", event.body);
  const payload = JSON.parse(event.body);

  let RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({
    RefreshToken: payload.refreshToken,
  });

  let userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: process.env.UserPoolId,
    ClientId: process.env.ClientId,
  });

  const userData = {
    Username: payload.email,
    Pool: userPool,
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  console.log("cognitoUser", cognitoUser);
  try {
    response = {
      idToken: "",
      accessToken: "",
      refreshToken: "",
    };
    let resp = await refreshTokenFunc(cognitoUser, RefreshToken);
    console.log("resp", resp);
    response = {
      idToken: resp.idToken.jwtToken,
      accessToken: resp.accessToken.jwtToken,
      refreshToken: resp.refreshToken.token,
    };
    return callback(null, {
      statusCode: 201,
      body: JSON.stringify(response),
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
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({ error: err.message }),
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
};

exports.screenStatus = async (event, context, callback) => {
  console.log(
    "*******Fetching Providers Screen Status Information Starts*********"
  );
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  });
  const userId = event.requestContext.authorizer.claims["sub"];
  const userEmail = event.requestContext.authorizer.claims["email"];
  console.log("userId", userId);
  try {
    const userQuery =
      "select first_name,last_name,role from users where cognito_id = ?";
    const subscriberQuery =
      "select subscriber_details_id from subscriber_details where cognito_user_id = ?";
    const userRecords = await db.query(userQuery, [userId]);
    let response = userRecords[0];
    console.log("Response " + response);
    let screenToNavigate = "HOME";
    if (response.role === "User") {
      response.screenToNavigate = screenToNavigate;
      console.log("Sending Response for User " + JSON.stringify(response));
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response),
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
    const subscriberRecords = await db.query(subscriberQuery, [userId]);
    console.log("subscriberRecords" + subscriberRecords);
    if (subscriberRecords.length === 0) {
      screenToNavigate = "SUBSCRIBER_DETAILS";
    } else {
      const payerAliasQuery =
        "select payer_alias_id from payer_alias where created_by = ?";
      const payerRecords = await db.query(payerAliasQuery, [userEmail]);
      const groupMappingQuery =
        "select group_mapping_id from group_mapping where created_by = ?";
      const groupRecords = await db.query(groupMappingQuery, [userEmail]);
      console.log("payerRecords" + payerRecords);
      console.log("groupRecords" + groupRecords);
      if (payerRecords.length === 0 || groupRecords.length === 0) {
        screenToNavigate = "MAPPING";
      } else {
        const adminConfigQuery =
          "select admin_config_id from admin_config where created_by = ?";
        const adminRecords = await db.query(adminConfigQuery, [userEmail]);
        console.log("adminRecords" + adminRecords);
        if (adminRecords.length === 0) {
          screenToNavigate = "ADMIN_CONFIG";
        }
      }
    }
    response.screenToNavigate = screenToNavigate;
    console.log("Sending Response for Admin " + JSON.stringify(response));
    await db.close();
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(response),
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
    console.log("error description", err);
    let errorStatusCode = err.status || 502;
    return callback(null, {
      statusCode: errorStatusCode,
      body: JSON.stringify({ error: err.message }),
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

function authenticateUserOnCognitoPromise(authenticationDetails, cognitoUser) {
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (resp) => {
        resolve(resp);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

function getUserAttributePromise(currentUser) {
  return new Promise((resolve, reject) => {
    currentUser.getUserAttributes((err, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });
}

function getSessionPromise(currentUser) {
  return new Promise((resolve, reject) => {
    currentUser.getSession((err, session) => {
      if (session) {
        resolve(session);
      } else {
        reject(err);
      }
    });
  });
}

exports.signIn = async (event, context, callback) => {
  console.log("******Entering signIn********");
  const payLoad = JSON.parse(event.body);
  response = {
    idToken: "",
    accessToken: "",
    attributes: [],
  };
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  });
  let userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: process.env.UserPoolId,
    ClientId: process.env.ClientId,
  });
  let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: payLoad.username,
    Password: payLoad.password,
  });
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: payLoad.username,
    Pool: userPool,
  });
  const userDetailsQuery = "select * from users where email = ?";
  const userDetailsQueryRecords = await db.query(userDetailsQuery, [payLoad.username]);
  if (userDetailsQueryRecords[0].status != 'A') {
    return {
      statusCode: 502,
      body: JSON.stringify({
        error: "User access suspended, please check with your admin or Beats Health",
      }),
      headers: {
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
        "X-Requested-With": "*",
      },
    };
  }

  try {
    var resp = await authenticateUserOnCognitoPromise(authenticationDetails, cognitoUser);
    console.log("AutoLogin:", resp);
    response.idToken = resp.idToken.jwtToken;
    response.accessToken = resp.getAccessToken().getJwtToken();
    response.refreshToken = resp.getRefreshToken().getToken();
    let currentUser = userPool.getCurrentUser();
    try {
      var getSessionResult = await getSessionPromise(currentUser);
    } catch (err) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: err.message }),
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
          "X-Requested-With": "*",
        },
      };
    }
    try {
      var result1 = await getUserAttributePromise(currentUser);
      for (i = 0; i < result1.length; i++) {
        let obj = {};
        //           obj[result[i].getName()] = result[i].getValue();
        obj["name"] = result1[i].getName();
        obj["value"] = result1[i].getValue();
        response.attributes.push(obj);
      }
      return {
        statusCode: 201,
        body: JSON.stringify(response),
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
          "X-Requested-With": "*",
        },
      };
    } catch (err) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: err.message }),
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
          "X-Requested-With": "*",
        },
      };
    }
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: err.message }),
      headers: {
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
        "X-Requested-With": "*",
      },
    };
  } finally {
    await db.close();
  }
};

exports.updatePassword = async (event, context, callback) => {
  console.log("******Entering updatePassword********");
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
    const params = {
      ClientId: process.env.ClientId,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: userEmail,
        PASSWORD: payLoad.oldPassword,
      },
    };
    await CognitoIdentityServiceProvider.initiateAuth(params)
      .promise()
      .then((data) => {
        console.log("data", data);
        var changePasswordParams = {
          Password: payLoad.newPassword,
          Permanent: true,
          Username: userEmail,
          UserPoolId: process.env.UserPoolId,
        };
        CognitoIdentityServiceProvider.adminSetUserPassword(
          changePasswordParams
        ).promise();
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify({ msg: "Password Updated" }),
          headers: headers,
        });
      })
      .catch((error) => {
        console.log("error: -> ", error);
        return callback(null, {
          statusCode: 502,
          body: JSON.stringify({ error: error.join(" ") }),
          headers: headers,
        });
      });
  } catch (err) {
    console.log("error : ", err);
    return callback(null, {
      statusCode: 502,
      body: JSON.stringify({ error: error.join(" ") }),
      headers: headers,
    });
  } finally {
    await db.close();
  }
};
