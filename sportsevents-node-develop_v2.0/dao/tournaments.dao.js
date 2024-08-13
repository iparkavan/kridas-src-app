const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");

const add = async (
  event_refid,
  sports_refid,
  tournament_startdate,
  tournament_enddate,
  tournament_rules,
  event_venue,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `INSERT INTO tournaments (event_refid,sports_refid,tournament_startdate,tournament_enddate,tournament_rules,event_venue) 
        values ($1,$2,$3,$4,$5,$6::uuid[]) RETURNING *`;
    result = await transaction.one(query, [
      event_refid,
      sports_refid,
      tournament_startdate,
      tournament_enddate,
      tournament_rules,
      event_venue,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in tournamentsDao add", error);
    throw error;
  }
};

const edit = async (
  event_refid,
  sports_refid,
  tournament_startdate,
  tournament_enddate,
  tournament_rules,
  event_venue,
  tournament_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    // let query2 = `update tournaments set event_refid='${event_refid}',sports_refid=${sports_refid},tournament_startdate='${tournament_startdate}',tournament_enddate='${tournament_enddate}', tournament_rules=${tournament_rules},event_venue=${event_venue} where tournament_id=${tournament_id} RETURNING *`;
    let query = `update tournaments  set event_refid=$1,sports_refid=$2,tournament_startdate=$3,tournament_enddate=$4,
        tournament_rules=$5,event_venue=$6
        where tournament_id=$7 RETURNING *`;
    result = await transaction.one(query, [
      event_refid,
      sports_refid,
      tournament_startdate,
      tournament_enddate,
      tournament_rules,
      event_venue,
      tournament_id,
    ]);
    // result = await transaction.one(query, [])
    return result;
  } catch (error) {
    console.log("Error occurred in tournamentsDao edit", error);
    throw error;
  }
};

const getById = async (tournament_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from tournaments where tournament_id=$1";
    result = await transaction.oneOrNone(query, [tournament_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in tournamentsDao getById", error);
    throw error;
  }
};

const getEventSport = async (event_id, sport_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select * from tournaments where event_refid=$1 and sports_refid=$2`;
    result = await transaction.oneOrNone(query, [event_id, sport_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in tournamentsDao getEventSport", error);
    throw error;
  }
};

const getEventVenueCount = async (company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
            count(*)
        from
            tournaments t 
        where
            array[t.event_venue] && array ['${company_id}']::uuid[]`;
    result = await transaction.oneOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in tournamentsDao getEventVenueCount", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select * from tournaments`;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in tournamentsDao getAll", error);
    throw error;
  }
};

const deleteById = async (tournament_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from tournaments where tournament_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [tournament_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in tournamentsDao deleteById", error);
    throw error;
  }
};

const deleteByEventId = async (event_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from tournaments t where t.event_refid =$1 RETURNING *";
    result = await transaction.manyOrNone(query, [event_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in tournamentsDao deleteById", error);
    throw error;
  }
};

module.exports = {
  add,
  edit,
  getById,
  getEventVenueCount,
  getAll,
  deleteById,
  deleteByEventId,
  getEventSport,
};
