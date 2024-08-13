const express = require('express');
const { create,getById,deleteById,editsponserRequestorDeal,fetchAll } = require('../../controllers/sponsorRequestorDeal.controller');
const { runValidation } = require('../../validations');
const { sponsorRequestorDealsCreateValidator,sponsorRequestorDealsUpdateValidator } = require('../../validations/sponsorRequestorDeal');
const router = express.Router();

/**
* @swagger
*  /api/sponsor-requestor-deals:
*   post:
*     summary: Add Sponsor Requestor Deals details
*     description: Add Sponsor Requestor Deals details
*     tags : ["Sponsor-Requestor-Deals"]
*     parameters:
*        - in: body
*          name: sponsor requestor deals  
*          description: To add the sponsor requestor deals details
*          schema:
*            type: object
*            required:
*              - company_id 
*              - user_id 
*              - sponsorship_type 
*              - sports_id
*              - preferred_brand 
*              - roi_options 
*              - due_date 
*              - deal_status
*            properties: 
*              company_id:
*                type: string
*              user_id:
*                type: string
*              sponsorship_type:
*                type: integer
*              sports_id:
*                type: integer
*              preferred_brand:
*                type: string
*              roi_options:
*                type: integer
*              due_date:
*                type: string
*              deal_status:
*                type: string
*     responses:
*       200:
*          description: Sponsor Requestor Deals details added Successfully
*/


router.post(
	'/',
	sponsorRequestorDealsCreateValidator,
	runValidation,
	create
);

/**
* @swagger
*  /api/sponsor-requestor-deals:
*   put:
*     summary: Edit Sponsor Requestor Deals details
*     description: Edit Sponsor Requestor Deals details
*     tags : ["Sponsor-Requestor-Deals"]
*     parameters:
*        - in: body
*          name: sponsor requestor deals  
*          description: To edit the sponsor requestor deals details
*          schema:
*            type: object
*            required:
*              - company_id 
*              - user_id 
*              - sponsorship_type 
*              - sports_id
*              - preferred_brand 
*              - roi_options 
*              - due_date 
*              - deal_status
*              - sponsor_requestor_deal_id
*            properties: 
*              company_id:
*                type: string
*              user_id:
*                type: string
*              sponsorship_type:
*                type: integer
*              sports_id:
*                type: integer
*              preferred_brand:
*                type: string
*              roi_options:
*                type: integer
*              due_date:
*                type: string
*              deal_status:
*                type: string
*              sponsor_requestor_deal_id:
*                type: integer
*     responses:
*       200:
*          description: Sponsor Requestor Deals details edited Successfully
*/



router.put(
	'/',
	sponsorRequestorDealsUpdateValidator,
	runValidation,
	editsponserRequestorDeal
);

/**
* @swagger
* paths:
*  /api/sponsor-requestor-deals/get/{id}:
*   get:
*     summary: Get Sponsor Requestor Deals details by Id
*     tags : ["Sponsor-Requestor-Deals"]
*     description: Get Sponsor Requestor Deals details
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
*  /api/sponsor-requestor-deals/getAll:
*   get:
*     summary: Get all Sponsor Requestor Deals details
*     tags : ["Sponsor-Requestor-Deals"]
*     description: Get all Sponsor Requestor Deals details
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
*  /api/sponsor-requestor-deals/delete/{id}:
*   delete:
*     summary: Delete Sponsor Requestor Deals Details By Id
*     tags : ["Sponsor-Requestor-Deals"]
*     description: Delete Sponsor Requestor Deals details
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