const db = require("../utils/db");

const add = async (
  advertisement_name,
  advertisement_desc,
  valid_date,
  advertisement_media_url,
  advertisement_click_url,
  advertisement_media_url_meta,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO advertisement (advertisement_name, advertisement_desc,valid_date,advertisement_media_url,advertisement_click_url,
    advertisement_media_url_meta,created_date) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
    result = await transaction.one(query, [
      advertisement_name,
      advertisement_desc,
      valid_date,
      advertisement_media_url,
      advertisement_click_url,
      advertisement_media_url_meta,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in advertisementDao add", error);
    throw error;
  }
};

const edit = async (
  advertisement_name,
  advertisement_desc,
  valid_date,
  advertisement_media_url,
  advertisement_click_url,
  advertisement_media_url_meta,
  advertisement_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update advertisement set advertisement_name=$1,advertisement_desc=$2,valid_date=$3,advertisement_media_url=$4,
    advertisement_click_url=$5,advertisement_media_url_meta=$6 where advertisement_id=$7 RETURNING *`;
    result = await transaction.one(query, [
      advertisement_name,
      advertisement_desc,
      valid_date,
      advertisement_media_url,
      advertisement_click_url,
      advertisement_media_url_meta,
      advertisement_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in advertisementDao edit", error);
    throw error;
  }
};

const getById = async (advertisement_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from advertisement where advertisement_id = $1";
    result = await transaction.oneOrNone(query, [advertisement_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in advertisementDao getById", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select * from advertisement ad where ad.valid_date >= current_date`;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error Occurred in advertisementDao getAll", error);
    throw error;
  }
};

const deleteById = async (advertisement_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;

    let query =
      "delete from advertisement where advertisement_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [advertisement_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in advertisementDao delete", error);
    throw error;
  }
};

module.exports = {
  add,
  edit,
  getById,
  getAll,
  deleteById,
};
