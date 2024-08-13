const db = require("../utils/db");

const add = async (
  company_id,
  categorywise_statistics,
  statistics_links,
  identity_docs,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO company_statistics (company_id, categorywise_statistics, statistics_links, statistics_docs,created_date,updated_date)  
        values ($1,$2,$3,$4,$5,$6) RETURNING *`;
    result = await transaction.one(query, [
      company_id,
      categorywise_statistics,
      statistics_links,
      identity_docs,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in add CompanyStatistics", error);
    throw error;
  }
};

const edit = async (
  company_id,
  categorywise_statistics,
  statistics_links,
  identity_docs,
  company_statistics_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `UPDATE company_statistics SET company_id=$1, categorywise_statistics=$2, statistics_links=$3, statistics_docs=$4,updated_date=$5 WHERE company_statistics_id=$6 RETURNING *`;
    result = await transaction.one(query, [
      company_id,
      categorywise_statistics,
      statistics_links,
      identity_docs,
      currentDate,
      company_statistics_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in add edit", error);
    throw error;
  }
};

const updateByCompanyId = async (
  company_id,
  categorywise_statistics,
  statistics_links,
  identity_docs,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `UPDATE company_statistics SET categorywise_statistics=$1, statistics_links=$2, statistics_docs=$3,updated_date=$4 WHERE company_id=$5 RETURNING *`;
    result = await transaction.one(query, [
      categorywise_statistics,
      statistics_links,
      identity_docs,
      currentDate,
      company_id,
    ]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in company statistics dao updateByCompanyId",
      error
    );
    throw error;
  }
};

const getById = async (company_statistics_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from company_statistics where company_statistics_id = $1";
    result = await transaction.oneOrNone(query, [company_statistics_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in dao getById", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from company_statistics";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in dao getAll", error);
    throw error;
  }
};

const deleteById = async (company_statistics_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "delete from company_statistics where company_statistics_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [company_statistics_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in dao deleteById", error);
    throw error;
  }
};

const checkDuplicate = async (company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select count(*) from company_statistics where company_id = $1 ";
    result = await transaction.oneOrNone(query, [company_id, sport_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in dao checkDuplicate", error);
    throw error;
  }
};

const getCompanyById = async (company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from company_statistics where company_id =$1";
    result = await transaction.manyOrNone(query, [company_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in dao getComapanyById", error);
    throw error;
  }
};

module.exports = {
  add,
  edit,
  updateByCompanyId,
  getById,
  getAll,
  deleteById,
  checkDuplicate,
  getCompanyById,
};
