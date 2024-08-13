const articleDao = require("../dao/articles.dao");
const userDao = require("../dao/user.dao");
const companyDao = require("../dao/company.dao");
const articleFeedDao = require("../dao/articleFeed.dao");
const feedDao = require("../dao/feeds.dao");
const feedMediaDao = require("../dao/feedMedia.dao");
const { feedDefaultContent } = require("../utils/util");
const db = require("../utils/db");
const customQueryExecutor = require("../dao/common/utils.dao");
const { cloudinaryUpload, cloudinaryImageDelete } = require("../utils/common");
const feedService = require("../services/feeds.service");
const { response } = require("express");
const activityLogDao = require("../dao/activityLog.dao");
const notificationDao = require("../dao/notification.dao");
const hashtagDao = require("../dao/hashtags.dao");
const hashTagFeedsDao = require("../dao/hashTagFeeds.dao");
const feedTagDao = require("../dao/feedTag.dao");
const feedShareDao = require("../dao/feedShare.dao");
const feedsDao = require("../dao/feeds.dao");

/*
 * Method to create new articles
 * @param {Json} body
 */
const createArticle = async (body) => {
  try {
    let result = null;
    let imagemetaData = null;
    let cover_image_url = null;
    const {
      article_heading,
      files = {},
      cover_image_url_meta,
      article_content,
      user_id,
      company_id,
      article_publish_status = "DRT",
    } = body;
    result = await db
      .tx(async (transaction) => {
        if (JSON.stringify(files) !== JSON.stringify({})) {
          if (
            files.cover_image_url !== null &&
            files.cover_image_url !== undefined
          ) {
            imagemetaData = await cloudinaryUpload(files.cover_image_url[0]);
            cover_image_url = imagemetaData.url;
          }
        }

        let article = await articleDao.add(
          article_heading,
          cover_image_url,
          imagemetaData,
          article_content,
          user_id,
          company_id,
          article_publish_status,
          transaction
        );
        // await activityLogDao.add(
        //   "ARTICLE",
        //   "CREATE",
        //   user_id,
        //   company_id,
        //   article.article_id,
        //   null,
        //   "AR",
        //   transaction
        // );
        if (article_publish_status === "DRT") {
          await activityLogDao.addActivityLog(
            "ART",
            "CRE",
            company_id,
            null,
            article.article_id,
            user_id,
            null
          );
        }

        // let articleFeed = null;
        // Old function not used
        // if (article_publish_status === "PUB")
        //   await createArticleFeed(article, transaction);
        return article;
      })
      .then((data) => {
        console.log("successfully data returned");
        return data;
      })
      .catch((error) => {
        console.log("failure, ROLLBACK was executed", error);
        throw error;
      });
    // result = await articleDao.add(article_heading, cover_image_url, cover_image_url_meta, article_content, user_id, company_id, article_publish_status)
    return result;
  } catch (error) {
    console.log("Error occurred in createArticle", error);
    throw error;
  }
};

/**
 * Method to get all articles
 */
const fetchAll = async () => {
  try {
    let data = await articleDao.getAll();
    return data;
  } catch (error) {
    console.log("Error occurred in fetch Article", error);
    throw error;
  }
};

/**
 * Method to get article based on article id
 * @param {uuid} articleId
 */
const fetchArticle = async (article_id, user_id) => {
  try {
    let result = {};
    let data = await articleDao.getById(article_id);
    let connectionObj = null;

    if (data === null) result = { message: " article not exist" };
    else {
      result["data"] = data;
      if (user_id) {
        // await activityLogDao.add(
        //   "VIEW",
        //   "ARTICLE",
        //   user_id,
        //   null,
        //   article_id,
        //   null,
        //   "ARTICLE",
        //   null,
        //   connectionObj
        // );

        await activityLogDao.addActivityLog(
          "ART",
          "VIW",
          null,
          null,
          article_id,
          user_id,
          null
        );
      }
    }
    return result;
  } catch (error) {
    console.log("Error occurred in fetchArticle", error);
    throw error;
  }
};

