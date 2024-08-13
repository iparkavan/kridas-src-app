const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const companySponsorService = require("../services/companySponsor.service");
const { handleError, ErrorHandler } = require("../config/error");
const errorText = "Error";

const createCompanySponsor = catchAsync(async (req, res) => {
  const methodName = "/createCompanySponsor";
  try {
    const companySponsor = await companySponsorService.createCompanySponsor(
      req.body
    );
    res.status(httpStatus.CREATED).send(companySponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getAllCompanySponsor = catchAsync(async (req, res) => {
  const methodName = "/fetchAll";
  try {
    const companySponsor = await companySponsorService.fetchAll();
    res.send(companySponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getByCompanySponsorId = catchAsync(async (req, res) => {
  const methodName = "/getById";
  try {
    const companySponsor = await companySponsorService.fetchCompanySponsor(
      req.params.company_sponsor_id
    );
    res.send(companySponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getByCompanyId = catchAsync(async (req, res) => {
  const methodName = "/getByCompanyId";
  try {
    const companySponsor = await companySponsorService.getByCompanyId(
      req.params.company_id
    );
    res.send(companySponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getByIsFeature = catchAsync(async (req, res) => {
  const methodName = "/getByIsFeature";
  try {
    const companySponsor = await companySponsorService.getByIsFeature(req.body);
    res.send(companySponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const editCompanySponsor = catchAsync(async (req, res) => {
  const methodName = "/editCompanySponsor";
  try {
    const companySponsor = await companySponsorService.editCompanySponsor(
      req.body
    );
    res.send(companySponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteByCompanySponsorId = catchAsync(async (req, res) => {
  const methodName = "/deleteById";
  try {
    const companySponsor = await companySponsorService.deleteCompanySponsor(
      req.params.company_sponsor_id
    );
    res.send(companySponsor);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  getAllCompanySponsor,
  getByCompanySponsorId,
  getByCompanyId,
  createCompanySponsor,
  editCompanySponsor,
  deleteByCompanySponsorId,
  getByIsFeature,
};
