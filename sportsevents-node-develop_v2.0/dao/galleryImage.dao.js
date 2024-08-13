const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");

const add = async (
  image_title,
  image_desc,
  image_url,
  image_uploader_user_id,
  image_uploader_company_id,
  search_tags,
  share_count,
  like_count,
  image_uploader_event_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO gallery_image (image_id,image_title,image_desc,image_url,image_uploader_user_id,image_uploader_company_id,
        search_tags,share_count,like_count,image_uploader_event_id,created_date,updated_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`;
    result = await transaction.one(query, [
      uuidv4(),
      image_title,
      image_desc,
      image_url,
      image_uploader_user_id,
      image_uploader_company_id,
      search_tags,
      share_count,
      like_count,
      image_uploader_event_id,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in Gallery Image Dao add", error);
    throw error;
  }
};

const edit = async (
  image_title,
  image_desc,
  image_url,
  image_uploader_user_id,
  image_uploader_company_id,
  search_tags,
  share_count,
  like_count,
  image_uploader_event_id,
  image_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `UPDATE gallery_image SET image_title=$1,image_desc=$2,image_url=$3,image_uploader_user_id=$4,
    image_uploader_company_id=$5,search_tags=$6,share_count=$7,like_count=$8,updated_date=$9,image_uploader_event_id=$10 WHERE image_id=$11 RETURNING *`;
    result = await transaction.one(query, [
      image_title,
      image_desc,
      image_url,
      image_uploader_user_id,
      image_uploader_company_id,
      search_tags,
      share_count,
      like_count,
      currentDate,
      image_uploader_event_id,
      image_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in Gallery Image Dao update", error);
    throw error;
  }
};

const getById = async (image_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from gallery_image where image_id = $1";
    result = await transaction.oneOrNone(query, [image_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in Gallery Image getById Dao", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from gallery_image";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in Gallery Image getAll", error);
    throw error;
  }
};

const deleteById = async (image_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from gallery_image where image_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [image_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in Gallery Image deleteById Dao", error);
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
