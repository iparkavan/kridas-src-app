const { check } = require("express-validator");

exports.advertisementCreateValidator = [
  check("advertisement_name")
    .not()
    .isEmpty()
    .withMessage("advertisement_name is required"),
  check("valid_date").not().isEmpty().withMessage("valid_date is required"),
];

exports.advertisementUpdateValidator = [
  check("advertisement_id")
    .not()
    .isEmpty()
    .withMessage("advertisement_id is required"),
  check("advertisement_name")
    .not()
    .isEmpty()
    .withMessage("advertisement_name is required"),
  check("valid_date").not().isEmpty().withMessage("valid_date is required"),
];
