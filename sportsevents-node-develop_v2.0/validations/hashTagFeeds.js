const { check } = require('express-validator');

exports.hashTagFeedsCreateValidator = [
    check('feed_id')
        .not()
        .isEmpty()
        .withMessage('feed_id  is required'),
    check('hashtag_id')
        .not()
        .isEmpty()
        .withMessage('hashtag_id is required'),
];

exports.hashTagFeedsUpdateValidator = [
    check('hashtag_feeds_id')
        .not()
        .isEmpty()
        .withMessage('hashtag_feeds_id  is required'),
    check('feed_id')
        .not()
        .isEmpty()
        .withMessage('feed_id  is required'),
    check('hashtag_id')
        .not()
        .isEmpty()
        .withMessage('hashtag_id is required'),
];
