const db = require("../utils/db");
const mediaDao = require("../dao/media.dao");
const galleryMediaDao = require("../dao/galleryMedia.dao");
const galleryDao = require("../dao/gallery.dao");
const feedDao = require("../dao/feeds.dao");
const feedMediaDao = require("../dao/feedMedia.dao");
const { cloudinaryUpload } = require("../utils/common");
const { feedDefaultContent } = require("../utils/util");
const { off } = require("../config/logger");
const userDao = require("../dao/user.dao");

/**
 * Method to add new galleryMedia
 * @param {json} body
 */
const createGalleryMedia = async (body) => {
  try {
    let result = [];
    let response = [];
    let metaData = null;
    let image = null;
    let galleryMedia = null;
    const { type = null, gallery_id, files = {} } = body;
    let defaultContent = { ...feedDefaultContent };
    defaultContent["blocks"] = [];
    let path = `gallery/${gallery_id}`;
    let gallery = await galleryDao.getById(gallery_id);
    // let users = await userDao.getById(gallery.gallery_user_id);
    let { count } = await galleryMediaDao.getByGalleryCount(gallery_id);
    if (gallery === null) return (result = { message: "gallery not exist" });

    if (Object.keys(files).length === 0) {
      return (result = { message: "file not exist" });
    }
    result = await db
      .tx(async (transaction) => {
        let mediaArray = [];
        let j = 0;
        let feed_type = "AL";
        if (JSON.stringify(files) !== JSON.stringify({})) {
          for (const file of files?.file) {
            if (file !== null && file !== undefined) {
              image = await cloudinaryUpload(file, path);
              metaData = image;
            }
            let galleryMedia = null;
            let desc = null;
            metaData["src"] = metaData?.url;
            let media_type = metaData?.resource_type === "image" ? "I" : "V";
            let media = await mediaDao.add(
              media_type,
              metaData?.url,
              metaData,
              desc,
              gallery.gallery_user_id,
              gallery.gallery_company_id,
              [gallery.gallery_name],
              gallery.gallery_event_id,
              transaction
            );
            mediaArray.push(media);

            let blockArr = [
              {
                key: "afr9",
                text: "",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "6ptm",
                text: " ",
                type: "atomic",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [
                  {
                    offset: 0,
                    length: 1,
                    key: 1,
                  },
                ],
                data: {},
              },
            ];

            blockArr[0]["key"] = "afr9" + j;
            blockArr[1]["key"] = "6ptm" + j;
            blockArr[1]["entityRanges"][0]["key"] = j;
            let data = {
              type: "IMAGE",
              mutability: "IMMUTABLE",
              data: {},
            };

            data["type"] = media_type === "I" ? "IMAGE" : "VIDEO";
            data["data"] = metaData;
            defaultContent["blocks"] = [
              ...defaultContent["blocks"],
              ...blockArr,
            ];
            defaultContent["entityMap"][j.toString()] = data;
            j++;
          }
          // if (Number(count) === 0)
          //     defaultContent["blocks"][0]["text"] = `${users.first_name} has created the ${gallery.gallery_name} Album`;
          // else
          //     defaultContent["blocks"][0]["text"] = `${users.first_name} has updated the ${gallery.gallery_name} album with ${files?.file.length} new image.`;
          let feed = await feedDao.add(
            JSON.stringify(defaultContent),
            gallery.gallery_user_id,
            gallery.gallery_company_id,
            [gallery.gallery_name],
            0,
            0,
            gallery.gallery_event_id,
            feed_type,
            null,
            transaction
          );
          for (const media of mediaArray) {
            let feedMedia = await feedMediaDao.add(
              media.media_id,
              feed.feed_id,
              transaction
            );
            galleryMedia = await galleryMediaDao.add(
              media.media_id,
              gallery_id,
              transaction
            );
            galleryMedia["media"] = mediaArray;
          }
          return galleryMedia;
        }
      })
      .then((data) => {
        response.push(data);
        return response;
      })
      .catch((error) => {
        console.log("failure, ROLLBACK was executed", error);
        throw error;
      });
    return result;
  } catch (error) {
    console.log("Error occurred in createGalleryMedia", error);
    throw error;
  }
};

/**
 * Method to get galleryMedia list
 */
const fetchAll = async () => {
  try {
    let data = await galleryMediaDao.getAll();
    return data;
  } catch (error) {
    console.log("Error occurred in fetchAll", error);
    throw error;
  }
};

/**
 * Method to get SponsorInfo based on gallery_media_id
 * @param {int}  gallery_media_id
 */
const fetchGalleryMedia = async (gallery_media_id) => {
  try {
    let galleryMedia = {
      data: null,
    };
    let data = await galleryMediaDao.getById(gallery_media_id);
    if (data === null) galleryMedia = { message: "galleryMedia not exist" };
    else galleryMedia["data"] = data;
    return galleryMedia;
  } catch (error) {
    console.log("Error occurred in fetchGalleryMedia", error);
    throw error;
  }
};

/**
 * Method to delete galleryMedia based on galleryMedia id
 * @param {int}  gallery_media_id
 */
const deletegallerymedia = async (gallery_media_id) => {
  try {
    let galleryMedia = {
      data: null,
    };
    let data = await galleryMediaDao.deleteById(gallery_media_id);
    if (data === null) galleryMedia = { message: "galleryMedia not exist" };
    else galleryMedia["data"] = "Success";
    return galleryMedia;
  } catch (error) {
    console.log("Error occurred in deletegalleryMedia", error);
    throw error;
  }
};

module.exports = {
  createGalleryMedia,
  fetchAll,
  fetchGalleryMedia,
  deletegallerymedia,
};
