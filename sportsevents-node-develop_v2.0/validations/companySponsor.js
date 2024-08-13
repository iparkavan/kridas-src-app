const { check } = require("express-validator");

exports.companySponsorCreateValidator = [
  check("sponsor_id").not().isEmpty().withMessage("sponsor_id is required"),
  check("company_id").not().isEmpty().withMessage("company_id is required"),
  check("sponsor_type_id")
    .not()
    .isEmpty()
    .withMessage("sponsor_type_id is required"),
];

exports.companySponsorUpdateValidator = [
  check("company_sponsor_id")
    .not()
    .isEmpty()
    .withMessage("company_sponsor_id is required"),
  check("sponsor_id").not().isEmpty().withMessage("sponsor_id is required"),
  check("company_id").not().isEmpty().withMessage("company_id is required"),
  check("sponsor_type_id")
    .not()
    .isEmpty()
    .withMessage("sponsor_type_id is required"),
];
