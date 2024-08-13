const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const galleryImageService = require("../services/galleryImage.service");
const { handleError, ErrorHandler } = require("./../config/error");
const errorText = "Error";

const createGalleryImage = catchAsync(async (req, res) => {
  const methodName = "/createGalleryImage";
  try {
    const galleryImage = await galleryImageService.createGalleryImage(req.body);
    res.status(httpStatus.CREATED).send(galleryImage);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const editGalleryImage = catchAsync(async (req, res) => {
  const methodName = "/editGalleryImage";
  try {
    const galleryImage = await galleryImageService.editGalleryImage(req.body);
    res.send(galleryImage);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getGalleryImage = catchAsync(async (req, res) => {
  const methodName = "/getGalleryImage";
  try {
    const galleryImage = await galleryImageService.getGalleryImage(
      req.params.image_id
    );
    res.send(galleryImage);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getAllGalleryImage = catchAsync(async (req, res) => {
  const methodName = "/getAllGalleryImage";
  try {
    const galleryImage = await galleryImageService.getAllGalleryImage();
    res.send(galleryImage);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteGalleryImage = catchAsync(async (req, res) => {
  const methodName = "/deleteGalleryImage";
  try {
    const galleryImage = await galleryImageService.deleteGalleryImage(
      req.params.image_id
    );
    res.send(galleryImage);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createGalleryImage,
  editGalleryImage,
  getGalleryImage,
  getAllGalleryImage,
  deleteGalleryImage,
};
