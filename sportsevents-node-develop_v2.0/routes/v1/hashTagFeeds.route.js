const express = require('express');
const { createHashTagFeeds, fetchAll, fetchHashTag, deleteHashTagFeeds, editHashTagFeeds } = require('../../controllers/hashTagFeeds.controller');
const { hashTagFeedsCreateValidator, hashTagFeedsUpdateValidator } = require('../../validations/hashTagFeeds');
const router = express.Router();
const { runValidation } = require('../../validations');

/**
* @swagger
*  /api/hash-tag-feeds:
*   post:
*     summary: Add Hash Tag Feeds details
*     description: Add Hash Tag Feeds details
*     tags : ["Hash-Tag-Feeds"]
*     parameters:
*        - in: body
*          name: hash-tag-feeds  
*          description: To add the Hash-Tag-Feeds details
*          schema:
*            type: object
*            required:
*              - hashtag_id 
*              - feed_id 
*            properties: 
*              hashtag_id:
*                type: integer
*              feed_id:
*                type: string
*     responses:
*       200:
*          description: Hash tag feeds details added Successfully
*/


router.post(
    '/',
    hashTagFeedsCreateValidator,
    runValidation,
    createHashTagFeeds
);

/**
* @swagger
*  /api/hash-tag-feeds:
*   put:
*     summary: Edit Hash Tag Feeds details
*     description: Edit Hash Tag Feeds details
*     tags : ["Hash-Tag-Feeds"]
*     parameters:
*        - in: body
*          name: hash-tag-feeds  
*          description: To edit the Hash-Tag-Feeds details
*          schema:
*            type: object
*            required:
*              - hashtag_id 
*              - feed_id 
*              - hashtag_feeds_id 
*            properties: 
*              hashtag_id:
*                type: integer
*              feed_id:
*                type: string
*              hashtag_feeds_id:
*                type: integer
*     responses:
*       200:
*          description: Hash tag feeds details edited Successfully
*/

router.put(
    '/',
    hashTagFeedsUpdateValidator,
    runValidation,
    editHashTagFeeds
);

/**
* @swagger
*  /api/hash-tag-feeds/getAll:
*   get:
*     summary: Get all Hash Tag Feeds details
*     tags : ["Hash-Tag-Feeds"]
*     description: Get Hash Tag Feeds details
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
*  /api/hash-tag-feeds/get/{hashtag_feeds_id}:
*   get:
*     summary: Get Hashtag Feeds Id details by Id
*     tags : ["Hash-Tag-Feeds"]
*     description: Get Event Organizer details
*     parameters:
*        - in: path
*          name: hash-tag-feeds
*          description: hashtag_feeds_id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
    '/get/:hashtag_feeds_id',
    fetchHashTag
);

/**
* @swagger
* paths:
*  /api/hash-tag-feeds/delete/{hashtag_feeds_id}:
*   delete:
*     summary: Delete Hash Tag Feeds Details By Id
*     tags : ["Hash-Tag-Feeds"]
*     description: Delete Hash Tag Feeds details
*     parameters:
*        - in: path
*          name: hashtag_feeds_id
*          description: hashtag feeds id 
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete(
    '/delete/:hashtag_feeds_id',
    deleteHashTagFeeds
);

module.exports = router;