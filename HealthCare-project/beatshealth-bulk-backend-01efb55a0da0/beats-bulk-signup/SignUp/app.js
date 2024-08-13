const https = require("https");
const qs = require("qs");
const util = require("util");
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
//let AmazonCognitoIdentity = require('amazon-cognito-identity-js');
let AWS = require("aws-sdk");
AWS.config.setPromisesDependency(require("bluebird"));
let CognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: process.env.region,
});
let AmazonCognitoIdentity = require("amazon-cognito-identity-js");
let SQL = require("mysql");
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

function signUpEmailTemplate(link, email, beatsSignInUrl) {
  return `
<html>
    <body
       style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF; color: #000000; font-family:arial,helvetica,sans-serif;">
    
       <div style="padding: 0px; background-color: #fff; ">
         <div style=" margin-bottom: 30px; margin:0px auto; max-width: 620px; width: 100%;">
    
           <div style="  display:inline-block;padding:0; margin-left:-10px">
    
             <img alt="Beats" src="http://beats-react-app.s3-website.us-east-2.amazonaws.com/static/media/beats-health.3c7aa287.png" />
    
           </div>
           <div style="  display:inline; padding:0; float: right ">
    
             <a href=${beatsSignInUrl} target="_blank"
               style="box-sizing: border-box; margin-top:15px; display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #c72c35; background-color: #f3f3f3; border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;border-top-width: 1px; border-top-style: solid; border-top-color: #c72c35; border-left-width: 1px; border-left-style: solid; border-left-color: #c72c35; border-right-width: 1px; border-right-style: solid; border-right-color: #c72c35; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: #c72c35;">
               <span
                 style="display:block;padding:15px 40px;line-height:120%; font-size:22px; background:#f3f3f3; border-radius:10px;">Sign
                 In</span>
             </a>
           </div>
         </div>
       </div>
    
       <div style="padding: 0px;  ">
         <div style=" margin-bottom: 30px; margin:0px auto; max-width: 620px; width: 100%;">
           <h1
             style="margin:30px 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-weight: bold; font-family: arial,helvetica,sans-serif; font-size: 32px;">
             Welcome to Beats Health,&nbsp;
           </h1>
    
           <p>To activate your account, please click on the button below to verify your email
             address. Once activated and subscribed, you’ll have full access to Beats Health
             account</p>
    
           <div style="text-align:center; margin-top:10%; margin-bottom:5%">
             <a href=${link} target="_blank"
               style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #c72c35; background-color: #f3f3f3; border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;border-top-width: 1px; border-top-style: solid; border-top-color: #c72c35; border-left-width: 1px; border-left-style: solid; border-left-color: #c72c35; border-right-width: 1px; border-right-style: solid; border-right-color: #c72c35; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: #c72c35;">
               <span style="display:block;padding:20px 40px;line-height:120%; font-size:18px">Activate
                 Account</span>
             </a>
           </div>
           <hr />
    
           <p>Button not working? Try pasting this URL into your browser: <a
               href=${link}>${link}</a>
           </p>
    
    
         </div>
       </div>
    
       <div style="padding: 0px; background-color: #d6d6d6; ">
         <div
           style=" margin-bottom: 30px; margin:0px auto; max-width: 620px; width: 100%; padding:70px 0px; text-align:center;">
    
           <span style="background:#424242; border-radius: 50%; display:inline-block;padding:15px;">
             <a href="https://www.thebeatshealth.com">
              <img src = "icons/twitter.png">
             <!-- <svg width="24" height="24" viewBox="328 355 335 276" xmlns="http://www.w3.org/2000/svg">
               <path d="
                                  M 630, 425
                                  A 195, 195 0 0 1 331, 600
                                  A 142, 142 0 0 0 428, 570
                                  A  70,  70 0 0 1 370, 523
                                  A  70,  70 0 0 0 401, 521
                                  A  70,  70 0 0 1 344, 455
                                  A  70,  70 0 0 0 372, 460
                                  A  70,  70 0 0 1 354, 370
                                  A 195, 195 0 0 0 495, 442
                                  A  67,  67 0 0 1 611, 380
                                  A 117, 117 0 0 0 654, 363
                                  A  65,  65 0 0 1 623, 401
                                  A 117, 117 0 0 0 662, 390
                                  A  65,  65 0 0 1 630, 425
                                  Z" style="fill:#fff;" />
             </svg> -->
             </a>
           </span>
    
    
           <span style="background:#424242; border-radius: 50%; display:inline-block;padding:15px;">
             <a href="https://www.thebeatshealth.com">
               <img src = "icons/linkedin.png">
             <!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
               <path
                 d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"
                 style="fill:#fff;" />
             </svg> -->
             </a>
           </span>
    
    
           <span style="background:#424242; border-radius: 50%; display:inline-block;padding:15px;">
               
             <a href="https://www.thebeatshealth.com">

              <img src = "icons/facebook.png">
               
             <!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
               <path
                 d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
                 style="fill:#fff;" />
             </svg> -->
             </a>
           </span>
           <p> powered by Beats Health - All Rights Reserved</p>
    
         </div>
       </div>
    
    
       <div style="padding: 0px; background-color: #fff; ">
         <div
           style=" margin-bottom: 30px; margin:0px auto; max-width: 620px; width: 100%; padding:70px 0px; text-align:center;">
           <div style="text-align:center">
             <span style="font-size:18px;  color:#424242">Visit <a href="thebeatshealth.com">www.thebeatshealth.com</a></span><br>You're receiving this email
             because you signed up for a Beats Health account.
           </div>
    
         </div>
       </div>
     </body>
     </html>


   `;
}

