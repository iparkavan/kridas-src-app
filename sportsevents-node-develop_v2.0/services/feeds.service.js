const userService = require('./user.service');
const companyService = require('./company.service');
const feedsDao = require('../dao/feeds.dao');
const hashtagDao = require('./../dao/hashtags.dao');
const hashTagFeedsDao = require('../dao/hashTagFeeds.dao');
const feedTagDao = require('../dao/feedTag.dao');
const userDao = require('../dao/user.dao');
const companyDao = require('../dao/company.dao');
const mediaDao = require('../dao/media.dao');
const feedMediaDao = require('../dao/feedMedia.dao');
const db = require('../utils/db');
const articleFeedDao = require('../dao/articleFeed.dao');
const articleDao = require('../dao/articles.dao');
const { result } = require('../utils/db');
const feedShare = require('../dao/feedShare.dao');
const notificationDao = require('../dao/notification.dao');
const activityLogDao = require('../dao/activityLog.dao');
const galleryMediaDao = require('../dao/galleryMedia.dao');

/**
 * Method for create a new feed with respective fields creation
 */
const createFeed = async (body, connectionObj = null) => {
  let result = null;
  const {
    feed,
    hashTags,
    tags,
    image,
    video,
    shared_feed_id = null,
    socket_request = null,
  } = body;
  result = await db
    .tx(async (transaction) => {
      let tr = connectionObj !== null ? connectionObj : transaction;
      let feedResponse = await createFeeds(feed, shared_feed_id, tr);
      let hashTagFeeds = [];
      let feedTags = [];
      let feedImage = [];
      let feedVideo = [];
      let desc = null;
      let articleFeed = null;
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
      if (image !== null && image.length > 0) {
        for await (let hashImg of image) {
          let type = 'I';
          let media = await mediaDao.add(
            type,
            hashImg.url,
            hashImg,
            desc,
            feed.feed_creator_user_id,
            feed.feed_creator_company_id,
            feedResponse.search_tags,
            null,
            tr
          );
          let feedMedia = await feedMediaDao.add(
            media.media_id,
            feedResponse.feed_id,
            tr
          );
          feedImage.push(feedMedia);
        }
      }
      if (video !== null && video.length > 0) {
        for await (let hashVideo of video) {
          let type = 'V';
          let media = await mediaDao.add(
            type,
            hashVideo.url,
            hashVideo,
            desc,
            feed.feed_creator_user_id,
            feed.feed_creator_company_id,
            feedResponse.search_tags,
            null,
            tr
          );
          let feedMedia = await feedMediaDao.add(
            media.media_id,
            feedResponse.feed_id,
            tr
          );
          feedVideo.push(feedMedia);
        }
      }
      if (tags !== null && tags.length > 0) {
        for await (tag of tags) {
          let company_id = tag.type === 'C' ? tag.id : null;
          let user_id = tag.type === 'U' ? tag.id : null;
          let event_id = tag.type === 'E' ? tag.id : null;
          let feedTag = await feedTagDao.add(
            company_id,
            user_id,
            feedResponse.feed_id,
            event_id,
            tr
          );
          // await activityLogDao.add(
          //   "TAGI",
          //   "TAG",
          //   user_id,
          //   company_id,
          //   feedResponse.feed_id,
          //   null,
          //   "TAG",
          //   event_id,
          //   transaction
          // );

          await activityLogDao.addActivityLog(
            'FED',
            'TAG',
            company_id,
            event_id,
            feedResponse.feed_id,
            user_id,
            null
          );

          feedTags.push(feedTag);
        }
      }
      if (shared_feed_id !== null) {
        let feedShares;
        let feedShareCount = null;
        const {
          feed_creator_user_id,
          feed_creator_company_id,
          feed_id,
          event_id,
        } = feedResponse;
        feedShares = await feedShare.add(
          feed_creator_user_id,
          feed_creator_company_id,
          shared_feed_id,
          feed_id,
          event_id,
          tr
        );
        // await activityLogDao.add(
        //   "SHRD",
        //   "SHARE",
        //   feed_creator_user_id,
        //   feed_creator_company_id,
        //   shared_feed_id,
        //   null,
        //   "SHR",
        //   null,
        //   transaction
        // );

        await activityLogDao.addActivityLog(
          'FED',
          'SHR',
          feed_creator_company_id,
          null,
          shared_feed_id,
          feed_creator_user_id,
          null
        );

        let shareCount = await feedShare.getShareCount(shared_feed_id, tr);
        feedShareCount = await feedsDao.editShareCount(
          shared_feed_id,
          shareCount.count,
          tr
        );

        articleFeed = await articleFeedDao.getByFeedId(shared_feed_id, tr);
      }
      feedResponse['hashTagFeeds'] = hashTagFeeds;
      feedResponse['feedTags'] = feedTags;
      feedResponse['feedImage'] = feedImage;
      feedResponse['feedVideo'] = feedVideo;

      let admin_user = process.env.KRIDAS_USER_ID;
      if (socket_request) {
        if (
          feedResponse?.feed_creator_user_id &&
          admin_user === feedResponse?.feed_creator_user_id
        ) {
          await notificationDao.addBulkEntry(
            feedResponse.feed_id,
            'P',
            'FD',
            admin_user,
            tr
          );
          socket_request.emit('public_notification', {
            message: 'test notification',
            count: 100,
          });
        } else {
          let userList = [];
          if (feed.feed_creator_user_id) {
            userList = await userDao.fetchFollowerList(
              feed.feed_creator_user_id
            );
          } else {
            userList = await companyDao.getCompanyFollower(
              feed.feed_creator_company_id
            );
          }
          for await (let user of userList) {
            if (user.type === 'U') {
              if (articleFeed === null) {
                await notificationAdd(user.id, feedResponse.feed_id, 'P');
              } else if (articleFeed) {
                await notificationDao.add(
                  user.id,
                  null,
                  feedResponse.feed_id,
                  'S',
                  null,
                  tr,
                  'AR',
                  null,
                  null
                );
              }
              let { count } = await notificationDao.getByUserId(user.id);
              socket_request.emit(user.id, {
                message: 'test notification',
                count,
              });
            }
          }
          if (articleFeed) {
            let articleShareCount = await feedShare.getUserSharedFeedCount(
              feed?.feed_creator_user_id,
              tr
            );
            if (articleShareCount?.count === '1') {
              await activityLogDao.addActivityLog(
                'ART',
                'SHR',
                null,
                null,
                null,
                feed?.feed_creator_user_id,
                null
              );
            }
          }
        }
      }
      return feedResponse;
    })
    .then((data) => {
      console.log('successfully data returned', data.feed_id);
      return data;
    })
    .catch((error) => {
      console.log('failure, ROLLBACK was executed', error);
      throw error;
    });
  return result;
};

