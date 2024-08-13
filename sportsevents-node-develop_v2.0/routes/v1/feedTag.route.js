const express = require('express');
const { createFeedTag,editFeedTag,deleteFeedTag,fetchFeedTag, fetchAll } = require('../../controllers/feedTag.controller')
const { runValidation } = require('../../validations');
const { feedTagCreateValidator, feedTagUpdateValidator } = require('../../validations/feedTag');
const router = express.Router();

/**
* @swagger
*  /api/feed-tag:
*   post:
*     summary: Add Feed Tag details
*     description: Add Feed Tag details
*     tags : ["Feed-Tag"]
*     parameters:
*        - in: body
*          name: feed tag  
*          description: To add the feed-tag details
*          schema:
*            type: object
*            required:
*              - feed_id 
*              - user_id 
*              - company_id 
*            properties: 
*              feed_id:
*                type: string
*              user_id:
*                type: string
*              company_id:
*                type: string
*     responses:
*       200:
*          description: feed tag details added Successfully
*/


router.post(
    '/',
    feedTagCreateValidator,
    runValidation,
    createFeedTag
);

/**
* @swagger
*  /api/feed-tag:
*   put:
*     summary: Edit Feed Tag details
*     description: Edit Feed Tag details
*     tags : ["Feed-Tag"]
*     parameters:
*        - in: body
*          name: feed tag  
*          description: To edit the feed-tag details
*          schema:
*            type: object
*            required:
*              - feed_id 
*              - user_id 
*              - company_id 
*              - feed_tag_id 
*            properties: 
*              feed_id:
*                type: string
*              user_id:
*                type: string
*              company_id:
*                type: string
*              feed_tag_id:
*                type: integer
*     responses:
*       200:
*          description: feed tag details edited Successfully
*/

router.put(
    '/',
    feedTagUpdateValidator,
    runValidation,
    editFeedTag
);


/**
* @swagger
* paths:
*  /api/feed-tag/get/{feed_tag_id}:
*   get:
*     summary: Get Feed Tag details by Id
*     tags : ["Feed-Tag"]
*     description: Get Feed Tag details
*     parameters:
*        - in: path
*          name: feed_tag_id
*          description: feed_tag_id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
    '/get/:feed_tag_id',
    fetchFeedTag
);

/**
* @swagger
*  /api/feed-tag/getAll:
*   get:
*     summary: Get all Feed Tag details
*     tags : ["Feed-Tag"]
*     description: Get Feed Tag details
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
* paths:
*  /api/feed-tag/delete/{feed_tag_id}:
*   delete:
*     summary: Delete Feed Tag Details By Id
*     tags : ["Feed-Tag"]
*     description: Delete Feed Tag details
*     parameters:
*        - in: path
*          name: feed_tag_id
*          description: feed tag id 
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete(
    '/delete/:feed_tag_id',
    deleteFeedTag
);



module.exports = router;