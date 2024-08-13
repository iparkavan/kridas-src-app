const express = require('express');
const { createLookupTable,editLookupTable,fetchLookupTable,deleteLookupTable ,fetchLookupKeyAndType,fetchByType} = require('../../controllers/lookupTable.controller');
const { runValidation } = require('../../validations');
const { lookupTableCreateValidator,lookupTableUpdateValidator } = require('../../validations/lookupTable');
const router = express.Router();

/**
* @swagger
*  /api/lookup-table:
*   post:
*     summary: Add Lookup Table details
*     description: Add new Lookup Table details
*     tags : ["Lookup Table"]
*     parameters:
*        - in: body
*          name: lookup table add  
*          description: To add the lookup-table details
*          schema:
*            type:  object
*            required:
*              - lookup_key 
*              - lookup_value
*              - lookup_type 
*            properties: 
*              lookup_key:
*                type: string
*              lookup_value:
*                type: string
*              lookup_type:
*                type: string
*     responses:
*       200:
*          description: lookup table details added Successfully
*/


router.post(
	'/',
	lookupTableCreateValidator,
	runValidation,
	createLookupTable
);

/**
* @swagger
*  /api/lookup-table:
*   put:
*     summary: Edit Lookup Table details
*     description: Edit new Lookup Table details
*     tags : ["Lookup Table"]
*     parameters:
*        - in: body
*          name: lookup table edit  
*          description: To edit the lookup-table details
*          schema:
*            type:  object
*            required:
*              - lookup_key 
*              - lookup_value
*              - lookup_type 
*            properties: 
*              lookup_key:
*                type: string
*              lookup_value:
*                type: string
*              lookup_type:
*                type: string
*     responses:
*       200:
*          description: lookup table details added Successfully
*/

router.put(
	'/',
	lookupTableUpdateValidator,
	runValidation,
	editLookupTable
);

/**
* @swagger
* paths:
*  /api/lookup-table/get/{key}:
*   get:
*     summary: Get Lookup Table details by Key
*     tags : ["Lookup Table"]
*     description: Get Lookup Table details
*     parameters:
*        - in: path
*          name: key
*          description: lookup table key
*          type: string
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
	'/get/:key',
	fetchLookupTable
);

/**
* @swagger
* paths:
*  /api/lookup-table/get/{key}/{type}:
*   get:
*     summary: Get Lookup Table details by Key and Type
*     tags : ["Lookup Table"]
*     description: Get Lookup Table details
*     parameters:
*        - in: path
*          name: key
*          description: lookup table key
*          type: string
*          required: true
*        - in: path
*          name: type
*          description: lookup table type
*          type: string
*          required: true
*     responses:
*       200:
*         description: Success
*/


router.get(
	'/get/:key/:type',
	fetchLookupKeyAndType
);


/**
* @swagger
* paths:
*  /api/lookup-table/getByType/{type}:
*   get:
*     summary: Get Lookup Table details by Type
*     tags : ["Lookup Table"]
*     description: Get Lookup Table details
*     parameters:
*        - in: path
*          name: type
*          description: lookup table type
*          type: string
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
	'/getByType/:type',
	fetchByType
);

/**
* @swagger
* paths:
*  /api/lookup-table/delete/{key}/{type}:
*   delete:
*     summary: Delete Lookup Table details by Key and Type
*     tags : ["Lookup Table"]
*     description: Delete Lookup Table details
*     parameters:
*        - in: path
*          name: key
*          description: lookup table key
*          type: string
*          required: true
*        - in: path
*          name: type
*          description: lookup table type
*          type: string
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully
*/

router.delete(
	'/delete/:key/:type',
	deleteLookupTable
);

module.exports = router;