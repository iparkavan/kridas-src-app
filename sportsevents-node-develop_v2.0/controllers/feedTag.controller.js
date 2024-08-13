const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const feedTagService = require('../services/feedTag.service')
const { handleError, ErrorHandler } = require('./../config/error');
const errorText = 'Error';

const createFeedTag = catchAsync(async (req, res) => {
    const methodName = '/createFeedTag'
    try {
        const companyUser = await feedTagService.createFeedTag(req.body);
        res.status(httpStatus.CREATED).send(companyUser);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const editFeedTag = catchAsync(async (req, res) => {
    const methodName = '/editFeedTag'
    try {
        const user = await feedTagService.editFeedTag(req.body);
        res.send(user);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchFeedTag = catchAsync(async (req, res) => {
    const methodName = '/fetchFeedTag'
    try {
        const companyUser = await feedTagService.fetchFeedTag(req.params.feed_tag_id);
        res.send(companyUser);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteFeedTag = catchAsync(async (req, res) => {
    const methodName = '/deleteFeedTag'
    try {
        const companyUser = await feedTagService.deleteFeedTag(req.params.feed_tag_id);
        res.send(companyUser);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAll = catchAsync(async (req, res) => {
    const methodName = '/fetchAll'
    try {
        const companyUser = await feedTagService.fetchAll();
        res.send(companyUser);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});
module.exports = {
    createFeedTag,
    fetchFeedTag,
    deleteFeedTag,
    editFeedTag,
    fetchAll

};
