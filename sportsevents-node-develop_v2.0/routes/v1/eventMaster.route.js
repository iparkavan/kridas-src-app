const express = require('express');
const { createEventMaster, fetchEventMaster, fetchAll, editEventMaster, deleteEventMaster } = require('../../controllers/eventMaster.controller')
const { runValidation } = require('../../validations');
const { eventMasterCreateValidator, eventMasterUpdateValidator } = require('../../validations/eventMaster');
const router = express.Router();

/**
* @swagger
*  /api/event-master:
*   post:
*     summary: Add Event Master details
*     description: Add new Event Master details
*     tags : ["Event Master"]
*     parameters:
*        - in: body
*          name: event master  
*          description: To add the event-master details
*          schema:
*            type:  object
*            required:
*              - event_master_id 
*              - event_contacts 
*              - event_name 
*              - event_short_desc 
*              - event_desc
*              - event_type 
*              - event_category_refid 
*              - event_owner_id
*            properties: 
*              event_master_id:
*                type: string
*              event_contacts:
*                type: object
*              event_name:
*                type: string
*              event_short_desc:
*                type: string
*              event_desc:
*                type: string
*              event_type:
*                type: string
*              event_category_refid:
*                type: integer
*              event_owner_id:
*                type: integer
*     responses:
*       200:
*          description: event organizer details added Successfully
*/

router.post(
    '/',
    eventMasterCreateValidator,
    runValidation,
    createEventMaster
);

/**
* @swagger
* paths:
*  /api/event-master/get/{event_master_id}:
*   get:
*     summary: Get Event Master details by Id
*     tags : ["Event Master"]
*     description: Get Event Master details
*     parameters:
*        - in: path
*          name: event_master_id
*          description: event master id
*          type: string
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
    '/get/:event_master_id',
    fetchEventMaster
);

/**
* @swagger
*  /api/event-master/getAll:
*   get:
*     summary: Get all Event Master details
*     tags : ["Event Master"]
*     description: Get Event Master  details
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
*  /api/event-master:
*   put:
*     summary: Edit Event Master details
*     tags : ["Event Master"]
*     description: Event Master Edit
*     parameters:
*        - in: body
*          name: event master 
*          description: To edit the Event Master details
*          schema:
*            type:  object
*            required:
*              - event_contacts 
*              - event_name 
*              - event_short_desc 
*              - event_desc
*              - event_type 
*              - event_category_refid 
*              - event_owner_id 
*              - event_master_id 
*            properties: 
*              event_contacts:
*                type: object
*              event_name:
*                type: string
*              event_short_desc:
*                type: string
*              event_desc:
*                type: string
*              event_type:
*                type: string
*              event_category_refid:
*                type: integer
*              event_owner_id:
*                type: integer
*              event_master_id:
*                type: string
*     responses:
*       200:
*          description: Event Master edited successfully
*/

router.put(
    '/',
    eventMasterUpdateValidator,
    runValidation,
    editEventMaster
);

/**
* @swagger
* paths:
*  /api/event-master/delete/{event_master_id}:
*   delete:
*     summary: Delete Event Master Details By Id
*     tags : ["Event Master"]
*     description: Delete Event Master details
*     parameters:
*        - in: path
*          name: event_master_id
*          description: event Master id 
*          type: string
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete(
    "/delete/:event_master_id",
    deleteEventMaster
);

module.exports = router;