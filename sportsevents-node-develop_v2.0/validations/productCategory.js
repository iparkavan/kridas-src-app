const { check } = require("express-validator");

exports.productCategoryCreateValidator = [
  check("product_category_code")
    .not()
    .isEmpty()
    .withMessage("product_category_code is required"),
  check("product_category_name")
    .not()
    .isEmpty()
    .withMessage("product_category_name is required"),
  check("created_by").not().isEmpty().withMessage("created_by is required"),
];

exports.productCategoryUpdateValidator = [
  check("product_category_id")
    .not()
    .isEmpty()
    .withMessage("product_category_id is required"),
  check("product_category_code")
    .not()
    .isEmpty()
    .withMessage("product_category_code is required"),
  check("product_category_name")
    .not()
    .isEmpty()
    .withMessage("product_category_name is required"),
];
