const express = require('express');
const {
  createUserDevice,
  fetchAll,
} = require('../../controllers/userDeviceToken.controller');
const { runValidation } = require('../../validations');
const {
  userDeviceTokenCreateValidator,
} = require('../../validations/userDeviceToken');
const router = express.Router();
const multer = require('multer');

/**
 * @swagger
 *  /api/userDeviceToken:
 *   post:
 *     summary: To Add a user device token
 *     description: To Add user device token for push notifications
 *     tags : ["UserDeviceToken"]
 *     parameters:
 *        - in: body
 *          name: UserDeviceToken
 *          description: To Add user device token for push notifications
 *          schema:
 *            type: object
 *            required:
 *              - user_id
 *              - device_token
 *            properties:
 *              user_id:
 *                type: string
 *              device_token:
 *                type: string
 *     responses:
 *       200:
 *          description: User device token details added successfully
 */
router.post(
  '/',
  userDeviceTokenCreateValidator,
  runValidation,
  createUserDevice
);

/**
 * @swagger
 *  /api/userDeviceToken/getAll:
 *   get:
 *     summary: Get all user device token details
 *     tags : ["UserDeviceToken"]
 *     description: Get user device token  details
 *     responses:
 *       200:
 *         description: Success
 */

router.get('/getAll', fetchAll);

module.exports = router;
