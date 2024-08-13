const express = require("express");
const {
  getByEventId,
  createEventSponsor,
  updateEventSponsor,
  getEventSponsor,
  getAllEventSponsor,
  deleteEventSponsor,
} = require("../../controllers/eventSponsor.controller");
const { runValidation } = require("../../validations");
const {
  eventSponsorCreateValidator,
  eventSponsorUpdateValidator,
} = require("../../validations/eventSponsor");

const router = express.Router();

/**
* @swagger
*  /api/event-sponsor:
*   post:
*     summary: Add Event Sponsor details
*     description:  Add Event Sponsor details
*     tags : ["Event-Sponsor"]
*     parameters:
*        - in: body
*          name: event sponsor  
*          description: To add the event-sponsor details
*          schema:
*            type: object
*            required:
*              - sponsor_id 
*              - event_id 
*              - is_featured 
*              - seq_number
*              - sponsor_type
*            properties: 
*              sponsor_id:
*                type: integer
*              event_id:
*                type: string
*              is_featured:
*                type: boolean
*              seq_number:
*                type: integer
*              sponsor_type:
*                type: string
*     responses:
*       200:
*          description: event sponsor details added Successfully
*/


router.post(
  "/",
  eventSponsorCreateValidator,
  runValidation,
  createEventSponsor
);


/**
* @swagger
*  /api/event-sponsor:
*   put:
*     summary: Add Event Sponsor details
*     description:  Add Event Sponsor details
*     tags : ["Event-Sponsor"]
*     parameters:
*        - in: body
*          name: event sponsor  
*          description: To add the event-sponsor details
*          schema:
*            type: object
*            required:
*              - sponsor_id 
*              - event_id 
*              - is_featured 
*              - seq_number
*              - sponsor_type
*              - event_sponsor_id
*            properties: 
*              sponsor_id:
*                type: integer
*              event_id:
*                type: string
*              is_featured:
*                type: boolean
*              seq_number:
*                type: integer
*              sponsor_type:
*                type: string
*              event_sponsor_id:
*                type: integer
*     responses:
*       200:
*          description: event sponsor details edited Successfully
*/


router.put("/", eventSponsorUpdateValidator, runValidation, updateEventSponsor);

/**
* @swagger
* paths:
*  /api/event-sponsor/getById/{event_sponsor_id}:
*   get:
*     summary: Get Event Sponsor details by Event Sponsor Id
*     tags : ["Event-Sponsor"]
*     description: Get Event Sponsor details
*     parameters:
*        - in: path
*          name: event_sponsor_id
*          description: event_sponsor_id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get("/getById/:event_sponsor_id", getEventSponsor);

/**
* @swagger
*  /api/event-sponsor/getAll:
*   get:
*     summary: Get all Event Sponsor details
*     tags : ["Event-Sponsor"]
*     description: Get Event Sponsor details
*     responses:
*       200:
*         description: Success
*/


router.get("/getAll", getAllEventSponsor);

/**
* @swagger
* paths:
*  /api/event-sponsor/getByEventId/{event_id}:
*   get:
*     summary: Get Event Sponsor details by Event Id
*     tags : ["Event-Sponsor"]
*     description: Get Event Sponsor details
*     parameters:
*        - in: path
*          name: event_id
*          description: event_id
*          type: string
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get("/getByEventId/:event_id", getByEventId);


/**
* @swagger
* paths:
*  /api/event-sponsor/deleteById/{event_sponsor_id}:
*   delete:
*     summary: Delete Event Sponsor Details By Event sponsor Id
*     tags : ["Event-Sponsor"]
*     description: Delete Event Sponsor details
*     parameters:
*        - in: path
*          name: event_sponsor_id
*          description: event_sponsor_id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/


router.delete("/deleteById/:event_sponsor_id", deleteEventSponsor);

module.exports = router;
