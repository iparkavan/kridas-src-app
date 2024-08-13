const { check } = require('express-validator');

exports.commentInfoCreateValidator = [
    check('feed_id')
        .not()
        .isEmpty()
        .withMessage('feed_id is required'),
    check('contents')
        .not()
        .isEmpty()
        .withMessage('contents is required'),
];

exports.commentInfoUpdateValidator = [
    check('feed_id')
        .not()
        .isEmpty()
        .withMessage('feed_id is required'),
    check('comment_id')
        .not()
        .isEmpty()
        .withMessage('comment_id is required'),
    check('contents')
        .not()
        .isEmpty()
        .withMessage('contents is required'),
];