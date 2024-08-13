const db = require("../utils/db");

const addDeleteAccount = async (
  user_id,
  request_date,
  deletion_reason,
  is_deleted,
  deletion_date,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `INSERT INTO account_deletion_request ( 
        user_id,
        request_date,
        deletion_reason,
        is_deleted,
        deletion_date) VALUES ($1,$2,$3,$4,$5) RETURNING *`;

    result = await transaction.one(query, [
      user_id,
      request_date,
      deletion_reason,
      is_deleted,
      deletion_date,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in account Deletion at stage IV", error);
    throw error;
  }
};
const GetAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;

    let query =
      "SELECT CONCAT(u.first_name, ' ', u.last_name) as name, u.user_email, adr.* FROM users u JOIN account_deletion_request adr ON u.user_id = adr.user_id;";

    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in account Deletion at stage IV", error);
    throw error;
  }
};

const GetDeleteAccountById = async (user_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;

    let query = "SELECT * FROM account_deletion_request adr WHERE user_id = $1";

    result = await transaction.one(query, [user_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in account Deletion at stage IV", error);
    throw error;
  }
};
const deleteRequest = async (user_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;

    let query =
      "DELETE FROM account_deletion_request WHERE user_id = $1 RETURNING *";
    result = await transaction.one(query, [user_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in account Deletion at stage IV", error);
    throw error;
  }
};

module.exports = {
  addDeleteAccount,
  GetDeleteAccountById,
  GetAll,
  deleteRequest,
};
