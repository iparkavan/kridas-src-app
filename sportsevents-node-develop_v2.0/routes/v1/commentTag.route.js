const express = require("express");
const {
  createCommentTag,
  editCommentTag,
  fetchCommentTag,
  fetchAll,
  deleteCommentTag,
} = require("../../controllers/commentTag.controller");
const { runValidation } = require("../../validations");
const {
  commentTagCreateValidator,
  commentTagUpdateValidator,
} = require("../../validations/commentTag");
const router = express.Router();

/**
* @swagger
*  /api/comment-tag:
*   post:
*     summary: Add Comment Tag details
*     description: Add Comment Tag details
*     tags : ["Comment-Tag"]
*     parameters:
*        - in: body
*          name: comment tag  
*          description: To add the comment tag details
*          schema:
*            type: object
*            required:
*              - feed_id 
*              - user_id 
*              - company_id 
*              - comment_id
*            properties: 
*              feed_id:
*                type: string
*              user_id:
*                type: string
*              company_id:
*                type: string
*              comment_id:
*                type: integer
*     responses:
*       200:
*          description: comment tag details added Successfully
*/

router.post("/", commentTagCreateValidator, runValidation, createCommentTag);

/**
* @swagger
*  /api/comment-tag:
*   put:
*     summary: Edit Comment Tag details
*     description: Edit Comment Tag details
*     tags : ["Comment-Tag"]
*     parameters:
*        - in: body
*          name: comment tag  
*          description: To edit the comment tag details
*          schema:
*            type: object
*            required:
*              - feed_id 
*              - user_id 
*              - company_id 
*              - comment_id
*              - comment_tag_id
*            properties: 
*              feed_id:
*                type: string
*              user_id:
*                type: string
*              company_id:
*                type: string
*              comment_id:
*                type: integer
*              comment_tag_id:
*                type: integer
*     responses:
*       200:
*          description: comment tag details edited Successfully
*/

router.put("/", commentTagUpdateValidator, runValidation, editCommentTag);

/**
* @swagger
* paths:
*  /api/comment-tag/get/{comment_tag_id}:
*   get:
*     summary: Get Event Organizer details by Id
*     tags : ["Comment-Tag"]
*     description: Get Event Organizer details
*     parameters:
*        - in: path
*          name: comment_tag_id
*          description: comment tag id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get("/get/:comment_tag_id", fetchCommentTag);

/**
* @swagger
*  /api/comment-tag/getAll:
*   get:
*     summary: Get all Comment Tag details
*     tags : ["Comment-Tag"]
*     description: Get  Comment Tag details
*     responses:
*       200:
*         description: Success
*/

router.get("/getAll", fetchAll);

/**
* @swagger
* paths:
*  /api/comment-tag/delete/{comment_tag_id}:
*   delete:
*     summary: Delete Comment Tag Details By Comment Tag Id
*     tags : ["Comment-Tag"]
*     description: Delete Comment Tag Details By Comment Tag Id
*     parameters:
*        - in: path
*          name: comment_tag_id
*          description: comment tag id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/


router.delete("/delete/:comment_tag_id", deleteCommentTag);

module.exports = router;
