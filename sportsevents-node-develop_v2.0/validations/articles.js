const { check } = require('express-validator');

exports.articlesCreateValidator = [
    check('article_heading')
        .not()
        .isEmpty()
        .withMessage('article_heading is required'),
    check('article_content')
        .not()
        .isEmpty()
        .withMessage('article_content is required')
];

exports.articleUpdateValidator = [
    check('article_id')
        .not()
        .isEmpty()
        .withMessage('article_id is required'),
    check('article_heading')
        .not()
        .isEmpty()
        .withMessage('article_heading is required'),
    check('article_content')
        .not()
        .isEmpty()
        .withMessage('article_content is required')
];

exports.searchUserValidator = [
    check('user_id')
        .not()
        .isEmpty()
        .withMessage('user_id is required'),
];

exports.searchCompanyValidator = [
    check('company_id')
        .not()
        .isEmpty()
        .withMessage('company_id is required'),
];

exports.articleShareValidation = [
    check('article_id')
        .not()
        .isEmpty()
        .withMessage('article_id is required'),
];