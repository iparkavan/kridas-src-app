const express = require("express");
const {
  createFeeds,
  getFeedWithAssociationData,
  fetchAll,
  fetchFeeds,
  editFeeds,
  deleteFeeds,
  searchFeed,
  fetchFeedsByHashTag,
  fetchByFeedCreatorUserId,
  fetchByFeedCreatorCompanyId,
  searchByName,
  searchFeedByEvent,
  fetchByFeedCreatorCompanyIdwithEvent,
} = require("../../controllers/feeds.controller");
const { runValidation } = require("../../validations");
const {
  feedsCreateValidator,
  feedsUpdateValidator,
  eventIdValidator,
  userIdValidator,
  companyIdValidator,
  searchByNameValidator,
  getIndividualFeedValidation,
} = require("../../validations/feeds");
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

// The Multer Middleware that is passed to routes that will receive income requests with file data (multipart/formdata)
// You can create multiple middleware each with a different storage engine config so save different files in different locations on server
const upload = multer({ storage: fileStorageEngine });

// router.post(
// 	'/',
// 	// upload.fields([{
// 	// 	name: 'image', maxCount: 1
// 	//   }]),
// 	// feedsCreateValidator,
// 	// runValidation,
// 	createFeeds
// );

/**
 * @swagger
 *  /api/feeds/search:
 *   post:
 *     summary: Feeds - Search Feed
 *     description: Feeds - Search Feed
 *     tags : ["Feeds"]
 *     parameters:
 *        - in: body
 *          name: feeds
 *          description: Feeds - Search Feed
 *          schema:
 *            type: object
 *            required:
 *              - page
 *              - sort
 *              - size
 *              - user_id
 *              - company_id
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *              user_id:
 *                type: string
 *              company_id:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post("/search", searchFeed);

/**
 * @swagger
 *  /api/feeds/searchFeedByEvent:
 *   post:
 *     summary: Feeds - Search Feed By Event
 *     description: Feeds - Search Feed By Event
 *     tags : ["Feeds"]
 *     parameters:
 *        - in: body
 *          name: feeds
 *          description: Feeds - Search Feed By Event
 *          schema:
 *            type: object
 *            required:
 *              - page
 *              - sort
 *              - size
 *              - company_id
 *              - event_id
 *              - login_id
 *              - type
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *              company_id:
 *                type: string
 *              event_id:
 *                type: string
 *              login_id:
 *                type: string
 *              type:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/searchFeedByEvent",
  eventIdValidator,
  runValidation,
  searchFeedByEvent
);

/**
 * @swagger
 *  /api/feeds/getIndividualFeed:
 *   post:
 *     summary: Feeds - Get Individual Feed
 *     description: Feeds - Get Individual Feed
 *     tags : ["Feeds"]
 *     parameters:
 *        - in: body
 *          name: feeds
 *          description: Feeds - Get Individual Feed
 *          schema:
 *            type: object
 *            required:
 *              - feed_id
 *              - id
 *              - type
 *            properties:
 *              feed_id:
 *                type: string
 *              id:
 *                type: string
 *              type:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/getIndividualFeed",
  getIndividualFeedValidation,
  runValidation,
  getFeedWithAssociationData
);

/**
 * @swagger
 *  /api/feeds/getAll:
 *   get:
 *     summary: Get all Feeds details
 *     tags : ["Feeds"]
 *     description: Get Feeds details
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getAll", fetchAll);

/**
 * @swagger
 * paths:
 *  /api/feeds/getByHashTag/{search_key}:
 *   get:
 *     summary: Get Feeds Details by search key
 *     tags : ["Feeds"]
 *     description: Get Feeds Details by search key
 *     parameters:
 *        - in: path
 *          name: search_key
 *          description: search key
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/getByHashTag/:search_key", fetchFeedsByHashTag);

/**
 * @swagger
 * paths:
 *  /api/feeds/get/{feed_id}:
 *   get:
 *     summary: Get Feeds Details by Feed Id
 *     tags : ["Feeds"]
 *     description: Get Feeds Details by Feed Id
 *     parameters:
 *        - in: path
 *          name: feed_id
 *          description: feed id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Success
 */

