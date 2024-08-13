const { check } = require('express-validator');


exports.galleryMediaUpdateValidator = [
    check('gallery_media_id')
        .not()
        .isEmpty()
        .withMessage('gallerymedia_id is required'),
];

exports.galleryMediaCreateValidator = [
    check('gallery_id')
        .not()
        .isEmpty()
        .withMessage('gallery_id is required'),
];