const { check } = require("express-validator");

exports.eventSponsorCreateValidator = [
  check("sponsor_id").not().isEmpty().withMessage("sponsor_id is required"),
  check("event_id").not().isEmpty().withMessage("event_id is required"),
  check("sponsor_type_id")
    .not()
    .isEmpty()
    .withMessage("sponsor_type_id is required"),
];

exports.eventSponsorUpdateValidator = [
  check("event_sponsor_id")
    .not()
    .isEmpty()
    .withMessage("event_sponsor_id is required"),
  check("sponsor_id").not().isEmpty().withMessage("sponsor_id is required"),
  check("event_id").not().isEmpty().withMessage("event_id is required"),
  check("sponsor_type_id")
    .not()
    .isEmpty()
    .withMessage("sponsor_type_id is required"),
];