// /**
//  * Method to get article based on article id
//  * @param {uuid} articleId
//  */
// const fetchArticleById = async (article_id) => {
//   try {
//     let result = {};
//     let data = await articleDao.getArticleById(article_id);
//     if (data === null) result = { message: " article not exist" };
//     else result["data"] = data;
//     return result;
//   } catch (error) {
//     console.log("Error occurred in fetchArticle", error);
//     throw error;
//   }
// };

/**
 *Method to update existing  article
 * @param {JSon} body
 */
const editArticle = async (body) => {
  let result = null;
  let imagemetaData = null;
  let image_url = null;
  try {
    const {
      article_heading,
      files = {},
      cover_image_url_meta,
      article_content,
      user_id,
      company_id,
      article_publish_status,
      article_id,
      feed = null,
    } = body;
    let articleData = await articleDao.getById(article_id);
    if (articleData === null) {
      result = { message: "article not exist" };
      return result;
    }

    imagemetaData = articleData?.cover_image_url_meta;
    image_url = articleData?.cover_image_url;
    result = await db
      .tx(async (transaction) => {
        if (JSON.stringify(files) !== JSON.stringify({})) {
          if (
            files?.cover_image_url !== null &&
            files?.cover_image_url !== undefined
          ) {
            imagemetaData = await cloudinaryUpload(files.cover_image_url[0]);
            image_url = imagemetaData.url;
            await cloudinaryImageDelete(articleData?.cover_image_url_meta);
          }
        }
        let article = await articleDao.edit(
          article_heading,
          image_url,
          imagemetaData,
          article_content,
          user_id,
          company_id,
          article_publish_status,
          article_id,
          transaction
        );
        let articleFeed = null;
        // if (article_publish_status === "PUB") {
        //     await createArticleFeed(article, transaction)
        // }

        if (articleData.article_publish_status === "PUB" && feed !== null) {
          await updateArticleFeed(feed, transaction);
        }

        // await activityLogDao.add(
        //   "ARTICLE",
        //   "UPDATE",
        //   user_id,
        //   company_id,
        //   article_id,
        //   null,
        //   "AR",
        //   null,
        //   transaction
        // );

        await activityLogDao.addActivityLog(
          "ART",
          "EDT",
          company_id,
          null,
          article_id,
          user_id,
          null
        );

        return article;
      })
      .then((data) => {
        console.log("successfully data returned");
        return data;
      })
      .catch((error) => {
        console.log("failure, ROLLBACK was executed", error);
        throw error;
      });
    return result;
  } catch (error) {
    console.log("Error occurred in editCommentInfo", error);
    throw error;
  }
};

/**
 *  Method to delete the article based on article id
 * @param {uuid} article_id
 */
const deleteArticleById = async (article_id) => {
  let result = null;
  let result1 = null;
  let result2 = null;

  try {
    let article = null;
    article = await articleDao.getById(article_id);

    // await feedMediaDao.deleteFeedMediaByFeedId(feed_id, transaction);

    if (article.is_deleted === true) {
      result1 = { message: "article Does Not Exist" };
      return result1;
    }

    result2 = await articleDao.deleteArticle(article_id);

    if (result2.is_deleted === true) {
      result1 = { message: "article Deleted Successfully" };
      return result1;
    }
  } catch (error) {
    console.log("Error occurred in delete Article", error);
    throw error;
  }
};

/**
 * Method For Article Delete
 * @param {uuid} article_id
 * @returns
 */
const deleteArticle = async (article_id) => {
  let result = null;

  result = await db
    .tx(async (transaction) => {
      let response = {};
      let articleFeed = null;
      let data = await articleDao.getById(article_id);
      if (data === null) {
        response = { message: "article not exist" };
      } else {
        if (article_id) {
          articleFeed = await articleFeedDao.deleteByArticleId(
            article_id,
            transaction
          );
        }
        await deleteArticleById(article_id);
        if (articleFeed !== null) {
          await feedDao.deleteById(articleFeed.feed_id, transaction);
        } else {
          return (response["data"] = "Success");
        }
        response["data"] = "Success";
      }
      return response;
    })
    .then((data) => {
      console.log("successfully data deleted", data);
      return data;
    })
    .catch((error) => {
      console.log("failure, ROLLBACK was executed", error);
      throw error;
    });

  return result;
};

