const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const followerService = require("../services/follower.service");
const { handleError, ErrorHandler } = require("./../config/error");
const errorText = "Error";

const createFollower = catchAsync(async (req, res) => {
  const methodName = "/createFollower";
  try {
    let requestBody = req.body;
    requestBody["socket_request"] = req.socket_request;
    const createFollower = await followerService.createFollower(requestBody);
    res.status(httpStatus.CREATED).send(createFollower);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAll = catchAsync(async (req, res) => {
  const methodName = "/fetchAll";
  try {
    const follower = await followerService.fetchAll();
    res.send(follower);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchFollower = catchAsync(async (req, res) => {
  const methodName = "/fetchFollower";
  try {
    const follower = await followerService.fetchFollower(
      req.params.follower_id
    );
    res.send(follower);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteFollower = catchAsync(async (req, res) => {
  const methodName = "/deleteFollower";
  try {
    const follower = await followerService.deleteFollower(
      req.params.follower_id
    );
    res.send(follower);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const editFollower = catchAsync(async (req, res) => {
  const methodName = "/editFollower";
  try {
    const follower = await followerService.editFollower(req.body);
    res.send(follower);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchFollower = catchAsync(async (req, res) => {
  const methodName = "/searchFollower";
  try {
    const user = await followerService.searchFollower(req.body);
    res.send(user);
  } catch (err) {
    console.log("Error occurred in searchFeed: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const unFollow = catchAsync(async (req, res) => {
  const methodName = "/unFollow";
  try {
    const user = await followerService.unFollow(req.body);
    res.send(user);
  } catch (err) {
    console.log("Error occurred in unFollow: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createFollower,
  fetchAll,
  fetchFollower,
  deleteFollower,
  editFollower,
  searchFollower,
  unFollow,
};
