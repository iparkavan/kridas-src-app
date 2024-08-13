const userService = require("../services/user.service");
const companyService = require("../services/company.service");
const companyUserDao = require("../dao/companyUser.dao");
const companyDao = require("../dao/company.dao");
const userDao = require("../dao/user.dao");

/**
 *Method to create new company user
 * @param {JSon} body
 */
const createCompanyUser = async (body) => {
  let result = null;
  try {
    const {
      company_id,
      user_id,
      user_type,
      user_role = null,
      user_start_date,
      user_end_date = null,
    } = body;
    let { data, isError, message } = await companyService.fetchCompany(
      company_id
    );
    let currentDate = new Date();
    let user = null;
    user = await userService.fetchUser(user_id);

    if (!(user?.message === undefined)) {
      result = { message: "User not found" };
      return result;
    } else if (!(message === undefined)) {
      result = { message: "company not found" };
      return result;
    } else {
      result = await companyUserDao.add(
        company_id,
        user_id,
        user_type,
        user_role,
        user_start_date,
        user_end_date
      );
      return result;
    }
  } catch (error) {
    console.log("Error occurred in createCompanyUser", error);
    throw error;
  }
};

/**
 *Method to update existing company user
 * @param {JSon} body
 */
const editCompanyUser = async (body) => {
  let result = null;
  try {
    const {
      company_id,
      user_id,
      user_type,
      user_role = null,
      user_start_date,
      user_end_date = null,
      company_user_id,
    } = body;
    let { data, isError, message } = await companyService.fetchCompany(
      company_id
    );
    let currentDate = new Date();
    let user = null;
    user = await userService.fetchUser(user_id);

    if (!(user?.message === undefined)) {
      result = { message: "User not found" };
      return result;
    } else if (!(message === undefined)) {
      result = { message: "company not found" };
      return result;
    } else {
      result = await companyUserDao.edit(
        company_id,
        user_id,
        user_type,
        user_start_date,
        user_end_date,
        user_role,
        company_user_id
      );
      return result;
    }
  } catch (error) {
    console.log("Error occurred in editCompanyUser", error);
    throw error;
  }
};

/**
 * Method to get company user based on company id
 * @param {int} companyUserId
 */
const fetchCompanyUser = async (companyUserId) => {
  try {
    let result = {};
    let data = await companyUserDao.getById(companyUserId);
    if (data === null) result = { message: "companyUser not exist" };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetchCompanyUser", error);
    throw error;
  }
};

/**
 * Method to delete company user based on company id
 * @param {int} companyUserId
 */
const deleteCompanyUser = async (companyUserId) => {
  try {
    let result = {};
    let data = await companyUserDao.deleteById(companyUserId);
    if (data === null) result = { message: "companyUser not exist" };
    else result["data"] = "Success";
    return result;
  } catch (error) {
    console.log("Error occurred in deleteCompanyUser", error);
    throw error;
  }
};

/**
 *Method for page admin role settings
 * @param {JSon} body
 */
const createAdminRole = async (body) => {
  let result = [];
  try {
    const { company_id, users } = body;
    let company = await companyDao.getById(company_id);

    if (company === null) {
      return (result = { message: "Company Not Found" });
    }
    if (users?.length > 0) {
      for await (let v of users) {
        let result1 = null;
        let company_user_id = v.company_user_id;
        let user_start_date = v.user_start_date;
        let user_role = v.user_role;
        let user_type = v.user_type;

        let user = await userDao.getUserName(v.user_name);
        let currentDate = new Date();

        if (user === null) {
          return (result = { message: "User Not Exists" });
        }
        if (user_type !== "p") {
          if (company_user_id && user_type === "s") {
            result1 = await companyUserDao.edit(
              company_id,
              user?.user_id,
              "s",
              user_start_date,
              null,
              user_role,
              company_user_id
            );
            result.push(result1);
          } else {
            result1 = await companyUserDao.add(
              company_id,
              user?.user_id,
              "s",
              user_role,
              currentDate,
              null
            );
            result.push(result1);
          }
        }
        // let companyUserCombo = await companyUserDao.getCompanyAndUserCombo(
        //   company_id,
        //   user?.user_id
        // );
        // if (companyUserCombo === null) {
        //   result1 = await companyUserDao.add(
        //     company_id,
        //     user?.user_id,
        //     "s",
        //     v.user_role,
        //     currentDate,
        //     null
        //   );
        //   result.push(result1);
        // } else if (
        //   v.user_role !== companyUserCombo?.user_role &&
        //   companyUserCombo?.user_type !== "p"
        // ) {
        //   result1 = await companyUserDao.edit(
        //     company_id,
        //     user?.user_id,
        //     "s",
        //     companyUserCombo?.user_start_date,
        //     null,
        //     v.user_role,
        //     companyUserCombo?.company_user_id
        //   );
        //   result.push(result1);
        // }
      }
      return result;
    }
  } catch (error) {
    console.log("Error occurred in createAdminRole", error);
    throw error;
  }
};

/**
 * Method to get company user based on company id
 * @param {uuid} company_id
 */
const getByCompanyId = async (company_id) => {
  try {
    let result = {};
    let data = await companyUserDao.getByCompanyId(company_id);
    if (data?.length === 0)
      result = { message: "companyUser not exist for this company" };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in getByCompanyId", error);
    throw error;
  }
};

module.exports = {
  createCompanyUser,
  editCompanyUser,
  fetchCompanyUser,
  deleteCompanyUser,
  createAdminRole,
  getByCompanyId,
};
