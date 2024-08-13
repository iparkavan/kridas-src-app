const express = require("express");
const { createPreRegisterMail, createArrayMail } = require("../../controllers/preRegiter.controller");
const router = express.Router();

router.post(
    "/",
    createPreRegisterMail
);

router.post(
    "/mail",
    createArrayMail
);


module.exports = router;