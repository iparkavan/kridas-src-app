const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const companyStatisticsService = require('../services/companyStatistics.service');
const { handleError, ErrorHandler } = require('../config/error');

const errorText='Error';

const createCompanyStatistics = catchAsync(async (req, res) => {
    const methodName='/createCompanyStatistics'
    try {
        // let requestBody = JSON.parse(req.body.obj);
        // let requestObj={obj:requestBody,
        //     files: req.files
        // }
        let requestBody = req.body;
        requestBody['files'] = req.files;
        const companyStatistics = await companyStatisticsService.createCompanyStatistics(requestBody);
        res.status(httpStatus.CREATED).send(companyStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const editCompanyStatistics = catchAsync(async (req, res) => {
    const methodName='/editUserStatistics'
    try {
        // let requestBody = JSON.parse(req.body.obj);
        // let requestObj={obj:requestBody,
        //     files: req.files
        // }
        let requestBody = req.body;
        requestBody['files'] = req.files;
        const companyStatistics = await companyStatisticsService.editCompanyStatistics(requestBody);
        res.send(companyStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchCompanyStatistics = catchAsync(async (req, res) => {
    const methodName='/fetchCompanyStatistics'
    try {
        const companyStatistics = await companyStatisticsService.fetchCompanyStatistics(req.params.id);
        res.send(companyStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAll = catchAsync(async (req, res) => {
    const methodName='/fetchAll'
    try {
        const companyStatistics = await companyStatisticsService.fetchAll();
        res.send(companyStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteCompanyStatistics = catchAsync(async (req, res) => {
    const methodName='/deleteCompanyStatistics'
    try {
        const companyStatistics = await companyStatisticsService.deleteCompanyStatistics(req.params.id);
        res.send(companyStatistics);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchCompanyById = catchAsync(async (req, res) => {
    const methodName='/fetchCompanyById'
    try {
        const company = await companyStatisticsService.fetchCompanyById(req.params.id);
        res.send(company);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

module.exports = {
    createCompanyStatistics,
    fetchCompanyStatistics,
    fetchAll,
    deleteCompanyStatistics,
    editCompanyStatistics,
    fetchCompanyById
};