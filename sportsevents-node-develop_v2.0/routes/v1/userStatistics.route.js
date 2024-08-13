const express = require('express');
const { createUserStatistics, addMultipleUserStatistics, fetchUserStatistics, deleteUserStatistics, fetchAll, editUserStatistics, fetchUserId, createSportsCareer, createSportsCareers } = require('../../controllers/userStatistics.controller');
const { runValidation } = require('../../validations');
const { userStatisticsCreateValidator, userStatisticsUpdateValidator } = require('../../validations/userStatistics');
const router = express.Router();
const multer = require('multer');
const fileStorageEngine = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '--' + file.originalname);
	},
});

const upload = multer({ storage: fileStorageEngine });

/**
* @swagger
*  /api/users/statistics:
*   post:
*     summary: Add Users Statistics Details
*     description: Add Users Statistics Details
*     tags : ["User-Statistics"]
*     parameters:
*        - in: body
*          name: user statistics  
*          description: To Add Users Statistics Details
*          schema:
*            type: object
*            required:
*              - user_id 
*              - sports_id 
*              - playing_status 
*              - statistics_desc
*              - sportwise_statistics 
*              - sport_career 
*              - statistics_links 
*              - statistics_docs
*              - skill_level
*            properties: 
*              user_id:
*                type: string
*              sports_id:
*                type: integer
*              playing_status:
*                type: string
*              statistics_desc:
*                type: string
*              sportwise_statistics:
*                type: object
*              sport_career:
*                type: object
*              statistics_links:
*                type: object
*              statistics_docs:
*                type: object
*              skill_level:
*                type: integer
*     responses:
*       200:
*          description: user statistics details added Successfully
*/

router.post(
	'/',
	upload.fields([{
		name: 'document', maxCount: 4
	}]),
	userStatisticsCreateValidator,
	runValidation,
	createUserStatistics
);

/**
* @swagger
*  /api/users/statistics/addMultiple:
*   post:
*     summary: Add Multiple Users Statistics Details
*     description: Add Multiple Users Statistics Details
*     tags : ["User-Statistics"]
*     parameters:
*        - in: body
*          name: user statistics  
*          description: To Add  Multiple Users Statistics Details
*          schema:
*            type: object
*            required:
*              - userStats 
*              - user_id 
*            properties: 
*              userStats:
*                type: string
*              user_id:
*                type: string
*     responses:
*       200:
*          description: Multiple user statistics details added Successfully
*/

router.post(
	'/addMultiple',
	upload.any(),
	addMultipleUserStatistics 
);

/**
* @swagger
*  /api/users/statistics:
*   put:
*     summary: Edit Users Statistics Details
*     description: Edit Users Statistics Details
*     tags : ["User-Statistics"]
*     parameters:
*        - in: body
*          name: user statistics  
*          description: To Edit Users Statistics Details
*          schema:
*            type: object
*            required:
*              - user_id 
*              - sports_id 
*              - playing_status 
*              - statistics_desc
*              - sportwise_statistics 
*              - sport_career 
*              - statistics_links 
*              - statistics_docs
*              - skill_level
*              - user_statistics_id
*            properties: 
*              user_id:
*                type: string
*              sports_id:
*                type: integer
*              playing_status:
*                type: string
*              statistics_desc:
*                type: string
*              sportwise_statistics:
*                type: object
*              sport_career:
*                type: object
*              statistics_links:
*                type: object
*              statistics_docs:
*                type: object
*              skill_level:
*                type: integer
*              user_statistics_id:
*                type: integer
*     responses:
*       200:
*          description: user statistics details edited Successfully
*/

router.put(
	'/',
	upload.fields([{
		name: 'document', maxCount: 4
	}]),
	userStatisticsUpdateValidator,
	runValidation,
	editUserStatistics
);

/**
* @swagger
* paths:
*  /api/users/statistics/get/{id}:
*   get:
*     summary: Get User Statistics details by Id
*     tags : ["User-Statistics"]
*     description: Get User Statistics details
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
	fetchUserStatistics
);

/**
* @swagger
*  /api/users/statistics/getAll:
*   get:
*     summary: Get all user Statistics details
*     tags : ["User-Statistics"]
*     description: Get all user Statistics details
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
*  /api/users/statistics/delete/{id}/{type}:
*   delete:
*     summary: Delete User Statistics Details By Id
*     tags : ["User-Statistics"]
*     description: Delete User Statistics details
*     parameters:
*        - in: path
*          name: id
*          description: id 
*          type: integer
*          required: true
*        - in: path
*          name: type
*          description: type
*          type: string
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete(
	'/delete/:id/:type',
	deleteUserStatistics
);

/**
* @swagger
* paths:
*  /api/users/statistics/getUserById/{user_id}:
*   get:
*     summary: Get User Statistics details by User Id
*     tags : ["User-Statistics"]
*     description: Get User Statistics details
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
	'/getUserById/:user_id',
	fetchUserId
);

/**
* @swagger
*  /api/users/statistics/sportsCareer:
*   post:
*     summary: Add Sports Career details
*     description: Add Sports Career details
*     tags : ["User-Statistics"]
*     parameters:
*        - in: body
*          name: user statistics
*          description: To add the sports career details
*          schema:
*            type: object
*            required:
*              - user_id 
*              - sports_id 
*              - sports_career
*            properties: 
*              user_id:
*                type: string
*              sports_id:
*                type: integer
*              sports_career:
*                type: string
*     responses:
*       200:
*          description: Sports career details added Successfully
*/

router.post(
	'/sportsCareer',
	createSportsCareer
);

/**
* @swagger
*  /api/users/statistics/sportsCareers:
*   post:
*     summary: Add Sports Career details
*     description: Add Sports Career details
*     tags : ["User-Statistics"]
*     parameters:
*        - in: body
*          name: user statistics  
*          description: To add the sports careers details
*          schema:
*            type: object
*            required:
*              - user_id 
*              - sports_careers 
*            properties: 
*              user_id:
*                type: string
*              sports_careers:
*                type: string
*     responses:
*       200:
*          description: Sports careers added Successfully
*/

router.post(
	'/sportsCareers',
	createSportsCareers
);

module.exports = router;