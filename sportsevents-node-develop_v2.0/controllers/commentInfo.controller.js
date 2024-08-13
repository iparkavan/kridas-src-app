const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const commentInfoService = require('../services/commentInfo.service')
const { handleError, ErrorHandler } = require('./../config/error');
const errorText = 'Error';

const createCommentInfo = catchAsync(async (req, res) => {
    const methodName = '/createCommentInfo'
    try {
        const commentInfo = await commentInfoService.createCommentInfo(req.body);
        res.status(httpStatus.CREATED).send(commentInfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const editCommentInfo = catchAsync(async (req, res) => {
    const methodName = '/editCommentInfo'
    try {
        const commentInfo = await commentInfoService.editCommentInfo(req.body);
        res.send(commentInfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchCommentInfo = catchAsync(async (req, res) => {
    const methodName = '/fetchCommentInfo'
    try {
        const commentInfo = await commentInfoService.fetchCommentInfo(req.params.comment_id);
        res.send(commentInfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchByParentCommentId = catchAsync(async (req, res) => {
    const methodName = '/fetchByParentCommentId'
    try {
        const commentInfo = await commentInfoService.fetchByParentCommentId(req.body);
        res.send(commentInfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteCommentInfo = catchAsync(async (req, res) => {
    const methodName = '/deleteCommentInfo'
    try {
        const commentInfo = await commentInfoService.deleteCommentInfo(req.params.comment_id);
        res.send(commentInfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAll = catchAsync(async (req, res) => {
    const methodName = '/fetchAll'
    try {
        const commentInfo = await commentInfoService.fetchAll();
        res.send(commentInfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const getCommentInfoByFeed = catchAsync(async (req, res) => {
    const methodName = '/getCommentInfoByFeed'
    try {
        const comment_info = await commentInfoService.fetchCommentInfoByFeedId(req.params.feed_id);
        res.send(comment_info);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const getByFeed = catchAsync(async (req, res) => {
    const methodName = '/getCommentInfoByFeed'
    try {
        const comment_info = await commentInfoService.fetchByFeedId(req.body);
        res.send(comment_info);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

module.exports = {
    createCommentInfo,
    deleteCommentInfo,
    fetchCommentInfo,
    fetchByParentCommentId,
    editCommentInfo,
    fetchAll,
    getCommentInfoByFeed,
    getByFeed

};
