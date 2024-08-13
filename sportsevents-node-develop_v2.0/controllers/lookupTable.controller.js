const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const lookupTableService = require('../services/lookupTable.service')
const { handleError, ErrorHandler } = require('./../config/error');
const errorText = 'Error';


const createLookupTable = catchAsync(async (req, res) => {
    const methodName = '/createLookupTable'
    try {
        const lookupTable = await lookupTableService.createLookupTable(req.body);
        res.status(httpStatus.CREATED).send(lookupTable);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const editLookupTable = catchAsync(async (req, res) => {
    const methodName = '/editLookupTable'
    try {
        const data = await lookupTableService.editLookupTable(req.body);
        res.send(data);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchLookupTable = catchAsync(async (req, res) => {
    const methodName = '/fetchLookupTable'
    try {
        const lookupTable = await lookupTableService.fetchLookupTable(req.params.key);
        res.send(lookupTable);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});
const fetchLookupKeyAndType = catchAsync(async (req, res) => {
    const methodName = '/fetchLookupKeyAndType'
    try {
        const lookupTable = await lookupTableService.fetchLookupKeyAndType(req.params.key, req.params.type);
        res.send(lookupTable);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchByType = catchAsync(async (req, res) => {
    const methodName = '/fetchByType'
    try {
        const lookupTables = await lookupTableService.fetchByType(req.params.type);
        res.send(lookupTables);;
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

// const fetchByKey = catchAsync(async (req, res) => {
//     const methodName = '/fetchByKey'
//     try {
//         const lookupTables = await lookupTableService.fetchByKey(req.params.key);
//         res.send(lookupTables);;
//     } catch (err) {
//         handleError(new ErrorHandler(errorText, methodName, err), res);
//     }
// });


const deleteLookupTable = catchAsync(async (req, res) => {
    const methodName = '/deleteLookupTable'
    try {
        const lookupTable = await lookupTableService.deleteLookupTable(req.params.key, req.params.type);
        res.send(lookupTable);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

module.exports = {
    createLookupTable,
    editLookupTable,
    fetchLookupTable,
    deleteLookupTable,
    fetchLookupKeyAndType,
    fetchByType,
    // fetchByKey
};
