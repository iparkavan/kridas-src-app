const userDao = require("../dao/user.dao");
const companyDao = require("../dao/company.dao");
const companyTeamPlayerDao = require("../dao/companyTeamPlayers.dao");
const db = require("../utils/db");
const axios = require("axios");
const { otpGenerator } = require("../utils/util");
const mailService = require("./mail.service");
const { documentUpload } = require("../utils/common");
const { customQueryExecutor } = require("../dao/common/utils.dao");

const playerRegisteration = async (body) => {
  try {
    const { player, company_id, files = {} } = body;
    result = await db
      .tx(async (transaction) => {
        let userEmail = null;
        let identity_docs = [];

        let Player = JSON.parse(player);

        let currentDate = new Date();
        let emailId = Player?.email_id;
        let firstName = Player?.first_name;
        let lastName = Player?.last_name;
        let phoneNumber = Player?.contact_number;
        let name = firstName + " " + lastName;
        let userName = Player?.player_id;
        let userDOB = Player?.player_dob;

        let teamDetails = await companyDao.getById(company_id, transaction);
        let existingPlayer = await userDao.getByUserName(userName, transaction);
        let registeredUser = await userDao.getByEmail(emailId, transaction);

        let user_id = registeredUser?.user_id;
        let playerExistForCompany = null;

        if (user_id) {
          playerExistForCompany =
            await companyTeamPlayerDao.getByCompanyIdAndUserId(
              company_id,
              user_id,
              transaction
            );
        }
        if (playerExistForCompany === null) {
          let team_name = teamDetails?.company_name;

          if (registeredUser === null) {
            let token = otpGenerator();
            let sports_interested = "{}";
            let userName = null;
            let userRegistration = null;
            let countUserName = await userDao.getByName(firstName, lastName);
            if (countUserName.count === "0") {
              userName = `${firstName
                .replace(/[^a-zA-Z0-9]/g, "")
                .trim()}.${lastName.replace(/[^a-zA-Z0-9]/g, "").trim()}`;

              let userNameExisting = await userDao.getByUserName(userName);
              if (userNameExisting.count !== "0") {
                userName = `${firstName
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .trim()}.${lastName.replace(/[^a-zA-Z0-9]/g, "").trim()}.${
                  userNameExisting.count
                }`;
              }
            } else {
              userName = `${firstName
                .replace(/[^a-zA-Z0-9]/g, "")
                .trim()}.${lastName.replace(/[^a-zA-Z0-9]/g, "").trim()}.${
                countUserName.count
              }`;
              let userNameExisting = await userDao.getByUserName(userName);
              if (userNameExisting.count !== "0") {
                userName = `${firstName
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .trim()}.${lastName.replace(/[^a-zA-Z0-9]/g, "").trim()}.${
                  userNameExisting.count
                }`;
              }
            }

            if (JSON.stringify(files) !== JSON.stringify({})) {
              // S3 file upload
              if (JSON.stringify(files) !== JSON.stringify({}))
                identity_docs = await documentUpload(files);
            }

            userRegistration = await userDao.add(
              firstName,
              lastName,
              null,
              null,
              emailId,
              phoneNumber,
              null,
              null,
              token,
              null,
              null,
              null,
              userDOB,
              null,
              null,
              null,
              JSON.stringify(identity_docs),
              null,
              null,
              ["USR"],
              null,
              "IN",
              null,
              false,
              sports_interested,
              null,
              null,
              userName,
              null,
              null,
              transaction
            );

            let firebaseAccount = null;
            data = {
              user_email: emailId,
              password: "Skiya@123",
            };

            firebaseAccount = await axios.post(
              `${process.env.MIDDLEWARE_API_URL}/api/users/signUp`,
              data,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              }
            );

            let companyTeamPlayers = await companyTeamPlayerDao.add(
              userRegistration?.user_id,
              company_id,
              "AC",
              null,
              transaction
            );

            let regEmail = null;
            regEmail = mailService.newPlayerRegistrationMail(
              emailId,
              name,
              team_name
            );
            teamDetails["company-team-players"] = companyTeamPlayers;

            teamDetails["user"] = userRegistration;
          } else {
            let welcomeEmail = null;
            let companyTeamPlayers = await companyTeamPlayerDao.add(
              registeredUser?.user_id,
              company_id,
              "AC",
              null,
              transaction
            );
            welcomeEmail = mailService.playerRegistrationWelcomeMail(
              emailId,
              name,
              team_name
            );
            teamDetails["company-team-players"] = companyTeamPlayers;
            teamDetails["player_details"] = registeredUser;
          }
          return teamDetails;
        } else {
          let result = { message: "Player already exists for this page" };
          return result;
        }
      })
      .then((data) => {
        console.log("successfully data returned", data?.company_id);
        return data;
      })
      .catch((error) => {
        console.log("failure, ROLLBACK was executed", error);
        throw error;
      });
    return result;
  } catch (error) {
    console.log(
      "Error occurred in companyTeamPlayers Service playerRegisteration: ",
      error
    );
    throw error;
  }
};

