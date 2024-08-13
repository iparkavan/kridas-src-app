const companyDao = require("../dao/company.dao");
const userDao = require("../dao/user.dao");
const followerDao = require("../dao/followers.dao");
const activityLogDao = require("../dao/activityLog.dao");
const notificationDao = require("../dao/notification.dao");
const db = require("../utils/db");

/**
 * Method to create new follower
 * @param {json} body
 */
const createFollower = async (body, connectionObj = null) => {
  let result = null;
  try {
    const {
      follower_userid = null,
      follower_companyid = null,
      following_companyid = null,
      following_userid = null,
      followed_from,
      following_event_id = null,
      socket_request = null,
    } = body;

    let transaction = connectionObj !== null ? connectionObj : db;

    if (follower_companyid != null) {
      let followerCompany = await companyDao.getById(
        follower_companyid,
        transaction
      );
      if (followerCompany === null) {
        result = { message: "follower company id not found" };
        return result;
      }
    }
    if (follower_userid != null) {
      let followerUser = await userDao.getById(follower_userid, transaction);
      if (followerUser === null) {
        result = { message: "follower user id not found" };
        return result;
      }
    }
    if (following_companyid != null) {
      let followingCompany = await companyDao.getById(
        following_companyid,
        transaction
      );
      if (followingCompany === null) {
        result = { message: "following company id not found" };
        return result;
      }
    }
    if (following_userid != null) {
      let followingUser = await userDao.getById(following_userid, transaction);
      if (followingUser === null) {
        result = { message: "following user id not found" };
        return result;
      }
    }
    if (follower_userid != null && following_userid != null) {
      let followerUser = await followerDao.getFollowerUser(
        follower_userid,
        following_userid
      );
      if (followerUser === null) {
        result = await followerDao.add(
          follower_userid,
          follower_companyid,
          following_companyid,
          following_userid,
          followed_from,
          following_event_id
        );
        // await activityLogDao.add(
        //   "CONNECTION",
        //   "FOLLOWING",
        //   follower_userid,
        //   null,
        //   following_userid,
        //   null,
        //   "FWU",
        //   null
        // );

        await activityLogDao.addActivityLog(
          "USR",
          "FOL",
          null,
          null,
          following_userid,
          follower_userid,
          null
        );

        await activityLogDao.addActivityLog(
          "USR",
          "FBY",
          null,
          null,
          following_userid,
          follower_userid,
          null
        );

        /* User Followed By Another User - Notification For Following User */

        notificationDao.add(
          following_userid,
          null,
          follower_userid,
          "FWU",
          null,
          null,
          "U",
          null,
          null
        );

        socket_request.emit(`${following_userid}`, {
          message: "test notification",
          count: 100,
        });

        // add = async (event_type, event_action, user_id, company_id,event_type_ref_id,additional_info, connectionObj = null)
        return result;
      } else if (followerUser.is_delete === false) {
        result = {
          message:
            "This Follower User and Following User Combination Already Exists",
        };
        return result;
      } else if (followerUser.is_delete === true) {
        result = await followerDao.updateFollowerUser(
          follower_userid,
          following_userid
        );
        // await activityLogDao.add(
        //   "CONNECTION",
        //   "FOLLOWING",
        //   follower_userid,
        //   null,
        //   following_userid,
        //   null,
        //   "FWU",
        //   null
        // );
        await activityLogDao.addActivityLog(
          "USR",
          "FOL",
          null,
          null,
          following_userid,
          follower_userid,
          null
        );

        /* User Followed By Another User - Notification For Following User */

        notificationDao.add(
          following_userid,
          null,
          follower_userid,
          "FWU",
          null,
          null,
          "U",
          null,
          null
        );

        socket_request.emit(`${following_userid}`, {
          message: "test notification",
          count: 100,
        });

        return result;
      }
    }
    if (follower_userid != null && following_companyid != null) {
      let result1 = [];
      let childPagesByParentCompanyId =
        await companyDao.getAllChildAndSubPagesByParentPageId(
          following_companyid,
          transaction
        );

      let childPageId = childPagesByParentCompanyId?.child_page_id;
      let subTeamPageId = childPagesByParentCompanyId?.sub_team_page_id;

      if (following_companyid) {
        let followerUserCompany = await followerDao.getFollowerUserCompany(
          follower_userid,
          following_companyid,
          transaction
        );
        if (followerUserCompany === null) {
          let parentCompanyFollowing = await followerDao.add(
            follower_userid,
            follower_companyid,
            following_companyid,
            following_userid,
            followed_from,
            following_event_id,
            transaction
          );
          // await activityLogDao.add(
          //   "CONNECTION",
          //   "FOLLOWING",
          //   follower_userid,
          //   null,
          //   following_companyid,
          //   null,
          //   "FWC",
          //   null
          // );

          await activityLogDao.addActivityLog(
            "PAG",
            "FOL",
            null,
            null,
            following_companyid,
            follower_userid,
            null
          );

          result1.push(parentCompanyFollowing);
        }
        // else if (followerUserCompany.is_delete === false) {
        //   result = {
        //     message:
        //       "This Follower User and Following Company Combination Already Exists",
        //   };
        //   return result;
        // }
        else if (followerUserCompany.is_delete === true) {
          let parentCompanyFollowing =
            await followerDao.updateFollowerUserCompany(
              follower_userid,
              following_companyid,
              transaction
            );
          // await activityLogDao.add(
          //   "CONNECTION",
          //   "FOLLOWING",
          //   follower_userid,
          //   null,
          //   following_companyid,
          //   null,
          //   "FWC",
          //   null
          // );

          await activityLogDao.addActivityLog(
            "PAG",
            "FOL",
            null,
            null,
            following_companyid,
            follower_userid,
            null
          );

          result1.push(parentCompanyFollowing);
        }
      }

      for await (let child_page_arr_id of childPageId) {
        let child_page_id = child_page_arr_id;
        if (child_page_id) {
          let followerUserCompany = await followerDao.getFollowerUserCompany(
            follower_userid,
            child_page_id,
            transaction
          );
          if (followerUserCompany === null) {
            let childCompanyFollowing = await followerDao.add(
              follower_userid,
              follower_companyid,
              child_page_id,
              following_userid,
              followed_from,
              following_event_id,
              transaction
            );
            // await activityLogDao.add(
            //   "CONNECTION",
            //   "FOLLOWING",
            //   follower_userid,
            //   null,
            //   child_page_id,
            //   null,
            //   "FWC",
            //   null
            // );

            await activityLogDao.addActivityLog(
              "PAG",
              "FOL",
              null,
              null,
              child_page_id,
              follower_userid,
              null
            );

            result1.push(childCompanyFollowing);
          }
          // else if (followerUserCompany.is_delete === false) {
          //   result = {
          //     message:
          //       "This Follower User and Following Company Combination Already Exists",
          //   };
          //   return result;
          // }
          else if (followerUserCompany.is_delete === true) {
            let childCompanyFollowing =
              await followerDao.updateFollowerUserCompany(
                follower_userid,
                child_page_id,
                transaction
              );
            // await activityLogDao.add(
            //   "CONNECTION",
            //   "FOLLOWING",
            //   follower_userid,
            //   null,
            //   child_page_id,
            //   null,
            //   "FWC",
            //   null
            // );

            await activityLogDao.addActivityLog(
              "PAG",
              "FOL",
              null,
              null,
              child_page_id,
              follower_userid,
              null
            );

            result1.push(childCompanyFollowing);
          }
        }
      }

      for await (let sub_team_page_arr_id of subTeamPageId) {
        let sub_team_page_id = sub_team_page_arr_id;
        if (sub_team_page_id) {
          let followerUserCompany = await followerDao.getFollowerUserCompany(
            follower_userid,
            sub_team_page_id,
            transaction
          );
          if (followerUserCompany === null) {
            let subTeamFollowing = await followerDao.add(
              follower_userid,
              follower_companyid,
              sub_team_page_id,
              following_userid,
              followed_from,
              following_event_id,
              transaction
            );
            // await activityLogDao.add(
            //   "CONNECTION",
            //   "FOLLOWING",
            //   follower_userid,
            //   null,
            //   sub_team_page_id,
            //   null,
            //   "FWC",
            //   null
            // );

            await activityLogDao.addActivityLog(
              "PAG",
              "FOL",
              null,
              null,
              sub_team_page_id,
              follower_userid,
              null
            );

            result1.push(subTeamFollowing);
          }
          // else if (followerUserCompany.is_delete === false) {
          //   result = {
          //     message:
          //       "This Follower User and Following Company Combination Already Exists",
          //   };
          //   return result;
          // }
          else if (followerUserCompany.is_delete === true) {
            let subTeamFollowing = await followerDao.updateFollowerUserCompany(
              follower_userid,
              sub_team_page_id,
              transaction
            );
            // await activityLogDao.add(
            //   "CONNECTION",
            //   "FOLLOWING",
            //   follower_userid,
            //   null,
            //   sub_team_page_id,
            //   null,
            //   "FWC",
            //   null
            // );

            // await activityLogDao.addActivityLog(
            //   "PAG",
            //   "FOL",
            //   null,
            //   null,
            //   sub_team_page_id,
            //   follower_userid
            // );

            result1.push(subTeamFollowing);
          }
        }
      }
      return result1;
    }
    if (follower_companyid != null && following_companyid != null) {
      let followerCompany = await followerDao.getFollowerCompany(
        follower_companyid,
        following_companyid,
        transaction
      );
      if (followerCompany === null) {
        result = await followerDao.add(
          follower_userid,
          follower_companyid,
          following_companyid,
          following_userid,
          followed_from,
          following_event_id,
          transaction
        );
        // await activityLogDao.add(
        //   "CONNECTION",
        //   "FOLLOWING",
        //   follower_userid,
        //   follower_companyid,
        //   following_companyid,
        //   null,
        //   "FWC",
        //   null,
        //   transaction
        // );

        // await activityLogDao.addActivityLog(
        //   "PAG",
        //   "FOL",
        //   follower_companyid,
        //   null,
        //   following_companyid,
        //   null,
        //   null
        // );

        return result;
      } else if (followerCompany.is_delete === false) {
        result = {
          message:
            "This Follower Company and Following Company Combination Already Exists",
        };
        return result;
      } else if (followerCompany.is_delete === true) {
        result = await followerDao.updateFollowerCompany(
          follower_companyid,
          following_companyid,
          transaction
        );
        // await activityLogDao.add(
        //   "CONNECTION",
        //   "FOLLOWING",
        //   follower_userid,
        //   follower_companyid,
        //   following_companyid,
        //   null,
        //   "FWC",
        //   null,
        //   transaction
        // );

        await activityLogDao.addActivityLog(
          "PAG",
          "FOL",
          follower_companyid,
          null,
          following_companyid,
          null,
          null
        );

        return result;
      }
    }
    if (follower_userid != null && following_event_id != null) {
      let followerUser = await followerDao.getFollowerUserEvent(
        follower_userid,
        following_event_id
      );
      if (followerUser === null) {
        result = await followerDao.add(
          follower_userid,
          follower_companyid,
          following_companyid,
          following_userid,
          followed_from,
          following_event_id,
          transaction
        );
        // await activityLogDao.add(
        //   "CONNECTION",
        //   "FOLLOWING",
        //   follower_userid,
        //   follower_companyid,
        //   following_event_id,
        //   null,
        //   "FWE",
        //   null
        // );

        await activityLogDao.addActivityLog(
          "EVT",
          "FOL",
          null,
          null,
          following_event_id,
          follower_userid,
          null
        );

        return result;
      } else if (followerUser.is_delete === false) {
        result = {
          message:
            "This Follower user and Following event Combination Already Exists",
        };
        return result;
      } else if (followerUser.is_delete === true) {
        result = await followerDao.updateFollowerUserEvent(
          follower_userid,
          following_event_id,
          transaction
        );
        // await activityLogDao.add(
        //   "CONNECTION",
        //   "FOLLOWING",
        //   follower_userid,
        //   follower_companyid,
        //   following_event_id,
        //   null,
        //   "FWE",
        //   null
        // );

        await activityLogDao.addActivityLog(
          "EVT",
          "FOL",
          null,
          null,
          following_event_id,
          follower_userid,
          null
        );
        return result;
      }
    }
    result = await followerDao.add(
      follower_userid,
      follower_companyid,
      following_companyid,
      following_userid,
      followed_from,
      transaction
    );
    return result;
  } catch (error) {
    console.log("Follower create error --->", error);
    throw error;
  }
};

