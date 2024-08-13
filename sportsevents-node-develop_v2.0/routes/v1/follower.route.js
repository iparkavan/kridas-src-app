const express = require('express');
const {createFollower, fetchAll, fetchFollower, deleteFollower, editFollower,searchFollower, unFollow } = require('../../controllers/follower.controller');
const { runValidation } = require('../../validations');
const { followerCreateValidator, followerUpdateValidator } = require('../../validations/follower');
const router = express.Router();

/**
* @swagger
*  /api/follower:
*   post:
*     summary: Add Follower details
*     description: Add new Follower details
*     tags : ["Follower"]
*     parameters:
*        - in: body
*          name: follower  
*          description: To add the follower details
*          schema:
*            type:  object
*            required:
*              - follower_userid 
*              - follower_companyid 
*              - following_companyid 
*              - following_userid
*              - followed_from 
*              - is_delete 
*              - following_event_id
*            properties: 
*              follower_userid:
*                type: string
*              follower_companyid:
*                type: string
*              following_companyid:
*                type: string
*              following_userid:
*                type: string
*              followed_from:
*                type: string
*              is_delete:
*                type: boolean
*              following_event_id:
*                type: string
*     responses:
*       200:
*          description: Follower details added Successfully
*/

router.post(
	'/',
    followerCreateValidator,
	runValidation,
	createFollower
);

/**
* @swagger
*  /api/follower/search:
*   post:
*     summary: Search Follower
*     description: Search Follower
*     tags : ["Follower"]
*     parameters:
*        - in: body
*          name: search follower
*          description: Search Follower
*          schema:
*            type: object
*            required:
*              - followed_from  
*            properties: 
*              followed_from:
*                type: string
*     responses:
*       200:
*          description: Success
*/

router.post(
	'/search',
	searchFollower
);

/**
* @swagger
*  /api/follower/unFollow:
*   post:
*     summary: Unfollow
*     description: Unfollow
*     tags : ["Follower"]
*     parameters:
*        - in: body
*          name: Unfollow  
*          description: Unfollow
*          schema:
*            type:  object
*            required:
*              - follower_userid 
*              - following_userid
*              - follower_companyid 
*              - following_companyid 
*              - following_event_id
*            properties: 
*              follower_userid:
*                type: string
*              following_userid:
*                type: string
*              follower_companyid:
*                type: string
*              following_companyid:
*                type: string
*              following_event_id:
*                type: string
*     responses:
*       200:
*          description: unfollow successfully
*/

router.post(
	'/unFollow',
	unFollow
);

/**
* @swagger
*  /api/follower/getAll:
*   get:
*     summary: Get all Followers details
*     tags : ["Follower"]
*     description: Get Follower details
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
*  /api/follower/get/{follower_id}:
*   get:
*     summary: Get Follower details by follow Id
*     tags : ["Follower"]
*     description: Get Follower details
*     parameters:
*        - in: path
*          name: follower_id
*          description: follower id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
	'/get/:follower_id',
	fetchFollower
);

/**
* @swagger
* paths:
*  /api/follower/delete/{follower_id}:
*   delete:
*     summary: Delete Follower Details By Id
*     tags : ["Follower"]
*     description: Delete Follower details
*     parameters:
*        - in: path
*          name: follower_id
*          description: follower id 
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/


router.delete(
	'/delete/:follower_id',
	deleteFollower
);

/**
* @swagger
*  /api/follower:
*   put:
*     summary: Add Follower details
*     description: Add new Follower details
*     tags : ["Follower"]
*     parameters:
*        - in: body
*          name: follower  
*          description: To add the follower details
*          schema:
*            type:  object
*            required:
*              - follower_userid 
*              - follower_companyid 
*              - following_companyid 
*              - following_userid
*              - followed_from 
*              - follower_id
*            properties: 
*              follower_userid:
*                type: string
*              follower_companyid:
*                type: string
*              following_companyid:
*                type: string
*              following_userid:
*                type: string
*              followed_from:
*                type: string
*              follower_id:
*                type: string
*     responses:
*       200:
*          description: Follower details added Successfully
*/

router.put(
	'/',
	followerUpdateValidator,
	runValidation,
	editFollower
);


module.exports=router
