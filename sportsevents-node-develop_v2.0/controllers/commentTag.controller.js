const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const commentTagService = require("../services/commentTag.service");
const { handleError, ErrorHandler } = require("./../config/error");
const errorText = "Error";

const createCommentTag = catchAsync(async (req, res) => {
  const methodName = "/createCommentTag";
  try {
    const commentTag = await commentTagService.createCommentTag(req.body);
    res.status(httpStatus.CREATED).send(commentTag);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const editCommentTag = catchAsync(async (req, res) => {
  const methodName = "/editCommentTag";
  try {
    const commentTag = await commentTagService.editCommentTag(req.body);
    res.send(commentTag);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchCommentTag = catchAsync(async (req, res) => {
  const methodName = "/fetchCommentTag";
  try {
    const commentTag = await commentTagService.fetchCommentTag(
      req.params.comment_tag_id
    );
    res.send(commentTag);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteCommentTag = catchAsync(async (req, res) => {
  const methodName = "/deleteCommentTag";
  try {
    const commentTag = await commentTagService.deleteCommentTag(
      req.params.comment_tag_id
    );
    res.send(commentTag);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAll = catchAsync(async (req, res) => {
  const methodName = "/fetchAll";
  try {
    const commentTag = await commentTagService.fetchAll();
    res.send(commentTag);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createCommentTag,
  deleteCommentTag,
  fetchCommentTag,
  editCommentTag,
  fetchAll,
};
