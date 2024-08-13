const likeDao = require("../dao/like.dao");
const companyDao = require("../dao/company.dao");
const userDao = require("../dao/user.dao");
const feedDao = require("../dao/feeds.dao");
const commentDao = require("../dao/commentInfo.dao");
const db = require("../utils/db");
const activityLogDao = require("../dao/activityLog.dao");
const customQueryExecutor = require("../dao/common/utils.dao");
const notificationDao = require("../dao/notification.dao");

/**
 *Method to create new like and Update Like Count In Feeds
 * @param {JSon} body
 */
const createLike = async (body) => {
  let result = null;
  const like = body;
  let socket_request = body?.socket_request;
  result = await db
    .tx(async (transaction) => {
      let feed_id = like?.feed_id;
      let user_id = like?.user_id;
      let company_id = like?.company_id;
      let eventName = await feedDao.getEventNameByFeedId(feed_id, transaction);
      let likeResponse = await createLikes(like, transaction);

      let feedDetails = await feedDao.getById(feed_id, transaction);

      if (
        likeResponse.message === undefined &&
        likeResponse.comment_id === null
      ) {
        let like_count = null;
        like_count = await likeDao.getLikeCount(like.feed_id, transaction);
        if (like_count.likes > 0) {
          db_like_count = await feedDao.editLikeCount(
            like.feed_id,
            like_count.likes,
            transaction
          );
        }
        likeResponse["likeCount"] = like_count.likes;

        if (likeResponse?.message === undefined) {
          /*        if (likeResponse.like_type !== "like") { */
          if (eventName?.event_name !== null) {
            // await activityLogDao.add(
            //   "INTR",
            //   "REACTION",
            //   user_id,
            //   company_id,
            //   feed_id,
            //   eventName,
            //   "RTN",
            //   null,
            //   transaction
            // );

            await activityLogDao.addActivityLog(
              "FED",
              "RCT",
              company_id,
              null,
              feed_id,
              user_id,
              eventName
            );
          } else {
            // await activityLogDao.add(
            //   "INTR",
            //   "REACTION",
            //   user_id,
            //   company_id,
            //   feed_id,
            //   null,
            //   "RTN",
            //   null,
            //   transaction
            // );

            await activityLogDao.addActivityLog(
              "FED",
              "RCT",
              company_id,
              null,
              feed_id,
              user_id,
              null
            );
          }
          /*  } else {
            if (eventName?.event_name !== null) {
              // await activityLogDao.add(
              //   "INTR",
              //   "LIKE",
              //   user_id,
              //   company_id,
              //   feed_id,
              //   eventName,
              //   "LIKE",
              //   null,
              //   transaction
              // );
              await activityLogDao.addActivityLog(
                "FED",
                "LIK",
                company_id,
                null,
                feed_id,
                user_id,
                eventName
              );
            } else {
              // await activityLogDao.add(
              //   "INTR",
              //   "LIKE",
              //   user_id,
              //   company_id,
              //   feed_id,
              //   null,
              //   "LIKE",
              //   null,
              //   transaction
              // );

              await activityLogDao.addActivityLog(
                "FED",
                "LIK",
                company_id,
                null,
                feed_id,
                user_id,
                null
              );
            }
          } */

          if (feedDetails?.feed_creator_user_id) {
            await activityLogDao.addActivityLog(
              "FED",
              "RFD",
              null,
              null,
              feed_id,
              feedDetails?.feed_creator_user_id,
              null
            );

            if (socket_request) {
              if (like?.user_id) {
                if (feedDetails?.feed_creator_user_id !== like?.user_id) {
                  await notificationDao.add(
                    feedDetails?.feed_creator_user_id,
                    null,
                    feed_id,
                    "RCT",
                    null,
                    transaction,
                    "FD",
                    like?.user_id,
                    "U"
                  );

                  socket_request.emit(`${feedDetails?.feed_creator_user_id}`, {
                    message: "test notification",
                    count: 100,
                  });
                }
              }
              if (like?.company_id) {
                // if (feedDetails?.feed_creator_user_id !== like?.user_id) {
                await notificationDao.add(
                  feedDetails?.feed_creator_user_id,
                  null,
                  feed_id,
                  "RCT",
                  null,
                  transaction,
                  "FD",
                  like?.company_id,
                  "C"
                );

                socket_request.emit(`${feedDetails?.feed_creator_user_id}`, {
                  message: "test notification",
                  count: 100,
                });
                // }
              }
              if (like?.event_id) {
                // if (feedDetails?.feed_creator_user_id !== like?.user_id) {
                await notificationDao.add(
                  feedDetails?.feed_creator_user_id,
                  null,
                  feed_id,
                  "RCT",
                  null,
                  transaction,
                  "FD",
                  like?.event_id,
                  "E"
                );

                socket_request.emit(`${feedDetails?.feed_creator_user_id}`, {
                  message: "test notification",
                  count: 100,
                });
                // }
              }
            }
          }
        }
        return likeResponse;
      }
      return likeResponse;
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log("failure, ROLLBACK was executed", error);
      throw error;
    });
  return result;
};

