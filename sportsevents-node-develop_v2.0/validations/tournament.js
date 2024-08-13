const { check } = require('express-validator');

exports.tournamentCreateValidator = [
    check('event_refid')
        .not()
        .isEmpty()
        .withMessage('event_refid is required'),
    check('sports_refid')
        .not()
        .isEmpty()
        .withMessage('sports_refid is required'),
    check('tournament_startdate')
        .not()
        .isEmpty(),
    check('tournament_enddate')
        .not()
        .isEmpty()
        .withMessage('tournament_enddate is required'),
];

exports.tournamentUpdateValidator = [
    check('tournament_id')
        .not()
        .isEmpty()
        .withMessage('tournament_id is required'),
    check('event_refid')
        .not()
        .isEmpty()
        .withMessage('event_refid is required'),
    check('sports_refid')
        .not()
        .isEmpty()
        .withMessage('sports_refid is required'),
    check('tournament_startdate')
        .not()
        .isEmpty()
        .withMessage('tournament_startdate is required'),
    check('tournament_enddate')
        .not()
        .isEmpty()
        .withMessage('tournament_enddate is required'),
];