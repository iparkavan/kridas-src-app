const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const mediaCommentInfoService = require("../services/mediaCommentInfo.service");
const { handleError, ErrorHandler } = require('../config/error');
const errorText = 'Error';


const createMediaCommentInfo = catchAsync(async (req, res) => {
    const methodName = '/createMediaCommentInfo'
    try {
        const mediaCommentInfo = await mediaCommentInfoService.createMediaCommentInfo(req.body);
        res.status(httpStatus.CREATED).send(mediaCommentInfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAll = catchAsync(async (req, res) => {
    const methodName = '/fetchAll'
    try {
        const mediaCommentInfo = await mediaCommentInfoService.fetchAll();
        res.send(mediaCommentInfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchByCommentId = catchAsync(async (req, res) => {
    const methodName = '/fetchByCommentId'
    try {
        const mediaCommentInfo = await mediaCommentInfoService.fetchByCommentId(req.params.comment_id);
        res.send(mediaCommentInfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const editMediaCommentInfo = catchAsync(async (req, res) => {
    const methodName = '/editMediaCommentInfo'
    try {
        const mediaCommentInfo = await mediaCommentInfoService.editMediaCommentInfo(req.body);
        res.send(mediaCommentInfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteById = catchAsync(async (req, res) => {
    const methodName = '/deleteById'
    try {
        const mediaCommentInfo = await mediaCommentInfoService.deleteById(req.params.comment_id);
        res.send(mediaCommentInfo);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const searchComment = catchAsync(async (req, res) => {
    const methodName = '/searchComment'
    try {
        const mediaCommentInfo = await mediaCommentInfoService.searchComment(req.body);
        res.send(mediaCommentInfo);
    } catch (err) {
        console.log("Error occurred in mediaCommentInfo: ", err)
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }

});

const searchParentComment = catchAsync(async (req, res) => {
    const methodName = '/searchParentComment'
    try {
        const mediaCommentInfo = await mediaCommentInfoService.searchChildComment(req.body);
        res.send(mediaCommentInfo);
    } catch (err) {
        console.log("Error occurred in mediaCommentInfo: ", err)
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }

});




module.exports = {
    createMediaCommentInfo,
    fetchAll,
    fetchByCommentId,
    editMediaCommentInfo,
    deleteById,
    searchComment,
    searchParentComment
};
