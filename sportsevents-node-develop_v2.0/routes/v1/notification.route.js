const express = require("express");
const router = express.Router();
const {
  getByUserId,
  searchByUserId,
  updateNotification,
  search,
} = require("../../controllers/notification.controller");


/**
* @swagger
* paths:
*  /api/notification/getByUserId/{id}:
*   get:
*     summary: Get Event Organizer details by Id
*     tags : ["Notification"]
*     description: Get Notification details
*     parameters:
*        - in: path
*          name: id
*          description: id
*          type: string
*          required: true
*     responses:
*       200:
*         description: Success
*/


router.get(
    '/getByUserId/:id',
    getByUserId
);

/**
* @swagger
*  /api/notification/searchByUserId:
*   post:
*     summary: Search Notification Details
*     description: Search Notification Details
*     tags : ["Notification"]
*     parameters:
*        - in: body
*          name: search notification  
*          description: search notification
*          schema:
*            type: object
*            required:
*              - user_id 
*            properties: 
*              user_id:
*                type: string
*     responses:
*       200:
*          description: Success
*/

router.post(
    '/searchByUserId',
    searchByUserId
);

/**
* @swagger
*  /api/notification/makeAllRead:
*   put:
*     summary: notification mark all read
*     tags : ["Notification"]
*     description: notification mark all read
*     parameters:
*        - in: body
*          name: notification mark all read 
*          description: notification mark all read
*          schema:
*            type: object
*            required:
*              - user_id 
*            properties: 
*              user_id:
*                type: string
*     responses:
*       200:
*          description: mark all as read 
*/

router.put(
    '/makeAllRead',
    updateNotification
);

router.get("/getByUserId/:id", getByUserId);

router.post("/search", search);


router.post("/searchByUserId", searchByUserId);

router.put("/makeAllRead", updateNotification);

module.exports = router;