/**
 * Method to get article based on user id
 * @param {uuid} userId
 */
const fetchUserId = async (user_id) => {
  try {
    let result = {};
    let data = await articleDao.getByUserId(user_id);
    if (data.length > 0) result["data"] = data;
    else result = { message: "user not exist" };

    return result;
  } catch (error) {
    console.log("Error occurred in fetchArticle by user", error);
    throw error;
  }
};

/**
 * Method to get article based on user id
 * @param {uuid} userId
 */
const updateIsFeature = async (body) => {
  try {
    const { is_featured, article_id } = body;
    let result = await articleDao.updateIsFeature(is_featured, article_id);
    return result;
  } catch (error) {
    console.log("Error occurred in Article Service updateIsFeature", error);
    throw error;
  }
};

/**
 * Method to get article based on comapny id
 * @param {uuid} companyid
 */
const fetchComapnyId = async (company_id) => {
  try {
    let result = {};
    let data = await articleDao.getByCompanyId(company_id);
    if (data.length > 0) result["data"] = data;
    else result = { message: "company not exist" };
    return result;
  } catch (error) {
    console.log("Error occurred in fetchArticle by company", error);
    throw error;
  }
};

const createArticleFeed = async (article, transaction) => {
  try {
    let defaultContent = { ...feedDefaultContent };
    const { cover_image_url_meta, user_id, company_id, article_id } = article;
    if (cover_image_url_meta !== null) {
      defaultContent["entityMap"]["0"]["type"] =
        cover_image_url_meta?.resource_type === "image" ? "IMAGE" : "VIDEO";
      defaultContent["entityMap"]["0"]["data"] = cover_image_url_meta;
      let feed = await feedDao.add(
        JSON.stringify(defaultContent),
        user_id,
        company_id,
        ["article"],
        0,
        0,
        null,
        "AR",
        transaction
      );
      // await activityLogDao.add(
      //   "POST",
      //   "ARTICLE",
      //   user_id,
      //   company_id,
      //   article_id,
      //   null,
      //   "ARTICLE",
      //   null,
      //   transaction
      // );

      await activityLogDao.addActivityLog(
        "ART",
        "PUB",
        null,
        null,
        article_id,
        user_id,
        null
      );

      let articleFeed = await articleFeedDao.add(
        article_id,
        feed.feed_id,
        transaction
      );
    }
  } catch (error) {
    console.log("Error occurred in createArticleFeed", error);
    throw error;
  }
};

/**
 * Method For Update Article Feed
 * @param {uuid} feed
 * @returns
 */
const updateArticleFeed = async (feed, transaction) => {
  try {
    const {
      feed_content,
      feed_creator_user_id,
      feed_creator_company_id,
      search_tags,
      share_count,
      like_count,
      feed_content_html,
      feed_id,
    } = JSON.parse(feed);
    let feedData = await feedDao.edit(
      feed_content,
      feed_creator_user_id,
      feed_creator_company_id,
      search_tags,
      share_count,
      like_count,
      feed_content_html,
      feed_id,
      transaction
    );
    return feedData;
  } catch (error) {
    console.log("Error occurred in updateArticleFeed", error);
    throw error;
  }
};

/**
 *Method For Pagination By  User Id
 * @param {JSon} body
 */

