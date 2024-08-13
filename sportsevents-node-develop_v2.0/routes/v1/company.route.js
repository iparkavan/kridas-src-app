const express = require("express");
const {
  createCompany,
  fetchCompany,
  deleteCompany,
  editCompany,
  fetchAll,
  fetchCompanyByEmail,
  fetchCompanyByType,
  fetchCompanyByToken,
  updateByToken,
  fetchCompanyTypes,
  fetchCompanyTypeDetailsByCompanyId,
  fetchCompanyByName,
  fetchByParentCompany,
  fetchAllParentCompany,
  searchCompany,
  fetchCompanyByUser,
  fetchCompanyDataById,
  fetchCompanyUrlName,
  search,
  searchIsFeature,
  searchByUserId,
  getByParentCompanyId,
  getParentTeamPagesByUserId,
  getAllCities,
  companyProfileVerification,
} = require("../../controllers/company.controller");
const { runValidation } = require("../../validations");
const {
  companyCreateValidator,
  companyUpdateValidator,
  companyProfileCreateValidator,
} = require("../../validations/company");

const { userProfileCreateValidator } = require("../../validations/user");
const {
  createProfileVerification,
} = require("../../controllers/profileVerification.controller");

const router = express.Router();

const multer = require("multer");
// Storage Engin That Tells/Configures Multer for where (destination) and how (filename) to save/upload our files
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); //important this is a direct path fron our current file to storage location
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

/**
 * @swagger
 *  /api/company:
 *   post:
 *     summary: Add Company details
 *     description: Add new Company details
 *     tags : ["Company"]
 *     parameters:
 *        - in: body
 *          name: company
 *          description: To add the company details
 *          schema:
 *            type:  object
 *            required:
 *              - company_id
 *              - company_name
 *              - company_reg_no
 *              - company_profile_img
 *              - company_email
 *              - company_contact_no
 *              - company_website
 *              - company_desc
 *              - alternate_name
 *              - company_img
 *              - social
 *              - address
 *              - company_identity_docs
 *              - company_status
 *              - reset_token
 *              - parent_company_id
 *              - created_date
 *              - updated_date
 *              - company_profile_verified
 *              - company_profile_img_meta
 *              - company_img_meta
 *              - company_type
 *              - company_public_url_name
 *              - main_category_type
 *              - is_featured
 *            properties:
 *              company_id:
 *                type: string
 *              company_name:
 *                type: string
 *              company_reg_no:
 *                type: string
 *              company_profile_img:
 *                type: string
 *              company_email:
 *                type: string
 *              company_contact_no:
 *                type: string
 *              company_website:
 *                type: string
 *              company_desc:
 *                type: string
 *              alternate_name:
 *                type: string
 *              company_img:
 *                type: string
 *              social:
 *                type: object
 *              address:
 *                type: object
 *              company_identity_docs:
 *                type: object
 *              company_status:
 *                type: string
 *              reset_token:
 *                type: string
 *              parent_company_id:
 *                type: string
 *              created_date:
 *                type: string
 *              updated_date:
 *                type: string
 *              company_profile_verified:
 *                type: boolean
 *              company_profile_img_meta:
 *                type: object
 *              company_img_meta:
 *                type: object
 *              company_type:
 *                type: integer
 *              company_public_url_name:
 *                type: string
 *              company_referral_code:
 *                type: string
 *              main_category_type:
 *                type: integer
 *              is_featured:
 *                type: boolean
 *     responses:
 *       200:
 *          description: event organizer details added Successfully
 */

router.post(
  "/",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "companyProfileImage",
      maxCount: 1,
    },
    {
      name: "document",
      maxCount: 4,
    },
  ]),
  companyCreateValidator,
  runValidation,
  createCompany
);

