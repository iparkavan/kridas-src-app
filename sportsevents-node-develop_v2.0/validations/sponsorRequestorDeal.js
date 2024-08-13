const { check } = require('express-validator');

exports.sponsorRequestorDealsCreateValidator = [

    check('sponsorship_type')
        .not()
        .isEmpty()
        .withMessage('sponsorship_type  is required'),
    check('sports_id')
        .not()
        .isEmpty()
        .withMessage('sports_id  is required'),
    check('due_date')
        .not()
        .isEmpty()
        .withMessage('due_date  is required'),

];

exports.sponsorRequestorDealsUpdateValidator = [
    check('sponsor_requestor_deal_id')
        .not()
        .isEmpty()
        .withMessage('sponsor_requestor_deal_id  is required'),
    check('sponsorship_type')
        .not()
        .isEmpty()
        .withMessage('sponsorship_type  is required'),
    check('sports_id')
        .not()
        .isEmpty()
        .withMessage('sports_id  is required'),
    check('due_date')
        .not()
        .isEmpty()
        .withMessage('due_date  is required'),

];