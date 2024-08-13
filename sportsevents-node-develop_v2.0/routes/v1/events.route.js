const express = require("express");
const {
  createEvent,
  editEvent,
  fetchAll,
  fetchEvent,
  deleteEvent,
  searchEvent,
  customSearch,
  searchCompanyId,
  fetchEventData,
  publishEvent,
  searchByIsFeature,
  searchParticipatedEventByCompanyId,
  updateIsFeature,
  searchAllEvents,
} = require("../../controllers/events.controller");
const { runValidation } = require("../../validations");
const {
  eventCreateValidator,
  eventUpdateValidator,
  eventCompanyValidator,
  eventUserValidator,
} = require("../../validations/events");
const router = express.Router();
const multer = require("multer");
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

/**
 * @swagger
 *  /api/events:
 *   post:
 *     summary: Add Events details
 *     description: Add new Events details
 *     tags : ["Events"]
 *     parameters:
 *        - in: body
 *          name: event
 *          description: To add the event details
 *          schema:
 *            type: object
 *            required:
 *              - event_id
 *              - event_contacts
 *              - event_name
 *              - event_short_desc
 *              - event_desc
 *              - parent_event_id
 *              - event_startdate
 *              - event_enddate
 *              - event_reg_startdate
 *              - event_reg_lastdate
 *              - event_regfee
 *              - event_regfee_currency
 *              - event_banner
 *              - event_banner_meta
 *              - event_logo
 *              - event_logo_meta
 *              - event_status
 *              - event_rules
 *              - is_public_event
 *              - event_venue
 *              - event_venue_other
 *              - virtual_venue_url
 *              - standard_playing_conditions
 *              - standard_event_rules
 *              - indemnity_clause
 *              - agree_to_terms
 *              - search_tags
 *              - location_code
 *              - is_featured
 *              - stream_url
 *            properties:
 *              event_id:
 *                type: string
 *              event_contacts:
 *                type: object
 *              event_name:
 *                type: string
 *              event_short_desc:
 *                type: string
 *              event_desc:
 *                type: string
 *              parent_event_id:
 *                type: string
 *              event_startdate:
 *                type: string
 *              event_enddate:
 *                type: string
 *              event_reg_startdate:
 *                type: string
 *              event_reg_lastdate:
 *                type: string
 *              event_regfee:
 *                type: integer
 *              event_regfee_currency:
 *                type: string
 *              event_banner:
 *                type: string
 *              event_banner_meta:
 *                type: object
 *              event_logo:
 *                type: string
 *              event_logo_meta:
 *                type: object
 *              event_status:
 *                type: string
 *              event_rules:
 *                type: string
 *              is_public_event:
 *                type: string
 *              collect_pymt_online:
 *                type: string
 *              collect_pymt_offline:
 *                type: string
 *              event_venue:
 *                type: string
 *              event_venue_other:
 *                type: object
 *              virtual_venue_url:
 *                type: string
 *              standard_playing_conditions:
 *                type: string
 *              standard_event_rules:
 *                type: string
 *              indemnity_clause:
 *                type: string
 *              agree_to_terms:
 *                type: object
 *              search_tags:
 *                type: string
 *              location_code:
 *                type: string
 *              is_featured:
 *                type: boolean
 *              stream_url:
 *                type: object
 *     responses:
 *       200:
 *          description: events details added Successfully
 */

router.post(
  "/",
  upload.fields([
    {
      name: "event_banner",
      maxCount: 1,
    },
    {
      name: "event_logo",
      maxCount: 1,
    },
  ]),
  eventCreateValidator,
  runValidation,
  createEvent
);