/**
 * @swagger
 *  /api/company:
 *   put:
 *     summary: Edit Company details
 *     description: Edit new Company details
 *     tags : ["Company"]
 *     parameters:
 *        - in: body
 *          name: company
 *          description: To edit the company details
 *          schema:
 *            type:  object
 *            required:
 *              - company_id
 *              - company_name
 *              - company_reg_no
 *              - company_profile_img
 *              - company_email
 *              - company_contact_no
 *              - company_website
 *              - company_desc
 *              - alternate_name
 *              - company_img
 *              - social
 *              - address
 *              - company_identity_docs
 *              - company_status
 *              - reset_token
 *              - parent_company_id
 *              - created_date
 *              - updated_date
 *              - company_profile_verified
 *              - company_profile_img_meta
 *              - company_img_meta
 *              - company_type
 *              - company_public_url_name
 *              - main_category_type
 *              - is_featured
 *            properties:
 *              company_id:
 *                type: string
 *              company_name:
 *                type: string
 *              company_reg_no:
 *                type: string
 *              company_profile_img:
 *                type: string
 *              company_email:
 *                type: string
 *              company_contact_no:
 *                type: string
 *              company_website:
 *                type: string
 *              company_desc:
 *                type: string
 *              alternate_name:
 *                type: string
 *              company_img:
 *                type: string
 *              social:
 *                type: object
 *              address:
 *                type: object
 *              company_identity_docs:
 *                type: object
 *              company_status:
 *                type: string
 *              reset_token:
 *                type: string
 *              parent_company_id:
 *                type: string
 *              created_date:
 *                type: string
 *              updated_date:
 *                type: string
 *              company_profile_verified:
 *                type: boolean
 *              company_profile_img_meta:
 *                type: object
 *              company_img_meta:
 *                type: object
 *              company_type:
 *                type: integer
 *              company_public_url_name:
 *                type: string
 *              company_referral_code:
 *                type: string
 *              main_category_type:
 *                type: integer
 *              is_featured:
 *                type: boolean
 *     responses:
 *       200:
 *          description: event organizer details edited Successfully
 */

router.put(
  "/",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "companyProfileImage",
      maxCount: 1,
    },
    {
      name: "document",
      maxCount: 4,
    },
  ]),
  companyUpdateValidator,
  runValidation,
  editCompany
);

/**
 * @swagger
 *  /api/company/search:
 *   post:
 *     summary: Search Company By User Id
 *     description:  Search Company By User Id
 *     tags : ["Company"]
 *     parameters:
 *        - in: body
 *          name: company
 *          description: Search Company Details By User Id
 *          schema:
 *            type: object
 *            required:
 *              - user_id
 *            properties:
 *              user_id:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/search",
  userProfileCreateValidator,
  runValidation,
  searchCompany
);

/**
 * @swagger
 *  /api/company/profile:
 *   post:
 *     summary: Add profile verification
 *     description:  Add profile verification
 *     tags : ["Company"]
 *     parameters:
 *        - in: body
 *          name: company
 *          description: Add profile verification
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
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/profile",
  companyProfileCreateValidator,
  runValidation,
  createProfileVerification
);

/**
 * @swagger
 *  /api/company/searchByName:
 *   post:
 *     summary: Search Company Details
 *     description:  Search Company Details
 *     tags : ["Company"]
 *     parameters:
 *        - in: body
 *          name: company
 *          description: Search Company Details
 *          schema:
 *            type: object
 *            required:
 *              - company_name
 *              - parent_category_ids
 *              - category_ids
 *              - sports_id
 *            properties:
 *              company_name:
 *                type: string
 *              parent_category_ids:
 *                type: integer
 *              category_ids:
 *                type: string
 *              sports_id:
 *                type: integer
 *     responses:
 *       200:
 *          description: Success
 */

router.post("/searchByName", search);

/**
 * @swagger
 *  /api/company/updateByToken:
 *   put:
 *     summary: Update Token
 *     description: Update Token
 *     tags : ["Company"]
 *     parameters:
 *        - in: body
 *          name: company
 *          description: Update Token
 *          schema:
 *            type: object
 *            required:
 *              - token
 *            properties:
 *              token:
 *                type: string
 *     responses:
 *       200:
 *          description: Successfully updated.
 */

