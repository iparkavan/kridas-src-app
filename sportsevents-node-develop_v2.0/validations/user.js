const { check } = require('express-validator');

exports.userCreateValidator = [
        check('first_name')
        .not()
        .isEmpty()
        .withMessage('first_name is required'),
        check('last_name')
        .not()
        .isEmpty()
        .withMessage('last_name is required'),
        check('user_email')
        .not()
        .isEmpty()
        .withMessage('user_email is required'),
        check('user_type')
        .not()
        .isEmpty()
        .withMessage('user_type is required')
];

exports.userUpdateValidator = [
    check('user_id')
    .not()
    .isEmpty()
    .withMessage('user_id is required'),
    check('first_name')
    .not()
    .isEmpty()
    .withMessage('first_name is required'),
    check('last_name')
    .not()
    .isEmpty()
    .withMessage('last_name is required'),
    check('user_email')
    .not()
    .isEmpty()
    .withMessage('user_email is required'),
    check('user_type')
    .not()
    .isEmpty()
    .withMessage('user_type is required')
];

exports.userProfileCreateValidator = [
    check('user_id')
    .not()
    .isEmpty()
    .withMessage('user_id is required'),
];

exports.userProfileUpdateValidator = [
    check('user_id')
    .not()
    .isEmpty()
    .withMessage('user_id is required'),
    check('profile_verification_id')
    .not()
    .isEmpty()
    .withMessage('profile_verification_id is required'),
];


exports.userTokenUpdateValidation = [
    check('email')
    .not()
    .isEmpty()
    .withMessage('email is required'),
    check('token')
    .not()
    .isEmpty()
    .withMessage('token is required')
];