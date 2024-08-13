const db = require("../utils/db");

const add = async (
  company_sponsor_type_name,
  company_id,
  sort_order,
  is_deleted,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO company_sponsor_type (company_sponsor_type_name,company_id,sort_order, is_deleted, created_date, updated_date) 
        values ($1,$2,$3,$4,$5,$6) RETURNING *`;
    result = await transaction.one(query, [
      company_sponsor_type_name,
      company_id,
      sort_order,
      is_deleted,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in company sponsor type dao add", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from company_sponsor_type where is_deleted=false";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in company sponsor type dao getAll", error);
    throw error;
  }
};

const getById = async (company_sponsor_type_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from company_sponsor_type where company_sponsor_type_id = $1 and is_deleted=false";
    result = await transaction.oneOrNone(query, [company_sponsor_type_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in company sponsor type dao getById", error);
    throw error;
  }
};

const getByCompanySponsorTypeNamewithId = async (
  company_sponsor_type_name,
  company_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from company_sponsor_type where lower(company_sponsor_type_name) = lower($1) and company_id =$2 ";
    result = await transaction.oneOrNone(query, [
      company_sponsor_type_name,
      company_id,
    ]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in company sponsor type dao getByCompanySponsorTypeNamewithId",
      error
    );
    throw error;
  }
};

const edit = async (
  company_sponsor_type_name,
  company_id,
  sort_order,
  is_deleted,
  company_sponsor_type_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update company_sponsor_type set company_sponsor_type_name=$1, company_id=$2,sort_order=$3, is_deleted=$4, updated_date=$5 where company_sponsor_type_id=$6 RETURNING *`;
    result = await transaction.one(query, [
      company_sponsor_type_name,
      company_id,
      sort_order,
      is_deleted,
      currentDate,
      company_sponsor_type_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in company sponsor type dao edit", error);
    throw error;
  }
};

const deleteById = async (company_sponsor_type_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update company_sponsor_type set is_deleted=true where company_sponsor_type_id = $1 RETURNING *`;
    result = await transaction.one(query, [company_sponsor_type_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in company sponsor type dao delete", error);
    throw error;
  }
};

const getCompanySponsorTypeCountByCompanyId = async (
  company_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select count(*) from company_sponsor_type cst where cst.company_id =$1 and cst.is_deleted =false";
    result = await transaction.oneOrNone(query, [company_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in company sponsor type dao getCompanySponsorTypeCountByCompanyId",
      error
    );
    throw error;
  }
};

const getAllCompanySponsorTypeCountByCompanyId = async (
  company_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select count(*) from company_sponsor_type cst where cst.company_id =$1";
    result = await transaction.oneOrNone(query, [company_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in company sponsor type dao getCompanySponsorTypeCountByCompanyId",
      error
    );
    throw error;
  }
};

const getAllCompanySponsorTypeByCompanyId = async (
  company_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      cst.*
    from
      company_sponsor_type cst
    where
      cst.company_id = '${company_id}'
      and cst.is_deleted = false`;
    result = await transaction.manyOrNone(query, [company_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in company sponsor type dao getCompanySponsorTypeCountByCompanyId",
      error
    );
    throw error;
  }
};

module.exports = {
  getAll,
  add,
  getById,
  edit,
  deleteById,
  getByCompanySponsorTypeNamewithId,
  getCompanySponsorTypeCountByCompanyId,
  getAllCompanySponsorTypeCountByCompanyId,
  getAllCompanySponsorTypeByCompanyId,
};
