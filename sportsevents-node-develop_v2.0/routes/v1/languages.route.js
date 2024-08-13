const express = require("express");
const {
  createLanguage,
  editLanguage,
  fetchLanguage,
  deleteLanguage,
  fetchAllLanguage,
} = require("../../controllers/languages.controller");

const router = express.Router();

const { runValidation } = require('../../validations');
const { languagesCreateValidator, languagessUpdateValidator } = require('../../validations/languages');

/**
* @swagger
*  /api/languages:
*   post:
*     summary: Add Languages details
*     description: Add new Languages details
*     tags : ["Languages"]
*     parameters:
*        - in: body
*          name: languages  
*          description: To add the languages details
*          schema:
*            type:  object
*            required:
*              - language_code 
*              - language_name 
*              - created_by 
*            properties: 
*              language_code:
*                type: string
*              language_name:
*                type: string
*              created_by:
*                type: string
*     responses:
*       200:
*          description: Languages added Successfully
*/

router.post(
	'/',
	languagesCreateValidator,
	runValidation,
	createLanguage
);

/**
* @swagger
*  /api/languages:
*   put:
*     summary: Edit Languages details
*     description: Edit Languages details
*     tags : ["Languages"]
*     parameters:
*        - in: body
*          name: languages  
*          description: To edit the languages details
*          schema:
*            type:  object
*            required:
*              - language_code 
*              - language_name 
*              - updated_by 
*              - language_id 
*            properties: 
*              language_code:
*                type: string
*              language_name:
*                type: string
*              updated_by:
*                type: string
*              language_id:
*                type: integer
*     responses:
*       200:
*          description: Languages added Successfully
*/

router.put(
	'/',
	languagessUpdateValidator,
	runValidation,
	editLanguage
);

/**
* @swagger
* paths:
*  /api/languages/getById/{language_id}:
*   get:
*     summary: Get Languages details by language id
*     tags : ["Languages"]
*     description: Get Languages details By language id
*     parameters:
*        - in: path
*          name: language_id
*          description: language_id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get("/getById/:language_id", fetchLanguage);

/**
* @swagger
* paths:
*  /api/languages/deleteById/{language_id}:
*   delete:
*     summary: Delete Languages Details By Id
*     tags : ["Languages"]
*     description: Delete Languages details
*     parameters:
*        - in: path
*          name: language_id
*          description: language id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete("/deleteById/:language_id", deleteLanguage);

/**
* @swagger
*  /api/languages/getAll:
*   get:
*     summary: Get all Languages details
*     tags : ["Languages"]
*     description: Get Event Organizer  details
*     responses:
*       200:
*         description: Success
*/

router.get("/getAll", fetchAllLanguage);

module.exports = router;
