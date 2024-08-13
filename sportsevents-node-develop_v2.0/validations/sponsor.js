const { check } = require("express-validator");

exports.sponsorCreateValidator = [
  check("sponsor_name").not().isEmpty().withMessage("sponsor_name is required"),
  check("sponsor_click_url")
    .not()
    .isEmpty()
    .withMessage("sponsor_click_url is required"),
];

exports.sponsorUpdateValidator = [
  check("sponsor_id").not().isEmpty().withMessage("sponsor_id is required"),
  check("sponsor_name").not().isEmpty().withMessage("sponsor_name is required"),
  check("sponsor_click_url")
    .not()
    .isEmpty()
    .withMessage("sponsor_click_url is required"),
];
