const catchAsync = require('../utils/catchAsync');
const { cloudinaryMultipleUpload, cloudinaryVideoUpload, documentUpload } = require('../utils/common')
const { deleteImage, deleteVideo } = require('../services/cloudinary.service')
const errorText = 'Error';
const { handleError, ErrorHandler } = require('./../config/error');

const uploadImagesAndVideo = catchAsync(async (req, res) => {
    const methodName = '/uploadImagesAndVideo'
    try {
        let requestBody = req.body
        requestBody["files"] = req.files
        const response = await cloudinaryMultipleUpload(requestBody);
        res.send(response);
    } catch (err) {
        console.log("Error occurred in uploadImagesAndVideo: ", err)
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const uploadFile = catchAsync(async (req, res) => {
    const methodName = '/uploadFile'
    try {
        let requestBody = req.body
        requestBody["files"] = req.files
        const response = await documentUpload(req.files);
        res.send(response);
    } catch (err) {
        console.log("Error occurred in uploadFile: ", err)
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});


const cloudinaryDelete = catchAsync(async (req, res) => {
    const methodName = 'cloudinaryDelete'
    try {
        const response = await deleteImage(req.params.public_id);
        res.send(response);
    } catch (err) {
        console.log("Error occurred in cloudinaryDelete: ", err)
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});


const cloudinaryVideoDelete = catchAsync(async (req, res) => {
    const methodName = 'cloudinaryDelete'
    try {
        const response = await deleteVideo(req.params.public_id);
        res.send(response);
    } catch (err) {
        console.log("Error occurred in cloudinaryDelete: ", err)
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});


module.exports = {
    uploadImagesAndVideo,
    cloudinaryDelete,
    cloudinaryVideoDelete,
    uploadFile
}