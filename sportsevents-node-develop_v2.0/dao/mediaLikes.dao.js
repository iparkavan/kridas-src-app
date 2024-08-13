const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");

const add = async (
  user_id,
  company_id,
  media_id,
  comment_id,
  like_type,
  is_deleted,
  event_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO media_likes (user_id, company_id, media_id, comment_id, like_type, is_deleted,event_id, created_date, updated_date) 
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;
    let result = await transaction.one(query, [
      user_id,
      company_id,
      media_id,
      comment_id,
      like_type,
      is_deleted,
      event_id,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in mediaLikesDao add", error);
    throw error;
  }
};

const edit = async (
  user_id,
  company_id,
  media_id,
  comment_id,
  like_type,
  is_deleted,
  event_id,
  like_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update media_likes  set user_id=$1,company_id=$2,media_id=$3,comment_id=$4,
        like_type=$5,is_deleted=$6,updated_date=$7,event_id=$8
        where like_id=$9 RETURNING *`;
    let result = await transaction.one(query, [
      user_id,
      company_id,
      media_id,
      comment_id,
      like_type,
      is_deleted,
      currentDate,
      event_id,
      like_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in mediaLikesDao edit", error);
    throw error;
  }
};

const getById = async (like_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from media_likes where like_id=$1";
    result = await transaction.oneOrNone(query, [like_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in mediaLikesDao getById", error);
    throw error;
  }
};

const getByGetLikeTypeCount = async (media_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select count(1)::INTEGER as all, 
        count(1) filter (where ml.like_type ilike 'like')::INTEGER as like,
        count(1) filter (where ml.like_type ilike 'lov')::INTEGER as love,
        count(1) filter (where ml.like_type ilike 'care')::INTEGER as care,
        count(1) filter (where ml.like_type ilike 'haha')::INTEGER as haha,
        count(1) filter (where ml.like_type ilike 'sad')::INTEGER as sad,
        count(1) filter (where ml.like_type ilike'wow')::INTEGER as wow,
        count(1) filter (where ml.like_type ilike 'angry')::INTEGER as angry from media_likes ml where ml.media_id ='${media_id}' and ml.is_deleted = false`;
    result1 = await transaction.oneOrNone(query, [media_id]);
    return result1;
  } catch (error) {
    console.log("Error occurred in MediaLike Dao getByGetLikeTypeCount", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select * from media_likes order by updated_date desc`;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in mediaLikesDao getAll", error);
    throw error;
  }
};

const getByUserIdandMediaId = async (
  user_id,
  media_id,
  connectionObj = null
) => {
  try {
    let result1 = null;
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select count(*) from media_likes  where user_id =$1 and media_id =$2 and is_deleted = false`;
    result1 = await transaction.manyOrNone(query, [user_id, media_id]);
    return result1;
  } catch (error) {
    console.log(
      "Error occurred in Media Like Dao getByUserIdandMediaId",
      error
    );
    throw error;
  }
};

const deleteById = async (like_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from media_likes where like_id = $1 RETURNING *";
    result1 = await transaction.oneOrNone(query, [like_id]);
    return result1;
  } catch (error) {
    console.log("Error occurred in mediaLikesDao deleteById", error);
    throw error;
  }
};

module.exports = {
  add,
  edit,
  getById,
  getAll,
  deleteById,
  getByUserIdandMediaId,
  getByGetLikeTypeCount,
};