const searchByUserId = async (body) => {
  try {
    let result = null;
    const {
      page = 0,
      sort = "desc",
      size = 5,
      user_id,
      searchText,
      start_date,
      end_date,
    } = body;

    let query = `select a.*,jsonb_build_object('id',u.user_id,'name',concat(u.first_name,' ',u.last_name),'avatar',u.user_profile_img,'type','U')as user from articles a 
        left join users u on
        a.user_id =u.user_id 
        where a.user_id ='${user_id}' `;

    let countQuery = `select count(a.*) from articles a 
        left join users u on
        a.user_id =u.user_id 
        where a.user_id ='${user_id}'`;

    if (searchText) {
      query = query + ` and a.article_heading ilike '%${searchText}%' `;
      countQuery =
        countQuery + ` and a.article_heading ilike '%${searchText}%' `;
    }

    if (start_date && end_date) {
      query =
        query +
        ` and a.updated_date between '${start_date}' and '${end_date}' `;
      countQuery =
        countQuery +
        ` and a.updated_date between '${start_date}' and '${end_date}' `;
    }

    let offset = page > 0 ? page * size : 0;

    query =
      query + `order by a.updated_date ${sort} limit ${size} offset ${offset}`;

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
    return (result = tempData);
  } catch (error) {
    console.log("Error occurred in searchByUserId", error);
    throw error;
  }
};

/**
 *Method For Pagination By Company Id
 * @param {JSon} body
 */

const searchByCompanyId = async (body) => {
  try {
    let result = null;
    const { page = 0, sort = "desc", size = 5, company_id } = body;

    let query = `select a.*,jsonb_build_object('id',c.company_id,'name',c.company_name,'avatar',c.company_profile_img,'type','C')as company from articles a 
        left join company c on
        c.company_id =a.company_id 
        where a.company_id ='${company_id}'`;

    let countQuery = `select count(a.*)  from articles a 
        left join company c on
        c.company_id =a.company_id 
        where a.company_id ='${company_id}'`;
    let offset = page > 0 ? page * size : 0;

    query =
      query + `order by a.updated_date ${sort} limit ${size} offset ${offset}`;

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
    return (result = tempData);
  } catch (error) {
    console.log("Error occurred in searchByCompanyId", error);
    throw error;
  }
};

/**
 * Method For Search Pagination
 * @param {JSON} body
 * @returns
 */