router.get("/get/:feed_id", fetchFeeds);

router.put(
  "/",
  // upload.fields([{
  // 	name: 'image', maxCount: 1
  //   }]),
  // feedsUpdateValidator,
  // runValidation,
  editFeeds
);

/**
 * @swagger
 * paths:
 *  /api/feeds/delete/{feed_id}:
 *   delete:
 *     summary: Delete Feeds Details By Id
 *     tags : ["Feeds"]
 *     description: Delete Feeds details
 *     parameters:
 *        - in: path
 *          name: feed_id
 *          description: feed id
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: Deleted Successfully
 */

router.delete("/delete/:feed_id", deleteFeeds);

// router.get(
// 	'/getByFeedUserId/:feed_creator_user_id',
// 	fetchByFeedCreatorUserId
// );

/**
 * @swagger
 *  /api/feeds/getByUserId:
 *   post:
 *     summary: Feeds Fetch By Feed Creator UserId
 *     description:  Feeds Fetch By Feed Creator UserId
 *     tags : ["Feeds"]
 *     parameters:
 *        - in: body
 *          name: feeds
 *          description: Feeds Fetch By Feed Creator UserId
 *          schema:
 *            type: object
 *            required:
 *              - page
 *              - sort
 *              - size
 *              - user_id
 *              - login_user
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *              user_id:
 *                type: string
 *              login_user:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/getByUserId",
  userIdValidator,
  runValidation,
  fetchByFeedCreatorUserId
);

/**
 * @swagger
 *  /api/feeds/getByCompanyId:
 *   post:
 *     summary: Feeds Fetch By Feed Creator CompanyId
 *     description:  Feeds Fetch By Feed Creator CompanyId
 *     tags : ["Feeds"]
 *     parameters:
 *        - in: body
 *          name: feeds
 *          description: Feeds Fetch By Feed Creator CompanyId
 *          schema:
 *            type: object
 *            required:
 *              - page
 *              - sort
 *              - size
 *              - company_id
 *              - login_id
 *              - type
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *              company_id:
 *                type: string
 *              login_id:
 *                type: string
 *              type:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/getByCompanyId",
  companyIdValidator,
  runValidation,
  fetchByFeedCreatorCompanyId
);

/**
 * @swagger
 *  /api/feeds/getByCompanyIdwithEvent:
 *   post:
 *     summary: Feeds Fetch By Feed Creator CompanyId
 *     description:  Feeds Fetch By Feed Creator CompanyId
 *     tags : ["Feeds"]
 *     parameters:
 *        - in: body
 *          name: feeds
 *          description: Feeds Fetch By Feed Creator CompanyId
 *          schema:
 *            type: object
 *            required:
 *              - page
 *              - sort
 *              - size
 *              - company_id
 *              - login_id
 *              - type
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *              company_id:
 *                type: string
 *              login_id:
 *                type: string
 *              type:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/getByCompanyIdwithEvent",
  companyIdValidator,
  runValidation,
  fetchByFeedCreatorCompanyIdwithEvent
);

/**
 * @swagger
 *  /api/feeds/searchByName:
 *   post:
 *     summary: Feeds Search By Name
 *     description: Feeds Search By Name
 *     tags : ["Feeds"]
 *     parameters:
 *        - in: body
 *          name: feeds
 *          description: Feeds Search By Name
 *          schema:
 *            type: object
 *            required:
 *              - page
 *              - sort
 *              - size
 *              - name
 *              - type
 *            properties:
 *              page:
 *                type: integer
 *              sort:
 *                type: string
 *              size:
 *                type: integer
 *              name:
 *                type: string
 *              type:
 *                type: string
 *     responses:
 *       200:
 *          description: Success
 */

router.post(
  "/searchByName",
  searchByNameValidator,
  runValidation,
  searchByName
);

// router.get(
// 	'/getByFeedCompanyId/:feed_creator_company_id',
// 	fetchByFeedCreatorCompanyId
// );

module.exports = router;
