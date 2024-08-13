const { check } = require("express-validator");

exports.eventCreateValidator = [
  check("event_name").not().isEmpty().withMessage("event_name is required"),
  check("event_desc").not().isEmpty().withMessage("event_desc is required"),
  // check('parent_event_id')
  //     .not()
  //     .isEmpty()
  //     .withMessage('parent_event_id is required'),
  check("event_startdate")
    .not()
    .isEmpty()
    .withMessage("event_startdate is required"),
  check("event_enddate")
    .not()
    .isEmpty()
    .withMessage("event_enddate is required"),
  check("event_status").not().isEmpty().withMessage("event_status is required"),
  check("company_id").not().isEmpty().withMessage("company_id is required"),
];

exports.eventUpdateValidator = [
  check("event_id").not().isEmpty().withMessage("event_id is required"),
  check("event_name").not().isEmpty().withMessage("event_name is required"),
  check("event_desc").not().isEmpty().withMessage("event_desc is required"),
  check("parent_event_id")
    .not()
    .isEmpty()
    .withMessage("parent_event_id is required"),
  check("event_startdate")
    .not()
    .isEmpty()
    .withMessage("event_startdate is required"),
  check("event_enddate")
    .not()
    .isEmpty()
    .withMessage("event_enddate is required"),
  check("event_status").not().isEmpty().withMessage("event_status is required"),
  check("company_id").not().isEmpty().withMessage("company_id is required"),
];

exports.eventCompanyValidator = [
  check("company_id").not().isEmpty().withMessage("company_id is required"),
];

exports.eventUserValidator = [
  check("user_id").not().isEmpty().withMessage("user_id is required"),
];
