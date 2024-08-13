const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const sportService = require('../services/sports.service')
const { handleError, ErrorHandler } = require('./../config/error');
const errorText = 'Error';

const createSport = catchAsync(async (req, res) => {
    const methodName = '/createSport'
    try {
        const sport = await sportService.createSport(req.body);
        res.status(httpStatus.CREATED).send(sport);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const editSport = catchAsync(async (req, res) => {
    const methodName = '/editSport'
    try {
        const sport = await sportService.editSport(req.body);
        res.send(sport);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchSport = catchAsync(async (req, res) => {
    const methodName = '/fetchSport'
    try {
        const sport = await sportService.fetchSport(req.params.sports_id);
        res.send(sport);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAllSport = catchAsync(async (req, res) => {
    const methodName = '/fetchAllSport'
    try {
        const sports = await sportService.fetchAllSport();
        res.send(sports);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const getAllSportsByStats = catchAsync(async (req, res) => {
    const methodName = '/getAllSportsByStats'
    try {
        const sports = await sportService.fetchAllSportsByStats();
        res.send(sports);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchSportsByName = catchAsync(async (req, res) => {
    const methodName = '/fetchSportsByName'
    try {
        const sports = await sportService.fetchSportsByName(req.params.sports_name);
        res.send(sports);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const getCompanyNameBySportsId = catchAsync(async (req, res) => {
    const methodName = '/getCompanyNameBySportsId'
    try {
        const sports = await sportService.getCompanyNameBySportsId(req.params.sports_id);
        res.send(sports);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteSport = catchAsync(async (req, res) => {
    const methodName = '/deleteSport'
    try {
        const sport = await sportService.deleteSport(req.params.sports_id);
        res.send(sport);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

module.exports = {
    createSport,
    fetchSport,
    fetchSportsByName,
    editSport,
    deleteSport,
    fetchAllSport,
    getAllSportsByStats,
    getCompanyNameBySportsId
};
