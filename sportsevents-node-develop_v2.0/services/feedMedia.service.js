const feedMediaDao = require('../dao/feedMedia.dao')

/**
 *Method to create feed Media
 * @param {JSON} body 
 */
const createFeedMedia = async (body) => {
    let result = null;
    try {
        const { media_id, feed_id } = body
        let { count } = await feedMediaDao.checkDuplicate(media_id, feed_id);
        /* Check Duplicate Media Id */
        if (Number(count) === 0) {
            result = await feedMediaDao.add(media_id, feed_id);
            return result;
        }
        else {
            result = { message: "feed and media combination already exist" }
            return result;
        }
    } catch (error) {
        console.log("Error occurred in create Feed Media", error)
        throw error;
    }
}

/**
 *Method to update feed Media
 * @param {JSON} body 
 */
const editFeedMedia = async (body, connectionObj = null) => {
    let result = null;
    try {
        const { feed_media_id, media_id, feed_id } = body
        let feedMedia = await feedMediaDao.getById(feed_media_id);

        if (feedMedia === null && feed_media_id !== null) {
            result = { message: "feedMedia not exist" }
            return result;
        }
        else{
            result = await feedMediaDao.edit(media_id, feed_id, feed_media_id, connectionObj);
            return result;
        }
    } catch (error) {
        console.log("Error occurred in edit Feed Media", error)
        throw error;
    }
}

/**
 * Method to get feed media based on feed media id
 * @param {uuid} feed_media_id 
 */
const fetchFeedMedia = async (feed_media_id) => {
    try {
        let feedMedia = {};
        let data = await feedMediaDao.getById(feed_media_id);
        if (data === null)
            feedMedia = { message: "feedMedia not exist" }
        else
            feedMedia["data"] = data;
        return feedMedia;
    } catch (error) {
        console.log("Error occurred in fetch feedMedia By Id", error)
        throw error;
    }
}

/**
 * Method to get all feed Medias
 */
const fetchAllFeedMedia = async () => {
    try {
        let feedMedia = null;
        let data = await feedMediaDao.getAll();
        feedMedia = data;
        return feedMedia;
    }
    catch (error) {
        console.log("Error occurred in fetchAll feedMedias", error)
        throw error;
    }
}

/**
 * Method to delete feedMedia based on feed_media_id 
 * @param {uuid} feed_media_id 
 */
const deleteFeedMedia = async (feed_media_id) => {
    try {
        let feedMedia = {};
        let data = await feedMediaDao.deleteById(feed_media_id);
        if (data === null)
            feedMedia = { message: "feedMedia not exist" }
        else
            feedMedia["data"] = "Success";
        return feedMedia;
    } catch (error) {
        console.log("Error occurred in delete feedMedia", error)
        throw error;
    }
}

/**
 * Method to delete feedMedia based on feed_id 
 * @param {uuid} feed_id 
 */
const deleteFeedMediaByFeedId = async (feed_id) => {
    try {
        let feedMedia = {};
        let data = await feedMediaDao.deleteFeedMediaByFeedId(feed_id);
        if (data.length > 0)
            feedMedia["data"] = "Success";
        else
            feedMedia = { message: "feedMedia not exist for the given feed_id" }
        return feedMedia;
    } catch (error) {
        console.log("Error occurred in delete feedMedia", error)
        throw error;
    }
}
module.exports = {
    createFeedMedia,
    editFeedMedia,
    fetchFeedMedia,
    fetchAllFeedMedia,
    deleteFeedMedia,
    deleteFeedMediaByFeedId
}
