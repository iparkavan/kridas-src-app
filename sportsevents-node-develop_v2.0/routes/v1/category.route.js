const express = require("express");
const {
  createCategory,
  deleteCategory,
  fetchCategory,
  fetchByParentCategory,
  editCategory,
  fetchCategoriesByParentCategoryType,
  fetchAll,
  fetchAllParentCategory,
  fetchCategoriesByCategoryName,
  getAllSubCategories,
} = require("../../controllers/category.controller");

const { runValidation } = require("../../validations");
const {
  categoryCreateValidator,

  categoryUpdateValidator,
} = require("../../validations/category");
const router = express.Router();

/**
 * @swagger
 *  /api/category:
 *   post:
 *     summary: Add Category details
 *     description: Add new Category details
 *     tags : ["Category"]
 *     parameters:
 *        - in: body
 *          name: category
 *          description: To add the Category details
 *          schema:
 *            type:  object
 *            required:
 *              - category_name
 *              - category_desc
 *              - category_type
 *              - parent_category_id
 *            properties:
 *              category_name:
 *                type: string
 *              category_desc:
 *                type: string
 *              category_type:
 *                type: string
 *              parent_category_id:
 *                type: integer
 *     responses:
 *       200:
 *          description: category details added Successfully
 */

router.post("/", categoryCreateValidator, runValidation, createCategory);

/**
 * @swagger
 *  /api/category:
 *   put:
 *     summary: Edit Category details
 *     description: Edit new Category details
 *     tags : ["Category"]
 *     parameters:
 *        - in: body
 *          name: category
 *          description: To edit the Category details
 *          schema:
 *            type:  object
 *            required:
 *              - category_name
 *              - category_desc
 *              - category_type
 *              - parent_category_id
 *              - category_id
 *            properties:
 *              category_name:
 *                type: string
 *              category_desc:
 *                type: string
 *              category_type:
 *                type: string
 *              parent_category_id:
 *                type: integer
 *              category_id:
 *                type: integer
 *     responses:
 *       200:
 *          description: category details edited Successfully
 */

router.put("/", categoryUpdateValidator, runValidation, editCategory);

/**
 * @swagger
 * paths:
 *  /api/category/get/{category_id}:
 *   get:
 *     summary: Get Category details by Category Id
 *     tags : ["Category"]
 *     description: Get Category details by Category Id
 *     parameters:
 *        - in: path
 *          name: category_id
 *          description: category id
 *          type: integer
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/get/:category_id", fetchCategory);

/**
 * @swagger
 * paths:
 *  /api/category/getByParent/{parent_category_id}:
 *   get:
 *     summary: Get Category details by parent Id
 *     tags : ["Category"]
 *     description: Get Category details by parent Id
 *     parameters:
 *        - in: path
 *          name: parent_category_id
 *          description: parent category id
 *          type: integer
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getByParent/:parent_category_id", fetchByParentCategory);

/**
 * @swagger
 * paths:
 *  /api/category/delete/{category_id}:
 *   delete:
 *     summary: Delete Category Details By Id
 *     tags : ["Category"]
 *     description: Delete Event Organizer details
 *     parameters:
 *        - in: path
 *          name: category_id
 *          description: category_id
 *          type: integer
 *          required: true
 *     responses:
 *       200:
 *         description: Deleted Successfully
 */

router.delete("/delete/:category_id", deleteCategory);

/**
 * @swagger
 * paths:
 *  /api/category/getByParentType/{parent_category_type}:
 *   get:
 *     summary: Get Category details by parent type
 *     tags : ["Category"]
 *     description: Get Category details by parent type
 *     parameters:
 *        - in: path
 *          name: parent_category_type
 *          description: category type
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get(
  "/getByParentType/:parent_category_type",
  fetchCategoriesByParentCategoryType
);

/**
 * @swagger
 * paths:
 *  /api/category/getByCategoryName/{category_name}:
 *   get:
 *     summary: Get Category details by name
 *     tags : ["Category"]
 *     description: Get Category details by name
 *     parameters:
 *        - in: path
 *          name: category_name
 *          description: category name
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getByCategoryName/:category_name", fetchCategoriesByCategoryName);

/**
 * @swagger
 *  /api/category/getAll:
 *   get:
 *     summary: Get all category details
 *     tags : ["Category"]
 *     description: Get category  details
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getAll", fetchAll);

/**
 * @swagger
 *  /api/category/fetchAllParentCategory:
 *   get:
 *     summary: Get all parent category details
 *     tags : ["Category"]
 *     description: Get parent category  details
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/fetchAllParentCategory", fetchAllParentCategory);

/**
 * @swagger
 *  /api/category/getAllSubCategories:
 *   get:
 *     summary: Get all sub category details
 *     tags : ["Category"]
 *     description: Get All sub category  details
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getAllSubCategories/:category_type", getAllSubCategories);

module.exports = router;
