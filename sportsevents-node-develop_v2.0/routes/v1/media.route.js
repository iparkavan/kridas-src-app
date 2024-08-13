const express = require("express");
const {
  createMedia,
  fetchAll,
  fetchMedia,
  fetchMediaByEventId,
  editMedia,
  deleteMedia,
  fetchByMediaCreatorUserId,
  fetchByMediaCreatorCompanyId,
  fetchTaggedMediaByUserId,
  fetchTaggedMediaByCompanyId,
  fetchFeedByMedia,
  uploads,
  fetchTaggedMediaByEventId,
} = require("../../controllers/media.controller");
const { runValidation } = require("../../validations");
const {
  mediaCreateValidator,
  eventIdValidator,
  mediaUpdateValidator,
  userIdValidator,
  companyIdValidator,
} = require("../../validations/media");
const router = express.Router();
const multer = require("multer");
const fileUpload = multer({ dest: "uploads/" });
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

const count = Number(process.env.GALLERY_MEDIA_MAXCOUNT);

/**
 * @swagger
 *  /api/media/uploads:
 *   post:
 *     summary: Media Uploads
 *     description: Media Uploads
 *     tags : ["Media"]
 *     parameters:
 *        - in: body
 *          name: media
 *          description: Media Uploads
 *          schema:
 *            type: object
 *            required:
 *              - user_id
 *              - company_id
 *            properties:
 *              user_id:
 *                type: string
 *              company_id:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/uploads",
  upload.fields([
    {
      name: "file",
      maxCount: count,
    },
  ]),
  uploads
);

/**
 * @swagger
 *  /api/media:
 *   post:
 *     summary: To Add Media Details
 *     description: To Add Media Details
 *     tags : ["Media"]
 *     parameters:
 *        - in: body
 *          name: media
 *          description: To Add Media Details
 *          schema:
 *            type: object
 *            required:
 *              - media_id
 *              - media_type
 *              - media_url
 *              - media_url_meta
 *              - media_desc
 *              - media_creator_user_id
 *              - media_creator_company_id
 *              - search_tags
 *            properties:
 *              media_id:
 *                type: string
 *              media_type:
 *                type: string
 *              media_url:
 *                type: string
 *              media_url_meta:
 *                type: object
 *              media_desc:
 *                type: string
 *              media_creator_user_id:
 *                type: string
 *              media_creator_company_id:
 *                type: string
 *              search_tags:
 *                type: string
 *     responses:
 *       200:
 *          description: Media details added successfully
 */

router.post("/", mediaCreateValidator, runValidation, createMedia);

/**
 * @swagger
 *  /api/media/getAll:
 *   get:
 *     summary: Get all Media details
 *     tags : ["Media"]
 *     description: Get Media  details
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getAll", fetchAll);

/**
 * @swagger
 * paths:
 *  /api/media/get/{media_id}:
 *   get:
 *     summary: Get Media Details details by Media Id
 *     tags : ["Media"]
 *     description: Get Media Details details by Media Id
 *     parameters:
 *        - in: path
 *          name: media_id
 *          description: media_id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/get/:media_id", fetchMedia);

/**
 * @swagger
 *  /api/media:
 *   put:
 *     summary: To Edit Media Details
 *     description: To Edit Media Details
 *     tags : ["Media"]
 *     parameters:
 *        - in: body
 *          name: media
 *          description: To Edit Media Details
 *          schema:
 *            type: object
 *            required:
 *              - media_id
 *              - media_type
 *              - media_url
 *              - media_url_meta
 *              - media_desc
 *              - media_creator_user_id
 *              - media_creator_company_id
 *              - search_tags
 *            properties:
 *              media_id:
 *                type: string
 *              media_type:
 *                type: string
 *              media_url:
 *                type: string
 *              media_url_meta:
 *                type: object
 *              media_desc:
 *                type: string
 *              media_creator_user_id:
 *                type: string
 *              media_creator_company_id:
 *                type: string
 *              search_tags:
 *                type: string
 *     responses:
 *       200:
 *          description: Media details edited successfully
 */

router.put("/", mediaUpdateValidator, runValidation, editMedia);

/**
 * @swagger
 * paths:
 *  /api/media/delete/{media_id}:
 *   delete:
 *     summary: Delete Media Details By Id
 *     tags : ["Media"]
 *     description: Delete Media details
 *     parameters:
 *        - in: path
 *          name: media_id
 *          description: media_id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Deleted Successfully
 */

