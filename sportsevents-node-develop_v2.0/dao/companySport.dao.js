const db = require("../utils/db");

const add = async (
  company_id,
  sports_refid,
  is_deleted,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO  company_sport (company_id,sports_refid ,is_deleted,created_date,updated_date) 
        values ($1,$2,$3,$4,$5) RETURNING *`;
    result = await transaction.one(query, [
      company_id,
      sports_refid,
      is_deleted,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in company_sport add", error);
    throw error;
  }
};

const edit = async (
  company_id,
  sports_refid,
  is_deleted,
  company_sport_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update company_sport set company_id=$1,sports_refid=$2,is_deleted=$3 ,updated_date=$4 where company_sport_id=$5 RETURNING *`;
    result = await transaction.one(query, [
      company_id,
      sports_refid,
      is_deleted,
      currentDate,
      company_sport_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in companySportsDao edit", error);
    throw error;
  }
};

const getbyCompanySports = async (
  company_id,
  sports_refid,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from company_sport where company_id = $1 and sports_refid = $2";
    result = await transaction.oneOrNone(query, [company_id, sports_refid]);
    return result;
  } catch (error) {
    console.log("Error occurred in company and sports combination", error);
    throw error;
  }
};

const updateIsdelete = async (company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update company_sport set is_deleted = true where company_id=$1`;
    result = await transaction.manyOrNone(query, [company_id]);
    return result;
  } catch (error) {
    console.log("Error occurred updateIsdelete", error);
    throw error;
  }
};

module.exports = {
  add,
  edit,
  getbyCompanySports,
  updateIsdelete,
};
