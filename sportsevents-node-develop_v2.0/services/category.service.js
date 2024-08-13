const categoryDao = require("../dao/category.dao");
const companyDao = require("../dao/company.dao");
const tournamentCategoriesDao = require("../dao/tournamentCategories.dao");
/*
 * Method to create new category
 * @param {Json} body
 */

const createCategory = async (body) => {
  try {
    let result = null;
    const { category_type, category_name, category_desc, parent_category_id } =
      body;
    result = await categoryDao.add(
      category_type,
      category_name,
      category_desc,
      parent_category_id
    );
    return result;
  } catch (error) {
    console.log("Error occurred in createCategory", error);
    throw error;
  }
};

/*
 * Method to update existing category
 * @param {Json} body
 */

const editCategory = async (body) => {
  try {
    let result = null;
    const { category_type, category_name, category_desc, category_id } = body;
    let data = await categoryDao.getById(category_id);
    if (data === null) {
      result = { message: "category not exist" };
      return result;
    }
    result = await categoryDao.edit(
      category_type,
      category_name,
      category_desc,
      category_id
    );
    return result;
  } catch (error) {
    console.log("Error occurred in editCategory", error);
    throw error;
  }
};

/**
 * Method to get the category based on category Id
 * @param {int} category_id
 */

const fetchCategory = async (category_id) => {
  try {
    let category = {
      data: null,
    };
    let data = await categoryDao.getById(category_id);
    if (data === null) category = { message: "category not exist" };
    else category["data"] = data;
    return category;
  } catch (error) {
    console.log("Error occurred in fetch category", error);
    throw error;
  }
};

/**
 *  Method to get the categories based on parent category id
 * @param {int} parent_category_id
 */

const fetchByParentCategory = async (parent_category_id) => {
  try {
    let category = {
      data: null,
    };
    let data = await categoryDao.getByParentId(parent_category_id);
    if (!data.length) category = { message: "category not exist" };
    else category["data"] = data;
    return category;
  } catch (error) {
    console.log("Error occurred in fetch category", error);
    throw error;
  }
};

/**
 *  Method to delete the categories based on category id
 * @param {int} category_id
 */

const deleteCategory = async (category_id) => {
  try {
    let category = {
      data: null,
      CompanyType: null,
      TournamentCategoryPrize: null,
    };
    let CompanyType = await companyDao.getCompanyType(category_id);
    let TournamentCategoryPrize =
      await tournamentCategoriesDao.getTournamentCategoryPrize(category_id);
    if (CompanyType.count === "0" && TournamentCategoryPrize.count === "0") {
      let data = await categoryDao.deleteById(category_id);
      if (data === null) category = { message: "category not exist" };
      else category["data"] = "Success";
      return category;
    } else {
      category = { message: "This violates foreign key constraint" };
      return category;
    }
  } catch (error) {
    console.log("Error occurred in delete category", error);
    throw error;
  }
};

/**
 * Method to get the categories based on parent category type
 * @param {string} parent_category_type
 * @returns
 */

const fetchCategoriesByParentCategoryType = async (parent_category_type) => {
  try {
    let category = {
      data: null,
    };
    let data = await categoryDao.getByParentName(parent_category_type);
    console.log("check data categories--->", data);
    if (!data.length) category = { message: "category not exist" };
    else category["data"] = data;
    return category;
  } catch (error) {
    console.log("Error occurred in fetch category", error);
    throw error;
  }
};

/**
 * Method to get the categories based on category name
 * @param {string} category_name
 * @returns
 */

const fetchCategoriesByCategoryName = async (category_name) => {
  try {
    let category = {
      data: null,
    };
    let data = await categoryDao.getByCategoryName(category_name);
    console.log("check data categories--->", data);
    if (!data.length) category = { message: "category not exist" };
    else category["data"] = data;
    return category;
  } catch (error) {
    console.log("Error occurred in fetch category", error);
    throw error;
  }
};

/**
 *  Method to get all the categories
 */

const fetchAll = async () => {
  try {
    return await categoryDao.getAll();
  } catch (error) {
    console.log("Error occurred in fetchAll: ", error);
    throw error;
  }
};

/**
 *  Method to get all the parent categories
 */

const fetchAllParentCategory = async () => {
  try {
    return await categoryDao.fetchAllParentCategory();
  } catch (error) {
    console.log("Error occurred in fetchAllParentCategory: ", error);
    throw error;
  }
};

/**
 *  Method to get all the sub categories
 */

const getAllSubCategories = async (category_type) => {
  try {
    return await categoryDao.getAllSubCategories(category_type);
  } catch (error) {
    console.log("Error occurred in getAllSubCategories: ", error);
    throw error;
  }
};

module.exports = {
  createCategory,
  editCategory,
  fetchCategory,
  deleteCategory,
  fetchByParentCategory,
  fetchCategoriesByParentCategoryType,
  fetchCategoriesByCategoryName,
  fetchAll,
  fetchAllParentCategory,
  getAllSubCategories,
};
