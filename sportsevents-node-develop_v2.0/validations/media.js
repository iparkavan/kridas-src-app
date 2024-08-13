const { check } = require("express-validator");

exports.mediaCreateValidator = [
  check("media_type").not().isEmpty().withMessage("media_type is required"),
  check("media_url").not().isEmpty().withMessage("media_url is required"),
];

exports.mediaUpdateValidator = [
  check("media_id").not().isEmpty().withMessage("media_id is required"),
  check("media_type").not().isEmpty().withMessage("media_type is required"),
  check("media_url").not().isEmpty().withMessage("media_url is required"),
];

exports.userIdValidator = [
  check("user_id").not().isEmpty().withMessage("user_id is required"),
];

exports.eventIdValidator = [
  check("event_id").not().isEmpty().withMessage("event_id is required"),
];

exports.companyIdValidator = [
  check("company_id").not().isEmpty().withMessage("company_id is required"),
];
