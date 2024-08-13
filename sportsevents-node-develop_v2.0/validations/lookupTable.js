const { check } = require('express-validator');

exports.lookupTableCreateValidator = [
    check('lookup_key')
        .not()
        .isEmpty()
        .withMessage('lookupKey is required')
];

exports.lookupTableUpdateValidator = [
    check('lookup_key')
        .not()
        .isEmpty()
        .withMessage('lookupKey is required')
];