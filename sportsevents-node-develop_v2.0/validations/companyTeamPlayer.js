const { check } = require("express-validator");

exports.playerRegistrationValidator = [
  check("company_id").not().isEmpty().withMessage("company_id is required"),
  check("player").not().isEmpty().withMessage("player is required"),
];
