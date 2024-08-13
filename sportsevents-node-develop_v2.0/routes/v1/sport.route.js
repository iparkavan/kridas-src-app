const express = require('express');
const { createSport, editSport, fetchSport, deleteSport, fetchAllSport, fetchSportsByName, getCompanyNameBySportsId, getAllSportsByStats } = require('../../controllers/sports.controller');
const { runValidation } = require('../../validations');
const { sportsCreateValidator, sportsUpdateValidator } = require('../../validations/sports');
const router = express.Router();

/**
* @swagger
*  /api/sports:
*   post:
*     summary: Add Sports details
*     description: Add new Sports details
*     tags : ["Sports"]
*     parameters:
*        - in: body
*          name: sports  
*          description: To add the sports details
*          schema:
*            type:  object
*            required:
*              - sports_name 
*              - sports_desc 
*              - sports_format 
*              - sports_category
*              - sports_age_group 
*              - sports_brand 
*              - created_date 
*              - updated_date
*              - sports_profile 
*              - sports_role 
*              - sports_code 
*              - is_stats_enabled
*            properties: 
*              sports_name:
*                type: string
*              sports_desc:
*                type: string
*              sports_format:
*                type: object
*              sports_category:
*                type: object
*              sports_age_group:
*                type: object
*              sports_brand:
*                type: string
*              created_date:
*                type: string
*              updated_date:
*                type: string
*              sports_profile:
*                type: object
*              sports_role:
*                type: object
*              sports_code:
*                type: string
*              is_stats_enabled:
*                type: boolean
*     responses:
*       200:
*          description: sports details added Successfully
*/

router.post(
	'/',
	sportsCreateValidator,
	runValidation,
	createSport
);

/**
* @swagger
*  /api/sports:
*   put:
*     summary: Edit sports details
*     description: Edit new sports details
*     tags : ["Sports"]
*     parameters:
*        - in: body
*          name: sports  
*          description: To edit the sports details
*          schema:
*            type: object
*            required:
*              - sports_name 
*              - sports_desc 
*              - sports_format 
*              - sports_category
*              - sports_age_group 
*              - sports_brand 
*              - created_date 
*              - updated_date
*              - sports_profile 
*              - sports_role 
*              - sports_code 
*              - sports_code 
*              - sports_id
*            properties: 
*              sports_name:
*                type: string
*              sports_desc:
*                type: string
*              sports_format:
*                type: object
*              sports_category:
*                type: object
*              sports_age_group:
*                type: object
*              sports_brand:
*                type: string
*              created_date:
*                type: string
*              updated_date:
*                type: string
*              sports_profile:
*                type: object
*              sports_role:
*                type: object
*              sports_code:
*                type: string
*              is_stats_enabled:
*                type: boolean
*              sports_id:
*                type: integer
*     responses:
*       200:
*          description: sports details edited Successfully
*/



router.put(
	'/',
	sportsUpdateValidator,
	runValidation,
	editSport
);

/**
* @swagger
* paths:
*  /api/sports/get/{sports_id}:
*   get:
*     summary: Get Sports details by Id
*     tags : ["Sports"]
*     description: Get Sports details
*     parameters:
*        - in: path
*          name: sports_id
*          description: sports id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
	'/get/:sports_id',
	fetchSport
);

/**
* @swagger
*  /api/sports/getAll:
*   get:
*     summary: Get all Sports details
*     tags : ["Sports"]
*     description: Get Sports details
*     responses:
*       200:
*         description: Success
*/

router.get(
	'/getAll',
	fetchAllSport
);

/**
* @swagger
*  /api/sports/getAllByStats:
*   get:
*     summary: Get all Sports details Stats
*     tags : ["Sports"]
*     description: Get Sports details
*     responses:
*       200:
*         description: Success
*/

router.get(
	'/getAllByStats',
	getAllSportsByStats
);

/**
* @swagger
* paths:
*  /api/sports/fetchSportsByName/{sports_name}:
*   get:
*     summary: Get Sports details by Name
*     tags : ["Sports"]
*     description: Get Sports details
*     parameters:
*        - in: path
*          name: sports_name
*          description: sports name
*          type: string
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
	'/fetchSportsByName/:sports_name',
	fetchSportsByName
);

/**
* @swagger
* paths:
*  /api/sports/getCompanyNameBySportsId/{sports_id}:
*   get:
*     summary: Get Sports details by Id
*     tags : ["Sports"]
*     description: Get Sports details
*     parameters:
*        - in: path
*          name: sports_id
*          description: sports id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
	'/getCompanyNameBySportsId/:sports_id',
	getCompanyNameBySportsId
);

/**
* @swagger
* paths:
*  /api/sports/delete/{sports_id}:
*   delete:
*     summary: Delete Sports Details By Id
*     tags : ["Sports"]
*     description: Delete Sports details
*     parameters:
*        - in: path
*          name: sports_id
*          description: sports id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete(
	'/delete/:sports_id',
	deleteSport
);



module.exports = router;