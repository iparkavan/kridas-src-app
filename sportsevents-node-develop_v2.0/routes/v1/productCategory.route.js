const express = require("express");
const {
  createProductCategory,
  updateProductCategory,
  getById,
  getAll,
  deleteProductCategory,
} = require("../../controllers/productCategory.controller");
const { runValidation } = require("../../validations");
const {
  productCategoryCreateValidator,
  productCategoryUpdateValidator,
} = require("../../validations/productCategory");
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
*  /api/product-category:
*   post:
*     summary: Add Product category details
*     description: Add Product category details
*     tags : ["Product-Category"]
*     parameters:
*        - in: body
*          name: product category  
*          description: To add the product-category details
*          schema:
*            type: object
*            required:
*              - parent_category_id 
*              - product_category_code 
*              - product_category_name 
*              - product_category_desc
*              - product_category_img 
*              - product_category_img_meta 
*              - product_category_status 
*              - depth_level
*              - is_featured 
*              - sort_order 
*              - created_by 
*              - updated_by
*            properties: 
*              parent_category_id:
*                type: integer
*              product_category_code:
*                type: string
*              product_category_name:
*                type: string
*              product_category_desc:
*                type: string
*              product_category_img:
*                type: string
*              product_category_img_meta:
*                type: object
*              product_category_status:
*                type: string
*              depth_level:
*                type: integer
*              is_featured:
*                type: boolean
*              sort_order:
*                type: integer
*              created_by:
*                type: string
*              updated_by:
*                type: string
*     responses:
*       200:
*          description: product category details added Successfully
*/

router.post(
  "/",
  upload.fields([
    {
      name: "product_category_img",
      maxCount: 1,
    },
  ]),
  productCategoryCreateValidator,
  runValidation,
  createProductCategory
);

/**
* @swagger
*  /api/product-category:
*   put:
*     summary: Edit Product category details
*     description: Edit Product category details
*     tags : ["Product-Category"]
*     parameters:
*        - in: body
*          name: product category  
*          description: To edit the product-category details
*          schema:
*            type: object
*            required:
*              - parent_category_id 
*              - product_category_code 
*              - product_category_name 
*              - product_category_desc
*              - product_category_img 
*              - product_category_img_meta 
*              - product_category_status 
*              - depth_level
*              - is_featured 
*              - sort_order 
*              - created_by 
*              - updated_by
*              - product_category_id
*            properties: 
*              parent_category_id:
*                type: integer
*              product_category_code:
*                type: string
*              product_category_name:
*                type: string
*              product_category_desc:
*                type: string
*              product_category_img:
*                type: string
*              product_category_img_meta:
*                type: object
*              product_category_status:
*                type: string
*              depth_level:
*                type: integer
*              is_featured:
*                type: boolean
*              sort_order:
*                type: integer
*              created_by:
*                type: string
*              updated_by:
*                type: string
*              product_category_id:
*                type: integer
*     responses:
*       200:
*          description: product category details edited Successfully
*/


router.put(
  "/",
  upload.fields([
    {
      name: "product_category_img",
      maxCount: 1,
    },
  ]),
  productCategoryUpdateValidator,
  runValidation,
  updateProductCategory
);

/**
* @swagger
* paths:
*  /api/product-category/get/{product_category_id}:
*   get:
*     summary: Get Product Category details by Id
*     tags : ["Product-Category"]
*     description: Get Product Category details
*     parameters:
*        - in: path
*          name: product_category_id
*          description: product_category_id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get("/get/:product_category_id", getById);

/**
* @swagger
*  /api/product-category/getAll:
*   get:
*     summary: Get all Product Category details
*     tags : ["Product-Category"]
*     description: Get all Product Category  details
*     responses:
*       200:
*         description: Success
*/


router.get("/getAll", getAll);

/**
* @swagger
* paths:
*  /api/product-category/delete/{product_category_id}:
*   delete:
*     summary: Delete Product Category Details By Product Category Id
*     tags : ["Product-Category"]
*     description: Delete Product Category details
*     parameters:
*        - in: path
*          name: product_category_id
*          description: product category id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete("/delete/:product_category_id", deleteProductCategory);

module.exports = router;
