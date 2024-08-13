const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const organizerService = require('../services/organizer.service')
const { handleError, ErrorHandler } = require('../config/error');
const errorText = 'Error';

const create = catchAsync(async (req, res) => {
    const methodName = '/createOrganizer'
    try {
        const organizer = await organizerService.createOrganizer(req.body);
        res.status(httpStatus.CREATED).send(organizer);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);

    }
});

// const editOrganizer = catchAsync(async (req, res) => {
//     const methodName = '/editOrganizer'
//     try {
//         const organizer = await organizerService.editOrganizer(req.body);
//         res.send(organizer);
//     } catch (err) {
//         handleError(new ErrorHandler(errorText, methodName, err), res);
//     }
// });

const getById = catchAsync(async (req, res) => {
    const methodName = '/getById'
    try {
        const organizer = await organizerService.fetchOrganizer(req.params.id);
        res.send(organizer);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAll = catchAsync(async (req, res) => {
    const methodName = '/fetchAll'
    try {
        const organizer = await organizerService.fetchAll();
        res.send(organizer);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteById = catchAsync(async (req, res) => {
    const organizer = await organizerService.deleteOrganizer(req.params.id);
    res.send(organizer);
});

module.exports = {
    create,
    getById,
    fetchAll,
    deleteById,
    // editOrganizer
}
