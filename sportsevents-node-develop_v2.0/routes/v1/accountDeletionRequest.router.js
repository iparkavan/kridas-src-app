const express = require("express");
const {
  accountDeletion,
  GetaccountDeletionById,
  getAll,
  deleteRequest,
} = require("../../controllers/accountDeletionRequest.controller");
const router = express.Router();

/**
 * @swagger
 * /api/accountDeletion
 *   post:
 *     summary: Returns Account Deletion
 *     description: To Delete Account Details of user.
 *     tags:
 *       -[" Account Deletion"]
 *     requestBody:
 *       description: To Delete Account Details of user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - request_date
 *               - deletion_reason
 *               - is_deleted
 *               - deletion_date
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *               request_date:
 *                 type: string
 *                 format: date-time
 *               deletion_reason:
 *                 type: string
 *               is_deleted:
 *                 type: boolean
 *               deletion_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Account Deletion Process has been Successfully initiated.
 */
router.post("/", accountDeletion);
/**
 * @swagger
 * /api/getAll
 *   post:
 *     summary: Returns all  Account Deletion data's
 *     description: To get all the data of the account deletion table.
 *     tags:
 *       -[" Account Deletion"]
 *     requestBody:
 *       description: Returns all  Account Deletion data's
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: - *
 *             properties: -*
 *     responses:
 *       200:
 *         description: To get all the data of the account deletion table..
 */
router.get("/getAll", getAll);
/**
 * @swagger
 * /api/accountDeletionByUserID:
 *   post:
 *     summary: Returns Account Deletion By user Id
 *     description: To Get Account Delete Details of user.
 *     tags:
 *       - [" Account Deletion" ]
 *     requestBody:
 *       description: To get Delete Account Details of user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid *
 *     responses:
 *       200:
 *         description:Get Account Deletion by user id.
 */
router.get("/getByUserID/:user_id", GetaccountDeletionById);
/**
 * @swagger
 * /api/deleteRequest:
 *   post:
 *     summary: Returns deleteRequest By user Id
 *     description: To delete Request of user.
 *     tags:
 *       - [" Account Deletion" ]
 *     requestBody:
 *       description:Returns deleteRequest By user Id
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid *
 *     responses:
 *       200:
 *         description:Returns deleteRequest By user Id
 */
router.delete("/delete/:user_id", deleteRequest);

module.exports = router;
