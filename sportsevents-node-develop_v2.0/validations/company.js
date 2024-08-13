const { check } = require('express-validator');

exports.companyCreateValidator = [
    check('company_name')
        .not()
        .isEmpty()
        .withMessage('company_name is required'),
    check('user_id')
        .not()
        .isEmpty()
        .withMessage('user_id is required')
];

exports.companyUpdateValidator = [
    check('company_id')
        .not()
        .isEmpty()
        .withMessage('company_id  is required'),
    check('company_name')
        .not()
        .isEmpty()
        .withMessage('company_name is required'),
];

exports.companyProfileCreateValidator = [
    check('company_id')
        .not()
        .isEmpty()
        .withMessage('company_id is required'),
];
