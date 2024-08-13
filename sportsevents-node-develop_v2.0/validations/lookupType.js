const { check } = require('express-validator');

exports.lookupTypeCreateValidator = [
    check('lookup_type')
        .not()
        .isEmpty()
        .withMessage('lookupType is required'),
        check('lookup_desc')
        .not()
        .isEmpty()
        .withMessage('lookup_desc is required'),

];