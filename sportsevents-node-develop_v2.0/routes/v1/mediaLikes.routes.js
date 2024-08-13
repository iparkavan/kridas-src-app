const express = require("express");
const { createMediaLike, editMediaLike, fetchAll, fetchMediaLike, deleteMediaLike, getLikeByMedia } = require("../../controllers/mediaLikes.controller")
const { runValidation } = require("../../validations");
const { mediaLikeCreateValidator, mediaLikeUpdateValidator, toalLikeValidator } = require("../../validations/mediaLikes");
const router = express.Router();

/**
* @swagger
*  /api/media-likes:
*   post:
*     summary: Add Media Likes details
*     description: Add Media likes details
*     tags : ["Media-Likesr"]
*     parameters:
*        - in: body
*          name: media likes  
*          description: To add the media-likes details
*          schema:
*            type: object
*            required:
*              - user_id 
*              - company_id 
*              - media_id 
*              - comment_id
*              - like_type 
*              - is_deleted
*            properties: 
*              user_id:
*                type: string
*              company_id:
*                type: string
*              media_id:
*                type: string
*              comment_id:
*                type: integer
*              like_type:
*                type: string
*              is_deleted:
*                type: boolean
*     responses:
*       200:
*          description: media likes details added Successfully
*/


router.post('/', mediaLikeCreateValidator, runValidation, createMediaLike);

/**
* @swagger
*  /api/media-likes:
*   put:
*     summary: Edit Media Likes details
*     description: Edit Media likes details
*     tags : ["Media-Likesr"]
*     parameters:
*        - in: body
*          name: media likes  
*          description: To dit the media-likes details
*          schema:
*            type: object
*            required:
*              - user_id 
*              - company_id 
*              - media_id 
*              - comment_id
*              - like_type 
*              - is_deleted
*              - like_id
*            properties: 
*              user_id:
*                type: string
*              company_id:
*                type: string
*              media_id:
*                type: string
*              comment_id:
*                type: integer
*              like_type:
*                type: string
*              is_deleted:
*                type: boolean
*     responses:
*       200:
*          description: media likes details added Successfully
*/


router.put('/', mediaLikeUpdateValidator, runValidation, editMediaLike);

/**
* @swagger
* paths:
*  /api/media-likes/get/{like_id}:
*   get:
*     summary: Get Event Organizer details by Id
*     tags : ["Media-Likes"]
*     description: Get Event Organizer details
*     parameters:
*        - in: path
*          name: like_id
*          description: like_id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get('/get/:like_id', fetchMediaLike);

/**
* @swagger
* paths:
*  /api/media-likes/delete/{like_id}:
*   delete:
*     summary: Delete Media Likes Details By Like Id
*     tags : ["Media-likes"]
*     description: Delete Media Likes details
*     parameters:
*        - in: path
*          name: like_id
*          description: like_id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/


router.delete('/delete/:like_id', deleteMediaLike);

/**
* @swagger
*  /api/media-likes/getAll:
*   get:
*     summary: Get all Media Likes details
*     tags : ["Media-Likes"]
*     description:  Get all Media Likes details
*     responses:
*       200:
*         description: Success
*/

router.get('/getAll', fetchAll);

/**
* @swagger
*  /api/media-likes/getLikeByMedia:
*   post:
*     summary: Get Like By Media
*     description: Get Like By Media
*     tags : ["Media"]
*     parameters:
*        - in: body
*          name: media likes
*          description: Get Like By Media
*          schema:
*            type: object
*            required:
*              - page 
*              - sort 
*              - size 
*              - media_id
*              - like_type
*            properties: 
*              page:
*                type: integer
*              sort:
*                type: string
*              size:
*                type: integer
*              media_id:
*                type: string
*              like_type:
*                type: string
*     responses:
*       200:
*          description: Success
*/

router.post('/getLikeByMedia', toalLikeValidator, runValidation, getLikeByMedia);

module.exports = router;
