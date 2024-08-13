const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");
const { json } = require("body-parser");

const add = async (
  media_type,
  media_url,
  media_url_meta,
  media_desc,
  media_creator_user_id,
  media_creator_company_id,
  search_tags,
  media_creator_event_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO media (media_id,media_type, media_url, media_url_meta, media_desc, media_creator_user_id,media_creator_company_id,search_tags,media_creator_event_id,created_date,updated_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`;
    result = await transaction.one(query, [
      uuidv4(),
      media_type,
      media_url,
      JSON.stringify(media_url_meta),
      media_desc,
      media_creator_user_id,
      media_creator_company_id,
      search_tags,
      media_creator_event_id,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in media add", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from  media";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in media getAll", error);
    throw error;
  }
};

const getById = async (media_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from media where media_id = $1";
    result = await transaction.oneOrNone(query, [media_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in media getById", error);
    throw error;
  }
};

const edit = async (
  media_type,
  media_url,
  media_url_meta,
  media_desc,
  media_creator_user_id,
  media_creator_company_id,
  search_tags,
  media_creator_event_id,
  media_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `UPDATE media SET media_type=$1, media_url=$2, media_url_meta=$3,  media_desc=$4, media_creator_user_id=$5, media_creator_company_id=$6, search_tags = $7, created_date=$8, updated_date=$9,media_creator_event_id=$10 WHERE media_id =$11 RETURNING *`;
    result = await transaction.one(query, [
      media_type,
      media_url,
      media_url_meta,
      media_desc,
      media_creator_user_id,
      media_creator_company_id,
      search_tags,
      currentDate,
      currentDate,
      media_creator_event_id,
      media_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in media update", error);
    throw error;
  }
};

const deleteById = async (media_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from media where media_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [media_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in media_id deleteById", error);
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
    console.log("Error occurred in feedDao customQueryExecutor", error);
    throw error;
  }
};

const getFeedByMedia = async (media_id, id, type, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let condition =
      type === "U" ? "l.user_id" : type === "C" ? "l.company_id" : "l.event_id";
    let query = `select
      f.*,
      row_to_json(u.*)as user,
      row_to_json(c.*)as company,
      row_to_json(e.*)as event, 
      count(ci.*) as CommentCount,
      row_to_json(l.*) as like
    from
      feed_media fm
    left join feeds f on
      fm.feed_id = f.feed_id
    left join users u on
      u.user_id = f.feed_creator_user_id
    left join company c on
      c.company_id = f.feed_creator_company_id
    left join events e on
      e.event_id = f.event_id
    left join comment_info ci on
      ci.feed_id = f.feed_id
    left join likes l on
      l.feed_id = f.feed_id
      and l.is_delete = false
      and l.comment_id isnull
      and ${condition} = '${id}'
    where
      fm.media_id = $1
    group by
      f.feed_id ,
      c.company_id ,
      u.user_id,
      l.*,
      e.*`;
    result = await transaction.manyOrNone(query, [media_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in getMediaByfeedId in dao", error);
    throw error;
  }
};

module.exports = {
  add,
  getAll,
  getById,
  edit,
  deleteById,
  customQueryExecutor,
  getFeedByMedia,
};
