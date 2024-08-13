const express = require("express");
const {
  create,
  edit,
  deleteById,
  fetchAll,
  getById,
} = require("../../controllers/eventSponsorType.controller");

const { runValidation } = require("../../validations");
const {
  eventSponsorTypeCreateValidator,
  eventSponsorTypeUpdateValidator,
} = require("../../validations/eventSponsorType");
const router = express.Router();

/**
 * @swagger
 *  /api/event-sponsor-type/getAll:
 *   get:
 *     summary: Get all event Sponsor type details
 *     tags : ["Event-Sponsor-Type"]
 *     description: Get event Sponsor Type  details
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getAll", fetchAll);

/**
 * @swagger
 * paths:
 *  /api/event-sponsor-type/get/{event_sponsor_type_id}:
 *   get:
 *     summary: Get event Sponsor type details by event_sponsor_type_id
 *     tags : ["Event-Sponsor-Type"]
 *     description: Get event Sponsor Type details by event_sponsor_type_id
 *     parameters:
 *        - in: path
 *          name: event_sponsor_type_id
 *          description: event_sponsor_type_id
 *          type: integer
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/get/:event_sponsor_type_id", getById);

/**
 * @swagger
 *  /api/event-sponsor-type:
 *   post:
 *     summary: Add event Sponsor Type details
 *     description: Add event Sponsor-Type details
 *     tags : ["Event-Sponsor-Type"]
 *     parameters:
 *        - in: body
 *          name: Event-Sponsor-Type
 *          description: To add the event sponsor Type details
 *          schema:
 *            type: object
 *            required:
 *              - event_sponsor_type_name
 *              - event_id
 *            properties:
 *              event_sponsor_type_name:
 *                type: string
 *              event_id:
 *                type: uuid
 *              sort_order:
 *                type: integer
 *              is_deleted:
 *                type: boolean
 *
 *     responses:
 *       200:
 *          description: Event Sponsor Type details Added Successfully
 */

router.post("/", eventSponsorTypeCreateValidator, runValidation, create);

/**
 * @swagger
 *  /api/event-sponsor-type:
 *   put:
 *     summary: Edit Event Sponsor Type details
 *     description: Edit event Sponsor-Type details
 *     tags : ["Event-Sponsor-Type"]
 *     parameters:
 *        - in: body
 *          name: Event-Sponsor-Type
 *          description: To add the event sponsor Type details
 *          schema:
 *            type: object
 *            required:
 *              - event_sponsor_type_name
 *              - event_id
 *              - event_sponsor_type_id
 *            properties:
 *              event_sponsor_type_name:
 *                type: string
 *              event_id:
 *                type: uuid
 *              sort_order:
 *                type: integer
 *              is_deleted:
 *                type: boolean
 *              event_sponsor_type_id:
 *                type:integer
 *     responses:
 *       200:
 *          description: Event Sponsor Type details edited Successfully
 */

router.put("/", eventSponsorTypeUpdateValidator, runValidation, edit);

/**
 * @swagger
 * paths:
 *  /api/event-sponsor-type/delete/{event_sponsor_type_id}:
 *   delete:
 *     summary: Delete Event Sponsor info Details By event_sponsor_type_id
 *     tags : ["Event-Sponsor-Type"]
 *     description: Delete Event Sponsor info details By event_sponsor_type_id
 *     parameters:
 *        - in: path
 *          name: event_sponsor_type_id
 *          description: event_sponsor_type_id
 *          type: integer
 *          required: true
 *     responses:
 *       200:
 *         description: Deleted Successfully
 */

router.delete("/delete/:event_sponsor_type_id", deleteById);
module.exports = router;
