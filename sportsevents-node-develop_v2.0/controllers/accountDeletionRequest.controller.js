const catchAsync = require("../utils/catchAsync");
const accountDeletionRequestService = require("../services/accountDeletionRequest.service");
const { handleError, ErrorHandler } = require("../config/error");
const errorText = "Error";

const accountDeletion = catchAsync(async (req, res) => {
  const methodName = "/accountDelete";
  try {
    const data = req.body;
    const deletedAccount = await accountDeletionRequestService.deleteAccount(
      data
    );
    res.send(deletedAccount);
  } catch (err) {
    console.log("Error occurred in Account Deletion at stage II:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});
const GetaccountDeletionById = catchAsync(async (req, res) => {
  const methodName = "/GetaccountDeletionById";
  try {
    const userId = req.params.user_id;

    const GetdeletedAccount =
      await accountDeletionRequestService.GetaccountDeletionById(userId);
    res.send(GetdeletedAccount);
  } catch (err) {
    console.log("Error occurred in Account Deletion at stage II:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});
const getAll = catchAsync(async (req, res) => {
  const methodName = "/GetAll";
  try {
    const GetdeletedAccount = await accountDeletionRequestService.GetAll();
    res.send(GetdeletedAccount);
  } catch (err) {
    console.log("Error occurred in Account Deletion at stage II:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});
const deleteRequest = catchAsync(async (req, res) => {
  const methodName = "/deleteRequest";
  try {
    const data = req.params.user_id;
    const GetdeletedAccount =
      await accountDeletionRequestService.deleteRequests(data);
    res.send(GetdeletedAccount);
  } catch (err) {
    console.log("Error occurred in Account Deletion at stage II:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  accountDeletion,
  GetaccountDeletionById,
  getAll,
  deleteRequest,
};
