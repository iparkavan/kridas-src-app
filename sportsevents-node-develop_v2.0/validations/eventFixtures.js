const { check } = require("express-validator");

exports.getByEventIdInEventFixturesValidator = [
  check("event_id").not().isEmpty().withMessage("event_id is required"),
  check("image_type").not().isEmpty().withMessage("image_type is required"),
];
