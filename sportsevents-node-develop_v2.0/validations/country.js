const { check } = require('express-validator');

exports.countryCreateValidator = [
    check('country_code')
        .not()
        .isEmpty()
        .withMessage('country_code is required'),
        check('country_name')
        .not()
        .isEmpty()
        .withMessage('country_name is required'),
        check('country_currency')
        .not()
        .isEmpty()
        .withMessage('country_currency is required')
];

exports.countryUpdateValidator = [
    check('country_id')
    .not()
    .isEmpty()
    .withMessage('country_id is required'),
    check('country_code')
    .not()
    .isEmpty()
    .withMessage('country_code is required'),
    check('country_name')
    .not()
    .isEmpty()
    .withMessage('country_name is required'),
    check('country_currency')
    .not()
    .isEmpty()
    .withMessage('country_currency is required')
];