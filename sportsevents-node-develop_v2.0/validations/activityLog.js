const { check } = require("express-validator");

exports.logCreateValidator = [
  check("event_type").not().isEmpty().withMessage("event_type is required"),
  check("event_action").not().isEmpty().withMessage("event_action is required"),
];

exports.logSearchValidator = [
  check("id").not().isEmpty().withMessage("id is required"),
  check("type").not().isEmpty().withMessage("type is required"),
  check("event_type").not().isEmpty().withMessage("event_type is required"),
];

exports.logOutValidator = [
  check("user_id").not().isEmpty().withMessage("user_id is required"),
];
