const sportsHashtagDao = require('../dao/sportsHashtag.dao');
const hashtagDao = require('../dao/hashtags.dao')

/**
 *Method to create SportHashtag
 * @param {JSon} body 
 */
const createSportHashtag = async (body) => {
    try {
        let result = null;
        const { sports_id, hashtag_title } = body
        let hashTag = await hashtagDao.getByExactTitle(hashtag_title)
        if (hashTag === null) {
            let newHashTag = await hashtagDao.add(hashtag_title)
            let sportHashtag = await sportsHashtagDao.getSportHashtagCount(sports_id, newHashTag.hashtag_id)
            if (sportHashtag.count === '0') {
                result = await sportsHashtagDao.add(sports_id, newHashTag.hashtag_id)
            }
            else {
                result = { message: "This SportId and HashtagId Combination already exists" }
            }
        } else {
            let sportHashtag = await sportsHashtagDao.getSportHashtagCount(sports_id, hashTag.hashtag_id)
            if (sportHashtag.count === '0') {
                result = await sportsHashtagDao.add(sports_id, hashTag.hashtag_id)
            }
            else {
                result = { message: "This SportId and HashtagId Combination already exists" }
            }
        }
        return result;
    } catch (error) {
        console.log("Error occurred in createSportHashtag", error)
        throw error;
    }
}

/**
 * Method to get SportHashtag based on sport hashtag id 
 * @param {int} sports_hashtag_id 
 */
const fetchSportHashtag = async (sports_hashtag_id) => {
    try {
        let sport = {};
        let data = await sportsHashtagDao.getById(sports_hashtag_id);
        if (data === null)
            sport = { message: "sports Hashtag not exist" }
        else
            sport["data"] = data;
        return sport;
    } catch (error) {
        console.log("Error occurred in fetch sports Hashtag", error)
        throw error;
    }
}

/**
 * Method to Get SportsHashtag based on sport id
 * @param {integer} sports_id 
 * @returns 
 */
const fetchBySportId = async (sports_id) => {
    try {
        let sport = {};
        let data = await sportsHashtagDao.getBySportId(sports_id);
        if (data.length === 0)
            sport = { message: "sports not exist" }
        else
            sport["data"] = data;
        return sport;
    } catch (error) {
        console.log("Error occurred in fetchBySportId", error)
        throw error;
    }
}

/**
 * Method to Get SportsHashtag based on hashtag id
 * @param {integer} hashtag_id 
 * @returns 
 */
const fetchByHashtagId = async (hashtag_id) => {
    try {
        let sport = {};
        let data = await sportsHashtagDao.getByHashtagId(hashtag_id);
        if (data.length === 0)
            sport = { message: "Hashtag not exist" }
        else
            sport["data"] = data;
        return sport;
    } catch (error) {
        console.log("Error occurred in fetchByHashtagId", error)
        throw error;
    }
}

/**
 * Method to get all SportHashtag
 */
const fetchAllSportHashtag = async () => {
    try {
        let sport = null;
        let data = await sportsHashtagDao.getAll();
        sport = data;
        return sport;
    }
    catch (error) {
        console.log("Error occurred in fetchAll sport hashtag", error)
        throw error;
    }
}

/**
 * Method to delete SportsHashtag based on Sports Hashtag id 
 * @param {int} sports_hashtag_id 
 */
const deleteSportHashtag = async (sports_hashtag_id) => {
    try {
        let sport = {};
        let data = await sportsHashtagDao.deleteById(sports_hashtag_id);
        if (data === null)
            sport = { message: "Sports Hashtag not exist" }
        else
            sport = { message: "Deleted Successfully" }
        return sport;
    } catch (error) {
        console.log("Error occurred in fetch sport", error)
        throw error;
    }
}

module.exports = {
    createSportHashtag,
    fetchSportHashtag,
    fetchBySportId,
    fetchByHashtagId,
    fetchAllSportHashtag,
    deleteSportHashtag,
};