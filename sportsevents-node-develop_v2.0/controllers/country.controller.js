const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const countryService = require("../services/country.service");
const { handleError, ErrorHandler } = require("../config/error");
const errorText = "Error";

const create = catchAsync(async (req, res) => {
  const methodName = "/createCountry";
  try {
    const country = await countryService.createCountry(req.body);
    res.status(httpStatus.CREATED).send(country);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const editCountry = catchAsync(async (req, res) => {
  const methodName = "/editCountry";
  try {
    const country = await countryService.editCountry(req.body);
    res.send(country);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getById = catchAsync(async (req, res) => {
  const methodName = "/getById";
  try {
    const country = await countryService.fetchCountry(req.params.id);
    res.send(country);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAll = catchAsync(async (req, res) => {
  const methodName = "/fetchAll";
  try {
    const countries = await countryService.fetchAll();
    res.send(countries);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteById = catchAsync(async (req, res) => {
  const country = await countryService.deleteCountry(req.params.id);
  res.send(country);
});

const countryByCode = catchAsync(async (req, res) => {
  const methodName = "/countryByCode";
  try {
    const country = await countryService.fetchcountrybyCode(
      req.params.country_code
    );
    res.send(country);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getByCountryName = catchAsync(async (req, res) => {
  const countryName = await countryService.fetchCountryByName(
    req.params.country_name
  );
  res.send(countryName);
});

const getByCountryCodeIso = catchAsync(async (req, res) => {
  const methodName = "/getByCountryCodeIso";
  try {
    const country = await countryService.getByCountryCodeIso(
      req.params.country_code_iso
    );
    res.send(country);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  create,
  getById,
  deleteById,
  editCountry,
  fetchAll,
  getByCountryName,
  countryByCode,
  getByCountryCodeIso,
};
