const db = require('../utils/db');
const userDeviceTokenDao = require('../dao/userDeviceToken.dao');

const errorMessage = 'Error occurred in userDeviceToken.service';

/**
 *Method to create new entry in user device token
 * @param {JSon} body
 */
const createUserDevice = async (body, connectionObj = null) => {
  let result = null;
  try {
    const { user_id, device_token } = body;

    let { count } = await userDeviceTokenDao.checkDuplicate(
      user_id,
      device_token
    );

    //Don't add if exists already
    if (Number(count) === 0) {
      result = await userDeviceTokenDao.add(
        user_id,
        device_token,
        connectionObj
      );
    } else {
      result = { user_id, device_token };
    }

    return result;
  } catch (error) {
    console.log(errorMessage + ' createUserDevice', error);
    throw error;
  }
};

/**
 * Method to getAll entries in user device token
 */

const fetchAll = async () => {
  let result = null;
  try {
    let data = await userDeviceTokenDao.getAll();
    result = data;
    return result;
  } catch (error) {
    console.log(errorMessage + ' fetchAll', error);
    throw error;
  }
};

module.exports = {
  createUserDevice,
  fetchAll,
};