/**
 * @swagger
 *  /api/events:
 *   put:
 *     summary: Edit Event details
 *     description: Edit Event details
 *     tags : ["Events"]
 *     parameters:
 *        - in: body
 *          name: event
 *          description: To edit the event details
 *          schema:
 *            type: object
 *            required:
 *              - event_id
 *              - event_contacts
 *              - event_name
 *              - event_short_desc
 *              - event_desc
 *              - parent_event_id
 *              - event_startdate
 *              - event_enddate
 *              - event_reg_startdate
 *              - event_reg_lastdate
 *              - event_regfee
 *              - event_regfee_currency
 *              - event_banner
 *              - event_banner_meta
 *              - event_logo
 *              - event_logo_meta
 *              - event_status
 *              - event_rules
 *              - is_public_event
 *              - event_venue
 *              - event_venue_other
 *              - virtual_venue_url
 *              - standard_playing_conditions
 *              - standard_event_rules
 *              - indemnity_clause
 *              - agree_to_terms
 *              - search_tags
 *              - location_code
 *              - is_featured
 *              - stream_url
 *            properties:
 *              event_id:
 *                type: string
 *              event_contacts:
 *                type: object
 *              event_name:
 *                type: string
 *              event_short_desc:
 *                type: string
 *              parent_event_id:
 *                type: string
 *              event_startdate:
 *                type: string
 *              event_enddate:
 *                type: string
 *              event_reg_startdate:
 *                type: string
 *              event_reg_lastdate:
 *                type: string
 *              event_regfee:
 *                type: integer
 *              event_regfee_currency:
 *                type: string
 *              event_banner:
 *                type: string
 *              event_banner_meta:
 *                type: object
 *              event_logo:
 *                type: string
 *              event_logo_meta:
 *                type: object
 *              event_status:
 *                type: string
 *              event_rules:
 *                type: string
 *              is_public_event:
 *                type: string
 *              collect_pymt_online:
 *                type: string
 *              collect_pymt_offline:
 *                type: string
 *              event_venue:
 *                type: string
 *              event_venue_other:
 *                type: object
 *              virtual_venue_url:
 *                type: string
 *              standard_playing_conditions:
 *                type: string
 *              standard_event_rules:
 *                type: string
 *              indemnity_clause:
 *                type: string
 *              agree_to_terms:
 *                type: object
 *              search_tags:
 *                type: string
 *              location_code:
 *                type: string
 *              is_featured:
 *                type: boolean
 *              stream_url:
 *                type: object
 *     responses:
 *       200:
 *          description: events details edited Successfully
 */

router.put(
  "/",
  upload.fields([
    {
      name: "event_banner",
      maxCount: 1,
    },
    {
      name: "event_logo",
      maxCount: 1,
    },
  ]),
  eventUpdateValidator,
  runValidation,
  editEvent
);

/**
 * @swagger
 * paths:
 *  /api/events/get/{event_id}:
 *   get:
 *     summary: Get Events details by Id
 *     tags : ["Events"]
 *     description: Get Events details
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

router.get("/get/:event_id", fetchEvent);

/**
 * @swagger
 * paths:
 *  /api/events/delete/{event_id}:
 *   delete:
 *     summary: Delete Events Details By Event Id
 *     tags : ["Events"]
 *     description: Delete Events Details By Event Id
 *     parameters:
 *        - in: path
 *          name: event_id
 *          description: event_id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Deleted Successfully
 */

router.delete("/delete/:event_id", deleteEvent);

/**
 * @swagger
 *  /api/events/getAll:
 *   get:
 *     summary: Get all Events details
 *     tags : ["Events"]
 *     description: Get Events details
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getAll", fetchAll);

/**
 * @swagger
 *  /api/events/search:
 *   post:
 *     summary: Event - Search
 *     description: Event - Search
 *     tags : ["Events"]
 *     parameters:
 *        - in: body
 *          name: event
 *          description: events - search
 *          schema:
 *            type: object
 *            required:
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *              event_name:
 *                type: string
 *              sport_ids:
 *                type: string
 *              start_date:
 *                type: string
 *              end_date:
 *                type: string
 *              category_id:
 *                type: integer
 *              is_past:
 *                type: boolean
 *              type:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post("/search", searchEvent);

/**
 * @swagger
 *  /api/events/searchParticipated:
 *   post:
 *     summary: Event Search Participated
 *     description: Event Search Participated
 *     tags : ["Events"]
 *     parameters:
 *        - in: body
 *          name: event
 *          description: events - search participated
 *          schema:
 *            type: object
 *            required:
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *              company_id:
 *                type: string
 *              event_name:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/searchParticipated",
  eventCompanyValidator,
  runValidation,
  searchParticipatedEventByCompanyId
);

/**
 * @swagger
 *  /api/events/searchCompany:
 *   post:
 *     summary: Event Search Company
 *     description: Event Search Company
 *     tags : ["Events"]
 *     parameters:
 *        - in: body
 *          name: event
 *          description: events - search company
 *          schema:
 *            type: object
 *            required:
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *              company_id:
 *                type: string
 *              sport_ids:
 *                type: string
 *              event_name:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/searchCompany",
  eventCompanyValidator,
  runValidation,
  searchCompanyId
);

/**
 * @swagger
 *  /api/events/customSearch:
 *   post:
 *     summary: Event Custom Search
 *     description: Event Custom Search
 *     tags : ["Events"]
 *     parameters:
 *        - in: body
 *          name: event
 *          description: To search custom event details
 *          schema:
 *            type: object
 *            required:
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *              user_id:
 *                type: string
 *              sport_ids:
 *                type: string
 *              event_status:
 *                type: string
 *              type:
 *                type: string
 *              start_date:
 *                type: string
 *              end_date:
 *                type: string
 *              is_past:
 *                type: string
 *              category_id:
 *                type: integer
 *     responses:
 *       200:
 *          description: Success
 */

