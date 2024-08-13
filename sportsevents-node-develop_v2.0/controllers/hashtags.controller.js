const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const hashtagService = require("../services/hashtags.service");
const { handleError, ErrorHandler } = require('../config/error');
const errorText = 'Error';


const createHashtag = catchAsync(async (req, res) => {
  const methodName = '/createHashtag'
  try {
    const hashtags = await hashtagService.createHashtag(req.body);
    res.status(httpStatus.CREATED).send(hashtags);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAll = catchAsync(async (req, res) => {
  const methodName = '/fetchAll'
  try {
    const hashtags = await hashtagService.fetchAll();
    res.send(hashtags);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchHashtag = catchAsync(async (req, res) => {
  const methodName = '/fetchHashtag'
  try {
    const hashtags = await hashtagService.fetchHashtag(req.params.hashtag_id);
    res.send(hashtags);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchHashTagByTitle = catchAsync(async (req, res) => {
  const methodName = '/fetchHashTagByTitle'
  try {
    const hashtags = await hashtagService.fetchHashTagByTitle(req.params.hashtag_title);
    res.send(hashtags);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});


const editHashtag = catchAsync(async (req, res) => {
  const methodName = '/editHashtag'
  try {
    const hashtags = await hashtagService.editHashtag(req.body);
    res.send(hashtags);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteHashtag = catchAsync(async (req, res) => {
  const methodName = '/deleteHashtag'
  try {
    const hashtags = await hashtagService.deleteHashtag(req.params.hashtag_id);
    res.send(hashtags);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchTitle = catchAsync(async (req, res) => {
  const methodName = '/searchTitle'
  try {
    const hashtags = await hashtagService.getByTitle(req.body);
    res.status(httpStatus.CREATED).send(hashtags);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createHashtag,
  fetchAll,
  fetchHashtag,
  fetchHashTagByTitle,
  editHashtag,
  deleteHashtag,
  searchTitle
};
