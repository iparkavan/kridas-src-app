const { check } = require('express-validator');

exports.feedMediaCreateValidator = [
    check('media_id')
        .not()
        .isEmpty()
        .withMessage('media_id is required'),
    check('feed_id')
        .not()
        .isEmpty()
        .withMessage('feed_id is required'),
];

exports.feedMediaUpdateValidator = [
    check('feed_media_id')
        .not()
        .isEmpty()
        .withMessage('feed_media_id is required'),
    check('media_id')
        .not()
        .isEmpty()
        .withMessage('media_id is required'),
    check('feed_id')
        .not()
        .isEmpty()
        .withMessage('feed_id is required'),
];
