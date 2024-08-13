const express = require("express");
const {
  createUser,
  fetchUser,
  deleteUser,
  editUser,
  uploadTest,
  fetchAllUsers,
  uploadCloudinary,
  searchUser,
  fetchUserByToken,
  fetchUserByEmail,
  updateByToken,
  search,
  userData,
  updateByTokenAndEmail,
  verifyReferralCode,
  fetchUserName,
  activateUser,
  getByPlayerId,
  userProfileVerification,
} = require("../../controllers/user.Controller");
const { runValidation } = require("../../validations");
const {
  userCreateValidator,
  userUpdateValidator,
  userProfileCreateValidator,
  userProfileUpdateValidator,
  userTokenUpdateValidation,
} = require("../../validations/user");

const {
  createProfileVerification,
  editProfileVerification,
} = require("../../controllers/profileVerification.controller");
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
 *  /api/users:
 *   post:
 *     summary: To Add Users Details
 *     description: To Add Users Details
 *     tags : ["Users"]
 *     parameters:
 *        - in: body
 *          name: users
 *          description: To Add Users Details
 *          schema:
 *            type: object
 *            required:
 *              - user_id
 *              - first_name
 *              - last_name
 *              - middle_name
 *              - user_profile_img
 *              - user_email
 *              - user_phone
 *              - user_website
 *              - user_desc
 *              - user_status
 *              - reset_token
 *              - alternate_name
 *              - user_img
 *              - user_gender
 *              - user_dob
 *              - user_passport_nric
 *              - user_nationality
 *              - user_ethinicity
 *              - user_identity_docs
 *              - social
 *              - address
 *              - user_type
 *              - player_code
 *              - created_date
 *              - updated_date
 *              - user_age_group
 *              - user_profile_verified
 *              - sports_interested
 *              - user_profile_img_meta
 *              - user_img_meta
 *              - user_name
 *              - referral_code
 *              - registered_referral_code
 *              - bio_details
 *              - reward_point
 *            properties:
 *              user_id:
 *                type: string
 *              first_name:
 *                type: string
 *              last_name:
 *                type: string
 *              middle_name:
 *                type: string
 *              user_profile_img:
 *                type: string
 *              user_email:
 *                type: string
 *              user_phone:
 *                type: string
 *              user_website:
 *                type: string
 *              user_desc:
 *                type: string
 *              user_status:
 *                type: string
 *              reset_token:
 *                type: string
 *              alternate_name:
 *                type: string
 *              user_img:
 *                type: string
 *              user_gender:
 *                type: string
 *              user_dob:
 *                type: string
 *              user_passport_nric:
 *                type: string
 *              user_nationality:
 *                type: string
 *              user_ethinicity:
 *                type: string
 *              user_identity_docs:
 *                type: file
 *              social:
 *                type: object
 *              address:
 *                type: object
 *              user_type:
 *                type: string
 *              player_code:
 *                type: string
 *              created_date:
 *                type: string
 *              updated_date:
 *                type: string
 *              user_age_group:
 *                type: string
 *              user_profile_verified:
 *                type: boolean
 *              sports_interested:
 *                type: integer
 *              user_profile_img_meta:
 *                type: object
 *              user_img_meta:
 *                type: object
 *              user_name:
 *                type: string
 *              referral_code:
 *                type: string
 *              registered_referral_code:
 *                type: string
 *              bio_details:
 *                type: object
 *              reward_point:
 *                type: integer
 *     responses:
 *       200:
 *          description: User Details added Successfully
 */

router.post(
  "/",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "userProfileImage",
      maxCount: 1,
    },
    {
      name: "document",
      maxCount: 4,
    },
  ]),
  userCreateValidator,
  runValidation,
  createUser
);

