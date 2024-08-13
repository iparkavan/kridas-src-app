const { check } = require("express-validator");

exports.teamsCreateValidator = [
  check("team_members").not().isEmpty().withMessage("team_members is required"),
  check("company_id").not().isEmpty().withMessage("company_id is required"),
];

exports.teamsUpdateValidator = [
  check("team_id").not().isEmpty().withMessage("team_id is required"),
  check("team_members").not().isEmpty().withMessage("team_members is required"),
  check("company_id").not().isEmpty().withMessage("company_id is required"),
];

exports.teamsNameValidator = [
  check("team_name").not().isEmpty().withMessage("team_name is required"),
  check("tournament_id")
    .not()
    .isEmpty()
    .withMessage("tournament_id is required"),
];
