const express = require('express');
const { insertLookupType,editLookupType,fetchLookupType,deleteLookupType,fetchAll } = require('../../controllers/lookupType.controller');
const { runValidation } = require('../../validations');
const { lookupTypeCreateValidator } = require('../../validations/lookupType');
const router = express.Router();

/**
* @swagger
*  /api/lookup-type:
*   post:
*     summary: Add Lookup Type details
*     description: Add new Lookup Type details
*     tags : ["Lookup Type"]
*     parameters:
*        - in: body
*          name: lookup type  
*          description: To add the lookup-type details
*          schema:
*            type:  object
*            required:
*              - lookup_type 
*              - lookup_desc 
*            properties: 
*              lookup_type:
*                type: string
*              lookup_desc:
*                type: string
*     responses:
*       200:
*          description: lookup type details added Successfully
*/

router.post(
	'/',
	lookupTypeCreateValidator,
	runValidation,
	insertLookupType
);

/**
* @swagger
*  /api/lookup-type:
*   put:
*     summary: Edit Lookup Type details
*     description: Edit new Lookup Type details
*     tags : ["Lookup Type"]
*     parameters:
*        - in: body
*          name: lookup type  
*          description: To edit the lookup-type details
*          schema:
*            type:  object
*            required:
*              - lookup_type 
*              - lookup_desc 
*            properties: 
*              lookup_type:
*                type: string
*              lookup_desc:
*                type: string
*     responses:
*       200:
*          description: lookup type details edited Successfully
*/


router.put(
	'/',
	lookupTypeCreateValidator,
	runValidation,
	editLookupType
);

/**
* @swagger
* paths:
*  /api/lookup-type/get/{type}:
*   get:
*     summary: Get Lookup Type details by Id
*     tags : ["Lookup Type"]
*     description: Get Lookup Type details
*     parameters:
*        - in: path
*          name: type
*          description: lookup type
*          type: string
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
	'/get/:type',
	fetchLookupType
);

/**
* @swagger
*  /api/lookup-type/getAll:
*   get:
*     summary: Get all Lookup-type details
*     tags : ["Lookup Type"]
*     description: Get Lookup-type  details
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
*  /api/lookup-type/delete/{type}:
*   delete:
*     summary: Delete Lookup Type Details By type
*     tags : ["Lookup Type"]
*     description: Delete Lookup Type details
*     parameters:
*        - in: path
*          name: type
*          description: lookup type 
*          type: string
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete(
	'/delete/:type',
	deleteLookupType
);


module.exports = router;