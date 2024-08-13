const express = require('express');
const { fetchAll , create , getById , edit, deleteById, getByUserId} = require('../../controllers/sponsorInfo.controller');
const { runValidation } = require('../../validations');
const { sponsorInfoUpdateValidator } = require('../../validations/sponsorInfo');
const router = express.Router();

/**
* @swagger
*  /api/sponsor_Info/getAll:
*   get:
*     summary: Get all Sponsor Info details
*     tags : ["Sponsor-Info"]
*     description: Get all Sponsor Info details
*     responses:
*       200:
*         description: Success
*/

router.get(
	'/getAll',
	runValidation,
	fetchAll
);

/**
* @swagger
* paths:
*  /api/sponsor_Info/get/{id}:
*   get:
*     summary: Get Sponsor Info details by Id
*     tags : ["Sponsor-Info"]
*     description: Get Sponsor Info details
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
	runValidation,
	getById
);

/**
* @swagger
* paths:
*  /api/sponsor_Info/getByUserId/{user_id}:
*   get:
*     summary: Get Sponsor Info details by User Id
*     tags : ["Sponsor-Info"]
*     description: Get Sponsor Info details By User Id
*     parameters:
*        - in: path
*          name: user_id
*          description: user_id
*          type: string
*          required: true
*     responses:
*       200:
*         description: Success
*/


router.get(
	'/getByUserId/:user_id',
	getByUserId
);

/**
* @swagger
*  /api/sponsor_Info:
*   post:
*     summary: Add Sponsor Info details
*     description: Add Sponsor Info details
*     tags : ["Sponsor-Info"]
*     parameters:
*        - in: body
*          name: Sponsor Info
*          description: To add the sponsor-info details
*          schema:
*            type: object
*            required:
*              - user_id 
*              - previous_current_sponsor 
*              - roi_options 
*            properties: 
*              user_id:
*                type: string
*              previous_current_sponsor:
*                type: string
*              roi_options:
*                type: integer
*     responses:
*       200:
*          description: sponsor info details added Successfully
*/

router.post(
	'/',
	runValidation,
	create
);

/**
* @swagger
*  /api/sponsor_Info:
*   put:
*     summary: Edit Sponsor Info details
*     description: Edit Sponsor Info details
*     tags : ["Sponsor-Info"]
*     parameters:
*        - in: body
*          name: Sponsor Info
*          description: To edit the sponsor-info details
*          schema:
*            type: object
*            required:
*              - user_id 
*              - previous_current_sponsor 
*              - roi_options 
*              - sponsor_info_id 
*            properties: 
*              user_id:
*                type: string
*              previous_current_sponsor:
*                type: string
*              roi_options:
*                type: integer
*              sponsor_info_id:
*                type: integer
*     responses:
*       200:
*          description: sponsor info details edited Successfully
*/


router.put(
	'/',
	sponsorInfoUpdateValidator,
	runValidation,
	edit
);

/**
* @swagger
* paths:
*  /api/sponsor_Info/delete/{id}:
*   delete:
*     summary: Delete Sponsor Info Details By Id
*     tags : ["Sponsor-Info"]
*     description: Delete Sponsor Info details
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
	runValidation,
	deleteById
);
module.exports = router;