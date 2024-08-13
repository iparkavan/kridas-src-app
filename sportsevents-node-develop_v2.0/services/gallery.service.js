const galleryDao = require("../dao/gallery.dao");
const galleryMediaDao = require("../dao/galleryMedia.dao");
const db = require("../utils/db");

/**
 *Method to create Gallery
 * @param {JSON} body
 */
const createGallery = async (body) => {
  let result = null;
  try {
    const {
      gallery_name,
      user_id = null,
      company_id = null,
      gallery_desc = null,
      gallery_event_id = null,
    } = body;
    result = await galleryDao.add(
      gallery_name,
      gallery_desc,
      user_id,
      company_id,
      gallery_event_id
    );
    return result;
  } catch (error) {
    console.log("Error occurred in create Gallery", error);
    throw error;
  }
};

/**
 *Method to update Gallery
 * @param {JSON} body
 */
const editGallery = async (body, connectionObj = null) => {
  let result = null;
  try {
    const { gallery_id, gallery_name, gallery_desc = null } = body;

    let galleryExisting = await galleryDao.getById(gallery_id);

    if (galleryExisting === null) {
      result = { message: "gallery not exist" };
      return result;
    } else {
      result = await galleryDao.edit(
        gallery_name,
        gallery_desc,
        gallery_id,
        connectionObj
      );
      return result;
    }
  } catch (error) {
    console.log("Error occurred in edit Gallery", error);
    throw error;
  }
};

/**
 * Method to get Gallery based on gallery_id
 * @param {uuid} gallery_id
 */
const fetchGallery = async (gallery_id) => {
  try {
    let gallery = {
      data: null,
    };
    let data = await galleryDao.getById(gallery_id);
    if (data === null) gallery = { message: "gallery not exist" };
    else gallery["data"] = data;
    return gallery;
  } catch (error) {
    console.log("Error occurred in fetch gallery", error);
    throw error;
  }
};

/**
 * Method to get Gallery based on gallery_user_id
 * @param {uuid} gallery_user_id
 */
const fetchGalleryByUserId = async (gallery_user_id) => {
  try {
    let gallery = {
      data: null,
    };
    let data = await galleryDao.getByUserId(gallery_user_id);
    if (data.length > 0) gallery["data"] = data;
    else
      gallery = { message: "gallery not exist for the given gallery user id" };
    return gallery;
  } catch (error) {
    console.log("Error occurred in fetch gallery by gallery_user_id", error);
    throw error;
  }
};

/**
 * Method to get Gallery based on gallery_company_id
 * @param {uuid} gallery_company_id
 */
const fetchGalleryByCompanyId = async (gallery_company_id) => {
  try {
    let gallery = {
      data: null,
    };
    let data = await galleryDao.getByCompanyId(gallery_company_id);
    if (data.length > 0) gallery["data"] = data;
    else
      gallery = {
        message: "gallery not exist for the given gallery company id",
      };
    return gallery;
  } catch (error) {
    console.log("Error occurred in fetch gallery By gallery_company_id", error);
    throw error;
  }
};

/**
 * Method to get all Gallery
 */
const fetchAllGallery = async () => {
  try {
    let gallery = null;
    let data = await galleryDao.getAll();
    gallery = data;
    return gallery;
  } catch (error) {
    console.log("Error occurred in fetchAll gallery", error);
    throw error;
  }
};

/**
 * Method to delete Gallery based on gallery id
 * @param {uuid} gallery_id
 */
const deleteGallery = async (gallery_id) => {
  let result = null;
  result = await db
    .tx(async (transaction) => {
      let response = {};
      let data = await galleryDao.getById(gallery_id);
      if (data === null) {
        response = { message: "Gallery not exist" };
      } else {
        await galleryMediaDao.deleteByGalleryId(gallery_id, transaction);
        let data = await galleryDao.deleteById(gallery_id, transaction);
        if (data === null) response = { message: "gallery not exist" };
        else response["data"] = "Success";
        return response;
      }
      return response;
    })
    .then((data) => {
      console.log("successfully data deleted", data);
      return data;
    })
    .catch((error) => {
      console.log("failure, ROLLBACK was executed", error);
      throw error;
    });
  return result;
};

/**
 * Method to get Gallery by gallery_event_id
 * @param {uuid} gallery_event_id
 * @returns
 */
const getGalleryByEventId = async (gallery_event_id) => {
  try {
    let gallery = {
      data: null,
    };
    let data = await galleryDao.getByEventId(gallery_event_id);
    if (data.length > 0) gallery["data"] = data;
    else
      gallery = {
        message: "gallery not exist for the given gallery event id",
      };
    return gallery;
  } catch (error) {
    console.log(
      "Error occurred in fetch gallery By getGalleryByEventId",
      error
    );
    throw error;
  }
};

module.exports = {
  createGallery,
  editGallery,
  fetchGallery,
  fetchGalleryByUserId,
  fetchGalleryByCompanyId,
  fetchAllGallery,
  deleteGallery,
  getGalleryByEventId,
};
