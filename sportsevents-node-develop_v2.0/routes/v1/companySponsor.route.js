const express = require("express");
const {
  getAllCompanySponsor,
  getByCompanySponsorId,
  createCompanySponsor,
  editCompanySponsor,
  deleteByCompanySponsorId,
  getByCompanyId,
  getByIsFeature,
} = require("../../controllers/companySponsor.controller");
const { runValidation } = require("../../validations");
const {
  companySponsorCreateValidator,
  companySponsorUpdateValidator,
} = require("../../validations/companySponsor");
const router = express.Router();

/**
 * @swagger
 *  /api/company-sponsor/getAll:
 *   get:
 *     summary: Get all Company Sponsor details
 *     tags : ["Company-Sponsor"]
 *     description: Get Company Sponsor  details
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getAll", getAllCompanySponsor);

/**
 * @swagger
 * paths:
 *  /api/company-sponsor/get/{company_sponsor_id}:
 *   get:
 *     summary: Get Company Sponsor details by company_sponsor_id
 *     tags : ["Company-Sponsor"]
 *     description: Get Company Sponsor details by company_sponsor_id
 *     parameters:
 *        - in: path
 *          name: company_sponsor_id
 *          description: company_sponsor_id
 *          type: integer
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/get/:company_sponsor_id", getByCompanySponsorId);

/**
 * @swagger
 * paths:
 *  /api/company-sponsor/get/{company_id}:
 *   get:
 *     summary: Get Company Sponsor details by company_id
 *     tags : ["Company-Sponsor"]
 *     description: Get Company Sponsor details by company_id
 *     parameters:
 *        - in: path
 *          name: company_id
 *          description: company_id
 *          type: uuid
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/getByCompanyId/:company_id", getByCompanyId);

/**
 * @swagger
 *  /api/company-sponsor/getByIsFeature:
 *   post:
 *     summary: Get Featured Company Sponsor details
 *     description: Get Featured Sponsor details
 *     tags : ["Company-Sponsor"]
 *     parameters:
 *        - in: body
 *          name: Company-Sponsor
 *          description: To Get the Featured company sponsor details
 *          schema:
 *            type: object
 *            required:
 *              - is_featured
 *              - sort_order
 *            properties:
 *              is_featured:
 *                type: boolean
 *              sort_order:
 *                type: text
 *              sponsor_type_id:
 *                type: integer
 *
 *     responses:
 *       200:
 *          description: Company Sponsor details Fetched Successfully
 */

router.post("/getByIsFeature", getByIsFeature);

/**
 * @swagger
 *  /api/company-sponsor:
 *   post:
 *     summary: Add Company Sponsor details
 *     description: Add Company Sponsor details
 *     tags : ["Company-Sponsor"]
 *     parameters:
 *        - in: body
 *          name: Company-Sponsor
 *          description: To add the company sponsor details
 *          schema:
 *            type: object
 *            required:
 *              - sponsor_id
 *              - company_id
 *              - sponsor_type_id
 *            properties:
 *              sponsor_id:
 *                type: integer
 *              company_id:
 *                type: uuid
 *              sponsor_type_id:
 *                type: integer
 *              is_featured:
 *                type: boolean
 *              seq_number:
 *                type: integer
 *
 *     responses:
 *       200:
 *          description: Company Sponsor details Added Successfully
 */

router.post(
  "/",
  companySponsorCreateValidator,
  runValidation,
  createCompanySponsor
);

/**
 * @swagger
 *  /api/company-sponsor:
 *   put:
 *     summary: Edit Company Sponsor details
 *     description: Edit Company Sponsor details
 *     tags : ["Company-Sponsor"]
 *     parameters:
 *        - in: body
 *          name: Company-Sponsor
 *          description: To add the company sponsor details
 *          schema:
 *            type: object
 *            required:
 *              - sponsor_id
 *              - company_id
 *              - sponsor_type_id
 *              - company_sponsor_id
 *            properties:
 *              sponsor_id:
 *               type: integer
 *              company_id:
 *               type: uuid
 *              sponsor_type_id:
 *               type: integer
 *              is_featured:
 *               type: boolean
 *              seq_number:
 *               type: integer
 *              company_sponsor_id:
 *               type: integer
 *     responses:
 *       200:
 *          description: Company Sponsor details edited Successfully
 */

router.put(
  "/",
  companySponsorUpdateValidator,
  runValidation,
  editCompanySponsor
);

/**
 * @swagger
 * paths:
 *  /api/company-sponsor/delete/{company_sponsor_id}:
 *   delete:
 *     summary: Delete Company Sponsor Details By company_sponsor_id
 *     tags : ["Company-Sponsor"]
 *     description: Delete Company Sponsor details By company_sponsor_id
 *     parameters:
 *        - in: path
 *          name: company_sponsor_id
 *          description: company_sponsor_id
 *          type: integer
 *          required: true
 *     responses:
 *       200:
 *         description: Deleted Successfully
 */

router.delete("/delete/:company_sponsor_id", deleteByCompanySponsorId);
module.exports = router;