const search = async (body) => {
  try {
    let result = null;
    const {
      page = 0,
      sort = "desc",
      size = 5,
      searchText,
      type,
      start_date,
      end_date,
      author_name,
      user_id,
    } = body;

    let query = null;
    let countQuery = null;

    query = `select
            a.*,
            case 
            when a.user_id is null then jsonb_build_object('id',c.company_id,'name',c.company_name,'avatar',c.company_profile_img,'type','C')
            else jsonb_build_object('id',u.user_id,'name',concat(u.first_name,' ',u.last_name),'avatar',u.user_profile_img,'type','U')
            end as detail
        from
            articles a
        left join users u on
            a.user_id = u.user_id
        left join company c on
            a.company_id = c.company_id
        where
            a.article_publish_status = 'PUB'
            and a.is_deleted = false `;

    countQuery = `select
            count(a.*)
        from
            articles a
        left join users u on
            a.user_id = u.user_id
        left join company c on
            a.company_id = c.company_id
        where
            a.article_publish_status = 'PUB'
            and a.is_deleted = false`;
    let offset = page > 0 ? page * size : 0;

    if (author_name) {
      query =
        query +
        ` and (u.first_name ilike '%${author_name}%' or u.last_name ilike '%${author_name}%') `;
      countQuery =
        countQuery +
        ` and (u.first_name ilike '%${author_name}%' or u.last_name ilike '%${author_name}%')`;
    }

    if (searchText !== undefined) {
      query = query + ` and a.article_heading ilike '%${searchText}%' `;
      countQuery =
        countQuery + ` and a.article_heading ilike '%${searchText}%' `;
    }
    // else if (searchText === undefined || type === undefined) {
    //     if (type === undefined) {
    //         query = query + ` and a.article_heading ilike '%${searchText}%'  `
    //         countQuery = countQuery + ` and a.article_heading ilike '%${searchText}%'  `
    //     } if (searchText === undefined) {
    //         if (type === 'week') {
    //             query = query + `  and a.updated_date >= NOW() - interval '1 week' `
    //             countQuery = countQuery + ` and a.updated_date >= NOW() - interval '1 week' `
    //         }
    //         else if (type === 'month') {
    //             query = query + `  and a.updated_date >= NOW() - interval '1 month' `
    //             countQuery = countQuery + `  and a.updated_date >= NOW() - interval '1 month' `
    //         }
    //         else if (type === 'yesterday') {
    //             query = query + ` and a.updated_date >= NOW() - interval '2 days' `
    //             countQuery = countQuery + `  and a.updated_date >= NOW() - interval '2 days' `
    //         }
    //         else if (type === 'today') {
    //             query = query + ` and a.updated_date >= NOW() - interval '1 days' `
    //             countQuery = countQuery + ` and a.updated_date >= NOW() - interval '1 days' `
    //         }
    //         else if (type === 'year') {
    //             query = query + ` and a.updated_date >= NOW() - interval '1 year' `
    //             countQuery = countQuery + ` and a.updated_date >= NOW() - interval '1 year' `
    //         }
    //         else if (type === 'custom') {
    //             query = query + ` and a.updated_date between '${start_date}' and '${end_date}' `
    //             countQuery = countQuery + ` and a.updated_date between '${start_date}' and '${end_date}' `
    //         }
    //     }
    // }
    // else {
    //     if (type === 'week') {
    //         query = query + ` and a.article_heading ilike '%${searchText}%' and a.updated_date >= NOW() - interval '1 week' `
    //         countQuery = countQuery + ` and a.article_heading ilike '%${searchText}%' and a.updated_date >= NOW() - interval '1 week' `
    //     }
    //     else if (type === 'month') {
    //         query = query + ` and a.article_heading ilike '%${searchText}%' and a.updated_date >= NOW() - interval '1 month' `
    //         countQuery = countQuery + ` and a.article_heading ilike '%${searchText}%' and a.updated_date >= NOW() - interval '1 month' `
    //     }
    //     else if (type === 'yesterday') {
    //         query = query + ` and a.article_heading ilike '%${searchText}%' and a.updated_date >= NOW() - interval '2 days' `
    //         countQuery = countQuery + ` and a.article_heading ilike '%${searchText}%' and a.updated_date >= NOW() - interval '2 days' `
    //     }
    //     else if (type === 'today') {
    //         query = query + ` and a.article_heading ilike '%${searchText}%' and a.updated_date >= NOW() - interval '1 days' `
    //         countQuery = countQuery + ` and a.article_heading ilike '%${searchText}%' and a.updated_date >= NOW() - interval '1 days' `
    //     }
    //     else if (type === 'year') {
    //         query = query + ` and a.article_heading ilike '%${searchText}%' and a.updated_date >= NOW() - interval '1 year' `
    //         countQuery = countQuery + ` and a.article_heading ilike '%${searchText}%' and a.updated_date >= NOW() - interval '1 year' `
    //     }
    //     else if (type === 'custom') {
    //         query = query + ` and a.article_heading ilike '%${searchText}%' and a.updated_date between '${start_date}' and '${end_date}' `
    //         countQuery = countQuery + ` and a.article_heading ilike '%${searchText}%' and a.updated_date between '${start_date}' and '${end_date}'  `
    //     }
    // }

    if (start_date && end_date) {
      query =
        query +
        ` and a.updated_date between '${start_date}' and '${end_date}' `;
      countQuery =
        countQuery +
        ` and a.updated_date between '${start_date}' and '${end_date}' `;
    }

    if (user_id) {
      query = `select a.*,jsonb_build_object('id',u.user_id,'name',concat(u.first_name,' ',u.last_name),'avatar',u.user_profile_img,'type','U')as user from articles a 
      left join users u on
      a.user_id =u.user_id 
      where a.user_id ='${user_id}' `;

      countQuery = `select count(a.*) from articles a 
      left join users u on
      a.user_id =u.user_id 
      where a.user_id ='${user_id}'`;

      if (searchText) {
        query = query + ` and a.article_heading ilike '%${searchText}%' `;
        countQuery =
          countQuery + ` and a.article_heading ilike '%${searchText}%' `;
      }

      if (start_date && end_date) {
        query =
          query +
          ` and a.updated_date between '${start_date}' and '${end_date}' `;
        countQuery =
          countQuery +
          ` and a.updated_date between '${start_date}' and '${end_date}' `;
      }
    }

    query =
      query + `order by a.updated_date ${sort} limit ${size} offset ${offset}`;

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
    return (result = tempData);
  } catch (error) {
    console.log("Error occurred in Search", error);
    throw error;
  }
};

