const db = require("../utils/db");

const add = async (
  company_id,
  user_id,
  contents,
  media_id,
  parent_comment_id,
  event_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO media_comment_info (company_id, user_id, contents, media_id, parent_comment_id,event_id, created_date, updated_date) VALUES($1, $2, $3, $4, $5,$6,$7,$8) returning *`;
    let result = await transaction.one(query, [
      company_id,
      user_id,
      contents,
      media_id,
      parent_comment_id,
      event_id,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in mediaCommentInfo dao add", error);
    throw error;
  }
};

const edit = async (
  company_id,
  user_id,
  contents,
  media_id,
  parent_comment_id,
  event_id,
  comment_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update media_comment_info set company_id= $1,user_id=$2,contents=$3,media_id=$4,parent_comment_id=$5,updated_date=$6,event_id=$7 where comment_id =$8  returning *`;
    result = await transaction.one(query, [
      company_id,
      user_id,
      contents,
      media_id,
      parent_comment_id,
      currentDate,
      event_id,
      comment_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in lookupType dao edit", error);
    throw error;
  }
};

const getById = async (comment_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from media_comment_info where comment_id = $1";
    result = await transaction.oneOrNone(query, [comment_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in lookupType dao getById", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from media_comment_info mci order by mci.updated_date desc";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in lookupType dao getAll", error);
    throw error;
  }
};

const deleteById = async (comment_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "delete from media_comment_info where comment_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [comment_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in lookupType dao deleteById", error);
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
