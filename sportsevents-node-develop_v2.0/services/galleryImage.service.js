const galleryImageDao = require("../dao/galleryImage.dao");
const db = require("../utils/db");

/**
 *Method to create Gallery Image
 * @param {JSON} body
 */
const createGalleryImage = async (body) => {
  let result = null;
  try {
    const {
      image_title,
      image_desc,
      image_url,
      image_uploader_user_id,
      image_uploader_company_id,
      search_tags,
      share_count = 0,
      like_count = 0,
      image_uploader_event_id,
    } = body;
    result = await galleryImageDao.add(
      image_title,
      image_desc,
      image_url,
      image_uploader_user_id,
      image_uploader_company_id,
      search_tags,
      share_count,
      like_count,
      image_uploader_event_id
    );
    return result;
  } catch (error) {
    console.log("Error occurred in create Gallery Image Service", error);
    throw error;
  }
};

/**
 *Method to update Gallery Image
 * @param {JSON} body
 */
const editGalleryImage = async (body, connectionObj = null) => {
  let result = null;
  try {
    const {
      image_title,
      image_desc,
      image_url,
      image_uploader_user_id,
      image_uploader_company_id,
      search_tags,
      share_count = 0,
      like_count = 0,
      image_uploader_event_id,
      image_id,
    } = body;

    let galleryImage = await galleryImageDao.getById(image_id);

    if (galleryImage === null) {
      result = { message: "gallery image not exist" };
      return result;
    } else {
      result = await galleryImageDao.edit(
        image_title,
        image_desc,
        image_url,
        image_uploader_user_id,
        image_uploader_company_id,
        search_tags,
        share_count,
        like_count,
        image_uploader_event_id,
        image_id
      );
      return result;
    }
  } catch (error) {
    console.log("Error occurred in edit Gallery Image", error);
    throw error;
  }
};

/**
 * Method to get Gallery Image based on image_id
 * @param {uuid} image_id
 */
const getGalleryImage = async (image_id) => {
  try {
    let gallery = {
      data: null,
    };
    let data = await galleryImageDao.getById(image_id);
    if (data === null) gallery = { message: "gallery not exist" };
    else gallery["data"] = data;
    return gallery;
  } catch (error) {
    console.log("Error occurred in fetch gallery", error);
    throw error;
  }
};

/**
 * Method to get all Gallery Image
 */
const getAllGalleryImage = async () => {
  try {
    let gallery = null;
    let data = await galleryImageDao.getAll();
    gallery = data;
    return gallery;
  } catch (error) {
    console.log("Error occurred in fetchAll gallery image", error);
    throw error;
  }
};

/**
 * Method to delete Gallery Image based on image_id
 * @param {uuid} image_id
 */
const deleteGalleryImage = async (image_id) => {
  try {
    let result = {};
    let data = await galleryImageDao.deleteById(image_id);
    if (data === null) result = { message: "Gallery Image not exist" };
    else result["data"] = "Deleted Successfully!";
    return result;
  } catch (error) {
    console.log("Error occurred in delete gallery image", error);
    throw error;
  }
};

module.exports = {
  createGalleryImage,
  editGalleryImage,
  getGalleryImage,
  getAllGalleryImage,
  deleteGalleryImage,
};
