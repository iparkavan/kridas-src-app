const express = require('express');
const { createCompanyStatistics,fetchAll,fetchCompanyStatistics,deleteCompanyStatistics,editCompanyStatistics, fetchCompanyById } = require('../../controllers/companyStatistics.controller');
const { runValidation } = require('../../validations');
const router = express.Router();
const multer = require('multer');
const fileStorageEngine = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/'); 
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '--' + file.originalname);
	},
});

const upload = multer({ storage: fileStorageEngine });

/**
* @swagger
*  /api/company/statistics:
*   post:
*     summary: Add Company Statistics details
*     description: Add Company Statistics details
*     tags : ["Company-Statistics"]
*     parameters:
*        - in: body
*          name: company statistics  
*          description: To add the company statistics   details
*          schema:
*            type:  object
*            required:
*              - company_id 
*              - categorywise_statistics 
*              - statistics_links 
*              - statistics_docs
*            properties: 
*              company_id:
*                type: string
*              categorywise_statistics:
*                type: object
*              statistics_links:
*                type: object
*              statistics_docs:
*                type: object
*     responses:
*       200:
*          description: event organizer details added Successfully
*/

router.post(
    '/',
    upload.fields([{
        name: 'document', maxCount: 4
      }]),
      createCompanyStatistics
);

/**
* @swagger
*  /api/company/statistics:
*   put:
*     summary: Edit Company Statistics details
*     description: Edit Company Statistics details
*     tags : ["Company-Statistics"]
*     parameters:
*        - in: body
*          name: company statistics  
*          description: To edit the company statistics details
*          schema:
*            type: object
*            required:
*              - company_id 
*              - categorywise_statistics 
*              - statistics_links 
*              - statistics_docs
*              - company_statistics_id
*            properties: 
*              company_id:
*                type: string
*              categorywise_statistics:
*                type: object
*              statistics_links:
*                type: object
*              statistics_docs:
*                type: object
*              company_statistics_id:
*                type: integer
*     responses:
*       200:
*          description: event organizer details edited Successfully
*/

router.put( 
    '/',
    upload.fields([{
        name: 'document', maxCount: 4
      }]),
	editCompanyStatistics
);

/**
* @swagger
* paths:
*  /api/company/statistics/get/{id}:
*   get:
*     summary: Get Company-Statistics details by Id
*     tags : ["Company-Statistics"]
*     description: Get Company-Statistics details by Id
*     parameters:
*        - in: path
*          name: id
*          description: id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/


router.get(
	'/get/:id',
	fetchCompanyStatistics
);

/**
* @swagger
*  /api/company/statistics/getAll:
*   get:
*     summary: Get all Company Statistics details
*     tags : ["Company-Statistics"]
*     description: Get all Company Statistics details
*     responses:
*       200:
*         description: Success
*/

router.get(
	'/getAll',
	fetchAll
);

/**
* @swagger
* paths:
*  /api/company/statistics/delete/{id}:
*   delete:
*     summary: Delete Company Statistics Details By Id
*     tags : ["Company-Statistics"]
*     description: Delete Company Statistics details
*     parameters:
*        - in: path
*          name: id
*          description: id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete(
	'/delete/:id',
	deleteCompanyStatistics
);

/**
* @swagger
* paths:
*  /api/company/statistics/getCompanyById/{id}:
*   get:
*     summary: Get Company-Statistics details by Company Id
*     tags : ["Company-Statistics"]
*     description: Get Company-Statistics details by Company Id
*     parameters:
*        - in: path
*          name: id
*          description: id
*          type: string
*          required: true
*     responses:
*       200:
*         description: Success
*/


router.get(
	'/getCompanyById/:id',
	fetchCompanyById,
);

module.exports = router;