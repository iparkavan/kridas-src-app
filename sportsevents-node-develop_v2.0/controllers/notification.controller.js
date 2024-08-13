const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const notificationService = require("../services/notification.service");
const { handleError, ErrorHandler } = require("../config/error");
const errorText = "Error";

const getByUserId = catchAsync(async (req, res) => {
  const methodName = "/getByUserId";
  try {
    const notifications = await notificationService.getByUserId(req.params.id);
    res.send(notifications);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchByUserId = catchAsync(async (req, res) => {
  const methodName = "/searchByUserId";
  try {
    const notifications = await notificationService.searchByUserId(req.body);
    res.send(notifications);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const search = catchAsync(async (req, res) => {
  const methodName = "/search";
  try {
    const notifications = await notificationService.search(req.body);
    res.send(notifications);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const updateNotification = catchAsync(async (req, res) => {
  const methodName = "/updateNotification";
  try {
    const notifications = await notificationService.updateNotification(
      req.body
    );
    res.send(notifications);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  getByUserId,
  searchByUserId,
  updateNotification,
  search,
};
