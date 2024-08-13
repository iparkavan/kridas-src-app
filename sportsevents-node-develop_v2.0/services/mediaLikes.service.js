const mediaLikesDao = require("../dao/mediaLikes.dao");
const userDao = require("../dao/user.dao");
const companyDao = require("../dao/company.dao");
const mediaDao = require("../dao/media.dao");
const mediaCommentInfoDao = require("../dao/mediaCommentInfo.dao");
const customQuery = require("../dao/common/utils.dao");

/**
 * Method to create new media Like
 * @param {Json} body
 * @returns
 */
const createMediaLike = async (body) => {
  try {
    let result = null;
    let user = null;
    let company = null;
    let media = null;
    let comment = null;
    const {
      user_id = null,
      company_id = null,
      media_id,
      comment_id = null,
      like_type = "LIKE",
      is_deleted = false,
      event_id,
    } = body;

    if (user_id !== null && user_id !== undefined) {
      user = await userDao.getById(user_id);
      if (user === null) {
        result = { message: "User Not Exists" };
        return result;
      }
    }

    if (company_id !== null && company_id !== undefined) {
      company = await companyDao.getById(company_id);
      if (company === null) {
        result = { message: "Company Not Exists" };
        return result;
      }
    }

    if (media_id !== null && media_id !== undefined) {
      media = await mediaDao.getById(media_id);
      if (media === null) {
        result = { message: "Media Not Exists" };
        return result;
      }
    }

    if (comment_id !== null && comment_id !== undefined) {
      comment = await mediaCommentInfoDao.getById(comment_id);
      if (comment === null) {
        result = { message: "Comment Not Exists" };
        return result;
      }
    }

    let check = await mediaLikesDao.getByUserIdandMediaId(user_id, media_id);

    if (check[0].count > 0) {
      result = { message: "This User and media Combination Already Exists" };
      return result;
    }

    result = await mediaLikesDao.add(
      user_id,
      company_id,
      media_id,
      comment_id,
      like_type,
      is_deleted,
      event_id
    );
    return result;
  } catch (error) {
    console.log("Error occurred in createMediaLike", error);
    throw error;
  }
};

/**
 * Method to update existing Media Like
 * @param {JSON} body
 * @returns
 */
const editMediaLike = async (body) => {
  try {
    let result = null;
    let user = null;
    let company = null;
    let media = null;
    let comment = null;
    const {
      user_id = null,
      company_id = null,
      media_id,
      comment_id = null,
      like_type = "LIKE",
      is_deleted = false,
      event_id,
      like_id,
    } = body;

    let data = await mediaLikesDao.getById(like_id);
    if (data === null) {
      result = { message: "Media Like not exist" };
      return result;
    }

    if (user_id !== null && user_id !== undefined) {
      user = await userDao.getById(user_id);
      if (user === null) {
        result = { message: "User Not Exists" };
        return result;
      }
    }

    if (company_id !== null && company_id !== undefined) {
      company = await companyDao.getById(company_id);
      if (company === null) {
        result = { message: "Company Not Exists" };
        return result;
      }
    }

    if (media_id !== null && media_id !== undefined) {
      media = await mediaDao.getById(media_id);
      if (media === null) {
        result = { message: "Media Not Exists" };
        return result;
      }
    }

    if (comment_id !== null && comment_id !== undefined) {
      comment = await mediaCommentInfoDao.getById(comment_id);
      if (comment === null) {
        result = { message: "Comment Not Exists" };
        return result;
      }
    }

    let check = await mediaLikesDao.getByUserIdandMediaId(user_id, media_id);

    if (check[0].count > 0) {
      result = { message: "This User and media Combination Already Exists" };
      return result;
    }

    result = await mediaLikesDao.edit(
      user_id,
      company_id,
      media_id,
      comment_id,
      like_type,
      is_deleted,
      event_id,
      like_id
    );
    return result;
  } catch (error) {
    console.log("Error occurred in editMediaLike", error);
    throw error;
  }
};

/**
 * Method to get the Media Like based on Like Id
 * @param {int} like_id
 */

const fetchMediaLike = async (like_id) => {
  try {
    let mediaLike = {
      data: null,
    };
    let data = await mediaLikesDao.getById(like_id);
    if (data === null) mediaLike = { message: "mediaLike not exist" };
    else mediaLike["data"] = data;
    return mediaLike;
  } catch (error) {
    console.log("Error occurred in fetch mediaLike", error);
    throw error;
  }
};

/**
 *  Method to delete the Media Like based on like id
 * @param {int} like_id
 */

const deleteMediaLike = async (like_id) => {
  try {
    let mediaLike = {
      data: null,
    };
    let data = await mediaLikesDao.deleteById(like_id);
    if (data === null) mediaLike = { message: "Media Like not exist" };
    else mediaLike["data"] = "Success";
    return mediaLike;
  } catch (error) {
    console.log("Error occurred in delete tournament", error);
    throw error;
  }
};

/**
 *  Method to get all the Media Likes
 */
const fetchAll = async () => {
  try {
    return await mediaLikesDao.getAll();
  } catch (error) {
    console.log("Error occurred in fetchAll: ", error);
    throw error;
  }
};

/**
 * Method to get Like by media
 * @param {JSON} body
 * @returns
 */
const getLikeByMedia = async (body) => {
  try {
    let result = null;
    const {
      page = 0,
      sort = "desc",
      size = 5,
      media_id,
      like_type = null,
    } = body;
    let query = `select ml.*,
        case 
        when ml.user_id is null then jsonb_build_object('id', c.company_id, 'name', c.company_name, 'avatar', c.company_profile_img, 'type', 'C')
        else jsonb_build_object('id', u.user_id, 'name', concat(u.first_name, ' ', u.last_name), 'avatar', u.user_profile_img, 'type', 'U')
        end as detail
        from  media_likes ml
        left join users u on ml.user_id = u.user_id 
        left join company c on c.company_id = ml.company_id `;
    let countQuery = `select Count(1) as likes from media_likes ml where ml.is_deleted = false and `;

    let getlikesCount = await mediaLikesDao.getByGetLikeTypeCount(media_id);

    if (media_id !== null && like_type === null) {
      query = query + `where ml.media_id= '${media_id}' `;
      countQuery = countQuery + ` ml.media_id= '${media_id}'`;
    } else if (media_id !== null && like_type !== null) {
      query =
        query +
        `where ml.media_id= '${media_id}' and ml.like_type ilike '${like_type}'`;
      countQuery =
        countQuery +
        ` ml.media_id= '${media_id}' and ml.like_type ilike '${like_type}'`;
    }

    let offset = page > 0 ? page * size : 0;

    query =
      query + `order by ml.updated_date ${sort} limit ${size} offset ${offset}`;
    let data = await customQuery.customQueryExecutor(query);
    let count = await customQuery.customQueryExecutor(countQuery);

    let length = Number(count[0].likes);
    let totalPages = length < size ? 1 : Math.ceil(length / size);

    let tempData = {
      totalCount: length,
      totalPage: totalPages,
      size: size,
      content: data,
      count: getlikesCount,
    };
    return (result = tempData);
  } catch (error) {
    console.log("Error occurred in getToalMediaLikes", error);
    throw error;
  }
};

module.exports = {
  createMediaLike,
  editMediaLike,
  fetchMediaLike,
  deleteMediaLike,
  fetchAll,
  getLikeByMedia,
};