/**
 * @swagger
 *  /api/users/profile:
 *   post:
 *     summary: Users - Create Profile Verification
 *     description: Users - Create Profile Verification
 *     tags : ["Users"]
 *     parameters:
 *        - in: body
 *          name: users
 *          description: Users - Create Profile Verification
 *          schema:
 *            type: object
 *            required:
 *              - company_id
 *              - user_id
 *              - applied_status
 *              - verification_comments
 *              - status_change_date
 *              - address_proof_type
 *              - id_proof_type
 *              - is_proof_same
 *            properties:
 *              company_id:
 *                type: string
 *              user_id:
 *                type: string
 *              applied_status:
 *                type: string
 *              verification_comments:
 *                type: string
 *              status_change_date:
 *                type: string
 *              address_proof_type:
 *                type: string
 *              id_proof_type:
 *                type: string
 *              is_proof_same:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/profile",
  userProfileCreateValidator,
  runValidation,
  createProfileVerification
);

/**
 * @swagger
 *  /api/users/search:
 *   post:
 *     summary: users - search details
 *     description: users - search details
 *     tags : ["Users"]
 *     parameters:
 *        - in: body
 *          name: event organizer
 *          description: users - search details
 *          schema:
 *            type: object
 *            required:
 *              - page
 *              - sort
 *              - size
 *              - name
 *              - mobileNo
 *              - email
 *              - address
 *              - user_type
 *              - fromDate
 *              - toDate
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *              name:
 *                type: string
 *              mobileNo:
 *                type: integer
 *              email:
 *                type: string
 *              address:
 *                type: string
 *              user_type:
 *                type: string
 *              fromDate:
 *                type: string
 *              toDate:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post("/search", searchUser);

/**
 * @swagger
 *  /api/users:
 *   put:
 *     summary: To Edit Users Details
 *     description: To Edit Users Details
 *     tags : ["Users"]
 *     parameters:
 *        - in: body
 *          name: users
 *          description: To Edit Users Details
 *          schema:
 *            type: object
 *            required:
 *              - user_id
 *              - first_name
 *              - last_name
 *              - middle_name
 *              - user_profile_img
 *              - user_email
 *              - user_phone
 *              - user_website
 *              - user_desc
 *              - user_status
 *              - reset_token
 *              - alternate_name
 *              - user_img
 *              - user_gender
 *              - user_dob
 *              - user_passport_nric
 *              - user_nationality
 *              - user_ethinicity
 *              - user_identity_docs
 *              - social
 *              - address
 *              - user_type
 *              - player_code
 *              - created_date
 *              - updated_date
 *              - user_age_group
 *              - user_profile_verified
 *              - sports_interested
 *              - user_profile_img_meta
 *              - user_img_meta
 *              - user_name
 *              - referral_code
 *              - registered_referral_code
 *              - bio_details
 *              - reward_point
 *            properties:
 *              user_id:
 *                type: string
 *              first_name:
 *                type: string
 *              last_name:
 *                type: string
 *              middle_name:
 *                type: string
 *              user_profile_img:
 *                type: string
 *              user_email:
 *                type: string
 *              user_phone:
 *                type: string
 *              user_website:
 *                type: string
 *              user_desc:
 *                type: string
 *              user_status:
 *                type: string
 *              reset_token:
 *                type: string
 *              alternate_name:
 *                type: string
 *              user_img:
 *                type: string
 *              user_gender:
 *                type: string
 *              user_dob:
 *                type: string
 *              user_passport_nric:
 *                type: string
 *              user_nationality:
 *                type: string
 *              user_ethinicity:
 *                type: string
 *              user_identity_docs:
 *                type: file
 *              social:
 *                type: object
 *              address:
 *                type: object
 *              user_type:
 *                type: string
 *              player_code:
 *                type: string
 *              created_date:
 *                type: string
 *              updated_date:
 *                type: string
 *              user_age_group:
 *                type: string
 *              user_profile_verified:
 *                type: boolean
 *              sports_interested:
 *                type: integer
 *              user_profile_img_meta:
 *                type: object
 *              user_img_meta:
 *                type: object
 *              user_name:
 *                type: string
 *              referral_code:
 *                type: string
 *              registered_referral_code:
 *                type: string
 *              bio_details:
 *                type: object
 *              reward_point:
 *                type: integer
 *     responses:
 *       200:
 *          description: User Details edited Successfully
 */

router.put(
  "/",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "userProfileImage",
      maxCount: 1,
    },
    {
      name: "document",
      maxCount: 4,
    },
  ]),
  userUpdateValidator,
  runValidation,
  editUser
);

