const db = require("../utils/db");

const add = async (
  company_id,
  user_id,
  feed_id,
  comment_id,
  like_type,
  event_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let is_delete = false;
    let query = `INSERT INTO likes ( user_id,company_id,feed_id,comment_id,like_type,event_id,is_delete,created_date,updated_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;
    result = await transaction.one(query, [
      user_id,
      company_id,
      feed_id,
      comment_id,
      like_type,
      event_id,
      is_delete,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in likeDao add", error);
    throw error;
  }
};

const edit = async (
  company_id,
  user_id,
  feed_id,
  comment_id,
  like_type,
  event_id,
  like_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let is_delete = false;
    let query = `update likes set company_id=$1,user_id=$2,feed_id=$3,comment_id=$4 ,like_type=$5,is_delete=$6 ,updated_date=$7,event_id=$8 where like_id=$9 RETURNING *`;
    result = await transaction.one(query, [
      company_id,
      user_id,
      feed_id,
      comment_id,
      like_type,
      is_delete,
      currentDate,
      event_id,
      like_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in likeDao edit", error);
    throw error;
  }
};

const editLike = async (like_type, user_id, feed_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let is_delete = false;
    let query = `update likes set like_type=$1,updated_date=$2 ,is_delete=$3 where user_id = $4 and feed_id = $5  RETURNING *`;
    result = await transaction.oneOrNone(query, [
      like_type,
      currentDate,
      is_delete,
      user_id,
      feed_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in likeDao editLike", error);
    throw error;
  }
};

const deleteLike = async (like_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update likes set is_delete = true where like_id = $1 RETURNING *`;
    result = await transaction.oneOrNone(query, [like_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in likeDao edit", error);
    throw error;
  }
};

const getById = async (like_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from likes where like_id = $1";
    result = await transaction.oneOrNone(query, [like_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in likeDao getById", error);
    throw error;
  }
};

const getLikeCount = async (feed_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select count(l.*) as likes from likes l where l.feed_id = $1 and l.is_delete = false`;
    result = await transaction.oneOrNone(query, [feed_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in likeDao getById", error);
    throw error;
  }
};

// const deleteById = async (like_id, connectionObj = null) => {
//     try {
//         let transaction = connectionObj !== null ? connectionObj : db
//         let query = 'delete from likes where like_id = $1 RETURNING *'
//         result = await transaction.oneOrNone(query, [like_id])
//         return result;
//     }
//     catch (error) {
//         console.log("Error occurred in likeDao deleteById", error)
//         throw error;
//     }
// }

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select * from likes where is_delete = false`;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in likeDao getAll", error);
    throw error;
  }
};

const getAllLike = async (feed_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select u.user_id  as id,concat(u.first_name,' ',u.last_name) as name,u.user_profile_img  as avatar, 'U' as type, l.like_type from likes l
        inner join users u 
        on u.user_id = l.user_id 
        where feed_id = '${feed_id}'
        union all 
        select c.company_id  as id,c.company_name as name,c.company_profile_img  as avatar, 'C' as type, l.like_type from likes l
        inner join company c  
        on c.company_id  = l.company_id 
        where feed_id = '${feed_id}'`;
    result = await transaction.manyOrNone(query);
    return result;
  } catch (error) {
    console.log("Error occurred in likeGetAll dao ", error);
    throw error;
  }
};

const deleteLikeByUserIdandFeedId = async (
  user_id,
  feed_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update likes set is_delete = true where user_id = $1 and feed_id =$2 and is_delete = false RETURNING *`;
    result = await transaction.oneOrNone(query, [user_id, feed_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in likeDao edit", error);
    throw error;
  }
};

const getByUserIdandFeedId = async (user_id, feed_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select count(*) from likes  where user_id =$1 and feed_id =$2 and is_delete = false and comment_id is null`;
    result = await transaction.manyOrNone(query, [user_id, feed_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in likeDao getByUserIdandFeedId", error);
    throw error;
  }
};

const getByUserFeedComment = async (
  user_id,
  feed_id,
  comment_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select count(*) from likes  where user_id =$1 and feed_id =$2 and comment_id=$3 and is_delete = false`;
    result = await transaction.manyOrNone(query, [
      user_id,
      feed_id,
      comment_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in likeDao getByUserIdandFeedId", error);
    throw error;
  }
};

const getByGetLikeTypeCount = async (feed_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select count(1)::INTEGER as all, 
        count(1) filter (where l.like_type = 'like')::INTEGER as like,
        count(1) filter (where l.like_type = 'love')::INTEGER as love,
        count(1) filter (where l.like_type = 'care')::INTEGER as care,
        count(1) filter (where l.like_type = 'haha')::INTEGER as haha,
        count(1) filter (where l.like_type = 'sad')::INTEGER as sad,
        count(1) filter (where l.like_type = 'wow')::INTEGER as wow,
        count(1) filter (where l.like_type = 'angry')::INTEGER as angry from likes l where l.feed_id = $1 and l.is_delete = false
        `;
    result = await transaction.oneOrNone(query, [feed_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in likeDao getByGetLikeTypeCount", error);
    throw error;
  }
};

module.exports = {
  add,
  edit,
  getById,
  getLikeCount,
  // deleteById,
  getAll,
  getAllLike,
  deleteLike,
  deleteLikeByUserIdandFeedId,
  getByUserIdandFeedId,
  getByUserFeedComment,
  editLike,
  getByGetLikeTypeCount,
};
