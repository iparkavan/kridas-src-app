const { check } = require("express-validator");

exports.tournamentPlayerRegistrationCreateValidator = [
  check("registration_date")
    .not()
    .isEmpty()
    .withMessage("registration_date is required"),
  check("tournament_category_id")
    .not()
    .isEmpty()
    .withMessage("tournament_category_id is required"),
  check("tournamentid").not().isEmpty().withMessage("tournamentid is required"),
];

exports.tournamentPlayerRegistrationUpdateValidator = [
  check("tournament_player_reg_id")
    .not()
    .isEmpty()
    .withMessage("tournament_player_reg_id is required"),
  check("registration_date")
    .not()
    .isEmpty()
    .withMessage("registration_date is required"),
  check("tournament_category_id")
    .not()
    .isEmpty()
    .withMessage("tournament_category_id is required"),
  check("tournamentid").not().isEmpty().withMessage("tournamentid is required"),
];
