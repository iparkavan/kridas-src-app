const db = require("../utils/db");

const add = async (
  company_id,
  user_id,
  user_type,
  user_role,
  user_start_date,
  user_end_date = null,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO company_users (company_id,user_id,user_type,user_role,user_start_date,user_end_date,created_date,updated_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    result = await transaction.one(query, [
      company_id,
      user_id,
      user_type,
      user_role,
      user_start_date,
      user_end_date,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyUserDao add", error);
    throw error;
  }
};

const edit = async (
  company_id,
  user_id,
  user_type,
  user_start_date,
  user_end_date,
  user_role,
  company_user_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update company_users set company_id=$1,user_id=$2,user_type=$3,user_start_date=$4,user_end_date=$5,updated_date=$6,user_role=$7 where company_user_id=$8 RETURNING *`;
    result = await transaction.one(query, [
      company_id,
      user_id,
      user_type,
      user_start_date,
      user_end_date,
      currentDate,
      user_role,
      company_user_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyUserDao edit", error);
    throw error;
  }
};

const getById = async (companyUserId, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from company_users where company_user_id = $1";
    result = await transaction.oneOrNone(query, [companyUserId]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyUserDao getById", error);
    throw error;
  }
};

const getByCompanyId = async (companyId, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      cu.*,
      lt.lookup_value as role,
      u.user_name
    from
      company_users cu
    left join lookup_table lt on
      lt.lookup_key = cu.user_role
    left join users u on
      u.user_id = cu.user_id
    where
      company_id = '${companyId}'
    order by
      cu.user_type asc`;
    result = await transaction.manyOrNone(query, [companyId]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyUserDao getByCompanyId", error);
    throw error;
  }
};

const deleteById = async (companyUserId, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "delete from company_users where company_user_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [companyUserId]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyUserDao deleteById", error);
    throw error;
  }
};

const getCompanyAndUserCombo = async (
  company_id,
  user_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from company_users where company_id = $1 and user_id=$2";
    result = await transaction.oneOrNone(query, [company_id, user_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyUserDao getById", error);
    throw error;
  }
};

module.exports = {
  add,
  edit,
  getById,
  deleteById,
  getByCompanyId,
  getCompanyAndUserCombo,
};
