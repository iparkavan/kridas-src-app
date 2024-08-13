const { uploadFile } = require("../services/s3.service");
const {
  uploadToCloudinary,
  uploadVideo,
  deleteImage,
} = require("../services/cloudinary.service");
const { deleteS3File } = require("../services/s3.service");
const fs = require("fs");

/**
 * Upload multiple documents in s3 server
 * @param {files} files
 */
const documentUpload = async (files) => {
  let docData = null;
  let docArr = [];
  
  if (files?.document !== null && files?.document !== undefined) {
    await Promise.all(
      files.document.map(async (doc, index) => {
        let data = await uploadFile(doc);
        docData = { ...docData, [`${doc.fieldname}-${index}`]: data.Location };
        let resDoc = {
          key: data.key,
          url: data.Location,
          name: doc.originalname,
          // e_tag: data.ETag,
          is_delete: "N",
        };
        docArr.push(resDoc);
        if (fs.existsSync(doc.path)) {
          fs.unlink(doc.path, (err) => {
            if (err) {
              console.log(err);
            }
            console.log("deleted");
          });
        }
      })
    );
    
    return docArr;
  }
  return docArr;
};
/**
 * Method to upload single image in cloudinary
 * @param {json} file
 * @returns
 */
const cloudinaryUpload = async (file, folderPath = null) => {
  try {
    var localFilePath = file.path;
    var metaData = await uploadToCloudinary(localFilePath, folderPath);
    // let result={url:imageData?.url,metaData}

    return metaData;
  } catch (error) {
    console.log("Error occurred in updateCompanyType: ", error);
    throw error;
  }
};

/**
 * Method to upload multiple image in cloudinary
 * @param {json} file
 * @returns
 */
const cloudinaryMultipleUpload = async (body) => {
  try {
    let imageData = {};
    const { files, type } = body;
    let path = `gallery/${type}`;
    let index = 0;
    if (files?.image !== null) {
      for (const file of files?.image) {
        let data = await cloudinaryUpload(file, path);
        imageData = { ...imageData, [`url-${index}`]: data };
        index++;
      }
      return imageData;
    }
    return imageData;
  } catch (error) {
    console.log("Error occurred in updateCompanyType: ", error);
    throw error;
  }
};

/**
 * Method to upload video in cloudinary
 * @param {json} file
 * @returns
 */
const cloudinaryVideoUpload = async (file) => {
  try {
    let imageData = {};
    if (file?.image !== null) {
      await Promise.all(
        file.image.map(async (img, index) => {
          let data = await uploadVideo(img.path);
          imageData = { ...imageData, [`url-${index}`]: data };
        })
      );
      return imageData;
    }
    return imageData;
  } catch (error) {
    console.log("Error occurred in updateCompanyType: ", error);
    throw error;
  }
};

const cloudinaryFilter = async (request_data) => {
  try {
    const { public_id, resource_type, url, original_filename } = request_data;
    let result = {
      public_id,
      resource_type,
      url,
      original_filename,
    };

    return result;
  } catch (error) {
    console.log("Error occurred in cloudinaryFilter: ", error);
    throw error;
  }
};

/**
 * Method to delete multiple doc in s3 bucket
 * @param {*} documents
 */
const deleteDocuments = async (documents) => {
  try {
    for await (const doc of documents) deleteS3File(doc);
  } catch (error) {
    console.log("Error occurred in deleteDocuments: ", error);
    throw error;
  }
};

const cloudinaryImageDelete = async (data) => {
  try {
    if (data !== null && data !== undefined)
      await deleteImage(data.public_id, false);
  } catch (error) {
    console.log("Error occurred in deleteImage: ", error);
    throw error;
  }
};

module.exports = {
  documentUpload,
  cloudinaryUpload,
  cloudinaryMultipleUpload,
  cloudinaryVideoUpload,
  cloudinaryFilter,
  deleteDocuments,
  cloudinaryImageDelete,
};