/**
 * Method to get company team player based on company id
 * @param {int} company_id
 */
const getByCompanyId = async (company_id) => {
  try {
    let result = {};
    let company = await companyDao.getById(company_id);
    if (company === null) {
      return (result = { message: "company not exist" });
    }
    let data = await companyTeamPlayerDao.getByCompanyId(company_id);
    if (data?.length === 0) result = { message: "companyTeamPlayer not exist" };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log(
      "Error occurred in companyTeamPlayers Service getByCompanyId",
      error
    );
    throw error;
  }
};

/**
 * Method to Update User Status for particular company
 * @param {*} body
 * @returns
 */
const updateStatus = async (body) => {
  try {
    const { company_team_players_id, user_status } = body;

    let data = await companyTeamPlayerDao.getById(company_team_players_id);
    if (data === null) result = { message: "companyTeamPlayers not exist" };
    else {
      let companyTeamPlayers = await companyTeamPlayerDao.updateStatus(
        company_team_players_id,
        user_status
      );
      result = companyTeamPlayers;
    }
    return result;
  } catch (error) {
    console.log(
      "Error occurred in companyTeamPlayers Service updateStatus",
      error
    );
    throw error;
  }
};

/**
 * Method to get company team player based on company id
 * @param {int} company_id
 */
const getChildPagePlayersByCompanyId = async (company_id) => {
  try {
    let result = {};
    let company = await companyDao.getById(company_id);
    if (company === null) {
      return (result = { message: "company not exist" });
    }
    let data = await companyTeamPlayerDao.getChildPagePlayersByCompanyId(
      company_id
    );
    if (data?.length === 0) result = { message: "companyTeamPlayer not exist" };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log(
      "Error occurred in companyTeamPlayers Service getByCompanyId",
      error
    );
    throw error;
  }
};

/**
 * Method to filter players based on conditions
 * @param {json} body
 */
