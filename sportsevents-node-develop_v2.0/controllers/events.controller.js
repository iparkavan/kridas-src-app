const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const eventService = require("../services/events.service");
const { handleError, ErrorHandler } = require("../config/error");
const errorText = "Error";

const createEvent = catchAsync(async (req, res) => {
  const methodName = "/createEvent";
  try {
    let requestBody = req.body;
    requestBody["sports"] =
      req.body?.sports_list !== undefined
        ? JSON.parse(req.body?.sports_list)
        : [];
    requestBody["files"] = req.files;
    const event = await eventService.createEvent(req.body);
    res.status(httpStatus.CREATED).send(event);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const editEvent = catchAsync(async (req, res) => {
  const methodName = "/editEvent";
  try {
    let requestBody = req.body;
    requestBody["sports"] =
      req.body?.sports_list !== undefined
        ? JSON.parse(req.body?.sports_list)
        : [];
    requestBody["files"] = req.files;
    const event = await eventService.editEvent(req.body);
    res.send(event);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchEvent = catchAsync(async (req, res) => {
  const methodName = "/fetchEvent";
  try {
    const event = await eventService.fetchEvent(
      req.params.event_id,
      req.query.user_id
    );
    res.send(event);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const updateIsFeature = catchAsync(async (req, res) => {
  const methodName = "/updateIsFeature";
  try {
    const event = await eventService.updateIsFeature(req.body);
    res.send(event);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteEvent = catchAsync(async (req, res) => {
  const methodName = "/deleteEvent";
  try {
    const event = await eventService.deleteEvent(req.params.event_id);
    res.send(event);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAll = catchAsync(async (req, res) => {
  const methodName = "/fetchAll";
  try {
    const event = await eventService.fetchAll();
    res.send(event);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchEvent = catchAsync(async (req, res) => {
  const methodName = "/searchEvent";
  try {
    const event = await eventService.search(req.body);
    res.send(event);
  } catch (err) {
    console.log("Error occurred in searchEvent: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchCompanyId = catchAsync(async (req, res) => {
  const methodName = "/searchEvent";
  try {
    const event = await eventService.searchCompanyId(req.body);
    res.send(event);
  } catch (err) {
    console.log("Error occurred in searchEvent: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchParticipatedEventByCompanyId = catchAsync(async (req, res) => {
  const methodName = "/searchParticipatedEventByCompanyId";
  try {
    const event = await eventService.getParticipatedEventByCompanyId(req.body);
    res.send(event);
  } catch (err) {
    console.log("Error occurred in searchParticipatedEventByCompanyId: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const customSearch = catchAsync(async (req, res) => {
  const methodName = "/customSearch";
  try {
    const event = await eventService.customSearch(req.body);
    res.send(event);
  } catch (err) {
    console.log("Error occurred in customSearch: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchEventData = catchAsync(async (req, res) => {
  const methodName = "/fetchEventData";
  try {
    const event = await eventService.fetchEventData(req.params.event_id);
    res.send(event);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const publishEvent = catchAsync(async (req, res) => {
  const methodName = "/publishEvent";
  try {
    let requestBody = req.body;
    requestBody["sports"] =
      req.body?.sports_list !== undefined
        ? JSON.parse(req.body?.sports_list)
        : [];
    requestBody["files"] = req.files;
    requestBody["feed"] = JSON.parse(req.body.feed);
    requestBody["socket_request"] = req.socket_request;
    const event = await eventService.eventPublish(req.body);
    res.send(event);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchByIsFeature = catchAsync(async (req, res) => {
  const methodName = "/fetchEventData";
  try {
    const event = await eventService.searchByIsFeature(req.body);
    res.send(event);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchAllEvents = catchAsync(async (req, res) => {
  const methodName = "/searchAllEvents";
  try {
    const event = await eventService.searchEvent(req.body);
    res.send(event);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createEvent,
  fetchEvent,
  editEvent,
  deleteEvent,
  fetchAll,
  searchEvent,
  searchCompanyId,
  fetchEventData,
  customSearch,
  publishEvent,
  searchByIsFeature,
  searchParticipatedEventByCompanyId,
  updateIsFeature,
  searchAllEvents,
};