const notificationAdd = async (
  user_id,
  feed_id,
  type,
  connectionObj = null
) => {
  try {
    let socket = null;
    let notification_type_id = feed_id;
    const notification = await notificationDao.add(
      user_id,
      socket,
      notification_type_id,
      type,
      null,
      connectionObj,
      undefined,
      null,
      null
    );
    return notification;
  } catch (error) {
    console.log('Error occurred in publish event', error);
    throw error;
  }
};

/**
 * Method for Update Existing Feed
 * @param {JSON} body
 * @returns
 */
const updateFeed = async (body) => {
  let result = null;
  let feedMedia = null;
  let media = null;
  const { feed, hashTags, tags, image, video } = body;
  let feedData = await feedsDao.getById(feed.feed_id);
  if (feedData === null) result = { message: 'feed not exist' };
  else {
    result = await db
      .tx(async (transaction) => {
        let feedResponse = await editFeeds(feed, transaction);
        await hashTagFeedsDao.deleteByFeedId(feed.feed_id);
        await feedTagDao.deleteByFeedId(feed.feed_id);
        feedMedia = await feedMediaDao.deleteFeedMediaByFeedId(feed.feed_id);
        for await (let media of feedMedia)
          await mediaDao.deleteById(media.media_id);
        let hashTagFeeds = [];
        let feedTags = [];
        let feedImage = [];
        let feedVideo = [];
        let desc = null;
        //saving hash tag
        if (hashTags !== null && hashTags.length > 0) {
          for await (let hashtag of hashTags) {
            let db_hash_tag = await hashtagDao.getByExactTitle(hashtag);
            if (!db_hash_tag)
              db_hash_tag = await hashtagDao.add(hashtag, transaction);
            let hashTagFeed = await hashTagFeedsDao.add(
              db_hash_tag.hashtag_id,
              feedResponse.feed_id,
              transaction
            );
            hashTagFeeds.push(hashTagFeed);
          }
        }
        if (image !== null && image.length > 0) {
          for await (let hashImg of image) {
            let type = 'I';
            let media = await mediaDao.add(
              type,
              hashImg.url,
              hashImg,
              desc,
              feed.feed_creator_user_id,
              feed.feed_creator_company_id,
              feedResponse.search_tags,
              null,
              transaction
            );
            let feedMedia = await feedMediaDao.add(
              media.media_id,
              feedResponse.feed_id,
              transaction
            );
            feedImage.push(feedMedia);
          }
        }
        if (video !== null && video.length > 0) {
          for await (let hashVideo of video) {
            let type = 'V';
            let media = await mediaDao.add(
              type,
              hashVideo.url,
              hashVideo,
              desc,
              feed.feed_creator_user_id,
              feed.feed_creator_company_id,
              feedResponse.search_tags,
              null,
              transaction
            );
            let feedMedia = await feedMediaDao.add(
              media.media_id,
              feedResponse.feed_id,
              transaction
            );
            feedVideo.push(feedMedia);
          }
        }
        if (tags !== null && tags.length > 0) {
          for await (tag of tags) {
            let company_id = tag.type === 'C' ? tag.id : null;
            let user_id = tag.type === 'U' ? tag.id : null;
            let event_id = tag.type === 'E' ? tag.id : null;
            let feedTag = await feedTagDao.add(
              company_id,
              user_id,
              feedResponse.feed_id,
              event_id,
              transaction
            );
            feedTags.push(feedTag);
          }
        }
        feedResponse['hashTagFeeds'] = hashTagFeeds;
        feedResponse['feedTags'] = feedTags;
        feedResponse['feedImage'] = feedImage;
        feedResponse['feedVideo'] = feedVideo;
        return feedResponse;
      })
      .then((data) => {
        console.log('successfully data returned', data.feed_id);
        return data;
      })
      .catch((error) => {
        console.log('failure, ROLLBACK was executed', error);
        throw error;
      });
  }
  return result;
};

