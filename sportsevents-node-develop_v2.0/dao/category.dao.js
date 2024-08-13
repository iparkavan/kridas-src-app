const db = require("../utils/db");

const add = async (
  category_type,
  category_name,
  category_desc,
  parent_category_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO category (category_type,category_name,category_desc,parent_category_id,created_date,updated_date) 
        values ($1,$2,$3,$4,$5,$6) RETURNING *`;
    result = await transaction.one(query, [
      category_type,
      category_name,
      category_desc,
      parent_category_id,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in categoryDao add", error);
    throw error;
  }
};

const edit = async (
  category_type,
  category_name,
  category_desc,
  category_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update category  set category_type=$1,category_name=$2,category_desc=$3,updated_date=$4 where category_id=$5 RETURNING *`;
    result = await transaction.one(query, [
      category_type,
      category_name,
      category_desc,
      currentDate,
      category_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in categoryDao edit", error);
    throw error;
  }
};

const getById = async (category_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select c.*,c.parent_category_id as parent,c2.category_name as parent_name from category c left join category c2 on c2.category_id =c.parent_category_id where c.category_id =$1";
    result = await transaction.oneOrNone(query, [category_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in categoryDao getById", error);
    throw error;
  }
};

const getByParentId = async (parent_category_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from category where parent_category_id = $1 order by category_name asc";
    result = await transaction.manyOrNone(query, [parent_category_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in categoryDao getByParentId", error);
    throw error;
  }
};

const getByParentName = async (parent_category_type, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from category where parent_category_id = (select category_id from category where category_type=$1) order by category_name asc";
    result = await transaction.manyOrNone(query, [parent_category_type]);
    return result;
  } catch (error) {
    console.log("Error occurred in categoryDao getByParentId", error);
    throw error;
  }
};

const getByCategoryName = async (category_name, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select category_id from category where category_name=$1";
    result = await transaction.manyOrNone(query, [category_name]);
    return result;
  } catch (error) {
    console.log("Error occurred in categoryDao getByParentId", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select c.category_name,c.category_type ,c.category_desc ,c2.category_name as parent_category_id,c.category_id from category c left join category c2 on c2.category_id = c.parent_category_id order by c.updated_date desc`;

    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in categoryDao getAll", error);
    throw error;
  }
};

const deleteById = async (category_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from category where category_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [category_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in categoryDao deleteById", error);
    throw error;
  }
};

const fetchAllParentCategory = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
            *
        from
            category c
        where
            c.parent_category_id isnull
            or c.parent_category_id in (
            select
                c2.category_id
            from
                category c2
            where
                c2.category_type = 'CAT')`;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in categoryDao fetchAllParentCategory", error);
    throw error;
  }
};

const getCategoryTypeById = async (category_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select category_type from category where category_id=$1";
    result = await transaction.oneOrNone(query, [category_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in categoryDao getByParentId", error);
    throw error;
  }
};

const getCategoryIdByParticipantCategoryType = async (
  participant_category_type,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
            c.category_id
        from
            category c
        where
            c.category_type = '${participant_category_type}'
            and c.parent_category_id =(
            select
                c2.category_id
            from
                category c2
            where
                c2.category_type = 'CAT')`;
    result = await transaction.oneOrNone(query, [participant_category_type]);
    return result;
  } catch (error) {
    console.log("Error occurred in categoryDao getByParentId", error);
    throw error;
  }
};

const getAllSubCategories = async (category_type, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      distinct c3.category_name,
      c3.category_type
    from
      category c
    left join category c2 on
      c.category_id = c2.parent_category_id
    left join category c3 on
      c2.category_id = c3.parent_category_id
    where
      c3.category_name is not null
      and c.category_type = '${category_type}'`;
    result = await transaction.manyOrNone(query, [category_type]);
    return result;
  } catch (error) {
    console.log("Error occurred in categoryDao getAllSubCategories", error);
    throw error;
  }
};

const getCategoryIdByType = async (
  category_type,
  parent_category_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select category_id from category where category_type=$1 and parent_category_id =$2";
    result = await transaction.oneOrNone(query, [
      category_type,
      parent_category_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in categoryDao getCategoryIdByType", error);
    throw error;
  }
};

const getParentCategoryIdByType = async (
  category_type,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select c.category_id  from category c where c.category_type =$1 and c.parent_category_id =(select c2.category_id  from category c2 where c2.category_type='CAT')";
    result = await transaction.oneOrNone(query, [category_type]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in categoryDao getParentCategoryIdByType",
      error
    );
    throw error;
  }
};

const getAllCategoryIdByCatType = async (
  category_type,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select array_agg(category_id) as category_id from category where category_type=$1 ";
    result = await transaction.oneOrNone(query, [category_type]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in categoryDao getAllCategoryIdByCatType",
      error
    );
    throw error;
  }
};

module.exports = {
  add,
  edit,
  getById,
  getAll,
  deleteById,
  getByParentId,
  getByParentName,
  fetchAllParentCategory,
  getByCategoryName,
  getCategoryTypeById,
  getCategoryIdByParticipantCategoryType,
  getAllSubCategories,
  getCategoryIdByType,
  getParentCategoryIdByType,
  getAllCategoryIdByCatType,
};
