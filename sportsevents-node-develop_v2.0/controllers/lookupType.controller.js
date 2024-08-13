const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const lookupTypeService = require('../services/lookupType.service')
const { handleError, ErrorHandler } = require('./../config/error');
const errorText = 'Error';

const insertLookupType = catchAsync(async (req, res) => {
	const methodName = '/insertLookupType'
	try {
		const lookupType = await lookupTypeService.insertLookupType(req.body);
		res.send(lookupType);
	} catch (err) {
		handleError(new ErrorHandler(errorText, methodName, err), res);
	}
});

const editLookupType = catchAsync(async (req, res) => {
	const methodName = '/editLookupType'
	try {
		const data = await lookupTypeService.editLookupType(req.body);
		res.send(data);
	} catch (err) {
		handleError(new ErrorHandler(errorText, methodName, err), res);
	}
});

const fetchLookupType = catchAsync(async (req, res) => {
	const methodName = '/fetchLookupType'
	try {
		const lookupType = await lookupTypeService.fetchLookupType(req.params.type);
		res.send(lookupType);
	} catch (err) {
		handleError(new ErrorHandler(errorText, methodName, err), res);
	}
});

const deleteLookupType = catchAsync(async (req, res) => {
	const methodName = '/deleteLookupType'
	try {
		const lookupType = await lookupTypeService.deleteLookupType(req.params.type);
		res.send(lookupType);
	} catch (err) {
		handleError(new ErrorHandler(errorText, methodName, err), res);
	}
});
const fetchAll = catchAsync(async (req, res) => {
	const methodName = '/fetchAll'
	try {
		const lookupTypes = await lookupTypeService.fetchAll();
		res.send(lookupTypes);
	} catch (err) {
		handleError(new ErrorHandler(errorText, methodName, err), res);
	}
});

module.exports = {
	insertLookupType,
	editLookupType,
	fetchLookupType,
	deleteLookupType,
	fetchAll
};