/**
 *Method to create new feed
 * @param {JSon} body
 */
const createFeeds = async (
  body,
  shared_feed_id = null,
  connectionObj = null
) => {
  let result = null;
  try {
    const {
      feed_content,
      feed_creator_user_id = null,
      feed_creator_company_id = null,
      search_tags = null,
      share_count,
      like_count,
      files = {},
      event_id = null,
      feed_type = 'P',
      //feed_content_html = null,
    } = body;
    let feed_creator_user = null;
    let feed_creator_company = null;
    if (feed_creator_user_id != null) {
      feed_creator_user = await userService.fetchUser(feed_creator_user_id);
      if (!(feed_creator_user.message === undefined)) {
        result = { message: 'Feeds creator user not available' };
        return result;
      }
    }

    if (feed_creator_company_id != null) {
      feed_creator_company = await companyService.fetchCompany(
        feed_creator_company_id
      );
      if (!(feed_creator_company.message === undefined)) {
        result = { message: 'Feeds Company not available' };
        return result;
      }
    }
    result = await feedsDao.add(
      feed_content,
      feed_creator_user_id,
      feed_creator_company_id,
      search_tags,
      share_count,
      like_count,
      event_id,
      feed_type,
      //feed_content_html,
      connectionObj
    );
    if (shared_feed_id === null) {
      if (feed_type === 'E') {
        await activityLogDao.addActivityLog(
          'FED',
          'PST',
          feed_creator_company_id,
          event_id,
          result.feed_id,
          feed_creator_user_id,
          null
        );
      } else {
        await activityLogDao.addActivityLog(
          'FED',
          'PST',
          feed_creator_company_id,
          null,
          result.feed_id,
          feed_creator_user_id,
          null
        );
      }
    }
    return result;
  } catch (error) {
    console.log('Error occurred in createFeeds', error);
    throw error;
  }
};

/**
 * Method to get all feeds
 */
const fetchAll = async () => {
  let result = null;
  try {
    let data = await feedsDao.getAll();
    result = data;
  } catch (error) {
    console.log('Error occurred in fetchAll', error);
    throw error;
  }
  return result;
};

/**
 * Method to get feed based on feed id
 * @param {uuid} feed_id
 */
const fetchFeeds = async (feed_id) => {
  let result = {
    data: null,
  };
  try {
    let data = await feedsDao.getById(feed_id);
    if (data === null) result = { message: 'feeds not exist' };
    else result['data'] = data;
  } catch (error) {
    console.log('Error occurred in fetchFeeds', error);
    throw error;
  }
  return result;
};

/**
 *Method to update existing feed
 * @param {JSon} body
 */
const editFeeds = async (body, connectionObj = null) => {
  let result = null;
  try {
    const {
      feed_id,
      feed_content,
      feed_creator_user_id = null,
      feed_creator_company_id = null,
      search_tags = null,
      share_count,
      like_count,
      //feed_content_html,
    } = body;

    // let feed_creator_user = null;
    // let feed_creator_company = null;

    // if (feed_id != null) {
    //     feed_creator_user = await fetchFeeds(feed_id)
    //     if (!(feed_creator_user.message === undefined)) {
    //         result = { message: "Feeds_id creator user not available" }
    //         return result;
    //     }
    // }

    // if (feed_creator_user_id != null) {
    //     feed_creator_user = await userService.fetchUser(feed_creator_user_id)
    //     if (!(feed_creator_user.message === undefined)) {
    //         result = { message: "Feeds creator user not available" }
    //         return result;
    //     }
    // }

    // if (feed_creator_company_id != null) {
    //     feed_creator_company = await companyService.fetchCompany(feed_creator_company_id)
    //     if (!(feed_creator_company.message === undefined)) {
    //         result = { message: "Feeds Company not available" }
    //         return result;
    //     }
    // }
    let feed = await feedsDao.getById(feed_id);
    result = await feedsDao.edit(
      feed_content,
      feed_creator_user_id,
      feed_creator_company_id,
      search_tags,
      feed.share_count,
      feed.like_count,
      //feed_content_html,
      feed_id,
      connectionObj
    );
    return result;
  } catch (error) {
    console.log('Error occurred in editFeeds', error);
    throw error;
  }
};

// const deleteById = async (feed_id) => {
//     let result1 = null;
//     let result2 = null

//     try {
//         let feed = null;
//         feed = await feedsDao.getById(feed_id);

//         if (feed.is_delete === true) {
//             result1 = { message: "feed Does Not Exist" }
//             return result1;
//         }

//         result2 = await feedsDao.deleteById(feed_id);

//         if (result2.is_deleted === true) {
//             result1 = { message: "feed Deleted Successfully" }
//             return result1;
//         }

//     } catch (error) {
//         console.log("Error occurred in delete feed", error);
//         throw error;
//     }
// };

/**
 * Method to delete feed based on feed id
 * @param {uuid} feed_id
 */
