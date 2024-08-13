const { check } = require('express-validator');

exports.likeCreateValidator = [
    check('feed_id')
        .not()
        .isEmpty()
        .withMessage('feed_id is required'),
];

exports.likeUpdateValidator = [
    check('feed_id')
        .not()
        .isEmpty()
        .withMessage('feed_id is required'),
    check('like_id')
        .not()
        .isEmpty()
        .withMessage('like_id is required'),
    check('like_type')
        .not()
        .isEmpty()
        .withMessage('like_type is required'),
];

exports.feedIdValidator = [
    check('feed_id')
        .not()
        .isEmpty()
        .withMessage('feed_id is required'),
]

exports.likeIdValidator = [
    check('user_id')
        .not()
        .isEmpty()
        .withMessage('user_id is required'),
    check('feed_id')
        .not()
        .isEmpty()
        .withMessage('feed_id is required'),
    check('like_type')
        .not()
        .isEmpty()
        .withMessage('like_type is required'),
]