const db = require('../utils/db');

const add = async (hashtag_id, feed_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `INSERT INTO hashtag_feeds ( hashtag_id , feed_id) VALUES ($1,$2) RETURNING *`
        result = await transaction.one(query, [hashtag_id, feed_id]);
        return result;
    }
    catch (error) {
        console.log("Error occurred in HashTagFeedsDao add", error)
        throw error;
    }
}

const getAll = async (connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from hashtag_feeds '
        result = await transaction.manyOrNone(query, [])
        return result;
    }
    catch (error) {
        console.log("Error occurred in hashtag_feeds  dao getAll", error)
        throw error;
    }
}

const getById = async (hashtag_feeds_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from hashtag_feeds where hashtag_feeds_id = $1'
        result = await transaction.oneOrNone(query, [hashtag_feeds_id])
        return result;
    }
    catch (error) {
        throw error;
    }
}

const deleteById = async (hashtag_feeds_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'delete from hashtag_feeds where hashtag_feeds_id = $1 RETURNING *'
        result = await transaction.oneOrNone(query, [hashtag_feeds_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in hashtagfeeds dao deleteById", error)
        throw error;
    }
}

const edit = async (hashtag_id, feed_id, hashtag_feeds_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `update hashtag_feeds set hashtag_id = $1 , feed_id=$2 where hashtag_feeds_id = $3 RETURNING * `
        result = await transaction.one(query, [hashtag_id, feed_id, hashtag_feeds_id]);
        return result;
    }
    catch (error) {
        console.log("Error occurred in HashTagFeedsDao Edit", error)
        throw error;
    }
}

const duplicateFeedId = async (feed_id, hashtag_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select count(*) from hashtag_feeds where feed_id = $1 and hashtag_id = $2'
        result = await transaction.oneOrNone(query, [feed_id, hashtag_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in hashTagFeedsDao checkDuplicate fetchFeedId", error)
        throw error;

    }

}

const deleteByFeedId = async (feed_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'delete from hashtag_feeds where feed_id = $1 RETURNING *'
        result = await transaction.manyOrNone(query, [feed_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in hashtagfeeds dao deleteByFeedId", error)
        throw error;
    }
}

module.exports = {
    add,
    edit,
    getAll,
    getById,
    deleteById,
    duplicateFeedId,
    deleteByFeedId
}