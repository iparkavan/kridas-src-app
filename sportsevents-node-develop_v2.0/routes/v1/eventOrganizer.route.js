const express = require('express');
const { createEventOrganizer, editEventOrganizer, fetchEventOrganizer, fetchAll, deleteEventOrganizer } = require('../../controllers/eventOrganizer.controller')
const { runValidation } = require('../../validations');
const { eventOrganizerCreateValidator, eventOrganizerUpdateValidator } = require('../../validations/eventOrganizer');
const router = express.Router();


/**
* @swagger
*  /api/event-organizer:
*   post:
*     summary: Add Event Organizer details
*     description: Add Event Organizer details
*     tags : ["Event-Organizer"]
*     parameters:
*        - in: body
*          name: event organizer  
*          description: To add the event-organizer details
*          schema:
*            type: object
*            required:
*              - event_refid 
*              - tournament_refid 
*              - organizer_refid 
*              - organizer_role
*            properties: 
*              event_refid:
*                type: string
*              tournament_refid:
*                type: integer
*              organizer_refid:
*                type: integer
*              organizer_role:
*                type: string
*     responses:
*       200:
*          description: event organizer details added Successfully
*/

router.post(
    '/',
    eventOrganizerCreateValidator,
    runValidation,
    createEventOrganizer
);

/**
* @swagger
* paths:
*  /api/event-organizer/get/{event_organizer_id}:
*   get:
*     summary: Get Event Organizer details by Id
*     tags : ["Event-Organizer"]
*     description: Get Event Organizer details
*     parameters:
*        - in: path
*          name: event_organizer_id
*          description: event_organizer_id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
    '/get/:event_organizer_id',
    fetchEventOrganizer
);

/**
* @swagger
*  /api/event-organizer/getAll:
*   get:
*     summary: Get all Event Organizer details
*     tags : ["Event-Organizer"]
*     description: Get Event Organizer  details
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
*  /api/event-organizer:
*   put:
*     summary: Edit Event Organizer details
*     tags : ["Event-Organizer"]
*     description: Event Organizer Edit
*     parameters:
*        - in: body
*          name: event organizer 
*          description: To edit the Event Organizer details
*          schema:
*            type: object
*            required:
*              - event_refid 
*              - tournament_refid 
*              - organizer_refid 
*              - organizer_role
*              - event_organizer_id 
*            properties: 
*              event_refid:
*                type: string
*              tournament_refid:
*                type: integer
*              organizer_refid:
*                type: integer
*              organizer_role:
*                type: string
*              event_organizer_id:
*                type: integer
*     responses:
*       200:
*          description: Event Organizer edited successfully
*/

router.put(
    '/',
    eventOrganizerUpdateValidator,
    runValidation,
    editEventOrganizer
);

/**
* @swagger
* paths:
*  /api/event-organizer/delete/{event_organizer_id}:
*   delete:
*     summary: Delete Event Organizer Details By Id
*     tags : ["Event-Organizer"]
*     description: Delete Event Organizer details
*     parameters:
*        - in: path
*          name: event_organizer_id
*          description: event organizer id 
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete(
    "/delete/:event_organizer_id",
    deleteEventOrganizer
);

module.exports = router;