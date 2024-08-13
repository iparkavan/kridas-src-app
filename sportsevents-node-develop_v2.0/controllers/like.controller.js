const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const likeService = require("../services/like.service");
const { handleError, ErrorHandler } = require("./../config/error");
const errorText = "Error";

const createLike = catchAsync(async (req, res) => {
  const methodName = "/createLike";
  try {
    let requestBody = req.body;
    requestBody["socket_request"] = req.socket_request;
    const like = await likeService.createLike(requestBody);
    res.status(httpStatus.CREATED).send(like);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const editLike = catchAsync(async (req, res) => {
  const methodName = "/editLike";
  try {
    const user = await likeService.editLike(req.body);
    res.send(user);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const editLikeType = catchAsync(async (req, res) => {
  const methodName = "/editLikeType";
  try {
    const like = await likeService.updateLike(req.body);
    res.send(like);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchLike = catchAsync(async (req, res) => {
  const methodName = "/fetchLike";
  try {
    const like = await likeService.fetchLike(req.params.like_id);
    res.send(like);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

// const deleteLike = catchAsync(async (req, res) => {
//     const methodName = '/deleteLike'
//     try {
//         const like = await likeService.deleteLike(req.params.like_id);
//         res.send(like);
//     } catch (err) {
//         handleError(new ErrorHandler(errorText, methodName, err), res);
//     }
// });

const deleteLikeById = catchAsync(async (req, res) => {
  const methodName = "/deleteLikeById";
  try {
    const like = await likeService.deleteLikeById(req.params.like_id);
    res.send(like);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAll = catchAsync(async (req, res) => {
  const methodName = "/fetchAll";
  try {
    const like = await likeService.fetchAll();
    res.send(like);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAllLike = catchAsync(async (req, res) => {
  const methodName = "/fetchAllLike";
  try {
    const like = await likeService.fetchAllLikes(req.params.feed_id);
    res.send(like);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchLike = catchAsync(async (req, res) => {
  const methodName = "/searchLike";
  try {
    const like = await likeService.searchLike(req.body);
    res.send(like);
  } catch (err) {
    console.log("Error occurred in searchLike: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteLikeByUserIdandFeedId = catchAsync(async (req, res) => {
  const methodName = "/deleteLikeByUserIdandFeedId";
  try {
    const like = await likeService.deleteLikeData(
      req.params.user_id,
      req.params.feed_id
    );
    res.send(like);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createLike,
  // deleteLike,
  fetchLike,
  editLike,
  fetchAll,
  fetchAllLike,
  deleteLikeById,
  searchLike,
  deleteLikeByUserIdandFeedId,
  editLikeType,
};
