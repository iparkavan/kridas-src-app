const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");

const add = async (
  gallery_name,
  gallery_desc,
  user_id,
  company_id,
  gallery_event_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO gallery (gallery_id,gallery_name,gallery_desc,gallery_user_id,gallery_company_id,gallery_event_id,created_date,updated_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    result = await transaction.one(query, [
      uuidv4(),
      gallery_name,
      gallery_desc,
      user_id,
      company_id,
      gallery_event_id,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in Gallery Dao add", error);
    throw error;
  }
};

const edit = async (
  gallery_name,
  gallery_desc,
  gallery_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `UPDATE gallery SET gallery_name=$1, gallery_desc=$2,  updated_date=$3 WHERE gallery_id=$4 RETURNING *`;
    result = await transaction.one(query, [
      gallery_name,
      gallery_desc,
      currentDate,
      gallery_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in Gallery Dao update", error);
    throw error;
  }
};

const getById = async (gallery_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from gallery where gallery_id = $1";
    result = await transaction.oneOrNone(query, [gallery_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in Gallery getById", error);
    throw error;
  }
};

const getByUserId = async (gallery_user_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select  g.*,
        json_agg(row_to_json(t.*)) as gallery_media
        from
             gallery g
        left join (
            select
                gm.*,
                row_to_json(m.*) as media
            from
                 gallery_media gm
            left join media m on
                gm.media_id = m.media_id) t
        on
            t.gallery_id = g.gallery_id
        where
            g.gallery_user_id = $1
        group by
            g.gallery_id`;
    result = await transaction.manyOrNone(query, [gallery_user_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in Gallery getByUserId", error);
    throw error;
  }
};

const getByCompanyId = async (gallery_company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select  g.*,
        json_agg(row_to_json(t.*)) as gallery_media
        from
             gallery g
        left join (
            select
                gm.*,
                row_to_json(m.*) as media
            from
                 gallery_media gm
            left join media m on
                gm.media_id = m.media_id) t
        on
            t.gallery_id = g.gallery_id
        where
            g.gallery_company_id = $1
        group by
            g.gallery_id`;
    result = await transaction.manyOrNone(query, [gallery_company_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in Gallery getByCompanyId", error);
    throw error;
  }
};

const getByEventId = async (gallery_event_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select  g.*,
        json_agg(row_to_json(t.*)) as gallery_media
        from
             gallery g
        left join (
            select
                gm.*,
                row_to_json(m.*) as media
            from
                 gallery_media gm
            left join media m on
                gm.media_id = m.media_id) t
        on
            t.gallery_id = g.gallery_id
        where
            g.gallery_event_id = $1
        group by
            g.gallery_id`;
    result = await transaction.manyOrNone(query, [gallery_event_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in Gallery getByEventId", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from gallery";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in Gallery getAll", error);
    throw error;
  }
};

const deleteById = async (gallery_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from gallery where gallery_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [gallery_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in Gallery deleteById", error);
    throw error;
  }
};

module.exports = {
  add,
  edit,
  getById,
  getByUserId,
  getByCompanyId,
  getAll,
  deleteById,
  getByEventId,
};
