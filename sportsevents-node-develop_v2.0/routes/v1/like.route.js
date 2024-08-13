const express = require('express');
const { editLike, createLike, fetchLike, deleteLike, fetchAll, fetchAllLike, deleteLikeById, searchLike, deleteLikeByUserIdandFeedId, editLikeType } = require('../../controllers/like.controller')
const { runValidation } = require('../../validations');
const { likeCreateValidator, likeUpdateValidator, feedIdValidator,likeIdValidator } = require('../../validations/likes');
const router = express.Router();

/**
* @swagger
*  /api/like:
*   post:
*     summary: Add Like details
*     description: Add new Like details
*     tags : ["Like"]
*     parameters:
*        - in: body
*          name: like  
*          description: To add the like details
*          schema:
*            type:  object
*            required:
*              - user_id 
*              - company_id 
*              - feed_id 
*              - comment_id
*            properties: 
*              user_id:
*                type: string
*              company_id:
*                type: string
*              feed_id:
*                type: string
*              comment_id:
*                type: integer
*     responses:
*       200:
*          description: Like details added Successfully
*/

router.post(
    '/',
    likeCreateValidator,
    runValidation,
    createLike
);

/**
* @swagger
*  /api/like:
*   put:
*     summary: Edit Like details
*     description: Edit new Like details
*     tags : ["Like"]
*     parameters:
*        - in: body
*          name: like  
*          description: To edit the like details
*          schema:
*            type: object
*            required:
*              - user_id 
*              - company_id 
*              - feed_id 
*              - comment_id
*              - like_type
*              - like_id
*            properties: 
*              user_id:
*                type: string
*              company_id:
*                type: string
*              feed_id:
*                type: string
*              comment_id:
*                type: integer
*              like_type:
*                type: string
*              like_id:
*                type: integer
*     responses:
*       200:
*          description: Like details edited Successfully
*/

router.put(
    '/',
    likeUpdateValidator,
    runValidation,
    editLike
);

/**
* @swagger
*  /api/like/updateLikeType:
*   put:
*     summary: Edit Like Type
*     description: Edit Like Type
*     tags : ["Like"]
*     parameters:
*        - in: body
*          name: like  
*          description: To edit the like type
*          schema:
*            type: object
*            required:
*              - user_id 
*              - feed_id 
*              - like_type
*            properties: 
*              user_id:
*                type: string
*              feed_id:
*                type: string
*              like_type:
*                type: string
*     responses:
*       200:
*          description: Like type edited Successfully
*/

router.put(
    '/updateLikeType',
    likeIdValidator,
    runValidation,
    editLikeType
);

/**
* @swagger
* paths:
*  /api/like/get/{like_id}:
*   get:
*     summary: Get Like details by Id
*     tags : ["Like"]
*     description: Get Like details
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


router.get(
    '/get/:like_id',
    fetchLike
);

/**
* @swagger
*  /api/like/getAll:
*   get:
*     summary: Get all Like details
*     tags : ["Like"]
*     description: Get Like details
*     responses:
*       200:
*         description: Success
*/


router.get(
    '/getAll',
    fetchAll
);

/* hard_delete */

// router.delete(
//     '/delete/:like_id',
//     deleteLike
// );

/**
* @swagger
* paths:
*  /api/like/getLikes/{feed_id}:
*   get:
*     summary: Get Like details by Feed Id
*     tags : ["Like"]
*     description: Get Like details by Feed Id
*     parameters:
*        - in: path
*          name: feed_id
*          description: feed_id
*          type: string
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
    '/getLikes/:feed_id',
    fetchAllLike
);

/**
* @swagger
*  /api/like/search:
*   post:
*     summary: search like
*     description: search like
*     tags : ["Like"]
*     parameters:
*        - in: body
*          name: like search 
*          description: search like
*          schema:
*            type: object
*            required:
*              - like_type 
*              - feed_id 
*            properties: 
*              like_type:
*                type: string
*              feed_id:
*                type: string
*     responses:
*       200:
*          description: Success
*/

router.post(
	'/search',
    feedIdValidator,
    runValidation,
	searchLike
);


/**
* @swagger
* paths:
*  /api/like/delete/{like_id}:
*   delete:
*     summary: Delete Like Details By Id
*     tags : ["Like"]
*     description: Delete Like details
*     parameters:
*        - in: path
*          name: like_id
*          description: like id 
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/


/* soft_delete */

router.delete(
    '/delete/:like_id',
    deleteLikeById
);

/**
* @swagger
* paths:
*  /api/like/deletebyUserIdandFeedId/{user_id}/{feed_id}:
*   delete:
*     summary: Delete Like Details By user Id and Feed Id
*     tags : ["Like"]
*     description: Delete Like Details By user Id and Feed Id
*     parameters:
*        - in: path
*          name: user_id
*          description: user id 
*          type: string
*          required: true
*        - in: path
*          name: feed_id
*          description: feed id 
*          type: string
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/


/* Delete By UserId and FeedId */

router.delete(
    '/deletebyUserIdandFeedId/:user_id/:feed_id',
    deleteLikeByUserIdandFeedId
);


module.exports = router;