const deleteFeeds = async (feed_id) => {
  let result = null;
  let feedMedia = null;
  let mediaData = null;
  let galleryMediaData = null;
  result = await db
    .tx(async (transaction) => {
      let response = {};
      let data = await feedsDao.getById(feed_id);
      if (data === null) {
        response = { message: 'feeds not exist' };
      } else {
        await hashTagFeedsDao.deleteByFeedId(feed_id, transaction);
        await feedTagDao.deleteByFeedId(feed_id, transaction);
        feedMedia = await feedMediaDao.deleteFeedMediaByFeedId(
          feed_id,
          transaction
        );
        for await (let media of feedMedia) {
          galleryMediaData = await galleryMediaDao.deleteByMediaId(
            media.media_id,
            transaction
          );
          mediaData = await mediaDao.deleteById(media.media_id, transaction);
        }
        let article = await articleFeedDao.deleteByFeedId(feed_id, transaction);
        // if (article !== null)
        //     await articleDao.deleteArticle(article.article_id, transaction)
        await feedsDao.deleteById(feed_id, transaction);
        response['data'] = 'Success';
      }
      return response;
    })
    .then((data) => {
      console.log('successfully data deleted', data);
      return data;
    })
    .catch((error) => {
      console.log('failure, ROLLBACK was executed', error);
      throw error;
    });
  return result;
};

/**
 * Method to search feed
 */
const searchFeed = async (body) => {
  let result = null;
  try {
    const {
      page = 0,
      sort = 'desc',
      size = 5,
      user_id = null,
      company_id = null,
      event_id = null,
    } = body;
    let feedShareSubQuery = `
            select
              fs2.feed_id as original_feed_id,
              f3.*,
              row_to_json(u1)::jsonb as user,
              row_to_json(c1)::jsonb as company,
              row_to_json(e)::jsonb as event 
            from
              feed_share fs2
            left join feeds f3 on
              fs2.shared_feed_id = f3.feed_id
            left join users u1 on
              u1.user_id = f3.feed_creator_user_id
            left join company c1 on
              c1.company_id = f3.feed_creator_company_id
            left join events e on
              e.event_id = f3.event_id `;
    let query = `
    select
      f.*,
      row_to_json(l) as like,
      count(ci.comment_id)::INTEGER as comment_count,
      row_to_json(u) as user,
      row_to_json(c) as company,
      row_to_json(t2) as feed_share,
      row_to_json(e2) as event,
      json_agg(m.*) as media_data 
    from
      feeds f
    left join users u on
      u.user_id = f.feed_creator_user_id
    left join company c on
      c.company_id = f.feed_creator_company_id
    left join events e2 on
      e2.event_id = f.event_id
    left join comment_info ci on
      f.feed_id = ci.feed_id
    left join ((${feedShareSubQuery})) t2 on
      t2.original_feed_id = f.feed_id
    left join feed_media fm on
      fm.feed_id = f.feed_id
    left join media m on
      m.media_id = fm.media_id
    left join likes l on
      l.feed_id = f.feed_id
      and l.is_delete = false
      and l.comment_id isnull `;
    let sub_query = `select ft2.feed_id from feed_tags ft2 `;
    let selectFilter =
      user_id !== null
        ? 'f1.following_userid'
        : company_id !== null
        ? 'f1.following_companyid'
        : 'f1.following_event_id';
    let sub_query2 = `select ${selectFilter} from follower f1 where f1.is_delete = false and `;
    let company_sub_query = `select f1.following_companyid from follower f1 where f1.is_delete = false and f1.following_companyid notnull and `;
    let event_sub_query = `select f1.following_event_id from follower f1 where f1.is_delete = false and f1.following_event_id notnull and `;

    let countQuery =
      'select count(*) from feeds f left join users u on u.user_id = f.feed_creator_user_id where ';
    let feedSubQuery = `select f2.feed_id from follower fw left join feeds f2 on (f2.feed_creator_user_id = fw.following_userid or (f2.feed_creator_company_id = fw.following_companyid and f2.event_id = fw.following_event_id) or f2.event_id = fw.following_event_id or (f2.feed_creator_company_id = fw.following_companyid)) and f2.is_delete = false where (fw.follower_userid = '${user_id}' and extract (epoch from (f2.created_date - (fw.followed_from - (2 * interval '1 minute'))))::integer / 60 > 0 and fw.is_delete = false)`;
    let feedSubQueryForCompany = `select f2.feed_id from follower fw left join feeds f2 on (f2.feed_creator_user_id = fw.following_userid or (f2.feed_creator_company_id = fw.following_companyid and f2.event_id = fw.following_event_id) or f2.event_id = fw.following_event_id or (f2.feed_creator_company_id = fw.following_companyid)) and f2.is_delete = false where (fw.follower_companyid = '${company_id}' and extract (epoch from (f2.created_date - (fw.followed_from - (2 * interval '1 minute'))))::integer / 60 > 0 and fw.is_delete = false)`;
    let hashTagSubQuery = `select hf.feed_id from hashtag_feeds hf where hf.hashtag_id in (select sh.hashtag_id from sports_hashtag sh where sh.sports_id = any ((select us.sports_interested from users us where us.user_id ='${user_id}')::int[]))`;
    let hashTagSubQueryForCompany = `select hf.feed_id from hashtag_feeds hf where hf.hashtag_id in (select sh.hashtag_id
       from sports_hashtag sh where sh.sports_id = any (( select array_agg(cs.sports_refid) as sports_interested
        from company_sport cs where cs.company_id = '${company_id}')::int[]))`;
    let offset = page > 0 ? page * size : 0;

    if (user_id !== null) {
      sub_query = sub_query + `where ft2.user_id = '${user_id}'`;
      sub_query2 = sub_query2 + `f1.follower_userid = '${user_id}'`;
      company_sub_query =
        company_sub_query + `f1.follower_userid = '${user_id}' `;
      event_sub_query = event_sub_query + `f1.follower_userid = '${user_id}' `;
      query =
        query +
        ` and l.user_id ='${user_id}' where ` +
        `(f.feed_creator_user_id = '${user_id}' or f.feed_id in (${sub_query}) or f.feed_id in (${feedSubQuery}) or f.feed_id in (${hashTagSubQuery})) and `;
      countQuery =
        countQuery +
        `(f.feed_id in (${sub_query}) or f.feed_creator_user_id = '${user_id}' or f.feed_id in (${feedSubQuery}) or f.feed_id in (${hashTagSubQuery})) and `;
      // query = query + ` and l.user_id ='${user_id}' where ` + `(f.feed_creator_user_id = '${user_id}' or f.feed_id in (${sub_query}) or f.feed_creator_user_id in (${sub_query2}) or f.feed_creator_company_id in (${company_sub_query})) and `
      // countQuery = countQuery + `(f.feed_creator_user_id = '${user_id}' or f.feed_id in (${sub_query}) or f.feed_creator_user_id in (${sub_query2}) or f.feed_creator_company_id in (${company_sub_query})) and `
    } else if (company_id !== null) {
      selectFilter = 'f1.following_companyid';
      sub_query = sub_query + `where ft2.company_id = '${company_id}'`;
      sub_query2 = sub_query2 + `f1.follower_companyid = '${company_id}' `;
      query =
        query +
        ` and l.company_id ='${company_id}' where ` +
        `((f.feed_creator_company_id = '${company_id}' and f.event_id isnull) or f.feed_id in (${sub_query}) or f.feed_creator_company_id in (${sub_query2}) or f.feed_id in (${feedSubQueryForCompany}) or f.feed_id in (${hashTagSubQueryForCompany})) and `;
      countQuery =
        countQuery +
        `((f.feed_creator_company_id = '${company_id}' and f.event_id isnull) or f.feed_id in (${sub_query}) or f.feed_creator_company_id in (${sub_query2}) or f.feed_id in (${feedSubQueryForCompany}) or f.feed_id in (${hashTagSubQueryForCompany}))  and  `;
    } else if (event_id !== null) {
      selectFilter = 'f1.following_event_id';
      sub_query = sub_query + `where ft2.event_id = '${event_id}'`;
      // sub_query2 = sub_query2 + `f1.follower_companyid = '${company_id}' `;
      event_sub_query = event_sub_query + `f1.follower_userid = '${user_id}' `;

      query =
        query +
        ` and l.event_id ='${event_id}' where ` +
        `(( f.event_id ='${event_id}') or f.feed_id in (${sub_query})) and `;
      countQuery =
        countQuery +
        `((f.event_id ='${event_id}') or f.feed_id in (${sub_query})) and `;
    }

    countQuery = countQuery + 'f.is_delete = false';
    query =
      query +
      ` f.is_delete = false group by f.feed_id, l.*, u.*, c.*,t2.*,e2.*  order by f.updated_date ${sort} limit ${size} offset ${offset} `;
    let data = await feedsDao.customQueryExecutor(query);
    let data_result = data.map((feed) => {
      feed.media_data =
        feed.media_data && feed.media_data[0] !== null ? feed.media_data : null;
      return feed;
    });
    let count = await feedsDao.customQueryExecutor(countQuery);

    let length = Number(count[0].count);
    let totalPages = length < size ? 1 : Math.ceil(length / size);

    let tempData = {
      totalCount: length,
      totalPage: totalPages,
      size: size,
      content: data_result,
    };
    result = tempData;
  } catch (error) {
    console.log('Error occurred in search user ', error);
    throw error;
  }
  return result;
};

