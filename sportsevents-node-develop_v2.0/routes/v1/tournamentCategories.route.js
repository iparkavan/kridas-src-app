const express = require('express');
const router = express.Router();
const { create, getById, fetchAll, deleteById, editTournament } = require('../../controllers/tournamentCategories.controller');
const { runValidation } = require('../../validations');
const { TournamentCreateValidator, TournamentUpdateValidator } = require('../../validations/tournamentCategories');

/**
* @swagger
*  /api/tournament-categories:
*   post:
*     summary: Add Tournament Categories details
*     description: Add new Tournament Categories details
*     tags : ["Tournament Categories"]
*     parameters:
*        - in: body
*          name: event organizer  
*          description: To add the tournament categories details
*          schema:
*            type:  object
*            required:
*              - tournament_refid 
*              - tournament_category 
*            properties: 
*              tournament_refid:
*                type: integer
*              tournament_category:
*                type: string
*              parent_category_id:
*                type: integer
*              tournament_format:
*                type: string
*              reg_fee:
*                type: integer
*              reg_fee_currency:
*                type: string
*              minimum_players:
*                type: integer
*              maximum_players:
*                type: integer
*              min_reg_count:
*                type: integer
*              max_reg_count:
*                type: integer
*              seeded_teams:
*                type: integer
*              age_restriction:
*                type: string
*              sex_restriction:
*                type: string
*              average_age:
*                type: string
*              tournament_config:
*                type: object
*              participant_dob_startdate:
*                type: string
*              participant_dob_enddate:
*                type: string
*              tournament_category_name:
*                type: string
*              tournament_category_prizes:
*                type: integer
*              tournament_category_desc:
*                type: string
*              min_age:
*                type: integer
*              max_age:
*                type: integer
*              min_male:
*                type: integer
*              max_male:
*                type: integer
*              min_female:
*                type: integer
*              max_female:
*                type: integer
*              doc_list:
*                type: object
*     responses:
*       200:
*          description: Tournament Categories details added Successfully
*/

router.post(
    '/',
    TournamentCreateValidator,
    runValidation,
    create,
);

/**
* @swagger
*  /api/tournament-categories:
*   put:
*     summary: Edit Tournament Categories details
*     description: Edit Tournament Categories details
*     tags : ["Tournament Categories"]
*     parameters:
*        - in: body
*          name: event organizer  
*          description: To edit the tournament categories details
*          schema:
*            type:  object
*            required:
*              - tournament_refid 
*              - tournament_category 
*            properties: 
*              tournament_refid:
*                type: integer
*              tournament_category:
*                type: string
*              parent_category_id:
*                type: integer
*              tournament_format:
*                type: string
*              reg_fee:
*                type: integer
*              reg_fee_currency:
*                type: string
*              minimum_players:
*                type: integer
*              maximum_players:
*                type: integer
*              min_reg_count:
*                type: integer
*              max_reg_count:
*                type: integer
*              seeded_teams:
*                type: integer
*              age_restriction:
*                type: string
*              sex_restriction:
*                type: string
*              average_age:
*                type: string
*              tournament_config:
*                type: object
*              participant_dob_startdate:
*                type: string
*              participant_dob_enddate:
*                type: string
*              tournament_category_name:
*                type: string
*              tournament_category_prizes:
*                type: integer
*              tournament_category_desc:
*                type: string
*              min_age:
*                type: integer
*              max_age:
*                type: integer
*              min_male:
*                type: integer
*              max_male:
*                type: integer
*              min_female:
*                type: integer
*              max_female:
*                type: integer
*              doc_list:
*                type: object
*              tournament_category_id:
*                type: integer
*     responses:
*       200:
*          description: Tournament Categories details Edited Successfully
*/

router.put(
    '/',
    TournamentUpdateValidator,
    runValidation,
    editTournament,

);

/**
* @swagger
* paths:
*  /api/tournament-categories/get/{id}:
*   get:
*     summary: Get Tournament Category details by Id
*     tags : ["Tournament Categories"]
*     description: Get Tournament Organizer details
*     parameters:
*        - in: path
*          name: id
*          description: tournament category id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/


router.get(
    '/get/:id',
    getById
);

/**
* @swagger
*  /api/tournament-categories/getAll:
*   get:
*     summary: Get all tournamentcategories details
*     tags : ["Tournament Categories"]
*     description: Get tournament categories  details
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
*  /api/tournament-categories/delete/{id}:
*   delete:
*     summary: Delete Tournament Categories Details By Id
*     tags : ["Tournament Categories"]
*     description: Delete  Tournament Categories details
*     parameters:
*        - in: path
*          name: id
*          description: tournament category id 
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete(
    '/delete/:id',
    deleteById
);




module.exports = router;