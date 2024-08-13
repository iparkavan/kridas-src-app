const db = require("../utils/db");

const add = async (
  feed_id,
  user_id,
  company_id,
  comment_id,
  event_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO comment_tag (feed_id,user_id,company_id,comment_id,event_id,created_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
    result = await transaction.one(query, [
      feed_id,
      user_id,
      company_id,
      comment_id,
      event_id,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in commentTagDao add", error);
    throw error;
  }
};

const edit = async (
  feed_id,
  user_id,
  company_id,
  comment_id,
  event_id,
  comment_tag_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update comment_tag set feed_id=$1,user_id=$2,company_id=$3,comment_id=$4,event_id=$5 where comment_tag_id=$6 RETURNING *`;
    result = await transaction.one(query, [
      feed_id,
      user_id,
      company_id,
      comment_id,
      event_id,
      comment_tag_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in commentTagDao edit", error);
    throw error;
  }
};

const getById = async (comment_tag_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from comment_tag where comment_tag_id = $1";
    result = await transaction.oneOrNone(query, [comment_tag_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in commentTagDao getById", error);
    throw error;
  }
};

const deleteById = async (comment_tag_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from comment_tag where comment_tag_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [comment_tag_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in commentTagDao deleteById", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from comment_tag";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in commentTagDao getAll", error);
    throw error;
  }
};

const getByCommentId = async (comment_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from comment_tag where comment_id = $1";
    result = await transaction.oneOrNone(query, [comment_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in commentTagDao getByCommentId", error);
    throw error;
  }
};

module.exports = {
  add,
  edit,
  getById,
  deleteById,
  getAll,
  getByCommentId,
};
