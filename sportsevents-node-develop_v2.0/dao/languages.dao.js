const db = require('../utils/db');

const add = async ( language_code,language_name ,created_by, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let currentDate = new Date();
        let query = `INSERT INTO languages (language_code, language_name, created_by, created_date, updated_date) values ($1,$2,$3,$4,$5) RETURNING * `
        result = await transaction.one(query, [language_code, language_name, created_by, currentDate, currentDate]);
        return result;
    }
    catch (error) {
        console.log("Error occurred in languagesDao add", error);
        throw error;
    }
}

const getAll = async (connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = ` select * from languages  `
        result = await transaction.manyOrNone(query, [])
        return result;
    }
    catch (error) {
        console.log("Error occurred in languagesDao getAll", error);
        throw error;
    }
}

const edit = async (language_code,language_name ,updated_by, language_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let currentDate = new Date();
        let query = ` update languages set language_code = $1, language_name = $2, updated_by = $3, updated_date = $4  where language_id= $5 RETURNING * `
        result = await transaction.one(query, [language_code, language_name, updated_by, currentDate, language_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in languagesDao edit", error)
        throw error;
    }
}

const deleteById = async (language_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'delete from languages where language_id = $1 RETURNING *'
        result = await transaction.oneOrNone(query, [language_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in languagesDao deleteById", error)
        throw error;
    }
}

const fetchById = async (language_id,connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = ` select * from languages where language_id =$1 `
        result = await transaction.oneOrNone(query, [language_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in languagesDao fetchById", error)
        throw error;
    }
}

module.exports = {
    add,
    getAll,
    deleteById,
    edit,
    fetchById
}