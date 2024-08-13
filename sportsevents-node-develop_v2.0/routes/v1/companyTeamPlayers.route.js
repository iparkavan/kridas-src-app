const express = require("express");
const {
  createCompanyTeamPlayers,
  getByCompanyId,
  getChildPagePlayersByCompanyId,
  updateStatus,
  searchPlayer,
} = require("../../controllers/companyTeamPlayers.controller");
const { runValidation } = require("../../validations");
const {
  playerRegistrationValidator,
} = require("../../validations/companyTeamPlayer");
const router = express.Router();

const multer = require("multer");

const fileUpload = multer({ dest: "uploads/" });
//const imageUpload = multer();

// Storage Engin That Tells/Configures Multer for where (destination) and how (filename) to save/upload our files
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); //important this is a direct path fron our current file to storage location
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

// The Multer Middleware that is passed to routes that will receive income requests with file data (multipart/formdata)
// You can create multiple middleware each with a different storage engine config so save different files in different locations on server
const upload = multer({ storage: fileStorageEngine });

/**
 * @swagger
 *  /api/company-team-player/playerReg:
 *   post:
 *     summary: Add Player details
 *     description: Add Player details
 *     tags : ["Company-Team-Players"]
 *     parameters:
 *        - in: body
 *          name: Company Team Player
 *          description: To add the Player details
 *          schema:
 *            type: object
 *            required:
 *              - company_id
 *              - player
 *            properties:
 *              company_id:
 *                type: string
 *              player:
 *                type: object
 *              identity_docs:
 *                type: string
 *     responses:
 *       200:
 *          description: Player details added Successfully
 */

router.post(
  "/playerReg",
  upload.fields([
    {
      name: "document",
      maxCount: 1,
    },
  ]),
  playerRegistrationValidator,
  runValidation,
  createCompanyTeamPlayers
);

/**
 * @swagger
 * paths:
 *  /api/company-team-player/getByCompanyId/{company_id}:
 *   get:
 *     summary: Get Company Team Player details by Company Id
 *     tags : ["Company-Team-Players"]
 *     description: Get Company Team Player details by Company Id
 *     parameters:
 *        - in: path
 *          name: company_id
 *          description: company_id
 *          type: uuid
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getByCompanyId/:company_id", getByCompanyId);

/**
 * @swagger
 * paths:
 *  /api/company-team-player/getAllUsers/{company_id}:
 *   get:
 *     summary: Get all Company Team Player details by Parent Company Id
 *     tags : ["Company-Team-Players"]
 *     description: Get Company Team Player details by Parent Company Id
 *     parameters:
 *        - in: path
 *          name: company_id
 *          description: company_id
 *          type: uuid
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getByParentId/:company_id", getChildPagePlayersByCompanyId);

/**
 * @swagger
 *  /api/company-team-player/updateStatus:
 *   put:
 *     summary: Update User Status By Company Team Players Id
 *     description: Update User Status By Company Team Players Id
 *     tags : ["Company-Team-Players"]
 *     parameters:
 *        - in: body
 *          name: updateStatus
 *          description: Update User Status By Company Team Players Id
 *          schema:
 *            type: object
 *            required:
 *              - company_team_players_id
 *              - user_status
 *            properties:
 *              user_id:
 *                type: string
 *              status:
 *                type: string
 *     responses:
 *       200:
 *          description: Successfully updated the user status
 */

router.put("/updateStatus", updateStatus);

/**
 * @swagger
 *  /api/company-team-player/searchPlayer:
 *   put:
 *     summary: Filter Player Based on Condition
 *     description: Filter Player Based on Condition
 *     tags : ["Company-Team-Players"]
 *     parameters:
 *        - in: body
 *          name: searchPlayer
 *          description: Filter Player Based on Condition
 *          schema:
 *            type: object
 *            properties:
 *              first_name:
 *                type: string
 *              last_name:
 *                type: string
 *              email_id:
 *                type: string
 *              user_dob:
 *                type: string
 *              player_id:
 *                type: string
 *              contact_number:
 *                type: string
 *              team_name:
 *                type: string
 *              sports_id:
 *                type: integer
 *
 *     responses:
 *       200:
 *          description:Successfully Filtered
 */

router.post("/searchPlayer", searchPlayer);

module.exports = router;
