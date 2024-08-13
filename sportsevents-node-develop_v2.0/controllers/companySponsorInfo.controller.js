const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const companySponsorInfoService = require('../services/companySponsorInfo.service')
const { handleError, ErrorHandler } = require('../config/error');
const errorText = 'Error';


const create = catchAsync(async (req, res) => {
    const methodName = '/createCompanySponsorInfo'
    try {
        const companySponsorInfo = await companySponsorInfoService.createCompanySponsorInfo(req.body);
        res.status(httpStatus.CREATED).send(companySponsorInfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAll = catchAsync(async (req, res) => {
    const methodName = '/fetchAll'
    try {
        const companySponsorInfo = await companySponsorInfoService.fetchAll();
        res.send(companySponsorInfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const getById = catchAsync(async (req, res) => {
    const methodName = '/getById'
    try {
        const companySponsorInfo = await companySponsorInfoService.fetchCompanySponsorInfo(req.params.id);
        res.send(companySponsorInfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const edit = catchAsync(async (req, res) => {
    const methodName = '/editCompanySponsorInfo'
    try {
        const companySponsorInfo = await companySponsorInfoService.editCompanySponsorInfo(req.body);
        res.send(companySponsorInfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteById = catchAsync(async (req, res) => {
    const methodName = '/deleteById'
    try {
        const companySponsorInfo = await companySponsorInfoService.deleteCompanySponsorInfo(req.params.id);
        res.send(companySponsorInfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const getByCompanyId = catchAsync(async (req, res) => {
    const methodName = '/getById'
    try {
        const companySponsorInfo = await companySponsorInfoService.getByCompanyId(req.params.company_id);
        res.send(companySponsorInfo);
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
    getByCompanyId
};