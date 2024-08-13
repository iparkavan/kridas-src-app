const express = require("express");
const {
  createArticles,
  fetchAll,
  articleShare,
  fetchArticle,
  editArticle,
  deleteArticle,
  fetchByUserId,
  fetchByCompanyId,
  searchByUserId,
  searchByCompanyId,
  createArticlesFeed,
  search,
  searchIsFeature,
  updateIsFeature,
  fetchArticleById,
} = require("../../controllers/articles.controller");
const { runValidation } = require("../../validations");
const {
  articlesCreateValidator,
  articleShareValidation,
  articleUpdateValidator,
  searchUserValidator,
  searchCompanyValidator,
} = require("../../validations/articles");
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
*  /api/articles:
*   post:
*     summary: Articles Search By UserId
*     description:  Articles Search By UserId
*     tags : ["Articles"]
*     parameters:
*        - in: body
*          name: articles  
*          description: Articles Search By UserId
*          schema:
*            type: object
*            required:
*              - article_heading 
*              - cover_image_url_meta 
*              - article_content
*              - user_id 
*              - company_id 
*              - article_publish_status 
*            properties: 
*              article_heading:
*                type: string
*              cover_image_url_meta:
*                type: string
*              article_content:
*                type: string
*              user_id:
*                type: string
*              company_id:
*                type: string
*              article_publish_status:
*                type: string
*     responses:
*       200:
*          description: Success
*/

router.post(
  "/",
  upload.fields([
    {
      name: "cover_image_url",
      maxCount: 1,
    },
  ]),
  articlesCreateValidator,
  runValidation,
  createArticles
);


/**
* @swagger
*  /api/articles/searchByUserId:
*   post:
*     summary: Articles Search By UserId
*     description:  Articles Search By UserId
*     tags : ["Articles"]
*     parameters:
*        - in: body
*          name: articles  
*          description: Articles Search By UserId
*          schema:
*            type: object
*            required:
*              - page 
*              - sort 
*              - size 
*              - user_id
*            properties: 
*              page:
*                type: integer
*              sort:
*                type: string
*              size:
*                type: integer
*              user_id:
*                type: string
*     responses:
*       200:
*          description: Success
*/

router.post(
  "/searchByUserId",
  searchUserValidator,
  runValidation,
  searchByUserId
);

/**
* @swagger
*  /api/articles/searchByCompanyId:
*   post:
*     summary: Search articles By Company Id
*     description: Search articles By Company Id
*     tags : ["Articles"]
*     parameters:
*        - in: body
*          name: articles  
*          description: Search articles By Company Id
*          schema:
*            type: object
*            required:
*              - page 
*              - sort
*              - size 
*              - company_id
*            properties: 
*              page:
*                type: integer
*              sort:
*                type: string
*              size:
*                type: integer
*              company_id:
*                type: string
*     responses:
*       200:
*          description: Success
*/

router.post(
  "/searchByCompanyId",
  searchCompanyValidator,
  runValidation,
  searchByCompanyId
);

/**
* @swagger
*  /api/articles/getAll:
*   get:
*     summary: Get all articles details
*     tags : ["Articles"]
*     description: Get articles details
*     responses:
*       200:
*         description: Success
*/

router.get("/getAll", fetchAll);

/**
* @swagger
* paths:
*  /api/articles/get/{article_id}:
*   get:
*     summary: Get Articles details by Id
*     tags : ["Articles"]
*     description: Get Articles details
*     parameters:
*        - in: path
*          name: article_id
*          description: article id
*          type: string
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get("/get/:article_id", fetchArticle);

// router.get("/getById/:article_id", fetchArticleById);

/**
* @swagger
*  /api/articles:
*   put:
*     summary: Edit Articles 
*     description: Edit Articles 
*     tags : ["Articles"]
*     parameters:
*        - in: body
*          name: edit articles  
*          description: Edit Articles 
*          schema:
*            type: object
*            required:
*              - article_heading 
*              - cover_image_url_meta 
*              - article_content
*              - user_id 
*              - company_id 
*              - article_publish_status 
*              - article_id 
*              - feed 
*            properties: 
*              article_heading:
*                type: string
*              cover_image_url_meta:
*                type: string
*              article_content:
*                type: string
*              user_id:
*                type: string
*              company_id:
*                type: string
*              article_publish_status:
*                type: string
*              article_id:
*                type: string
*              feed:
*                type: string
*     responses:
*       200:
*          description: Success
*/