/**
 * Method for search feed by Event
 * @param {Json} body
 */
const searchFeedByEvent = async (body) => {
  try {
    const {
      page = 0,
      sort = 'desc',
      size = 5,
      company_id,
      event_id = null,
      login_id,
      type,
    } = body;

    let feedShareSubQuery = `
            select
              fs2.feed_id as original_feed_id,
              f3.*,
              row_to_json(u1)::jsonb as user,
              row_to_json(c1)::jsonb as company,
              row_to_json(e)::jsonb as event 
            from
              feed_share fs2
            left join feeds f3 on
              fs2.shared_feed_id = f3.feed_id
            left join users u1 on
              u1.user_id = f3.feed_creator_user_id
            left join company c1 on
              c1.company_id = f3.feed_creator_company_id
            left join events e on
              e.event_id = f3.event_id `;
    let query = `select
            f.*,
            row_to_json(l) as like,
            count(ci.comment_id) :: INTEGER as comment_count ,
            row_to_json(u) as user,
            row_to_json(c) as company,
            row_to_json(e) as event,
            row_to_json(t2) as feed_share,
            json_agg(m.*) as media_data 
          from
            feeds f
          left join users u on
            u.user_id = f.feed_creator_user_id
          left join company c on
            c.company_id = f.feed_creator_company_id
          left join events e on
            e.event_id = f.event_id
          left join comment_info ci on
            f.feed_id = ci.feed_id
          left join ((${feedShareSubQuery})) t2 on
            t2.original_feed_id = f.feed_id
          left join feed_media fm on
            fm.feed_id = f.feed_id
          left join media m on
            m.media_id = fm.media_id
          left join likes l on
            l.feed_id = f.feed_id
            and l.is_delete = false
            and l.comment_id isnull
            and ${
              type === 'U'
                ? 'l.user_id'
                : type === 'C'
                ? 'l.company_id'
                : 'l.event_id'
            } = '${login_id}'
          where
            (f.feed_creator_company_id = '${company_id}'
              and `;
    let sub_query = `select eo.event_refid from organizer o join event_organizer eo on eo.organizer_refid = o.organizer_id where o.company_refid = '${company_id}' `;
    let countQuery = `select count(*) from feeds f where (f.feed_creator_company_id = '${company_id}' and `;
    let offset = page > 0 ? page * size : 0;

    if (event_id === null) {
      query = query + `f.event_id in (${sub_query})) and `;
      countQuery = countQuery + `f.event_id in (${sub_query})) and `;
    } else {
      query = query + `f.event_id ='${event_id}') and `;
      countQuery = countQuery + `f.event_id ='${event_id}') and `;
    }

    countQuery = countQuery + 'f.is_delete = false';
    query =
      query +
      `f.is_delete = false group by f.feed_id, l.*, u.*, c.*,e.*,t2.*  order by f.updated_date ${sort} limit ${size} offset ${offset} `;
    let data = await feedsDao.customQueryExecutor(query);
    let data_result = data.map((feed) => {
      feed.media_data =
        feed.media_data && feed.media_data[0] !== null ? feed.media_data : null;
      return feed;
    });
    let count = await feedsDao.customQueryExecutor(countQuery);

    let length = Number(count[0].count);
    let totalPages = length < size ? 1 : Math.ceil(length / size);

    let tempData = {
      totalCount: length,
      totalPage: totalPages,
      size: size,
      content: data_result,
    };
    // result = tempData;

    return tempData;
  } catch (error) {
    console.log('Error occurred in searchFeedByEvent ', error);
    throw error;
  }
};

