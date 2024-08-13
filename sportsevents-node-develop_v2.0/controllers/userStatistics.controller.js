const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userStatisticsService = require('../services/userStatistics.service');
const { handleError, ErrorHandler } = require('./../config/error');
const errorText = 'Error';

const addMultipleUserStatistics = catchAsync(async (req, res) => {
    const methodName = '/addMultipleUserStatistics'
    try {
        let requestBody = req.body;
        requestBody["files"] = req.files
        const userStatistics = await userStatisticsService.addMultipleUserStatistics(requestBody);
        res.status(httpStatus.CREATED).send(userStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const createUserStatistics = catchAsync(async (req, res) => {
    const methodName = '/createUserStatistics'
    try {
        let requestBody = req.body;
        requestBody['files'] = req.files;
        const userStatistics = await userStatisticsService.createUserStatistics(requestBody);
        res.status(httpStatus.CREATED).send(userStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const editUserStatistics = catchAsync(async (req, res) => {
    const methodName = '/editUserStatistics'
    try {
        let requestBody = req.body;
        requestBody['files'] = req.files;
        const userStatistics = await userStatisticsService.editUserStatisticsInfo(requestBody);
        res.send(userStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchUserStatistics = catchAsync(async (req, res) => {
    const methodName = '/fetchUserStatistics'
    try {
        const userStatistics = await userStatisticsService.fetchUserStatistics(req.params.id);
        res.send(userStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAll = catchAsync(async (req, res) => {
    const methodName = '/fetchAll'
    try {
        const userStatistics = await userStatisticsService.fetchAll();
        res.send(userStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteUserStatistics = catchAsync(async (req, res) => {
    const methodName = '/deleteUserStatistics'
    try {
        const userStatistics = await userStatisticsService.deleteUserStatistics(req.params.id, req.params.type);
        res.send(userStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchUserId = catchAsync(async (req, res) => {
    const methodName = '/fetchUserStatisticsByUserId'
    try {
        const userStatistics = await userStatisticsService.fetchUserId(req.params.user_id);
        res.send(userStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const createSportsCareers = catchAsync(async (req, res) => {
    const methodName = '/createSportsCareers'
    try {
        const userStatistics = await userStatisticsService.createSportsCareers(req.body);
        res.status(httpStatus.CREATED).send(userStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const createSportsCareer = catchAsync(async (req, res) => {
    const methodName = '/createSportsCareer'
    try {
        const userStatistics = await userStatisticsService.createSportsCareer(req.body);
        res.status(httpStatus.CREATED).send(userStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

module.exports = {
    createUserStatistics,
    fetchUserStatistics,
    deleteUserStatistics,
    fetchAll,
    editUserStatistics,
    fetchUserId,
    createSportsCareers,
    createSportsCareer,
    addMultipleUserStatistics
};
