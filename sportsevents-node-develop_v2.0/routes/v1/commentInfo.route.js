const express = require('express');
const { editCommentInfo, createCommentInfo, fetchCommentInfo, deleteCommentInfo, fetchAll, getCommentInfoByFeed, fetchByParentCommentId, getByFeed } = require('../../controllers/commentInfo.controller')
const { runValidation } = require('../../validations');
const { commentInfoCreateValidator, commentInfoUpdateValidator } = require('../../validations/commentInfo');
const router = express.Router();

/**
* @swagger
*  /api/comment-info:
*   post:
*     summary: Add Comment-Info details
*     description: Add Comment-Info details
*     tags : ["Comment-Info"]
*     parameters:
*        - in: body
*          name:  comment info  
*          description: To add the comment info details
*          schema:
*            type:  object
*            required:
*              - company_id 
*              - user_id 
*              - contents 
*              - feed_id
*              - parent_comment_id
*            properties: 
*              company_id:
*                type: string
*              user_id:
*                type: string
*              contents:
*                type: string
*              feed_id:
*                type: string
*              parent_comment_id:
*                type: integer
*     responses:
*       200:
*          description: Comment Info details added Successfully
*/


router.post(
    '/',
    commentInfoCreateValidator,
    runValidation,
    createCommentInfo
);

/**
* @swagger
*  /api/comment-info:
*   put:
*     summary: Edit Comment-Info details
*     description: Edit Comment-Info details
*     tags : ["Comment-Info"]
*     parameters:
*        - in: body
*          name: comment info  
*          description: To edit the comment info details
*          schema:
*            type: object
*            required:
*              - company_id 
*              - user_id 
*              - contents 
*              - feed_id
*              - parent_comment_id
*              - comment_id
*            properties: 
*              company_id:
*                type: string
*              user_id:
*                type: string
*              contents:
*                type: string
*              feed_id:
*                type: string
*              parent_comment_id:
*                type: integer
*              comment_id:
*                type: integer
*     responses:
*       200:
*          description: Comment Info details edited Successfully
*/

router.put(
    '/',
    commentInfoUpdateValidator,
    runValidation,
    editCommentInfo
);

/**
* @swagger
* paths:
*  /api/comment-info/get/{comment_id}:
*   get:
*     summary: Get Comment-Info details by Comment Id
*     tags : ["Comment-Info"]
*     description: Get Comment-Info details by Comment Id
*     parameters:
*        - in: path
*          name: comment_id
*          description: comment_id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/


router.get(
    '/get/:comment_id',
    fetchCommentInfo
);

/**
* @swagger
*  /api/getByParent:
*   post:
*     summary: Comment-Info get by parent
*     description: Comment-Info get by parent
*     tags : ["Comment-Info"]
*     parameters:
*        - in: body
*          name: Comment-Info
*          description: Comment-Info get by parent
*          schema:
*            type: object
*            required:
*              - feed_id 
*              - parent_comment_id  
*            properties: 
*              page:
*                type: integer
*              sort:
*                type: string
*              size:
*                type: integer
*              contents:
*                type: string
*              feed_id:
*                type: string
*              parent_comment_id:
*                type: integer
*     responses:
*       200:
*          description: Success
*/

router.post(
    '/getByParent',
    fetchByParentCommentId
);

/**
* @swagger
*  /api/getByFeed:
*   post:
*     summary: Comment-Info get by feed
*     description: Comment-Info get by feed
*     tags : ["Comment-Info"]
*     parameters:
*        - in: body
*          name: Comment-Info
*          description: Comment-Info get by feed
*          schema:
*            type:  object
*            required:
*              - feed_id
*            properties: 
*              page:
*                type: integer
*              sort:
*                type: string
*              size:
*                type: integer
*              feed_id:
*                type: string
*     responses:
*       200:
*          description: Success
*/

router.post(
    '/getByFeed',
    getByFeed
);

/**
* @swagger
*  /api/comment-info/getAll:
*   get:
*     summary: Get all Comment Info details
*     tags : ["Comment-Info"]
*     description: Get Comment Info details
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
*  /api/comment-info/delete/{comment_id}:
*   delete:
*     summary: Delete Comment Info Details By Id
*     tags : ["Comment-Info"]
*     description: Delete Comment Info details
*     parameters:
*        - in: path
*          name: comment_id
*          description: comment id 
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete(
    '/delete/:comment_id',
    deleteCommentInfo
);

/**
* @swagger
* paths:
*  /api/comment-info/getByFeedId/{feed_id}:
*   get:
*     summary: Get Comment-Info details by Feed Id
*     tags : ["Comment-Info"]
*     description: Get Comment-Info details by Feed Id
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
    '/getByFeedId/:feed_id',
    getCommentInfoByFeed
);



module.exports = router;