/**
 *Method to create new like
 * @param {JSon} body
 */
const createLikes = async (body, connectionObj = null) => {
  let result = null;
  try {
    const {
      company_id = null,
      user_id = null,
      feed_id,
      comment_id = null,
      like_type = "like",
      event_id = null,
    } = body;
    let company = null;
    let user = null;
    let comment = null;

    if (company_id !== null) company = await companyDao.getById(company_id);
    if (user_id !== null) user = await userDao.getById(user_id);

    if (comment_id === null) {
      let like = await likeDao.getByUserIdandFeedId(user_id, feed_id);
      if (like[0].count > 0) {
        result = { message: "This User and Feed Combination Already Exists" };
        return result;
      }
    }

    if (comment_id !== null) {
      comment = await commentDao.getById(comment_id);

      let like = await likeDao.getByUserFeedComment(
        user_id,
        feed_id,
        comment_id
      );
      if (like[0].count > 0) {
        result = {
          message: "This User , Feed and Comment Combination Already Exists",
        };
        return result;
      }
    }
    let feed = await feedDao.getById(feed_id);

    if (user === null && user_id !== null) {
      result = { message: "User not found" };
      return result;
    } else if (company === null && company_id !== null) {
      result = { message: "company not found" };
      return result;
    } else if (comment === null && comment_id !== null) {
      result = { message: "comment info not found" };
      return result;
    } else if (feed === null) {
      result = { message: "feed not found" };
      return result;
    } else {
      result = await likeDao.add(
        company_id,
        user_id,
        feed_id,
        comment_id,
        like_type,
        event_id,
        connectionObj
      );
      return result;
    }
  } catch (error) {
    console.log("Error occurred in createLike", error);
    throw error;
  }
};

/**
 *Method to update existing Like
 * @param {JSon} body
 */
