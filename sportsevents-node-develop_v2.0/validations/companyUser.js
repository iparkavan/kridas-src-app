const { check } = require("express-validator");

exports.companyUserCreateValidator = [
  check("company_id").not().isEmpty().withMessage("company_id is required"),
  check("user_id").not().isEmpty().withMessage("user_id is required"),
  check("user_type").not().isEmpty().withMessage("user_type is required"),
  check("user_start_date")
    .not()
    .isEmpty()
    .withMessage("user_start_date is required"),
];

exports.companyUserUpdateValidator = [
  check("company_id").not().isEmpty().withMessage("company_id is required"),
  check("user_id").not().isEmpty().withMessage("user_id is required"),
  check("user_type").not().isEmpty().withMessage("user_type is required"),
  check("user_start_date")
    .not()
    .isEmpty()
    .withMessage("user_start_date is required"),
];

exports.adminRoleCreateValidator = [
  check("company_id").not().isEmpty().withMessage("company_id is required"),
  check("users").not().isEmpty().withMessage("user list is required"),
];
