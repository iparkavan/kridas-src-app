const express = require("express");
const {
  create,
  edit,
  deleteById,
  fetchAll,
  getById,
} = require("../../controllers/companySponsorType.controller");

const { runValidation } = require("../../validations");
const {
  companySponsorTypeCreateValidator,
  companySponsorTypeUpdateValidator,
} = require("../../validations/companySponsorType");
const router = express.Router();

/**
 * @swagger
 *  /api/company-sponsor-type/getAll:
 *   get:
 *     summary: Get all Company Sponsor type details
 *     tags : ["Company-Sponsor-Type"]
 *     description: Get Company Sponsor Type  details
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getAll", fetchAll);

/**
 * @swagger
 * paths:
 *  /api/company-sponsor-type/get/{company_sponsor_type_id}:
 *   get:
 *     summary: Get Company Sponsor type details by company_sponsor_type_id
 *     tags : ["Company-Sponsor-Type"]
 *     description: Get Company Sponsor Type details by company_sponsor_type_id
 *     parameters:
 *        - in: path
 *          name: company_sponsor_type_id
 *          description: company_sponsor_type_id
 *          type: integer
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/get/:company_sponsor_type_id", getById);

/**
 * @swagger
 *  /api/company-sponsor-type:
 *   post:
 *     summary: Add Company Sponsor Type details
 *     description: Add Company Sponsor-Type details
 *     tags : ["Company-Sponsor-Type"]
 *     parameters:
 *        - in: body
 *          name: Company-Sponsor-Type
 *          description: To add the company sponsor Type details
 *          schema:
 *            type: object
 *            required:
 *              - company_sponsor_type_name
 *              - company_id
 *            properties:
 *              company_sponsor_type_name:
 *                type: string
 *              company_id:
 *                type: uuid
 *              sort_order:
 *                type: integer
 *              is_deleted:
 *                type: boolean
 *
 *     responses:
 *       200:
 *          description: Company Sponsor Type details Added Successfully
 */

router.post("/", companySponsorTypeCreateValidator, runValidation, create);

/**
 * @swagger
 *  /api/company-sponsor-type:
 *   put:
 *     summary: Edit Company Sponsor Type details
 *     description: Edit Company Sponsor-Type details
 *     tags : ["Company-Sponsor-Type"]
 *     parameters:
 *        - in: body
 *          name: Company-Sponsor-Type
 *          description: To add the company sponsor Type details
 *          schema:
 *            type: object
 *            required:
 *              - company_sponsor_type_name
 *              - company_id
 *              - company_sponsor_type_id
 *            properties:
 *              company_sponsor_type_name:
 *                type: string
 *              company_id:
 *                type: uuid
 *              sort_order:
 *                type: integer
 *              is_deleted:
 *                type: boolean
 *              company_sponsor_type_id:
 *                type:integer
 *     responses:
 *       200:
 *          description: Company Sponsor Type details edited Successfully
 */

router.put("/", companySponsorTypeUpdateValidator, runValidation, edit);

/**
 * @swagger
 * paths:
 *  /api/company-sponsor-type/delete/{company_sponsor_type_id}:
 *   delete:
 *     summary: Delete Company Sponsor info Details By company_sponsor_type_id
 *     tags : ["Company-Sponsor-Type"]
 *     description: Delete Company Sponsor info details By company_sponsor_type_id
 *     parameters:
 *        - in: path
 *          name: company_sponsor_type_id
 *          description: company_sponsor_type_id
 *          type: integer
 *          required: true
 *     responses:
 *       200:
 *         description: Deleted Successfully
 */

router.delete("/delete/:company_sponsor_type_id", deleteById);
module.exports = router;
