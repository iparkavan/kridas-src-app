const express = require("express");
const {
  createSponsor,
  updateSponsor,
  getById,
  getAll,
  deleteSponsor,
  saveSponsor,
  createSponsorforEvent,
  updateSponsorforEvent,
  saveSponsorforEvent,
  deleteForEventSponsor,
} = require("../../controllers/sponsor.controller");

const { runValidation } = require("../../validations");
const {
  sponsorCreateValidator,
  sponsorUpdateValidator,
} = require("../../validations/sponsor");

const router = express.Router();

const multer = require("multer");
// Storage Engin That Tells/Configures Multer for where (destination) and how (filename) to save/upload our files
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); //important this is a direct path fron our current file to storage location
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

router.post(
  "/",
  upload.fields([
    {
      name: "sponsor_media_url",
      maxCount: 1,
    },
  ]),
  sponsorCreateValidator,
  runValidation,
  createSponsor
);

router.post(
  "/event-sponsor",
  upload.fields([
    {
      name: "sponsor_media_url",
      maxCount: 1,
    },
  ]),
  sponsorCreateValidator,
  runValidation,
  createSponsorforEvent
);

router.put(
  "/",
  upload.fields([
    {
      name: "sponsor_media_url",
      maxCount: 1,
    },
  ]),
  sponsorUpdateValidator,
  runValidation,
  updateSponsor
);

router.put(
  "/event-sponsor",
  upload.fields([
    {
      name: "sponsor_media_url",
      maxCount: 1,
    },
  ]),
  sponsorUpdateValidator,
  runValidation,
  updateSponsorforEvent
);

router.post("/save", saveSponsor);

router.post("/event-sponsor/save", saveSponsorforEvent);

router.get("/getById/:sponsor_id", getById);

router.get("/getAll", getAll);

router.delete("/deleteById/:sponsor_id", deleteSponsor);

router.delete("/event-sponsor/deleteById/:sponsor_id", deleteForEventSponsor);

module.exports = router;
