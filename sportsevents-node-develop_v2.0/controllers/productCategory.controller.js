const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const productCategoryService = require("../services/productCategory.service");
const { handleError, ErrorHandler } = require("./../config/error");
const errorText = "Error";

const createProductCategory = catchAsync(async (req, res) => {
  const methodName = "/createProductCategory";
  try {
    let requestBody = req.body;
    requestBody["files"] = req.files;
    const ProductCategory = await productCategoryService.createProductCategory(
      requestBody
    );
    res.status(httpStatus.CREATED).send(ProductCategory);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const updateProductCategory = catchAsync(async (req, res) => {
  const methodName = "/updateProductCategory";
  try {
    let requestBody = req.body;
    requestBody["files"] = req.files;
    const ProductCategory = await productCategoryService.updateProductCategory(
      requestBody
    );
    res.send(ProductCategory);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getById = catchAsync(async (req, res) => {
  const methodName = "/getById";
  try {
    const ProductCategory = await productCategoryService.getById(
      req.params.product_category_id
    );
    res.send(ProductCategory);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getAll = catchAsync(async (req, res) => {
  const methodName = "/getAll";
  try {
    const ProductCategory = await productCategoryService.getAll();
    res.send(ProductCategory);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteProductCategory = catchAsync(async (req, res) => {
  const methodName = "/deleteProductCategory";
  try {
    const ProductCategory = await productCategoryService.deleteById(
      req.params.product_category_id
    );
    res.send(ProductCategory);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createProductCategory,
  updateProductCategory,
  getById,
  getAll,
  deleteProductCategory,
};
