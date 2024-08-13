const { check } = require('express-validator');

exports.galleryCreateValidator = [
    check('gallery_name')
        .not()
        .isEmpty()
        .withMessage('gallery_name is required'),
];

exports.galleryUpdateValidator = [
    check('gallery_id')
        .not()
        .isEmpty()
        .withMessage('gallery_id is required'),
    check('gallery_name')
        .not()
        .isEmpty()
        .withMessage('gallery_name is required'),
];
