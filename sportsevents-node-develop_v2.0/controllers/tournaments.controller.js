const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const tournamentService = require("../services/tournaments.service")
const { handleError, ErrorHandler } = require('../config/error');
const errorText = 'Error';


const createTournament = catchAsync(async (req, res) => {

    const methodName = '/createTournament'
    try {
        const tournament = await tournamentService.createTournament(req.body);
        res.status(httpStatus.CREATED).send(tournament);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const editTournament = catchAsync(async (req, res) => {
    const methodName = '/editTournament'
    try {
        const tournament = await tournamentService.editTournament(req.body);
        res.send(tournament);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchTournament = catchAsync(async (req, res) => {
    const methodName = '/fetchTournament'
    try {
        const tournament = await tournamentService.fetchTournament(req.params.tournament_id);
        res.send(tournament);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteTournament = catchAsync(async (req, res) => {
    const methodName = '/deleteTournament'
    try {
        const tournament = await tournamentService.deleteTournament(req.params.tournament_id);
        res.send(tournament);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAll = catchAsync(async (req, res) => {
    const methodName = '/fetchAll'
    try {
        const tournament = await tournamentService.fetchAll();
        res.send(tournament);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

module.exports = {
    createTournament,
    fetchTournament,
    editTournament,
    deleteTournament,
    fetchAll
};
