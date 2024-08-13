const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const galleryService = require("../services/gallery.service");
const { handleError, ErrorHandler } = require("./../config/error");
const errorText = "Error";

const createGallery = catchAsync(async (req, res) => {
  const methodName = "/createGallery";
  try {
    const gallery = await galleryService.createGallery(req.body);
    res.status(httpStatus.CREATED).send(gallery);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const editGallery = catchAsync(async (req, res) => {
  const methodName = "/editGallery";
  try {
    const gallery = await galleryService.editGallery(req.body);
    res.send(gallery);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchGallery = catchAsync(async (req, res) => {
  const methodName = "/fetchGallery";
  try {
    const gallery = await galleryService.fetchGallery(req.params.gallery_id);
    res.send(gallery);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchGalleryByUserId = catchAsync(async (req, res) => {
  const methodName = "/fetchGalleryByUserId";
  try {
    const gallery = await galleryService.fetchGalleryByUserId(
      req.params.gallery_user_id
    );
    res.send(gallery);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchGalleryByCompanyId = catchAsync(async (req, res) => {
  const methodName = "/fetchGalleryByCompanyId";
  try {
    const gallery = await galleryService.fetchGalleryByCompanyId(
      req.params.gallery_company_id
    );
    res.send(gallery);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAllGallery = catchAsync(async (req, res) => {
  const methodName = "/fetchAllGallery";
  try {
    const gallery = await galleryService.fetchAllGallery();
    res.send(gallery);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteGallery = catchAsync(async (req, res) => {
  const methodName = "/deleteGallery";
  try {
    const gallery = await galleryService.deleteGallery(req.params.gallery_id);
    res.send(gallery);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getGalleryByEventId = catchAsync(async (req, res) => {
  const methodName = "/getGalleryByEventId";
  try {
    const gallery = await galleryService.getGalleryByEventId(
      req.params.gallery_event_id
    );
    res.send(gallery);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createGallery,
  editGallery,
  fetchGallery,
  fetchGalleryByUserId,
  fetchGalleryByCompanyId,
  fetchAllGallery,
  deleteGallery,
  getGalleryByEventId,
};
