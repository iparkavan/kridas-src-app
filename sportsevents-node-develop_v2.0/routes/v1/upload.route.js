const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImagesAndVideo, cloudinaryDelete, cloudinaryVideoDelete, uploadFile } = require('../../controllers/upload.controller')
const { nanoid } = require('nanoid')

const fileStorageEngine = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/'); //important this is a direct path fron our current file to storage location
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '--' + nanoid(7) + file.originalname);
	},
});

const upload = multer({ storage: fileStorageEngine });

router.post(
	'/',
	upload.fields([{
		name: 'image', maxCount: 5
	}]),
	uploadImagesAndVideo
);

router.delete(
	'/delete/image/:public_id',
	cloudinaryDelete
);
router.delete(
	'/delete/video/:public_id',
	cloudinaryVideoDelete
);

router.post(
	'/docs',
	upload.fields([{
		name: 'document', maxCount: 5
	}]),
	uploadFile
);


module.exports = router;
