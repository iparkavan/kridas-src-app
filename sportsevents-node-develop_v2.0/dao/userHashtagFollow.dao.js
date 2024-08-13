const db = require('../utils/db');

const add = async (user_id, hashtag_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let currentDate = new Date();
        let query = 'INSERT INTO user_hashtag_follow (user_id,hashtag_id,created_date) VALUES ($1, $2,$3) RETURNING *'
        result = await transaction.one(query, [user_id, hashtag_id, currentDate]);
        return result;
    }
    catch (error) {
        console.log("Error occurred in userHashtagFollowDao add", error)
        throw error;
    }
}

const getByUserId = async (user_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from user_hashtag_follow where user_id = $1'
        result = await transaction.manyOrNone(query, [user_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in userHashtagFollowDao getByUserId", error)
        throw error;
    }
}


const getByUserHashtag = async (user_id, hashtag_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select count(*) from user_hashtag_follow where user_id = $1 and hashtag_id =$2'
        result = await transaction.oneOrNone(query, [user_id, hashtag_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in userHashtagFollowDao getByUserId", error)
        throw error;
    }
}

const deleteById = async (user_hashtag_follow_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'delete from user_hashtag_follow where user_hashtag_follow_id = $1 RETURNING *'
        result = await transaction.oneOrNone(query, [user_hashtag_follow_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in userHashtagFollowDao deleteById", error)
        throw error;
    }
}



module.exports = {
    add,
    getByUserId,
    deleteById,
    getByUserHashtag
}