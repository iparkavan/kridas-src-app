const { check } = require('express-validator');

exports.organizerUpdateValidator = [
    check('organizer_id')
        .not()
        .isEmpty()
        .withMessage('organizer_id is required')

];