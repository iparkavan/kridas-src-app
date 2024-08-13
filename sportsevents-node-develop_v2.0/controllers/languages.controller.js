const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const languagesService = require('../services/languages.service')
const { handleError, ErrorHandler } = require('./../config/error');
const errorText = 'Error';

const createLanguage = catchAsync(async (req, res) => {
    const methodName = '/createLanguage'
    try {
        const language = await languagesService.createLanguage(req.body);
        res.status(httpStatus.CREATED).send(language);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const editLanguage = catchAsync(async (req, res) => {
    const methodName = '/editLanguage'
    try {
        const language = await languagesService.editLanguage(req.body);
        res.send(language);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchLanguage = catchAsync(async (req, res) => {
    const methodName = '/fetchLanguage'
    try {
        const language = await languagesService.fetchLanguage(req.params.language_id);
        res.send(language);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAllLanguage = catchAsync(async (req, res) => {
    const methodName = '/fetchAllLanguage'
    try {
        const language = await languagesService.fetchAllLanguage();
        res.send(language);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteLanguage = catchAsync(async (req, res) => {
    const methodName = '/deleteLanguage'
    try {
        const language = await languagesService.deleteLanguage(req.params.language_id);
        res.send(language);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

module.exports = {
    createLanguage,
    editLanguage,
    fetchLanguage,
    deleteLanguage,
    fetchAllLanguage
};
