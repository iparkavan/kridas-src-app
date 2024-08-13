const db = require("../utils/db");

const add = async (
  user_id,
  company_id,
  user_status,
  preferences_opted,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO company_team_players (user_id, company_id, user_status, preferences_opted, created_date, updated_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
    result = await transaction.one(query, [
      user_id,
      company_id,
      user_status,
      preferences_opted ? JSON.stringify(preferences_opted) : null,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyTeamPlayersDao add", error);
    throw error;
  }
};

const edit = async (
  user_id,
  company_id,
  user_status,
  company_team_players_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update company_team_players set user_id=$1, company_id=$2, user_status=$3,updated_date=$4 where company_team_players_id=$5 RETURNING *`;
    result = await transaction.one(query, [
      user_id,
      company_id,
      user_status,
      currentDate,
      company_team_players_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyTeamPlayersDao edit", error);
    throw error;
  }
};

const getById = async (company_team_players_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from company_team_players where company_team_players_id = $1";
    result = await transaction.oneOrNone(query, [company_team_players_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyTeamPlayersDao getById", error);
    throw error;
  }
};

const updateStatus = async (
  company_team_players_id,
  user_status,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update company_team_players set user_status =$1 , updated_date=$2 where company_team_players_id =$3 returning *`;
    result = await transaction.oneOrNone(query, [
      user_status,
      currentDate,
      company_team_players_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyTeamPlayersDao getById", error);
    throw error;
  }
};

const getByCompanyId = async (company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      ctp.* as company_team_players ,
      row_to_json(u.*)as user,
      row_to_json(cs.*) as company_statistics
    from
      company_team_players ctp
    left join users u on
      u.user_id = ctp.user_id
    left join company_statistics cs on
      cs.company_id = ctp.company_id
    where
      ctp.company_id = '${company_id}'`;
    result = await transaction.manyOrNone(query, [company_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyTeamPlayersDao getById", error);
    throw error;
  }
};

const getChildPagePlayersByCompanyId = async (
  company_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
        ctp.* as company_team_players ,
        row_to_json(u.*)as user,
        row_to_json(cs.*)as company_statistics
      from
        company_team_players ctp
      left join company c on
        ctp.company_id = c.company_id
      left join company c2 on
        c2.parent_company_id = c.company_id
      left join users u on
        u.user_id = ctp.user_id
      left join company_statistics cs on
        cs.company_id = c.company_id
      where
        c.parent_company_id = '${company_id}'`;
    result = await transaction.manyOrNone(query, [company_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in companyTeamPlayersDao getChildPagePlayersByCompanyId",
      error
    );
    throw error;
  }
};

const deleteById = async (company_team_players_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "delete from company_team_players where company_team_players_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [company_team_players_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyTeamPlayersDao deleteById", error);
    throw error;
  }
};

const getByCompanyIdAndUserId = async (
  company_id,
  user_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `     
    select
      *
    from
      company_team_players ctp
    where
      ctp.company_id = '${company_id}'
      and ctp.user_id = '${user_id}'`;
    result = await transaction.oneOrNone(query, [company_id, user_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in companyTeamPlayersDao getByCompanyIdAndUserId",
      error
    );
    throw error;
  }
};

module.exports = {
  add,
  edit,
  getById,
  deleteById,
  getByCompanyId,
  getChildPagePlayersByCompanyId,
  updateStatus,
  getByCompanyIdAndUserId,
};
