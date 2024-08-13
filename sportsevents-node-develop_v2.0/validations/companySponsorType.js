const { check } = require("express-validator");

exports.companySponsorTypeCreateValidator = [
  check("company_sponsor_type_name")
    .not()
    .isEmpty()
    .withMessage("company_sponsor_type_name is required"),
  check("company_id").not().isEmpty().withMessage("company_id is required"),
];

exports.companySponsorTypeUpdateValidator = [
  check("company_sponsor_type_id")
    .not()
    .isEmpty()
    .withMessage("company_sponsor_type_id is required"),
  check("company_sponsor_type_name")
    .not()
    .isEmpty()
    .withMessage("company_sponsor_type_name is required"),
  check("company_id").not().isEmpty().withMessage("company_id is required"),
];
