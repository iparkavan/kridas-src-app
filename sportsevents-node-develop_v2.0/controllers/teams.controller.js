const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const teamService = require("../services/teams.service");
const { handleError, ErrorHandler } = require("../config/error");
const errorText = "Error";

const createTeam = catchAsync(async (req, res) => {
  const methodName = "/createTeam";
  try {
    const Team = await teamService.createTeam(req.body);
    res.status(httpStatus.CREATED).send(Team);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const teamRegister = catchAsync(async (req, res) => {
  const methodName = "/teamRegister";
  try {
    let requestBody = req.body;
    requestBody["socket_request"] = req.socket_request;
    const Team = await teamService.teamRegister(requestBody);
    res.status(httpStatus.CREATED).send(Team);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const editTeam = catchAsync(async (req, res) => {
  const methodName = "/editTeam";
  try {
    const Team = await teamService.editTeam(req.body);
    res.send(Team);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchTeam = catchAsync(async (req, res) => {
  const methodName = "/fetchTeam";
  try {
    const Team = await teamService.fetchTeam(req.params.team_id);
    res.send(Team);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getByTeamNameandTournamentId = catchAsync(async (req, res) => {
  const methodName = "/getByTeamNameandTournamentId";
  try {
    const Team = await teamService.getByTeamNameandTournamentId(req.body);
    res.send(Team);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getParticipantByTournamentCatId = catchAsync(async (req, res) => {
  const methodName = "/getParticipantByTournamentCatId";
  try {
    const Team = await teamService.getParticipantByTournamentCatId(
      req.params.category_id
    );
    res.send(Team);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getParticipantByCompanyId = catchAsync(async (req, res) => {
  const methodName = "/getParticipantByCompanyId";
  try {
    const Team = await teamService.getParticipantByCompanyId(
      req.params.company_id
    );
    res.send(Team);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getByTeamId = catchAsync(async (req, res) => {
  const methodName = "/getByTeamId";
  try {
    const Team = await teamService.getByTeamId(req.params.team_id);
    res.send(Team);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteTeam = catchAsync(async (req, res) => {
  const methodName = "/deleteTeam";
  try {
    const Team = await teamService.deleteTeam(req.params.team_id);
    res.send(Team);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAll = catchAsync(async (req, res) => {
  const methodName = "/fetchAll";
  try {
    const Team = await teamService.fetchAll();
    res.send(Team);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const createClubTeam = catchAsync(async (req, res) => {
  const methodName = "/createClubTeam";
  try {
    const Team = await teamService.createClubTeam(req.body);
    res.send(Team);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const createThirdPartyVenue = catchAsync(async (req, res) => {
  const methodName = "/createThirdPartyVenue";
  try {
    const Team = await teamService.createThirdPartyVenue(req.body);
    res.send(Team);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const createBrandProduct = catchAsync(async (req, res) => {
  const methodName = "/createThirdPartyVenue";
  try {
    const Team = await teamService.createBrandProduct(req.body);
    res.send(Team);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const teamRegisterValidation = catchAsync(async (req, res) => {
  const methodName = "/teamRegisterValidation";
  try {
    const Team = await teamService.teamRegisterValidation(req.body);
    res.send(Team);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getPreferencesOpted = catchAsync(async (req, res) => {
  const methodName = "/getPreferencesOpted";
  try {
    const Team = await teamService.fetchPreferencesOpted(
      req.params.tournament_category_id
    );
    res.send(Team);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getPreferencesDetails = catchAsync(async (req, res) => {
  const methodName = "/getPreferencesDetails";
  try {
    const Team = await teamService.fetchPreferencesDetails(req.body);
    res.send(Team);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createTeam,
  fetchTeam,
  editTeam,
  deleteTeam,
  fetchAll,
  teamRegister,
  getParticipantByTournamentCatId,
  getByTeamNameandTournamentId,
  getParticipantByCompanyId,
  getByTeamId,
  createClubTeam,
  createThirdPartyVenue,
  createBrandProduct,
  teamRegisterValidation,
  getPreferencesOpted,
  getPreferencesDetails,
};
