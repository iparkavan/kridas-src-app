const tournamentDao = require('../dao/tournaments.dao')
const sportsDao = require('../dao/sports.dao')
const eventsDao = require('../dao/events.dao')

/**
 * Method to create new Tournament
 * @param {JSON} body 
 * @returns 
 */
const createTournament = async (body) => {
    try {
        let result = null;
        let sports = null;
        let events = null;
        const { event_refid, sports_refid, tournament_startdate, tournament_enddate, tournament_rules = null, event_venue = null } = body;

        if (sports_refid !== null && sports_refid !== undefined) {
            sports = await sportsDao.getById(sports_refid);
            if (sports === null) {
                result = { message: "Sport Not Exists" }
                return result;
            }
        }

        if (event_refid !== null && event_refid !== undefined) {
            events = await eventsDao.getById(event_refid);
            if (events === null) {
                result = { message: "Event Not Exists" }
                return result;
            }
        }

        result = await tournamentDao.add(event_refid, sports_refid, tournament_startdate, tournament_enddate, tournament_rules, event_venue)
        return result;

    } catch (error) {
        console.log("Error occurred in createTournament", error);
        throw error;
    }
};

/**
 * Method to update existing Tournament
 * @param {JSON} body 
 * @returns 
 */
const editTournament = async (body) => {
    try {
        let result = null;
        let sports = null;
        let events = null;
        const { event_refid, sports_refid, tournament_startdate, tournament_enddate, tournament_rules = null, event_venue = null, tournament_id } = body;
        let data = await tournamentDao.getById(tournament_id)
        if (data === null) {
            result = { message: "Tournament not exist" };
            return result
        }
        if (sports_refid !== null && sports_refid !== undefined) {
            sports = await sportsDao.getById(sports_refid);
            if (sports === null) {
                result = { message: "Sport Not Exists" }
                return result;
            }
        }

        if (event_refid !== null && event_refid !== undefined) {
            events = await eventsDao.getById(event_refid);
            if (events === null) {
                result = { message: "Event Not Exists" }
                return result;
            }
        }

        result = await tournamentDao.edit(event_refid, sports_refid, tournament_startdate, tournament_enddate, tournament_rules, event_venue, tournament_id)
        return result;

    } catch (error) {
        console.log("Error occurred in editTournament", error);
        throw error;
    }
};

/**
 * Method to get the Tournament based on Tournament Id
 * @param {int} tournament_id 
 */

const fetchTournament = async (tournament_id) => {
    try {
        let tournament = {
            data: null,
        };
        let data = await tournamentDao.getById(tournament_id)
        if (data === null) tournament = { message: "tournament not exist" };
        else tournament["data"] = data;
        return tournament;
    } catch (error) {
        console.log("Error occurred in fetch tournament", error);
        throw error;
    }
};

/**
 *  Method to delete the tournament based on tournament id
 * @param {int} tournament_id 
 */

const deleteTournament = async (tournament_id) => {
    try {
        let tournament = {
            data: null,
        };
        let data = await tournamentDao.deleteById(tournament_id)
        if (data === null) tournament = { message: "tournament not exist" };
        else tournament["data"] = "Success";
        return tournament;
    } catch (error) {
        console.log("Error occurred in delete tournament", error);
        throw error;
    }
};

/**
 *  Method to get all the tournaments
 */

const fetchAll = async () => {
    try {
        return await tournamentDao.getAll();
    } catch (error) {
        console.log("Error occurred in fetchAll: ", error);
        throw error;
    }
};

module.exports = {
    createTournament,
    editTournament,
    fetchTournament,
    deleteTournament,
    fetchAll
};
