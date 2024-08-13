const { check } = require('express-validator');

exports.hashtagCreateValidator = [
    check('hashtag_title')
        .not()
        .isEmpty()
        .withMessage('hashtag_title is required'),
];

exports.hashtagUpdateValidator = [
    check('hashtag_id')
        .not()
        .isEmpty()
        .withMessage('hashtag_id is required'),
    check('hashtag_title')
        .not()
        .isEmpty()
        .withMessage('hashtag_title is required'),
];

exports.searchValidator = [
    check('searchkey')
        .not()
        .isEmpty()
        .withMessage('hashtag_title is required')
]