function forgotPasswordTemplate(link, email, beatsSignInUrl) {
  return `
<html>
  <body
    style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #fff; color: #000000; font-family:arial,helvetica,sans-serif;">

    <div style="padding: 0px; background-color: #fff; ">
      <div style=" margin-bottom: 30px; margin:0px auto; max-width: 620px; width: 100%;">

        <div style="  display:inline-block;padding:0; margin-left:-10px">

          <img alt="Beats" src="http://beats-react-app.s3-website.us-east-2.amazonaws.com/static/media/beats-health.3c7aa287.png" />

        </div>
        <div style="  display:inline; padding:0; float: right ">

          <a href=${beatsSignInUrl} target="_blank"
            style="box-sizing: border-box; margin-top:15px; display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #c72c35; background-color: #f3f3f3; border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;border-top-width: 1px; border-top-style: solid; border-top-color: #c72c35; border-left-width: 1px; border-left-style: solid; border-left-color: #c72c35; border-right-width: 1px; border-right-style: solid; border-right-color: #c72c35; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: #c72c35;">
            <span
              style="display:block;padding:15px 40px;line-height:120%; font-size:22px; background:#f3f3f3; border-radius:10px;">Sign
              In</span>
          </a>
        </div>
      </div>
    </div>


    <div style="padding: 0px;  ">
      <div style=" margin-bottom: 30px; margin:0px auto; max-width: 620px; width: 100%;">


        <p>To reset your password, please click on the button below</p>

        <div style="text-align:center; margin-top:10%; margin-bottom:5%">
          <a href=${link} target="_blank"
            style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #c72c35; background-color: #f3f3f3; border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;border-top-width: 1px; border-top-style: solid; border-top-color: #c72c35; border-left-width: 1px; border-left-style: solid; border-left-color: #c72c35; border-right-width: 1px; border-right-style: solid; border-right-color: #c72c35; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: #c72c35;">
            <span style="display:block;padding:20px 40px;line-height:120%; font-size:18px"> Reset password </span>
          </a>
        </div>
        <hr />

        <p>Button not working? Try pasting this URL into your browser: <a
            href=${link}>${link}</a>
        </p>

      </div>
    </div>


    <div style="padding: 0px; background-color: #d6d6d6; ">
      <div
        style=" margin-bottom: 30px; margin:0px auto; max-width: 620px; width: 100%; padding:70px 0px; text-align:center;">

        <span style="background:#424242; border-radius: 50%; display:inline-block;padding:15px;">
        <a href="thebeatshealth.com">

          <img src = "icons/twitter.png">
          <!-- <svg width="24" height="24" viewBox="328 355 335 276" xmlns="http://www.w3.org/2000/svg">
            <path d="
                              M 630, 425
                              A 195, 195 0 0 1 331, 600
                              A 142, 142 0 0 0 428, 570
                              A  70,  70 0 0 1 370, 523
                              A  70,  70 0 0 0 401, 521
                              A  70,  70 0 0 1 344, 455
                              A  70,  70 0 0 0 372, 460
                              A  70,  70 0 0 1 354, 370
                              A 195, 195 0 0 0 495, 442
                              A  67,  67 0 0 1 611, 380
                              A 117, 117 0 0 0 654, 363
                              A  65,  65 0 0 1 623, 401
                              A 117, 117 0 0 0 662, 390
                              A  65,  65 0 0 1 630, 425
                              Z" style="fill:#fff;" />
          </svg> -->
         </a>
        </span>


        <span style="background:#424242; border-radius: 50%; display:inline-block;padding:15px;">
        <a href="thebeatshealth.com">
          <img src = "icons/linkedin.png">
          <!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"
              style="fill:#fff;" />
          </svg> -->
         </a>
        </span>


        <span style="background:#424242; border-radius: 50%; display:inline-block;padding:15px;">
        <a href="thebeatshealth.com">
          <img src = "icons/facebook.png">
          <!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
              style="fill:#fff;" />
          </svg> -->
        </a>
        </span>
        <p> powered by Beats Health - All Rights Reserved</p>

      </div>
    </div>

    <div style="padding: 0px; background-color: #fff; ">
      <div
        style=" margin-bottom: 30px; margin:0px auto; max-width: 620px; width: 100%; padding:70px 0px; text-align:center;">
        <div style="text-align:center">
          <span style="font-size:18px;  color:#424242">Visit <a href="thebeatshealth.com">www.thebeatshealth.com</a> </span><br>You're receiving this email
          because you signed up for a Beats Health account.
        </div>

      </div>
    </div>



    

    </html>`;
}
exports.signUpVerificationHandler = (req, context, callback) => {
  console.log(req);
  const confirmationCode = req.code;
  const username = req.username;
  const clientId = req.clientId;
  let params = {
    ClientId: clientId,
    ConfirmationCode: confirmationCode,
    Username: username,
  };
  //Validating the user
  let confirmSignUp =
    CognitoIdentityServiceProvider.confirmSignUp(params).promise();

  //Returning the redirect url
  confirmSignUp
    .then(async (data) => {
      let userPool = new AmazonCognitoIdentity.CognitoUserPool({
        UserPoolId: process.env.UserPoolId,
        ClientId: process.env.ClientId,
      });
      console.log("username:", username);
      console.log("password:", process.env.DefaultPass);
      let authenticationDetails =
        new AmazonCognitoIdentity.AuthenticationDetails({
          Username: username,
          Password: process.env.DefaultPass,
        });
      let cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: username,
        Pool: userPool,
      });
      console.log(cognitoUser);
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (resp) => {
          console.log("AutoLogin:", resp);
          context.succeed({
            location:
              process.env.POST_REGISTRATION_VERIFICATION_REDIRECT_URL +
              "?jwttoken=" +
              resp.idToken.jwtToken +
              "&accesstoken=" +
              resp.getAccessToken().getJwtToken(),
          });
        },
        onFailure: (err) => {
          console.log("Cognito confirmation - authenticateUser failed:", err);
        },
      });
    })
    .catch((error) => {
      console.log("Cognito confirmation - general failure:", error);
      callback(error.message);
    });
};