/**
 * Method to fetch feed by HashTag
 */
const fetchFeedsByHashTag = async (search_key) => {
  try {
    let result = {};
    let data = await feedsDao.getFeedsByHashTag(search_key);
    if (data.length > 0) result['data'] = data;
    else result = { message: 'feeds not exist' };
    return result;
  } catch (error) {
    console.log('Error occurred in fetchFeedsByHashTag ', error);
    throw error;
  }
};

/**
 * Method to fetch feed by feed creator user id
 */
const fetchByFeedCreatorUserId = async (body) => {
  try {
    // let result = null;
    // feed_creator_user = await userDao.getById(feed_creator_user_id)
    // if (feed_creator_user === null) {
    //     result = { message: "Feeds creator user not available" }
    //     return result;
    // }

    // let data = await feedsDao.getByFeedCreaterUserId(feed_creator_user_id)
    // if (data.length > 0) {
    //     let feeds = data.map((feed) => {
    //         return { ...feed, user: feed_creator_user }
    //     })
    //     result["data"] = feeds;
    //     return result;
    // }
    // else {
    //     result = { message: "feed creator user not exist" }
    //     return result
    // }
    let result = null;
    const { page = 0, sort = 'desc', size = 5, user_id, login_user } = body;
    // let query = `select f.*,row_to_json(u.*) as user from feeds f left join users u on f.feed_creator_user_id = u.user_id where f.feed_creator_user_id = '${user_id}' and is_delete = false `;
    let query = `select
        f.*,
        row_to_json(l) as like,
        count(ci.comment_id) :: INTEGER as comment_count,
        row_to_json(u.*) as user,
        row_to_json(t2) as feed_share,
        json_agg(m.*) as media_data 
    from
        feeds f
    left join users u on
        f.feed_creator_user_id = u.user_id
    left join likes l on
        l.feed_id = f.feed_id
        and l.is_delete = false
        and l.comment_id isnull
        and l.user_id = '${login_user}'
    left join comment_info ci on
        f.feed_id = ci.feed_id
    left join (
        select
            fs2.feed_id as original_feed_id,
            f3.*,
            row_to_json(u1)::jsonb as user,
            row_to_json(c1)::jsonb as company,
            row_to_json(e)::jsonb as event
        from
            feed_share fs2
        left join feeds f3 on
            fs2.shared_feed_id = f3.feed_id
        left join users u1 on
            u1.user_id = f3.feed_creator_user_id
        left join company c1 on
            c1.company_id = f3.feed_creator_company_id
        left join events e on
            e.event_id =f3.event_id 
        ) t2 on 
        t2.original_feed_id = f.feed_id
    left join feed_media fm on
      fm.feed_id = f.feed_id
    left join media m on
      m.media_id = fm.media_id
    where
        f.feed_creator_user_id = '${user_id}'
        and f.is_delete = false
    group by
        f.feed_id,
        l.*,
        u.*,
        t2.*`;
    let countQuery = `select count(*) from feeds f  where f.feed_creator_user_id = '${user_id}' and is_delete = false `;
    let offset = page > 0 ? page * size : 0;

    query =
      query + `order by f.updated_date ${sort} limit ${size} offset ${offset}`;
    let data = await feedsDao.customQueryExecutor(query);
    let data_result = data.map((feed) => {
      feed.media_data =
        feed.media_data && feed.media_data[0] !== null ? feed.media_data : null;
      return feed;
    });
    let count = await feedsDao.customQueryExecutor(countQuery);

    let length = Number(count[0].count);
    let totalPages = length < size ? 1 : Math.ceil(length / size);

    let tempData = {
      totalCount: length,
      totalPage: totalPages,
      size: size,
      content: data_result,
    };

    return (result = tempData);
  } catch (error) {
    console.log('Error occurred in fetchFeeds', error);
    throw error;
  }
};

