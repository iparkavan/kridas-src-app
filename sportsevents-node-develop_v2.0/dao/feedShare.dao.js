const db = require("../utils/db");

const add = async (
  share_creator_user_id,
  share_creator_company_id,
  shared_feed_id,
  feed_id,
  share_creator_event_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO feed_share (share_creator_user_id , share_creator_company_id, shared_feed_id, feed_id, share_creator_event_id,created_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;

    result = await transaction.one(query, [
      share_creator_user_id,
      share_creator_company_id,
      shared_feed_id,
      feed_id,
      share_creator_event_id,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in feed_share add", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from feed_share order by created_date desc;";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in feedShare getAll", error);
    throw error;
  }
};

const getShareCount = async (feed_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select count(*) from feed_share fs2 where fs2.shared_feed_id =$1 `;
    result = await transaction.oneOrNone(query, [feed_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in feedShare getShareCount", error);
    throw error;
  }
};

const deleteById = async (feed_share_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;

    let query = "delete from feed_share where feed_share_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [feed_share_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in feedShare deleteById", error);
    throw error;
  }
};

const getUserSharedFeedCount = async (
  share_creator_user_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      count(*)
    from
      article_feed af
    left join feed_share fs2 on
      fs2.shared_feed_id = af.feed_id
    where
      fs2.share_creator_user_id = '${share_creator_user_id}'`;
    result = await transaction.oneOrNone(query, [share_creator_user_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in feedShare getUserSharedFeedCount", error);
    throw error;
  }
};

module.exports = {
  add,
  getAll,
  getShareCount,
  deleteById,
  getUserSharedFeedCount,
};
