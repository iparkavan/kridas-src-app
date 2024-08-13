const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const sponsorInfoService = require('../services/sponsorInfo.service')
const { handleError, ErrorHandler } = require('../config/error');
const errorText = 'Error';


const create = catchAsync(async (req, res) => {
    const methodName = '/createSponsorInfo'
    try {
        const sponsorinfo = await sponsorInfoService.createSponsorInfo(req.body);
        res.status(httpStatus.CREATED).send(sponsorinfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAll = catchAsync(async (req, res) => {
    const methodName = '/fetchAll'
    try {
        const sponsorinfo = await sponsorInfoService.fetchAll();
        res.send(sponsorinfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const getById = catchAsync(async (req, res) => {
    const methodName = '/getById'
    try {
        const sponsorinfo = await sponsorInfoService.fetchSponsorInfo(req.params.id);
        res.send(sponsorinfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const getByUserId = catchAsync(async (req, res) => {
    const methodName = '/getByUserId'
    try {
        const sponsorinfo = await sponsorInfoService.fetchSponsorInfoByUserId(req.params.user_id);
        res.send(sponsorinfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const edit = catchAsync(async (req, res) => {
    const methodName = '/editSponsorInfo'
    try {
        const sponsorinfo = await sponsorInfoService.editSponsorInfo(req.body);
        res.send(sponsorinfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteById = catchAsync(async (req, res) => {
    const methodName = '/deleteById'
    try {
        const sponsorinfo = await sponsorInfoService.deleteSponsorInfo(req.params.id);
        res.send(sponsorinfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});


module.exports = {
    fetchAll,
    getById,
    getByUserId,
    create,
    edit,
    deleteById
};