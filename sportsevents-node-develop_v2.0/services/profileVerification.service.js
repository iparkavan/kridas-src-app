const db = require("../utils/db");
const profileVerificationDao = require("../dao/profileVerification.dao");
const { documentUpload, deleteDocuments } = require("../utils/common");
const { documentUppdate } = require("../dao/user.dao");
const { companyDocumentUppdate } = require("../dao/company.dao");
const userDao = require("../dao/user.dao");
const companyDao = require("../dao/company.dao");
const { uploadFile } = require("../services/s3.service");
const fs = require("fs");

/**
 * Create a new profile verification an existing company or user
 * @param {json} body
 * @param {json} connectionObj
 */
const createProfileVerification = async (body, connectionObj = null) => {
  let result = null;
  result = await db
    .tx(async (transaction) => {
      const {
        company_id = null,
        user_id = null,
        applied_status = null,
        verification_comments = null,
        status_change_date = null,
        files = {},
        address_proof_type = null,
        id_proof_type = null,
        is_proof_same = "N",
      } = body;

      let user = await profileVerificationDao.getByUserId(
        user_id,
        applied_status,
        transaction
      );
      let company = await profileVerificationDao.getByCompanyId(
        company_id,
        applied_status,
        transaction
      );
      if (user !== null && applied_status === "S") {
        return (result = { message: " Already exist" });
      }
      if (company !== null && applied_status === "S") {
        return (result = { message: " Already exist" });
      }

      let identity_docs = [];
      let addressProof = [];
      let idProof = [];
      let sameAsAddress = is_proof_same;

      /* S3 file upload */
      if (sameAsAddress === "Y") {
        if (files?.id_proof !== null && files?.id_proof !== undefined) {
          idProof = await idProofUpload(files, id_proof_type);
          identity_docs = [...identity_docs, ...idProof];

          addressProof = idProof;
          identity_docs = [...identity_docs, ...addressProof];
        }
      } else {
        if (
          files?.address_proof !== null &&
          files?.address_proof !== undefined
        ) {
          addressProof = await addressProofUpload(files, address_proof_type);
          identity_docs = [...identity_docs, ...addressProof];
        }

        if (files?.id_proof !== null && files?.id_proof !== undefined) {
          idProof = await idProofUpload(files, id_proof_type);
          identity_docs = [...identity_docs, ...idProof];
        }
      }

      let docResponse = null;

      if (company_id !== null)
        docResponse = await companyDocumentUppdate(
          JSON.stringify(identity_docs),
          company_id,
          transaction
        );
      else
        docResponse = await documentUppdate(
          JSON.stringify(identity_docs),
          user_id,
          transaction
        );

      let response = await profileVerificationDao.add(
        company_id,
        user_id,
        applied_status,
        verification_comments,
        status_change_date,
        transaction
      );
      response["document"] = identity_docs;
      response["is_proof_same"] = sameAsAddress;
      return response;
    })
    .then((data) => {
      console.log("successfully data returned", data);
      return data;
    })
    .catch((error) => {
      console.log("failure, ROLLBACK was executed", error);
      throw error;
    });
  return result;
};

/**
 * Method for Address Proof File Upload
 * @param {JSON} files
 * @param {String} address_proof_type
 * @returns
 */
