const db = require("../utils/db");

const add = async (
  sponsor_name,
  sponsor_desc,
  sponsor_media_url,
  sponsor_media_type,
  sponsor_click_url,
  sponsor_media_url_meta,
  company_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO sponsor (sponsor_name,sponsor_desc,sponsor_media_url,sponsor_media_type,sponsor_click_url,
      sponsor_media_url_meta,created_date,company_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    result = await transaction.one(query, [
      sponsor_name,
      sponsor_desc,
      sponsor_media_url,
      sponsor_media_type,
      sponsor_click_url,
      sponsor_media_url_meta,
      currentDate,
      company_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in sponsor Dao add", error);
    throw error;
  }
};

const edit = async (
  sponsor_name,
  sponsor_desc,
  sponsor_media_url,
  sponsor_media_type,
  sponsor_click_url,
  sponsor_media_url_meta,
  sponsor_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `UPDATE sponsor SET sponsor_name=$1, sponsor_desc=$2,sponsor_media_url=$3,sponsor_media_type=$4,sponsor_click_url=$5,sponsor_media_url_meta=$6 WHERE sponsor_id=$7 RETURNING *`;
    result = await transaction.one(query, [
      sponsor_name,
      sponsor_desc,
      sponsor_media_url,
      sponsor_media_type,
      sponsor_click_url,
      sponsor_media_url_meta,
      sponsor_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in sponsor Dao Update", error);
    throw error;
  }
};

const getById = async (sponsor_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      s.* as sponsor,
      row_to_json(cs.*)as company_sponsor ,
      row_to_json(cst.*)as company_sponsor_type 
    from
      sponsor s
    left join company_sponsor cs on
      cs.sponsor_id = s.sponsor_id
    left join company_sponsor_type cst on
      cst.company_sponsor_type_id = cs.sponsor_type_id
    where
      s.sponsor_id = $1`;
    result = await transaction.oneOrNone(query, [sponsor_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in sponsor Dao getById", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from sponsor";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in Sponsor getAll", error);
    throw error;
  }
};

const deleteById = async (sponsor_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from sponsor where sponsor_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [sponsor_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in sponsor deleteById", error);
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
