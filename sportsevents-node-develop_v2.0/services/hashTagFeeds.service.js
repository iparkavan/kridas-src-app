const hashTagFeedsDao = require("../dao/hashTagFeeds.dao")
const FeedIdDao = require("../dao/feeds.dao");
const hashTagDao = require("../dao/hashtags.dao");

/**
 *Method to create new hashtag_feeds 
 */
const createHashTagFeeds = async (body) => {
    let result = null;
    try {
        const { hashtag_id, feed_id } = body
        let feedsValue = null;
        let hashValue = null;

        if (feed_id !== null) {
            feedsValue = await FeedIdDao.getById(feed_id)
            if (feedsValue === null) {
                result = { message: "feed_id not available" }
                return result;
            }
        }

        if (hashtag_id !== null) {
            hashValue = await hashTagDao.getById(hashtag_id)
            if (hashValue === null) {
                result = { message: "hashtag_id not available" }
                return result;
            }
        }
        let { count } = await hashTagFeedsDao.duplicateFeedId(feed_id, hashtag_id)

        // check the duplicate 
        if (Number(count) === 0) {
            result = await hashTagFeedsDao.add(hashtag_id, feed_id)
            return result

        } else {
            result = { message: "feed_id and hashtag_id name already exist" }
            return result;
        }
    } catch (error) {
        console.log("Error occurred in create HashTagFeeds", error);
        throw error;
    }
}

/**
 * Method to get all hashtag_feeds  
 */
const fetchAll = async () => {
    try {
        let data = await hashTagFeedsDao.getAll();
        return data;
    } catch (error) {
        console.log("Error occurred in fetchAll", error);
        throw error;
    }
};

/**
 * Method to get feed tag based on  feed_tag_id
 * @param {int} feed_tag_id
 */

const fetchHashTag = async (hashtag_feeds_id) => {
    try {
        let result = {};
        let data = await hashTagFeedsDao.getById(hashtag_feeds_id);
        if (data === null)
            result = { message: "hash_feed_tag not exist" }
        else
            result["data"] = data;
        return result;
    } catch (error) {
        console.log("Error occurred in HashFeedTag", error);
        throw error;
    }
};

/**
 * Method to delete feed tag based on  feed_tag_id
 * @param {int} hashtag_feeds_id 
 */
const deleteHashTagFeeds = async (hashtag_feeds_id) => {
    try {
        let result = {};
        let data = await hashTagFeedsDao.deleteById(hashtag_feeds_id)
        if (data === null)
            result = { message: "hash_tag_feeds not exist" }
        else
            result["data"] = "Success";
        return result;
    } catch (error) {
        console.log("Error occurred in delete HashTagFeeds", error);
        throw error;
    }
};

/**
 * Method to update the hashtag_feeds 

 */
const editHashTagFeeds = async (body) => {
    try {
        let result = null;
        const { hashtag_id, feed_id, hashtag_feeds_id, } = body

        let hashTagFeeds = null;
        hashTagFeeds = await hashTagFeedsDao.getById(hashtag_feeds_id)
        if (!(hashTagFeeds?.message === undefined && hashTagFeeds !== null)) {
            result = { message: "hashtag_feeds_id  not available" }
            return result;
        }
        result = await hashTagFeedsDao.edit(hashtag_id, feed_id, hashtag_feeds_id,)
        return result;

    } catch (error) {
        console.log("Error occurred in edit HashtagFeeds", error);
        throw error;
    }
}

module.exports = {
    createHashTagFeeds,
    fetchAll,
    fetchHashTag,
    deleteHashTagFeeds,
    editHashTagFeeds,
}