exports.forgotPasswordVerification = (req, context, callback) => {
  console.log("***Forgot Password Verification Function starts***");
  console.log("Request Param:", req);
  console.log("Query Parameters:", req.queryStringParameters);
  const confirmationCode = req.queryStringParameters.code;
  const username = req.queryStringParameters.username;
  const email = req.queryStringParameters.email;
  const clientId = req.queryStringParameters.clientId;
  const newPassword = process.env.DefaultPass;
  let params = {
    ClientId: clientId,
    ConfirmationCode: confirmationCode,
    Username: username,
    Email: email,
  };
  console.log("Params:", params);
  console.log("*********UserPool Starts here*********");
  let userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: process.env.UserPoolId,
    ClientId: process.env.ClientId,
  });
  console.log("*********Get Cognito User Starts here*********");
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: params.Username,
    Pool: userPool,
  });

  console.log("Cognito User For ForgotPassword:", cognitoUser);
  console.log("Confirm Password Starts Here For ForgotPassword");
  let pr = new Promise((resolve, reject) => {
    cognitoUser.confirmPassword(params.ConfirmationCode, newPassword, {
      onFailure(err) {
        console.log("Confirm Password Failure");
        reject(err);
      },
      onSuccess() {
        let authenticationDetails =
          new AmazonCognitoIdentity.AuthenticationDetails({
            Username: params.Username,
            Password: process.env.DefaultPass,
          });
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (resp) => {
            console.log("ForgotPassword Authenticated User:");
            resolve(resp);
          },
          onFailure: (err) => {
            console.log("Authenticate User Failure", err);
            reject(err);
          },
        });
      },
    });
  })
    .then((resp) => {
      console.log("Promise then:");
      console.log(
        "redirect link:",
        process.env.POST_RESET_PASSWORD_VERIFICATION_REDIRECT_URL +
          "?jwttoken=" +
          resp.idToken.jwtToken +
          "&accesstoken=" +
          resp.getAccessToken().getJwtToken()
      );
      callback(null, {
        statusCode: 302,
        headers: {
          Location:
            process.env.POST_RESET_PASSWORD_VERIFICATION_REDIRECT_URL +
            "?jwttoken=" +
            resp.idToken.jwtToken +
            "&accesstoken=" +
            resp.getAccessToken().getJwtToken(),
        },
      });
    })
    .catch((error) => {
      console.log("Promise catch:");
      callback(error);
    });
};
exports.forgotPasswordVerification1 = (req, context, callback) => {
  console.log("req body:", req.body);
  console.log("Query Parameters:", req.queryStringParameters);
  const npi = req.queryStringParameters.npi;

  console.log("function starts");
  console.log("----------------");
  var qs = require("qs");
  var axios = require("axios");
  var bodytxt = "";
  const DATA = "data";
  const ERROR = "ERROR";

  const CMS_NPI_GET_BASE_OPTIONS = {
    hostname: "npiregistry.cms.hhs.gov",
    port: 443,
    method: "GET",
    path: "",
    headers: {
      Connection: "keep-alive",
    },
  };
  const CMS_NPI_CALL_PATH = "/api?";

  var npiParams = {
    version: "2.1",
    number: npi,
  };

  var npiParamsData = qs.stringify(npiParams);
  var callPath = CMS_NPI_CALL_PATH + npiParamsData;

  var npiApioptions = Object.assign({}, CMS_NPI_GET_BASE_OPTIONS);
  npiApioptions.path = callPath;

  //console.log('cmsApi call ==> ' + util.inspect(npiApioptions, {showHidden: false, depth: null}));
  console.log("cmsApi call ==> hostname: " + npiApioptions.hostname);
  console.log("cmsApi call ==> port: " + npiApioptions.port);
  console.log("cmsApi call ==> method: " + npiApioptions.method);
  console.log("cmsApi call ==> path: " + npiApioptions.path);
  console.log(
    "cmsApi call ==> headers: " +
      util.inspect(npiApioptions.headers, { showHidden: false, depth: null })
  );

  var npiDetailsResponse = {
    typeOfPractice: "",
    practiceName: "",
    isNpiActive: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    countryName: "",
    taxonomyCode: "",
    taxonomyDesc: "",
    taxonomyState: "",
    taxonomyLicense: "",
    taxonomyGroup: "",
    contactNumber: "",
  };

  var req = https.request(npiApioptions, function (res) {
    var body = "";
    res.setEncoding("utf8");

    // Streams2 API
    res.on("readable", function () {
      var chunk = this.read() || "";
      body += chunk;
      console.log("chunk: " + Buffer.byteLength(chunk) + " bytes");
    });

    res.on("end", function () {
      console.log("Body: ", body);
      if (res.statusCode == 200 || res.statusCode == 202) {
        var jsonBody = JSON.parse(body);
        console.log("jsonBody: ", jsonBody.stringify);

        if (
          jsonBody.hasOwnProperty("result_count") &&
          jsonBody.result_count == 1
        ) {
          console.log("Found result_count to be 1 ");

          var resultTemp = jsonBody.results[0];
          console.log("resulttemp: ", resultTemp);
          if (resultTemp.hasOwnProperty("enumeration_type")) {
            console.log("Found enumeration_type ");
            npiDetailsResponse.typeOfPractice =
              resultTemp.enumeration_type === "NPI-1"
                ? "AT"
                : resultTemp.enumeration_type === "NPI-2"
                ? "H"
                : "";
          }

          if (resultTemp.hasOwnProperty("basic")) {
            console.log("Found basic ");

            var resultBasic = resultTemp.basic;
            if (resultBasic.hasOwnProperty("name")) {
              console.log("Found Organization / Individual name ");
              npiDetailsResponse.practiceName = resultBasic.name;
            }
            if (resultBasic.hasOwnProperty("status")) {
              console.log("Found status ");
              npiDetailsResponse.isNpiActive = resultBasic.status;
            }
          }

          if (resultTemp.hasOwnProperty("addresses")) {
            console.log("Found addresses ");
            var resultAddressTemp = resultTemp.addresses;
            var addressVar = findElement(
              resultAddressTemp,
              "address_purpose",
              "LOCATION"
            );

            npiDetailsResponse.address1 = addressVar.address_1;
            npiDetailsResponse.address2 = addressVar.address_2;
            npiDetailsResponse.city = addressVar.city;
            npiDetailsResponse.state = addressVar.state;
            npiDetailsResponse.postalCode = addressVar.postal_code;
            npiDetailsResponse.countryName = addressVar.country_name;
            npiDetailsResponse.contactNumber = addressVar.telephone_number;
          }

          if (resultTemp.hasOwnProperty("taxonomies")) {
            console.log("Found taxonomies object ");
            var resultTaxonomiesTemp = resultTemp.taxonomies;
            var taxonomyVar = findElement(
              resultTaxonomiesTemp,
              "primary",
              true
            );
            console.log("taxonomy object is : ", taxonomyVar);

            npiDetailsResponse.taxonomyCode = taxonomyVar.code;
            npiDetailsResponse.taxonomyDesc = taxonomyVar.desc;
            npiDetailsResponse.taxonomyState = taxonomyVar.state;
            npiDetailsResponse.taxonomyLicense = taxonomyVar.license;
            npiDetailsResponse.taxonomyGroup = taxonomyVar.taxonomy_group;
          }
        }
        console.log("Parsed Response body is --> ");
        console.log("typeOfPractice: ", npiDetailsResponse.typeOfPractice);
        console.log("practiceName: ", npiDetailsResponse.practiceName);
        console.log("isNpiActive: ", npiDetailsResponse.isNpiActive);
        console.log("address1: ", npiDetailsResponse.address1);
        console.log("address2: ", npiDetailsResponse.address2);
        console.log("city: ", npiDetailsResponse.city);
        console.log("state: ", npiDetailsResponse.state);
        console.log("postalCode: ", npiDetailsResponse.postalCode);
        console.log("countryName: ", npiDetailsResponse.countryName);
        console.log("taxonomyCode: ", npiDetailsResponse.taxonomyCode);
        console.log("taxonomyDesc: ", npiDetailsResponse.taxonomyDesc);
        console.log("taxonomyState: ", npiDetailsResponse.taxonomyState);
        console.log("taxonomyLicense: ", npiDetailsResponse.taxonomyLicense);
        console.log("taxonomyGroup: ", npiDetailsResponse.taxonomyGroup);
        console.log("contactNumber: ", npiDetailsResponse.contactNumber);

        const result = JSON.stringify(npiDetailsResponse);
        console.log("Json response: ", result);
        callback(null, {
          statusCode: 200,
          body: result,
          headers: {
            "Access-Control-Allow-Headers":
              "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":
              "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
            "X-Requested-With": "*",
          },
        });
      } else {
        console.log("Responding with 502. CMS NPI call failed.");
        callback(null, {
          statusCode: 502,
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
    });

    req.on("error", function (e) {
      console.log("error" + e.message);
      callback(null, {
        statusCode: 502,
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
          "X-Requested-With": "*",
        },
      });
    });
  });

  req.end();
};
// Creating a custom URL for the user
exports.signUpMessageHandler = (event, context, callback) => {
  const beatsSignInUrl = process.env.homepageurl;
  if (event.triggerSource === "CustomMessage_SignUp") {
    const { codeParameter } = event.request;
    const { userName, region } = event;
    const { clientId } = event.callerContext;
    const { email } = event.request.userAttributes;
    const url = process.env.verifyUrl;
    const link = `${url}?code=${codeParameter}&username=${userName}&clientId=${clientId}&region=${region}&email=${email}`;
    console.log("function starts custom template");
    console.log("event details:", event);
    console.log("template", signUpEmailTemplate(link, email, beatsSignInUrl));
    console.log("callback" + callback);
    event.response.emailSubject = "Beats Health - Verification email";
    event.response.emailMessage = signUpEmailTemplate(
      link,
      email,
      beatsSignInUrl
    );
  }
  if (event.triggerSource === "CustomMessage_ForgotPassword") {
    const { codeParameter } = event.request;
    const { userName, region } = event;
    const { clientId } = event.callerContext;
    const { email } = event.request.userAttributes;
    const url = process.env.verifyForgotPasswordUrl;
    console.log("verifyForgotPasswordUrl" + url);
    const link = `${url}?code=${codeParameter}&username=${userName}&clientId=${clientId}&region=${region}&email=${email}`;
    event.response.emailSubject = "Beats Health - Password reset link";
    event.response.emailMessage = forgotPasswordTemplate(
      link,
      email,
      beatsSignInUrl
    );
  }
  console.log("RESPONSE", event.response);
  callback(null, event);
};

exports.signUp = async (event, context, callback) => {
  const db = makeDb({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
  });
  const payLoad = JSON.parse(event.body);
  console.log("function starts");
  console.log("PayLoad:", payLoad);
  const userEmail = payLoad.useremail;
  try {
    const preconfiguredUsersQuery =
      "select * from preconfigured_users where user_email = ? and status = 'A'";
    const preconfiguredRecords = await db.query(preconfiguredUsersQuery, [
      userEmail,
    ]);
    console.log("preconfiguredRecords" + preconfiguredRecords);
    if (preconfiguredRecords.length === 0) {
      return callback(null, {
        statusCode: 502,
        body: JSON.stringify({
          error: "Invalid Email, please contact Beats Health for access",
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
    let cognitoUserID;
    await CognitoIdentityServiceProvider.signUp({
      ClientId: process.env.ClientId,
      Username: userEmail,
      Password: process.env.DefaultPass,
    })
      .promise()
      .then((data) => {
        console.log("Cognito User ID", data.UserSub);
        cognitoUserID = data.UserSub;
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify({ message: "success" }),
          headers: {
            "Access-Control-Allow-Headers":
              "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":
              "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
            "X-Requested-With": "*",
          },
        });
      })
      .catch((error) => {
        console.log("error:", error);
        return callback(null, {
          statusCode: 502,
          body: JSON.stringify({ error: error.message }),
          headers: {
            "Access-Control-Allow-Headers":
              "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":
              "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
            "X-Requested-With": "*",
          },
        });
        //return callback(error.message);
      });

    const usersQuery = "insert into users SET ?";
    var bindParams = {
      email: preconfiguredRecords[0].user_email,
      status: preconfiguredRecords[0].status,
      cognito_id: cognitoUserID,
      role: preconfiguredRecords[0].role,
      created_by: preconfiguredRecords[0].user_email,
      created_on: currentDateTime(),
      modified_by: preconfiguredRecords[0].user_email,
      modified_on: currentDateTime(),
    };
    await db.query(usersQuery, bindParams);
    console.log("----------------");
    console.log("function ends");
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ message: "success" }),
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
  } finally {
    await db.close();
  }
};
exports.npiDetailsFetch = (event, context, callback) => {
  //const payLoad = JSON.parse(event.body);
  console.log("event.body:", event.body);
  const payLoad = JSON.parse('{ "npi": "1336159961" }');
  console.log("function starts");
  console.log("----------------");
  console.log("PayLoad:", payLoad);
  console.log("PayLoad->npi :", payLoad.npi);
  var qs = require("qs");
  var axios = require("axios");
  var bodytxt = "";
  const DATA = "data";
  const ERROR = "ERROR";

  const CMS_NPI_GET_BASE_OPTIONS = {
    hostname: "npiregistry.cms.hhs.gov",
    port: 443,
    method: "GET",
    path: "",
    headers: {
      Connection: "keep-alive",
    },
  };
  const CMS_NPI_CALL_PATH = "/api?";

  var npiParams = {
    version: "2.1",
    number: payLoad.npi,
  };

  var npiParamsData = qs.stringify(npiParams);
  var callPath = CMS_NPI_CALL_PATH + npiParamsData;

  var npiApioptions = Object.assign({}, CMS_NPI_GET_BASE_OPTIONS);
  npiApioptions.path = callPath;

  //console.log('cmsApi call ==> ' + util.inspect(npiApioptions, {showHidden: false, depth: null}));
  console.log("cmsApi call ==> hostname: " + npiApioptions.hostname);
  console.log("cmsApi call ==> port: " + npiApioptions.port);
  console.log("cmsApi call ==> method: " + npiApioptions.method);
  console.log("cmsApi call ==> path: " + npiApioptions.path);
  console.log(
    "cmsApi call ==> headers: " +
      util.inspect(npiApioptions.headers, { showHidden: false, depth: null })
  );

  var req = https.request(npiApioptions, function (res) {
    var body = "";
    res.setEncoding("utf8");

    // Streams2 API
    res.on("readable", function () {
      var chunk = this.read() || "";
      body += chunk;
      console.log("chunk: " + Buffer.byteLength(chunk) + " bytes");
    });

    res.on("end", function () {
      console.log("Body: ", body);
      if (res.statusCode == 200 || res.statusCode == 202) {
        var jsonBody = JSON.parse(body);
        console.log("jsonBody: ", jsonBody.stringify);
        var npiDetailsResponse = {
          typeOfPractice: "",
          practiceName: "",
          isNpiActive: "",
          address1: "",
          address2: "",
          city: "",
          state: "",
          postalCode: "",
          countryName: "",
          taxonomyCode: "",
          taxonomyDesc: "",
          taxonomyState: "",
          taxonomyLicense: "",
          taxonomyGroup: "",
        };

        if (
          jsonBody.hasOwnProperty("result_count") &&
          jsonBody.result_count == 1
        ) {
          console.log("Found result_count to be 1 ");

          var resultTemp = jsonBody.results[0];
          console.log("resulttemp: ", resultTemp);
          if (resultTemp.hasOwnProperty("enumeration_type")) {
            console.log("Found enumeration_type ");
            npiDetailsResponse.typeOfPractice =
              resultTemp.enumeration_type === "NPI-1"
                ? "AT"
                : resultTemp.enumeration_type === "NPI-2"
                ? "H"
                : "";
          }

          if (resultTemp.hasOwnProperty("basic")) {
            console.log("Found basic ");

            var resultBasic = resultTemp.basic;
            if (resultBasic.hasOwnProperty("organization_name")) {
              console.log("Found organization_name ");
              npiDetailsResponse.practiceName = resultBasic.organization_name;
            }
            if (resultBasic.hasOwnProperty("status")) {
              console.log("Found status ");
              npiDetailsResponse.isNpiActive = resultBasic.status;
            }
          }

          if (resultTemp.hasOwnProperty("addresses")) {
            console.log("Found addresses ");
            var resultAddressTemp = resultTemp.addresses;
            var addressVar = findElement(
              resultAddressTemp,
              "address_purpose",
              "LOCATION"
            );

            npiDetailsResponse.address1 = addressVar.address_1;
            npiDetailsResponse.address2 = addressVar.address_2;
            npiDetailsResponse.city = addressVar.city;
            npiDetailsResponse.state = addressVar.state;
            npiDetailsResponse.postalCode = addressVar.postal_code;
            npiDetailsResponse.countryName = addressVar.country_name;
          }

          if (resultTemp.hasOwnProperty("taxonomies")) {
            console.log("Found taxonomies object ");
            var resultTaxonomiesTemp = resultTemp.taxonomies;
            var taxonomyVar = findElement(
              resultTaxonomiesTemp,
              "primary",
              true
            );
            console.log("taxonomy object is : ", taxonomyVar);

            npiDetailsResponse.taxonomyCode = taxonomyVar.code;
            npiDetailsResponse.taxonomyDesc = taxonomyVar.desc;
            npiDetailsResponse.taxonomyState = taxonomyVar.state;
            npiDetailsResponse.taxonomyLicense = taxonomyVar.license;
            npiDetailsResponse.taxonomyGroup = taxonomyVar.taxonomy_group;
          }
        }
        console.log("Parsed Response body is --> ");
        console.log("typeOfPractice: ", npiDetailsResponse.typeOfPractice);
        console.log("practiceName: ", npiDetailsResponse.practiceName);
        console.log("isNpiActive: ", npiDetailsResponse.isNpiActive);
        console.log("address1: ", npiDetailsResponse.address1);
        console.log("address2: ", npiDetailsResponse.address2);
        console.log("city: ", npiDetailsResponse.city);
        console.log("state: ", npiDetailsResponse.state);
        console.log("postalCode: ", npiDetailsResponse.postalCode);
        console.log("countryName: ", npiDetailsResponse.countryName);
        console.log("taxonomyCode: ", npiDetailsResponse.taxonomyCode);
        console.log("taxonomyDesc: ", npiDetailsResponse.taxonomyDesc);
        console.log("taxonomyState: ", npiDetailsResponse.taxonomyState);
        console.log("taxonomyLicense: ", npiDetailsResponse.taxonomyLicense);
        console.log("taxonomyGroup: ", npiDetailsResponse.taxonomyGroup);

        callback(null, {
          statusCode: 200,
          body: JSON.stringify(npiDetailsResponse),
          headers: {
            "Access-Control-Allow-Headers":
              "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":
              "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
            "X-Requested-With": "*",
          },
        });
      } else {
        callback(null, ERROR);
      }
    });

    req.on("error", function (e) {
      console.log("error" + e.message);
      callback(null, ERROR);
    });
  });

  req.end();

  callback(null, event);
};

function findElement(arr, propName, propValue) {
  for (var i = 0; i < arr.length; i++)
    if (arr[i][propName] == propValue) return arr[i];
}