/**
 * Method For Article Feed
 * @param {JSON} body
 * @returns
 */
const ArticleFeed = async (body) => {
  try {
    let result = null;
    let feeds = null;
    let article = null;
    let imagemetaData = null;
    let cover_image_url = null;
    let articleData = null;
    const {
      article_id,
      article_heading,
      files = {},
      cover_image_url_meta,
      article_content,
      user_id,
      company_id,
      article_publish_status,
      feed,
      socket_request = null,
    } = body;
    if (article_id !== null && article_id !== undefined) {
      articleData = await articleDao.getById(article_id);
      imagemetaData = articleData?.cover_image_url_meta;
      cover_image_url = articleData?.cover_image_url;
    }

    result = await db
      .tx(async (transaction) => {
        if (article_id !== null && article_id !== undefined) {
          articleData = await articleDao.getById(article_id);
        }
        // if (articleData === null) {
        //     result = { message: "article not exist" }
        //     return result
        // }
        // if (Object.keys(files).length === 0) {
        //     imagemetaData = articleData?.cover_image_url_meta
        //     cover_image_url = articleData?.cover_image_url
        // }

        if (JSON.stringify(files) !== JSON.stringify({})) {
          if (
            files?.cover_image_url !== null &&
            files?.cover_image_url !== undefined
          ) {
            imagemetaData = await cloudinaryUpload(files.cover_image_url[0]);
            cover_image_url = imagemetaData.url;
          }
        }
        if (article_id === undefined)
          article = await articleDao.add(
            article_heading,
            cover_image_url,
            imagemetaData,
            article_content,
            user_id,
            company_id,
            article_publish_status,
            transaction
          );
        else
          article = await articleDao.edit(
            article_heading,
            cover_image_url,
            imagemetaData,
            article_content,
            user_id,
            company_id,
            article_publish_status,
            article_id,
            transaction
          );
        let articleFeed = null;
        if (article_publish_status === "PUB") {
          if (feed.feed.feed_id === undefined) {
            feeds = await feedService.createFeed(feed, transaction);
            let articlefeed = await articleFeedDao.add(
              article.article_id,
              feeds.feed_id,
              transaction
            );
          } else feeds = await feedService.updateFeed(feed, transaction);
        }
        let admin_user = process.env.KRIDAS_USER_ID;
        if (socket_request) {
          if (admin_user === user_id) {
            await notificationDao.addBulkEntry(
              feeds.feed_id,
              "P",
              "AR",
              admin_user,
              transaction
            );
            socket_request.emit("public_notification", {
              message: "test notification",
              count: 100,
            });
          }
        }
        // await activityLogDao.add(
        //   "ARTICLE",
        //   "PUBLISH",
        //   user_id,
        //   company_id,
        //   article.article_id,
        //   null,
        //   "AR",
        //   transaction
        // );

        // await activityLogDao.add(
        //   "POST",
        //   "ARFD",
        //   user_id,
        //   company_id,
        //   feeds.feed_id,
        //   null,
        //   "ARFD",
        //   null,
        //   transaction
        // );

        await activityLogDao.addActivityLog(
          "ART",
          "PUB",
          company_id,
          null,
          article.article_id,
          user_id,
          null
        );

        return article;
      })
      .then((data) => {
        console.log("successfully data returned");
        return data;
      })
      .catch((error) => {
        console.log("failure, ROLLBACK was executed", error);
        throw error;
      });
    // result = await articleDao.add(article_heading, cover_image_url, cover_image_url_meta, article_content, user_id, company_id, article_publish_status)
    return result;
  } catch (error) {
    console.log("Error occurred in createArticle", error);
    throw error;
  }
};

/**
 * Method to search by Is Feature
 * @param {JSON} body
 * @returns
 */
