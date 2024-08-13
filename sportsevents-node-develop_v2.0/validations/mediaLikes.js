const { check } = require('express-validator');

exports.mediaLikeCreateValidator = [
    check('media_id')
        .not()
        .isEmpty()
        .withMessage('media_id is required'),
];

exports.mediaLikeUpdateValidator = [
    check('like_id')
        .not()
        .isEmpty()
        .withMessage('like_id is required'),
    check('media_id')
        .not()
        .isEmpty()
        .withMessage('media_id is required'),
];
exports.toalLikeValidator = [
    check('media_id')
        .not()
        .isEmpty()
        .withMessage('media_id is required'),
]