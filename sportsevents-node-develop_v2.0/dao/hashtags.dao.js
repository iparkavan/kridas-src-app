const db = require('../utils/db');

const add = async (hashtag_title, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let currentDate = new Date();
        let query = `INSERT INTO hashtags (hashtag_title,created_date) 
        values ($1,$2) RETURNING *`
        result = await transaction.one(query, [
            hashtag_title,
            currentDate]);
        return result;
    }
    catch (error) {
        console.log("Error occurred in hashtagdao add", error)
        throw error;
    }
}

const getAll = async (connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from hashtags'
        result = await transaction.manyOrNone(query, [])
        return result;
    }
    catch (error) {
        console.log("Error occurred in hashtags getAll", error)
        throw error;
    }
}

const getById = async (hashtag_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from hashtags where hashtag_id = $1'
        result = await transaction.oneOrNone(query, [hashtag_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in hashtags getById", error)
        throw error;
    }
}


const getByTitle = async (hashtag_title, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `select * from hashtags where hashtag_title ilike '${hashtag_title}%'`
        result = await transaction.manyOrNone(query, [])
        return result;
    }
    catch (error) {
        console.log("Error occurred in hashtagsDao getByTitle", error)
        throw error;
    }
}

const getByExactTitle = async (hashtag_title, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `select * from hashtags where lower(hashtag_title)=lower($1)`
        result = await transaction.oneOrNone(query, [hashtag_title])
        return result;
    }
    catch (error) {
        console.log("Error occurred in hashtagsDao getByTitle", error)
        throw error;
    }
}

const edit = async (
    hashtag_title,
    hashtag_id,
    connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `update hashtags set hashtag_title=$1 where hashtag_id=$2 RETURNING *`;
        result = await transaction.one(query, [
            hashtag_title,
            hashtag_id
        ])
        return result;
    }
    catch (error) {
        console.log("Error occurred in hashtagDao edit", error)
        throw error;
    }
}

const deleteById = async (hashtag_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'delete from hashtags where hashtag_id = $1 RETURNING *'
        result = await transaction.oneOrNone(query, [hashtag_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in hashtagDao deleteById", error)
        throw error;
    }
}

const checkDuplicate = async (hashtag_title, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select count(*) from hashtags where hashtag_title = $1'
        result = await transaction.oneOrNone(query, [hashtag_title])
        return result;
    }
    catch (error) {
        console.log("Error occurred in hashtagDao checkDuplicate", error)
        throw error;
    }
}


module.exports = {
    add,
    getAll,
    getById,
    edit,
    deleteById,
    checkDuplicate,
    getByTitle,
    getByExactTitle
}