const searchByIsFeature = async (body) => {
  try {
    let result = null;
    const { page = 0, sort = "desc", size = 5, is_feature = true } = body;

    let query = `select * from articles a where a.is_featured = ${is_feature} `;
    let countQuery = `select count(*) from articles a where a.is_featured =  ${is_feature} `;
    let offset = page > 0 ? page * size : 0;

    query =
      query + `order by a.updated_date ${sort} limit ${size} offset ${offset}`;

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
    return (result = tempData);
  } catch (error) {
    console.log("Error occurred in searchByIsFeature", error);
    throw error;
  }
};

/**
 * Method to share the article to user
 */
const articleShare = async (body, connectionObj = null) => {
  let result = null;
  const { feed, hashTags, tags, article_id, socket_request = null } = body;
  let article_feed = await articleDao.getFeedIdByArticle(article_id);
  result = await db
    .tx(async (transaction) => {
      let tr = connectionObj !== null ? connectionObj : transaction;
      let feedResponse = await feedService.createFeeds(feed, tr);
      let hashTagFeeds = [];
      let feedTags = [];
      //saving hash tag
      if (hashTags !== null && hashTags.length > 0) {
        for await (let hashtag of hashTags) {
          let db_hash_tag = await hashtagDao.getByExactTitle(hashtag);
          if (!db_hash_tag) db_hash_tag = await hashtagDao.add(hashtag, tr);

          let hashTagFeed = await hashTagFeedsDao.add(
            db_hash_tag.hashtag_id,
            feedResponse.feed_id,
            tr
          );
          hashTagFeeds.push(hashTagFeed);
        }
      }

      if (tags !== null && tags.length > 0) {
        for await (tag of tags) {
          let company_id = tag.type === "C" ? tag.id : null;
          let user_id = tag.type === "U" ? tag.id : null;
          let feedTag = await feedTagDao.add(
            company_id,
            user_id,
            feedResponse.feed_id,
            tr
          );
          feedTags.push(feedTag);
        }
      }
      if (article_feed?.feed_id) {
        let feedShareCount = null;
        const { feed_creator_user_id, feed_creator_company_id, feed_id } =
          feedResponse;
        let feedShares = await feedShareDao.add(
          feed_creator_user_id,
          feed_creator_company_id,
          article_feed?.feed_id,
          feed_id,
          tr
        );
        let shareCount = await feedShareDao.getShareCount(
          article_feed?.feed_id,
          tr
        );
        feedShareCount = await feedsDao.editShareCount(
          article_feed?.feed_id,
          shareCount.count,
          tr
        );
      }
      feedResponse["hashTagFeeds"] = hashTagFeeds;
      feedResponse["feedTags"] = feedTags;

      let admin_user = process.env.KRIDAS_USER_ID;
      if (socket_request) {
        if (
          feedResponse?.feed_creator_user_id &&
          admin_user === feedResponse?.feed_creator_user_id
        ) {
          await notificationDao.addBulkEntry(
            feedResponse.feed_id,
            "P",
            "FD",
            admin_user,
            tr
          );
          socket_request.emit("public_notification", {
            message: "test notification",
            count: 100,
          });
        } else {
          let userList = [];
          if (feed.feed_creator_user_id)
            userList = await userDao.fetchFollowerList(
              feed.feed_creator_user_id
            );
          else
            userList = await companyDao.getCompanyFollower(
              feed.feed_creator_company_id
            );
          for await (let user of userList) {
            await feedService.notificationAdd(
              user.id,
              feedResponse.feed_id,
              "P"
            );
            let { count } = await notificationDao.getByUserId(user.id);
            socket_request.emit(user.id, {
              message: "test notification",
              count,
            });
          }
        }
      }
      return feedResponse;
    })
    .then((data) => {
      console.log("successfully data returned", data.feed_id);
      return data;
    })
    .catch((error) => {
      console.log("failure, ROLLBACK was executed", error);
      throw error;
    });
  return result;
};

module.exports = {
  createArticle,
  fetchAll,
  fetchArticle,
  editArticle,
  deleteArticle,
  fetchUserId,
  fetchComapnyId,
  searchByUserId,
  searchByCompanyId,
  ArticleFeed,
  search,
  searchByIsFeature,
  articleShare,
  updateIsFeature,
  // fetchArticleById,
};
