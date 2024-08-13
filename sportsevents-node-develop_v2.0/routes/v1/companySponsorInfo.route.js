const express = require('express');
const { fetchAll , create , getById , edit, deleteById,getByCompanyId} = require('../../controllers/companySponsorInfo.controller');
const { runValidation } = require('../../validations');
const { companySponsorInfoCreateValidator,companySponsorInfoUpdateValidator } = require('../../validations/companySponsorInfo');
const router = express.Router();

/**
* @swagger
*  /api/company-sponsor-info/getAll:
*   get:
*     summary: Get all Company Sponsor info details
*     tags : ["Company-Sponsor-info"]
*     description: Get Company Sponsor info  details
*     responses:
*       200:
*         description: Success
*/


router.get(
	'/getAll',
	fetchAll
);

/**
* @swagger
* paths:
*  /api/company-sponsor-info/get/{id}:
*   get:
*     summary: Get Company Sponsor info details by Id
*     tags : ["Company-Sponsor-info"]
*     description: Get Company Sponsor info details by Id
*     parameters:
*        - in: path
*          name: id
*          description: id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
	'/get/:id',
	getById
);

/**
* @swagger
* paths:
*  /api/company-sponsor-info/getByCompanyId/{company_id}:
*   get:
*     summary: Get Company Sponsor info details by Company Id
*     tags : ["Company-Sponsor-info"]
*     description: Get Company Sponsor info details by Company Id
*     parameters:
*        - in: path
*          name: company_id
*          description: company_id
*          type: string
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
	'/getByCompanyId/:company_id',
	getByCompanyId
);

/**
* @swagger
*  /api/company-sponsor-info:
*   post:
*     summary: Add Company Sponsor Info details
*     description: Add Company Sponsor-Info details
*     tags : ["Company-Sponsor-info"]
*     parameters:
*        - in: body
*          name: Company-Sponsor-info  
*          description: To add the company sponsor info details
*          schema:
*            type: object
*            required:
*              - company_id 
*              - category_id 
*              - sports_id 
*              - previous_current_sponsor
*              - roi_options
*            properties: 
*              company_id:
*                type: string
*              category_id:
*                type: integer
*              sports_id:
*                type: integer
*              previous_current_sponsor:
*                type: string
*              roi_options:
*                type: integer
*     responses:
*       200:
*          description: Company Sponsor info details added Successfully
*/


router.post(
	'/',
	companySponsorInfoCreateValidator,
	runValidation,
	create
);

/**
* @swagger
*  /api/company-sponsor-info:
*   put:
*     summary: Edit Company Sponsor Info details
*     description: Edit Company Sponsor-Info details
*     tags : ["Company-Sponsor-info"]
*     parameters:
*        - in: body
*          name: Company-Sponsor-info  
*          description: To edit the company sponsor info details
*          schema:
*            type: object
*            required:
*              - company_id 
*              - category_id 
*              - sports_id 
*              - previous_current_sponsor
*              - roi_options
*              - company_sponsor_info_id
*            properties: 
*              company_id:
*                type: string
*              category_id:
*                type: integer
*              sports_id:
*                type: integer
*              previous_current_sponsor:
*                type: string
*              roi_options:
*                type: integer
*              company_sponsor_info_id:
*                type: integer
*     responses:
*       200:
*          description: Company Sponsor info details edited Successfully
*/


router.put(
	'/',
	companySponsorInfoUpdateValidator,
	runValidation,
	edit
);

/**
* @swagger
* paths:
*  /api/company-sponsor-info/delete/{id}:
*   delete:
*     summary: Delete Company Sponsor info Details By Id
*     tags : ["Company-Sponsor-info"]
*     description: Delete Company Sponsor info details By Id
*     parameters:
*        - in: path
*          name: id
*          description: id 
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/


router.delete(
	'/delete/:id',
	deleteById
);
module.exports = router;