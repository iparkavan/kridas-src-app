const { check } = require('express-validator');

exports.userHashtagFollowCreateValidator = [
    check('user_id')
        .not()
        .isEmpty()
        .withMessage('user_id is required'),
    check('hashtag_id')
        .not()
        .isEmpty()
        .withMessage('hashtag_id is required'),

];