router.delete("/delete/:media_id", deleteMedia);

/**
 * @swagger
 *  /api/media/getByUserId:
 *   post:
 *     summary: Get Media Details By User Id
 *     description: Get Media Details By User Id
 *     tags : ["Media"]
 *     parameters:
 *        - in: body
 *          name: media
 *          description: Get Media Details By User Id
 *          schema:
 *            type: object
 *            required:
 *              - page
 *              - sort
 *              - size
 *              - user_id
 *              - type
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *              user_id:
 *                type: string
 *              type:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/getByUserId",
  userIdValidator,
  runValidation,
  fetchByMediaCreatorUserId
);

/**
 * @swagger
 *  /api/media/getTaggedPostByUserId:
 *   post:
 *     summary: Get Tagged Post By User Id
 *     description: Get Tagged Post By User Id
 *     tags : ["Media"]
 *     parameters:
 *        - in: body
 *          name: media
 *          description: Get Tagged Post By User Id
 *          schema:
 *            type: object
 *            required:
 *              - page
 *              - sort
 *              - size
 *              - user_id
 *              - type
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *              user_id:
 *                type: string
 *              type:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/getTaggedPostByUserId",
  userIdValidator,
  runValidation,
  fetchTaggedMediaByUserId
);

// fetchTaggedMediaByCompanyId

/**
 * @swagger
 *  /api/media/getTaggedPostByCompanyId:
 *   post:
 *     summary: Get Tagged Post By Company Id
 *     description: Get Tagged Post By Company Id
 *     tags : ["Media"]
 *     parameters:
 *        - in: body
 *          name: media
 *          description: Get Tagged Post By Company Id
 *          schema:
 *            type: object
 *            required:
 *              - page
 *              - sort
 *              - size
 *              - company_id
 *              - type
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *              company_id:
 *                type: string
 *              type:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/getTaggedPostByCompanyId",
  companyIdValidator,
  runValidation,
  fetchTaggedMediaByCompanyId
);

/**
 * @swagger
 *  /api/media/getTaggedPostByEventId:
 *   post:
 *     summary: Get Tagged Post By Event Id
 *     description: Get Tagged Post By Event Id
 *     tags : ["Media"]
 *     parameters:
 *        - in: body
 *          name: media
 *          description: Get Tagged Post By Event Id
 *          schema:
 *            type: object
 *            required:
 *              - page
 *              - sort
 *              - size
 *              - event_id
 *              - type
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *              event_id:
 *                type: string
 *              type:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/getTaggedPostByEventId",
  eventIdValidator,
  runValidation,
  fetchTaggedMediaByEventId
);

/**
 * @swagger
 *  /api/media/getByCompanyId:
 *   post:
 *     summary: Get Media Details By Company Id
 *     description: Get Media Details By Company Id
 *     tags : ["Media"]
 *     parameters:
 *        - in: body
 *          name: media
 *          description: Get Media Details By Company Id
 *          schema:
 *            type: object
 *            required:
 *              - page
 *              - sort
 *              - size
 *              - company_id
 *              - type
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *              company_id:
 *                type: string
 *              type:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/getByCompanyId",
  companyIdValidator,
  runValidation,
  fetchByMediaCreatorCompanyId
);

/**
 * @swagger
 *  /api/media/getByEventId:
 *   post:
 *     summary: Get Media Details By Event Id
 *     description: Get Media Details By Event Id
 *     tags : ["Media"]
 *     parameters:
 *        - in: body
 *          name: media
 *          description: Get Media Details By Event Id
 *          schema:
 *            type: object
 *            required:
 *              - page
 *              - sort
 *              - size
 *              - event_id
 *              - type
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *              event_id:
 *                type: string
 *              type:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/getByEventId",
  eventIdValidator,
  runValidation,
  fetchMediaByEventId
);

/**
 * @swagger
 * paths:
 *  /api/media/getFeedByMedia/{media_id}:
 *   get:
 *     summary: Get Feed by Media
 *     tags : ["Media"]
 *     description: Get Feed by Media
 *     parameters:
 *        - in: path
 *          name: media_id
 *          description: media_id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getFeedByMedia/:media_id", fetchFeedByMedia);

module.exports = router;
