const advertisementDao = require("../dao/advertisement.dao");
const { cloudinaryUpload, cloudinaryImageDelete } = require("../utils/common");

/**
 *Method to create advertisement
 * @param {JSON} body
 */
const createAdvertisement = async (body) => {
  let result = null;
  try {
    const {
      advertisement_name,
      advertisement_desc = null,
      files = {},
      valid_date,
      advertisement_click_url,
    } = body;

    let advertisement_media_url = null;

    if (JSON.stringify(files) !== JSON.stringify({})) {
      if (files.files[0] !== null && files.files[0] !== undefined) {
        imagemetaData = await cloudinaryUpload(files.files[0]);
      }
      let advertisement_media_url_meta = imagemetaData;

      let advertisement_media_url = imagemetaData?.url;

      result = await advertisementDao.add(
        advertisement_name,
        advertisement_desc,
        valid_date,
        advertisement_media_url,
        advertisement_click_url,
        advertisement_media_url_meta
      );
    }
    return result;
  } catch (error) {
    console.log("Error occurred in create  advertisement", error);
    throw error;
  }
};

/**
 *Method to update advertisement
 * @param {JSON} body
 */
const updateAdvertisement = async (body, connectionObj = null) => {
  let result = null;
  try {
    const {
      advertisement_name,
      advertisement_desc = null,
      files = {},
      valid_date,
      advertisement_click_url,
      advertisement_id,
    } = body;
    let advertisement_media_url = null;
    let advertisement_media_url_meta = null;

    let advertisement = await advertisementDao.getById(advertisement_id);

    if (advertisement === null && advertisement_id !== null) {
      result = { message: "advertisement not exist" };
      return result;
    } else {
      advertisement_media_url = advertisement?.advertisement_media_url;
      advertisement_media_url_meta =
        advertisement?.advertisement_media_url_meta;

      if (JSON.stringify(files) !== JSON.stringify({})) {
        if (files.files[0] !== null && files.files[0] !== undefined) {
          imagemetaData = await cloudinaryUpload(files.files[0]);
          await cloudinaryImageDelete(
            advertisement?.advertisement_media_url_meta
          );
        }

        let advertisement_media_url_meta = imagemetaData;
        let advertisement_media_url = imagemetaData?.url;

        result = await advertisementDao.edit(
          advertisement_name,
          advertisement_desc,
          valid_date,
          advertisement_media_url,
          advertisement_click_url,
          advertisement_media_url_meta,
          advertisement_id,
          connectionObj
        );
      }
      return result;
    }
  } catch (error) {
    console.log("Error occurred in edit advertisement", error);
    throw error;
  }
};

/**
 * Method to get advertisement based on advertisement_id
 * @param {int} advertisement_id
 */
const getById = async (advertisement_id) => {
  try {
    let advertisement = {};
    let data = await advertisementDao.getById(advertisement_id);
    if (data === null) advertisement = { message: "advertisement not exist" };
    else advertisement["data"] = data;
    return advertisement;
  } catch (error) {
    console.log("Error occurred in advertisement getById Service", error);
    throw error;
  }
};

/**
 * Method to get all advertisements
 * @returns
 */
const getAll = async () => {
  try {
    let advertisement = {
      data: null,
    };
    let data = await advertisementDao.getAll();
    if (data.length === 0) {
      return (advertisement = { message: "No Data Available" });
    } else {
      return (advertisement["data"] = data);
    }
  } catch (error) {
    console.log("Error occurred in getAll Advertisement", error);
    throw error;
  }
};

/**
 * Method to delete advertisement based on advertisement_id
 * @param {int} advertisement_id
 */
const deleteById = async (advertisement_id) => {
  try {
    let advertisement = {};
    let data = await advertisementDao.deleteById(advertisement_id);
    if (data === null) advertisement = { message: "advertisement not exist" };
    else advertisement["data"] = "Advertisement Deleted Successfully!";
    return advertisement;
  } catch (error) {
    console.log("Error occurred in delete advertisement", error);
    throw error;
  }
};

module.exports = {
  createAdvertisement,
  updateAdvertisement,
  getById,
  getAll,
  deleteById,
};
