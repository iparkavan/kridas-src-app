const { check } = require('express-validator');

exports.eventMasterCreateValidator = [
    check('event_name')
        .not()
        .isEmpty()
        .withMessage('event_name is required'),
    check('event_desc')
        .not()
        .isEmpty()
        .withMessage('event_desc is required'),
    check('event_type')
        .not()
        .isEmpty()
        .withMessage('event_type is required'),
    check('event_owner_id')
        .not()
        .isEmpty()
        .withMessage('event_owner_id is required')
];

exports.eventMasterUpdateValidator = [
    check('event_master_id')
        .not()
        .isEmpty()
        .withMessage('event_master_id is required'),
    check('event_name')
        .not()
        .isEmpty()
        .withMessage('event_name is required'),
    check('event_desc')
        .not()
        .isEmpty()
        .withMessage('event_desc is required'),
    check('event_type')
        .not()
        .isEmpty()
        .withMessage('event_type is required'),
    check('event_owner_id')
        .not()
        .isEmpty()
        .withMessage('event_owner_id is required')
];
