const companyDao = require("../dao/company.dao");
const userDao = require("../dao/user.dao");
const feedDao = require("../dao/feeds.dao");
const feedTagDao = require("../dao/feedTag.dao");
const db = require("../utils/db");
const activityLogDao = require("../dao/activityLog.dao");

/**
 *Method to create new feed tag
 * @param {JSon} body
 */
const createFeedTag = async (body) => {
  let result = null;
  try {
    const {
      company_id = null,
      user_id = null,
      feed_id,
      event_id = null,
    } = body;
    let company = null;
    let user = null;
    if (company_id !== null) company = await companyDao.getById(company_id);
    if (user_id !== null) user = await userDao.getById(user_id);

    let feed = await feedDao.getById(feed_id);

    if (user === null && user_id !== null) {
      result = { message: "User not found" };
      return result;
    }
    if (company === null && company_id !== null) {
      result = { message: "company not found" };
      return result;
    }
    if (feed === null) {
      result = { message: "feed not found" };
      return result;
    }
    result = await db
      .tx(async (transaction) => {
        let feedTagAdd = await feedTagDao.add(
          company_id,
          user_id,
          feed_id,
          event_id,
          transaction
        );
        // await activityLogDao.add(
        //   "TAGI",
        //   "TAG",
        //   user_id,
        //   company_id,
        //   feed_id,
        //   null,
        //   "TAG",
        //   null,
        //   transaction
        // );

        await activityLogDao.addActivityLog(
          "FED",
          "TAG",
          company_id,
          null,
          feed_id,
          user_id,
          null
        );

        return feedTagAdd;
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log("failure, ROLLBACK was executed", error);
        throw error;
      });
    return result;
    // }
  } catch (error) {
    console.log("Error occurred in createFeedTag", error);
    throw error;
  }
};

/**
 *Method to update existing feed tag
 * @param {JSon} body
 */
const editFeedTag = async (body) => {
  let result = null;
  try {
    const {
      company_id = null,
      user_id = null,
      feed_id,
      event_id = null,
      feed_tag_id,
    } = body;
    let company = null;
    let user = null;
    let feedTag = null;

    if (company_id !== null) company = await companyDao.getById(company_id);
    if (user_id !== null) user = await userDao.getById(user_id);
    if (feed_tag_id !== null) feedTag = await feedTagDao.getById(feed_tag_id);

    let feed = await feedDao.getById(feed_id);

    if (user === null && user_id !== null) {
      result = { message: "User not found" };
      return result;
    } else if (company === null && company_id !== null) {
      result = { message: "company not found" };
      return result;
    } else if (feedTag === null && feed_tag_id !== null) {
      result = { message: "Feed Tag not found" };
      return result;
    } else if (feed === null) {
      result = { message: "feed not found" };
      return result;
    } else {
      result = await feedTagDao.edit(
        company_id,
        user_id,
        feed_id,
        event_id,
        feed_tag_id
      );
      return result;
    }
  } catch (error) {
    console.log("Error occurred in editFeedTag", error);
    throw error;
  }
};

/**
 * Method to get feed tag based on feed tag id
 * @param {int} feed_tag_id
 */
const fetchFeedTag = async (feed_tag_id) => {
  try {
    let result = {};
    let data = await feedTagDao.getById(feed_tag_id);
    if (data === null) result = { message: "Feed Tag not exist" };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetchFeedTag", error);
    throw error;
  }
};

/**
 * Method to get all feed tags
 */
const fetchAll = async () => {
  try {
    let data = await feedTagDao.getAll();
    return data;
  } catch (error) {
    console.log("Error occurred in fetchAll", error);
    throw error;
  }
};

/**
 * Method to delete feed tag based on feed tag id
 * @param {int} feed_tag_id
 */
const deleteFeedTag = async (feed_tag_id) => {
  try {
    let result = {};
    let data = await feedTagDao.deleteById(feed_tag_id);
    if (data === null) result = { message: "feedTag not exist" };
    else result["data"] = "Success";
    return result;
  } catch (error) {
    console.log("Error occurred in deleteFeedTag", error);
    throw error;
  }
};

module.exports = {
  createFeedTag,
  editFeedTag,
  fetchFeedTag,
  deleteFeedTag,
  fetchAll,
};
