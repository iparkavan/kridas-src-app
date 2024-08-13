const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const sponsorService = require("../services/sponsor.service");
const { handleError, ErrorHandler } = require("./../config/error");
const errorText = "Error";

const createSponsor = catchAsync(async (req, res) => {
  const methodName = "/createSponsor";
  try {
    let requestBody = req.body;
    requestBody["files"] = req.files;
    const Sponsor = await sponsorService.createSponsorInfo(requestBody);
    res.status(httpStatus.CREATED).send(Sponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const createSponsorforEvent = catchAsync(async (req, res) => {
  const methodName = "/createSponsorforEvent";
  try {
    let requestBody = req.body;
    requestBody["files"] = req.files;
    const Sponsor = await sponsorService.createSponsorInfoForEvent(requestBody);
    res.status(httpStatus.CREATED).send(Sponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const updateSponsor = catchAsync(async (req, res) => {
  const methodName = "/updateSponsor";
  try {
    let requestBody = req.body;
    requestBody["files"] = req.files;
    const Sponsor = await sponsorService.editSponsorInfo(requestBody);
    res.send(Sponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const updateSponsorforEvent = catchAsync(async (req, res) => {
  const methodName = "/updateSponsorforEvent";
  try {
    let requestBody = req.body;
    requestBody["files"] = req.files;
    const Sponsor = await sponsorService.editSponsorInfoForEvent(requestBody);
    res.send(Sponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const saveSponsor = catchAsync(async (req, res) => {
  const methodName = "/saveSponsor";
  try {
    let requestBody = req.body;
    const Sponsor = await sponsorService.saveSponsor(requestBody);
    res.status(httpStatus.CREATED).send(Sponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const saveSponsorforEvent = catchAsync(async (req, res) => {
  const methodName = "/saveSponsorforEvent";
  try {
    let requestBody = req.body;
    const Sponsor = await sponsorService.saveSponsorforEvent(requestBody);
    res.status(httpStatus.CREATED).send(Sponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getById = catchAsync(async (req, res) => {
  const methodName = "/getById";
  try {
    const Sponsor = await sponsorService.getById(req.params.sponsor_id);
    res.send(Sponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getAll = catchAsync(async (req, res) => {
  const methodName = "/getAll";
  try {
    const Sponsor = await sponsorService.getAll();
    res.send(Sponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteSponsor = catchAsync(async (req, res) => {
  const methodName = "/deleteSponsor";
  try {
    const Sponsor = await sponsorService.deleteById(req.params.sponsor_id);
    res.send(Sponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteForEventSponsor = catchAsync(async (req, res) => {
  const methodName = "/deleteForEventSponsor";
  try {
    const Sponsor = await sponsorService.deleteForEventSponsor(
      req.params.sponsor_id
    );
    res.send(Sponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createSponsor,
  updateSponsor,
  getById,
  getAll,
  deleteSponsor,
  saveSponsor,
  createSponsorforEvent,
  updateSponsorforEvent,
  saveSponsorforEvent,
  deleteForEventSponsor,
};
