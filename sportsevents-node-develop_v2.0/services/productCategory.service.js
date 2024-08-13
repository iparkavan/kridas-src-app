const productCategoryDao = require("../dao/productCategory.dao");
const { cloudinaryUpload, cloudinaryImageDelete } = require("../utils/common");

/**
 *Method to create product category
 * @param {JSON} body
 */
const createProductCategory = async (body) => {
  let result = null;
  try {
    const {
      parent_category_id,
      product_category_code,
      product_category_name,
      product_category_desc,
      files = {},
      product_category_status = "AC",
      depth_level,
      is_featured = false,
      sort_order,
      created_by,
      updated_by,
    } = body;
    let product_category_img = null;
    let product_category_img_meta = null;
    if (parent_category_id) {
      let ProductParentCategory = await productCategoryDao.getById(
        parent_category_id
      );

      if (ProductParentCategory === null && parent_category_id !== null) {
        result = { message: "parent category not exist" };
        return result;
      }
    }

    if (JSON.stringify(files) !== JSON.stringify({})) {
      if (
        files.product_category_img[0] !== null &&
        files.product_category_img[0] !== undefined
      ) {
        imagemetaData = await cloudinaryUpload(files.product_category_img[0]);
      }
      let product_category_img_meta = imagemetaData;

      let product_category_img = imagemetaData?.url;

      result = await productCategoryDao.add(
        parent_category_id,
        product_category_code,
        product_category_name,
        product_category_desc,
        product_category_img,
        product_category_img_meta,
        product_category_status,
        depth_level,
        is_featured,
        sort_order,
        created_by,
        updated_by
      );
    } else {
      result = await productCategoryDao.add(
        parent_category_id,
        product_category_code,
        product_category_name,
        product_category_desc,
        product_category_img,
        product_category_img_meta,
        product_category_status,
        depth_level,
        is_featured,
        sort_order,
        created_by,
        updated_by
      );
    }
    return result;
  } catch (error) {
    console.log("Error occurred in create  product category", error);
    throw error;
  }
};

/**
 *Method to update product category
 * @param {JSON} body
 */
const updateProductCategory = async (body, connectionObj = null) => {
  let result = null;
  try {
    const {
      parent_category_id,
      product_category_code,
      product_category_name,
      product_category_desc,
      files = {},
      product_category_status = "AC",
      depth_level,
      is_featured = false,
      sort_order,
      updated_by,
      product_category_id,
    } = body;
    let product_category_img = null;
    let product_category_img_meta = null;

    if (parent_category_id) {
      let ProductParentCategory = await productCategoryDao.getById(
        parent_category_id
      );

      if (ProductParentCategory === null && parent_category_id !== null) {
        result = { message: "parent category not exist" };
        return result;
      }
    }

    let ProductCategory = await productCategoryDao.getById(product_category_id);

    if (ProductCategory === null && product_category_id !== null) {
      result = { message: "product category not exist" };
      return result;
    } else {
      product_category_img = ProductCategory?.product_category_img;
      product_category_img_meta = ProductCategory?.product_category_img_meta;

      if (JSON.stringify(files) !== JSON.stringify({})) {
        if (
          files.product_category_img[0] !== null &&
          files.product_category_img[0] !== undefined
        ) {
          imagemetaData = await cloudinaryUpload(files.product_category_img[0]);
          await cloudinaryImageDelete(
            ProductCategory?.product_category_img_meta
          );
        }

        let product_category_img_meta = imagemetaData;
        let product_category_img = imagemetaData?.url;

        result = await productCategoryDao.edit(
          parent_category_id,
          product_category_code,
          product_category_name,
          product_category_desc,
          product_category_img,
          product_category_img_meta,
          product_category_status,
          depth_level,
          is_featured,
          sort_order,
          updated_by,
          product_category_id
        );
      } else {
        result = await productCategoryDao.edit(
          parent_category_id,
          product_category_code,
          product_category_name,
          product_category_desc,
          product_category_img,
          product_category_img_meta,
          product_category_status,
          depth_level,
          is_featured,
          sort_order,
          updated_by,
          product_category_id
        );
      }
      return result;
    }
  } catch (error) {
    console.log("Error occurred in edit product category", error);
    throw error;
  }
};

/**
 * Method to get  product category based on product category id
 * @param {int} product_category_id
 */
const getById = async (product_category_id) => {
  try {
    let ProductCategory = {};
    let data = await productCategoryDao.getById(product_category_id);
    if (data === null)
      ProductCategory = { message: "product category not exist" };
    else ProductCategory["data"] = data;
    return ProductCategory;
  } catch (error) {
    console.log("Error occurred in product category getById Service", error);
    throw error;
  }
};

/**
 * Method to get all  Product Category
 */
const getAll = async () => {
  try {
    let ProductCategory = null;
    let data = await productCategoryDao.getAll();
    ProductCategory = data;
    return ProductCategory;
  } catch (error) {
    console.log("Error occurred in getAll ProductCategories", error);
    throw error;
  }
};

/**
 * Method to delete Product Category based on product_category_id
 * @param {int} product_category_id
 */
const deleteById = async (product_category_id) => {
  try {
    let ProductCategory = {};
    let data = await productCategoryDao.deleteById(product_category_id);
    if (data === null)
      ProductCategory = { message: "Product Category not exist" };
    else ProductCategory["data"] = "Product Category Deleted Successfully!";
    return ProductCategory;
  } catch (error) {
    console.log("Error occurred in delete ProductCategory", error);
    throw error;
  }
};

module.exports = {
  createProductCategory,
  updateProductCategory,
  getById,
  getAll,
  deleteById,
};
