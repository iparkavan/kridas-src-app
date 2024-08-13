const express = require("express");
const {
  createCompanyUser,
  fetchBrandPlayer,
  deleteBrandPlayer,
  editCompanyUser,
  createAdminRole,
  getByCompanyId,
} = require("../../controllers/compnayUser.controller");
const { runValidation } = require("../../validations");
const {
  companyUserCreateValidator,
  companyUserUpdateValidator,
  adminRoleCreateValidator,
} = require("../../validations/companyUser");
const router = express.Router();

/**
 * @swagger
 *  /api/company-user:
 *   post:
 *     summary: Add Company User details
 *     description: Add Company User details
 *     tags : ["Company-User"]
 *     parameters:
 *        - in: body
 *          name: Company User
 *          description: To add the Company User details
 *          schema:
 *            type: object
 *            required:
 *              - company_id
 *              - user_id
 *              - user_type
 *              - user_role
 *              - user_start_date
 *              - user_end_date
 *              - created_date
 *              - updated_date
 *            properties:
 *              company_id:
 *                type: string
 *              user_id:
 *                type: string
 *              user_type:
 *                type: string
 *              user_role:
 *                type: string
 *              user_start_date:
 *                type: string
 *              user_end_date:
 *                type: string
 *              created_date:
 *                type: string
 *              updated_date:
 *                type: string
 *     responses:
 *       200:
 *          description: Company User details added Successfully
 */

router.post("/", companyUserCreateValidator, runValidation, createCompanyUser);

/**
 * @swagger
 *  /api/company-user:
 *   put:
 *     summary: Edit Company User details
 *     description: Edit Company User details
 *     tags : ["Company-User"]
 *     parameters:
 *        - in: body
 *          name: Company User
 *          description: To edit the Company User details
 *          schema:
 *            type: object
 *            required:
 *              - company_id
 *              - user_id
 *              - user_type
 *              - user_role
 *              - user_start_date
 *              - user_end_date
 *              - created_date
 *              - updated_date
 *              - company_user_id
 *            properties:
 *              company_id:
 *                type: string
 *              user_id:
 *                type: string
 *              user_type:
 *                type: string
 *              user_role:
 *                type: string
 *              user_start_date:
 *                type: string
 *              user_end_date:
 *                type: string
 *              created_date:
 *                type: string
 *              updated_date:
 *                type: string
 *              company_user_id:
 *                type: integer
 *     responses:
 *       200:
 *          description: Company User details edited Successfully
 */

router.put("/", companyUserUpdateValidator, runValidation, editCompanyUser);

/**
 * @swagger
 * paths:
 *  /api/company-user/get/{company_user_id}:
 *   get:
 *     summary: Get Company User details by Company User Id
 *     tags : ["Company-User"]
 *     description: Get Company User details by Company User Id
 *     parameters:
 *        - in: path
 *          name: company_user_id
 *          description: company_user_id
 *          type: integer
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/get/:company_user_id", fetchBrandPlayer);

/**
 * @swagger
 * paths:
 *  /api/company-user/delete/{company_user_id}:
 *   delete:
 *     summary: Delete Company User Details By Company User Id
 *     tags : ["Company-User"]
 *     description:  Delete Company User Details By Company User Id
 *     parameters:
 *        - in: path
 *          name: company_user_id
 *          description: company user id
 *          type: integer
 *          required: true
 *     responses:
 *       200:
 *         description: Deleted Successfully
 */

router.delete("/delete/:company_user_id", deleteBrandPlayer);

/**
 * @swagger
 *  /api/company-user/admin:
 *   post:
 *     summary: Add Company Admin role settings
 *     description: Add Company Admin role settings
 *     tags : ["Company-User"]
 *     parameters:
 *        - in: body
 *          name: Company User
 *          description: To Add Company Admin role settings
 *          schema:
 *            type: object
 *            required:
 *              - company_id
 *              - user_name
 *            properties:
 *              company_id:
 *                type: string
 *              user_name:
 *                type: string
 *     responses:
 *       200:
 *          description: Company Admin role details added Successfully
 */

router.post("/admin", adminRoleCreateValidator, runValidation, createAdminRole);

/**
 * @swagger
 * paths:
 *  /api/company-user/getByCompanyId/{company_id}:
 *   get:
 *     summary: Get Company User details by Company Id
 *     tags : ["Company-User"]
 *     description: Get Company User details by Company Id
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

module.exports = router;
