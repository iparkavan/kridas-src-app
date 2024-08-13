const express = require("express");
const router = express.Router();
const {
  createCheckOutSession,
} = require("../../controllers/payment.controller");

router.post("/create-checkout-session", createCheckOutSession);

module.exports = router;
