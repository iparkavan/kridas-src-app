const db = require("../utils/db");

const add = async (media_id, gallery_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO gallery_media (media_id,gallery_id, created_date, updated_date) VALUES ($1,$2,$3,$4) RETURNING *`;
    result = await transaction.one(query, [
      media_id,
      gallery_id,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in gallery_media add", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from gallery_media";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in gallery_media getAll", error);
    throw error;
  }
};

const getById = async (gallery_media_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from gallery_media where gallery_media_id = $1";
    result = await transaction.oneOrNone(query, [gallery_media_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in gallery_media getById", error);
    throw error;
  }
};

const edit = async (
  gallery_media_id,
  gallery_image,
  gallery_video,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update gallery_media set gallery_image=$1, gallery_video=$2, created_date= $3, updated_date=$4 where gallery_media_id=$5 RETURNING *`;
    result = await transaction.one(query, [
      gallery_image,
      gallery_video,
      currentDate,
      currentDate,
      gallery_media_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in SponsorDao edit", error);
    throw error;
  }
};

const deleteById = async (gallery_media_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;

    let query =
      "delete from gallery_media where gallery_media_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [gallery_media_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in gallery_media delete", error);
    throw error;
  }
};

const deleteByGalleryId = async (gallery_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;

    let query = "delete from gallery_media where gallery_id = $1 RETURNING *";
    result = await transaction.manyOrNone(query, [gallery_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in gallery_media delete", error);
    throw error;
  }
};

const getByGalleryCount = async (gallery_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select count(*) from gallery_media gm where gm.gallery_id = $1";
    result = await transaction.oneOrNone(query, [gallery_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in gallery_media getByGalleryCount", error);
    throw error;
  }
};

const deleteByMediaId = async (media_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;

    let query = "delete from gallery_media where media_id = $1 RETURNING *";
    result = await transaction.manyOrNone(query, [media_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in gallery_media dao : deleteByMediaId", error);
    throw error;
  }
};

module.exports = {
  add,
  getAll,
  getById,
  edit,
  deleteById,
  deleteByGalleryId,
  getByGalleryCount,
  deleteByMediaId,
};