router.post("/customSearch", eventUserValidator, runValidation, customSearch);

/**
 * @swagger
 *  /api/events/searchEvent:
 *   post:
 *     summary: Event - Search event details
 *     description: Event - Search event details
 *     tags : ["Events"]
 *     parameters:
 *        - in: body
 *          name: event
 *          description: search event details
 *          schema:
 *            type: object
 *            required:
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *     responses:
 *       200:
 *          description: Success
 */

router.post("/searchEvent", searchAllEvents);

/**
 * @swagger
 * paths:
 *  /api/events/getEventData/{event_id}:
 *   get:
 *     summary: Get Events details by Event Id
 *     tags : ["Events"]
 *     description: Get Events details by Event Id
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

router.get("/getEventData/:event_id", fetchEventData);

/**
 * @swagger
 *  /api/events/updateIsFeature:
 *   put:
 *     summary: Event - Update IsFeature
 *     description: Event - Update IsFeature
 *     tags : ["Events"]
 *     parameters:
 *        - in: body
 *          name: event
 *          description: event is feature
 *          schema:
 *            type: object
 *            required:
 *              - event_id
 *              - is_featured
 *            properties:
 *              is_featured:
 *                type: boolean
 *              event_id:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.put("/updateIsFeature/", updateIsFeature);

/**
 * @swagger
 *  /api/events/publishEvent:
 *   post:
 *     summary: Events - publishEvent
 *     description: Events - publishEvent
 *     tags : ["Events"]
 *     parameters:
 *        - in: body
 *          name: event
 *          description:  Events - publish Event
 *          schema:
 *            type: object
 *            required:
 *              - event_contacts
 *              - event_name
 *              - event_short_desc
 *              - event_desc
 *              - parent_event_id
 *              - event_startdate
 *              - event_enddate
 *              - event_reg_startdate
 *              - event_reg_lastdate
 *              - event_regfee
 *              - event_regfee_currency
 *              - event_status
 *              - event_rules
 *              - is_public_event
 *              - collect_pymt_online
 *              - collect_pymt_offline
 *              - event_venue
 *              - event_venue_other
 *              - virtual_venue_url
 *              - standard_playing_conditions
 *              - standard_event_rules
 *              - indemnity_clause
 *              - agree_to_terms
 *              - search_tags
 *              - location_code
 *              - stream_url
 *              - sports
 *              - company_id
 *              - event_category
 *              - sports
 *              - company_id
 *              - event_category
 *              - event_id
 *              - feed
 *              - socket_request
 *            properties:
 *              event_contacts:
 *                type: object
 *              event_name:
 *                type: string
 *              event_short_desc:
 *                type: string
 *              event_desc:
 *                type: string
 *              parent_event_id:
 *                type: string
 *              event_startdate:
 *                type: string
 *              event_enddate:
 *                type: string
 *              event_reg_startdate:
 *                type: string
 *              event_reg_lastdate:
 *                type: string
 *              event_regfee:
 *                type: integer
 *              event_regfee_currency:
 *                type: string
 *              event_status:
 *                type: string
 *              event_rules:
 *                type: string
 *              is_public_event:
 *                type: string
 *              collect_pymt_online:
 *                type: string
 *              collect_pymt_offline:
 *                type: string
 *              event_venue:
 *                type: string
 *              event_venue_other:
 *                type: object
 *              virtual_venue_url:
 *                type: string
 *              standard_playing_conditions:
 *                type: string
 *              standard_event_rules:
 *                type: string
 *              indemnity_clause:
 *                type: string
 *              agree_to_terms:
 *                type: object
 *              search_tags:
 *                type: string
 *              location_code:
 *                type: string
 *              stream_url:
 *                type: object
 *              sports:
 *                type: array
 *              company_id:
 *                type: string
 *              event_category:
 *                type: string
 *              event_id:
 *                type: string
 *              feed:
 *                type: string
 *              socket_request:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/publishEvent",
  upload.fields([
    {
      name: "event_banner",
      maxCount: 1,
    },
    {
      name: "event_logo",
      maxCount: 1,
    },
  ]),
  eventCreateValidator,
  runValidation,
  publishEvent
);

/**
 * @swagger
 *  /api/events/searchIsFeature:
 *   post:
 *     summary: Event Search IsFeature
 *     description: Event Search IsFeature
 *     tags : ["Events"]
 *     parameters:
 *        - in: body
 *          name: event
 *          description: event search isfeature
 *          schema:
 *            type: object
 *            required:
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *              is_feature:
 *                type: boolean
 *     responses:
 *       200:
 *          description: Success
 */

router.post("/searchIsFeature", searchByIsFeature);

module.exports = router;