/**
 * Method to get existing followers
 */
const fetchAll = async () => {
  try {
    let data = await followerDao.getAll();
    return data;
  } catch (error) {
    console.log("Error occurred in fetchAll follower", error);
    throw error;
  }
};

/**
 * Method to get follower based on follower_id
 * @param {int} followerId
 */
const fetchFollower = async (followerId) => {
  try {
    let result = {};
    let data = await followerDao.getById(followerId);
    if (data === null) result = { message: "follower not exist" };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetch follower", error);
    throw error;
  }
};

/**
 * Method to delete follower based on follower_id
 * @param {int} followerId
 */
const deleteFollower = async (follower_id) => {
  try {
    let result = {};
    let data = await followerDao.deleteById(follower_id);
    if (data === null) result = { message: "FollowerId not exist" };
    else result["data"] = "Success";
    return result;
  } catch (error) {
    console.log("Error occurred in delete follower", error);
    throw error;
  }
};

/**
 * Method to update follower based on follower id
 * @param {json} body
 */
const editFollower = async (body) => {
  let result = null;
  try {
    const {
      follower_id,
      follower_userid = null,
      follower_companyid = null,
      following_companyid = null,
      following_userid = null,
      followed_from,
    } = body;
    if (follower_id != null) {
      let follower = await followerDao.getById(follower_id);
      if (follower === null) {
        result = { message: "follower id not found" };
        return result;
      }
    }
    if (follower_companyid != null) {
      let followerCompany = await companyDao.getById(follower_companyid);
      if (followerCompany === null) {
        result = { message: "follower company id not found" };
        return result;
      }
    }
    if (follower_userid != null) {
      let followerUser = await userDao.getById(follower_userid);
      if (followerUser === null) {
        result = { message: "follower user id not found" };
        return result;
      }
    }
    if (following_companyid != null) {
      let followingCompany = await companyDao.getById(following_companyid);
      if (followingCompany === null) {
        result = { message: "following company id not found" };
        return result;
      }
    }
    if (following_userid != null) {
      let followingUser = await userDao.getById(following_userid);
      if (followingUser === null) {
        result = { message: "following user id not found" };
        return result;
      }
    }
    // result = await followerDao.edit(follower_userid, follower_companyid, following_companyid, following_userid, followed_from, follower_id)
    // return result;
  } catch (error) {
    console.log("Follower create error --->", error);
    throw error;
  }
};

