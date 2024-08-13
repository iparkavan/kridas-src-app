const express = require("express");
const { runValidation } = require("../../validations");
const {
  getByEventIdInEventFixturesValidator,
} = require("../../validations//eventFixtures");
const { getByEventId } = require("../../controllers/eventFixtures.controller");
const router = express.Router();

router.post(
  "/getByEventId",
  getByEventIdInEventFixturesValidator,
  runValidation,
  getByEventId
);
module.exports = router;
