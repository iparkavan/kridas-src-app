const { check } = require("express-validator");

exports.languagesCreateValidator = [
    check('language_code')
        .not()
        .isEmpty()
        .withMessage('language_code is required'),
    check('language_name')
        .not()
        .isEmpty()
        .withMessage('language_name is required'),
    check('created_by')
        .not()
        .isEmpty()
        .withMessage('created_by is required')    
];

exports.languagessUpdateValidator = [
    check('language_id')
    .not()
    .isEmpty()
    .withMessage('language_id is required'),
    check('language_code')
    .not()
    .isEmpty()
    .withMessage('language_code is required'),
    check('language_name')
    .not()
    .isEmpty()
    .withMessage('language_name is required')
];