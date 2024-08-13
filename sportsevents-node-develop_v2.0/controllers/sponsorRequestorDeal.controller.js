const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const sponserRequestorDealService = require ('../services/sponsorRequestorDeal.service')
const { handleError, ErrorHandler } = require('../config/error');
const errorText = 'Error';

const create = catchAsync(async (req, res) => {
    const methodName = '/createSponserRequestorDeal'
    try {
        const sponserRequestorDeal = await sponserRequestorDealService.createSponsorRequestorDeals(req.body);
        res.status(httpStatus.CREATED).send(sponserRequestorDeal);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const editsponserRequestorDeal = catchAsync(async (req, res) => {
    const methodName = '/editSponserRequestorDeal'
    try {
        const sponserRequestorDeal = await sponserRequestorDealService.editSponsorRequestorDeals(req.body);
        res.send(sponserRequestorDeal);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const getById = catchAsync(async (req, res) => {
    const methodName = '/getById'
    try {
        const sponserRequestorDeal = await sponserRequestorDealService.fetchSponsorRequestorDeals(req.params.id);
        res.send(sponserRequestorDeal);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAll = catchAsync(async (req, res) => {
    const methodName = '/fetchAll'
    try {
        const sponserRequestorDeal = await sponserRequestorDealService.fetchAll();
        res.send(sponserRequestorDeal);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteById = catchAsync(async (req, res) => {
    const methodName = '/deleteById'
    try {
        const sponserRequestorDeal = await sponserRequestorDealService.deleteSponsorRequestorDeals(req.params.id);
        res.send(sponserRequestorDeal);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

module.exports = {
    create,
    getById,
    deleteById,
    editsponserRequestorDeal,
    fetchAll
};
