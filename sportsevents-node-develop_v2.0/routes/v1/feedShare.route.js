const express = require("express");
const {
  createFeedShare,
  fetchAll,
  deleteFeedShare,
} = require("../../controllers/feedShare.controller");
const router = express.Router();


/**
* @swagger
*  /api/feed-share:
*   post:
*     summary: Add Feed Share details
*     description: Add Feed Share details
*     tags : ["Feed-Share"]
*     parameters:
*        - in: body
*          name: feed share  
*          description: To add the feed-share details
*          schema:
*            type: object
*            required:
*              - share_creator_user_id 
*              - share_creator_company_id 
*              - shared_feed_id 
*              - feed_id
*            properties: 
*              share_creator_user_id:
*                type: string
*              share_creator_company_id:
*                type: string
*              shared_feed_id:
*                type: string
*              feed_id:
*                type: string
*     responses:
*       200:
*          description: feed share details added Successfully
*/


router.post("/", createFeedShare);

/**
* @swagger
*  /api/feed-share/getAll:
*   get:
*     summary: Get all Feed Share details
*     tags : ["Feed-Share"]
*     description: Get Feed Share details
*     responses:
*       200:
*         description: Success
*/


router.get("/getAll", fetchAll);

/**
* @swagger
* paths:
*  /api/feed-share/delete/{feed_share_id}:
*   delete:
*     summary: Delete Event Organizer Details By Id
*     tags : ["Feed-Share"]
*     description: Delete Feed Share details
*     parameters:
*        - in: path
*          name: feed_share_id
*          description: feed share id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/


router.delete("/delete/:feed_share_id", deleteFeedShare);

module.exports = router;
