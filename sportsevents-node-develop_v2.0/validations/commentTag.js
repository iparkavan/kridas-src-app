const { check } = require("express-validator");

exports.commentTagCreateValidator = [
  check("feed_id").not().isEmpty().withMessage("feed_id is required"),
  check("comment_id").not().isEmpty().withMessage("comment_id is required"),
];

exports.commentTagUpdateValidator = [
  check("comment_tag_id")
    .not()
    .isEmpty()
    .withMessage("comment_tag_id is required"),
  check("feed_id").not().isEmpty().withMessage("feed_id is required"),
  check("comment_id").not().isEmpty().withMessage("comment_id is required"),
];
