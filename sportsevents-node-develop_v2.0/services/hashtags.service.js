const hashtagdao = require('../dao/hashtags.dao');
const customQueryExecutor = require('../dao/common/utils.dao')

/*
 * Method to create new hashtags
 * @param {Json} body 
 */
const createHashtag = async (body) => {
  try {
    let result = null;
    const { hashtag_title } = body;
    let { count } = await hashtagdao.checkDuplicate(hashtag_title)
    if (Number(count) === 0) {
      result = await hashtagdao.add(hashtag_title)
    } else {
      result = { message: "hashtags title already exist" }
    }
    return result;

  } catch (error) {
    console.log("Error occurred in createHashtag", error);
    throw error;
  }
};

/**
 *  Method to get all the hashtags
 */
const fetchAll = async () => {
  try {
    return await hashtagdao.getAll();
  } catch (error) {
    console.log("Error occurred in fetchAll: ", error);
    throw error;
  }
};

/**
 * Method to get the hashtags based on hashtag_id
 * @param {int} hashtag_id 
 */
const fetchHashtag = async (hashtag_id) => {
  try {
    let hashtags = {
      data: null,
    };
    let data = await hashtagdao.getById(hashtag_id)
    if (data === null) hashtags = { message: "hashtags not exist" };
    else hashtags["data"] = data;
    return hashtags;
  } catch (error) {
    console.log("Error occurred in fetch hashtags", error);
    throw error;
  }
};

/**
 * Method to get the hashtags based on hashtag_title
 * @param {string} hashtag_title   
 */
const fetchHashTagByTitle = async (hashtag_title) => {
  try {
    let hashtags = []
    let data = await hashtagdao.getByTitle(hashtag_title)
    hashtags = data;
    return hashtags;
  } catch (error) {
    console.log("Error occurred in fetch hashtags By Title", error);
    throw error;
  }
};

/*
 * Method to update existing hashtags
 * @param {Json} body 
 */
const editHashtag = async (body) => {
  try {
    let result = null;
    const { hashtag_title, hashtag_id } = body;

    const hashtags = await hashtagdao.getById(hashtag_id);
    if (!(hashtags?.message === undefined && hashtags !== null)) {
      result = { message: "hashtags not exist" }
      return result;
    }

    let { count } = await hashtagdao.checkDuplicate(hashtag_title)
    if (Number(count) === 0) {
      result = await hashtagdao.edit(hashtag_title, hashtag_id)
    } else {
      result = { message: "hashtags title already exist" }
    }
    return result;

  } catch (error) {
    console.log("Error occurred in editHashtag", error);
    throw error;
  }
};


/**
 *  Method to delete the hashtags based on hashtag id
 * @param {int} hashtag_id 
 */
const deleteHashtag = async (hashtag_id) => {
  try {
    let hashtags = {
      data: null,
    };
    let data = await hashtagdao.deleteById(hashtag_id)
    if (data === null) hashtags = { message: "hashtags not exist" };
    else hashtags["data"] = "Successfully Deleted";
    return hashtags;
  } catch (error) {
    console.log("Error occurred in delete hashtags", error);
    throw error;
  }
};

/**
 * Method to get by Title
 * @param {JSON} body 
 * @returns 
 */
const getByTitle = async (body) => {
  let result = null;
  try {
    const {
      page = 0,
      sort = "desc",
      size = 5,
      searchkey = null,
      user_id
    } = body;

    let query = `select f.*, h.hashtag_title , row_to_json(u) as user, row_to_json(c) as company, row_to_json(l) as like, count(ci.comment_id) :: INTEGER as comment_count from hashtag_feeds hf left join hashtags h on h.hashtag_id = hf.hashtag_id left join feeds f on hf.feed_id = f.feed_id left join users u on u.user_id = f.feed_creator_user_id left join company c on c.company_id = f.feed_creator_company_id left join likes l on l.feed_id = f.feed_id and l.is_delete = false and l.comment_id isnull and l.user_id = '${user_id}' left join comment_info ci on f.feed_id = ci.feed_id where lower(h.hashtag_title) = lower('${searchkey}') group by f.feed_id, h.hashtag_title, c.company_id, u.user_id, l.* `

    let countQuery = `select count(a) from (${query}) a`;
    let offset = page > 0 ? page * size : 0

    query = query + ` order by f.updated_date ${sort} limit ${size} offset ${offset} `;
    let data = await customQueryExecutor.customQueryExecutor(query)
    let count = await customQueryExecutor.customQueryExecutor(countQuery)
    let length = Number(count[0].count)
    let totalPages = length < size ? 1 : Math.ceil(length / size)
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
  createHashtag,
  fetchAll,
  fetchHashtag,
  editHashtag,
  deleteHashtag,
  fetchHashTagByTitle,
  getByTitle
};