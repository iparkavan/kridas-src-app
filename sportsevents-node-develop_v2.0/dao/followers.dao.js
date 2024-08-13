const db = require("../utils/db");

const add = async (
  follower_userid,
  follower_companyid,
  following_companyid,
  following_userid,
  followed_from,
  following_event_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let is_delete = false;
    let query = `INSERT INTO follower (follower_userid, follower_companyid, following_companyid, following_userid, followed_from,is_delete,following_event_id) VALUES($1, $2, $3, $4, $5,$6,$7) RETURNING *`;
    result = await transaction.one(query, [
      follower_userid,
      follower_companyid,
      following_companyid,
      following_userid,
      followed_from,
      is_delete,
      following_event_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao add", error);
    throw error;
  }
};

const edit = async (
  follower_userid,
  follower_companyid,
  following_companyid,
  following_userid,
  followed_from,
  follower_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `UPDATE follower SET follower_userid=$1, follower_companyid=$2, following_companyid=$3, following_userid=$4, followed_from=$5 WHERE follower_id=$6 RETURNING *`;
    result = await transaction.one(query, [
      follower_userid,
      follower_companyid,
      following_companyid,
      following_userid,
      followed_from,
      follower_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao update", error);
    throw error;
  }
};

const getById = async (follower_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from follower where follower_id = $1 and is_delete = false";
    result = await transaction.oneOrNone(query, [follower_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao getById", error);
    throw error;
  }
};

const getFollowerUser = async (
  follower_userid,
  following_userid,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select * from follower  where follower_userid =$1 and following_userid =$2 `;
    result = await transaction.oneOrNone(query, [
      follower_userid,
      following_userid,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao getFollowerUser", error);
    throw error;
  }
};

const updateFollowerUser = async (
  follower_userid,
  following_userid,
  connectionObj = null
) => {
  try {
    let currentDate = new Date();
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update follower set is_delete = false,followed_from=$3 where follower_userid =$1 and following_userid =$2 returning *`;
    result = await transaction.oneOrNone(query, [
      follower_userid,
      following_userid,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao getById", error);
    throw error;
  }
};

const getFollowerUserCompany = async (
  follower_userid,
  following_companyid,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select * from follower  where follower_userid =$1 and following_companyid =$2 `;
    result = await transaction.oneOrNone(query, [
      follower_userid,
      following_companyid,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao getFollowerUser", error);
    throw error;
  }
};

const getFollowerUserByFollowingCompanyId = async (
  following_companyid,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
        array_agg(f.follower_userid) as follower_userid
    from
        follower f
    where
        f.following_companyid = '${following_companyid}'`;
    result = await transaction.oneOrNone(query, [following_companyid]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in follower dao getFollowerUserByFollowingCompanyId",
      error
    );
    throw error;
  }
};

const updateFollowerUserCompany = async (
  follower_userid,
  following_companyid,
  connectionObj = null
) => {
  try {
    let currentDate = new Date();
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update follower set is_delete = false,followed_from=$3 where follower_userid =$1 and following_companyid =$2 returning *`;
    result = await transaction.oneOrNone(query, [
      follower_userid,
      following_companyid,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in follower dao updateFollowerUserCompany",
      error
    );
    throw error;
  }
};

const getFollowerCompany = async (
  follower_companyid,
  following_companyid,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select * from follower  where follower_companyid =$1 and following_companyid =$2 `;
    result = await transaction.oneOrNone(query, [
      follower_companyid,
      following_companyid,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao getFollowerUser", error);
    throw error;
  }
};

const updateFollowerCompany = async (
  follower_companyid,
  following_companyid,
  connectionObj = null
) => {
  try {
    let currentDate = new Date();
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update follower set is_delete = false,followed_from=$3 where follower_companyid =$1 and following_companyid =$2 returning *`;
    result = await transaction.oneOrNone(query, [
      follower_companyid,
      following_companyid,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in follower dao updateFollowerUserCompany",
      error
    );
    throw error;
  }
};

const getFollowerUserEvent = async (
  follower_userid,
  following_event_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select * from follower  where follower_userid =$1 and following_event_id =$2 `;
    result = await transaction.oneOrNone(query, [
      follower_userid,
      following_event_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao getFollowerUserEvent", error);
    throw error;
  }
};

const updateFollowerUserEvent = async (
  follower_userid,
  following_event_id,
  connectionObj = null
) => {
  try {
    let currentDate = new Date();
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update follower set is_delete = false,followed_from=$3 where follower_userid =$1 and following_event_id =$2 returning *`;
    result = await transaction.oneOrNone(query, [
      follower_userid,
      following_event_id,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in follower dao updateFollowerUserEvent",
      error
    );
    throw error;
  }
};
const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from follower where is_delete = false ";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao getAll", error);
    throw error;
  }
};

const deleteById = async (follower_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from follower where follower_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [follower_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao deleteById", error);
    throw error;
  }
};

const customQueryExecutor = async (customQuery, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = customQuery;
    result = await transaction.query(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao customQueryExecutor", error);
    throw error;
  }
};

const unfollowUser = async (
  follower_userid,
  following_userid,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update follower set is_delete = true where follower_userid =$1 and following_userid =$2 RETURNING *`;
    result = await transaction.one(query, [follower_userid, following_userid]);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao unfollowUser", error);
    throw error;
  }
};

const unfollowUserCompany = async (
  follower_userid,
  following_companyid,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update follower set is_delete = true where follower_userid =$1 and following_companyid =$2 RETURNING *`;
    result = await transaction.one(query, [
      follower_userid,
      following_companyid,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao unfollowUserCompany", error);
    throw error;
  }
};

const unfollowCompany = async (
  follower_companyid,
  following_companyid,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update follower set is_delete = true where follower_companyid =$1 and following_companyid =$2 RETURNING *`;
    result = await transaction.one(query, [
      follower_companyid,
      following_companyid,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao unfollowCompany", error);
    throw error;
  }
};

const unfollowEvent = async (
  follower_userid,
  following_event_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update follower set is_delete = true where follower_userid =$1 and following_event_id =$2 RETURNING *`;
    result = await transaction.one(query, [
      follower_userid,
      following_event_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao unfollowEvent", error);
    throw error;
  }
};

module.exports = {
  add,
  edit,
  getById,
  getFollowerUser,
  updateFollowerUser,
  getAll,
  deleteById,
  customQueryExecutor,
  unfollowUser,
  unfollowUserCompany,
  unfollowCompany,
  getFollowerUserCompany,
  updateFollowerUserCompany,
  getFollowerCompany,
  updateFollowerCompany,
  getFollowerUserEvent,
  updateFollowerUserEvent,
  unfollowEvent,
  getFollowerUserByFollowingCompanyId,
};
