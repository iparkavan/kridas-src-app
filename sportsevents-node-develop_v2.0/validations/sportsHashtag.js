const { check } = require('express-validator');

exports.sportsHashtagCreateValidator = [
    check('sports_id')
        .not()
        .isEmpty()
        .withMessage('sports_id is required'),
    check('hashtag_title')
        .not()
        .isEmpty()
        .withMessage('hashtag_title is required')
];
