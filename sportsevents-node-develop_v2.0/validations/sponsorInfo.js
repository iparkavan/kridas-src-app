const { check } = require('express-validator');


exports.sponsorInfoUpdateValidator = [
    check('sponsor_info_id')
    .not()
    .isEmpty()
    .withMessage('sponsor_info_id is required'), 
];