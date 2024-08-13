const express = require('express');
const { create, fetchByUserId, deleteById } = require('../../controllers/userHashtagFollow.controller');
const { runValidation } = require('../../validations');
const { userHashtagFollowCreateValidator, userHashtagFollowUpdateValidator } = require('../../validations/userHashtagFollow');
const router = express.Router();

/**
* @swagger
*  /api/user-hashtag-follow:
*   post:
*     summary: Add User Hashtag Follow details
*     description: Add User Hashtag Follow details
*     tags : ["User-Hashtag-Follow"]
*     parameters:
*        - in: body
*          name: User Hashtag Follow  
*          description: To add the user-hashtag-follow details
*          schema:
*            type: object
*            required:
*              - user_id 
*              - hashtag_id 
*            properties: 
*              user_id:
*                type: string
*              hashtag_id:
*                type: integer
*     responses:
*       200:
*          description: user hashtag follow details added Successfully
*/

router.post(
    '/',
    userHashtagFollowCreateValidator,
    runValidation,
    create
);

/**
* @swagger
* paths:
*  /api/user-hashtag-follow/get/{user_id}:
*   get:
*     summary: Get User Hashtag Follow details by User Id
*     tags : ["User-Hashtag-Follow"]
*     description: Get User Hashtag Follow  details
*     parameters:
*        - in: path
*          name: user_id
*          description: user_id
*          type: string
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
    '/getByUserId/:user_id',
    fetchByUserId
);

/**
* @swagger
* paths:
*  /api/user-hashtag-follow/delete/{user_hashtag_follow_id}:
*   delete:
*     summary: Delete User Hashtag Follow Details By Id
*     tags : ["User-Hashtag-Follow"]
*     description: Delete User Hashtag Follow details
*     parameters:
*        - in: path
*          name: user_hashtag_follow_id
*          description: user_hashtag_follow_id 
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete(
    '/delete/:user_hashtag_follow_id',
    deleteById
);



module.exports = router;