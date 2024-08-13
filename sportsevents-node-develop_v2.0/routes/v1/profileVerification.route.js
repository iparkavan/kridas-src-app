const express = require('express');
const { runValidation } = require('../../validations');
const {createProfileVerification,fetchAll,fetchProfileVerificationBasedOnId,fetchProfileVerification,deleteProfileVerification,editProfileVerification, fetchByUserId}=require('../../controllers/profileVerification.controller')
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
*  /api/profile-verification:
*   post:
*     summary: Add Profile Verification details
*     description: Add Profile Verification details
*     tags : ["Profile-Verification"]
*     parameters:
*        - in: body
*          name: profile verification  
*          description: To Add Profile Verification details
*          schema:
*            type: object
*            required:
*              - company_id 
*              - user_id 
*              - applied_status 
*              - verification_comments
*              - status_change_date
*            properties: 
*              company_id:
*                type: string
*              user_id:
*                type: string
*              applied_status:
*                type: string
*              verification_comments:
*                type: string
*              status_change_date:
*                type: string
*     responses:
*       200:
*          description: profile verification details added Successfully
*/

router.post(
	'/',
	upload.fields([{
		name: 'address_proof', maxCount: 1,
	},
	{
		name: 'id_proof', maxCount: 1,
	}
	]),
	createProfileVerification
);

/**
* @swagger
*  /api/profile-verification:
*   put:
*     summary: Edit Profile Verification details
*     description: Edit Profile Verification details
*     tags : ["Profile-Verification"]
*     parameters:
*        - in: body
*          name: profile verification  
*          description: To Edit Profile Verification details
*          schema:
*            type: object
*            required:
*              - company_id 
*              - user_id 
*              - applied_status 
*              - verification_comments
*              - status_change_date
*              - profile_verification_id
*            properties: 
*              company_id:
*                type: string
*              user_id:
*                type: string
*              applied_status:
*                type: string
*              verification_comments:
*                type: string
*              status_change_date:
*                type: string
*              profile_verification_id:
*                type: integer
*     responses:
*       200:
*          description: profile verification details edited Successfully
*/


router.put(
	'/',
	editProfileVerification
);

/**
* @swagger
* paths:
*  /api/profile-verification/get/{id}:
*   get:
*     summary: Get Profile Verification details by Id
*     tags : ["Profile-Verification"]
*     description: Get Profile Verification details
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
	fetchProfileVerification
);

/**
* @swagger
*  /api/profile-verification/getAll:
*   get:
*     summary: Get all Profile verification details
*     tags : ["Profile-Verification"]
*     description: Get all Profile verification details
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
*  /api/profile-verification/delete/{id}:
*   delete:
*     summary: Delete Profile Verification Details By Id
*     tags : ["Profile-Verification"]
*     description: Delete Profile Verification details
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
	deleteProfileVerification
);

/**
* @swagger
* paths:
*  /api/profile-verification/getByUserId/{user_id}/{applied_status}:
*   get:
*     summary: Get Profile Verification details by User Id and Applied Status
*     tags : ["Profile-Verification"]
*     description: Get Profile Verification details
*     parameters:
*        - in: path
*          name: user_id
*          description: user_id
*          type: string
*          required: true
*        - in: path
*          name: applied_status
*          description: applied_status
*          type: string
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
	'/getByUserId/:user_id/:applied_status?',
	fetchByUserId
);

/**
* @swagger
* paths:
*  /api/profile-verification/getByType/{type}/{id}:
*   get:
*     summary: Get Profile Verification details by Type and Id
*     tags : ["Profile-Verification"]
*     description: Get Profile Verification details
*     parameters:
*        - in: path
*          name: type
*          description: type
*          type: string
*          required: true
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
	'/getByType/:type/:id',
	fetchProfileVerificationBasedOnId
);

module.exports = router;