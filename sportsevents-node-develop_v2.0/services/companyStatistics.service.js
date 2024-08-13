const db = require("../utils/db");
const {
  add,
  edit,
  getAll,
  getById,
  deleteById,
  checkDuplicate,
  getCompanyById,
} = require("../dao/companyStatistics.dao");
const fs = require("fs");
const { documentUpload, deleteDocuments } = require("../utils/common");
const companyDao = require("../dao/company.dao");
const sportsDao = require("../dao/sports.dao");

/**
 * Method to add multiple company Statistics
 * @param {json} body
 * @param {json} connectionObj
 * @returns array of companyStatistics
 */
const createMultipleCompanyStatistics = async (body, connectionObj = null) => {
  result = await db
    .tx(async (t) => {
      let response = [];
      console.log("check data--->", body);
      for await (const comapnyStats of body.obj) {
        let doc = body.files.document.filter((file, index) => {
          let doc_id = file.originalname.replace(".", "~").split("~")[1].trim();
          console.log("check data--->", doc_id);
          if (doc_id == comapnyStats.company_id) return file;
        });
        comapnyStats["files"] = doc.length > 0 ? { document: doc } : {};
        console.log("check comapnyStats", comapnyStats);
        let comapny = await createCompanyStatistics(comapnyStats);
        response.push(comapny);
      }
      return response;
    })
    .then((data) => {
      console.log("successfully data returned", data);
      return data;
    })
    .catch((error) => {
      console.log("Error occurred in Create multiple CompanyStatistics", error);
      throw error;
    });
  return result;
};

/**
 * Method to updated multiple company Statistics
 * @param {Json} body
 * @param {Json} connectionObj
 * @returns array of companyStatistics
 */
const updateMultipleCompanyStatistics = async (body, connectionObj = null) => {
  result = await db
    .tx(async (t) => {
      let response = [];
      for await (const comapnyStats of body.obj) {
        let doc = body.files.document.filter((file, index) => {
          let doc_id = file.originalname.replace(".", "~").split("~")[1].trim();
          if (doc_id == comapnyStats.company_id) return file;
        });
        comapnyStats["files"] = doc.length > 0 ? { document: doc } : {};
        let comapny = await editCompanyStatistics(comapnyStats);
        response.push(comapny);
      }
      return response;
    })
    .then((data) => {
      console.log("successfully data returned", data);
      return data;
    })
    .catch((error) => {
      console.log("Error occurred in update multiple CompanyStatistics", error);
      throw error;
    });
  return result;
};

/**
 * Create a new company statistics an existing company
 * @param {json} body
 * @param {json} connectionObj
 */
const createCompanyStatistics = async (body, connectionObj = null) => {
  let result = null;
  try {
    const {
      company_id,
      categorywise_statistics = null,
      statistics_links = null,
      files = null,
    } = body;
    let transaction = connectionObj !== null ? connectionObj : db;

    let identity_docs = [];

    // S3 file upload
    if (JSON.stringify(files) !== JSON.stringify({}))
      identity_docs = await documentUpload(files);

    //add crud
    result = await add(
      company_id,
      categorywise_statistics,
      statistics_links,
      JSON.stringify(identity_docs),
      transaction
    );
    return result;
  } catch (error) {
    console.log("Error occurred in Create CompanyStatistics", error);
    throw error;
  }
};

/**
 * Edit existing company statistics by company statistics id
 * @param {json} body
 * @param {json} connectionObj
 */
