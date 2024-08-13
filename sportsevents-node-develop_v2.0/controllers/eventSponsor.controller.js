const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const eventSponsorService = require("../services/eventSponsor.service");
const { handleError, ErrorHandler } = require("./../config/error");
const errorText = "Error";

const createEventSponsor = catchAsync(async (req, res) => {
  const methodName = "/createEventSponsor";
  try {
    const eventSponsor = await eventSponsorService.createEventSponsor(req.body);
    res.status(httpStatus.CREATED).send(eventSponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const updateEventSponsor = catchAsync(async (req, res) => {
  const methodName = "/updateEventSponsor";
  try {
    const eventSponsor = await eventSponsorService.updateEventSponsor(req.body);
    res.send(eventSponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getEventSponsor = catchAsync(async (req, res) => {
  const methodName = "/getEventSponsor";
  try {
    const eventSponsor = await eventSponsorService.getById(
      req.params.event_sponsor_id
    );
    res.send(eventSponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getByEventId = catchAsync(async (req, res) => {
  const methodName = "/getByEventId";
  try {
    const eventSponsor = await eventSponsorService.getByEventId(
      req.params.event_id
    );
    res.send(eventSponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getAllEventSponsor = catchAsync(async (req, res) => {
  const methodName = "/getAllEventSponsor";
  try {
    const eventSponsor = await eventSponsorService.getAll();
    res.send(eventSponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteEventSponsor = catchAsync(async (req, res) => {
  const methodName = "/deleteEventSponsor";
  try {
    const eventSponsor = await eventSponsorService.deleteById(
      req.params.event_sponsor_id
    );
    res.send(eventSponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  getByEventId,
  createEventSponsor,
  updateEventSponsor,
  getEventSponsor,
  getAllEventSponsor,
  deleteEventSponsor,
};
