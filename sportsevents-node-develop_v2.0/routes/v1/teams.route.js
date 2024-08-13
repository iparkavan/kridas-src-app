const express = require("express");
const {
  createTeam,
  editTeam,
  fetchTeam,
  deleteTeam,
  fetchAll,
  teamRegister,
  getParticipantByTournamentCatId,
  getByTeamNameandTournamentId,
  getParticipantByCompanyId,
  getByTeamId,
  createClubTeam,
  createThirdPartyVenue,
  createBrandProduct,
  teamRegisterValidation,
  getPreferencesOpted,
  getPreferencesDetails,
} = require("../../controllers/teams.controller");
const { runValidation } = require("../../validations");
const {
  teamsCreateValidator,
  teamsUpdateValidator,
  teamsNameValidator,
} = require("../../validations/teams");
const router = express.Router();

/**
 * @swagger
 *  /api/teams/register:
 *   post:
 *     summary: Add Team Registration details
 *     description: Add new Team Registration details
 *     tags : ["Teams"]
 *     parameters:
 *        - in: body
 *          name: team registration
 *          description: To add the team registration details
 *          schema:
 *            type:  object
 *            required:
 *              - tournament_category_id
 *              - team_name
 *              - team_members
 *              - user_id
 *            properties:
 *              tournament_category_id:
 *                type: integer
 *              team_name:
 *                type: string
 *              team_members:
 *                type: object
 *              user_id:
 *                type: string
 *     responses:
 *       200:
 *          description: Team Registration added Successfully
 */

router.post("/register", teamRegister);

/**
 * @swagger
 *  /api/teams/clubTeam:
 *   post:
 *     summary: Add Club Team Registration details
 *     description: Add new Club Team Registration details
 *     tags : ["Teams"]
 *     parameters:
 *        - in: body
 *          name: Club team registration
 *          description: To add the Club team registration details
 *          schema:
 *            type:  object
 *            required:
 *              - parent_company_id
 *              - categorywise_statistics
 *            properties:
 *              parent_company_id:
 *                type: uuid
 *              categorywise_statistics:
 *                type: object
 *     responses:
 *       200:
 *          description: Club Team Registered Successfully
 */

router.post("/clubTeam", createClubTeam);

/**
 * @swagger
 *  /api/teams/createVenue:
 *   post:
 *     summary: To Create third party venue
 *     description: To Create third party venue
 *     tags : ["Teams"]
 *     parameters:
 *        - in: body
 *          name: Create Third Party Venue
 *          description: To Create third party venue
 *          schema:
 *            type:  object
 *            required:
 *              - venue_name
 *            properties:
 *              venue_name:
 *                type: string
 *              address:
 *                type: object
 *     responses:
 *       200:
 *          description: Third Party Venue Created Successfully
 */

router.post("/createVenue", createThirdPartyVenue);

/**
 * @swagger
 *  /api/teams/createBrandProduct:
 *   post:
 *     summary: To Create brand product
 *     description: To Create brand product
 *     tags : ["Teams"]
 *     parameters:
 *        - in: body
 *          name: Create brand product
 *          description: To Create brand product
 *          schema:
 *            type:  object
 *            required:
 *              - company_name
 *            properties:
 *              company_name:
 *                type: string
 *              address:
 *                type: object
 *     responses:
 *       200:
 *          description: Brand product Created Successfully
 */

router.post("/createBrandProduct", createBrandProduct);

/**
 * @swagger
 *  /api/teams/:
 *   post:
 *     summary: Add Team details
 *     description: Add new Team  details
 *     tags : ["Teams"]
 *     parameters:
 *        - in: body
 *          name: team registration
 *          description: To add the team  details
 *          schema:
 *            type:  object
 *            required:
 *              - team_members
 *              - team_captain
 *              - company_id
 *            properties:
 *              team_members:
 *                type: object
 *              team_captain:
 *                type: string
 *              company_id:
 *                type: string
 *     responses:
 *       200:
 *          description: Team added Successfully
 */
router.post("/", teamsCreateValidator, runValidation, createTeam);

/**
 * @swagger
 *  /api/teams:
 *   put:
 *     summary: Edit teams details
 *     tags : ["Teams"]
 *     description: Teams Edit
 *     parameters:
 *        - in: body
 *          name: teams edit
 *          description: To edit the teams details
 *          schema:
 *            type:  object
 *            required:
 *              - team_members
 *              - company_id
 *              - team_id
 *            properties:
 *              team_members:
 *                type: object
 *              team_captain:
 *                type: string
 *              company_id:
 *                type: string
 *              team_id:
 *                type: string
 *     responses:
 *       200:
 *          description: Teams edited successfully
 */

