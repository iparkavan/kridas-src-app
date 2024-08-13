const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const mediaLikeService = require("../services/mediaLikes.service")
const { handleError, ErrorHandler } = require('../config/error');
const errorText = 'Error';


const createMediaLike = catchAsync(async (req, res) => {

    const methodName = '/createMediaLike'
    try {
        const mediaLike = await mediaLikeService.createMediaLike(req.body);
        res.status(httpStatus.CREATED).send(mediaLike);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const editMediaLike = catchAsync(async (req, res) => {
    const methodName = '/editMediaLike'
    try {
        const mediaLike = await mediaLikeService.editMediaLike(req.body);
        res.send(mediaLike);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchMediaLike = catchAsync(async (req, res) => {
    const methodName = '/fetchMediaLike'
    try {
        const mediaLike = await mediaLikeService.fetchMediaLike(req.params.like_id);
        res.send(mediaLike);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteMediaLike = catchAsync(async (req, res) => {
    const methodName = '/deleteMediaLike'
    try {
        const mediaLike = await mediaLikeService.deleteMediaLike(req.params.like_id);
        res.send(mediaLike);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAll = catchAsync(async (req, res) => {
    const methodName = '/fetchAll'
    try {
        const mediaLike = await mediaLikeService.fetchAll();
        res.send(mediaLike);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});
const getLikeByMedia = catchAsync(async (req, res) => {
    const methodName = '/getLikeByMedia'
    try {
        const mediaLike = await mediaLikeService.getLikeByMedia(req.body);
        res.send(mediaLike);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});


module.exports = {
    createMediaLike,
    fetchMediaLike,
    editMediaLike,
    deleteMediaLike,
    fetchAll,
    getLikeByMedia
};
