const eventOrganizerDao = require('../dao/eventOrganizer.dao')
const eventDao = require('../dao/events.dao')
const tournamentDao = require('../dao/tournaments.dao')
const organizerDao = require('../dao/organizer.dao')

/*
 * Method to create new createEventOrganizer
 * @param {Json} body 
 */
const createEventOrganizer = async (body) => {
    try {
        let result = null;
        const { event_refid = null, tournament_refid = null, organizer_refid, organizer_role } =
            body;
        let event = await eventDao.getById(event_refid)
        if (event === null && event_refid !== null) {
            result = { message: "event not exist" };
            return result
        }
        let tournament = await tournamentDao.getById(tournament_refid)
        if (tournament === null && tournament_refid !== null) {
            result = { message: "tournament not exist" };
            return result
        }
        let organizer = await organizerDao.getById(organizer_refid)
        if (organizer === null) {
            result = { message: "organizer not exist" };
            return result
        }
        result = await eventOrganizerDao.add(event_refid, tournament_refid, organizer_refid, organizer_role)
        return result;
    } catch (error) {
        console.log("Error occurred in createEventOrganizer", error);
        throw error;
    }
};

/**
 *Method to update existing event organizer
 * @param {JSon} body 
 */
const editEventOrganizer = async (body) => {
    let result = null;
    try {
        const { event_refid = null, tournament_refid = null, organizer_refid, organizer_role, event_organizer_id } = body
        let eventOrganizer = await eventOrganizerDao.getById(event_organizer_id)
        if (eventOrganizer === null) {
            result = { message: "event_organizer not exist" };
            return result
        }
        let event = await eventDao.getById(event_refid)
        if (event === null && event_refid !== null) {
            result = { message: "event not exist" };
            return result
        }
        let tournament = await tournamentDao.getById(tournament_refid)
        if (tournament === null && tournament_refid !== null) {
            result = { message: "tournament not exist" };
            return result
        }
        let organizer = await organizerDao.getById(organizer_refid)
        if (organizer === null) {
            result = { message: "organizer not exist" };
            return result
        }
        result = await eventOrganizerDao.edit(event_refid, tournament_refid, organizer_refid, organizer_role, event_organizer_id);
        return result;
    } catch (error) {
        console.log("Error occurred in editEventOrganizer", error);
        throw error;
    }
}

/**
 * Method to get event_organizer based on event_organizer_id
 * @param {int4} event_organizer_id 
 */
const fetchById = async (event_organizer_id) => {
    try {
        let result = {};
        let data = await eventOrganizerDao.getById(event_organizer_id);
        if (data === null)
            result = { message: " event_organizer not exist" }
        else
            result["data"] = data;
        return result;
    } catch (error) {
        console.log("Error occurred in fetcheventorganizer", error);
        throw error;
    }
};

/**
 * Method to get all event organizer  
 */
const fetchAll = async () => {
    try {
        let data = await eventOrganizerDao.getAll();
        return data;
    } catch (error) {
        console.log("Error occurred in fetch event organizer", error);
        throw error;
    }
};

/**
 * Method to delete EventOrganizer based on deleteEventOrganizer
 * @param {int4}  event_organizer_id
 */
const deleteEventOrganizer = async (event_organizer_id) => {
    try {
        let result = {};
        let data = await eventOrganizerDao.deleteById(event_organizer_id)
        if (data === null)
            result = { message: "event_organizer not exist" }
        else
            result["data"] = "Success";
        return result;
    } catch (error) {
        console.log("Error occurred in event_organizer", error);
        throw error;
    }
};

module.exports = {
    createEventOrganizer,
    editEventOrganizer,
    fetchById,
    fetchAll,
    deleteEventOrganizer
};