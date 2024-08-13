const express = require("express");
const { createTournament, editTournament, fetchAll, fetchTournament, deleteTournament } = require('../../controllers/tournaments.controller')
const { runValidation } = require("../../validations");
const { tournamentCreateValidator, tournamentUpdateValidator } = require("../../validations/tournament");
const router = express.Router();

/**
* @swagger
*  /api/tournaments:
*   post:
*     summary: Add Tournament details
*     description: Add new Tournament details
*     tags : ["Tournaments"]
*     parameters:
*        - in: body
*          name: tournament  
*          description: To add the tournament details
*          schema:
*            type:  object
*            required:
*              - event_refid 
*              - sports_refid 
*              - tournament_startdate 
*              - tournament_enddate
*            properties: 
*              event_refid:
*                type: string
*              sports_refid:
*                type: integer
*              tournament_startdate:
*                type: string
*              tournament_enddate:
*                type: string
*              tournament_rules:
*                type: string
*              event_venue:
*                type: string
*              event_venue_other:
*                type: object
*     responses:
*       200:
*          description: Tournament details added Successfully
*/

router.post('/', tournamentCreateValidator, runValidation, createTournament);


/**
* @swagger
*  /api/tournaments:
*   put:
*     summary: Edit Tournaments details
*     tags : ["Tournaments"]
*     description: Tournaments Edit
*     parameters:
*        - in: body
*          name: tournament 
*          description: To edit the tournament details
*          schema:
*            type:  object
*            required:
*              - event_refid 
*              - sports_refid 
*              - tournament_startdate 
*              - tournament_enddate
*              - tournament_id 
*            properties: 
*              event_refid:
*                type: string
*              sports_refid:
*                type: integer
*              tournament_startdate:
*                type: string
*              tournament_enddate:
*                type: string
*              tournament_id:
*                type: integer
*     responses:
*       200:
*          description: Tournaments edited successfully
*/

router.put('/', tournamentUpdateValidator, runValidation, editTournament);

/**
* @swagger
* paths:
*  /api/tournaments/get/{tournament_id}:
*   get:
*     summary: Get Tournament details by Id
*     tags : ["Tournaments"]
*     description: Get tournaments details
*     parameters:
*        - in: path
*          name: tournament_id
*          description: tournament id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get('/get/:tournament_id', fetchTournament);

/**
* @swagger
* paths:
*  /api/tournaments/delete/{tournament_id}:
*   delete:
*     summary: Delete Tournament Details By Id
*     tags : ["Tournaments"]
*     description: Delete Tournament details
*     parameters:
*        - in: path
*          name: tournament_id
*          description: tournament id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete('/delete/:tournament_id', deleteTournament);

/**
* @swagger
*  /api/tournaments/getAll:
*   get:
*     summary: Get all tournament details
*     tags : ["Tournaments"]
*     description: Get tournament  details
*     responses:
*       200:
*         description: Success
*/

router.get('/getAll', fetchAll);

module.exports = router;