const editLike = async (body) => {
  let result = null;
  try {
    const {
      company_id = null,
      user_id = null,
      feed_id,
      comment_id = null,
      like_type,
      event_id = null,
      like_id,
    } = body;
    let company = null;
    let user = null;
    let comment = null;
    let like = null;

    if (company_id !== null) company = await companyDao.getById(company_id);
    if (user_id !== null) user = await userDao.getById(user_id);
    if (comment_id !== null) comment = await commentDao.getById(comment_id);
    if (like_id !== null) {
      like = await likeDao.getById(like_id);
      if (like === null) {
        result = { message: "Like not found" };
        return result;
      }
    }

    let feed = await feedDao.getById(feed_id);
    let eventName = await feedDao.getEventNameByFeedId(feed_id);

    if (user === null && user_id !== null) {
      result = { message: "User not found" };
      return result;
    } else if (company === null && company_id !== null) {
      result = { message: "company not found" };
      return result;
    } else if (comment === null && comment_id !== null) {
      result = { message: "comment info not found" };
      return result;
    } else if (like === null && like_id !== null) {
      result = { message: "Like not found" };
      return result;
    } else if (feed === null) {
      result = { message: "feed not found" };
      return result;
    } else {
      result = await db.tx(async (transaction) => {
        result1 = await likeDao.edit(
          company_id,
          user_id,
          feed_id,
          comment_id,
          like_type,
          event_id,
          like_id
        );
        /*  if (like_type !== "like") { */
        if (eventName?.event_name !== null) {
          // await activityLogDao.add(
          //   "INTR",
          //   "REACTION",
          //   user_id,
          //   company_id,
          //   feed_id,
          //   eventName,
          //   "RTN",
          //   null,
          //   transaction
          // );

          await activityLogDao.addActivityLog(
            "FED",
            "RCT",
            company_id,
            null,
            feed_id,
            user_id,
            eventName
          );
        } else {
          // await activityLogDao.add(
          //   "INTR",
          //   "REACTION",
          //   user_id,
          //   null,
          //   feed_id,
          //   null,
          //   "RTN",
          //   null,
          //   transaction
          // );

          await activityLogDao.addActivityLog(
            "FED",
            "RCT",
            company_id,
            null,
            feed_id,
            user_id,
            null
          );
        }
        /*      } else {
          if (eventName?.event_name !== null) {
            // await activityLogDao.add(
            //   "INTR",
            //   "LIKE",
            //   user_id,
            //   company_id,
            //   feed_id,
            //   eventName,
            //   "LIKE",
            //   null,
            //   transaction
            // );

            await activityLogDao.addActivityLog(
              "FED",
              "LIK",
              company_id,
              null,
              feed_id,
              user_id,
              eventName
            );
          } else {
            // await activityLogDao.add(
            //   "INTR",
            //   "LIKE",
            //   user_id,
            //   company_id,
            //   feed_id,
            //   null,
            //   "LIKE",
            //   null,
            //   transaction
            // );

            await activityLogDao.addActivityLog(
              "FED",
              "LIK",
              company_id,
              null,
              feed_id,
              user_id,
              null
            );
          }
        } */
        if (comment_id === null) {
          let like_count = null;
          like_count = await likeDao.getLikeCount(feed_id);
          if (like_count.likes > 0) {
            db_like_count = await feedDao.editLikeCount(
              feed_id,
              like_count.likes,
              transaction
            );
          }
          result1["likeCount"] = like_count.likes;
          return result1;
        }
      });
      return result1;
    }
  } catch (error) {
    console.log("Error occurred in editLike", error);
    throw error;
  }
};

/**
 *Method to update existing LikeType
 * @param {JSon} body
 */
