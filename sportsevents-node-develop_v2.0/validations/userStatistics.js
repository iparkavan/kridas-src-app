const { check } = require('express-validator');

exports.userStatisticsCreateValidator = [
    check('user_id')
        .not()
        .isEmpty()
        .withMessage('user id is required'),
    check('sports_id')
    .not()
    .isEmpty()
    .withMessage('sports id is required'),
    check('skill_level')
    .not()
    .isEmpty()
    .withMessage('skill level is required')
];

exports.userStatisticsUpdateValidator = [
    check('user_statistics_id')
    .not()
    .isEmpty()
    .withMessage('user_statistics_id is required'),
    check('user_id')
        .not()
        .isEmpty()
        .withMessage('user Id is required'),
        check('sports_id')
        .not()
        .isEmpty()
        .withMessage('sports id is required'),
        check('skill_level')
        .not()
        .isEmpty()
        .withMessage('skill level is required')
];