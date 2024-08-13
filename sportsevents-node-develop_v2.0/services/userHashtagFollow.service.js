const userHashtagFollowDao = require('../dao/userHashtagFollow.dao')

/*
 * Method to create new user_hashtag_follow
 * @param {Json} body 
 */
const createuserHashtagFollow = async (body) => {
    try {
        let result = null;
        const { user_id, hashtag_id } = body;
        let userHashtag = await userHashtagFollowDao.getByUserHashtag(user_id, hashtag_id)
        if (userHashtag.count > 0) {
            return result = { message: "user and hashTag combination already exist" }
        }
        result = await userHashtagFollowDao.add(user_id, hashtag_id)
        return result;

    } catch (error) {
        console.log("Error occurred in createuserHashtagFollow", error);
        throw error;
    }
};

/**
 * Method to get user_hashtag_follow based on user id 
 * @param {uuid} user_id 
 */
const getByUserId = async (user_id) => {
    try {
        let userHashtagFollow = { data: null };
        let data = await userHashtagFollowDao.getByUserId(user_id);
        if (data.length === 0)
            userHashtagFollow = { message: "userHashtagDao not exist" }
        else
            userHashtagFollow["data"] = data;
        return userHashtagFollow;
    } catch (error) {
        console.log("Error occurred in fetch userHashtagFollow", error)
        throw error;
    }
}

/**
 * Method to delete user_hashtag_follow based on user_hashtag_follow_id
 * @param {int} user_hashtag_follow_id 
 */
const deleteById = async (user_hashtag_follow_id) => {
    try {
        let userHashtagFollow = {
            data: null,
        };
        let data = await userHashtagFollowDao.deleteById(user_hashtag_follow_id)
        if (data === null) userHashtagFollow = { message: "userHashtagFollow not exist" };
        else userHashtagFollow["data"] = "Success";
        return userHashtagFollow;
    } catch (error) {
        console.log("Error occurred in delete event", error);
        throw error;
    }
};

module.exports = {
    createuserHashtagFollow,
    getByUserId,
    deleteById,

};