/**
 * Method to get list of follower based on page information
 * @param {json} body
 */
const searchFollower = async (body) => {
  try {
    let result = null;
    const { page = 0, sort = "desc", size = 5 } = body;
    let query = `select * from follower `;
    let countQuery = "select count(*) from follower ";
    let offset = page > 0 ? page * size : 0;

    query =
      query + ` order by follower_id ${sort} limit ${size} offset ${offset}`;
    let data = await followerDao.customQueryExecutor(query);
    let count = await followerDao.customQueryExecutor(countQuery);

    let tempData = {
      totalCount: Number(count[0].count),
      totalPage: Math.round(Number(count[0].count) / size),
      size: size,
      content: data,
    };
    result = tempData;
    return result;
  } catch (error) {
    console.log("Error occurred in search user ", error);
    throw error;
  }
};

/**
 * Method to unfollow user and company
 * @param {json} body
 */
const unFollow = async (body) => {
  try {
    let result = null;
    const {
      follower_userid = null,
      following_userid = null,
      follower_companyid = null,
      following_companyid = null,
      following_event_id = null,
    } = body;

    if (follower_userid !== null && following_userid !== null) {
      let user = `select count(*) from follower f where follower_userid = '${follower_userid}' and following_userid ='${following_userid}' and is_delete ='false'`;
      let userdata = await followerDao.customQueryExecutor(user);
      if (userdata[0].count > 0) {
        let userResult = await followerDao.unfollowUser(
          follower_userid,
          following_userid
        );
        // await activityLogDao.add(
        //   "CONNECTION",
        //   "UNFOLLOW",
        //   follower_userid,
        //   null,
        //   following_userid,
        //   null,
        //   "UFWU",
        //   null
        // );

        await activityLogDao.addActivityLog(
          "USR",
          "UFL",
          null,
          null,
          following_userid,
          follower_userid,
          null
        );

        if (userResult.is_delete === true) {
          result = { message: "Successfully Unfollowed User" };
          return result;
        }
      } else {
        result = { message: "This combination does not exist" };
        return result;
      }
    }

    if (follower_userid !== null && following_companyid !== null) {
      let userCompany = `select count(*) from follower f where follower_userid = '${follower_userid}' and following_companyid ='${following_companyid}' and is_delete ='false'`;
      let userCompanydata = await followerDao.customQueryExecutor(userCompany);
      if (userCompanydata[0].count > 0) {
        let userCompanyResult = await followerDao.unfollowUserCompany(
          follower_userid,
          following_companyid
        );
        // await activityLogDao.add(
        //   "CONNECTION",
        //   "UNFOLLOW",
        //   follower_userid,
        //   null,
        //   following_companyid,
        //   null,
        //   "UFWC",
        //   null
        // );

        await activityLogDao.addActivityLog(
          "PAG",
          "UFL",
          null,
          null,
          following_companyid,
          follower_userid,
          null
        );
        if (userCompanyResult.is_delete === true) {
          result = { message: "Successfully Unfollowed Company" };
          return result;
        }
      } else {
        result = { message: "This combination does not exist" };
        return result;
      }
    }

    if (follower_companyid !== null && following_companyid !== null) {
      let company = `select count(*) from follower f where follower_companyid = '${follower_companyid}' and following_companyid ='${following_companyid}' and is_delete ='false'`;
      let companydata = await followerDao.customQueryExecutor(company);
      if (companydata[0].count > 0) {
        let companyResult = await followerDao.unfollowCompany(
          follower_companyid,
          following_companyid
        );
        // await activityLogDao.add(
        //   "CONNECTION",
        //   "UNFOLLOW",
        //   follower_userid,
        //   follower_companyid,
        //   following_companyid,
        //   null,
        //   "UFWC",
        //   null
        // );

        if (companyResult.is_delete === true) {
          result = { message: "Successfully Unfollowed Company" };
          return result;
        }
      } else {
        result = { message: "This combination does not exist" };
        return result;
      }
    }
    if (follower_userid !== null && following_event_id !== null) {
      let query = `select count(*) from follower f where follower_userid = '${follower_userid}' and following_event_id ='${following_event_id}' and is_delete ='false'`;
      let userEventData = await followerDao.customQueryExecutor(query);
      if (userEventData[0].count > 0) {
        let companyResult = await followerDao.unfollowEvent(
          follower_userid,
          following_event_id
        );
        // await activityLogDao.add(
        //   "CONNECTION",
        //   "UNFOLLOW",
        //   follower_userid,
        //   follower_companyid,
        //   following_event_id,
        //   null,
        //   "UFWE",
        //   null
        // );

        await activityLogDao.addActivityLog(
          "EVT",
          "UFL",
          null,
          null,
          following_event_id,
          follower_userid,
          null
        );
        if (companyResult.is_delete === true) {
          result = { message: "Successfully Unfollowed Event" };
          return result;
        }
      } else {
        result = { message: "This combination does not exist" };
        return result;
      }
    }
  } catch (error) {
    console.log("Error occurred in search user ", error);
    throw error;
  }
};

module.exports = {
  createFollower,
  fetchAll,
  fetchFollower,
  deleteFollower,
  editFollower,
  searchFollower,
  unFollow,
};
