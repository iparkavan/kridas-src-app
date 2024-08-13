const express = require("express");
const { createHashtag, fetchAll, fetchHashtag,fetchHashTagByTitle, editHashtag, deleteHashtag, searchTitle } = require("../../controllers/hashtags.controller");
const { runValidation } = require("../../validations");
const { hashtagCreateValidator, hashtagUpdateValidator, searchValidator } = require("../../validations/hashtags");
const router = express.Router();

/**
* @swagger
*  /api/hash-tag:
*   post:
*     summary: Add Hash Tag details
*     description: Add new Hash Tag details
*     tags : ["Hash-Tag"]
*     parameters:
*        - in: body
*          name: hash tag  
*          description: To add the hash-tag details
*          schema:
*            type: object
*            required:
*              - hashtag_title
*            properties: 
*              hashtag_title:
*                type: string
*     responses:
*       200:
*          description: hash tag details added Successfully
*/


router.post(
    "/",
    hashtagCreateValidator,
    runValidation,
    createHashtag
);

/**
* @swagger
*  /api/hash-tag/getAll:
*   get:
*     summary: Get all Hash Tag details
*     tags : ["Hash-Tag"]
*     description: Get all Hash Tag details
*     responses:
*       200:
*         description: Success
*/


router.get(
    "/getAll",
    fetchAll
);

/**
* @swagger
* paths:
*  /api/hash-tag/get/{hashtag_id}:
*   get:
*     summary: Get Hash-Tag details by Id
*     tags : ["Hash-Tag"]
*     description: Get Hash-Tag details
*     parameters:
*        - in: path
*          name: hashtag_id
*          description: hashtag_id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
    "/get/:hashtag_id",
    fetchHashtag
);

/**
* @swagger
* paths:
*  /api/hash-tag/getByTitle/{hashtag_title}:
*   get:
*     summary: Get Hash-Tag details by Hash Tag Title
*     tags : ["Hash-Tag"]
*     description:  Get Hash-Tag details by Hash Tag Title
*     parameters:
*        - in: path
*          name: hashtag_title
*          description: hashtag_title
*          type: string
*          required: true
*     responses:
*       200:
*         description: Success
*/


router.get(
    "/getByTitle/:hashtag_title",
    fetchHashTagByTitle
);

/**
* @swagger
*  /api/hash-tag:
*   put:
*     summary: Edit Hash Tag details
*     description: Edit  Hash Tag details
*     tags : ["Hash-Tag"]
*     parameters:
*        - in: body
*          name: hash tag  
*          description: To edit the hash-tag details
*          schema:
*            type: object
*            required:
*              - hashtag_title
*              - hashtag_id
*            properties: 
*              hashtag_title:
*                type: string
*              hashtag_id:
*                type: integer
*     responses:
*       200:
*          description: hash tag details edited Successfully
*/


router.put(
    "/",
    hashtagUpdateValidator,
    runValidation,
    editHashtag
);

/**
* @swagger
* paths:
*  /api/hash-tag/delete/{hashtag_id}:
*   delete:
*     summary: Delete Hash Tag Details By Id
*     tags : ["Hash-Tag"]
*     description: Delete Hash Tag details
*     parameters:
*        - in: path
*          name: hashtag_id
*          description: hashtag_id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/


router.delete(
    "/delete/:hashtag_id",
    deleteHashtag,
);

/**
* @swagger
*  /api/hash-tag/searchByTag:
*   post:
*     summary: Hash Tag - Search By Tag
*     description: Hash Tag - Search By Tag
*     tags : ["Hash-Tag"]
*     parameters:
*        - in: body
*          name: hash tag  
*          description: Hash Tag - Search By Tag
*          schema:
*            type: object
*            required:
*              - page
*              - sort
*              - size
*              - searchkey
*              - user_id
*            properties: 
*              page:
*                type: integer
*              sort:
*                type: string
*              size:
*                type: integer
*              searchkey:
*                type: string
*              user_id:
*                type: string
*     responses:
*       200:
*          description: Success
*/

router.post(
    "/searchByTag",
    searchValidator,
    runValidation,
    searchTitle
);


module.exports = router;