const commentTagDao = require("../dao/commentTag.dao");
const companyDao = require("../dao/company.dao");
const userDao = require("../dao/user.dao");
const db = require("../utils/db");
const activityLogDao = require("../dao/activityLog.dao");

/**
 *Method to create new createComment Tag
 * @param {JSon} body
 */
const createCommentTag = async (body) => {
  let result = null;
  try {
    const {
      feed_id,
      user_id = null,
      company_id = null,
      comment_id,
      event_id,
    } = body;
    let company = null;
    company = await companyDao.getById(company_id);
    let user = null;
    user = await userDao.getById(user_id);
    result = await db
      .tx(async (transaction) => {
        //   if (user_id && user === null) {
        //     result = { message: "User not found" };
        //     return result;
        //   } else if (company === null && company_id) {
        //     result = { message: "company not found" };
        //     return result;
        //   } else {
        let commentTagAdd = await commentTagDao.add(
          feed_id,
          user_id,
          company_id,
          comment_id,
          event_id,
          transaction
        );
        // await activityLogDao.add(
        //   "TAGI",
        //   "COMMENT-TAG",
        //   user_id,
        //   company_id,
        //   feed_id,
        //   null,
        //   "CTG",
        //   event_id,
        //   transaction
        // );

        await activityLogDao.addActivityLog(
          "FED",
          "TAG",
          company_id,
          event_id,
          feed_id,
          user_id,
          null
        );

        return commentTagAdd;
        //   }
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log("failure, ROLLBACK was executed", error);
        throw error;
      });
    return result;
  } catch (error) {
    console.log("Error occurred in addCommentTag", error);
    throw error;
  }
};

/**
 *Method to update existing comment Tag
 * @param {JSon} body
 */
const editCommentTag = async (body) => {
  let result = null;
  try {
    const {
      feed_id,
      user_id = null,
      company_id = null,
      comment_id,
      event_id,
      comment_tag_id,
    } = body;
    let company = await companyDao.getById(company_id);
    let user = null;
    let CommentTag = null;
    user = await userDao.getById(user_id);

    if (comment_id !== null)
      CommentTag = await commentTagDao.getById(comment_tag_id);

    if (CommentTag === null && comment_id !== null) {
      result = { message: "comment tag not exist" };
      return result;
    } else if (user === null && user_id !== null) {
      result = { message: "User not found" };
      return result;
    } else if (company === null && company_id !== null) {
      result = { message: "company not found" };
      return result;
    } else {
      result = await commentTagDao.edit(
        feed_id,
        user_id,
        company_id,
        comment_id,
        event_id,
        comment_tag_id
      );
      return result;
    }
  } catch (error) {
    console.log("Error occurred in editCommentTag", error);
    throw error;
  }
};

/**
 * Method to get comment tag based on comment tag id
 * @param {int} comment_tag_id
 */
const fetchCommentTag = async (comment_tag_id) => {
  try {
    let result = {};
    let data = await commentTagDao.getById(comment_tag_id);
    if (data === null) result = { message: "comment tag not exist" };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetchCommentTag", error);
    throw error;
  }
};

/**
 * Method to get all comment info
 */
const fetchAll = async () => {
  try {
    let data = await commentTagDao.getAll();
    return data;
  } catch (error) {
    console.log("Error occurred in fetchCommentTag", error);
    throw error;
  }
};

/**
 * Method to delete comment info based on comment id
 * @param {int} comment_tag_id
 */
const deleteCommentTag = async (comment_tag_id) => {
  try {
    let result = {};
    let data = await commentTagDao.deleteById(comment_tag_id);
    if (data === null) result = { message: "comment tag not exist" };
    else result["data"] = "Successfully Deleted!";
    return result;
  } catch (error) {
    console.log("Error occurred in deleteCommentTag", error);
    throw error;
  }
};

module.exports = {
  createCommentTag,
  editCommentTag,
  fetchCommentTag,
  deleteCommentTag,
  fetchAll,
};
