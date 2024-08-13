const companySponsorTypeDao = require("../dao/companySponsorType.dao");
const companyService = require("../services/company.service");

/**
 * Method to add new Company Sponsor Type
 * @param {json} body
 */
const createCompanySponsorType = async (body) => {
  try {
    let result = null;
    const {
      company_sponsor_type_name,
      company_id,
      sort_order = 0,
      is_deleted = false,
    } = body;
    result = await companySponsorTypeDao.add(
      company_sponsor_type_name,
      company_id,
      sort_order,
      is_deleted
    );
    return result;
  } catch (error) {
    console.log("Error occurred in createCompanySponsorType", error);
    throw error;
  }
};

/**
 * Method to get Company Sponsor Type based on company SponsorType id
 * @param {int} company_sponsor_type_id
 */
const fetchCompanySponsorType = async (company_sponsor_type_id) => {
  try {
    let companySponsorType = {
      data: null,
    };
    let data = await companySponsorTypeDao.getById(company_sponsor_type_id);
    if (data === null)
      companySponsorType = { message: "company Sponsor Type not exist" };
    else companySponsorType["data"] = data;
    return companySponsorType;
  } catch (error) {
    console.log("Error occurred in fetchCompanySponsorType", error);
    throw error;
  }
};

/**
 * Method to get Company Sponsor Type list
 */
const fetchAll = async () => {
  try {
    let data = await companySponsorTypeDao.getAll();
    return data;
  } catch (error) {
    console.log("Error occurred in fetchAll", error);
    throw error;
  }
};

/**
 * Method to update existing Company Sponsor Type
 * @param {json} body
 */
const editCompanySponsorType = async (body) => {
  try {
    let companySponsorType = null;
    let result = null;
    let company = null;
    const {
      company_sponsor_type_name,
      company_id,
      sort_order = 0,
      is_deleted = false,
      company_sponsor_type_id,
    } = body;
    companySponsorType = await companySponsorTypeDao.getById(
      company_sponsor_type_id
    );
    company = await companyService.fetchCompany(company_id);

    if (companySponsorType === null) {
      result = { message: " companySponsorType not found" };
      return result;
    }

    if (!(company?.message === undefined)) {
      result = { message: " company not found" };
      return result;
    }

    result = await companySponsorTypeDao.edit(
      company_sponsor_type_name,
      company_id,
      sort_order,
      is_deleted,
      company_sponsor_type_id
    );
    return result;
  } catch (error) {
    console.log("Error occurred in editCompanySponsorType", error);
    throw error;
  }
};

/**
 * Method to delete Company Sponsor Type based on Company Sponsor Type id
 * @param {int}  company_sponsor_type_id
 */
const deleteCompanySponsorType = async (company_sponsor_type_id) => {
  try {
    let result = {};
    let data = await companySponsorTypeDao.deleteById(company_sponsor_type_id);
    if (data === null) result = { message: "Company Sponsor Type not exist" };
    else result["data"] = "Deleted Successfully!";
    return result;
  } catch (error) {
    console.log("Error occurred in deleteCompanySponsorType", error);
    throw error;
  }
};

module.exports = {
  fetchAll,
  createCompanySponsorType,
  fetchCompanySponsorType,
  editCompanySponsorType,
  deleteCompanySponsorType,
};
