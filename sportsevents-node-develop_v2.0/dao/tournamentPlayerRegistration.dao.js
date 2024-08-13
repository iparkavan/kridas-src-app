const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");

const add = async (
  tournament_player_reg_id,
  player_id,
  registration_date,
  team_id,
  seeding,
  tournament_category_id,
  tournamentid,
  preferences_opted,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `INSERT INTO tournament_player_registration (tournament_player_reg_id,player_id,registration_date,team_id,seeding,tournament_category_id,tournamentid,preferences_opted) 
        values ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    result = await transaction.one(query, [
      tournament_player_reg_id,
      player_id,
      registration_date,
      team_id,
      seeding,
      tournament_category_id,
      tournamentid,
      preferences_opted ? JSON.stringify(preferences_opted) : null,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in tournamentPlayerRegistrationDao add", error);
    throw error;
  }
};

const edit = async (
  player_id,
  registration_date,
  team_id,
  seeding,
  tournament_category_id,
  tournamentid,
  tournament_player_reg_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update tournament_player_registration set player_id=$1,registration_date=$2,team_id=$3,seeding=$4,tournament_category_id=$5,tournamentid=$6
        where tournament_player_reg_id=$7 RETURNING *`;
    result = await transaction.one(query, [
      player_id,
      registration_date,
      team_id,
      seeding,
      tournament_category_id,
      tournamentid,
      tournament_player_reg_id,
    ]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in tournamentPlayerRegistrationDao edit",
      error
    );
    throw error;
  }
};

const getById = async (tournament_player_reg_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from tournament_player_registration where tournament_player_reg_id=$1";
    result = await transaction.oneOrNone(query, [tournament_player_reg_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in tournamentPlayerRegistrationDao getById",
      error
    );
    throw error;
  }
};

const getPlayerandTournCatIdComboCount = async (
  tournament_category_id,
  player_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      count(*)
    from
      tournament_player_registration tpr
    where
      tpr.tournament_category_id = ${tournament_category_id}
      and tpr.player_id = '${player_id}'`;
    result = await transaction.oneOrNone(query, [
      tournament_category_id,
      player_id,
    ]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in tournamentPlayerRegistrationDao getPlayerandTournCatIdComboCount",
      error
    );
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select * from tournament_player_registration`;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in tournamentPlayerRegistrationDao getAll",
      error
    );
    throw error;
  }
};

const getTournamentPlayerRegistrationId = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select tpr.tournament_player_reg_id  from tournament_player_registration tpr order by tpr.tournament_player_reg_id desc limit 1`;
    result = await transaction.oneOrNone(query, []);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in tournamentPlayerRegistrationDao getTournamentPlayerRegistrationId",
      error
    );
    throw error;
  }
};

const deleteById = async (tournament_player_reg_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "delete from tournament_player_registration where tournament_player_reg_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [tournament_player_reg_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in tournamentPlayerRegistrationDao deleteById",
      error
    );
    throw error;
  }
};

const getTeamByEventSport = async (
  event_id,
  sport_id,
  tournament_category_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      t.event_refid ,
      t.sports_refid ,
      tpr.team_id
    from
      tournament_player_registration tpr
    left join tournaments t on
      t.tournament_id = tpr.tournamentid
    left join tournament_categories tc on
      tc.tournament_category_id = tpr.tournament_category_id
    where
      t.event_refid =$1
      and t.sports_refid =$2
      and tc.tournament_category_id =$3 `;
    result = await transaction.manyOrNone(query, [
      event_id,
      sport_id,
      tournament_category_id,
    ]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in tournamentPlayerRegistrationDao getTeamByEventSport",
      error
    );
    throw error;
  }
};

const getTeamNameExistingByTournCatId = async (
  team_name,
  tournament_category_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      c.company_name
    from
      tournament_player_registration tpr
    left join teams t on
      t.team_id = tpr.team_id
    left join company c on
      c.company_id = t.company_id
    where
      tpr.tournament_category_id = $2
      and c.company_name = $1`;
    result = await transaction.manyOrNone(query, [
      team_name,
      tournament_category_id,
    ]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in tournamentPlayerRegistrationDao getTeamNameExistingByTournCatId",
      error
    );
    throw error;
  }
};
module.exports = {
  add,
  edit,
  getById,
  getAll,
  deleteById,
  getTeamByEventSport,
  getTournamentPlayerRegistrationId,
  getPlayerandTournCatIdComboCount,
  getTeamNameExistingByTournCatId,
};