router.put("/updateByToken", updateByToken);

/**
 * @swagger
 * paths:
 *  /api/company/get/{company_id}:
 *   get:
 *     summary: Get Company details by Id
 *     tags : ["Company"]
 *     description: Get Company details
 *     parameters:
 *        - in: path
 *          name: company_id
 *          description: company id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/get/:company_id", fetchCompany);

/**
 * @swagger
 * paths:
 *  /api/company/getByUser/{user_id}:
 *   get:
 *     summary: Get Company details by user id
 *     tags : ["Company"]
 *     description: Get Company details
 *     parameters:
 *        - in: path
 *          name: user_id
 *          description: user id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getByUser/:user_id", fetchCompanyByUser);

/**
 * @swagger
 * paths:
 *  /api/company/getByType/{company_type}:
 *   get:
 *     summary: Get Company details by company type
 *     tags : ["Company"]
 *     description: Get Company details
 *     parameters:
 *        - in: path
 *          name: company_type
 *          description: company type
 *          type: integer
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getByType/:company_type", fetchCompanyByType);

/**
 * @swagger
 * paths:
 *  /api/company/getByEmail/{company_email}:
 *   get:
 *     summary: Get Company details by company email
 *     tags : ["Company"]
 *     description: Get Company details
 *     parameters:
 *        - in: path
 *          name: company_email
 *          description: company email
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getByEmail/:company_email", fetchCompanyByEmail);

/**
 * @swagger
 * paths:
 *  /api/company/getByToken/{token}:
 *   get:
 *     summary: Get Company details by token
 *     tags : ["Company"]
 *     description: Get Company details
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

router.get("/getByToken/:token", fetchCompanyByToken);

/**
 * @swagger
 *  /api/company/getAll:
 *   get:
 *     summary: Get all Company details
 *     tags : ["Company"]
 *     description: Get Company details
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getAll", fetchAll);

/**
 * @swagger
 * paths:
 *  /api/company/delete/{company_id}:
 *   delete:
 *     summary: Delete Company Details By  Company Id
 *     tags : ["Company"]
 *     description: Delete Company details
 *     parameters:
 *        - in: path
 *          name: company_id
 *          description: company_id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Deleted Successfully
 */

router.delete("/delete/:company_id", deleteCompany);

/**
 * @swagger
 * paths:
 *  /api/company/getTypes/{company_id}:
 *   get:
 *     summary: Get Company Type details by Id
 *     tags : ["Company"]
 *     description: Get Company type details
 *     parameters:
 *        - in: path
 *          name: company_id
 *          description: company id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getTypes/:company_id", fetchCompanyTypes);

/**
 * @swagger
 *  /api/company/getTypeDetail:
 *   post:
 *     summary: Fetch CompanyType Details By CompanyId and Company Type
 *     description:  Fetch CompanyType Details By CompanyId and Company Type
 *     tags : ["Company"]
 *     parameters:
 *        - in: body
 *          name: company
 *          description: Fetch CompanyType Details By CompanyId and Company Type
 *          schema:
 *            type: object
 *            required:
 *              - company_id
 *              - company_type
 *            properties:
 *              company_id:
 *                type: string
 *              company_type:
 *                type: integer
 *     responses:
 *       200:
 *          description: Success
 */

router.post("/getTypeDetail", fetchCompanyTypeDetailsByCompanyId);

