const { check } = require('express-validator');

exports.feedsCreateValidator = [
        check('feed_heading')
                .not()
                .isEmpty()
                .withMessage('feed_heading is required'),
        check('feed_content')
                .not()
                .isEmpty()
                .withMessage('feed_content is required'),
        check('share_count')
                .not()
                .isEmpty()
                .withMessage('share_count is required'),
        check('like_count')
                .not()
                .isEmpty()
                .withMessage('like_count is required')
];

exports.feedsUpdateValidator = [
        check('feed_id')
                .not()
                .isEmpty()
                .withMessage('feed_id is required'),
        check('feed_content')
                .not()
                .isEmpty()
                .withMessage('feed_content is required'),
        // check('share_count')
        // .not()
        // .isEmpty()
        // .withMessage('like_count is required'),
        // check('share_count')
        // .not()
        // .isEmpty()
        // .withMessage('like_count is required')
];

exports.userIdValidator = [
        check('user_id')
                .not()
                .isEmpty()
                .withMessage('user_id is required'),
        check('login_user')
                .not()
                .isEmpty()
                .withMessage('login_user is required')

]

exports.companyIdValidator = [
        check('company_id')
                .not()
                .isEmpty()
                .withMessage('company_id is required'),
]

exports.searchByNameValidator = [
        check('name')
                .not()
                .isEmpty()
                .withMessage('name is required'),
]

exports.eventIdValidator = [
        check('company_id')
                .not()
                .isEmpty()
                .withMessage('company_id is required'),
        check('type')
                .not()
                .isEmpty()
                .withMessage('type is required'),
        check('login_id')
                .not()
                .isEmpty()
                .withMessage('login_id is required'),
]

exports.getIndividualFeedValidation = [
        check('feed_id')
                .not()
                .isEmpty()
                .withMessage('feed_id is required'),
        check('type')
                .not()
                .isEmpty()
                .withMessage('type is required'),
        check('id')
                .not()
                .isEmpty()
                .withMessage('id is required'),
]