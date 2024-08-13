const db = require("../utils/db");

const add = async (article_id, feed_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `INSERT INTO article_feed (article_id,feed_id) VALUES ($1,$2) RETURNING *`;
    result = await transaction.one(query, [article_id, feed_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in article feed add", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from article_feed";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in article feed getAll", error);
    throw error;
  }
};

const getById = async (article_feed_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from article_feed where article_feed_id = $1";
    result = await transaction.oneOrNone(query, [article_feed_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in article feed getById", error);
    throw error;
  }
};

const deleteByFeedId = async (feed_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from article_feed where feed_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [feed_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in article feed deleteByFeedId", error);
    throw error;
  }
};

const deleteByArticleId = async (article_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from article_feed where article_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [article_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in article feed deleteByArticleId", error);
    throw error;
  }
};

const getByFeedId = async (feed_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from article_feed where feed_id = $1";
    result = await transaction.oneOrNone(query, [feed_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in article feed getByFeedId", error);
    throw error;
  }
};

module.exports = {
  add,
  getAll,
  getById,
  deleteByFeedId,
  deleteByArticleId,
  getByFeedId,
};
