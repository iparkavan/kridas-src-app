const db = require("../utils/db");

const add = async (
  parent_category_id,
  product_category_code,
  product_category_name,
  product_category_desc,
  product_category_img,
  product_category_img_meta,
  product_category_status,
  depth_level,
  is_featured,
  sort_order,
  created_by,
  updated_by,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO product_category ( parent_category_id,
        product_category_code,
        product_category_name,
        product_category_desc,
        product_category_img,
        product_category_img_meta,
        product_category_status,
        depth_level,
        is_featured,
        sort_order,
        created_by,
        updated_by,
        created_date,
        updated_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`;
    result = await transaction.one(query, [
      parent_category_id,
      product_category_code,
      product_category_name,
      product_category_desc,
      product_category_img,
      product_category_img_meta,
      product_category_status,
      depth_level,
      is_featured,
      sort_order,
      created_by,
      updated_by,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in product_category Dao add", error);
    throw error;
  }
};

const edit = async (
  parent_category_id,
  product_category_code,
  product_category_name,
  product_category_desc,
  product_category_img,
  product_category_img_meta,
  product_category_status,
  depth_level,
  is_featured,
  sort_order,
  updated_by,
  product_category_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `UPDATE product_category SET parent_category_id=$1, product_category_code=$2,product_category_name=$3,product_category_desc=$4,
    product_category_img=$5,product_category_img_meta=$6,
    product_category_status=$7,depth_level=$8,is_featured=$9,sort_order=$10,
    updated_by=$11,updated_date=$12 WHERE product_category_id=$13 RETURNING *`;
    result = await transaction.one(query, [
      parent_category_id,
      product_category_code,
      product_category_name,
      product_category_desc,
      product_category_img,
      product_category_img_meta,
      product_category_status,
      depth_level,
      is_featured,
      sort_order,
      updated_by,
      currentDate,
      product_category_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in product_category Dao Update", error);
    throw error;
  }
};

const getById = async (product_category_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from product_category where product_category_id = $1";
    result = await transaction.oneOrNone(query, [product_category_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in product category Dao getById", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from product_category";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in product category getAll", error);
    throw error;
  }
};

const deleteById = async (product_category_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "delete from product_category where product_category_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [product_category_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in product category deleteById", error);
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
