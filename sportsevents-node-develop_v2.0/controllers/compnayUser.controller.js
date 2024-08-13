const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const companyUserService = require("../services/companyUser.service");
const { handleError, ErrorHandler } = require("./../config/error");
const errorText = "Error";

const createCompanyUser = catchAsync(async (req, res) => {
  const methodName = "/createCompanyUser";
  try {
    const companyUser = await companyUserService.createCompanyUser(req.body);
    res.status(httpStatus.CREATED).send(companyUser);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const editCompanyUser = catchAsync(async (req, res) => {
  const methodName = "/editCompanyUser";
  try {
    const user = await companyUserService.editCompanyUser(req.body);
    res.send(user);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchBrandPlayer = catchAsync(async (req, res) => {
  const methodName = "/fetchBrandPlayer";
  try {
    const companyUser = await companyUserService.fetchCompanyUser(
      req.params.company_user_id
    );
    res.send(companyUser);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteBrandPlayer = catchAsync(async (req, res) => {
  const methodName = "/deleteBrandPlayer";
  try {
    const companyUser = await companyUserService.deleteCompanyUser(
      req.params.company_user_id
    );
    res.send(companyUser);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const createAdminRole = catchAsync(async (req, res) => {
  const methodName = "/createAdminRole";
  try {
    const companyUser = await companyUserService.createAdminRole(req.body);
    res.status(httpStatus.CREATED).send(companyUser);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getByCompanyId = catchAsync(async (req, res) => {
  const methodName = "/getByCompanyId";
  try {
    const companyUser = await companyUserService.getByCompanyId(
      req.params.company_id
    );
    res.status(httpStatus.CREATED).send(companyUser);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createCompanyUser,
  deleteBrandPlayer,
  fetchBrandPlayer,
  editCompanyUser,
  createAdminRole,
  getByCompanyId,
};
