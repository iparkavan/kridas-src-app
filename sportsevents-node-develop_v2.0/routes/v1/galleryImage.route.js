const express = require("express");
const {
  createGalleryImage,
  editGalleryImage,
  getGalleryImage,
  getAllGalleryImage,
  deleteGalleryImage,
} = require("../../controllers/galleryImage.controller");
const router = express.Router();

/**
* @swagger
*  /api/gallery-image:
*   post:
*     summary: Add Gallery Image details
*     description: Add new Gallery Image details
*     tags : ["Gallery Image"]
*     parameters:
*        - in: body
*          name: gallery image  
*          description: To add the gallery-image details
*          schema:
*            type:  object
*            required:
*              - image_id 
*              - image_title 
*              - image_desc 
*              - image_url
*              - image_uploader_user_id 
*              - image_uploader_company_id 
*              - search_tags
*              - share_count 
*              - like_count 
*              - created_date
*            properties: 
*              image_id:
*                type: string
*              image_title:
*                type: string
*              image_desc:
*                type: string
*              image_url:
*                type: string
*              image_uploader_user_id:
*                type: string
*              image_uploader_company_id:
*                type: string
*              search_tags:
*                type: string
*              share_count:
*                type: integer
*              like_count:
*                type: integer
*              created_date:
*                type: string
*     responses:
*       200:
*          description: Gallery Image details added Successfully
*/

router.post("/", createGalleryImage);

/**
* @swagger
*  /api/gallery-image:
*   put:
*     summary: Edit Gallery Image details
*     description: Edit Gallery Image details
*     tags : ["Gallery Image"]
*     parameters:
*        - in: body
*          name: gallery image  
*          description: To edit the gallery-image details
*          schema:
*            type: object
*            required:
*              - image_id 
*              - image_title 
*              - image_desc 
*              - image_url
*              - image_uploader_user_id 
*              - image_uploader_company_id 
*              - search_tags
*              - share_count 
*              - like_count 
*              - created_date
*            properties: 
*              image_id:
*                type: string
*              image_title:
*                type: string
*              image_desc:
*                type: string
*              image_url:
*                type: string
*              image_uploader_user_id:
*                type: string
*              image_uploader_company_id:
*                type: string
*              search_tags:
*                type: string
*              share_count:
*                type: integer
*              like_count:
*                type: integer
*              created_date:
*                type: string
*     responses:
*       200:
*          description: Gallery Image details edited Successfully
*/

router.put("/", editGalleryImage);

/**
* @swagger
* paths:
*  /api/gallery-image/get/{image_id}:
*   get:
*     summary: Get Gallery Iamge details by Image Id
*     tags : ["Gallery Image"]
*     description: Get Gallery Image details by Image Id
*     parameters:
*        - in: path
*          name: image_id
*          description: image_id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get("/get/:image_id", getGalleryImage);

/**
* @swagger
*  /api/gallery-image/getAll:
*   get:
*     summary: Get all Gallery Image details
*     tags : ["Gallery Image"]
*     description: Get Gallery Image details
*     responses:
*       200:
*         description: Success
*/

router.get("/getAll", getAllGalleryImage);

/**
* @swagger
* paths:
*  /api/gallery-image/delete/{image_id}:
*   delete:
*     summary: Delete Gallery Image Details By Image Id
*     tags : ["Gallery Image"]
*     description: Delete Gallery Image details
*     parameters:
*        - in: path
*          name: image_id
*          description: image id 
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete("/delete/:image_id", deleteGalleryImage);

module.exports = router;
