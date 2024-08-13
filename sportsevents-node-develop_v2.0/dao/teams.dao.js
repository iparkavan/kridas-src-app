const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");

const add = async (
  team_members,
  team_captain,
  company_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO teams (team_id,team_members, team_captain, company_id,created_date,updated_date) 
        values ($1,$2,$3,$4,$5,$6) RETURNING *`;
    result = await transaction.one(query, [
      uuidv4(),
      team_members,
      team_captain,
      company_id,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in teamsDao add", error);
    throw error;
  }
};

const edit = async (
  team_members,
  team_captain,
  company_id,
  team_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update teams set team_members=$1,team_captain=$2,company_id=$3,updated_date=$4
        where team_id=$5 RETURNING *`;
    result = await transaction.one(query, [
      team_members,
      team_captain,
      company_id,
      currentDate,
      team_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in teamsDao edit", error);
    throw error;
  }
};

const updateTeamMember = async (
  team_members,
  team_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update teams set team_members=$1
        where team_id=$2 RETURNING *`;
    result = await transaction.one(query, [team_members, team_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in updateTeamMember edit", error);
    throw error;
  }
};

const getById = async (team_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from teams where team_id=$1";
    result = await transaction.oneOrNone(query, [team_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in teamsDao getById", error);
    throw error;
  }
};

const getByTeamNameandTournamentId = async (
  team_name,
  tournament_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      c.company_name,
      tpr.tournament_category_id
    from
      tournament_player_registration tpr
    left join teams t2 on  
      t2.team_id = tpr.team_id
    left join company c on
      c.company_id = t2.company_id
    where
        lower(c.company_name) = lower($1)
      and tpr.tournament_category_id = $2`;
    result = await transaction.oneOrNone(query, [team_name, tournament_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in teamsDao getByTeamNameandEventId", error);
    throw error;
  }
};

const getEventNameByTournamentCategoryId = async (
  tournament_category_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `      select
      e.event_name,
      e.event_id,
      e.event_startdate,
      e.virtual_venue_url
    from
      tournament_categories tc
    left join tournaments t on
      t.tournament_id = tc.tournament_refid
    left join events e on
      e.event_id = t.event_refid
    where
      tc.tournament_category_id = $1`;
    result = await transaction.oneOrNone(query, [tournament_category_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in teamsDao getEventNameByTournamentCategoryId",
      error
    );
    throw error;
  }
};

const getTournCatVenueByTournCatId = async (
  tournament_category_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
        c.company_name
      from
        company c
      where
        c.company_id in (
        select
          unnest(tc.tournament_category_venue)
        from
          tournament_categories tc
        where
          tc.tournament_category_id = $1
      )`;
    result = await transaction.manyOrNone(query, [tournament_category_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in teamsDao getTournCatVenueByTournCatId",
      error
    );
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select * from teams`;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in teamsDao getAll", error);
    throw error;
  }
};

const deleteById = async (team_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from teams where team_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [team_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in teamsDao deleteById", error);
    throw error;
  }
};

const getPreferencesOpted = async (customQuery, connectionObj = null) => {
  try {
    let query = customQuery;
    let transaction = connectionObj !== null ? connectionObj : db;

    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in teamsDao getPreferencesOpted", error);
    throw error;
  }
};

const getPreferencesDetails = async (customQuery, connectionObj = null) => {
  try {
    let query = customQuery;
    let transaction = connectionObj !== null ? connectionObj : db;

    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in teamsDao getAllPreferanceOpted", error);
    throw error;
  }
};
module.exports = {
  add,
  edit,
  getById,
  getByTeamNameandTournamentId,
  getEventNameByTournamentCategoryId,
  getAll,
  deleteById,
  updateTeamMember,
  getTournCatVenueByTournCatId,
  getPreferencesOpted,
  getPreferencesDetails,
};
