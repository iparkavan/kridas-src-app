const db = require("../utils/db");
const feedShare = require("../dao/feedShare.dao");

// const CreateFeedShare = async (body) => {
//     let result = null;
//     const { ed, fdd } = body
//     result = await db.tx(async (transaction) => {

//         let feedResponse = await (, transaction);
//     }
//     )
// }

/**
 * Method to create Share
 * @param {JSON} body
 * @returns
 */
const createShare = async (body) => {
  let result = null;
  try {
    const {
      share_creator_user_id = null,
      share_creator_company_id = null,
      shared_feed_id,
      feed_id,
      share_creator_event_id = null,
    } = body;
    result = await db
      .tx(async (transaction) => {
        let feedShareAdd = await feedShare.add(
          share_creator_user_id,
          share_creator_company_id,
          shared_feed_id,
          feed_id,
          share_creator_event_id
        );
        return feedShareAdd;
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
    console.log("Error occurred in createFeedShare", error);
    throw error;
  }
};

/**
 * Method to fetch all the feet share
 * @returns array of data
 */
const fetchAll = async () => {
  try {
    let data = await feedShare.getAll();
    return data;
  } catch (error) {
    console.log("Error occurred in fetchAll", error);
    throw error;
  }
};

/**
 *
 * @param {int8} feed_share_id
 * @returns
 */
const deleteFeedShare = async (feed_share_id) => {
  try {
    let share = {
      data: null,
    };
    let data = await feedShare.deleteById(feed_share_id);
    if (data === null) share = { message: "feedShare not exist" };
    else share["data"] = "Success";
    return share;
  } catch (error) {
    console.log("Error occurred in delete deleteFeedShare", error);
    throw error;
  }
};

module.exports = {
  createShare,
  fetchAll,
  deleteFeedShare,
};