/**
 * Method to fetch feed by feed creator company id
 * @param {JSON} body
 * @returns
 */
const fetchByFeedCreatorCompanyId = async (body) => {
  try {
    // let result = {};
    // feed_creator_company = await companyDao.getById(feed_creator_company_id)
    // if (feed_creator_company === null) {
    //     result = { message: "Feeds creator company not available" }
    //     return result;
    // }

    // let data = await feedsDao.getByFeedCreaterCompanyId(feed_creator_company_id)
    // if (data.length > 0) {
    //     let feeds = data.map((feed) => {
    //         return { ...feed, company: feed_creator_company }
    //     })
    //     result["data"] = feeds;
    //     return result;
    // }
    // else {
    //     result = { message: "feed creator company not exist" }
    //     return result
    // }
    let result = null;
    const {
      page = 0,
      sort = 'desc',
      size = 5,
      company_id,
      login_id,
      type,
    } = body;
    let query = `select
        f.*,
        row_to_json(l) as like,
        count(ci.comment_id) :: INTEGER as comment_count ,
        row_to_json(c.*) as company,
        row_to_json(t2.*) as feed_share,
        json_agg(m.*) as media_data 
      from
        feeds f
      left join company c on
        f.feed_creator_company_id = c.company_id
      left join likes l on
        l.feed_id = f.feed_id
        and l.is_delete = false
        and l.comment_id isnull
        and ${type === 'U' ? 'l.user_id' : 'l.company_id'} = '${login_id}'
      left join comment_info ci on
        f.feed_id = ci.feed_id
      left join (
        select
          fs2.feed_id as original_feed_id,
          f3.*,
          row_to_json(u1)::jsonb as user,
          row_to_json(c1)::jsonb as company
        from
          feed_share fs2
        left join feeds f3 on
          fs2.shared_feed_id = f3.feed_id
        left join users u1 on
          u1.user_id = f3.feed_creator_user_id
        left join company c1 on
          c1.company_id = f3.feed_creator_company_id
                  ) t2 on
        t2.original_feed_id = f.feed_id
      left join feed_media fm on
        fm.feed_id = f.feed_id
      left join media m on
        m.media_id = fm.media_id
      where
        f.feed_creator_company_id = '${company_id}'
        and f.event_id isnull
        and f.is_delete = false
      group by
        f.feed_id,
        l.*,
        c.*,
        t2.* `;
    let countQuery = `select count(*) from feeds f where f.feed_creator_company_id = '${company_id}' and f.event_id isnull and f.is_delete = false `;
    let offset = page > 0 ? page * size : 0;

    query =
      query + `order by f.updated_date ${sort} limit ${size} offset ${offset}`;
    let data = await feedsDao.customQueryExecutor(query);
    let data_result = data.map((feed) => {
      feed.media_data =
        feed.media_data && feed.media_data[0] !== null ? feed.media_data : null;
      return feed;
    });
    let count = await feedsDao.customQueryExecutor(countQuery);

    let length = Number(count[0].count);
    let totalPages = length < size ? 1 : Math.ceil(length / size);

    let tempData = {
      totalCount: length,
      totalPage: totalPages,
      size: size,
      content: data_result,
    };

    return (result = tempData);
  } catch (error) {
    console.log('Error occurred in fetchFeeds', error);
    throw error;
  }
};

/**
 * Method to fetch feed by feed creator company id
 * @param {JSON} body
 * @returns
 */
const fetchByFeedCreatorCompanyIdwithEvent = async (body) => {
  try {
    let result = null;
    const {
      page = 0,
      sort = 'desc',
      size = 5,
      company_id,
      login_id,
      type,
    } = body;
    let query = `select f.*,row_to_json(l) as like, count(ci.comment_id) :: INTEGER as comment_count ,row_to_json(c.*) as company, row_to_json(t2.*) as feed_share from feeds f 
        left join company c on f.feed_creator_company_id = c.company_id 
        left join likes l on l.feed_id = f.feed_id and l.is_delete = false and l.comment_id isnull and ${
          type === 'U' ? 'l.user_id' : 'l.company_id'
        } ='${login_id}'
        left join comment_info ci on f.feed_id = ci.feed_id 
        left join (select
                fs2.feed_id as original_feed_id,
                f3.*,
                row_to_json(u1)::jsonb as user,
                row_to_json(c1)::jsonb as company
            from
                feed_share fs2
            left join feeds f3 on
                fs2.shared_feed_id = f3.feed_id
            left join users u1 on
                u1.user_id = f3.feed_creator_user_id
            left join company c1 on
                c1.company_id = f3.feed_creator_company_id
            ) t2 on 
            t2.original_feed_id = f.feed_id
        where f.feed_creator_company_id = '${company_id}' and f.is_delete = false
        group by f.feed_id,l.*,c.*, t2.* `;
    let countQuery = `select count(*) from feeds f where f.feed_creator_company_id = '${company_id}' and f.event_id isnull and f.is_delete = false `;
    let offset = page > 0 ? page * size : 0;

    query =
      query + `order by f.updated_date ${sort} limit ${size} offset ${offset}`;
    let data = await feedsDao.customQueryExecutor(query);
    let count = await feedsDao.customQueryExecutor(countQuery);

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
    console.log('Error occurred in fetchFeeds', error);
    throw error;
  }
};

