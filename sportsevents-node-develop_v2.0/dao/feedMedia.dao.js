const db = require('../utils/db');

const add = async (media_id, feed_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `INSERT INTO feed_media (media_id,feed_id) VALUES ($1,$2) RETURNING *`

        result = await transaction.one(query, [media_id, feed_id]);
        return result;
    }
    catch (error) {
        console.log("Error occurred in feed_Media Dao add", error)
        throw error;
    }
}

const edit = async (media_id, feed_id, feed_media_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `UPDATE feed_media SET media_id=$1, feed_id=$2 WHERE feed_media_id=$3 RETURNING *`
        result = await transaction.one(query, [media_id, feed_id, feed_media_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in feedMedia Dao update", error)
        throw error;
    }
}

const getById = async (feed_media_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from feed_media where feed_media_id = $1'
        result = await transaction.oneOrNone(query, [feed_media_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in feedMedia Dao getById", error)
        throw error;
    }
}

const getAll = async (connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from feed_media'
        result = await transaction.manyOrNone(query, [])
        return result;
    }
    catch (error) {
        console.log("Error occurred in feedMediaDao getAll", error)
        throw error;
    }
}

const checkDuplicate = async (media_id, feed_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select count(*) from feed_media where media_id = $1 and feed_id=$2'
        result = await transaction.oneOrNone(query, [media_id, feed_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in FeedMediaDao checkDuplicate", error)
        throw error;
    }
}

const deleteById = async (feed_media_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'delete from feed_media where feed_media_id = $1 RETURNING *'
        result = await transaction.oneOrNone(query, [feed_media_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in feedMediaDao deleteById", error)
        throw error;
    }
}

const deleteFeedMediaByFeedId = async (feed_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'delete from feed_media where feed_id = $1 RETURNING *'
        result = await transaction.manyOrNone(query, [feed_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in feedMediaDao deleteById", error)
        throw error;
    }
}

module.exports = {
    add,
    edit,
    getById,
    getAll,
    checkDuplicate,
    deleteById,
    deleteFeedMediaByFeedId
}