const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const sportsHashtagService = require('../services/sportsHashtag.service')
const { handleError, ErrorHandler } = require('./../config/error');
const errorText = 'Error';

const createSportHashtag = catchAsync(async (req, res) => {
    const methodName = '/createSportHashtag'
    try {
        const sportHashtag = await sportsHashtagService.createSportHashtag(req.body);
        res.status(httpStatus.CREATED).send(sportHashtag);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchSportHashtag = catchAsync(async (req, res) => {
    const methodName = '/fetchSportHashtag'
    try {
        const sportHashtag = await sportsHashtagService.fetchSportHashtag(req.params.sports_hashtag_id);
        res.send(sportHashtag);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchSportsHashtagbySportsId = catchAsync(async (req, res) => {
    const methodName = '/fetchSportsHashtagbySportsId'
    try {
        const sportHashtag = await sportsHashtagService.fetchBySportId(req.params.sports_id);
        res.send(sportHashtag);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchSportsHashtagbyHashtagId = catchAsync(async (req, res) => {
    const methodName = '/fetchSportsHashtagbyHashtagId'
    try {
        const sportHashtag = await sportsHashtagService.fetchByHashtagId(req.params.hashtag_id);
        res.send(sportHashtag);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAllSportHashtag = catchAsync(async (req, res) => {
    const methodName = '/fetchAllSportHashtag'
    try {
        const sportHashtag = await sportsHashtagService.fetchAllSportHashtag();
        res.send(sportHashtag);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteSportHashtag = catchAsync(async (req, res) => {
    const methodName = '/deleteSportHashtag'
    try {
        const sportHashtag = await sportsHashtagService.deleteSportHashtag(req.params.sports_hashtag_id);
        res.send(sportHashtag);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

module.exports = {
    createSportHashtag,
    fetchSportHashtag,
    fetchSportsHashtagbySportsId,
    fetchSportsHashtagbyHashtagId,
    deleteSportHashtag,
    fetchAllSportHashtag
};
