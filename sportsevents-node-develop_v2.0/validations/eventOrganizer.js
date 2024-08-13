const { check } = require('express-validator');

exports.eventOrganizerCreateValidator = [
    check('organizer_refid')
        .not()
        .isEmpty()
        .withMessage('organizer_refid is required'),
    check('organizer_role')
        .not()
        .isEmpty()
        .withMessage('organizer_role is required')
];

exports.eventOrganizerUpdateValidator = [
    check('event_organizer_id')
        .not()
        .isEmpty()
        .withMessage('event_organizer_id is required'),
    check('organizer_refid')
        .not()
        .isEmpty()
        .withMessage('organizer_refid is required'),
    check('organizer_role')
        .not()
        .isEmpty()
        .withMessage('organizer_role is required')
];