const addressProofUpload = async (files, address_proof_type) => {
  let docData = null;
  let docArr = [];
  let data = null;
  if (files?.address_proof !== null && files?.address_proof !== undefined) {
    await Promise.all(
      files.address_proof.map(async (doc, index) => {
        data = await uploadFile(doc);
        docData = { ...docData, [`${doc.fieldname}-${index}`]: data.Location };
        let resDoc = {
          key: data.key,
          url: data.Location,
          // e_tag: data.ETag,
          is_delete: "N",
          type: "Address Proof",
          address_proof_type: address_proof_type,
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
};

/**
 * Method for Id Proof File Upload
 * @param {JSON} files
 * @param {String} id_proof_type
 * @returns
 */
const idProofUpload = async (files, id_proof_type) => {
  let docData = null;
  let docArr = [];
  if (files?.id_proof !== null && files?.id_proof !== undefined) {
    await Promise.all(
      files.id_proof.map(async (doc, index) => {
        let data = await uploadFile(doc);
        docData = { ...docData, [`${doc.fieldname}-${index}`]: data.Location };
        let resDoc = {
          key: data.key,
          url: data.Location,
          // e_tag: data.ETag,
          is_delete: "N",
          type: "Id Proof",
          id_proof_type: id_proof_type,
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
  if (files?.id_proof !== null && files?.id_proof !== undefined) {
    await Promise.all(
      files.id_proof.map(async (doc, index) => {
        let data = await uploadFile(doc);
        docData = { ...docData, [`${doc.fieldname}-${index}`]: data.Location };
        let resDoc = {
          key: data.key,
          url: data.Location,
          // e_tag: data.ETag,
          is_delete: "N",
          type: "Id Proof",
          id_proof_type: id_proof_type,
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
 * Edit existing Profile verification
 * @param {json} body
 * @param {json} connectionObj
 */
const editProfileVerification = async (body, connectionObj = null) => {
  let result = null;
  result = await db
    .tx(async (transaction) => {
      const {
        profile_verification_id,
        company_id,
        user_id = null,
        applied_status = null,
        verification_comments = null,
        status_change_date = null,
      } = body;
      // let transaction = connectionObj !== null ? connectionObj : db
      let ProfileVerification = null;
      if (profile_verification_id != null) {
        ProfileVerification = await profileVerificationDao.getById(
          profile_verification_id
        );
        if (ProfileVerification === null) {
          result = { message: "Profile verification not found" };
          return result;
        }
      }
      if (user_id && applied_status !== "R")
        await userDao.userProfileVerified(user_id, transaction);
      if (company_id && applied_status !== "R")
        await companyDao.companyProfileVerified(company_id, transaction);
      let response = await profileVerificationDao.edit(
        company_id,
        user_id,
        applied_status,
        verification_comments,
        status_change_date,
        profile_verification_id,
        transaction
      );
      return response;
    })
    .then((data) => {
      console.log("successfully data returned", data);
      return data;
    })
    .catch((error) => {
      console.log("failure, ROLLBACK was executed", error);
      throw error;
    });
  return result;
};

/**
 * Fetch Profile verification by profile verification id
 * @param {int} profile_verification_id
 */
const fetchProfileVerification = async (profile_verification_id) => {
  try {
    let result = {
      data: null,
    };
    let data = await profileVerificationDao.getById(profile_verification_id);
    if (data === null) result = { message: "Profile verification not exist" };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetch ProfileVerification", error);
    throw error;
  }
};

/**
 * Fetch all ProfileVerifications
 */
const fetchAll = async () => {
  try {
    let result = {
      data: null,
    };
    let data = await profileVerificationDao.getAll();
    if (data === null) result = { message: "ProfileVerification not exist" };
    else result["data"] = data;

    return result;
  } catch (error) {
    console.log("Error occurred in fetchAll ProfileVerification", error);
    throw error;
  }
};

/**
 * Delete ProfileVerification by profile verification id
 * @param {int} profile_verification_id
 */
const deleteProfileVerification = async (profile_verification_id) => {
  try {
    let result = {
      data: null,
    };
    let data = await profileVerificationDao.deleteById(profile_verification_id);
    if (data === null) result = { message: "ProfileVerification not exist" };
    else result["data"] = "Success";

    return result;
  } catch (error) {
    console.log("Error occurred in delete ProfileVerification", error);
    throw error;
  }
};

/**
 * Fetch Profile verification by  user id
 * @param {uuid} userId
 */
const fetchByUserId = async (user_id, applied_status) => {
  try {
    let result = {
      data: null,
    };
    let data = null;
    if (applied_status === undefined)
      data = await profileVerificationDao.getByUserId(
        user_id,
        (applied_status = "S")
      );
    else
      data = await profileVerificationDao.getByUserId(user_id, applied_status);

    if (data === null)
      return (result = { message: "ProfileVerification not exist" });
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetchUserId ProfileVerification", error);
    throw error;
  }
};

/**
 * Fetch Profile verification based on user id or compnay id
 * @param {uuid} id
 * @param {string} type
 */
const fetchProfileVerificationBasedOnId = async (id, type) => {
  try {
    let result = {
      data: null,
    };
    let data = await profileVerificationDao.getByTypeAndId(id, type);
    if (data.length > 0) result = data;
    else result = { message: "Profile verification not exist" };
    return result;
  } catch (error) {
    console.log("Error occurred in fetch ProfileVerificationBasedOnId", error);
    throw error;
  }
};

module.exports = {
  createProfileVerification,
  editProfileVerification,
  fetchProfileVerification,
  deleteProfileVerification,
  fetchAll,
  fetchByUserId,
  fetchProfileVerificationBasedOnId,
};
