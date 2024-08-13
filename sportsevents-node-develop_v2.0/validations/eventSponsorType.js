const { check } = require("express-validator");

exports.eventSponsorTypeCreateValidator = [
  check("event_sponsor_type_name")
    .not()
    .isEmpty()
    .withMessage("event_sponsor_type_name is required"),
  check("event_id").not().isEmpty().withMessage("event_id is required"),
];

exports.eventSponsorTypeUpdateValidator = [
  check("event_sponsor_type_id")
    .not()
    .isEmpty()
    .withMessage("event_sponsor_type_id is required"),
  check("event_sponsor_type_name")
    .not()
    .isEmpty()
    .withMessage("event_sponsor_type_name is required"),
  check("event_id").not().isEmpty().withMessage("event_id is required"),
];
