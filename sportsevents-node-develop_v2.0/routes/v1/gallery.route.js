const express = require("express");
const {
  createGallery,
  editGallery,
  fetchGallery,
  fetchAllGallery,
  deleteGallery,
  fetchGalleryByUserId,
  fetchGalleryByCompanyId,
  getGalleryByEventId,
} = require("../../controllers/gallery.controller");
const { runValidation } = require("../../validations");
const {
  galleryCreateValidator,
  galleryUpdateValidator,
} = require("../../validations/gallery");
const router = express.Router();

/**
 * @swagger
 *  /api/gallery:
 *   post:
 *     summary: Add Gallery details
 *     description: Add new Gallery details
 *     tags : ["Gallery"]
 *     parameters:
 *        - in: body
 *          name: gallery
 *          description: To add the gallery details
 *          schema:
 *            type: object
 *            required:
 *              - gallery_name
 *              - gallery_desc
 *              - gallery_user_id
 *              - gallery_company_id
 *              - created_date
 *              - updated_date
 *            properties:
 *              gallery_name:
 *                type: string
 *              gallery_desc:
 *                type: string
 *              gallery_user_id:
 *                type: string
 *              gallery_company_id:
 *                type: string
 *              created_date:
 *                type: string
 *              updated_date:
 *                type: string
 *     responses:
 *       200:
 *          description: gallery details added Successfully
 */

router.post("/", galleryCreateValidator, runValidation, createGallery);

/**
 * @swagger
 *  /api/gallery:
 *   put:
 *     summary: Edit Gallery details
 *     description: Edit Gallery details
 *     tags : ["Gallery"]
 *     parameters:
 *        - in: body
 *          name: gallery
 *          description: To edit the gallery details
 *          schema:
 *            type: object
 *            required:
 *              - gallery_name
 *              - gallery_desc
 *              - gallery_user_id
 *              - gallery_company_id
 *              - updated_date
 *              - gallery_id
 *            properties:
 *              gallery_name:
 *                type: string
 *              gallery_desc:
 *                type: string
 *              gallery_user_id:
 *                type: string
 *              gallery_company_id:
 *                type: string
 *              updated_date:
 *                type: string
 *              gallery_id:
 *                type: string
 *     responses:
 *       200:
 *          description: gallery details added Successfully
 */

router.put("/", galleryUpdateValidator, runValidation, editGallery);

/**
 * @swagger
 * paths:
 *  /api/gallery/get/{gallery_id}:
 *   get:
 *     summary: Get Gallery details by Gallery Id
 *     tags : ["Gallery"]
 *     description: Get Gallery details by Gallery Id
 *     parameters:
 *        - in: path
 *          name: gallery_id
 *          description: gallery_id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/get/:gallery_id", fetchGallery);

/**
 * @swagger
 * paths:
 *  /api/gallery/getByUserId/{gallery_user_id}:
 *   get:
 *     summary: Get Gallery details by User Id
 *     tags : ["Gallery"]
 *     description: Get Gallery details by User Id
 *     parameters:
 *        - in: path
 *          name: gallery_user_id
 *          description: gallery_user_id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getByUserId/:gallery_user_id", fetchGalleryByUserId);

/**
 * @swagger
 * paths:
 *  /api/gallery/getByCompanyId/{gallery_company_id}:
 *   get:
 *     summary: Get Gallery details by gallery company Id
 *     tags : ["Gallery"]
 *     description: Get Gallery details
 *     parameters:
 *        - in: path
 *          name: gallery_company_id
 *          description: gallery_company_id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getByCompanyId/:gallery_company_id", fetchGalleryByCompanyId);

/**
 * @swagger
 *  /api/gallery/getAll:
 *   get:
 *     summary: Get all Gallery details
 *     tags : ["Gallery"]
 *     description: Get all Gallery details
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getAll", fetchAllGallery);

/**
 * @swagger
 * paths:
 *  /api/gallery/delete/{gallery_id}:
 *   delete:
 *     summary: Delete Gallery Details By Id
 *     tags : ["Gallery"]
 *     description: Delete Gallery details
 *     parameters:
 *        - in: path
 *          name: gallery_id
 *          description: gallery id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Deleted Successfully
 */

router.delete("/delete/:gallery_id", deleteGallery);

/**
 * @swagger
 * paths:
 *  /api/gallery/getByEventId/{gallery_event_id}:
 *   get:
 *     summary: Get Gallery details by Event Id
 *     tags : ["Gallery"]
 *     description: Get Gallery details by Event Id
 *     parameters:
 *        - in: path
 *          name: gallery_event_id
 *          description: gallery_event_id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getByEventId/:gallery_event_id", getGalleryByEventId);

module.exports = router;
