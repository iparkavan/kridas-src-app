const db = require('../utils/db');
const { v4: uuidv4 } = require("uuid");

const add = async (event_refid, tournament_refid, organizer_refid, organizer_role, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `INSERT INTO event_organizer (event_refid, tournament_refid, organizer_refid,organizer_role ) VALUES ($1,$2,$3,$4) RETURNING *`
        result = await transaction.one(query, [event_refid, tournament_refid, organizer_refid, organizer_role]);
        return result;
    }
    catch (error) {
        console.log("Error occurred in event master add", error)
        throw error;
    }
}

const edit = async (event_refid, tournament_refid, organizer_refid, organizer_role, event_organizer_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `update event_organizer set event_refid = $1, tournament_refid=$2, organizer_refid=$3, organizer_role = $4 where event_organizer_id =$5 RETURNING *`
        result = await transaction.one(query, [event_refid, tournament_refid, organizer_refid, organizer_role, event_organizer_id]);
        return result;
    }
    catch (error) {
        console.log("Error occurred in event master add", error)
        throw error;
    }
}

const getById = async (event_organizer_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from event_organizer where event_organizer_id = $1'
        result = await transaction.oneOrNone(query, [event_organizer_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in event_organizer getById", error)
        throw error;
    }
}

const getAll = async (connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `select * from event_organizer`;

        result = await transaction.manyOrNone(query, [])
        return result;
    }
    catch (error) {
        console.log("Error occurred in event_organizer getAll", error)
        throw error;
    }
}

const deleteById = async (event_organizer_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'delete from event_organizer where event_organizer_id = $1 RETURNING *'
        result = await transaction.oneOrNone(query, [event_organizer_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in events_master deleteById", error)
        throw error;
    }
}


const deleteByEventId = async (event_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'delete from event_organizer eo where eo.event_refid =$1 RETURNING *'
        result = await transaction.manyOrNone(query, [event_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in events_master deleteById", error)
        throw error;
    }
}

const getByEventIdAndOrgannizerId = async (event_id, organizer_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from event_organizer eo where eo.event_refid = $1 and eo.organizer_refid =$2'
        result = await transaction.oneOrNone(query, [event_id, organizer_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in event_organizer getById", error)
        throw error;
    }
}

module.exports = {
    add,
    edit,
    getById,
    getAll,
    deleteById,
    deleteByEventId,
    getByEventIdAndOrgannizerId
}
