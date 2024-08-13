const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const eventMasterService = require("../services/eventMaster.service");
const { handleError, ErrorHandler } = require('../config/error');
const errorText = 'Error';

const createEventMaster = catchAsync(async (req, res) => {
    const methodName = '/createEventMaster'
    try {
        const eventMaster = await eventMasterService.createEventMaster(req.body);
        res.status(httpStatus.CREATED).send(eventMaster);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});


const fetchEventMaster = catchAsync(async (req, res) => {
    const methodName = '/fetchEventMaster'
    try {
        const eventMaster = await eventMasterService.fetchById(req.params.event_master_id);
        res.send(eventMaster);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAll = catchAsync(async (req, res) => {
    const methodName = '/fetchAll'
    try {
        const eventMaster = await eventMasterService.fetchAll();
        res.send(eventMaster);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const editEventMaster = catchAsync(async (req, res) => {
    const methodName = '/editEventMaster'
    try {
        const eventMaster = await eventMasterService.editEventMaster(req.body);
        res.send(eventMaster);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});


const deleteEventMaster = catchAsync(async (req, res) => {
    const methodName = '/deleteEventMaster'
    try {
        const eventMaster = await eventMasterService.deleteEventMaster(req.params.event_master_id);
        res.send(eventMaster);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});





module.exports = {
    createEventMaster,
    fetchEventMaster,
    fetchAll,
    editEventMaster,
    deleteEventMaster

};