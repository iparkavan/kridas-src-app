const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const galleryMediaService = require('../services/galleryMedia.service')
const { handleError, ErrorHandler } = require('../config/error');
const errorText = 'Error';

const create = catchAsync(async (req, res) => {
    const methodName = '/creategalleryMedia'
    try {
        let requestBody = req.body;
        requestBody['files'] = req.files;
        const galleryMedia = await galleryMediaService.createGalleryMedia(requestBody);
        res.status(httpStatus.CREATED).send(galleryMedia);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAll = catchAsync(async (req, res) => {
    const methodName = '/fetchAll'
    try {
        const galleryMedia = await galleryMediaService.fetchAll();
        res.send(galleryMedia);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const getById = catchAsync(async (req, res) => {
    const methodName = '/getById'
    try {
        const galleryMedia = await galleryMediaService.fetchGalleryMedia(req.params.gallery_media_id);
        res.send(galleryMedia);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteById = catchAsync(async (req, res) => {
    const methodName = '/deleteById'
    try {
        const galleryMedia = await galleryMediaService.deletegallerymedia(req.params.gallery_media_id);
        res.send(galleryMedia);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

module.exports = {
    create,
    fetchAll,
    getById,
    deleteById
};