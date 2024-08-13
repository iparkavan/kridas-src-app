const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const mediaService = require("../services/media.service");
const { handleError, ErrorHandler } = require("../config/error");
const errorText = "Error";

const createMedia = catchAsync(async (req, res) => {
  const methodName = "/createMedia";
  try {
    let requestBody = req.body;
    const media = await mediaService.createMedia(requestBody);
    res.status(httpStatus.CREATED).send(media);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAll = catchAsync(async (req, res) => {
  const methodName = "/fetchAll";
  try {
    const media = await mediaService.fetchAll();
    res.send(media);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchMedia = catchAsync(async (req, res) => {
  const methodName = "/fetchMedia";
  try {
    const media = await mediaService.fetchMedia(req.params.media_id);
    res.send(media);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const editMedia = catchAsync(async (req, res) => {
  const methodName = "/editMedia";
  try {
    const media = await mediaService.editMedia(req.body);
    res.send(media);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteMedia = catchAsync(async (req, res) => {
  const methodName = "/deleteMedia";
  try {
    const media = await mediaService.deleteMedia(req.params.media_id);
    res.send(media);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchByMediaCreatorUserId = catchAsync(async (req, res) => {
  const methodName = "/fetchByMediaCreatorUserId";
  try {
    const media = await mediaService.fetchByMediaCreatorUserId(req.body);
    res.send(media);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchByMediaCreatorCompanyId = catchAsync(async (req, res) => {
  const methodName = "/fetchByMediaCreatorCompanyId";
  try {
    const media = await mediaService.fetchByMediaCreatorCompanyId(req.body);
    res.send(media);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchMediaByEventId = catchAsync(async (req, res) => {
  const methodName = "/fetchMediaByEventId";
  try {
    const media = await mediaService.fetchMediaByEventId(req.body);
    res.send(media);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchTaggedMediaByUserId = catchAsync(async (req, res) => {
  const methodName = "/fetchTaggedMediaByUserId";
  try {
    const media = await mediaService.fetchTaggedMediaByUserId(req.body);
    res.send(media);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchTaggedMediaByCompanyId = catchAsync(async (req, res) => {
  const methodName = "/fetchTaggedMediaByCompanyId";
  try {
    const media = await mediaService.fetchTaggedMediaByCompanyId(req.body);
    res.send(media);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchTaggedMediaByEventId = catchAsync(async (req, res) => {
  const methodName = "/fetchTaggedMediaByEventId";
  try {
    const media = await mediaService.fetchTaggedMediaByEventId(req.body);
    res.send(media);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchFeedByMedia = catchAsync(async (req, res) => {
  const methodName = "/fetchFeedByMedia";
  try {
    const feedMedia = await mediaService.getFeedByMedia(
      req.params.media_id,
      req.query.id,
      req.query.type
    );
    res.send(feedMedia);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const uploads = catchAsync(async (req, res) => {
  const methodName = "/uploads";
  try {
    let requestBody = req.body;
    requestBody["files"] = req.files;
    const media = await mediaService.mediaUpload(requestBody);
    res.send(media);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createMedia,
  fetchAll,
  fetchMedia,
  editMedia,
  deleteMedia,
  fetchByMediaCreatorUserId,
  fetchByMediaCreatorCompanyId,
  fetchTaggedMediaByUserId,
  fetchTaggedMediaByCompanyId,
  fetchFeedByMedia,
  fetchMediaByEventId,
  uploads,
  fetchTaggedMediaByEventId,
};
