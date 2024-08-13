const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");

const add = async (
  event_contacts,
  event_name,
  event_short_desc,
  event_desc,
  event_type,
  event_category_refid,
  event_owner_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `INSERT INTO events_master (event_master_id, event_contacts, event_name, event_short_desc, event_desc, event_type,event_category_refid,event_owner_id ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    result = await transaction.one(query, [
      uuidv4(),
      event_contacts !== null ? JSON.stringify(event_contacts) : null,
      event_name,
      event_short_desc,
      event_desc,
      event_type,
      event_category_refid,
      event_owner_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in event master add", error);
    throw error;
  }
};

const getById = async (event_master_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from events_master where event_master_id = $1";
    result = await transaction.oneOrNone(query, [event_master_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in event_master getById", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select * from events_master`;

    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in event_master getAll", error);
    throw error;
  }
};

const edit = async (
  event_contacts,
  event_name,
  event_short_desc,
  event_desc,
  event_type,
  event_category_refid,
  event_owner_id,
  event_master_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update events_master set event_contacts = $1, event_name=$2, event_short_desc=$3, event_desc = $4, event_type=$5, event_category_refid = $6, event_owner_id=$7 where event_master_id =$8 RETURNING *`;
    result = await transaction.one(query, [
      event_contacts !== null ? JSON.stringify(event_contacts) : null,
      event_name,
      event_short_desc,
      event_desc,
      event_type,
      event_category_refid,
      event_owner_id,
      event_master_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyInfoDao edit", error);
    throw error;
  }
};

const deleteById = async (event_master_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "delete from events_master where event_master_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [event_master_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in events_master deleteById", error);
    throw error;
  }
};

module.exports = {
  add,
  getById,
  getAll,
  edit,
  deleteById,
};
