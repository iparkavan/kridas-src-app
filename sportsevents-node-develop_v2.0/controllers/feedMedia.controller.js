const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const feedMediaService = require('../services/feedMedia.service');
const { handleError, ErrorHandler } = require('./../config/error');
const errorText = 'Error';

const createFeedMedia = catchAsync(async (req, res) => {
    const methodName = '/createFeedMedia'
    try {
        const feedMedia = await feedMediaService.createFeedMedia(req.body);
        res.status(httpStatus.CREATED).send(feedMedia);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const editFeedMedia = catchAsync(async (req, res) => {
    const methodName = '/editFeedMedia'
    try {
        const feedMedia = await feedMediaService.editFeedMedia(req.body);
        res.send(feedMedia);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchFeedMedia = catchAsync(async (req, res) => {
    const methodName = '/fetchFeedMedia'
    try {
        const feedMedia = await feedMediaService.fetchFeedMedia(req.params.feed_media_id);
        res.send(feedMedia);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAllFeedMedia = catchAsync(async (req, res) => {
    const methodName = '/fetchAllFeedMedia'
    try {
        const feedMedia = await feedMediaService.fetchAllFeedMedia();
        res.send(feedMedia);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteFeedMedia = catchAsync(async (req, res) => {
    const methodName = '/deleteFeedMedia'
    try {
        const feedMedia = await feedMediaService.deleteFeedMedia(req.params.feed_media_id);
        res.send(feedMedia);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteFeedMediaByFeedId = catchAsync(async (req, res) => {
    const methodName = '/deleteFeedMediaByFeedId'
    try {
        const feedMedia = await feedMediaService.deleteFeedMediaByFeedId(req.params.feed_id);
        res.send(feedMedia);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

module.exports = {
    createFeedMedia,
    editFeedMedia,
    fetchFeedMedia,
    fetchAllFeedMedia,
    deleteFeedMedia,
    deleteFeedMediaByFeedId
};
