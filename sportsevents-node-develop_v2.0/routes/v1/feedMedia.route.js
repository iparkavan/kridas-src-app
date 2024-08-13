const express = require('express');
const { createFeedMedia, editFeedMedia, fetchFeedMedia, fetchAllFeedMedia, deleteFeedMedia, deleteFeedMediaByFeedId } = require('../../controllers/feedMedia.controller');
const { runValidation } = require('../../validations');
const { feedMediaCreateValidator, feedMediaUpdateValidator } = require('../../validations/feedMedia');
const router = express.Router();

/**
* @swagger
*  /api/feed-media:
*   post:
*     summary: Add Feed Media details
*     description: Add Feed Media details
*     tags : ["Feed-Media"]
*     parameters:
*        - in: body
*          name: feed media  
*          description: To add the feed media details
*          schema:
*            type: object
*            required:
*              - media_id 
*              - feed_id 
*            properties: 
*              media_id:
*                type: string
*              feed_id:
*                type: string
*     responses:
*       200:
*          description: feed media details added Successfully
*/

router.post(
    '/',
    feedMediaCreateValidator,
    runValidation,
    createFeedMedia
);

/**
* @swagger
*  /api/feed-media:
*   put:
*     summary: Edit Feed Media details
*     description: Edit Feed Media details
*     tags : ["Feed-Media"]
*     parameters:
*        - in: body
*          name: feed media  
*          description: To edit the feed media details
*          schema:
*            type: object
*            required:
*              - media_id 
*              - feed_id 
*              - feed_media_id 
*            properties: 
*              media_id:
*                type: string
*              feed_id:
*                type: string
*              feed_media_id:
*                type: integer
*     responses:
*       200:
*          description: feed media details edited Successfully
*/

router.put(
    '/',
    feedMediaUpdateValidator,
    runValidation,
    editFeedMedia
);

/**
* @swagger
* paths:
*  /api/feed-media/get/{feed_media_id}:
*   get:
*     summary: Get Feed Media details by Id
*     tags : ["Feed-Media"]
*     description: Get Feed Media details
*     parameters:
*        - in: path
*          name: feed_media_id
*          description: feed_media_id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
    '/get/:feed_media_id',
    fetchFeedMedia
);

/**
* @swagger
*  /api/feed-media/getAll:
*   get:
*     summary: Get all Feed Media details
*     tags : ["Feed-Media"]
*     description: Get Feed Media  details
*     responses:
*       200:
*         description: Success
*/



router.get(
    '/getAll',
    fetchAllFeedMedia
);

/**
* @swagger
* paths:
*  /api/feed-media/delete/{feed_media_id}:
*   delete:
*     summary: Delete Event Organizer Details By Feed Media Id
*     tags : ["Feed-Media"]
*     description: Delete Event Organizer details
*     parameters:
*        - in: path
*          name: feed_media_id
*          description: feed media id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete(
    '/delete/:feed_media_id',
    deleteFeedMedia
);

/**
* @swagger
* paths:
*  /api/feed-media/deleteByFeedId/{feed_id}:
*   delete:
*     summary: Delete Event Organizer Details By Feed Id
*     tags : ["Feed-Media"]
*     description: Delete Event Organizer details
*     parameters:
*        - in: path
*          name: feed_id
*          description: feed id
*          type: string
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/


router.delete(
    '/deleteByFeedId/:feed_id',
    deleteFeedMediaByFeedId
);

module.exports = router;