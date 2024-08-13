const express = require("express");
const {
  createTournamentPlayerRegistration,
  editTournamentPlayerRegistration,
  fetchTournamentPlayerRegistration,
  deleteTournamentPlayerRegistration,
  fetchAll,
  getTeamByEventSport,
} = require("../../controllers/tournamentPlayerRegistration.controller");

const { runValidation } = require("../../validations");
const {
  tournamentPlayerRegistrationCreateValidator,
  tournamentPlayerRegistrationUpdateValidator,
} = require("../../validations/tournamentPlayerRegistration");
const router = express.Router();

/**
* @swagger
*  /api/tournamentPlayerRegistration:
*   post:
*     summary: Add Tournament player Registration details
*     description: Add new Tournament player Registration details
*     tags : ["Tournament player Registration"]
*     parameters:
*        - in: body
*          name: tournament player registration 
*          description: To add the tournament player registration details
*          schema:
*            type:  object
*            required:
*              - player_id 
*              - registration_date 
*              - team_id 
*              - seeding
*              - tournament_category_id 
*              - tournamentid 
*            properties: 
*              player_id:
*                type: string
*              registration_date:
*                type: string
*              team_id:
*                type: string
*              seeding:
*                type: integer
*              tournament_category_id:
*                type: integer
*              tournamentid:
*                type: integer
*     responses:
*       200:
*          description: Tournament player Registration added Successfully
*/


router.post(
  "/",
  tournamentPlayerRegistrationCreateValidator,
  runValidation,
  createTournamentPlayerRegistration
);

/**
* @swagger
*  /api/tournamentPlayerRegistration:
*   put:
*     summary: Edit country details
*     tags : ["Tournament player Registration"]
*     description: Tournament Player Registration Edit
*     parameters:
*        - in: body
*          name: tournament player registration 
*          description: To edit the tournament player registration details
*          schema:
*            type:  object
*            required:
*              - player_id 
*              - registration_date 
*              - team_id 
*              - seeding
*              - tournament_category_id 
*              - tournamentid 
*            properties: 
*              player_id:
*                type: string
*              registration_date:
*                type: string
*              team_id:
*                type: string
*              seeding:
*                type: integer
*              tournament_category_id:
*                type: integer
*              tournamentid:
*                type: integer
*              tournament_player_reg_id:
*                type: integer
*     responses:
*       200:
*          description: Tournament Player Registration edited successfully
*/

router.put(
  "/",
  tournamentPlayerRegistrationUpdateValidator,
  runValidation,
  editTournamentPlayerRegistration
);

/**
* @swagger
* paths:
*  /api/tournamentPlayerRegistration/getById/{id}:
*   get:
*     summary: Get Tournament Player registration details by Id
*     tags : ["Tournament player Registration"]
*     description: Get country details
*     parameters:
*        - in: path
*          name: id
*          description: tournament player reg id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
  "/getById/:tournament_player_reg_id",
  fetchTournamentPlayerRegistration
);



/**
* @swagger
* paths:
*  /api/tournamentPlayerRegistration/deleteById/{id}:
*   delete:
*     summary: Delete Tournament player registration By Id
*     tags : ["Tournament player Registration"]
*     description: Delete Tournament player registration details
*     parameters:
*        - in: path
*          name: id
*          description: tournament player reg id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.get("/getTeamByEventSport/:event_id/:sport_id", getTeamByEventSport);


router.delete(
  "/deleteById/:tournament_player_reg_id",
  deleteTournamentPlayerRegistration
);


/**
* @swagger
*  /api/tournamentPlayerRegistration/getAll:
*   get:
*     summary: Get tournament player
*     tags : ["Tournament player Registration"]
*     description: Get tournament player details
*     responses:
*       200:
*         description: Success
*/

router.get("/getAll", fetchAll);

module.exports = router;