/**
 * Method to search by name
 * @param {JSON} body
 * @returns
 */
const searchByName = async (body) => {
  try {
    let result = null;
    const { page = 0, sort = 'desc', size = 5, name, type = null } = body;

    if (type === null || type === 'B') {
      let query = `select
                c.company_id id ,
                c.company_name as name,
                c.company_profile_img avatar ,
                'C' as type ,
                c.updated_date as date
            from
                company c
            where
                c.company_name ilike '${name}%'
            union all 
            select
                u.user_id as id,
                concat(u.first_name, ' ', u.last_name)as username,
                u.user_profile_img as avatar,
                'U' as type,
                u.updated_date as date
            from
                users u
            where
                u.first_name ilike '${name}%'
                or u.last_name ilike '${name}%' `;

      let countQuery = `select
                count(v)
            from
                (
                select
                    c.company_id id ,
                    c.company_name as name,
                    c.company_profile_img avatar ,
                    'C' as type
                from
                    company c
                where
                    c.company_name ilike '${name}%'
            union all
                select
                    u.user_id as id,
                    concat(u.first_name, ' ', u.last_name)as username,
                    u.user_profile_img as avatar,
                    'U' as type
                from
                    users u
                where
                    u.first_name ilike '${name}%'
                    or u.last_name ilike '${name}%')v`;
      let offset = page > 0 ? page * size : 0;

      query = query + `order by date ${sort} limit ${size} offset ${offset}`;
      let data = await feedsDao.customQueryExecutor(query);
      let count = await feedsDao.customQueryExecutor(countQuery);

      let length = Number(count[0].count);
      let totalPages = length < size ? 1 : Math.ceil(length / size);

      let tempData = {
        totalCount: length,
        totalPage: totalPages,
        size: size,
        content: data,
      };
      return (result = tempData);
    } else {
      let query = `select
                *
            from
                (
                select
                    c.company_id id ,
                    c.company_name as name,
                    c.company_profile_img avatar ,
                    'C' as type ,
                    c.updated_date as date
                from
                    company c
                where
                    c.company_name ilike '${name}%'
            union all
                select
                    u.user_id as id,
                    concat(u.first_name, ' ', u.last_name)as username,
                    u.user_profile_img as avatar,
                    'U' as type,
                    u.updated_date as date
                from
                    users u
                where
                    u.first_name ilike '${name}%'
                    or u.last_name ilike '${name}%')a
            where
                type = '${type}'`;

      let countQuery = `select
            count(b)
        from
            (
            select
                *
            from
                (
                select
                    c.company_id id ,
                    c.company_name as name,
                    c.company_profile_img avatar ,
                    'C' as type ,
                    c.updated_date as date
                from
                    company c
                where
                    c.company_name ilike '${name}%'
            union all
                select
                    u.user_id as id,
                    concat(u.first_name, ' ', u.last_name)as username,
                    u.user_profile_img as avatar,
                    'U' as type,
                    u.updated_date as date
                from
                    users u
                where
                    u.first_name ilike '${name}%'
                    or u.last_name ilike '${name}%')a
            where
                type = '${type}')b`;

      let offset = page > 0 ? page * size : 0;

      query = query + `order by date ${sort} limit ${size} offset ${offset}`;
      let data = await feedsDao.customQueryExecutor(query);
      let count = await feedsDao.customQueryExecutor(countQuery);

      let length = Number(count[0].count);
      let totalPages = length < size ? 1 : Math.ceil(length / size);

      let tempData = {
        totalCount: length,
        totalPage: totalPages,
        size: size,
        content: data,
      };
      return (result = tempData);
    }
  } catch (error) {
    console.log('Error occurred in fetchFeeds', error);
    throw error;
  }
};

/**
 * Method to get individual feed with association data
 * @param {uuid} feed_id
 */
const getFeedWithAssociationData = async (body, connectionObj = null) => {
  try {
    let result = {};
    const { feed_id, id, type } = body;
    let data = await feedsDao.getFeedWithAssociationData(
      feed_id,
      id,
      type,
      connectionObj
    );
    if (data === null) result = { message: 'feeds not exist' };
    else result['data'] = data;

    return result;
  } catch (error) {
    console.log('Error occurred in fetchFeeds', error);
    throw error;
  }
};

module.exports = {
  createFeeds,
  fetchAll,
  fetchFeeds,
  editFeeds,
  deleteFeeds,
  searchFeed,
  createFeed,
  updateFeed,
  fetchFeedsByHashTag,
  fetchByFeedCreatorUserId,
  fetchByFeedCreatorCompanyId,
  searchByName,
  searchFeedByEvent,
  getFeedWithAssociationData,
  notificationAdd,
  fetchByFeedCreatorCompanyIdwithEvent,
};
