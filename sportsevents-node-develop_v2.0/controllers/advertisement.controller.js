const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const advertisementService = require("../services/advertisement.service");
const { handleError, ErrorHandler } = require("./../config/error");
const errorText = "Error";

const createAdvertisement = catchAsync(async (req, res) => {
  const methodName = "/createAdvertisement";
  try {
    let requestBody = req.body;
    requestBody["files"] = req.files;
    const advertisement = await advertisementService.createAdvertisement(
      requestBody
    );
    res.status(httpStatus.CREATED).send(advertisement);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const updateAdvertisement = catchAsync(async (req, res) => {
  const methodName = "/updateAdvertisement";
  try {
    let requestBody = req.body;
    requestBody["files"] = req.files;
    const advertisement = await advertisementService.updateAdvertisement(
      requestBody
    );
    res.send(advertisement);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getById = catchAsync(async (req, res) => {
  const methodName = "/getById";
  try {
    const advertisement = await advertisementService.getById(
      req.params.advertisement_id
    );
    res.send(advertisement);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getAllAdvertisement = catchAsync(async (req, res) => {
  const methodName = "/getAllAdvertisement";
  try {
    const advertisement = await advertisementService.getAll();
    res.send(advertisement);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteAdvertisement = catchAsync(async (req, res) => {
  const methodName = "/deleteAdvertisement";
  try {
    const advertisement = await advertisementService.deleteById(
      req.params.advertisement_id
    );
    res.send(advertisement);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createAdvertisement,
  updateAdvertisement,
  getById,
  getAllAdvertisement,
  deleteAdvertisement,
};
