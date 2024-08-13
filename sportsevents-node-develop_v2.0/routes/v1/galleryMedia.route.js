const express = require('express');
const { create, fetchAll, getById, deleteById } = require('../../controllers/galleryMedia.controller');
const { runValidation } = require('../../validations');
const { galleryMediaUpdateValidator,galleryMediaCreateValidator } = require('../../validations/galleryMedia');
const router = express.Router();
const multer = require('multer');
// Storage Engin That Tells/Configures Multer for where (destination) and how (filename) to save/upload our files
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); //important this is a direct path fron our current file to storage location
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--' + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });
const count = Number(process.env.GALLERY_MEDIA_MAXCOUNT)

/**
* @swagger
*  /api/gallery-media:
*   post:
*     summary: Add Gallery Media details
*     description: Add Gallery Media details
*     tags : ["Gallery Media"]
*     parameters:
*        - in: body
*          name: gallery media  
*          description: To add the gallery media details
*          schema:
*            type: object
*            required:
*              - media_id 
*              - gallery_id 
*            properties: 
*              media_id:
*                type: string
*              gallery_id:
*                type: string
*     responses:
*       200:
*          description: gallery media added Successfully
*/

router.post(
    '/',
    upload.fields([{
        name: 'file', maxCount: count
      }]),
    galleryMediaCreateValidator,
    runValidation,
    create
);

/**
* @swagger
*  /api/gallery-media/getAll:
*   get:
*     summary: Get all Gallery Media details
*     tags : ["Gallery Media"]
*     description: Get all Gallery Media details
*     responses:
*       200:
*         description: Success
*/

router.get(
    '/getAll',
    runValidation,
    fetchAll
);

/**
* @swagger
* paths:
*  /api/gallery-media/get/{gallery_media_id}:
*   get:
*     summary: Get Gallery Media Details by Gallery Media Id
*     tags : ["Gallery Media"]
*     description: Get Gallery Media details by Gallery Media Id
*     parameters:
*        - in: path
*          name: gallery_media_id
*          description: gallery media id
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Success
*/

router.get(
    '/get/:gallery_media_id',
    runValidation,
    getById
);

/**
* @swagger
* paths:
*  /api/gallery-media/delete/{gallery_media_id}:
*   delete:
*     summary: Delete Event Organizer Details By Id
*     tags : ["Gallery Media"]
*     description: Delete Event Organizer details
*     parameters:
*        - in: path
*          name: gallery_media_id
*          description: gallery media id 
*          type: integer
*          required: true
*     responses:
*       200:
*         description: Deleted Successfully 
*/

router.delete(
    '/delete/:gallery_media_id',
    runValidation,
    deleteById
);

module.exports = router;