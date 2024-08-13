const { check } = require('express-validator');

exports.feedTagCreateValidator = [
    check('feed_id')
        .not()
        .isEmpty()
        .withMessage('feed_id is required'),
];

exports.feedTagUpdateValidator = [
    check('feed_id')
        .not()
        .isEmpty()
        .withMessage('feed_id is required'),
    check('feed_tag_id')
        .not()
        .isEmpty()
        .withMessage('feed_tag_id is required'),
];