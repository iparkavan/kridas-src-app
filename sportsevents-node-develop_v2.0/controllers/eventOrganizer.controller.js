const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const eventOrganizerService = require("../services/eventOrganizer.service");
const { handleError, ErrorHandler } = require('../config/error');
const errorText = 'Error';

const createEventOrganizer = catchAsync(async (req, res) => {
    const methodName = '/createEventOrganizer'
    try {
        const eventOrganizer = await eventOrganizerService.createEventOrganizer(req.body);
        res.status(httpStatus.CREATED).send(eventOrganizer);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const editEventOrganizer = catchAsync(async (req, res) => {
    const methodName = '/editEventOrganizer'
    try {
        const eventOrganizer = await eventOrganizerService.editEventOrganizer(req.body);
        res.status(httpStatus.CREATED).send(eventOrganizer);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchEventOrganizer = catchAsync(async (req, res) => {
    const methodName = '/fetchEventOrganizer'
    try {
        const eventOrganizer = await eventOrganizerService.fetchById(req.params.event_organizer_id);
        res.send(eventOrganizer);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAll = catchAsync(async (req, res) => {
    const methodName = '/fetchAll'
    try {
        const eventOrganizer = await eventOrganizerService.fetchAll();
        res.send(eventOrganizer);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteEventOrganizer = catchAsync(async (req, res) => {
    const methodName = '/deleteEventOrganizer'
    try {
        const eventOrganizer = await eventOrganizerService.deleteEventOrganizer(req.params.event_organizer_id);
        res.send(eventOrganizer);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});


module.exports = {
    createEventOrganizer,
    editEventOrganizer,
    fetchEventOrganizer,
    fetchAll,
    deleteEventOrganizer

};