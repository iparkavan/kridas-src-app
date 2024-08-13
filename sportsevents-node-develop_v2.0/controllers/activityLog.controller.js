const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const activityService = require("../services/activityLog.service");
const { handleError, ErrorHandler } = require("./../config/error");
const errorText = "Error";

const createLog = catchAsync(async (req, res) => {
  const methodName = "/createLog";
  try {
    const activityLog = await activityService.createLog(req.body);
    res.status(httpStatus.CREATED).send(activityLog);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const logOut = catchAsync(async (req, res) => {
  const methodName = "/logOut";
  try {
    const activityLog = await activityService.logOut(req.body);
    res.status(httpStatus.CREATED).send(activityLog);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchByIdAndType = catchAsync(async (req, res) => {
  const methodName = "/fetchByIdAndType";
  try {
    const activityLog = await activityService.fetchByIdAndType(
      req.params.id,
      req.params.type
    );
    res.send(activityLog);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchById = catchAsync(async (req, res) => {
  const methodName = "/fetchById";
  try {
    const activityLog = await activityService.fetchById(req.params.id);
    res.send(activityLog);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchById = catchAsync(async (req, res) => {
  const methodName = "/searchById";
  try {
    const activityLog = await activityService.searchById(req.body);
    res.status(httpStatus.CREATED).send(activityLog);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const addActivityLog = catchAsync(async (req, res) => {
  const methodName = "/addActivityLog";
  try {
    const activityLog = await activityService.addActivityLog(req.body);
    res.status(httpStatus.CREATED).send(activityLog);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createLog,
  fetchByIdAndType,
  fetchById,
  searchById,
  logOut,
  addActivityLog,
};
