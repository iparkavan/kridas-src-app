const mediaCommentInfoDao = require("../dao/mediaCommentInfo.dao");
const mediaDao = require("../dao/media.dao");
const customQueryExecutor = require("../dao/common/utils.dao");

/**
 *Method to create media comment info
 * @param {JSon} body
 */
const createMediaCommentInfo = async (body) => {
  try {
    let result = null;
    const {
      company_id = null,
      user_id = null,
      contents,
      media_id,
      parent_comment_id = null,
      event_id,
    } = body;
    let media = await mediaDao.getById(media_id);
    if (media === null) return (result = { message: "Media not exist" });
    result = await mediaCommentInfoDao.add(
      company_id,
      user_id,
      contents,
      media_id,
      parent_comment_id,
      event_id
    );
    return result;
  } catch (error) {
    console.log("Error occurred in createMediaCommentInfo: ", error);
    throw error;
  }
};

/**
 *Method to update media comment info
 * @param {JSon} body
 */
const editMediaCommentInfo = async (body) => {
  try {
    let result = null;
    const {
      company_id = null,
      user_id = null,
      contents,
      media_id,
      parent_comment_id = null,
      event_id,
      comment_id,
    } = body;

    let mediaComment = await mediaCommentInfoDao.getById(comment_id);
    if (mediaComment === null)
      return (result = { message: "Media comment info not exist" });
    let media = await mediaDao.getById(media_id);
    if (media === null) return (result = { message: "Media not exist" });
    result = await mediaCommentInfoDao.edit(
      company_id,
      user_id,
      contents,
      media_id,
      parent_comment_id,
      event_id,
      comment_id
    );
    return result;
  } catch (error) {
    console.log("Error occurred in editMediaCommentInfo: ", error);
    throw error;
  }
};

/**
 * Method to get media comment info based on id
 * @param {integer} comment_id
 */
const fetchByCommentId = async (comment_id) => {
  try {
    let result = await mediaCommentInfoDao.getById(comment_id);
    if (result === null) result = { message: "Media comment info not exist" };
    return result;
  } catch (error) {
    console.log("Error occurred in fetchByCommentId: ", error);
    throw error;
  }
};

/**
 * Method to get all media comment info
 */
const fetchAll = async () => {
  try {
    return await mediaCommentInfoDao.getAll();
  } catch (error) {
    console.log("Error occurred in fetchAll: ", error);
    throw error;
  }
};

/**
 * Method to delete media comment info based on comment id
 * @param {Integer} comment_id
 */
const deleteById = async (comment_id) => {
  try {
    let result = {
      data: null,
    };
    let data = await mediaCommentInfoDao.deleteById(comment_id);
    if (data === null) result = { message: "Media comment info not exist" };
    else result["data"] = "Success";
    return result;
  } catch (error) {
    console.log("Error occurred in deleteById", error);
    throw error;
  }
};

/**
 * Method for search comment
 * @param {JSON} body
 * @returns
 */
const searchComment = async (body) => {
  let result = null;
  try {
    const { page = 0, sort = "asc", size = 5, media_id = null } = body;
    let query = `select
        mci.*,
        case
            when mci.user_id is null then jsonb_build_object('id', c.company_id , 'name', c.company_name , 'avatar' , c.company_profile_img , 'type' , 'C')
            else jsonb_build_object('id' , u.user_id, 'name', concat(u.first_name, ' ', u.last_name) , 'avatar' , u.user_profile_img , 'type' , 'U')
        end as detail,
        count(ml.like_id) :: INTEGER as commentlikecount
    from
        media_comment_info mci
    left join users u 
        on
        mci .user_id = u.user_id
    left join company c 
        on
        mci .company_id = c.company_id
    left join media_likes ml on
        mci.comment_id = ml.comment_id
    where
        mci.media_id = '346182ba-7ea4-4182-a091-ace8305613ce'
        and parent_comment_id is null
    group by
        mci.comment_id,
        c.company_id ,
        u.user_id`;
    let countQuery = `select count(*) from  media_comment_info where media_id = '${media_id}'`;
    let offset = page > 0 ? page * size : 0;

    countQuery = countQuery;
    query =
      query +
      ` order by mci.created_date ${sort} limit ${size} offset ${offset} `;
    let data = await customQueryExecutor.customQueryExecutor(query);
    let count = await customQueryExecutor.customQueryExecutor(countQuery);
    let length = Number(count[0].count);
    let totalPages = length < size ? 1 : Math.ceil(length / size);
    let tempData = {
      totalCount: length,
      totalPage: totalPages,
      size: size,
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
 * Method for search child comment
 * @param {JSON} body
 * @returns
 */
const searchChildComment = async (body) => {
  let result = null;
  try {
    const {
      page = 0,
      sort = "asc",
      size = 5,
      media_id = null,
      parent_comment_id = null,
    } = body;
    let query = `select
        mci.*,
        case
            when mci.user_id is null then jsonb_build_object('id', c.company_id , 'name', c.company_name , 'avatar' , c.company_profile_img , 'type' , 'C')
            else jsonb_build_object('id' , u.user_id, 'name', concat(u.first_name, ' ', u.last_name) , 'avatar' , u.user_profile_img , 'type' , 'U')
        end as detail,
        count(ml.like_id) :: INTEGER as commentlikecount 
    from
        media_comment_info mci
    left join users u 
        on
        mci .user_id = u.user_id
    left join company c 
        on
        mci .company_id = c.company_id
    left join media_likes ml on
        mci.comment_id = ml.comment_id
    where
        mci.media_id = '${media_id}'
        and parent_comment_id = ${parent_comment_id}
    group by
        mci.comment_id,
        c.company_id ,
        u.user_id`;
    let countQuery = `select count(*) from  media_comment_info where media_id = '${media_id}' and parent_comment_id = ${parent_comment_id}`;
    let offset = page > 0 ? page * size : 0;

    if (parent_comment_id) {
      countQuery = countQuery;
      query =
        query +
        ` order by mci.created_date ${sort} limit ${size} offset ${offset} `;
    }
    let data = await customQueryExecutor.customQueryExecutor(query);
    let count = await customQueryExecutor.customQueryExecutor(countQuery);
    let length = Number(count[0].count);
    let totalPages = length < size ? 1 : Math.ceil(length / size);
    let tempData = {
      totalCount: length,
      totalPage: totalPages,
      size: size,
      content: data,
    };
    result = tempData;
  } catch (error) {
    console.log("Error occurred in search Likes ", error);
    throw error;
  }
  return result;
};

module.exports = {
  createMediaCommentInfo,
  editMediaCommentInfo,
  fetchByCommentId,
  fetchAll,
  deleteById,
  searchComment,
  searchChildComment,
};
