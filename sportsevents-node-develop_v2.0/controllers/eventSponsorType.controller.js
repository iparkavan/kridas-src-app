const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const eventSponsorTypeService = require("../services/eventSponsorType.service");
const { handleError, ErrorHandler } = require("../config/error");
const errorText = "Error";

const create = catchAsync(async (req, res) => {
  const methodName = "/createEventSponsorType";
  try {
    const eventSponsorType =
      await eventSponsorTypeService.createEventSponsorType(req.body);
    res.status(httpStatus.CREATED).send(eventSponsorType);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAll = catchAsync(async (req, res) => {
  const methodName = "/fetchAll";
  try {
    const eventSponsorType = await eventSponsorTypeService.fetchAll();
    res.send(eventSponsorType);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getById = catchAsync(async (req, res) => {
  const methodName = "/getById";
  try {
    const eventSponsorType =
      await eventSponsorTypeService.fetchEventSponsorType(
        req.params.event_sponsor_type_id
      );
    res.send(eventSponsorType);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const edit = catchAsync(async (req, res) => {
  const methodName = "/editeventSponsorType";
  try {
    const eventSponsorType = await eventSponsorTypeService.editEventSponsorType(
      req.body
    );
    res.send(eventSponsorType);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteById = catchAsync(async (req, res) => {
  const methodName = "/deleteById";
  try {
    const eventSponsorType =
      await eventSponsorTypeService.deleteEventSponsorType(
        req.params.event_sponsor_type_id
      );
    res.send(eventSponsorType);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  fetchAll,
  getById,
  create,
  edit,
  deleteById,
};