/**
 * @swagger
 *  /api/users/updateByToken:
 *   put:
 *     summary: Users details update by token
 *     description: Users details search By token
 *     tags : ["Users"]
 *     parameters:
 *        - in: body
 *          name: users
 *          description:  Users details search by token
 *          schema:
 *            type: object
 *            required:
 *              - token
 *            properties:
 *              token:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.put("/updateByToken", updateByToken);

/**
 * @swagger
 *  /api/users/activateUser:
 *   put:
 *     summary: Users - Activate
 *     description: Users - Activate
 *     tags : ["Users"]
 *     parameters:
 *        - in: body
 *          name: users
 *          description:  Users - Activate
 *          schema:
 *            type: object
 *            required:
 *              - user_id
 *              - status
 *            properties:
 *              user_id:
 *                type: string
 *              status:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.put("/activateUser", activateUser);

/**
 * @swagger
 *  /api/users/updateByTokenAndEmail:
 *   put:
 *     summary: Users Update By Token and Email
 *     description: Users Update By Token and Email
 *     tags : ["Users"]
 *     parameters:
 *        - in: body
 *          name: users
 *          description:  Users Update By Token and Email
 *          schema:
 *            type: object
 *            required:
 *              - token
 *              - email
 *            properties:
 *              token:
 *                type: string
 *              email:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.put(
  "/updateByTokenAndEmail",
  userTokenUpdateValidation,
  runValidation,
  updateByTokenAndEmail
);

/**
 * @swagger
 * paths:
 *  /api/users/get/{user_id}:
 *   get:
 *     summary: Get User details by User Id
 *     tags : ["Users"]
 *     description: Get User details by User Id
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

router.get("/get/:user_id", fetchUser);

/**
 * @swagger
 * paths:
 *  /api/users/getByEmail/{user_email}:
 *   get:
 *     summary: Get User details by User Email
 *     tags : ["Users"]
 *     description: Get User details by User Email
 *     parameters:
 *        - in: path
 *          name: user_email
 *          description: user_email
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getByEmail/:user_email", fetchUserByEmail);

/**
 * @swagger
 * paths:
 *  /api/users/getByToken/{token}:
 *   get:
 *     summary: Get User details by token
 *     tags : ["Users"]
 *     description: Get User details by token
 *     parameters:
 *        - in: path
 *          name: token
 *          description: token
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getByToken/:token", fetchUserByToken);

/**
 * @swagger
 *  /api/users/getAll:
 *   get:
 *     summary: Get all Users details
 *     tags : ["Users"]
 *     description: Get all Users details
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getAll", fetchAllUsers);

/**
 * @swagger
 * paths:
 *  /api/users/delete/{user_id}:
 *   delete:
 *     summary: Delete Users Details By Id
 *     tags : ["Users"]
 *     description: Delete Userss details
 *     parameters:
 *        - in: path
 *          name: user_id
 *          description: user_id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Deleted Successfully
 */

router.delete("/delete/:user_id", deleteUser);

/**
 * @swagger
 *  /api/users/searchByName:
 *   post:
 *     summary: Users details search By text and area
 *     description: Users details search By teaxt and area
 *     tags : ["Users"]
 *     parameters:
 *        - in: body
 *          name: users
 *          description:  Users details search
 *          schema:
 *            type: object
 *            required:
 *              - search_text
 *              - search_area
 *            properties:
 *              search_text:
 *                type: string
 *              search_area:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post("/searchByName", search);

/**
 * @swagger
 * paths:
 *  /api/users/getUserData/{user_id}/{type}:
 *   get:
 *     summary: Get user data by user id and type
 *     tags : ["Users"]
 *     description: Get user data by user id and type
 *     parameters:
 *        - in: path
 *          name: user_id
 *          description: user_id
 *          type: string
 *          required: true
 *        - in: path
 *          name: type
 *          description: type
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getUserData/:user_id/:type?", userData);

/**
 * @swagger
 * paths:
 *  /api/users/code-verification/{code}:
 *   get:
 *     summary: User code verification
 *     tags : ["Users"]
 *     description: User code verification
 *     parameters:
 *        - in: path
 *          name: code
 *          description: code
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/code-verification/:code", verifyReferralCode);

/**
 * @swagger
 * paths:
 *  /api/users/getUsername/{user_name}:
 *   get:
 *     summary: Get User details by User Name
 *     tags : ["Users"]
 *     description: Get User details by User name
 *     parameters:
 *        - in: path
 *          name: user_name
 *          description: user_name
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getUsername/:user_name", fetchUserName);

/**
 * @swagger
 * paths:
 *  /api/users/getByPlayerId/{player_id}:
 *   get:
 *     summary: Get user data by player id
 *     tags : ["Users"]
 *     description: Get user data by player id
 *     parameters:
 *        - in: path
 *          name: player id
 *          description: player id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getByPlayerId/:player_id", getByPlayerId);

/**
 * @swagger
 *  /api/users/verifyProfile:
 *   put:
 *     summary: to verify Profile
 *     description: verify Profile
 *     tags : ["Users"]
 *     parameters:
 *        - in: body
 *          name: user
 *          description: verify Profile
 *          schema:
 *            type: object
 *            required:
 *              - user_profile_verified
 *              - user_id
 *            properties:
 *              user_profile_verified:
 *                type: boolesn
 *              user_id:
 *                type: uuid
 *     responses:
 *       200:
 *          description: Successfully Verified.
 */

router.put("/verifyProfile", userProfileVerification);

module.exports = router;