const editLikeType = async (body) => {
  let result = null;
  try {
    const { like_type, user_id, feed_id } = body;

    result = await db
      .tx(async (transaction) => {
        if (user_id !== null) user = await userDao.getById(user_id);

        if (user === null && user_id !== null) {
          result = { message: "User not found" };
          return result;
        }
        if (feed_id !== null) feed = await feedDao.getById(feed_id);

        if (feed === null && feed_id !== null) {
          result = { message: "Feed not found" };
          return result;
        } else {
          result = await likeDao.editLike(
            like_type,
            user_id,
            feed_id,
            transaction
          );
          // await activityLogDao.add(
          //   "INTR",
          //   "REACTION",
          //   user_id,
          //   null,
          //   feed_id,
          //   null,
          //   "RTN",
          //   null,
          //   transaction
          // );

          await activityLogDao.addActivityLog(
            "FED",
            "RCT",
            null,
            null,
            feed_id,
            user_id,
            null
          );

          return result;
        }
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
    console.log("Error occurred in editLikeType", error);
    throw error;
  }
};

/**
 * Method to Update Like
 * @param {JSON} body
 * @returns
 */
const updateLike = async (body) => {
  let result = null;
  const like = body;
  result = await db
    .tx(async (transaction) => {
      let likeResponse = await editLikeType(like, transaction);
      let like_count = null;
      like_count = await likeDao.getLikeCount(like.feed_id);
      if (like_count.likes > 0) {
        db_like_count = await feedDao.editLikeCount(
          like.feed_id,
          like_count.likes,
          transaction
        );
      }
      likeResponse["likeCount"] = like_count.likes;
      return likeResponse;
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log("failure, ROLLBACK was executed", error);
      throw error;
    });
  return result;
};

/**
 * Method to Delete Like By Like Id
 * @param {int8} like_id
 * @returns
 */
const deleteLikeById = async (like_id) => {
  let result = null;
  const like = like_id;
  result = await db
    .tx(async (transaction) => {
      if (like !== null) likeData = await likeDao.getById(like, transaction);
      let likeDataDelete = await deleteLike(like, transaction);
      let like_count = null;
      like_count = await likeDao.getLikeCount(likeData.feed_id);
      if (likeData.feed_id !== null) {
        db_like_count = await feedDao.editLikeCount(
          likeData.feed_id,
          like_count.likes,
          transaction
        );
      }
      likeDataDelete["likeCount"] = like_count.likes;
      return likeDataDelete;
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log("failure, ROLLBACK was executed", error);
      throw error;
    });
  return result;
};

/**
 *Method for Soft Delete Like By Like Id
 * @param {JSon} like_id
 */
const deleteLike = async (like_id) => {
  let result = null;
  try {
    let like = null;
    if (like_id !== null) like = await likeDao.getById(like_id);
    if (like === null) {
      result = { message: "Like not found" };
      return result;
    } else {
      if (like.is_delete === true) {
        result1 = { message: "Like Does Not Exist" };
        return result1;
      }
      result2 = await likeDao.deleteLike(like_id);
      if (result2.is_delete === true) {
        result1 = { message: "Like Deleted Successfully" };
        return result1;
      }
    }
  } catch (error) {
    console.log("Error occurred in deleteLike", error);
    throw error;
  }
};

/**
 * Method to get like info based on like id
 * @param {int} like_id
 */
const fetchLike = async (like_id) => {
  try {
    let result = {};
    let data = await likeDao.getById(like_id);
    if (data.is_delete === true) result = { message: "Like not exist" };
    else if (data === null) result = { message: "Like not exist" };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetchCommentInfo", error);
    throw error;
  }
};

/**
 * Method to get all comment info
 */
const fetchAll = async () => {
  try {
    let data = await likeDao.getAll();
    return data;
  } catch (error) {
    console.log("Error occurred in fetchCommentInfo", error);
    throw error;
  }
};

/**
 * Method to delete like info based on like id
 * @param {int} like_id
 */
/* const deleteLike = async (like_id) => {
    try {
        let result = {};
        let data = await likeDao.deleteById(like_id)
        if (data === null)
            result = { message: "like not exist" }
        else
            result["data"] = "Success";
        return result;
    } catch (error) {
        console.log("Error occurred in deleteCommentInfo", error);
        throw error;
    }
}; */

/**
 * Method to fetch All Likes for a particular feed id
 * @param {uuid} feed_id
 * @returns
 */
const fetchAllLikes = async (feed_id) => {
  try {
    let result = {};
    let data = await likeDao.getAllLike(feed_id);
    if (data.length > 0) result = data;
    else result = { message: "likes not exist" };
    return result;
  } catch (error) {
    console.log("Error occurred in fetchAllLikes", error);
    throw error;
  }
};

/**
 * Method for Search Likes Based On Feed Id and FilterBy Like Type
 * @param {JSON} body
 */
const searchLike = async (body) => {
  let result = null;
  try {
    const {
      page = 0,
      sort = "desc",
      size = 5,
      like_type = null,
      feed_id,
    } = body;
    let query = `select
          l.*,
          case
            when l.event_id is not null then jsonb_build_object('id', e.event_id , 'name', e.event_name , 'avatar' , e.event_logo , 'type' , 'E')
            when l.user_id is null then jsonb_build_object('id', c.company_id , 'name', c.company_name , 'avatar' , c.company_profile_img , 'type' , 'C')		
            else jsonb_build_object('id' , u.user_id, 'name', concat(u.first_name, ' ', u.last_name) , 'avatar' , u.user_profile_img , 'type' , 'U')		
          end as detail
        from
          likes l
        left join users u on
          l.user_id = u.user_id
        left join company c on
          c.company_id = l.company_id
        left join events e on 
          e.event_id = l.event_id
        where `;
    let countQuery = `select count(*) from likes l where `;
    let offset = page > 0 ? page * size : 0;

    let likeCountData = await likeDao.getByGetLikeTypeCount(feed_id);

    if (feed_id !== null && like_type === null) {
      query = query + ` l.feed_id= '${feed_id}' `;
      countQuery = countQuery + `l.feed_id= '${feed_id}'`;
    } else if (feed_id !== null && like_type !== null) {
      query =
        query + ` l.feed_id= '${feed_id}' and l.like_type= '${like_type}'`;
      countQuery =
        countQuery + `l.feed_id= '${feed_id}' and l.like_type= '${like_type}'`;
    }
    countQuery = countQuery + " and l.is_delete =false";
    query =
      query +
      ` and l.is_delete = false group by l.feed_id,l.like_id,l.like_type,u.first_name ,u.last_name ,u.user_profile_img, c.company_name ,c.company_profile_img,u.user_id ,c.company_id,e.event_id  order by l.updated_date ${sort} limit ${size} offset ${offset} `;
    let data = await customQueryExecutor.customQueryExecutor(query);
    let count = await customQueryExecutor.customQueryExecutor(countQuery);
    let length = Number(count[0].count);
    let totalPages = length < size ? 1 : Math.ceil(length / size);
    let tempData = {
      totalCount: length,
      totalPage: totalPages,
      size: size,
      count: likeCountData,
      content: data,
    };
    result = tempData;
  } catch (error) {
    console.log("Error occurred in search Likes ", error);
    throw error;
  }
  return result;
};

/**
 *Method for Soft Delete the Like Based On User and Feed Combination
 * @param {uuid} user_id and feed_id
 */
const deleteLikeByUserIdandFeedId = async (user_id, feed_id) => {
  let result = null;
  try {
    let user = null;
    let feed = null;
    let feedUser = null;
    if (user_id !== null) user = await userDao.getById(user_id);
    if (user === null) {
      result = { message: "User Id not found" };
      return result;
    }
    if (feed_id !== null) feed = await feedDao.getById(feed_id);
    if (feed === null) {
      result = { message: "Feed Id not found" };
      return result;
    } else {
      result = await likeDao.deleteLikeByUserIdandFeedId(user_id, feed_id);
      return result;
    }
  } catch (error) {
    console.log("Error occurred in deleteLike", error);
    throw error;
  }
};

/**
 * Method to delete Like Data
 * @param {uuid} user_id
 * @param {uuid} feed_id
 * @returns
 */
const deleteLikeData = async (user_id, feed_id) => {
  let result = null;
  result = await db
    .tx(async (transaction) => {
      let likeResponse = await deleteLikeByUserIdandFeedId(
        user_id,
        feed_id,
        transaction
      );
      if (likeResponse === null) {
        likeResponse = {
          message: "Like not found for this user and feed combination",
        };
        return likeResponse;
      }
      let like_count = null;
      like_count = await likeDao.getLikeCount(likeResponse.feed_id);
      if (like_count.likes > 0) {
        db_like_count = await feedDao.editLikeCount(
          likeResponse.feed_id,
          like_count.likes,
          transaction
        );
      }
      likeResponse["likeCount"] = like_count.likes;
      return likeResponse;
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log("failure, ROLLBACK was executed", error);
      throw error;
    });
  return result;
};

module.exports = {
  createLike,
  editLike,
  fetchLike,
  // deleteLike,
  fetchAll,
  fetchAllLikes,
  deleteLikeById,
  searchLike,
  deleteLikeByUserIdandFeedId,
  editLikeType,
  updateLike,
  deleteLikeData,
};
