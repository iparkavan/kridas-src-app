const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const feedShareService = require('../services/feedShare.service');
const { handleError, ErrorHandler } = require('./../config/error');
const errorText = 'Error';

const createFeedShare = catchAsync(async (req, res) => {

    const methodName = '/createFeedShare'
    try {
        const feedShare = await feedShareService.createShare(req.body);
        res.status(httpStatus.CREATED).send(feedShare);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAll = catchAsync(async (req, res) => {
    const methodName = '/fetchAll'
    try {
        const feedShare = await feedShareService.fetchAll();
        res.send(feedShare);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteFeedShare = catchAsync(async (req, res) => {
    const methodName = '/deleteFeedShare'
    try {
        const feedShare = await feedShareService.deleteFeedShare(req.params.feed_share_id);
        res.send(feedShare);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }

});
module.exports = {
    createFeedShare,
    fetchAll,
    deleteFeedShare
}