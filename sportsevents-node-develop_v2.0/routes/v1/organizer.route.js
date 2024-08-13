const express = require('express');
const router = express.Router();
// const router = require('.');
const { create, getById, fetchAll, deleteById } = require('../../controllers/organizer.controller');
const { runValidation } = require('../../validations');
const { organizerUpdateValidator } = require('../../validations/organizer');

/**
* @swagger
*  /api/organizer:
*   post:
*     summary: Add Organizer details
*     description: Add new Organizer details
*     tags : ["Organizer"]
*     parameters:
*        - in: body
*          name: organizer  
*          description: To add the organizer details
*          schema:
*            type:  object
*            required:
*              - company_refid 
*              - user_refid 
*            properties: 
*              company_refid:
*                type: string
*              user_refid:
*                type: string
*     responses:
*       200:
*          description: Organizer details added Successfully
*/

router.post(
    '/',
    create
);

/**
* @swagger
*  /api/organizer:
*   put:
*     summary: Edit Organizer details
*     description: Edit new Organizer details
*     tags : ["Organizer"]
*     parameters:
*        - in: body
*          name: organizer  
*          description: To edit the organizer details
*          schema:
*            type: object
*            required:
*              - company_refid 
*              - user_refid 
*              - organizer_id 
*            properties: 
*              company_refid:
*                type: string
*              user_refid:
*                type: string
*              organizer_id:
*                type: integer
*     responses:
*       200:
*          description: Organizer details edited Successfully
*/


// router.put(
//     '/',
//     organizerUpdateValidator,
//     runValidation,
//     editOrganizer

// );

/**
* @swagger
* paths:
*  /api/organizer/get/{id}:
*   get:
*     summary: Get Organizer details by Id
*     tags : ["Organizer"]
*     description: Get Organizer details
*     parameters:
*        - in: path
*          name: id
*          description: organizer_id
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
*  /api/organizer/getAll:
*   get:
*     summary: Get all Organizer details
*     tags : ["Organizer"]
*     description: Get Organizer  details
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
*  /api/organizer/delete/{id}:
*   delete:
*     summary: Delete Organizer Details By Id
*     tags : ["Organizer"]
*     description: Delete Organizer details
*     parameters:
*        - in: path
*          name: id
*          description: organizer id 
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