const db = require("../utils/db");

const add = async (
  company_id,
  user_id,
  feed_id,
  event_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO feed_tags (company_id, user_id,feed_id,created_date,event_id) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
    result = await transaction.one(query, [
      company_id,
      user_id,
      feed_id,
      currentDate,
      event_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in feed tag dao add", error);
    throw error;
  }
};

const edit = async (
  company_id,
  user_id,
  feed_id,
  event_id,
  feed_tag_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update feed_tags set company_id=$1,user_id=$2,feed_id=$3,event_id=$4 where feed_tag_id=$5 RETURNING *`;
    result = await transaction.one(query, [
      company_id,
      user_id,
      feed_id,
      event_id,
      feed_tag_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in feed tag dao edit", error);
    throw error;
  }
};

const getById = async (comment_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from feed_tags where feed_tag_id = $1";
    result = await transaction.oneOrNone(query, [comment_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in feed tag dao getById", error);
    throw error;
  }
};

const deleteById = async (comment_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from feed_tags where feed_tag_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [comment_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in feed tag dao deleteById", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from feed_tags";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in feed tag dao getAll", error);
    throw error;
  }
};

const deleteByFeedId = async (feed_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from feed_tags where feed_id = $1 RETURNING *";
    result = await transaction.manyOrNone(query, [feed_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in hashtagfeeds dao deleteByFeedId", error);
    throw error;
  }
};

module.exports = {
  add,
  edit,
  getById,
  deleteById,
  getAll,
  deleteByFeedId,
};
