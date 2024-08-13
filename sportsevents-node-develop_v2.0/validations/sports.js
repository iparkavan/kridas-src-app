const { check } = require('express-validator');

exports.sportsCreateValidator = [
    check('sports_name')
        .not()
        .isEmpty()
        .withMessage('sports_name is required'),
        check('sports_format')
        .not()
        .isEmpty()
        .withMessage('sports_format is required')
];

exports.sportsUpdateValidator = [
    check('sports_id')
    .not()
    .isEmpty()
    .withMessage('country_id is required'),
    check('sports_name')
    .not()
    .isEmpty()
    .withMessage('sports_name is required'),
    check('sports_format')
    .not()
    .isEmpty()
    .withMessage('sports_format is required')
];