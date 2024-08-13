const mail = require("@sendgrid/mail");
mail.setApiKey(process.env.SENDGRID_API_KEY);
const axios = require("axios");

/**
 * Metho for Mail Sending
 * @param {email} email
 * @param {name} name
 * @param {html} template
 * @param {email} cc
 * @returns
 */
const sendMail = async (email, name, template = null, cc = null) => {
  try {
    let defaultTemplate = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><p><span><strong>Hi ${name},</strong></span><br><br>
        Click the <a href="https://stackoverflow.com/questions/40687027/sendgrid-change-href-of-link"><span>link</span></a> to verify<br><br>
        <br><br>
        <span><strong>Thanks,</strong></span></p></body></html>`;

    let organizerTemplate = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><p><span><strong>Hi ${name},</strong></span><br><br>
       <p>Application Submitted for review</p><br><br>
       <br><br>
       <p>You will receive an email update in 24-48 hours
       <br><br>
        <br><br>
        <span><strong>Thanks,</strong></span></p></body></html>`;
    const msg = {
      to: email,
      from: "noreply@kridas.com",
      subject: template !== null ? "Test Organizer" : "Test Conformation",
      text: "Test",
      html: template !== null ? organizerTemplate : defaultTemplate,
    };

    if (cc !== null) msg["cc"] = cc;
    const data = await mail.send(msg).then(() => {
      return { status: "Ok" };
    });
    console.log("check mail response --->", data);
    return data;
  } catch (error) {
    console.log("error occurred in sendgrid ", error);
  }
};

/**
 * Method for confirmation mail
 * @returns
 */
