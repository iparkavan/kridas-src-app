const db = require("../utils/db");

const add = async (
  event_sponsor_type_name,
  event_id,
  sort_order,
  is_deleted,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO event_sponsor_type (event_sponsor_type_name,event_id,sort_order, is_deleted, created_date, updated_date) 
        values ($1,$2,$3,$4,$5,$6) RETURNING *`;
    result = await transaction.one(query, [
      event_sponsor_type_name,
      event_id,
      sort_order,
      is_deleted,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in event sponsor type dao add", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from event_sponsor_type where is_deleted=false";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in event sponsor type dao getAll", error);
    throw error;
  }
};

const getById = async (event_sponsor_type_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from event_sponsor_type where event_sponsor_type_id = $1 and is_deleted=false";
    result = await transaction.oneOrNone(query, [event_sponsor_type_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in event sponsor type dao getById", error);
    throw error;
  }
};

const getByEventSponsorTypeNamewithId = async (
  event_sponsor_type_name,
  event_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from event_sponsor_type where lower(event_sponsor_type_name) = lower($1) and event_id =$2 ";
    result = await transaction.oneOrNone(query, [
      event_sponsor_type_name,
      event_id,
    ]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in event sponsor type dao getByEventSponsorTypeNamewithId",
      error
    );
    throw error;
  }
};

const edit = async (
  event_sponsor_type_name,
  event_id,
  sort_order,
  is_deleted,
  event_sponsor_type_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update event_sponsor_type set event_sponsor_type_name=$1, event_id=$2,sort_order=$3, is_deleted=$4, updated_date=$5 where event_sponsor_type_id=$6 RETURNING *`;
    result = await transaction.one(query, [
      event_sponsor_type_name,
      event_id,
      sort_order,
      is_deleted,
      currentDate,
      event_sponsor_type_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in event sponsor type dao edit", error);
    throw error;
  }
};

const deleteById = async (event_sponsor_type_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update event_sponsor_type set is_deleted=true where event_sponsor_type_id = $1 RETURNING *`;
    result = await transaction.one(query, [event_sponsor_type_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in event sponsor type dao delete", error);
    throw error;
  }
};

const getEventSponsorTypeCountByEventId = async (
  event_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select count(*) from event_sponsor_type cst where cst.event_id =$1 and cst.is_deleted =false";
    result = await transaction.oneOrNone(query, [event_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in event sponsor type dao getEventSponsorTypeCountByEventId",
      error
    );
    throw error;
  }
};

const getAllEventSponsorTypeCountByEventId = async (
  event_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select count(*) from event_sponsor_type cst where cst.event_id =$1";
    result = await transaction.oneOrNone(query, [event_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in event sponsor type dao getAllEventSponsorTypeCountByEventId",
      error
    );
    throw error;
  }
};

const getAllEventSponsorTypeByEventId = async (
  event_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      est.*
    from
      event_sponsor_type est
    where
      est.event_id = '${event_id}'
      and est.is_deleted = false`;
    result = await transaction.manyOrNone(query, [event_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in company sponsor type dao getCompanySponsorTypeCountByCompanyId",
      error
    );
    throw error;
  }
};

module.exports = {
  getAll,
  add,
  getById,
  edit,
  deleteById,
  getByEventSponsorTypeNamewithId,
  getEventSponsorTypeCountByEventId,
  getAllEventSponsorTypeCountByEventId,
  getAllEventSponsorTypeByEventId,
};
