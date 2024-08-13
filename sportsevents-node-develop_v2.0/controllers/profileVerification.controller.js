const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const profileVerificationService = require('../services/profileVerification.service');
const { handleError, ErrorHandler } = require('../config/error');

const errorText = 'Error';

const createProfileVerification = catchAsync(async (req, res) => {
    const methodName = '/createProfileVerification'
    try {
        let requestBody = req.body;
        requestBody['files'] = req.files;
        const userStatistics = await profileVerificationService.createProfileVerification(requestBody);
        res.status(httpStatus.CREATED).send(userStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const editProfileVerification = catchAsync(async (req, res) => {
    const methodName = '/editProfileVerification'
    try {
        let requestBody = req.body;
        const userStatistics = await profileVerificationService.editProfileVerification(requestBody);
        res.send(userStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchProfileVerification = catchAsync(async (req, res) => {
    const methodName = '/fetchProfileVerification'
    try {
        const userStatistics = await profileVerificationService.fetchProfileVerification(req.params.id);
        res.send(userStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchProfileVerificationBasedOnId = catchAsync(async (req, res) => {
    const methodName='/fetchProfileVerificationBasedOnId'
    try {
        const userStatistics = await profileVerificationService.fetchProfileVerificationBasedOnId(req.params.id,req.params.type);
        res.send(userStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAll = catchAsync(async (req, res) => {
    const methodName = '/fetchAll'
    try {
        const userStatistics = await profileVerificationService.fetchAll();
        res.send(userStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteProfileVerification = catchAsync(async (req, res) => {
    const methodName = '/deleteProfileVerification'
    try {
        const userStatistics = await profileVerificationService.deleteProfileVerification(req.params.id);
        res.send(userStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchByUserId = catchAsync(async (req, res) => {
    const methodName = '/fetchByUserId'
    try {
        const profileVerification = await profileVerificationService.fetchByUserId(req.params.user_id, req.params.applied_status);
        res.send(profileVerification);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

module.exports = {
    createProfileVerification,
    fetchProfileVerification,
    deleteProfileVerification,
    fetchAll,
    editProfileVerification,
    fetchByUserId,
    fetchProfileVerificationBasedOnId
}