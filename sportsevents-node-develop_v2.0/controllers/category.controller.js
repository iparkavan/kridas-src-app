const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const categoryService = require("../services/category.service");
const { handleError, ErrorHandler } = require("../config/error");
const errorText = "Error";

const createCategory = catchAsync(async (req, res) => {
  const methodName = "/createCategory";
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(httpStatus.CREATED).send(category);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const editCategory = catchAsync(async (req, res) => {
  const methodName = "/editCategory";
  try {
    const category = await categoryService.editCategory(req.body);
    res.send(category);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchCategory = catchAsync(async (req, res) => {
  const methodName = "/fetchCategory";
  try {
    const category = await categoryService.fetchCategory(
      req.params.category_id
    );
    res.send(category);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchByParentCategory = catchAsync(async (req, res) => {
  const methodName = "/fetchByParentCategory";
  try {
    const category = await categoryService.fetchByParentCategory(
      req.params.parent_category_id
    );
    res.send(category);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteCategory = catchAsync(async (req, res) => {
  const methodName = "/deleteCategory";
  try {
    const category = await categoryService.deleteCategory(
      req.params.category_id
    );
    res.send(category);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchCategoriesByParentCategoryType = catchAsync(async (req, res) => {
  const methodName = "/fetchCategoriesByParentCategoryType";
  try {
    const category = await categoryService.fetchCategoriesByParentCategoryType(
      req.params.parent_category_type
    );
    res.send(category);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchCategoriesByCategoryName = catchAsync(async (req, res) => {
  const methodName = "/fetchCategoriesByCategoryName";
  try {
    const category = await categoryService.fetchCategoriesByCategoryName(
      req.params.category_name
    );
    res.send(category);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAll = catchAsync(async (req, res) => {
  const methodName = "/fetchAll";
  try {
    const category = await categoryService.fetchAll();
    res.send(category);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAllParentCategory = catchAsync(async (req, res) => {
  const methodName = "/fetchAllParentCategory";
  try {
    const category = await categoryService.fetchAllParentCategory();
    res.send(category);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getAllSubCategories = catchAsync(async (req, res) => {
  const methodName = "/getAllSubCategories";
  try {
    const category = await categoryService.getAllSubCategories(
      req.params.category_type
    );
    res.send(category);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createCategory,
  fetchCategory,
  editCategory,
  deleteCategory,
  fetchByParentCategory,
  fetchCategoriesByParentCategoryType,
  fetchAll,
  fetchAllParentCategory,
  fetchCategoriesByCategoryName,
  getAllSubCategories,
};
