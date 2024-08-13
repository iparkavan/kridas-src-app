const { check } = require('express-validator');

exports.companySponsorInfoCreateValidator = [
    check('category_id')
        .not()
        .isEmpty()
        .withMessage('category_id is required'),
    check('sports_id')
        .not()
        .isEmpty()
        .withMessage('sports_id is required'),
];

exports.companySponsorInfoUpdateValidator = [
    check('company_sponsor_info_id')
        .not()
        .isEmpty()
        .withMessage('sponsor_info_id is required'),
    check('category_id')
        .not()
        .isEmpty()
        .withMessage('category_id is required'),
    check('sports_id')
        .not()
        .isEmpty()
        .withMessage('sports_id is required'),
];