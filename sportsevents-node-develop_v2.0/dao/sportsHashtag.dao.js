const db = require('../utils/db');

const add = async (sports_id, hashtag_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let currentDate = new Date();
        let query = `INSERT INTO sports_hashtag (sports_id,hashtag_id,created_date) 
        values ($1,$2,$3) RETURNING *`
        result = await transaction.one(query, [sports_id, hashtag_id, currentDate]);
        return result;
    }
    catch (error) {
        console.log("Error occurred in sports_hashtag add", error)
        throw error;
    }
}

const getById = async (sports_hashtag_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from sports_hashtag where sports_hashtag_id = $1'
        result = await transaction.oneOrNone(query, [sports_hashtag_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in sports_hashtag getById", error)
        throw error;
    }
}

const getBySportId = async (sports_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `select * from sports_hashtag where sports_id=$1`
        result = await transaction.manyOrNone(query, [sports_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in sports_hashtag getBySportId", error)
        throw error;
    }
}

const getByHashtagId = async (hashtag_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `select * from sports_hashtag where hashtag_id=$1`
        result = await transaction.manyOrNone(query, [hashtag_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in sports_hashtag getByHashtagId", error)
        throw error;
    }
}

const getSportHashtagCount = async (sports_hashtag_id, hashtag_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select count(*) from sports_hashtag where sports_id = $1 and hashtag_id=$2'
        result = await transaction.oneOrNone(query, [sports_hashtag_id, hashtag_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in sports_hashtag getById", error)
        throw error;
    }
}

const getAll = async (connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from sports_hashtag '
        result = await transaction.manyOrNone(query, [])
        return result;
    }
    catch (error) {
        console.log("Error occurred in sports_hashtag getAll", error)
        throw error;
    }
}

const deleteById = async (sports_hashtag_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'delete from sports_hashtag where sports_hashtag_id = $1 RETURNING *'
        result = await transaction.oneOrNone(query, [sports_hashtag_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in sports_hashtag deleteById", error)
        throw error;
    }
}

module.exports = {
    add,
    getById,
    getBySportId,
    getByHashtagId,
    getAll,
    deleteById,
    getSportHashtagCount
}