/**
 * @swagger
 * paths:
 *  /api/company/fetchCompanyByName/{company_name}:
 *   get:
 *     summary: Get Company details by name
 *     tags : ["Company"]
 *     description: Get Company details
 *     parameters:
 *        - in: path
 *          name: company_name
 *          description: company name
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/fetchCompanyByName/:company_name", fetchCompanyByName);

/**
 * @swagger
 * paths:
 *  /api/company/getByParent/{parent_company_id}:
 *   get:
 *     summary: Get Company details by parent company id
 *     tags : ["Company"]
 *     description: Get parent company details
 *     parameters:
 *        - in: path
 *          name: parent_company_id
 *          description: parent company id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getByParent/:parent_company_id", fetchByParentCompany);

/**
 * @swagger
 * paths:
 *  /api/company/getChildPages:
 *   get:
 *     summary: Get child Company details by parent company id
 *     tags : ["Company"]
 *     description: Get child company details by parent company id
 *     parameters:
 *        - in: body
 *          name: company
 *          description: Fetch child company Details By CompanyId
 *          schema:
 *            type: object
 *            required:
 *              - company_id
 *            properties:
 *              company_id:
 *                type: string
 *              type:
 *                type: string
 *              name:
 *                type: string
 *              sports_id:
 *                type: integer
 *              gender:
 *                type: string
 *              age_group:
 *                type: string
 *              skill_level:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post("/getChildPages", getByParentCompanyId);

/**
 * @swagger
 *  /api/company/fetchAllParentCompany:
 *   get:
 *     summary: Get all Parent Company details
 *     tags : ["Company"]
 *     description: Get Parent Company details
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/fetchAllParentCompany", fetchAllParentCompany);

/**
 * @swagger
 * paths:
 *  /api/company/getCompanyData/{company_id}:
 *   get:
 *     summary: Get Company details by parent company id
 *     tags : ["Company"]
 *     description: Get company data using company id
 *     parameters:
 *        - in: path
 *          name: company_id
 *          description: company id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getCompanyData/:company_id", fetchCompanyDataById);

/**
 * @swagger
 * paths:
 *  /api/company/fetchCompanyUrlName/{company_public_url_name}:
 *   get:
 *     summary: Get Company details by parent company public url
 *     tags : ["Company"]
 *     description: Get company details using company public url
 *     parameters:
 *        - in: path
 *          name: company_public_url_name
 *          description: company public url name
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get(
  "/fetchCompanyUrlName/:company_public_url_name",
  fetchCompanyUrlName
);

/**
 * @swagger
 *  /api/company/searchIsFeature:
 *   post:
 *     summary: Search Is Feature
 *     description:  Search Is Feature
 *     tags : ["Company"]
 *     parameters:
 *        - in: body
 *          name: company
 *          description: Search Is Feature
 *          schema:
 *            type: object
 *            required:
 *              - is_feature
 *            properties:
 *              is_feature:
 *                type: boolean
 *     responses:
 *       200:
 *          description: Success
 */

router.post("/searchIsFeature", searchIsFeature);

/**
 * @swagger
 *  /api/company/searchByUserId:
 *   post:
 *     summary: Search By User Id
 *     description:  Search By User Id
 *     tags : ["Company"]
 *     parameters:
 *        - in: body
 *          name: company
 *          description: search by userId
 *          schema:
 *            type: object
 *            required:
 *              - user_id
 *            properties:
 *              user_id:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post("/searchByUserId", searchByUserId);

/**
 * @swagger
 * paths:
 *  /api/company/getParentTeamPages:
 *   get:
 *     summary: Get Parent Team Company details by user id
 *     tags : ["Company"]
 *     description: Get Parent Team Company details
 *     parameters:
 *        - in: path
 *          name: user_id
 *          description: user id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.post("/getParentTeamPages", getParentTeamPagesByUserId);

/**
 * @swagger
 *  /api/company/getAllCities:
 *   get:
 *     summary: Get all registered Cities
 *     tags : ["Company"]
 *     description: Get all registered Cities
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getAllCities", getAllCities);

/**
 * @swagger
 *  /api/company/verifyProfile:
 *   put:
 *     summary: to verify Profile
 *     description: verify Profile
 *     tags : ["Company"]
 *     parameters:
 *        - in: body
 *          name: company
 *          description: verify Profile
 *          schema:
 *            type: object
 *            required:
 *              - company_profile_verified
 *              - company_id
 *            properties:
 *              company_profile_verified:
 *                type: boolesn
 *              company_id:
 *                type: uuid
 *     responses:
 *       200:
 *          description: Successfully Verified.
 */

router.put("/verifyProfile", companyProfileVerification);

module.exports = router;
