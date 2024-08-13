const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const HashTagFeedsService = require('../services/hashTagFeeds.service');
const { handleError, ErrorHandler } = require('../config/error');
const errorText = 'Error';

const createHashTagFeeds = catchAsync(async (req, res) => {
    const methodName = '/createHashTagFeeds'
    try {
        let requestBody = req.body;
        const HashTagFeeds = await HashTagFeedsService.createHashTagFeeds(requestBody);
        res.status(httpStatus.CREATED).send(HashTagFeeds);
    }
    catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAll = catchAsync(async (req, res) => {
    const methodName = '/fetchAll'
    try {
        const fetchAllHashTag = await HashTagFeedsService.fetchAll();
        res.send(fetchAllHashTag);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchHashTag = catchAsync(async (req, res) => {
    const methodName = '/fetchHashTag'
    try {
        const fetchHashTag = await HashTagFeedsService.fetchHashTag(req.params.hashtag_feeds_id);
        res.send(fetchHashTag);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteHashTagFeeds = catchAsync(async (req, res) => {
    const methodName = '/deleteHashTagFeeds'
    try {
        const hashtag_feeds = await HashTagFeedsService.deleteHashTagFeeds(req.params.hashtag_feeds_id);
        res.send(hashtag_feeds);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const editHashTagFeeds = catchAsync(async (req, res) => {
    const methodName = '/editHashTagFeeds'
    try {
        const hashtag_feeds = await HashTagFeedsService.editHashTagFeeds(req.body);
        res.send(hashtag_feeds);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});


module.exports = {
    createHashTagFeeds,
    fetchAll,
    fetchHashTag,
    deleteHashTagFeeds,
    editHashTagFeeds

}
