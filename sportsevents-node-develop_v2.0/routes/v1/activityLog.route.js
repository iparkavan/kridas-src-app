const express = require("express");
const {
  createLog,
  fetchByIdAndType,
  fetchById,
  searchById,
  logOut,
  addActivityLog,
} = require("../../controllers/activityLog.controller");
const { runValidation } = require("../../validations");
const {
  logCreateValidator,
  logSearchValidator,
  logOutValidator,
} = require("../../validations/activityLog");
const router = express.Router();

/**
 * @swagger
 *  /api/activity-log:
 *   post:
 *     summary: Add Activity Log details
 *     description: Add new Activity Log details
 *     tags : ["Activity Log"]
 *     parameters:
 *        - in: body
 *          name: activity log
 *          description: To add the activity log registration details
 *          schema:
 *            type:  object
 *            required:
 *              - event_type
 *              - event_action
 *              - event_type_ref_id
 *              - user_id
 *              - company_id
 *              - additional_info
 *            properties:
 *              event_type:
 *                type: string
 *              event_action:
 *                type: string
 *              event_type_ref_id:
 *                type: string
 *              user_id:
 *                type: string
 *              company_id:
 *                type: string
 *              additional_info:
 *                type: object
 *     responses:
 *       200:
 *          description: Tournament player Registration added Successfully
 */

router.post("/", logCreateValidator, runValidation, createLog);

/**
 * @swagger
 *  /api/activity-log/log-out:
 *   post:
 *     summary: Add Activity Log logout
 *     description: Add new Activity Log logout
 *     tags : ["Activity Log"]
 *     parameters:
 *        - in: body
 *          name: activity log logout
 *          description: logout
 *          schema:
 *            type:  object
 *            required:
 *              - user_id
 *            properties:
 *              user_id:
 *                type: string
 *     responses:
 *       200:
 *          description: logout Successfully
 */

router.post("/log-out", logOutValidator, runValidation, logOut);

/**
 * @swagger
 * paths:
 *  /api/activity-log/getByIdAndType/{id}/{type}:
 *   get:
 *     summary: Get Activity Log details by Id and Type
 *     tags : ["Activity Log"]
 *     description: Get Activity log details
 *     parameters:
 *        - in: path
 *          name: id
 *          description: tournament player reg id
 *          type: string
 *          required: true
 *        - in: path
 *          name: type
 *          description: tournament player reg type
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getByIdAndType/:id/:type", fetchByIdAndType);

/**
 * @swagger
 * paths:
 *  /api/activity-log/getById/{id}:
 *   get:
 *     summary: Get Activity Log details by Id
 *     tags : ["Activity Log"]
 *     description: Get Activity log details
 *     parameters:
 *        - in: path
 *          name: id
 *          description: tournament player reg id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getById/:id", fetchById);

router.post("/searchById", logSearchValidator, runValidation, searchById);

router.post("/addActivityLog", addActivityLog);

module.exports = router;