router.put(
  "/",
  upload.fields([
    {
      name: "cover_image_url",
      maxCount: 1,
    },
  ]),
  articleUpdateValidator,
  runValidation,
  editArticle
);

router.put("/updateIsFeature", updateIsFeature);

/**
* @swagger
* paths:
*  /api/articles/delete/{article_id}:
*   delete:
*     summary: Delete Articles Details By Id
*     tags : ["Articles"]
*     description: Delete Articles details
*     parameters:
*        - in: path
*          name: article_id
*          description: article id 
*          type: string
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete("/delete/:article_id", deleteArticle);

/**
* @swagger
* paths:
*  /api/articles/getByUserId/{user_id}:
*   get:
*     summary: Get Articles details by User Id
*     tags : ["Articles"]
*     description: Get Articles details By User Id 
*     parameters:
*        - in: path
*          name: user_id
*          description: User Id
*          type: string
*          required: true
*     responses:
*       200:
*         description: Success
*/


router.get("/getByUserId/:user_id", fetchByUserId);

/**
* @swagger
* paths:
*  /api/articles/getByCompanyId/{company_id}:
*   get:
*     summary: Get Articles details by Company Id
*     tags : ["Articles"]
*     description: Get Articles details By Company Id 
*     parameters:
*        - in: path
*          name: company_id
*          description: Company Id
*          type: string
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get("/getByCompanyId/:company_id", fetchByCompanyId);

/**
* @swagger
*  /api/articles/search:
*   post:
*     summary: Search Articles details
*     description: Search Articles details
*     tags : ["Articles"]
*     parameters:
*        - in: body
*          name: articles  
*          description: Search Articles details
*          schema:
*            type: object
*            required:
*              - article_id 
*              - article_heading 
*              - cover_image_url_meta 
*              - article_content
*              - user_id 
*              - company_id 
*              - article_publish_status
*              - feed 
*              - socket_request 
*            properties: 
*              article_id:
*                type: string
*              article_heading:
*                type: string
*              cover_image_url_meta:
*                type: string
*              article_content:
*                type: string
*              user_id:
*                type: string
*              company_id:
*                type: string
*              article_publish_status:
*                type: string
*              feed:
*                type: string
*              socket_request:
*                type: string
*     responses:
*       200:
*          description: Success
*/


router.post(
  "/articleFeed",
  upload.fields([
    {
      name: "cover_image_url",
      maxCount: 1,
    },
  ]),
  articlesCreateValidator,
  runValidation,
  createArticlesFeed
);

/**
* @swagger
*  /api/articles/search:
*   post:
*     summary: Search Articles details
*     description: Search Articles details
*     tags : ["Articles"]
*     parameters:
*        - in: body
*          name: articles  
*          description: Search Articles details
*          schema:
*            type: object
*            required:
*              - searchText 
*              - type 
*              - start_date 
*              - end_date
*            properties: 
*              page:
*                type: integer
*              sort:
*                type: string
*              size:
*                type: integer
*              searchText:
*                type: string
*              type:
*                type: string
*              start_date:
*                type: string
*              end_date:
*                type: string
*     responses:
*       200:
*          description: Success
*/

router.post("/search", search);

/**
* @swagger
*  /api/articles/searchIsFeature:
*   post:
*     summary: Search IsFeature
*     description: Search IsFeature
*     tags : ["Articles"]
*     parameters:
*        - in: body
*          name: articles  
*          description: Search Articles details
*          schema:
*            type: object
*            required:
*            properties: 
*              page:
*                type: integer
*              sort:
*                type: string
*              size:
*                type: integer
*              is_feature:
*                type: boolean
*     responses:
*       200:
*          description: Success
*/

router.post("/searchIsFeature", searchIsFeature);

/**
* @swagger
*  /api/articles/share:
*   post:
*     summary: Share - articles
*     description: Share - articles
*     tags : ["Articles"]
*     parameters:
*        - in: body
*          name: articles  
*          description: Share - articles details
*          schema:
*            type: object
*            required:
*              - feed 
*              - hashTags
*              - tags 
*              - article_id
*              - socket_request 
*            properties: 
*              feed:
*                type: string
*              hashTags:
*                type: string
*              tags:
*                type: string
*              article_id:
*                type: string
*              socket_request:
*                type: string
*     responses:
*       200:
*          description: Success
*/

router.post("/share", articleShareValidation, runValidation, articleShare);

module.exports = router;
