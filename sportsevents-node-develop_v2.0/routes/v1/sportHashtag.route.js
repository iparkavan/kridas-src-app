const express = require('express');
const { createSportHashtag, fetchSportHashtag, deleteSportHashtag, fetchAllSportHashtag, fetchSportsHashtagbySportsId, fetchSportsHashtagbyHashtagId } = require('../../controllers/sportsHashtag.controller');
const { runValidation } = require('../../validations');
const { sportsHashtagCreateValidator } = require('../../validations/sportsHashtag');
const router = express.Router();

/**
* @swagger
*  /api/sports-hashtag:
*   post:
*     summary: Add Sports Hashtag details
*     description: Add Sports Hashtag details
*     tags : ["Sports-Hashtag"]
*     parameters:
*        - in: body
*          name: sports hashtag  
*          description: To add the sports-hashtag details
*          schema:
*            type: object
*            required:
*              - sports_id 
*              - hashtag_id 
*            properties: 
*              sports_id:
*                type: integer
*              hashtag_id:
*                type: integer
*     responses:
*       200:
*          description: Sports HashTag details added Successfully
*/


router.post(
    '/',
    sportsHashtagCreateValidator,
    runValidation,
    createSportHashtag
);

/**
* @swagger
* paths:
*  /api/sports-hashtag/get/{sports_hashtag_id}:
*   get:
*     summary: Get Sports HashTag details by Sports HashTag Id
*     tags : ["Sports-Hashtag"]
*     description: Get Sports Hashtag details by Sports HashTag Id
*     parameters:
*        - in: path
*          name: sports_hashtag_id
*          description: sports_hashtag_id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/


router.get(
    '/get/:sports_hashtag_id',
    fetchSportHashtag
);

/**
* @swagger
* paths:
*  /api/sports-hashtag/getBySportId/{sports_id}:
*   get:
*     summary: Get Sports HashTag details by Sports Id
*     tags : ["Sports-Hashtag"]
*     description: Get Sports Hashtag details by Sports Id
*     parameters:
*        - in: path
*          name: sports_id
*          description: sports_id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
    '/getBySportId/:sports_id',
    fetchSportsHashtagbySportsId
);

/**
* @swagger
* paths:
*  /api/sports-hashtag/getByHashtagId/{hashtag_id}:
*   get:
*     summary: Get Sports HashTag details by Hashtag Id
*     tags : ["Sports-Hashtag"]
*     description: Get Sports Hashtag details
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
    '/getByHashtagId/:hashtag_id',
    fetchSportsHashtagbyHashtagId
);

/**
* @swagger
*  /api/sports-hashtag/getAll:
*   get:
*     summary: Get all Sports Hashtag details
*     tags : ["Sports-Hashtag"]
*     description: Get  Get all Sports Hashtag details
*     responses:
*       200:
*         description: Success
*/

router.get(
    '/getAll',
    fetchAllSportHashtag
);

/**
* @swagger
* paths:
*  /api/sports-hashtag/delete/{sports_hashtag_id}:
*   delete:
*     summary: Delete Sports Hashtag Details By Sports Hashtag Id
*     tags : ["Sports-Hashtag"]
*     description: Delete Sports Hashtag Details By Sports HashTag Id
*     parameters:
*        - in: path
*          name: sports_hashtag_id
*          description: sports_hashtag_id 
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete(
    '/delete/:sports_hashtag_id',
    deleteSportHashtag
);

module.exports = router;