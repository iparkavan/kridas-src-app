const express = require('express');
const { createMediaCommentInfo, deleteById, editMediaCommentInfo, fetchAll, fetchByCommentId, searchComment, searchParentComment } = require('../../controllers/mediaCommentInfo.controller');
const { runValidation } = require('../../validations');
const { mediaCreateValidator, mediaUpdateCreateValidator, mediaParentCommentSearch, mediaCommentSearch } = require('../../validations/mediaCommentInfo');
const router = express.Router();

/**
* @swagger
*  /api/media/comment-info:
*   post:
*     summary: Add Media-Comment-Info details
*     description: Add Media-Comment-Info details
*     tags : ["Media-Comment-Info"]
*     parameters:
*        - in: body
*          name: comment_id  
*          description: To add the Media-Comment-Info details
*          schema:
*            type: object
*            required:
*              - company_id 
*              - user_id 
*              - contents 
*              - media_id
*              - parent_comment_id
*            properties: 
*              company_id:
*                type: string
*              user_id:
*                type: string
*              contents:
*                type: string
*              media_id:
*                type: string
*              parent_comment_id:
*                type: integer
*     responses:
*       200:
*          description: media comment info details added Successfully
*/


router.post(
    '/',
    mediaCreateValidator,
    runValidation,
    createMediaCommentInfo
);

/**
* @swagger
*  /api/media/comment-info/search:
*   put:
*     summary: Edit Media-Comment-Info details
*     description: Edit Media-Comment-Info details
*     tags : ["Media-Comment-Info"]
*     parameters:
*        - in: body
*          name: comment_id  
*          description: To edit the Media-Comment-Info details
*          schema:
*            type: object
*            required:
*              - company_id 
*              - user_id 
*              - contents 
*              - media_id
*              - parent_comment_id
*              - comment_id
*            properties: 
*              company_id:
*                type: string
*              user_id:
*                type: string
*              contents:
*                type: string
*              media_id:
*                type: string
*              parent_comment_id:
*                type: integer
*              comment_id:
*                type: integer
*     responses:
*       200:
*          description: media comment info details edited Successfully
*/

router.put(
    '/',
    mediaUpdateCreateValidator,
    runValidation,
    editMediaCommentInfo
);

/**
* @swagger
* paths:
*  /api/media/comment-info/get/{comment_id}:
*   get:
*     summary: Get Media-Comment-Info details by Id
*     tags : ["Media-Comment-Info"]
*     description: Get Media Comment Info details
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
    fetchByCommentId
);

/**
* @swagger
*  /api/media/comment-info/getAll:
*   get:
*     summary: Get all Media Comment Info details
*     tags : ["Media-Comment-Info"]
*     description: Get all Media Comment Info details
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
*  /api/media/comment-info/delete/{comment_id}:
*   delete:
*     summary: Delete Media-Comment-Info Details By Id
*     tags : ["Media-Comment-Info"]
*     description: Delete Media-Comment-Info details
*     parameters:
*        - in: path
*          name: comment_id
*          description: comment_id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete(
    '/delete/:comment_id',
    deleteById
);

/**
* @swagger
*  /api/media/comment-info/search:
*   post:
*     summary: Media-Comment-Info Search
*     description: Media-Comment-Info Search
*     tags : ["Media-Comment-Info"]
*     parameters:
*        - in: body
*          name: comment_id  
*          description: Media-Comment-Info Search
*          schema:
*            type: object
*            required:
*              - page 
*              - sort 
*              - size 
*              - media_id
*            properties: 
*              page:
*                type: integer
*              sort:
*                type: string
*              size:
*                type: integer
*              media_id:
*                type: string
*     responses:
*       200:
*          description: Success
*/


router.post(
    '/search',
    mediaCommentSearch,
    runValidation,
    searchComment
);

/**
* @swagger
*  /api/media/comment-info/searchByParent:
*   post:
*     summary: Media-Comment-Info Search By Parent
*     description: Media-Comment-Info Search By Parent
*     tags : ["Media-Comment-Info"]
*     parameters:
*        - in: body
*          name: comment_id  
*          description: Media-Comment-Info Search By Parent
*          schema:
*            type: object
*            required:
*              - page 
*              - sort 
*              - size 
*              - media_id
*              - parent_comment_id
*            properties: 
*              page:
*                type: integer
*              sort:
*                type: string
*              size:
*                type: integer
*              media_id:
*                type: string
*              parent_comment_id:
*                type: string
*     responses:
*       200:
*          description: Success
*/

router.post(
    '/searchByParent',
    mediaParentCommentSearch,
    runValidation,
    searchParentComment
);

module.exports = router;