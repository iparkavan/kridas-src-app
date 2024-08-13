const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const companyService = require("../services/company.service");
const { handleError, ErrorHandler } = require("./../config/error");
const errorText = "Error";
const categoryService = require("../services/category.service");

const createCompany = catchAsync(async (req, res) => {
  const methodName = "/createCompany";
  try {
    req.body.company_type =
      req.body?.company_type === undefined
        ? null
        : JSON.parse(req.body?.company_type);
    req.body.sports_interest =
      req.body?.sports_interest === undefined
        ? null
        : JSON.parse(req.body?.sports_interest);
    req.body.company_category =
      req.body?.company_category === undefined
        ? null
        : JSON.parse(req.body?.company_category);
    let requestBody = req.body;
    requestBody["files"] = req.files;
    const company = await companyService.createCompany(requestBody);
    res.status(httpStatus.CREATED).send(company);
  } catch (err) {
    console.log("Error occurred in create company:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const editCompany = catchAsync(async (req, res) => {
  const methodName = "/editCompany";
  try {
    req.body.company_type =
      req.body?.company_type === undefined
        ? null
        : JSON.parse(req.body?.company_type);
    req.body.sports_interest =
      req.body?.sports_interest === undefined
        ? null
        : JSON.parse(req.body?.sports_interest);
    req.body.company_category =
      req.body?.company_category === undefined
        ? null
        : JSON.parse(req.body?.company_category);
    let requestBody = req.body;
    requestBody["files"] = req.files;
    const company = await companyService.editCompany(requestBody);
    res.send(company);
  } catch (err) {
    console.log("Error occurred in edit company:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const updateByToken = catchAsync(async (req, res) => {
  const methodName = "/updateByToken";
  try {
    const company = await companyService.updateByToken(req.body);
    res.send(company);
  } catch (err) {
    console.log("Error occurred in updateByToken:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchCompany = catchAsync(async (req, res) => {
  const methodName = "/fetchCompany";
  try {
    const company = await companyService.fetchCompany(
      req.params.company_id,
      req.query.user_id
    );
    res.send(company);
  } catch (err) {
    console.log("Error occurred in fetchCompany:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchCompanyByUser = catchAsync(async (req, res) => {
  const methodName = "/fetchCompanyByUser";
  try {
    const company = await companyService.fetchCompanyByUser(req.params.user_id);
    res.send(company);
  } catch (err) {
    console.log("Error occurred in fetchCompanyByUser:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchCompanyByEmail = catchAsync(async (req, res) => {
  const methodName = "/fetchCompanyByEmail";
  try {
    const company = await companyService.fetchCompanyByEmail(
      req.params.company_email
    );
    res.send(company);
  } catch (err) {
    console.log("Error occurred in fetchCompanyByEmail:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchCompanyByToken = catchAsync(async (req, res) => {
  const methodName = "/fetchCompanyByToken";
  try {
    const company = await companyService.fetchCompanyByToken(req.params.token);
    res.send(company);
  } catch (err) {
    console.log("Error occurred in fetchCompanyByToken:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchCompanyByType = catchAsync(async (req, res) => {
  const methodName = "/fetchCompanyByType";
  try {
    let category_name = "Brand";
    const category = await categoryService.fetchCategoriesByCategoryName(
      category_name
    );

    let data1 = category.data.map((e) => {
      let CategoryId = e.category_id;
      return CategoryId;
    });

    const company = await companyService.fetchCompanyByType(data1);
    res.send(company);
  } catch (err) {
    console.log("Error occurred in fetchCompanyByType:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAll = catchAsync(async (req, res) => {
  const methodName = "/fetchAll";
  try {
    const companies = await companyService.fetchAll();
    res.send(companies);
  } catch (err) {
    console.log("Error occurred in fetchAll:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteCompany = catchAsync(async (req, res) => {
  const methodName = "/deleteCompany";
  try {
    const company = await companyService.deleteCompany(req.params.company_id);
    res.send(company);
  } catch (err) {
    console.log("Error occurred in deleteCompany:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchCompanyTypes = catchAsync(async (req, res) => {
  const methodName = "fetchCompanyTypes";
  try {
    const company = await companyService.fetchCompanyTypes(
      req.params.company_id
    );
    res.send(company);
  } catch (err) {
    console.log("Error occurred in fetchCompanyTypes:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchCompanyTypeDetailsByCompanyId = catchAsync(async (req, res) => {
  const methodName = "/fetchCompanyTypeDetailsByCompanyId";
  try {
    const company = await companyService.fetchCompanyTypeDetailsByCompanyId(
      req.body.company_id,
      req.body.company_type
    );
    res.send(company);
  } catch (err) {
    console.log("Error occurred in fetchCompanyTypeDetailsByCompanyId:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchCompanyByName = catchAsync(async (req, res) => {
  const methodName = "/fetchCompanyByName";
  try {
    const company = await companyService.fetchCompanyByName(
      req.params.company_name
    );
    res.send(company);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchByParentCompany = catchAsync(async (req, res) => {
  const methodName = "/fetchByParentCompany";
  try {
    const company = await companyService.fetchByParentCompany(
      req.params.parent_company_id
    );
    res.send(company);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAllParentCompany = catchAsync(async (req, res) => {
  const methodName = "/fetchAllParentCompany";
  try {
    const company = await companyService.fetchAllParentCompany();
    res.send(company);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchCompany = catchAsync(async (req, res) => {
  const methodName = "/searchCompany";
  try {
    const user = await companyService.searchCompany(req.body);
    res.send(user);
  } catch (err) {
    console.log("Error occurred in searchCompany: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchCompanyDataById = catchAsync(async (req, res) => {
  const methodName = "/getCompanyDataById";
  try {
    const company = await companyService.fetchCompanyData(
      req.params.company_id
    );
    res.send(company);
  } catch (err) {
    console.log("Error occurred in fetchCompanyDataById:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchCompanyUrlName = catchAsync(async (req, res) => {
  const methodName = "/fetchCompanyUrlName";
  try {
    const company = await companyService.fetchCompanyUrlName(
      req.params.company_public_url_name
    );
    res.send(company);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const search = catchAsync(async (req, res) => {
  const methodName = "/search";
  try {
    const company = await companyService.search(req.body);
    res.send(company);
  } catch (err) {
    console.log("Error occurred in search Company: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchIsFeature = catchAsync(async (req, res) => {
  const methodName = "/searchIsFeature";
  try {
    const company = await companyService.searchByIsFeature(req.body);
    res.send(company);
  } catch (err) {
    console.log("Error occurred in search Company: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchByUserId = catchAsync(async (req, res) => {
  const methodName = "/searchByUserId";
  try {
    const company = await companyService.searchByUserId(req.body);
    res.send(company);
  } catch (err) {
    console.log("Error occurred in Company searchByUserId: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getByParentCompanyId = catchAsync(async (req, res) => {
  const methodName = "/getByParentCompanyId";
  try {
    const company = await companyService.getByParentCompanyId(req.body);
    res.send(company);
  } catch (err) {
    console.log("Error occurred in Company getByParentCompanyId: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getParentTeamPagesByUserId = catchAsync(async (req, res) => {
  const methodName = "/getParentTeamPagesByUserId";
  try {
    const company = await companyService.getParentTeamPagesByUserId(req.body);
    res.send(company);
  } catch (err) {
    console.log("Error occurred in Company getParentTeamPagesByUserId: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getAllCities = catchAsync(async (req, res) => {
  const methodName = "/getAllCities";
  try {
    const companies = await companyService.getAllCities();
    res.send(companies);
  } catch (err) {
    console.log("Error occurred in getAllCities:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const companyProfileVerification = catchAsync(async (req, res) => {
  const methodName = "/companyProfileVerification";
  try {
    const companies = await companyService.companyProfileVerification(req.body);
    res.send(companies);
  } catch (err) {
    console.log("Error occurred in companyProfileVerification:", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createCompany,
  fetchCompany,
  deleteCompany,
  editCompany,
  fetchAll,
  fetchCompanyByEmail,
  fetchCompanyByToken,
  updateByToken,
  fetchCompanyByType,
  fetchCompanyTypes,
  fetchCompanyTypeDetailsByCompanyId,
  fetchCompanyByName,
  fetchByParentCompany,
  fetchAllParentCompany,
  searchCompany,
  fetchCompanyByUser,
  fetchCompanyDataById,
  fetchCompanyUrlName,
  search,
  searchIsFeature,
  searchByUserId,
  getByParentCompanyId,
  getParentTeamPagesByUserId,
  getAllCities,
  companyProfileVerification,
};