const editCompanyStatistics = async (body, connectionObj = null) => {
  let result = null;
  try {
    const {
      company_statistics_id,
      company_id,
      categorywise_statistics = null,
      statistics_links = null,
      statistics_docs = "[]",
      files = null,
    } = body;
    let transaction = connectionObj !== null ? connectionObj : db;
    let companyStatistics = null;
    companyStatistics = await getById(company_statistics_id);

    let identity_docs = JSON.parse(statistics_docs).filter(
      (doc) => doc.is_delete === "N"
    );
    let deleted_doc_list = JSON.parse(statistics_docs).filter(
      (doc) => doc.is_delete === "Y"
    );

    // S3 file upload
    if (JSON.stringify(files) !== JSON.stringify({})) {
      let docRespons = await documentUpload(files);
      identity_docs = [...identity_docs, ...docRespons];
    }

    //test s3 delete
    await deleteDocuments(deleted_doc_list);

    result = await edit(
      company_id,
      categorywise_statistics,
      statistics_links,
      JSON.stringify(identity_docs),
      company_statistics_id,
      transaction
    );
    return result;
  } catch (error) {
    console.log("Error occurred in update CompanyStatistics", error);
    throw error;
  }
};

/**
 * Fetch company statistics by company statistics id
 * @param {int} company_statistics_id
 */
const fetchCompanyStatistics = async (company_statistics_id) => {
  try {
    let result = {
      data: null,
    };
    let data = await getById(company_statistics_id);
    if (data === null) result = { message: "CompanyStatistics not exist" };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetch CompanyStatistics", error);
    throw error;
  }
};

/**
 * Fetch all company statistics
 */
const fetchAll = async () => {
  try {
    let result = {
      data: null,
    };
    let data = await getAll();
    if (data === null) result = { message: "CompanyStatistics not exist" };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetchAll CompanyStatistics", error);
    throw error;
  }
};

/**
 * Delete company statistics by company statistics id
 * @param {int} company_statistics_id
 */
const deleteCompanyStatistics = async (company_statistics_id) => {
  try {
    let result = {
      data: null,
    };
    let data = await deleteById(company_statistics_id);
    if (data === null) result = { message: "CompanyStatistics not exist" };
    else result["data"] = "Success";

    return result;
  } catch (error) {
    console.log("Error occurred in delete CompanyStatistics", error);
    throw error;
  }
};

/**
 * Fetch company by company company id
 * @param {int} company_id
 */
const fetchCompanyById = async (company_id) => {
  try {
    let result = {
      data: null,
    };
    let comapny = null;
    comapny = await companyDao.getById(company_id);
    if (comapny === null && company_id !== null)
      return (result = { message: "company not exist" });
    let data = await getCompanyById(company_id);
    if (data === null) result = { message: "Company not exist" };
    //  {
    //   //   for await (let companyStats of data) {
    //   //     let sportId = companyStats?.categorywise_statistics?.sports_id;
    //   //     let sportName = await sportsDao.getSportNameBySportId(sportId);
    //   //     data.push(sportName);
    //   //   }
    //   data.map(async (value) => {
    //     let sportId = value?.categorywise_statistics?.sports_id;
    //     let sportName = await sportsDao.getSportNameBySportId(sportId);
    //     data.push(sportName);
    //   });
    // }
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetch CompanyById", error);
    throw error;
  }
};

/**
 * Upload multiple documents in s3 server
 * @param {files} files
 */
// const documentUpload = async (files) => {
//     let docData = null;
//     if (files?.document !== null) {
//         await Promise.all(files.document.map(async (doc, index) => {
//             let data = await uploadFile(doc);
//             docData = { ...docData, [`${doc.fieldname}-${index}`]: data.Location };
//             console.log("test image response", data);
//             if (fs.existsSync(doc.path)) {
//                 fs.unlink(doc.path, (err) => {
//                     if (err) {
//                         console.log(err);
//                     }
//                     console.log("deleted");
//                 });
//             }
//         }))
//         return docData;
//     }
//     return docData;
// }

module.exports = {
  createCompanyStatistics,
  fetchCompanyStatistics,
  deleteCompanyStatistics,
  fetchAll,
  editCompanyStatistics,
  createMultipleCompanyStatistics,
  updateMultipleCompanyStatistics,
  fetchCompanyById,
};