router.put("/", teamsUpdateValidator, runValidation, editTeam);

/**
 * @swagger
 * paths:
 *  /api/teams/getById/{id}:
 *   get:
 *     summary: Get Teams details by Id
 *     tags : ["Teams"]
 *     description: Get Teams details
 *     parameters:
 *        - in: path
 *          name: id
 *          description: team id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getById/:team_id", fetchTeam);

/**
 * @swagger
 *  /api/teams/getByTeamName:
 *   post:
 *     summary: Get team details
 *     description: Add new team
 *     tags : ["Teams"]
 *     parameters:
 *        - in: body
 *          name: team
 *          description: To get team details
 *          schema:
 *            type: object
 *            required:
 *              - team_name
 *              - tournament_id
 *            properties:
 *              team_name:
 *                type: string
 *              tournament_id:
 *                type: integer
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/getByTeamName",
  teamsNameValidator,
  runValidation,
  getByTeamNameandTournamentId
);

/**
 * @swagger
 * paths:
 *  /api/teams/getParticipantByTournamentCatId/{id}:
 *   get:
 *     summary: Get participant by tournament by Category Id
 *     tags : ["Teams"]
 *     description: Get participant by tournament by Category
 *     parameters:
 *        - in: path
 *          name: id
 *          description: category id
 *          type: integer
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get(
  "/getParticipantByTournamentCatId/:category_id",
  getParticipantByTournamentCatId
);

/**
 * @swagger
 * paths:
 *  /api/teams/getParticipantByCompanyId/{id}:
 *   get:
 *     summary: Get participant by tournament by  Company Id
 *     tags : ["Teams"]
 *     description: Get participant by tournament by  Company details
 *     parameters:
 *        - in: path
 *          name: id
 *          description: company id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getParticipantByCompanyId/:company_id", getParticipantByCompanyId);

/**
 * @swagger
 * paths:
 *  /api/teams/getByTeamId/{id}:
 *   get:
 *     summary: Get Teams details by Id
 *     tags : ["Teams"]
 *     description: Get Teams details
 *     parameters:
 *        - in: path
 *          name: id
 *          description: team id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getByTeamId/:team_id", getByTeamId);

// /**
// * @swagger
// * paths:
// *  /api/teams/deleteById/{id}:
// *   delete:
// *     summary: Delete Teams By Id
// *     tags : ["Teams"]
// *     description: Delete Teams details
// *     parameters:
// *        - in: path
// *          name: id
// *          description: tournament player reg id
// *          type: string
// *          required: true
// *     responses:
// *       200:
// *         description: Deleted Sucessfully
// */

router.delete("/deleteById/:team_id", deleteTeam);

/**
 * @swagger
 *  /api/teams/getAll:
 *   get:
 *     summary: Get team
 *     tags : ["Teams"]
 *     description: Get all Teams details
 *     responses:
 *       200:
 *         description: Get all Teams details successfully
 */

router.get("/getAll", fetchAll);

/**
 * @swagger
 *  /api/teams/teamRegisterValidation:
 *   post:
 *     summary: Team Register Validation details
 *     description: Team Register Validation details
 *     tags : ["Teams"]
 *     parameters:
 *        - in: body
 *          name: team
 *          description: To validate the Team Register details
 *          schema:
 *            type: object
 *     responses:
 *       200:
 *          description: Successfully Validated
 */

router.post("/teamRegisterValidation", teamRegisterValidation);

/**
 * @swagger
 * paths:
 *  /api/teams/getPreferences/{id}:
 *   get:
 *     summary: Get Preferences Opted by Tournament Category ID
 *     tags : ["Teams"]
 *     description: Get Preferences Opted by Tournament Category ID
 *     parameters:
 *        - in: path
 *          name: id
 *          description: tournament category id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getPreferences/:tournament_category_id", getPreferencesOpted);

/**
 * @swagger
 * paths:
 *  /api/teams/getPreferencesDetails:
 *   post:
 *     summary: Get Preferences Details by Tournament Category ID
 *     tags : ["Teams"]
 *     description: Get Preferences Details by Tournament Category ID
 *     parameters:
 *        - in: body
 *          name: preferences
 *          description: To get preferences details
 *          schema:
 *            type:  object
 *            required:
 *              - tournament_category_id
 *              - apparel_preference
 *              - food_preference
 *            properties:
 *              tournament_category_id:
 *                type: integer
 *              apparel_preference:
 *                type: object
 *              food_preference:
 *                type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.post("/getPreferencesDetails", getPreferencesDetails);

module.exports = router;
