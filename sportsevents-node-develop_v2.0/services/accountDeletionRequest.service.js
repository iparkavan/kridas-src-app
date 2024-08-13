const { error } = require("../config/logger");
const accountDeletionRequestDao = require("../dao/accountDeletionRequest.dao");
const userService = require("../services/user.service");

const deleteAccount = async (data) => {
  try {
    let result = await accountDeletionRequestDao.addDeleteAccount(
      data.user_id,
      data.request_date,
      data.deletion_reason,
      data.is_deleted,
      data.deletion_date
    );
    return result;
  } catch (error) {
    console.log("Error occurred in account Deletion at stage III", error);
    throw error;
  }
};

const GetAll = async () => {
  try {
    let result = await accountDeletionRequestDao.GetAll();
    return result;
  } catch (error) {
    console.log("Error occurred in account Deletion at stage III", error);
    throw error;
  }
};
const GetaccountDeletionById = async (data) => {
  try {
    let result = await accountDeletionRequestDao.GetDeleteAccountById(data);
    return result;
  } catch (error) {
    console.log("Error occurred in account Deletion at stage III", error);
    throw error;
  }
};
const deleteRequests = async (data) => {
  try {
    let result = await accountDeletionRequestDao.deleteRequest(data);
    return result;
  } catch (error) {
    console.log("Error occurred in account Deletion at stage III", error);
    throw error;
  }
};
module.exports = {
  deleteAccount,
  GetaccountDeletionById,
  GetAll,
  deleteRequests,
};
