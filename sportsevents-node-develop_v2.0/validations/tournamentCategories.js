const { check } = require('express-validator');

exports.TournamentCreateValidator = [
    check('tournament_refid')
        .not()
        .isEmpty()
        .withMessage('tournament_refid is required'),
    check('tournament_category')
        .not()
        .isEmpty()
        .withMessage('tournament_category is required'),
    check('tournament_format')
        .not()
        .isEmpty()
        .withMessage('tournament_format is required')
];

exports.TournamentUpdateValidator = [

    check('tournament_category_id')
        .not()
        .isEmpty()
        .withMessage('tournament_category_id is required'),
    check('tournament_refid')
        .not()
        .isEmpty()
        .withMessage('tournament_refid is required'),
    check('tournament_category')
        .not()
        .isEmpty()
        .withMessage('tournament_category is required'),
    check('tournament_format')
        .not()
        .isEmpty()
        .withMessage('tournament_format is required')
];