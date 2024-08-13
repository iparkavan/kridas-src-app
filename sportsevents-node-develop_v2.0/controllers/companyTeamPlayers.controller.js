const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const companyTeamPlayersService = require("../services/companyTeamPlayers.service");
const { handleError, ErrorHandler } = require("./../config/error");
const errorText = "Error";

const createCompanyTeamPlayers = catchAsync(async (req, res) => {
  const methodName = "/createCompanyTeamPlayers";
  try {
    let requestBody = req.body;
    requestBody["files"] = req.files;
    const companyTeamPlayers =
      await companyTeamPlayersService.playerRegisteration(requestBody);
    res.status(httpStatus.CREATED).send(companyTeamPlayers);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getByCompanyId = catchAsync(async (req, res) => {
  const methodName = "/getByCompanyId";
  try {
    const companyTeamPlayers = await companyTeamPlayersService.getByCompanyId(
      req.params.company_id
    );
    res.status(httpStatus.CREATED).send(companyTeamPlayers);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getChildPagePlayersByCompanyId = catchAsync(async (req, res) => {
  const methodName = "/getChildPagePlayersByCompanyId";
  try {
    const companyTeamPlayers =
      await companyTeamPlayersService.getChildPagePlayersByCompanyId(
        req.params.company_id
      );
    res.status(httpStatus.CREATED).send(companyTeamPlayers);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const updateStatus = catchAsync(async (req, res) => {
  const methodName = "/updateStatus";
  try {
    const companyTeamPlayers = await companyTeamPlayersService.updateStatus(
      req.body
    );
    res.send(companyTeamPlayers);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchPlayer = catchAsync(async (req, res) => {
  const methodName = "/searchPlayer";
  try {
    const companyTeamPlayers = await companyTeamPlayersService.searchPlayer(
      req.body
    );
    res.send(companyTeamPlayers);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createCompanyTeamPlayers,
  getByCompanyId,
  getChildPagePlayersByCompanyId,
  updateStatus,
  searchPlayer,
};