const searchPlayer = async (body) => {
  try {
    let result = null;
    const {
      page = 0,
      sort = "asc",
      size = 5,
      first_name,
      last_name,
      email_id,
      user_dob,
      player_id,
      contact_number,
      team_name,
      sports_id,
      child_company_id,
      parent_company_id,
      full_name,
    } = body;

    /* let query = `select
      ctp.* as company_team_players ,
      row_to_json(u.*) as user_details,
      row_to_json(c.*) as page_details,
      v.* as sports_id
    from
      company_team_players ctp
    left join users u on
      u.user_id = ctp.user_id
    left join company c on
      c.company_id = ctp.company_id
    left join (
      select
        cs.categorywise_statistics ->> 'sports_id' as sports_id,
        cs.company_id,
        cs.categorywise_statistics
      from
        company_statistics cs
        )v on
      v.company_id = ctp.company_id
    left join company c2 on
      c2.company_id = c.parent_company_id
    where
      1=1`; */

    let query = `select
      ctp.* as company_team_players ,
      row_to_json(u.*) as user_details,
      row_to_json(c.*) as page_details,
      cs2.sports_refid as sports_id
    from
      company_team_players ctp
    left join users u on
      u.user_id = ctp.user_id
    left join company c on
      c.company_id = ctp.company_id
    left join company c2 on
      c2.company_id = c.parent_company_id
    left join company_sport cs2 on
      cs2.company_id = ctp.company_id
    where
      1 = 1`;

    /*  let countQuery = `select
      count(*)
    from
      company_team_players ctp
    left join users u on
      u.user_id = ctp.user_id
    left join company c on
      c.company_id = ctp.company_id
    left join (
      select
        cs.categorywise_statistics ->> 'sports_id' as sports_id,
        cs.company_id,
        cs.categorywise_statistics
      from
        company_statistics cs
        )v on
      v.company_id = ctp.company_id
    left join company c2 on
      c2.company_id = c.parent_company_id
    where
      1=1`; */

    let countQuery = `select
        count(*)
      from
        company_team_players ctp
      left join users u on
        u.user_id = ctp.user_id
      left join company c on
        c.company_id = ctp.company_id
      left join company c2 on
        c2.company_id = c.parent_company_id
      left join company_sport cs2 on
        cs2.company_id = ctp.company_id
      where
        1 = 1`;

    if (first_name) {
      query = query + ` and u.first_name ilike '%${first_name}%'`;
      countQuery = countQuery + ` and u.first_name ilike '%${first_name}%'`;
    }

    if (last_name) {
      query = query + ` and u.last_name ilike '%${last_name}%'`;
      countQuery = countQuery + ` and u.last_name ilike '%${last_name}%'`;
    }

    if (email_id) {
      query = query + ` and u.user_email like '${email_id}'`;
      countQuery = countQuery + ` and u.user_email like '${email_id}'`;
    }

    if (contact_number) {
      query = query + ` and u.user_phone like '%${contact_number}'`;
      countQuery = countQuery + ` and u.user_phone like '%${contact_number}'`;
    }

    if (user_dob) {
      query = query + ` and u.user_dob = '${user_dob}'`;
      countQuery = countQuery + ` and u.user_dob = '${user_dob}'`;
    }

    if (player_id) {
      let playerNumber = player_id.replace(/\D/g, "");
      let userString = "USR";
      let playerId = userString.concat(playerNumber);

      query = query + ` and u.referral_code = '${playerId}'`;
      countQuery = countQuery + ` and u.referral_code = '${playerId}'`;
    }

    if (team_name) {
      query = query + ` and c.company_name ilike '%${team_name}%'`;
      countQuery = countQuery + ` and c.company_name ilike '%${team_name}%'`;
    }

    /* if (sports_id) {
      query = query + ` and v.sports_id::int =  ${sports_id}`;
      countQuery = countQuery + ` and v.sports_id::int =  ${sports_id}`;
    } */

    if (sports_id) {
      query = query + ` and cs2.sports_refid = ${sports_id}`;
      countQuery = countQuery + ` and cs2.sports_refid = ${sports_id}`;
    }

    if (child_company_id) {
      query = query + ` and c.company_id = '${child_company_id}'`;
      countQuery = countQuery + ` and c.company_id = '${child_company_id}'`;
    }

    if (parent_company_id) {
      query = query + ` and c2.company_id = '${parent_company_id}'`;
      countQuery = countQuery + ` and c2.company_id = '${parent_company_id}'`;
    }

    if (full_name) {
      query =
        query +
        ` and (u.first_name ilike '%${full_name}%' or u.last_name ilike '%${full_name}%' or u.user_name ilike '%${full_name}%')`;
      countQuery =
        countQuery +
        ` and (u.first_name ilike '%${full_name}%' or u.last_name ilike '%${full_name}%' or u.user_name ilike '%${full_name}%')`;
    }

    let offset = page > 0 ? page * size : 0;

    query =
      query +
      ` order by ctp.user_status ${sort} limit ${size} offset ${offset}`;
    let data = await customQueryExecutor(query);
    let count = await customQueryExecutor(countQuery);

    let tempData = {
      totalCount: Number(count[0].count),
      totalPage: Math.round(Number(count[0].count) / size),
      size: size,
      content: data,
    };
    result = tempData;
    return result;
  } catch (error) {
    console.log("Error occurred in searchPlayer ", error);
    throw error;
  }
};

module.exports = {
  playerRegisteration,
  getByCompanyId,
  getChildPagePlayersByCompanyId,
  updateStatus,
  searchPlayer,
};