const confirmationMail = async (user, dev) => {
  try {
    let defaultTemplate = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><p><span><strong>Hi ${user.first_name},</strong></span><br><br>
    Thanks for signing up with Kridas! You must follow this link to activate your account:<br><br>
        Click the <a href="${process.env.CLIENT_URL}/user/activate-account?token=${user.reset_token}"><span>link</span></a> to verify<br><br>
        <br>
        Have fun, and don't hesitate to contact us with your feedback.
        <span><strong><br><br>Kridas Team</strong></span><br>
        <a href="${process.env.CLIENT_URL}"><span>${process.env.CLIENT_URL}</span></a></p></body></html>`;

    let otpTemplate = `<html>

    <body>
        <center>
            <table height="100%" width="100%" id="backgroundTable"
                style="height:100% ;margin:0;padding:0;width:100% ;background-color:#FAFAFA;">
                <tr>
                    <td align="center" valign="top" style="border-collapse:collapse;">
                        <table border="0" cellpadding="10" cellspacing="0" width="450" id="templatePreheader"
                            style="background-color:#FAFAFA;">
                            <tr>
                                <td valign="top" class="preheaderContent" style="border-collapse:collapse;">
                                    <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                        <tr>
                                            <td valign="top" style="border-collapse:collapse;">
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table style="border:1px none #DDDDDD;background-color:#FFFFFF;">
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table width="450" id="templateHeader"
                                        style="background-color:#FFFFFF;border-bottom:0;">
                                        <tr>
                                            <td class="headerContent centeredWithBackground"
                                                style="border-collapse:collapse;color:#202020;font-family:Arial;font-size:34px;font-weight:bold;line-height:100%;padding:0;text-align:center;vertical-align:middle;background-color:white ;padding-bottom:20px;padding-top:20px;">
                                                <img width="130"
                                                    src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651575581/gallery/POST/nac87bruejgstwmx7ioo.jpg"
                                                    style="width:400px;border:0;height:55px;line-height:130%;outline:none;text-decoration:none;"
                                                    id="headerImage campaign-icon">
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table width="450" id="templateBody">

                                        <tr>
                                            <td align="center" style="border-collapse:collapse;">
                                                <table border="0" cellpadding="0" cellspacing="0">
                                                    <tbody>
                                                        <tr align="center">
                                                            <td align="center" valign="middle"
                                                                style="border-collapse:collapse;">
                                                                <h1 class="h1"
                                                                    style="color:#202020;display:block;font-family:Arial;font-size:15px;line-height:100%;margin-right:0;margin-left:0;text-align:center"
                                                                    ;>Welcome to <a
                                                                        href="https://www.kridas.com/"
                                                                        style=" text-decoration:none;">KRIDAS!</a>
                                                                </h1>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td valign="top" class="bodyContent"
                                                style="border-collapse:collapse;background-color:#FFFFFF;">
                                                <table border="0" cellpadding="20" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td valign="top"
                                                            style="padding-bottom:1rem;border-collapse:collapse;"
                                                            class="mainContainer">
                                                            <div
                                                                style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                                                <h1 class="h1"
                                                                    style="color:#202020;display:block;font-family:Arial;font-size:20px;font-weight:bold;line-height:100%;text-align:center;">
                                                                    Dear ${
                                                                      user.first_name +
                                                                      " " +
                                                                      user.last_name
                                                                    }</h1>
                                                                <h2 class="h1"
                                                                    style="color:#202020;display:block;font-family:Arial;font-size:14px;line-height:100%;margin-top:20px;margin-right:0;margin-left:0;text-align:center"
                                                                    ;>
                                                                    <p>You are one step away from becoming part of the
                                                                        largest global sports network. </p>
                                                                </h2>
                                                                <p>Use the below verification code to complete your
                                                                    registration process.</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" style="border-collapse:collapse;">
                                                            <table border="0" cellpadding="0" cellspacing="0">
                                                                <tbody>
                                                                    <tr align="center">
                                                                        <td align="center" valign="middle"
                                                                            style="border-collapse:collapse;">
                                                                            <h2
                                                                                style="background:	#00466a;margin: 0 auto;width: max-content;padding: 7px 10px;color: #fff;border-radius: 4px;">
                                                                                ${
                                                                                  user.reset_token
                                                                                } </h2>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td valign="top" border-collapse:collapse;"
                                                            class="mainContainer">
                                                            <div
                                                                style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                                                <p> If you have any issues with this email content
                                                                    please click the following link for assistance
                                                                    <b>"Help desk link"</b> or <b>"a form"</b>
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table border="0" cellpadding="10" cellspacing="0" width="450" id="supportSection"
                                        style="background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                        <tr>
                                            <td valign="top" class="supportContent"
                                                style="border-collapse:collapse;background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                                <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td valign="top" width="100%" style="border-collapse:collapse;">
                                                            <br>
                                                            <div style="text-align: center; color: #c9c9c9;">
                                                                <h6> Kindly follow us on other social media platforms
                                                                </h6>
                                                                <a href="https://www.facebook.com/Kridas-103915698901083"
                                                                    style=" text-decoration:none;">
                                                                    <img width="27px" height="30px"
                                                                        src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572626/gallery/POST/ts6uyhqnwbtbkrmdfulg.ico"
                                                                        style="width:34px;height: 30px; padding-right: 8px;  ">
                                                                </a>
                                                                <a href="https://twitter.com/kridas_sports"
                                                                    style=" text-decoration:none;">
                                                                    <img width="22px" height="30px"
                                                                        src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572511/gallery/POST/qkjbhwzd8pd7ylop8zga.ico"
                                                                        alt="twitter"
                                                                        style="width:30px;height: 30px; padding-right: 8px;  ">
                                                                </a>
                                                                <a href="https://www.instagram.com/kridas_sports"
                                                                    style=" text-decoration:none; ">
                                                                    <img width="30px" height="30px"
                                                                        src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572584/gallery/POST/qwyrpwtbtrr7gva7zlqf.ico"
                                                                        alt="facebook"
                                                                        style="width:34px;height: 30px; padding-right: 8px;  ">
                                                                </a>
                                                                </p>
                                                            </div>
                                                            <br>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table border="0" cellpadding="10" cellspacing="0" width="450" id="templateFooter"
                                        style="background-color:#FFFFFF;border-top:0;">
                                        <tr>
                                            <td valign="top" class="footerContent"
                                                style="padding-left:0;border-collapse:collapse;background-color:#fafafa;">
                                                <div
                                                    style="text-align:center;color:#c9c9c9;font-family:Arial;font-size:11px;line-height:150%;">
                                                    <p style="text-align:left;margin:0;margin-top:2px;">
                                                        Copyright 2022 Kridas Sports Pvt Ltd. All rights reserved.
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <br>
                    </td>
                </tr>
            </table>
        </center>
    </body>

    </html>`;

    const msg = {
      to: user.user_email,
      from: "noreply@kridas.com",
      subject: `Confirm your account on Kridas.com${dev}`,
      text: "Test",
      html: otpTemplate,
    };
    const data = await mail.send(msg).then(() => {
      return { status: "Ok" };
    });
    return data;
  } catch (error) {
    console.log("error occurred in sendgrid ", error);
  }
};

/**
 * Method for send generic mail
 * @returns
 */
const sendMailGeneric = async (
  toEmail,
  contentData,
  templateName = null,
  cc = null
) => {
  try {
    const { emailTemplate, emailSubject } = await getEmailTemplate(
      templateName,
      contentData
    );

    const msg = {
      to: toEmail,
      from: "noreply@kridas.com",
      subject: emailSubject,
      text: "Test",
      html: emailTemplate,
    };

    if (cc !== null) msg["cc"] = cc;
    const data = await mail.send(msg).then(() => {
      return { status: "Ok" };
    });
    console.log("check mail response --->", data);
    return data;
  } catch (error) {
    console.log("error occurred in sendgrid ", error);
  }
};

const getEmailTemplate = async (template, contentData) => {
  let emailTemplate = "";
  let emailSubject = "";

  switch (template) {
    case "SERVICE_PROVIDER_SUBMISSION":
      emailTemplate = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><p><span><strong>Hi ${contentData},</strong></span><br><br>
            <p>Application Submitted for review</p><br><br>
            <br><br>
            <p>You will receive an email update in 24-48 hours
            <br><br>
            <br><br>
            <span><strong>Thanks,</strong></span></p></body></html>`;
      emailSubject =
        "Kridas - Application submitted for Partner-Service Provider";
      return { emailTemplate, emailSubject };
    case "SPONSOR_PROVIDER_SUBMISSION":
      emailTemplate = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><p><span><strong>Hi ${contentData},</strong></span><br><br>
              <p>Application Submitted for review</p><br><br>
              <br><br>
              <p>You will receive an email update in 24-48 hours
              <br><br>
              <br><br>
              <span><strong>Thanks,</strong></span></p></body></html>`;
      emailSubject = "Kridas - Application submitted for Partner-Sponsor";
      return { emailTemplate, emailSubject };
    case "COMPANY_EMAIL_ACTIVATION":
      emailTemplate = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><p><span><strong>Hi ${contentData.company_name},</strong></span><br><br>
      Thanks for signing up with Kridas! You must follow this link to activate your account:<br><br>
      Click the <a href="${process.env.CLIENT_URL}/company/activate-account?token=${contentData.reset_token}"><span>link</span></a> to verify<br><br>
      <br>
      Have fun, and don't hesitate to contact us with your feedback.
      <span><strong><br><br>Kridas Team</strong></span><br>
        <a href="${process.env.CLIENT_URL}"><span>${process.env.CLIENT_URL}</span></a></p></body></html>`;

      emailSubject = "Confirm your account on Kridas";
      return { emailTemplate, emailSubject };
    case "SPONSOR_SEEKER_SUBMISSION":
      emailTemplate = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><p><span><strong>Hi ${contentData},</strong></span><br><br>
              <p>Application Submitted for review</p><br><br>
              <br><br>
              <p>You will receive an email update in 24-48 hours
              <br><br>
              <br><br>
              <span><strong>Thanks,</strong></span></p></body></html>`;
      emailSubject = "Kridas - Application submitted for Sponsorship";
      return { emailTemplate, emailSubject };
    default:
      return { emailTemplate: "", emailSubject: "" };
  }
};

/**
 * Method for Template Verification
 * @returns
 */
const verificationTemplate = async (user, status) => {
  let template = "";
  let subject = "";

  switch (status.applied_status) {
    case "A":
      template = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><p><span><strong>Hi ${
        user.first_name ? user.first_name : user.company_name
      },</strong></span><br><br>
            <p> Your Profile is Approved</p><br><br>
            <br><br>
            <span><strong>Thanks,</strong></span></p></body></html>`;
      subject = "Kridas - Application Approval";
      return { template, subject };

    case "R":
      template = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><p><span><strong>Hi ${
        user.first_name ? user.first_name : user.company_name
      },</strong></span><br><br>
            <p> Your Profile is Rejected</p><br><br>
            <br><br>
            <span><strong>Thanks,</strong></span></p></body></html>`;
      subject = "Thanks for registeration with Kridas";
      return { template, subject };
    default:
      return { template: "", subject: "" };
  }
};

/**
 * Method for verification mail
 * @returns
 */
const verificationMail = async (
  user,
  contentData,
  templateName = null,
  cc = null
) => {
  try {
    const { template, subject } = await verificationTemplate(user, contentData);

    const msg = {
      to: user.user_email ? user.user_email : user.company_email,
      from: "noreply@kridas.com",
      subject: subject,
      text: "Test",
      html: template,
    };
    const data = await mail.send(msg).then(() => {
      return { status: "Ok" };
    });
    console.log("mail successfully sended", msg);
    return data;
  } catch (error) {
    console.log("error occurred in sendgrid ", error);
  }
};

/**
 * Method for registeration mail
 * @returns
 */
const registerationMail = async (emailId, name, team_name, eventName) => {
  try {
    let subject = "";
    let template = "";
    let URL = process.env.CLIENT_URL;

    subject = "Sign up with Kridas!";

    template = `<html>

    <body>
        <center>
            <table height="100%" width="100%" id="backgroundTable"
                style="height:100% ;margin:0;padding:0;width:100% ;background-color:#FAFAFA;">
                <tr>
                    <td align="center" valign="top" style="border-collapse:collapse;">
                        <table border="0" cellpadding="10" cellspacing="0" width="450" id="templatePreheader"
                            style="background-color:#FAFAFA;">
                            <tr>
                                <td valign="top" class="preheaderContent" style="border-collapse:collapse;">
                                    <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                        <tr>
                                            <td valign="top" style="border-collapse:collapse;">
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table style="border:1px none #DDDDDD;background-color:#FFFFFF;">
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table width="450" id="templateHeader"
                                        style="background-color:#FFFFFF;border-bottom:0;">
                                        <tr>
                                            <td class="headerContent centeredWithBackground"
                                                style="border-collapse:collapse;color:#202020;font-family:Arial;font-size:34px;font-weight:bold;line-height:100%;padding:0;text-align:center;vertical-align:middle;background-color:white ;padding-bottom:20px;padding-top:20px;">
                                                <img width="130"
                                                    src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651575581/gallery/POST/nac87bruejgstwmx7ioo.jpg"
                                                    style="width:400px;border:0;height:55px;line-height:130%;outline:none;text-decoration:none;"
                                                    id="headerImage campaign-icon">
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table width="450" id="templateBody">

                                        <tr>
                                            <td align="center" style="border-collapse:collapse;">
                                                <table border="0" cellpadding="0" cellspacing="0">
                                                    <tbody>
                                                        <tr align="center">
                                                            <td align="center" valign="middle"
                                                                style="border-collapse:collapse;">
                                                                <h1 class="h1"
                                                                    style="color:#202020;display:block;font-family:Arial;font-size:15px;line-height:100%;margin-right:0;margin-left:0;text-align:center"
                                                                    ;>Welcome to <a
                                                                        href="https://www.kridas.com/"
                                                                        style=" text-decoration:none;">KRIDAS!</a>
                                                                </h1>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td valign="top" class="bodyContent"
                                                style="border-collapse:collapse;background-color:#FFFFFF;">
                                                <table border="0" cellpadding="20" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td valign="top"
                                                            style="padding-bottom:1rem;border-collapse:collapse;"
                                                            class="mainContainer">
                                                            <div
                                                                style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                                                <h1 class="h1"
                                                                    style="color:#202020;display:block;font-family:Arial;font-size:20px;font-weight:bold;line-height:100%;text-align:center;">
                                                                    Dear ${name}</h1>
                                                                <h2 class="h1"
                                                                    style="color:#202020;display:block;font-family:Arial;font-size:14px;line-height:100%;margin-top:20px;margin-right:0;margin-left:0;text-align:center"
                                                                    ;>
                                                                  
                                                                </h2>
                                                                <p>Congratulations! You have been added to team <b>${team_name}</b> on Kridas as part of <b>${eventName}</b>. Use the below Credentials for Login and to complete your registration process by  and experience the best of our platform. </p>
                                                            </div>
                                                            <div>
                                                                <b>Email    : ${emailId} </b>
                                                            </div>
                                                            <div>
                                                                <b>Password : Skiya@123</b>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" style="border-collapse:collapse;">
                                                            <table border="0" cellpadding="0" cellspacing="0">
                                                                <tbody>
                                                                    <tr align="center">
                                                                        <td align="center" valign="middle"
                                                                            style="border-collapse:collapse;">
                                                                            <h2
                                                                                style="background:	#ced3d7;margin: 0 auto;width: max-content;padding: 7px 10px;color: #fff;border-radius: 4px;">
                                                                                <a href="${URL}">Login Here!</a>
                                                                                 </h2>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td valign="top" border-collapse:collapse;"
                                                            class="mainContainer">
                                                            <div
                                                                style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                                                <p> Trouble using the above link? Write to us on <a href="mailto:support@kridas.com">support@kridas.com</a>
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table border="0" cellpadding="10" cellspacing="0" width="450" id="supportSection"
                                        style="background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                        <tr>
                                            <td valign="top" class="supportContent"
                                                style="border-collapse:collapse;background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                                <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td valign="top" width="100%" style="border-collapse:collapse;">
                                                            <br>
                                                            <div style="text-align: center; color: #c9c9c9;">
                                                                <h6> Kindly follow us on other social media platforms
                                                                </h6>
                                                                <a href="https://www.facebook.com/Kridas-103915698901083"
                                                                    style=" text-decoration:none;">
                                                                    <img width="27px" height="30px"
                                                                        src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572626/gallery/POST/ts6uyhqnwbtbkrmdfulg.ico"
                                                                        style="width:34px;height: 30px; padding-right: 8px;  ">
                                                                </a>
                                                                <a href="https://twitter.com/kridas_sports"
                                                                    style=" text-decoration:none;">
                                                                    <img width="22px" height="30px"
                                                                        src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572511/gallery/POST/qkjbhwzd8pd7ylop8zga.ico"
                                                                        alt="twitter"
                                                                        style="width:30px;height: 30px; padding-right: 8px;  ">
                                                                </a>
                                                                <a href="https://www.instagram.com/kridas_sports"
                                                                    style=" text-decoration:none; ">
                                                                    <img width="30px" height="30px"
                                                                        src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572584/gallery/POST/qwyrpwtbtrr7gva7zlqf.ico"
                                                                        alt="facebook"
                                                                        style="width:34px;height: 30px; padding-right: 8px;  ">
                                                                </a>
                                                                </p>
                                                            </div>
                                                            <br>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table border="0" cellpadding="10" cellspacing="0" width="450" id="templateFooter"
                                        style="background-color:#FFFFFF;border-top:0;">
                                        <tr>
                                            <td valign="top" class="footerContent"
                                                style="padding-left:0;border-collapse:collapse;background-color:#fafafa;">
                                                <div
                                                    style="text-align:center;color:#c9c9c9;font-family:Arial;font-size:11px;line-height:150%;">
                                                    <p style="text-align:left;margin:0;margin-top:2px;">
                                                        Copyright 2022 Kridas Sports Pvt Ltd. All rights reserved.
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <br>
                    </td>
                </tr>
            </table>
        </center>
    </body>

    </html>`;

    const msg = {
      to: emailId,
      from: "noreply@kridas.com",
      subject: subject,
      text: "Test",
      html: template,
    };
    const data = await mail.send(msg).then(() => {
      return { status: "Ok" };
    });
    console.log("mail successfully sended", msg);
    return data;
  } catch (error) {
    console.log("error occurred in sendgrid ", error);
  }
};

/**
 * Method for registeration mail
 * @returns
 */
const playerRegisterationMail = async (emailId, name, eventName) => {
  try {
    let subject = "";
    let template = "";
    let URL = process.env.CLIENT_URL;

    subject = "Sign up with Kridas!";

    template = `<html>
  
      <body>
          <center>
              <table height="100%" width="100%" id="backgroundTable"
                  style="height:100% ;margin:0;padding:0;width:100% ;background-color:#FAFAFA;">
                  <tr>
                      <td align="center" valign="top" style="border-collapse:collapse;">
                          <table border="0" cellpadding="10" cellspacing="0" width="450" id="templatePreheader"
                              style="background-color:#FAFAFA;">
                              <tr>
                                  <td valign="top" class="preheaderContent" style="border-collapse:collapse;">
                                      <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                          <tr>
                                              <td valign="top" style="border-collapse:collapse;">
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                          </table>
                          <table style="border:1px none #DDDDDD;background-color:#FFFFFF;">
                              <tr>
                                  <td align="center" valign="top" style="border-collapse:collapse;">
                                      <table width="450" id="templateHeader"
                                          style="background-color:#FFFFFF;border-bottom:0;">
                                          <tr>
                                              <td class="headerContent centeredWithBackground"
                                                  style="border-collapse:collapse;color:#202020;font-family:Arial;font-size:34px;font-weight:bold;line-height:100%;padding:0;text-align:center;vertical-align:middle;background-color:white ;padding-bottom:20px;padding-top:20px;">
                                                  <img width="130"
                                                      src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651575581/gallery/POST/nac87bruejgstwmx7ioo.jpg"
                                                      style="width:400px;border:0;height:55px;line-height:130%;outline:none;text-decoration:none;"
                                                      id="headerImage campaign-icon">
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center" valign="top" style="border-collapse:collapse;">
                                      <table width="450" id="templateBody">
  
                                          <tr>
                                              <td align="center" style="border-collapse:collapse;">
                                                  <table border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                          <tr align="center">
                                                              <td align="center" valign="middle"
                                                                  style="border-collapse:collapse;">
                                                                  <h1 class="h1"
                                                                      style="color:#202020;display:block;font-family:Arial;font-size:15px;line-height:100%;margin-right:0;margin-left:0;text-align:center"
                                                                      ;>Welcome to <a
                                                                          href="https://www.kridas.com/"
                                                                          style=" text-decoration:none;">KRIDAS!</a>
                                                                  </h1>
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </td>
                                          </tr>
  
                                          <tr>
                                              <td valign="top" class="bodyContent"
                                                  style="border-collapse:collapse;background-color:#FFFFFF;">
                                                  <table border="0" cellpadding="20" cellspacing="0" width="100%">
                                                      <tr>
                                                          <td valign="top"
                                                              style="padding-bottom:1rem;border-collapse:collapse;"
                                                              class="mainContainer">
                                                              <div
                                                                  style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                                                  <h1 class="h1"
                                                                      style="color:#202020;display:block;font-family:Arial;font-size:20px;font-weight:bold;line-height:100%;text-align:center;">
                                                                      Dear ${name}</h1>
                                                                  <h2 class="h1"
                                                                      style="color:#202020;display:block;font-family:Arial;font-size:14px;line-height:100%;margin-top:20px;margin-right:0;margin-left:0;text-align:center"
                                                                      ;>
                                                                    
                                                                  </h2>
                                                                  <p>Congratulations! You have been registered on Kridas as part of <b>${eventName}</b>. Use the below Credentials for Login and to complete your registration process by  and experience the best of our platform. </p>
                                                              </div>
                                                              <div>
                                                                  <b>Email    : ${emailId} </b>
                                                              </div>
                                                              <div>
                                                                  <b>Password : Skiya@123</b>
                                                              </div>
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td align="center" style="border-collapse:collapse;">
                                                              <table border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                      <tr align="center">
                                                                          <td align="center" valign="middle"
                                                                              style="border-collapse:collapse;">
                                                                              <h2
                                                                                  style="background:	#ced3d7;margin: 0 auto;width: max-content;padding: 7px 10px;color: #fff;border-radius: 4px;">
                                                                                  <a href="${URL}">Login Here!</a>
                                                                                   </h2>
                                                                          </td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
  
                                                      <tr>
                                                          <td valign="top" border-collapse:collapse;"
                                                              class="mainContainer">
                                                              <div
                                                                  style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                                                  <p> Trouble using the above link? Write to us on <a href="mailto:support@kridas.com">support@kridas.com</a>
                                                                  </p>
                                                              </div>
                                                          </td>
                                                      </tr>
  
                                                  </table>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center" valign="top" style="border-collapse:collapse;">
                                      <table border="0" cellpadding="10" cellspacing="0" width="450" id="supportSection"
                                          style="background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                          <tr>
                                              <td valign="top" class="supportContent"
                                                  style="border-collapse:collapse;background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                                  <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                                      <tr>
                                                          <td valign="top" width="100%" style="border-collapse:collapse;">
                                                              <br>
                                                              <div style="text-align: center; color: #c9c9c9;">
                                                                  <h6> Kindly follow us on other social media platforms
                                                                  </h6>
                                                                  <a href="https://www.facebook.com/Kridas-103915698901083"
                                                                      style=" text-decoration:none;">
                                                                      <img width="27px" height="30px"
                                                                          src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572626/gallery/POST/ts6uyhqnwbtbkrmdfulg.ico"
                                                                          style="width:34px;height: 30px; padding-right: 8px;  ">
                                                                  </a>
                                                                  <a href="https://twitter.com/kridas_sports"
                                                                      style=" text-decoration:none;">
                                                                      <img width="22px" height="30px"
                                                                          src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572511/gallery/POST/qkjbhwzd8pd7ylop8zga.ico"
                                                                          alt="twitter"
                                                                          style="width:30px;height: 30px; padding-right: 8px;  ">
                                                                  </a>
                                                                  <a href="https://www.instagram.com/kridas_sports"
                                                                      style=" text-decoration:none; ">
                                                                      <img width="30px" height="30px"
                                                                          src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572584/gallery/POST/qwyrpwtbtrr7gva7zlqf.ico"
                                                                          alt="facebook"
                                                                          style="width:34px;height: 30px; padding-right: 8px;  ">
                                                                  </a>
                                                                  </p>
                                                              </div>
                                                              <br>
                                                          </td>
                                                      </tr>
                                                  </table>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center" valign="top" style="border-collapse:collapse;">
                                      <table border="0" cellpadding="10" cellspacing="0" width="450" id="templateFooter"
                                          style="background-color:#FFFFFF;border-top:0;">
                                          <tr>
                                              <td valign="top" class="footerContent"
                                                  style="padding-left:0;border-collapse:collapse;background-color:#fafafa;">
                                                  <div
                                                      style="text-align:center;color:#c9c9c9;font-family:Arial;font-size:11px;line-height:150%;">
                                                      <p style="text-align:left;margin:0;margin-top:2px;">
                                                          Copyright 2022 Kridas Sports Pvt Ltd. All rights reserved.
                                                  </div>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                          </table>
                          <br>
                      </td>
                  </tr>
              </table>
          </center>
      </body>
  
      </html>`;

    const msg = {
      to: emailId,
      from: "noreply@kridas.com",
      subject: subject,
      text: "Test",
      html: template,
    };
    const data = await mail.send(msg).then(() => {
      return { status: "Ok" };
    });
    console.log("mail successfully sended", msg);
    return data;
  } catch (error) {
    console.log("error occurred in sendgrid ", error);
  }
};

/**
 * Method for Welcoming the Team Member mail
 * @returns
 */
const teamMemberMail = async (emailId, name, team_name, eventName) => {
  try {
    let subject = "";
    let template = "";
    let URL = process.env.CLIENT_URL;

    subject = "Kridas - Update";
    template = `<html>

    <body>
        <center>
            <table height="100%" width="100%" id="backgroundTable"
                style="height:100% ;margin:0;padding:0;width:100% ;background-color:#FAFAFA;">
                <tr>
                    <td align="center" valign="top" style="border-collapse:collapse;">
                        <table border="0" cellpadding="10" cellspacing="0" width="450" id="templatePreheader"
                            style="background-color:#FAFAFA;">
                            <tr>
                                <td valign="top" class="preheaderContent" style="border-collapse:collapse;">
                                    <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                        <tr>
                                            <td valign="top" style="border-collapse:collapse;">
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table style="border:1px none #DDDDDD;background-color:#FFFFFF;">
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table width="450" id="templateHeader"
                                        style="background-color:#FFFFFF;border-bottom:0;">
                                        <tr>
                                            <td class="headerContent centeredWithBackground"
                                                style="border-collapse:collapse;color:#202020;font-family:Arial;font-size:34px;font-weight:bold;line-height:100%;padding:0;text-align:center;vertical-align:middle;background-color:white ;padding-bottom:20px;padding-top:20px;">
                                                <img width="130"
                                                    src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651575581/gallery/POST/nac87bruejgstwmx7ioo.jpg"
                                                    style="width:400px;border:0;height:55px;line-height:130%;outline:none;text-decoration:none;"
                                                    id="headerImage campaign-icon">
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table width="450" id="templateBody">

                                        <tr>
                                            <td align="center" style="border-collapse:collapse;">
                                                <table border="0" cellpadding="0" cellspacing="0">
                                                    <tbody>
                                                        <tr align="center">
                                                            <td align="center" valign="middle"
                                                                style="border-collapse:collapse;">
                                                                <h1 class="h1"
                                                                    style="color:#202020;display:block;font-family:Arial;font-size:15px;line-height:100%;margin-right:0;margin-left:0;text-align:center"
                                                                    ;>Update from <a
                                                                        href="https://www.kridas.com/"
                                                                        style=" text-decoration:none;">KRIDAS!</a>
                                                                </h1>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td valign="top" class="bodyContent"
                                                style="border-collapse:collapse;background-color:#FFFFFF;">
                                                <table border="0" cellpadding="20" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td valign="top"
                                                            style="padding-bottom:1rem;border-collapse:collapse;"
                                                            class="mainContainer">
                                                            <div
                                                                style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                                                <h1 class="h1"
                                                                    style="color:#202020;display:block;font-family:Arial;font-size:20px;font-weight:bold;line-height:100%;text-align:center;">
                                                                    Dear ${name}</h1>
                                                                <h2 class="h1"
                                                                    style="color:#202020;display:block;font-family:Arial;font-size:14px;line-height:100%;margin-top:20px;margin-right:0;margin-left:0;text-align:center"
                                                                    ;>
                                                                  
                                                                </h2>
                                                                <p>Congratulations! You have been added to team <b>${team_name}</b> on Kridas as part of <b>${eventName}</b>. Experience the best of our platform. </p>
                                                                <br><br>                                                            
                                                            </div>                                                            
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" style="border-collapse:collapse;">
                                                            <table border="0" cellpadding="0" cellspacing="0">
                                                                <tbody>
                                                                    <tr align="center">
                                                                        <td align="center" valign="middle"
                                                                            style="border-collapse:collapse;">
                                                                            <h2
                                                                                style="background:	#ced3d7;margin: 0 auto;width: max-content;padding: 7px 10px;color: #fff;border-radius: 4px;">
                                                                                <a href="${URL}">Login Here!</a>
                                                                                 </h2>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td valign="top" border-collapse:collapse;"
                                                            class="mainContainer">
                                                            <div
                                                                style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                                                <p> Trouble using the above link? Write to us on <a href="mailto:support@kridas.com">support@kridas.com</a>
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table border="0" cellpadding="10" cellspacing="0" width="450" id="supportSection"
                                        style="background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                        <tr>
                                            <td valign="top" class="supportContent"
                                                style="border-collapse:collapse;background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                                <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td valign="top" width="100%" style="border-collapse:collapse;">
                                                            <br>
                                                            <div style="text-align: center; color: #c9c9c9;">
                                                                <h6> Kindly follow us on other social media platforms
                                                                </h6>
                                                                <a href="https://www.facebook.com/Kridas-103915698901083"
                                                                    style=" text-decoration:none;">
                                                                    <img width="27px" height="30px"
                                                                        src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572626/gallery/POST/ts6uyhqnwbtbkrmdfulg.ico"
                                                                        style="width:34px;height: 30px; padding-right: 8px;  ">
                                                                </a>
                                                                <a href="https://twitter.com/kridas_sports"
                                                                    style=" text-decoration:none;">
                                                                    <img width="22px" height="30px"
                                                                        src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572511/gallery/POST/qkjbhwzd8pd7ylop8zga.ico"
                                                                        alt="twitter"
                                                                        style="width:30px;height: 30px; padding-right: 8px;  ">
                                                                </a>
                                                                <a href="https://www.instagram.com/kridas_sports"
                                                                    style=" text-decoration:none; ">
                                                                    <img width="30px" height="30px"
                                                                        src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572584/gallery/POST/qwyrpwtbtrr7gva7zlqf.ico"
                                                                        alt="facebook"
                                                                        style="width:34px;height: 30px; padding-right: 8px;  ">
                                                                </a>
                                                                </p>
                                                            </div>
                                                            <br>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table border="0" cellpadding="10" cellspacing="0" width="450" id="templateFooter"
                                        style="background-color:#FFFFFF;border-top:0;">
                                        <tr>
                                            <td valign="top" class="footerContent"
                                                style="padding-left:0;border-collapse:collapse;background-color:#fafafa;">
                                                <div
                                                    style="text-align:center;color:#c9c9c9;font-family:Arial;font-size:11px;line-height:150%;">
                                                    <p style="text-align:left;margin:0;margin-top:2px;">
                                                        Copyright 2022 Kridas Sports Pvt Ltd. All rights reserved.
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <br>
                    </td>
                </tr>
            </table>
        </center>
    </body>

    </html>`;

    const msg = {
      to: emailId,
      from: "noreply@kridas.com",
      subject: subject,
      text: "Test",
      html: template,
    };
    const data = await mail.send(msg).then(() => {
      return { status: "Ok" };
    });
    console.log("mail successfully sended", msg);
    return data;
  } catch (error) {
    console.log("error occurred in sendgrid ", error);
  }
};

/**
 * Method for Welcoming the Team Member mail
 * @returns
 */
const playerRegistrationUpdationMail = async (emailId, name, eventName) => {
  try {
    let subject = "";
    let template = "";
    let URL = process.env.CLIENT_URL;

    subject = "Kridas - Update";
    template = `<html>
  
      <body>
          <center>
              <table height="100%" width="100%" id="backgroundTable"
                  style="height:100% ;margin:0;padding:0;width:100% ;background-color:#FAFAFA;">
                  <tr>
                      <td align="center" valign="top" style="border-collapse:collapse;">
                          <table border="0" cellpadding="10" cellspacing="0" width="450" id="templatePreheader"
                              style="background-color:#FAFAFA;">
                              <tr>
                                  <td valign="top" class="preheaderContent" style="border-collapse:collapse;">
                                      <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                          <tr>
                                              <td valign="top" style="border-collapse:collapse;">
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                          </table>
                          <table style="border:1px none #DDDDDD;background-color:#FFFFFF;">
                              <tr>
                                  <td align="center" valign="top" style="border-collapse:collapse;">
                                      <table width="450" id="templateHeader"
                                          style="background-color:#FFFFFF;border-bottom:0;">
                                          <tr>
                                              <td class="headerContent centeredWithBackground"
                                                  style="border-collapse:collapse;color:#202020;font-family:Arial;font-size:34px;font-weight:bold;line-height:100%;padding:0;text-align:center;vertical-align:middle;background-color:white ;padding-bottom:20px;padding-top:20px;">
                                                  <img width="130"
                                                      src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651575581/gallery/POST/nac87bruejgstwmx7ioo.jpg"
                                                      style="width:400px;border:0;height:55px;line-height:130%;outline:none;text-decoration:none;"
                                                      id="headerImage campaign-icon">
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center" valign="top" style="border-collapse:collapse;">
                                      <table width="450" id="templateBody">
  
                                          <tr>
                                              <td align="center" style="border-collapse:collapse;">
                                                  <table border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                          <tr align="center">
                                                              <td align="center" valign="middle"
                                                                  style="border-collapse:collapse;">
                                                                  <h1 class="h1"
                                                                      style="color:#202020;display:block;font-family:Arial;font-size:15px;line-height:100%;margin-right:0;margin-left:0;text-align:center"
                                                                      ;>Update from <a
                                                                          href="https://www.kridas.com/"
                                                                          style=" text-decoration:none;">KRIDAS!</a>
                                                                  </h1>
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </td>
                                          </tr>
  
                                          <tr>
                                              <td valign="top" class="bodyContent"
                                                  style="border-collapse:collapse;background-color:#FFFFFF;">
                                                  <table border="0" cellpadding="20" cellspacing="0" width="100%">
                                                      <tr>
                                                          <td valign="top"
                                                              style="padding-bottom:1rem;border-collapse:collapse;"
                                                              class="mainContainer">
                                                              <div
                                                                  style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                                                  <h1 class="h1"
                                                                      style="color:#202020;display:block;font-family:Arial;font-size:20px;font-weight:bold;line-height:100%;text-align:center;">
                                                                      Dear ${name}</h1>
                                                                  <h2 class="h1"
                                                                      style="color:#202020;display:block;font-family:Arial;font-size:14px;line-height:100%;margin-top:20px;margin-right:0;margin-left:0;text-align:center"
                                                                      ;>
                                                                    
                                                                  </h2>
                                                                  <p>Congratulations! You have been registered on Kridas as part of <b>${eventName}</b>.Experience the best of our platform. </p>
                                                                  <br><br>                                                            
                                                              </div>                                                            
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td align="center" style="border-collapse:collapse;">
                                                              <table border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                      <tr align="center">
                                                                          <td align="center" valign="middle"
                                                                              style="border-collapse:collapse;">
                                                                              <h2
                                                                                  style="background:	#ced3d7;margin: 0 auto;width: max-content;padding: 7px 10px;color: #fff;border-radius: 4px;">
                                                                                  <a href="${URL}">Login Here!</a>
                                                                                   </h2>
                                                                          </td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
  
                                                      <tr>
                                                          <td valign="top" border-collapse:collapse;"
                                                              class="mainContainer">
                                                              <div
                                                                  style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                                                  <p> Trouble using the above link? Write to us on <a href="mailto:support@kridas.com">support@kridas.com</a>
                                                                  </p>
                                                              </div>
                                                          </td>
                                                      </tr>
  
                                                  </table>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center" valign="top" style="border-collapse:collapse;">
                                      <table border="0" cellpadding="10" cellspacing="0" width="450" id="supportSection"
                                          style="background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                          <tr>
                                              <td valign="top" class="supportContent"
                                                  style="border-collapse:collapse;background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                                  <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                                      <tr>
                                                          <td valign="top" width="100%" style="border-collapse:collapse;">
                                                              <br>
                                                              <div style="text-align: center; color: #c9c9c9;">
                                                                  <h6> Kindly follow us on other social media platforms
                                                                  </h6>
                                                                  <a href="https://www.facebook.com/Kridas-103915698901083"
                                                                      style=" text-decoration:none;">
                                                                      <img width="27px" height="30px"
                                                                          src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572626/gallery/POST/ts6uyhqnwbtbkrmdfulg.ico"
                                                                          style="width:34px;height: 30px; padding-right: 8px;  ">
                                                                  </a>
                                                                  <a href="https://twitter.com/kridas_sports"
                                                                      style=" text-decoration:none;">
                                                                      <img width="22px" height="30px"
                                                                          src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572511/gallery/POST/qkjbhwzd8pd7ylop8zga.ico"
                                                                          alt="twitter"
                                                                          style="width:30px;height: 30px; padding-right: 8px;  ">
                                                                  </a>
                                                                  <a href="https://www.instagram.com/kridas_sports"
                                                                      style=" text-decoration:none; ">
                                                                      <img width="30px" height="30px"
                                                                          src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572584/gallery/POST/qwyrpwtbtrr7gva7zlqf.ico"
                                                                          alt="facebook"
                                                                          style="width:34px;height: 30px; padding-right: 8px;  ">
                                                                  </a>
                                                                  </p>
                                                              </div>
                                                              <br>
                                                          </td>
                                                      </tr>
                                                  </table>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center" valign="top" style="border-collapse:collapse;">
                                      <table border="0" cellpadding="10" cellspacing="0" width="450" id="templateFooter"
                                          style="background-color:#FFFFFF;border-top:0;">
                                          <tr>
                                              <td valign="top" class="footerContent"
                                                  style="padding-left:0;border-collapse:collapse;background-color:#fafafa;">
                                                  <div
                                                      style="text-align:center;color:#c9c9c9;font-family:Arial;font-size:11px;line-height:150%;">
                                                      <p style="text-align:left;margin:0;margin-top:2px;">
                                                          Copyright 2022 Kridas Sports Pvt Ltd. All rights reserved.
                                                  </div>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                          </table>
                          <br>
                      </td>
                  </tr>
              </table>
          </center>
      </body>
  
      </html>`;

    const msg = {
      to: emailId,
      from: "noreply@kridas.com",
      subject: subject,
      text: "Test",
      html: template,
    };
    const data = await mail.send(msg).then(() => {
      return { status: "Ok" };
    });
    console.log("mail successfully sended", msg);
    return data;
  } catch (error) {
    console.log("error occurred in sendgrid ", error);
  }
};

/**
 * Method for registeration mail
 * @returns
 */
const newPlayerRegistrationMail = async (emailId, name, team_name) => {
  try {
    let subject = "";
    let template = "";
    let URL = process.env.CLIENT_URL;

    subject = "Sign up with Kridas!";

    template = `<html>
  
      <body>
          <center>
              <table height="100%" width="100%" id="backgroundTable"
                  style="height:100% ;margin:0;padding:0;width:100% ;background-color:#FAFAFA;">
                  <tr>
                      <td align="center" valign="top" style="border-collapse:collapse;">
                          <table border="0" cellpadding="10" cellspacing="0" width="450" id="templatePreheader"
                              style="background-color:#FAFAFA;">
                              <tr>
                                  <td valign="top" class="preheaderContent" style="border-collapse:collapse;">
                                      <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                          <tr>
                                              <td valign="top" style="border-collapse:collapse;">
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                          </table>
                          <table style="border:1px none #DDDDDD;background-color:#FFFFFF;">
                              <tr>
                                  <td align="center" valign="top" style="border-collapse:collapse;">
                                      <table width="450" id="templateHeader"
                                          style="background-color:#FFFFFF;border-bottom:0;">
                                          <tr>
                                              <td class="headerContent centeredWithBackground"
                                                  style="border-collapse:collapse;color:#202020;font-family:Arial;font-size:34px;font-weight:bold;line-height:100%;padding:0;text-align:center;vertical-align:middle;background-color:white ;padding-bottom:20px;padding-top:20px;">
                                                  <img width="130"
                                                      src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651575581/gallery/POST/nac87bruejgstwmx7ioo.jpg"
                                                      style="width:400px;border:0;height:55px;line-height:130%;outline:none;text-decoration:none;"
                                                      id="headerImage campaign-icon">
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center" valign="top" style="border-collapse:collapse;">
                                      <table width="450" id="templateBody">
  
                                          <tr>
                                              <td align="center" style="border-collapse:collapse;">
                                                  <table border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                          <tr align="center">
                                                              <td align="center" valign="middle"
                                                                  style="border-collapse:collapse;">
                                                                  <h1 class="h1"
                                                                      style="color:#202020;display:block;font-family:Arial;font-size:15px;line-height:100%;margin-right:0;margin-left:0;text-align:center"
                                                                      ;>Welcome to <a
                                                                          href="https://www.kridas.com/"
                                                                          style=" text-decoration:none;">KRIDAS!</a>
                                                                  </h1>
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </td>
                                          </tr>
  
                                          <tr>
                                              <td valign="top" class="bodyContent"
                                                  style="border-collapse:collapse;background-color:#FFFFFF;">
                                                  <table border="0" cellpadding="20" cellspacing="0" width="100%">
                                                      <tr>
                                                          <td valign="top"
                                                              style="padding-bottom:1rem;border-collapse:collapse;"
                                                              class="mainContainer">
                                                              <div
                                                                  style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                                                  <h1 class="h1"
                                                                      style="color:#202020;display:block;font-family:Arial;font-size:20px;font-weight:bold;line-height:100%;text-align:center;">
                                                                      Dear ${name}</h1>
                                                                  <h2 class="h1"
                                                                      style="color:#202020;display:block;font-family:Arial;font-size:14px;line-height:100%;margin-top:20px;margin-right:0;margin-left:0;text-align:center"
                                                                      ;>
                                                                    
                                                                  </h2>
                                                                  <p>Congratulations! You have been added to team <b>${team_name}</b>. Use the below Credentials for Login and to complete your registration process by  and experience the best of our platform. </p>
                                                              </div>
                                                              <div>
                                                                  <b>Email    : ${emailId} </b>
                                                              </div>
                                                              <div>
                                                                  <b>Password : Skiya@123</b>
                                                              </div>
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td align="center" style="border-collapse:collapse;">
                                                              <table border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                      <tr align="center">
                                                                          <td align="center" valign="middle"
                                                                              style="border-collapse:collapse;">
                                                                              <h2
                                                                                  style="background:	#ced3d7;margin: 0 auto;width: max-content;padding: 7px 10px;color: #fff;border-radius: 4px;">
                                                                                  <a href="${URL}">Login Here!</a>
                                                                                   </h2>
                                                                          </td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
  
                                                      <tr>
                                                          <td valign="top" border-collapse:collapse;"
                                                              class="mainContainer">
                                                              <div
                                                                  style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                                                  <p> Trouble using the above link? Write to us on <a href="mailto:support@kridas.com">support@kridas.com</a>
                                                                  </p>
                                                              </div>
                                                          </td>
                                                      </tr>
  
                                                  </table>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center" valign="top" style="border-collapse:collapse;">
                                      <table border="0" cellpadding="10" cellspacing="0" width="450" id="supportSection"
                                          style="background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                          <tr>
                                              <td valign="top" class="supportContent"
                                                  style="border-collapse:collapse;background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                                  <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                                      <tr>
                                                          <td valign="top" width="100%" style="border-collapse:collapse;">
                                                              <br>
                                                              <div style="text-align: center; color: #c9c9c9;">
                                                                  <h6> Kindly follow us on other social media platforms
                                                                  </h6>
                                                                  <a href="https://www.facebook.com/Kridas-103915698901083"
                                                                      style=" text-decoration:none;">
                                                                      <img width="27px" height="30px"
                                                                          src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572626/gallery/POST/ts6uyhqnwbtbkrmdfulg.ico"
                                                                          style="width:34px;height: 30px; padding-right: 8px;  ">
                                                                  </a>
                                                                  <a href="https://twitter.com/kridas_sports"
                                                                      style=" text-decoration:none;">
                                                                      <img width="22px" height="30px"
                                                                          src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572511/gallery/POST/qkjbhwzd8pd7ylop8zga.ico"
                                                                          alt="twitter"
                                                                          style="width:30px;height: 30px; padding-right: 8px;  ">
                                                                  </a>
                                                                  <a href="https://www.instagram.com/kridas_sports"
                                                                      style=" text-decoration:none; ">
                                                                      <img width="30px" height="30px"
                                                                          src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572584/gallery/POST/qwyrpwtbtrr7gva7zlqf.ico"
                                                                          alt="facebook"
                                                                          style="width:34px;height: 30px; padding-right: 8px;  ">
                                                                  </a>
                                                                  </p>
                                                              </div>
                                                              <br>
                                                          </td>
                                                      </tr>
                                                  </table>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center" valign="top" style="border-collapse:collapse;">
                                      <table border="0" cellpadding="10" cellspacing="0" width="450" id="templateFooter"
                                          style="background-color:#FFFFFF;border-top:0;">
                                          <tr>
                                              <td valign="top" class="footerContent"
                                                  style="padding-left:0;border-collapse:collapse;background-color:#fafafa;">
                                                  <div
                                                      style="text-align:center;color:#c9c9c9;font-family:Arial;font-size:11px;line-height:150%;">
                                                      <p style="text-align:left;margin:0;margin-top:2px;">
                                                          Copyright 2022 Kridas Sports Pvt Ltd. All rights reserved.
                                                  </div>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                          </table>
                          <br>
                      </td>
                  </tr>
              </table>
          </center>
      </body>
  
      </html>`;

    const msg = {
      to: emailId,
      from: "noreply@kridas.com",
      subject: subject,
      text: "Test",
      html: template,
    };
    const data = await mail.send(msg).then(() => {
      return { status: "Ok" };
    });
    console.log("mail successfully sended", msg);
    return data;
  } catch (error) {
    console.log("error occurred in sendgrid ", error);
  }
};

/**
 * Method for Welcoming the Team Member mail
 * @returns
 */
const playerRegistrationWelcomeMail = async (emailId, name, team_name) => {
  try {
    let subject = "";
    let template = "";
    let URL = process.env.CLIENT_URL;

    subject = "Kridas - Update";
    template = `<html>
  
      <body>
          <center>
              <table height="100%" width="100%" id="backgroundTable"
                  style="height:100% ;margin:0;padding:0;width:100% ;background-color:#FAFAFA;">
                  <tr>
                      <td align="center" valign="top" style="border-collapse:collapse;">
                          <table border="0" cellpadding="10" cellspacing="0" width="450" id="templatePreheader"
                              style="background-color:#FAFAFA;">
                              <tr>
                                  <td valign="top" class="preheaderContent" style="border-collapse:collapse;">
                                      <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                          <tr>
                                              <td valign="top" style="border-collapse:collapse;">
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                          </table>
                          <table style="border:1px none #DDDDDD;background-color:#FFFFFF;">
                              <tr>
                                  <td align="center" valign="top" style="border-collapse:collapse;">
                                      <table width="450" id="templateHeader"
                                          style="background-color:#FFFFFF;border-bottom:0;">
                                          <tr>
                                              <td class="headerContent centeredWithBackground"
                                                  style="border-collapse:collapse;color:#202020;font-family:Arial;font-size:34px;font-weight:bold;line-height:100%;padding:0;text-align:center;vertical-align:middle;background-color:white ;padding-bottom:20px;padding-top:20px;">
                                                  <img width="130"
                                                      src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651575581/gallery/POST/nac87bruejgstwmx7ioo.jpg"
                                                      style="width:400px;border:0;height:55px;line-height:130%;outline:none;text-decoration:none;"
                                                      id="headerImage campaign-icon">
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center" valign="top" style="border-collapse:collapse;">
                                      <table width="450" id="templateBody">
  
                                          <tr>
                                              <td align="center" style="border-collapse:collapse;">
                                                  <table border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                          <tr align="center">
                                                              <td align="center" valign="middle"
                                                                  style="border-collapse:collapse;">
                                                                  <h1 class="h1"
                                                                      style="color:#202020;display:block;font-family:Arial;font-size:15px;line-height:100%;margin-right:0;margin-left:0;text-align:center"
                                                                      ;>Update from <a
                                                                          href="https://www.kridas.com/"
                                                                          style=" text-decoration:none;">KRIDAS!</a>
                                                                  </h1>
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </td>
                                          </tr>
  
                                          <tr>
                                              <td valign="top" class="bodyContent"
                                                  style="border-collapse:collapse;background-color:#FFFFFF;">
                                                  <table border="0" cellpadding="20" cellspacing="0" width="100%">
                                                      <tr>
                                                          <td valign="top"
                                                              style="padding-bottom:1rem;border-collapse:collapse;"
                                                              class="mainContainer">
                                                              <div
                                                                  style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                                                  <h1 class="h1"
                                                                      style="color:#202020;display:block;font-family:Arial;font-size:20px;font-weight:bold;line-height:100%;text-align:center;">
                                                                      Dear ${name}</h1>
                                                                  <h2 class="h1"
                                                                      style="color:#202020;display:block;font-family:Arial;font-size:14px;line-height:100%;margin-top:20px;margin-right:0;margin-left:0;text-align:center"
                                                                      ;>
                                                                    
                                                                  </h2>
                                                                  <p>Congratulations! You have been added to team <b>${team_name}</b>. Use the below Credentials for experience the best of our platform. </p>
                                                                  <br><br>                                                            
                                                              </div>                                                            
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td align="center" style="border-collapse:collapse;">
                                                              <table border="0" cellpadding="0" cellspacing="0">
                                                                  <tbody>
                                                                      <tr align="center">
                                                                          <td align="center" valign="middle"
                                                                              style="border-collapse:collapse;">
                                                                              <h2
                                                                                  style="background:	#ced3d7;margin: 0 auto;width: max-content;padding: 7px 10px;color: #fff;border-radius: 4px;">
                                                                                  <a href="${URL}">Login Here!</a>
                                                                                   </h2>
                                                                          </td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
  
                                                      <tr>
                                                          <td valign="top" border-collapse:collapse;"
                                                              class="mainContainer">
                                                              <div
                                                                  style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                                                  <p> Trouble using the above link? Write to us on <a href="mailto:support@kridas.com">support@kridas.com</a>
                                                                  </p>
                                                              </div>
                                                          </td>
                                                      </tr>
  
                                                  </table>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center" valign="top" style="border-collapse:collapse;">
                                      <table border="0" cellpadding="10" cellspacing="0" width="450" id="supportSection"
                                          style="background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                          <tr>
                                              <td valign="top" class="supportContent"
                                                  style="border-collapse:collapse;background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                                  <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                                      <tr>
                                                          <td valign="top" width="100%" style="border-collapse:collapse;">
                                                              <br>
                                                              <div style="text-align: center; color: #c9c9c9;">
                                                                  <h6> Kindly follow us on other social media platforms
                                                                  </h6>
                                                                  <a href="https://www.facebook.com/Kridas-103915698901083"
                                                                      style=" text-decoration:none;">
                                                                      <img width="27px" height="30px"
                                                                          src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572626/gallery/POST/ts6uyhqnwbtbkrmdfulg.ico"
                                                                          style="width:34px;height: 30px; padding-right: 8px;  ">
                                                                  </a>
                                                                  <a href="https://twitter.com/kridas_sports"
                                                                      style=" text-decoration:none;">
                                                                      <img width="22px" height="30px"
                                                                          src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572511/gallery/POST/qkjbhwzd8pd7ylop8zga.ico"
                                                                          alt="twitter"
                                                                          style="width:30px;height: 30px; padding-right: 8px;  ">
                                                                  </a>
                                                                  <a href="https://www.instagram.com/kridas_sports"
                                                                      style=" text-decoration:none; ">
                                                                      <img width="30px" height="30px"
                                                                          src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572584/gallery/POST/qwyrpwtbtrr7gva7zlqf.ico"
                                                                          alt="facebook"
                                                                          style="width:34px;height: 30px; padding-right: 8px;  ">
                                                                  </a>
                                                                  </p>
                                                              </div>
                                                              <br>
                                                          </td>
                                                      </tr>
                                                  </table>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center" valign="top" style="border-collapse:collapse;">
                                      <table border="0" cellpadding="10" cellspacing="0" width="450" id="templateFooter"
                                          style="background-color:#FFFFFF;border-top:0;">
                                          <tr>
                                              <td valign="top" class="footerContent"
                                                  style="padding-left:0;border-collapse:collapse;background-color:#fafafa;">
                                                  <div
                                                      style="text-align:center;color:#c9c9c9;font-family:Arial;font-size:11px;line-height:150%;">
                                                      <p style="text-align:left;margin:0;margin-top:2px;">
                                                          Copyright 2022 Kridas Sports Pvt Ltd. All rights reserved.
                                                  </div>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                          </table>
                          <br>
                      </td>
                  </tr>
              </table>
          </center>
      </body>
  
      </html>`;

    const msg = {
      to: emailId,
      from: "noreply@kridas.com",
      subject: subject,
      text: "Test",
      html: template,
    };
    const data = await mail.send(msg).then(() => {
      return { status: "Ok" };
    });
    console.log("mail successfully sended", msg);
    return data;
  } catch (error) {
    console.log("error occurred in sendgrid ", error);
  }
};

/**
 *Method for pre register mail
 */
const preRegisterMail = async (user) => {
  try {
    const { template, subject } = await preRegisterTemplate(user);

    const msg = {
      to: user.email,
      from: "noreply@kridas.com",
      subject: subject,
      text: "Test",
      html: template,
    };
    const data = await mail.send(msg).then(() => {
      return { status: "Ok" };
    });
    return data;
  } catch (error) {
    console.log("error occurred in sendgrid ", error);
  }
};

const preRegisterTemplate = async (user) => {
  let template = "";
  let subject = "";
  template = `
    <html>
<body style="font-size: 16px; background-color: #fdfdfd; margin: 0; padding: 0; font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%; line-height: 1.5; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; height: 100% !important; width: 100% !important;">
<table bgcolor="#fdfdfd" class="body" style="box-sizing: border-box; border-spacing: 0; mso-table-rspace: 0pt; mso-table-lspace: 0pt; width: 100%; background-color: #fdfdfd; border-collapse: separate !important;" width="100%">
	<tbody>
		<tr>
			<div class="header" style="box-sizing: border-box; width: 100%; margin-top: 15px;">
			<table style="box-sizing: border-box; width: 100%; border-spacing: 0; mso-table-rspace: 0pt; mso-table-lspace: 0pt; border-collapse: separate !important;" width="100%">
				<tbody>
					<tr>
						<td align="left" class="align-left" style="box-sizing: border-box; padding: 0; vertical-align: top; text-align: left;" valign="top"><span class="sg-image" ><img alt="kridas" height="25" src="https://res.cloudinary.com/dmn4tzgsp/image/upload/v1646129961/gallery/POST/gwhtevabsxvkd9ttln1h.png" style="max-width: 100%; border-style: none; width: 150px; height: 30px;" width="150"></span></td>
					</tr>
				</tbody>
			</table>
			</div>

			<div style="box-sizing: border-box; width: 100%; margin-bottom:20px;margin-top:20px;margin-left:10px;padding:5px;backgroundund: #ffffff; border: 1px solid #f0f0f0;">
				
					 <div>
                <p><span><strong>Dear ${user.first_name},</strong></span><br>
                <p> Thanks for registering your interest with Kridas, global sports networking and career platform. </p>
                <p> Profile - ${user.profile}</p>
                <p> Sports interested - ${user.sports}</p>
                <p> We will be up and running on <b>16th April 2022</b>.</p>
                <p> Until then, Kindly follow us on other social media platforms. </p>
                <p><b>Facebook </b><br>
                    <a href="https://www.facebook.com/Kridas-103915698901083">
                        https://www.facebook.com/Kridas-103915698901083</a>
                </p>
                <p> <b>Instagram </b><br>
                    <a href="https://www.instagram.com/kridas_sports"> https://www.instagram.com/kridas_sports</a>
                </p>
                <p> <b> Twitter </b><br>
                    <a href="https://twitter.com/kridas_sports"> https://twitter.com/kridas_sports</a>
                </p>
                <div class="foot">
                    <span><strong>Thanks and Regards,</strong></span></p>
                    <span><strong>Kridas team</strong></span></p>
                </div>
    
            </div>
					
			</div>

			
			</div>
			</td>
			
		</tr>
	</tbody>
</table>
</body>
</html>
`;
  subject = "Kridas Registration";
  return { template, subject };
};

/**
 * Method for Activation Mail
 * @returns
 */
const activationMail = async (name, emailId) => {
  try {
    let subject = "";
    let template = "";
    let URL = process.env.CLIENT_URL;

    subject = `Kridas Account Activated for ${name}`;

    template = `<html>
  
    <body>
        <center>
            <table height="100%" width="100%" id="backgroundTable"
                style="height:100% ;margin:0;padding:0;width:100% ;background-color:#FAFAFA;">
                <tr>
                    <td align="center" valign="top" style="border-collapse:collapse;">
                        <table border="0" cellpadding="10" cellspacing="0" width="450" id="templatePreheader"
                            style="background-color:#FAFAFA;">
                            <tr>
                                <td valign="top" class="preheaderContent" style="border-collapse:collapse;">
                                    <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                        <tr>
                                            <td valign="top" style="border-collapse:collapse;">
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table style="border:1px none #DDDDDD;background-color:#FFFFFF;">
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table width="450" id="templateHeader"
                                        style="background-color:#FFFFFF;border-bottom:0;">
                                        <tr>
                                            <td class="headerContent centeredWithBackground"
                                                style="border-collapse:collapse;color:#202020;font-family:Arial;font-size:34px;font-weight:bold;line-height:100%;padding:0;text-align:center;vertical-align:middle;background-color:white ;padding-bottom:20px;padding-top:20px;">
                                                <img width="130"
                                                    src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651575581/gallery/POST/nac87bruejgstwmx7ioo.jpg"
                                                    style="width:400px;border:0;height:55px;line-height:130%;outline:none;text-decoration:none;"
                                                    id="headerImage campaign-icon">
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table width="450" id="templateBody">

                                        <tr>
                                            <td align="center" style="border-collapse:collapse;">
                                                <table border="0" cellpadding="0" cellspacing="0">
                                                    <tbody>
                                                        <tr align="center">
                                                            <td align="center" valign="middle"
                                                                style="border-collapse:collapse;">
                                                                <h1 class="h1"
                                                                    style="color:#202020;display:block;font-family:Arial;font-size:15px;line-height:100%;margin-right:0;margin-left:0;text-align:center"
                                                                    ;>Welcome to <a
                                                                        href="https://www.kridas.com/"
                                                                        style=" text-decoration:none;">KRIDAS!</a>
                                                                </h1>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td valign="top" class="bodyContent"
                                                style="border-collapse:collapse;background-color:#FFFFFF;">
                                                <table border="0" cellpadding="20" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td valign="top"
                                                            style="padding-bottom:1rem;border-collapse:collapse;"
                                                            class="mainContainer">
                                                            <div
                                                                style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                                                <h1 class="h1"
                                                                    style="color:#202020;display:block;font-family:Arial;font-size:20px;font-weight:bold;line-height:100%;text-align:center;">
                                                                    Dear ${name}</h1>
                                                                <h2 class="h1"
                                                                    style="color:#202020;display:block;font-family:Arial;font-size:14px;line-height:100%;margin-top:20px;margin-right:0;margin-left:0;text-align:center"
                                                                    ;>
                                                                  
                                                                </h2>
                                                                <p>Congratulations! Your Account in Kridas is now Activated.Now you can able to access Kridas features</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" style="border-collapse:collapse;">
                                                            <table border="0" cellpadding="0" cellspacing="0">
                                                                <tbody>
                                                                    <tr align="center">
                                                                        <td align="center" valign="middle"
                                                                            style="border-collapse:collapse;">
                                                                            <h2
                                                                                style="background:	#ced3d7;margin: 0 auto;width: max-content;padding: 7px 10px;color: #fff;border-radius: 4px;">
                                                                                <a href="${URL}">Login!</a>
                                                                                 </h2>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td valign="top" border-collapse:collapse;"
                                                            class="mainContainer">
                                                            <div
                                                                style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                                                <p> Trouble using the above link? Write to us on <a href="mailto:support@kridas.com">support@kridas.com</a>
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table border="0" cellpadding="10" cellspacing="0" width="450" id="supportSection"
                                        style="background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                        <tr>
                                            <td valign="top" class="supportContent"
                                                style="border-collapse:collapse;background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                                <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td valign="top" width="100%" style="border-collapse:collapse;">
                                                            <br>
                                                            <div style="text-align: center; color: #c9c9c9;">
                                                                <h6> Kindly follow us on other social media platforms
                                                                </h6>
                                                                <a href="https://www.facebook.com/Kridas-103915698901083"
                                                                    style=" text-decoration:none;">
                                                                    <img width="27px" height="30px"
                                                                        src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572626/gallery/POST/ts6uyhqnwbtbkrmdfulg.ico"
                                                                        style="width:34px;height: 30px; padding-right: 8px;  ">
                                                                </a>
                                                                <a href="https://twitter.com/kridas_sports"
                                                                    style=" text-decoration:none;">
                                                                    <img width="22px" height="30px"
                                                                        src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572511/gallery/POST/qkjbhwzd8pd7ylop8zga.ico"
                                                                        alt="twitter"
                                                                        style="width:30px;height: 30px; padding-right: 8px;  ">
                                                                </a>
                                                                <a href="https://www.instagram.com/kridas_sports"
                                                                    style=" text-decoration:none; ">
                                                                    <img width="30px" height="30px"
                                                                        src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572584/gallery/POST/qwyrpwtbtrr7gva7zlqf.ico"
                                                                        alt="facebook"
                                                                        style="width:34px;height: 30px; padding-right: 8px;  ">
                                                                </a>
                                                                </p>
                                                            </div>
                                                            <br>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table border="0" cellpadding="10" cellspacing="0" width="450" id="templateFooter"
                                        style="background-color:#FFFFFF;border-top:0;">
                                        <tr>
                                            <td valign="top" class="footerContent"
                                                style="padding-left:0;border-collapse:collapse;background-color:#fafafa;">
                                                <div
                                                    style="text-align:center;color:#c9c9c9;font-family:Arial;font-size:11px;line-height:150%;">
                                                    <p style="text-align:left;margin:0;margin-top:2px;">
                                                        Copyright 2022 Kridas Sports Pvt Ltd. All rights reserved.
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <br>
                    </td>
                </tr>
            </table>
        </center>
    </body>

    </html>`;

    const msg = {
      to: emailId,
      from: "noreply@kridas.com",
      subject: subject,
      text: "Test",
      html: template,
    };
    const data = await mail.send(msg).then(() => {
      return { status: "Ok" };
    });
    console.log("mail successfully sended", msg);
    return data;
  } catch (error) {
    console.log("error occurred in sendgrid ", error);
  }
};

/**
 * Method for In Activation Mail
 * @returns
 */
const inActivationMail = async (name, emailId) => {
  try {
    let subject = "";
    let template = "";

    subject = `Kridas Account DeActivated for ${name}`;

    template = `<html>
  
    <body>
        <center>
            <table height="100%" width="100%" id="backgroundTable"
                style="height:100% ;margin:0;padding:0;width:100% ;background-color:#FAFAFA;">
                <tr>
                    <td align="center" valign="top" style="border-collapse:collapse;">
                        <table border="0" cellpadding="10" cellspacing="0" width="450" id="templatePreheader"
                            style="background-color:#FAFAFA;">
                            <tr>
                                <td valign="top" class="preheaderContent" style="border-collapse:collapse;">
                                    <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                        <tr>
                                            <td valign="top" style="border-collapse:collapse;">
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table style="border:1px none #DDDDDD;background-color:#FFFFFF;">
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table width="450" id="templateHeader"
                                        style="background-color:#FFFFFF;border-bottom:0;">
                                        <tr>
                                            <td class="headerContent centeredWithBackground"
                                                style="border-collapse:collapse;color:#202020;font-family:Arial;font-size:34px;font-weight:bold;line-height:100%;padding:0;text-align:center;vertical-align:middle;background-color:white ;padding-bottom:20px;padding-top:20px;">
                                                <img width="130"
                                                    src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651575581/gallery/POST/nac87bruejgstwmx7ioo.jpg"
                                                    style="width:400px;border:0;height:55px;line-height:130%;outline:none;text-decoration:none;"
                                                    id="headerImage campaign-icon">
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table width="450" id="templateBody">

                                        <tr>
                                            <td align="center" style="border-collapse:collapse;">
                                                <table border="0" cellpadding="0" cellspacing="0">
                                                    <tbody>
                                                        <tr align="center">
                                                            <td align="center" valign="middle"
                                                                style="border-collapse:collapse;">
                                                                <h1 class="h1"
                                                                    style="color:#202020;display:block;font-family:Arial;font-size:15px;line-height:100%;margin-right:0;margin-left:0;text-align:center"
                                                                    ;>Update From <a
                                                                        href="https://www.kridas.com/"
                                                                        style=" text-decoration:none;">KRIDAS!</a>
                                                                </h1>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td valign="top" class="bodyContent"
                                                style="border-collapse:collapse;background-color:#FFFFFF;">
                                                <table border="0" cellpadding="20" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td valign="top"
                                                            style="padding-bottom:1rem;border-collapse:collapse;"
                                                            class="mainContainer">
                                                            <div
                                                                style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                                                                <h1 class="h1"
                                                                    style="color:#202020;display:block;font-family:Arial;font-size:20px;font-weight:bold;line-height:100%;text-align:center;">
                                                                    Dear ${name}</h1>
                                                                <h2 class="h1"
                                                                    style="color:#202020;display:block;font-family:Arial;font-size:14px;line-height:100%;margin-top:20px;margin-right:0;margin-left:0;text-align:center"
                                                                    ;>
                                                                  
                                                                </h2>
                                                                <p>Your Account was <b>Deactivated</b>.For further details contact <a href="mailto:support@kridas.com">support@kridas.com</a></p>
                                                            </div>
                                                        </td>
                                                    </tr>  
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table border="0" cellpadding="10" cellspacing="0" width="450" id="supportSection"
                                        style="background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                        <tr>
                                            <td valign="top" class="supportContent"
                                                style="border-collapse:collapse;background-color:white;font-family:arial;font-size:12px;border-top:1px solid #e4e4e4;">
                                                <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td valign="top" width="100%" style="border-collapse:collapse;">
                                                            <br>
                                                            <div style="text-align: center; color: #c9c9c9;">
                                                                <h6> Kindly follow us on other social media platforms
                                                                </h6>
                                                                <a href="https://www.facebook.com/Kridas-103915698901083"
                                                                    style=" text-decoration:none;">
                                                                    <img width="27px" height="30px"
                                                                        src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572626/gallery/POST/ts6uyhqnwbtbkrmdfulg.ico"
                                                                        style="width:34px;height: 30px; padding-right: 8px;  ">
                                                                </a>
                                                                <a href="https://twitter.com/kridas_sports"
                                                                    style=" text-decoration:none;">
                                                                    <img width="22px" height="30px"
                                                                        src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572511/gallery/POST/qkjbhwzd8pd7ylop8zga.ico"
                                                                        alt="twitter"
                                                                        style="width:30px;height: 30px; padding-right: 8px;  ">
                                                                </a>
                                                                <a href="https://www.instagram.com/kridas_sports"
                                                                    style=" text-decoration:none; ">
                                                                    <img width="30px" height="30px"
                                                                        src="http://res.cloudinary.com/dmn4tzgsp/image/upload/v1651572584/gallery/POST/qwyrpwtbtrr7gva7zlqf.ico"
                                                                        alt="facebook"
                                                                        style="width:34px;height: 30px; padding-right: 8px;  ">
                                                                </a>
                                                                </p>
                                                            </div>
                                                            <br>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" style="border-collapse:collapse;">
                                    <table border="0" cellpadding="10" cellspacing="0" width="450" id="templateFooter"
                                        style="background-color:#FFFFFF;border-top:0;">
                                        <tr>
                                            <td valign="top" class="footerContent"
                                                style="padding-left:0;border-collapse:collapse;background-color:#fafafa;">
                                                <div
                                                    style="text-align:center;color:#c9c9c9;font-family:Arial;font-size:11px;line-height:150%;">
                                                    <p style="text-align:left;margin:0;margin-top:2px;">
                                                        Copyright 2022 Kridas Sports Pvt Ltd. All rights reserved.
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <br>
                    </td>
                </tr>
            </table>
        </center>
    </body>

    </html>`;

    const msg = {
      to: emailId,
      from: "noreply@kridas.com",
      subject: subject,
      text: "Test",
      html: template,
    };
    const data = await mail.send(msg).then(() => {
      return { status: "Ok" };
    });
    console.log("mail successfully sended", msg);
    return data;
  } catch (error) {
    console.log("error occurred in sendgrid ", error);
  }
};

/**
 *Method to send mail for Participants who are registering for an event
 */

const participantRegistrationMail = async (
  participant_first_name,
  participated_event_name,
  participated_event_startdate,
  participated_event_venue,
  participantEmailId
) => {
  let firstName = participant_first_name;
  let eventName = participated_event_name;
  let eventStartdate = participated_event_startdate;
  let venue = participated_event_venue;
  let emailId = participantEmailId;
  let venueName = [];
  let isOfflineVenue = false;
  let exact_event_venue = null;
  let venueType = null;
  let eventTime = "AM";

  let startDateOfTheEvent = eventStartdate.toString();

  /* let eventDate = new Date(eventStartdate); */

  let dateArray = startDateOfTheEvent.split(" ");

  let month = dateArray[1];

  let date = Number(dateArray[2]);

  let year = dateArray[3];

  let timeInDB = dateArray[4];

  let timeArray = timeInDB.split(":");

  let hours = Number(timeArray[0]);

  let minutes = Number(timeArray[1]);

  let seconds = Number(timeArray[2]);

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  if (hours > 12) {
    hours = hours - 12;
    eventTime = "PM";
    if (hours < 10) hours = "0" + hours;
  }

  let time = hours + ":" + minutes + ":" + seconds + " " + eventTime;

  if (date < 10) date = "0" + date;

  let formatted_event_start_date =
    date + "-" + month + "-" + year + " - " + time;

  /* const yyyy = eventDate.getFullYear();
  let mm = eventDate.getMonth() + 1; // Months start at 0!
  let dd = eventDate.getDate();
  let hours = eventDate.getHours();
  let minutes = eventDate.getMinutes();
  let seconds = eventDate.getSeconds();

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  if (hours > 12) {
    hours = hours - 12;
    eventTime = "PM";
    if (hours < 10) hours = "0" + hours;
  }

  let time = hours + ":" + minutes + ":" + seconds + " " + eventTime;

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm; */

  /*   let formatted_event_start_date = dd + "-" + mm + "-" + yyyy + " - " + time;
   */
  if (venue?.length > 0) {
    if (venue[0].company_name) {
      isOfflineVenue = true;
      for await (let venue_name of venue) {
        let tournCatVenueName = venue_name?.company_name;
        venueName.push(tournCatVenueName);
      }
    }
  }

  if (isOfflineVenue == false) {
    venueType = "Link to Participate";
    exact_event_venue = venue;
  } else {
    venueType = "Venue";
    exact_event_venue = venueName;
  }

  const email = {
    from: {
      email: "noreply@kridas.com",
      name: "Kridas",
    },
    template_id: "d-b60ff2ae55aa4f0d9a4edaf62f7bb12b",
    personalizations: [
      {
        to: [
          {
            email: emailId,
            name: firstName,
          },
        ],
        dynamic_template_data: {
          first_name: firstName,
          event_name: eventName,
          event_startdate: formatted_event_start_date,
          venue_type: venueType,
          event_venue: exact_event_venue,
        },
      },
    ],
  };

  return axios({
    method: "post",
    url: "https://api.sendgrid.com/v3/mail/send",
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
    },
    data: email,
  });
};

/**
 *Method to send mail for Organizer who conduct an event while team resgistration
 */
const organizerMailOnTeamRegistration = async (
  page_name,
  event_name,
  participant_name,
  tournament_category,
  sports_name,
  sports_category,
  event_contacts = null,
  third_level_page_email,
  parent_page_email,
  pageOwnerEmail,
  contact_number = null,
  contact_email = null,
  eventOwnerEmail = null,
  contactPerson = null,
  eventOwnerName = null,
  teamParentPageOwnerName = null,
  type = null
) => {
  let email = null;
  if (type === "player") {
    let pageName = page_name;
    let eventName = event_name;
    let participantName = participant_name;
    let tournamentCategory = tournament_category;
    let sportsName = sports_name;
    let sportsCategory = sports_category;
    let eventContacts = event_contacts;
    let thirdLevelPageEmail = third_level_page_email;
    let parentPageEmail = parent_page_email;
    let pageOwnerEmailId = pageOwnerEmail;
    let contactNumber = contact_number;
    let contactEmailId = contact_email;
    let eventOwnerEmailId = eventOwnerEmail;
    let eventOwnerFullName = eventOwnerName;

    let contactPersonDetails = [];
    let sportsCategoryName = null;

    // if (eventContacts) {
    //   for await (let contact of eventContacts) {
    //     let contactDetails = contact;
    //     contactPersonDetails.push(contactDetails);
    //   }
    // }

    for await (let category of sportsCategory) {
      let categoryCode = category?.category_code;
      if (categoryCode === tournamentCategory) {
        sportsCategoryName = category?.category_name;
      }
    }

    let sportsNameWithCategory = sportsName + " - " + sportsCategoryName;

    email = {
      from: {
        email: "noreply@kridas.com",
        name: "Kridas",
      },
      template_id: "d-04ea7735fd19433aafeaa18e330c72a6",
      personalizations: [
        {
          to: [
            {
              email: eventOwnerEmailId,
              name: eventOwnerFullName,
              //   email: "apvijaycivil@gmail.com",
              //   name: "A.P.Vijay",
            },
          ],

          dynamic_template_data: {
            page_name: pageName,
            event_name: eventName,
            participant_name: participantName,
            sports_category: sportsNameWithCategory,
            contact_person: participantName,
            contact_number: contactNumber,
            email_id: contactEmailId,
          },
        },
      ],
    };
  } else if (type === "team") {
    let pageName = page_name;
    let eventName = event_name;
    let participantName = participant_name;
    let tournamentCategory = tournament_category;
    let sportsName = sports_name;
    let sportsCategory = sports_category;
    let parentPageEmail = parent_page_email;
    let pageOwnerEmailId = pageOwnerEmail;
    let contactNumber = contact_number;
    let contactEmailId = contact_email;
    let eventOwnerEmailId = eventOwnerEmail;
    let eventOwnerFullName = eventOwnerName;
    let teamPageOwnerName = teamParentPageOwnerName;

    // let contactPersonDetails = [];
    let sportsCategoryName = null;

    // if (eventContacts) {
    //   for await (let contact of eventContacts) {
    //     let contactDetails = contact;
    //     contactPersonDetails.push(contactDetails);
    //   }
    // }

    for await (let category of sportsCategory) {
      let categoryCode = category?.category_code;
      if (categoryCode === tournamentCategory) {
        sportsCategoryName = category?.category_name;
      }
    }

    let sportsNameWithCategory = sportsName + " - " + sportsCategoryName;

    email = {
      from: {
        email: "noreply@kridas.com",
        name: "Kridas",
      },
      template_id: "d-04ea7735fd19433aafeaa18e330c72a6",
      personalizations: [
        {
          to: [
            {
              email: eventOwnerEmailId,
              name: eventOwnerFullName,
              //   email: "apvijaycivil@gmail.com",
              //   name: "A.P.Vijay",
            },
          ],

          dynamic_template_data: {
            page_name: pageName,
            event_name: eventName,
            participant_name: participantName,
            sports_category: sportsNameWithCategory,
            contact_person: teamPageOwnerName,
            contact_number: contactNumber,
            email_id: contactEmailId,
          },
        },
      ],
    };
  }

  return axios({
    method: "post",
    url: "https://api.sendgrid.com/v3/mail/send",
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
    },
    data: email,
  });
};

module.exports = {
  sendMail,
  confirmationMail,
  sendMailGeneric,
  verificationMail,
  preRegisterMail,
  registerationMail,
  teamMemberMail,
  activationMail,
  inActivationMail,
  playerRegistrationWelcomeMail,
  newPlayerRegistrationMail,
  playerRegisterationMail,
  playerRegistrationUpdationMail,
  participantRegistrationMail,
  organizerMailOnTeamRegistration,
};
