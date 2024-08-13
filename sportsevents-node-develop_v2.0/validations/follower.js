const { check } = require('express-validator');

exports.followerCreateValidator = [
    check('followed_from')
        .not()
        .isEmpty()
        .withMessage('followed_from is required'),
];

exports.followerUpdateValidator= [
    check('follower_id')
        .not()
        .isEmpty()
        .withMessage('follower_id is required'),
    check('followed_from')
        .not()
        .isEmpty()
        .withMessage('followed_from is required')
       
];
