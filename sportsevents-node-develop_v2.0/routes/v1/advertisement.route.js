const express = require("express");
const {
  getAllAdvertisement,
  getById,
  deleteAdvertisement,
  updateAdvertisement,
  createAdvertisement,
} = require("../../controllers/advertisement.controller");

const { runValidation } = require("../../validations");
const {
  advertisementCreateValidator,
  advertisementUpdateValidator,
} = require("../../validations/advertisement");

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

/**
* @swagger
*  /api/advertisement:
*   post:
*     summary: Add Advertisement details
*     description: Add Advertisement details
*     tags : ["Advertisement"]
*     parameters:
*        - in: body
*          name: advertisement  
*          description: To add the advertisement details
*          schema:
*            type:  object
*            required:
*              - advertisement_name 
*              - advertisement_desc 
*              - valid_date 
*              - advertisement_media_url
*              - advertisement_click_url 
*              - created_date 
*              - advertisement_media_url_meta
*            properties: 
*              advertisement_name:
*                type: string
*              advertisement_desc:
*                type: string
*              valid_date:
*                type: string
*              advertisement_media_url:
*                type: string
*              advertisement_click_url:
*                type: string
*              created_date:
*                type: string
*              advertisement_media_url_meta:
*                type: object
*     responses:
*       200:
*          description: advertisement details added Successfully
*/

router.post(
  "/",
  upload.fields([
    {
      name: "files",
      maxCount: 1,
    },
  ]),
  advertisementCreateValidator,
  runValidation,
  createAdvertisement
);

/**
* @swagger
*  /api/advertisement:
*   put:
*     summary: Edit Advertisement details
*     description: Edit Advertisement details
*     tags : ["Advertisement"]
*     parameters:
*        - in: body
*          name: advertisement  
*          description: To edit the advertisement details
*          schema:
*            type:  object
*            required:
*              - advertisement_name 
*              - advertisement_desc 
*              - valid_date 
*              - advertisement_media_url
*              - advertisement_click_url 
*              - created_date 
*              - advertisement_media_url_meta
*              - advertisement_id
*            properties: 
*              advertisement_name:
*                type: string
*              advertisement_desc:
*                type: string
*              valid_date:
*                type: string
*              advertisement_media_url:
*                type: string
*              advertisement_click_url:
*                type: string
*              created_date:
*                type: string
*              advertisement_media_url_meta:
*                type: object
*              advertisement_id:
*                type: integer
*     responses:
*       200:
*          description: advertisement details edited Successfully
*/


router.put(
  "/",
  upload.fields([
    {
      name: "files",
      maxCount: 1,
    },
  ]),
  advertisementUpdateValidator,
  runValidation,
  updateAdvertisement
);

/**
* @swagger
* paths:
*  /api/advertisement/getById/{advertisement_id}:
*   get:
*     summary: Get Advertisement details by Id
*     tags : ["Advertisement"]
*     description: Get Advertisement details
*     parameters:
*        - in: path
*          name: advertisement_id
*          description: advertisement_id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get("/getById/:advertisement_id", getById);

/**
* @swagger
*  /api/advertisement/getAll:
*   get:
*     summary: Get all Advertisement details
*     tags : ["Advertisement"]
*     description: Get Advertisement details
*     responses:
*       200:
*         description: Success
*/

router.get("/getAll", getAllAdvertisement);

/**
* @swagger
* paths:
*  /api/advertisement/deleteById/{advertisement_id}:
*   delete:
*     summary: Delete Advertisement Details By Id
*     tags : ["Advertisement"]
*     description: Delete Advertisement details
*     parameters:
*        - in: path
*          name: advertisement_id
*          description: advertisement id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete("/deleteById/:advertisement_id", deleteAdvertisement);

module.exports = router;
