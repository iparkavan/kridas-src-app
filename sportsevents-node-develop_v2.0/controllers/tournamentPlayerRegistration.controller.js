const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const tournamentPlayerRegistrationService = require("../services/tournamentPlayerRegistration.service");
const { handleError, ErrorHandler } = require("../config/error");
const errorText = "Error";

const createTournamentPlayerRegistration = catchAsync(async (req, res) => {
  const methodName = "/createTournamentPlayerRegistration";
  try {
    const tournamentPlayerRegistration =
      await tournamentPlayerRegistrationService.createTournamentPlayerRegistration(
        req.body
      );
    res.status(httpStatus.CREATED).send(tournamentPlayerRegistration);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const editTournamentPlayerRegistration = catchAsync(async (req, res) => {
  const methodName = "/editTournamentPlayerRegistration";
  try {
    const tournamentPlayerRegistration =
      await tournamentPlayerRegistrationService.editTournamentPlayerRegistration(
        req.body
      );
    res.send(tournamentPlayerRegistration);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchTournamentPlayerRegistration = catchAsync(async (req, res) => {
  const methodName = "/fetchTournamentPlayerRegistration";
  try {
    const tournamentPlayerRegistration =
      await tournamentPlayerRegistrationService.fetchTournamentPlayerRegistration(
        req.params.tournament_player_reg_id
      );
    res.send(tournamentPlayerRegistration);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteTournamentPlayerRegistration = catchAsync(async (req, res) => {
  const methodName = "/deleteTournamentPlayerRegistration";
  try {
    const tournamentPlayerRegistration =
      await tournamentPlayerRegistrationService.deleteTournamentPlayerRegistration(
        req.params.tournament_player_reg_id
      );
    res.send(tournamentPlayerRegistration);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAll = catchAsync(async (req, res) => {
  const methodName = "/fetchAll";
  try {
    const tournamentPlayerRegistration =
      await tournamentPlayerRegistrationService.fetchAll();
    res.send(tournamentPlayerRegistration);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getTeamByEventSport = catchAsync(async (req, res) => {
  const methodName = "/getTeamByEventSport";
  try {
    const tournamentPlayerRegistration =
      await tournamentPlayerRegistrationService.getTeamByEventSport(
        req.params.event_id,
        req.params.sport_id
      );
    res.send(tournamentPlayerRegistration);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createTournamentPlayerRegistration,
  fetchTournamentPlayerRegistration,
  editTournamentPlayerRegistration,
  deleteTournamentPlayerRegistration,
  fetchAll,
  getTeamByEventSport,
};
