const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const companySponsorTypeService = require("../services/companySponsorType.service");
const { handleError, ErrorHandler } = require("../config/error");
const errorText = "Error";

const create = catchAsync(async (req, res) => {
  const methodName = "/createCompanySponsorType";
  try {
    const companySponsorType =
      await companySponsorTypeService.createCompanySponsorType(req.body);
    res.status(httpStatus.CREATED).send(companySponsorType);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAll = catchAsync(async (req, res) => {
  const methodName = "/fetchAll";
  try {
    const companySponsorType = await companySponsorTypeService.fetchAll();
    res.send(companySponsorType);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getById = catchAsync(async (req, res) => {
  const methodName = "/getById";
  try {
    const companySponsorType =
      await companySponsorTypeService.fetchCompanySponsorType(
        req.params.company_sponsor_type_id
      );
    res.send(companySponsorType);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const edit = catchAsync(async (req, res) => {
  const methodName = "/editCompanySponsorType";
  try {
    const companySponsorType =
      await companySponsorTypeService.editCompanySponsorType(req.body);
    res.send(companySponsorType);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteById = catchAsync(async (req, res) => {
  const methodName = "/deleteById";
  try {
    const companySponsorType =
      await companySponsorTypeService.deleteCompanySponsorType(
        req.params.company_sponsor_type_id
      );
    res.send(companySponsorType);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  fetchAll,
  getById,
  create,
  edit,
  deleteById,
};
