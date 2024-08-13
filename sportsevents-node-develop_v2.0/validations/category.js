const { check } = require('express-validator');

exports.categoryCreateValidator = [
    check('category_name')
        .not()
        .isEmpty()
        .withMessage('category_name is required'),
        check('category_type')
        .not()
        .isEmpty()
        .withMessage('category_type is required'),
        check('category_desc')
        .not()
        .isEmpty()
        .withMessage('category_desc is required')
];

exports.categoryUpdateValidator = [
    check('category_id')
    .not()
    .isEmpty()
    .withMessage('category_id is required'),
    check('category_name')
    .not()
    .isEmpty()
    .withMessage('category_name is required'),
    check('category_type')
    .not()
    .isEmpty()
    .withMessage('category_type is required'),
    check('category_desc')
    .not()
    .isEmpty()
    .withMessage('category_desc is required')
];