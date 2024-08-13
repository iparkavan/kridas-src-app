const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const tournamentCategories = require('../services/tournamentCategories.service')
const { handleError, ErrorHandler } = require('../config/error');
const errorText = 'Error';

const create = catchAsync(async (req, res) => {
    const methodName = '/createOrganizer'
    try {
        const tournament = await tournamentCategories.createTournamentCatgories(req.body);
        res.status(httpStatus.CREATED).send(tournament);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);

    }
});

const editTournament = catchAsync(async (req, res) => {
    const methodName = '/editTournament'
    try {
        const tournament = await tournamentCategories.updateTournament(req.body);
        res.send(tournament);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const getById = catchAsync(async (req, res) => {
    const methodName = '/fetchTournament'
    try {
        const tournament = await tournamentCategories.fetchTournament(req.params.id);
        res.send(tournament);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchAll = catchAsync(async (req, res) => {
    const methodName = '/fetchAll'
    try {
        const tournament = await tournamentCategories.fetchAll();
        res.send(tournament);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const deleteById = catchAsync(async (req, res) => {
    const tournament = await tournamentCategories.deleteTournament(req.params.id);
    res.send(tournament);
});


module.exports = {
    create,
    getById,
    fetchAll,
    deleteById,
    editTournament
}