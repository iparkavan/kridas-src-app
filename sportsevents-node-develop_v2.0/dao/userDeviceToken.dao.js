const db = require('../utils/db');

const errorMessage = 'Error occurred in userDeviceToken.dao';

const add = async (user_id, device_token, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `INSERT INTO user_device_token (user_id,device_token) VALUES ($1,$2) RETURNING *`;
    result = await transaction.one(query, [user_id, device_token]);
    return result;
  } catch (error) {
    console.log(errorMessage + ' add', error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      'select user_device_token_id, user_id, device_token from  user_device_token';
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log(errorMessage + ' getAll', error);
    throw error;
  }
};

const getByUserId = async (user_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = 'select * from user_device_token where user_id = $1';
    result = await transaction.manyOrNone(query, [user_id]);
    return result;
  } catch (error) {
    console.log(errorMessage + ' getByUserId', error);
    throw error;
  }
};

const edit = async (
  user_device_token_id,
  user_id,
  device_token,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `UPDATE user_device_token SET user_id=$1, device_token=$2 WHERE user_device_token_id =$3 RETURNING *`;
    result = await transaction.one(query, [
      user_id,
      device_token,
      user_device_token_id,
    ]);
    return result;
  } catch (error) {
    console.log(errorMessage + ' edit', error);
    throw error;
  }
};

const deleteById = async (user_device_token_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      'delete from user_device_token where user_device_token_id = $1 RETURNING *';
    result = await transaction.oneOrNone(query, [user_device_token_id]);
    return result;
  } catch (error) {
    console.log(errorMessage + ' deleteById', error);
    throw error;
  }
};

const deleteByUserId = async (user_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = 'delete from user_device_token where user_id = $1 RETURNING *';
    result = await transaction.manyOrNone(query, [user_id]);
    return result;
  } catch (error) {
    console.log(errorMessage + ' deleteByUserId', error);
    throw error;
  }
};

const checkDuplicate = async (user_id, device_token, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      'select count(*) from user_device_token where user_id = $1 and device_token = $2';
    result = await transaction.oneOrNone(query, [user_id, device_token]);
    return result;
  } catch (error) {
    console.log(errorMessage + ' checkDuplicate', error);
    throw error;
  }
};

const customQueryExecutor = async (customQuery, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = customQuery;
    result = await transaction.query(query, []);
    return result;
  } catch (error) {
    console.log(errorMessage + ' customQueryExecutor', error);
    throw error;
  }
};

module.exports = {
  add,
  getAll,
  getByUserId,
  edit,
  deleteById,
  deleteByUserId,
  checkDuplicate,
  customQueryExecutor,
};
