const { check } = require('express-validator');

exports.userDeviceTokenCreateValidator = [
  check('user_id').not().isEmpty().withMessage('user_id is required'),
  check('device_token')
    .trim()
    .not()
    .isEmpty()
    .withMessage('device_token is required'),
];
