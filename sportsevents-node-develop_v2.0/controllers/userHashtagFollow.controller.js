const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userHashtagFollowService = require('../services/userHashtagFollow.service')
const { handleError, ErrorHandler } = require('../config/error');
const errorText = 'Error';


const create = catchAsync(async (req, res) => {
    const methodName = '/createuserHashtagFollow'
    try {
        const userHashtagFollow = await userHashtagFollowService.createuserHashtagFollow(req.body);
        res.status(httpStatus.CREATED).send(userHashtagFollow);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchByUserId = catchAsync(async (req, res) => {
    const methodName = '/fetchByUserId'
    try {
        const userHashtagFollow = await userHashtagFollowService.getByUserId(req.params.user_id);
        res.send(userHashtagFollow);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});


const deleteById = catchAsync(async (req, res) => {
    const methodName = '/deleteById'
    try {
        const userHashtagFollow = await userHashtagFollowService.deleteById(req.params.user_hashtag_follow_id);
        res.send(userHashtagFollow);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});



module.exports = {
    create,
    fetchByUserId,
    deleteById
};