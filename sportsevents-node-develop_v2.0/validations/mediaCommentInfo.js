const { check } = require('express-validator');

exports.mediaCreateValidator = [
    check('contents')
        .not()
        .isEmpty()
        .withMessage('contents is required'),
    check('media_id')
        .not()
        .isEmpty()
        .withMessage('media_id is required')
];

exports.mediaUpdateCreateValidator = [
    check('comment_id')
        .not()
        .isEmpty()
        .withMessage('comment_id is required'),
    check('contents')
        .not()
        .isEmpty()
        .withMessage('contents is required'),
    check('media_id')
        .not()
        .isEmpty()
        .withMessage('media_id is required')
];

exports.mediaParentCommentSearch = [
    check('parent_comment_id')
        .not()
        .isEmpty()
        .withMessage('parent_comment_id is required'),
    check('media_id')
        .not()
        .isEmpty()
        .withMessage('media_id is required')
];

exports.mediaCommentSearch = [
    check('media_id')
        .not()
        .isEmpty()
        .withMessage('media_id is required')
];
