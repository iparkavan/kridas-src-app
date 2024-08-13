const companySponsorDao = require("../dao/companySponsor.dao");
const companyService = require("../services/company.service");

/**
 * Method to add new Company Sponsor
 * @param {json} body
 */
const createCompanySponsor = async (body) => {
  try {
    let result = null;
    const {
      sponsor_id,
      company_id,
      sponsor_type_id,
      is_featured = false,
      seq_number = 1,
    } = body;
    result = await companySponsorDao.add(
      sponsor_id,
      company_id,
      sponsor_type_id,
      is_featured,
      seq_number
    );
    return result;
  } catch (error) {
    console.log("Error occurred in createCompanySponsor service add", error);
    throw error;
  }
};

/**
 * Method to get Company Sponsor  based on company Sponsor id
 * @param {int} company_sponsor__id
 */
const fetchCompanySponsor = async (company_sponsor__id) => {
  try {
    let companySponsor = {
      data: null,
    };
    let data = await companySponsorDao.getById(company_sponsor__id);
    if (data === null)
      companySponsor = { message: "company Sponsor  not exist" };
    else companySponsor["data"] = data;
    return companySponsor;
  } catch (error) {
    console.log("Error occurred in fetchCompanySponsor service", error);
    throw error;
  }
};

/**
 * Method to get Company Sponsor based on company_id
 * @param {uuid} company_id
 */
const getByCompanyId = async (company_id) => {
  try {
    let companySponsor = {
      data: null,
    };
    let data = await companySponsorDao.getByCompanyId(company_id);
    let company = await companyService.fetchCompany(company_id);

    if (!(company?.message === undefined)) {
      companySponsor = { message: "Company not found" };
      return companySponsor;
    }
    if (data?.length === 0) {
      companySponsor = {
        message: "company Sponsor not exist for this company id",
      };
      return companySponsor;
    } else companySponsor["data"] = data;
    return companySponsor;
  } catch (error) {
    console.log("Error occurred in getByCompanyId service", error);
    throw error;
  }
};

/**
 * Method to get Feaured Sponsors
 * @param {boolean} is_featured
 * @param {text} sort_order
 * @returns
 */
const getByIsFeature = async (body) => {
  try {
    let companySponsor = {
      data: null,
    };
    const { is_featured = false, sort_order = "asc" } = body;
    let data = await companySponsorDao.getByIsFeature(is_featured, sort_order);

    if (data.length === 0) {
      companySponsor = {
        message: "Sponsor not exist for this filter",
      };
      return companySponsor;
    } else companySponsor["data"] = data;
    return companySponsor;
  } catch (error) {
    console.log("Error occurred in getByIsFeature service", error);
    throw error;
  }
};

/**
 * Method to get Company Sponsor  list
 */
const fetchAll = async () => {
  try {
    let data = await companySponsorDao.getAll();
    return data;
  } catch (error) {
    console.log("Error occurred in fetchAll service", error);
    throw error;
  }
};

/**
 * Method to update existing Company Sponsor
 * @param {json} body
 */
const editCompanySponsor = async (body) => {
  try {
    let companySponsor = null;
    let result = null;
    let company = null;
    const {
      sponsor_id,
      company_id,
      sponsor_type_id,
      is_featured = false,
      seq_number = 1,
      company_sponsor_id,
    } = body;
    companySponsor = await companySponsorDao.getById(company_sponsor_id);
    company = await companyService.fetchCompany(company_id);

    if (companySponsor === null) {
      result = { message: " companySponsor not found" };
      return result;
    }

    if (!(company?.message === undefined)) {
      result = { message: " company not found" };
      return result;
    }

    result = await companySponsorDao.edit(
      sponsor_id,
      company_id,
      sponsor_type_id,
      is_featured,
      seq_number,
      company_sponsor_id
    );
    return result;
  } catch (error) {
    console.log("Error occurred in editCompanySponsor", error);
    throw error;
  }
};

/**
 * Method to delete Company Sponsor  based on Company Sponsor id
 * @param {int}  company_sponsor_id
 */
const deleteCompanySponsor = async (company_sponsor_id) => {
  try {
    let result = {};
    let data = await companySponsorDao.deleteById(company_sponsor_id);
    if (data === null) result = { message: "Company Sponsor not exist" };
    else result["data"] = "Deleted Successfully!";
    return result;
  } catch (error) {
    console.log("Error occurred in deleteCompanySponsor", error);
    throw error;
  }
};

module.exports = {
  createCompanySponsor,
  fetchAll,
  fetchCompanySponsor,
  getByCompanyId,
  editCompanySponsor,
  deleteCompanySponsor,
  getByIsFeature,
};
