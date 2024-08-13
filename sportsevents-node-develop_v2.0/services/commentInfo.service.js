const commentInfoDao = require('../dao/commentInfo.dao');
const companyDao = require('../dao/company.dao');
const userDao = require('../dao/user.dao');
const customQueryExecutor = require('../dao/common/utils.dao');
const db = require('../utils/db');
const activityLogDao = require('../dao/activityLog.dao');
const commentTagDao = require('../dao/commentTag.dao');
const feedDao = require('../dao/feeds.dao');

/**
 *Method to create new createComment Info
 * @param {JSon} body
 */
const createCommentInfo = async (body) => {
  let result = null;
  try {
    const {
      company_id,
      user_id,
      contents,
      feed_id,
      parent_comment_id,
      event_id,
    } = body;
    let company = await companyDao.getById(company_id);
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

        let feedDetails = await feedDao.getById(feed_id, transaction);

        let commentInfoAdd = await commentInfoDao.add(
          company_id,
          user_id,
          contents,
          feed_id,
          parent_comment_id,
          event_id,
          transaction
        );
        // await activityLogDao.add(
        //   "INTR",
        //   "COMMENT",
        //   user_id,
        //   company_id,
        //   feed_id,
        //   null,
        //   "CMT",
        //   event_id,
        //   transaction
        // );

        await activityLogDao.addActivityLog(
          'FED',
          'CMT',
          company_id,
          event_id,
          feed_id,
          user_id,
          null
        );

        if (feedDetails?.feed_creator_user_id) {
          await activityLogDao.addActivityLog(
            'FED',
            'CFD',
            null,
            null,
            feed_id,
            feedDetails?.feed_creator_user_id,
            null
          );
        }

        let entityMap = null;
        entityMap = contents?.entityMap;

        if (entityMap) {
          let arrayObj = Object.values(entityMap);

          for (let e of arrayObj) {
            let type = e?.data?.mention?.type;
            let Id = e?.data?.mention?.id;
            // await activityLogDao.add(
            //   "TAGI",
            //   "COMMENT-TAG",
            //   type === "U" ? Id : null,
            //   type === "C" ? Id : null,
            //   feed_id,
            //   null,
            //   "CTG",
            //   type === "E" ? Id : null,
            //   transaction
            // );
            if (e?.data?.mention) {
              await activityLogDao.addActivityLog(
                'CMT',
                'TAG',
                type === 'C' ? Id : null,
                type === 'E' ? Id : null,
                feed_id,
                type === 'U' ? Id : null,
                null
              );

              await commentTagDao.add(
                feed_id,
                type === 'U' ? Id : null,
                type === 'C' ? Id : null,
                commentInfoAdd?.comment_id,
                type === 'E' ? Id : null,
                transaction
              );
            }
          }
        }

        return commentInfoAdd;
        //   }
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log('failure, ROLLBACK was executed', error);
        throw error;
      });
    return result;
  } catch (error) {
    console.log('Error occurred in addCommentInfo', error);
    throw error;
  }
};

/**
 *Method to update existing comment information
 * @param {JSon} body
 */
const editCommentInfo = async (body) => {
  let result = null;
  try {
    const {
      company_id = null,
      user_id = null,
      contents,
      feed_id,
      parent_comment_id = null,
      event_id,
      comment_id,
    } = body;
    let company = await companyDao.getById(company_id);
    let user = null;
    let CommentInfo = null;
    user = await userDao.getById(user_id);

    if (comment_id !== null)
      CommentInfo = await commentInfoDao.getById(comment_id);

    if (CommentInfo === null && comment_id !== null) {
      result = { message: 'comment information not exist' };
      return result;
    } else if (user === null && user_id !== null) {
      result = { message: 'User not found' };
      return result;
    } else if (company === null && company_id !== null) {
      result = { message: 'company not found' };
      return result;
    } else {
      result = await commentInfoDao.edit(
        company_id,
        user_id,
        contents,
        feed_id,
        parent_comment_id,
        event_id,
        comment_id
      );
      return result;
    }
  } catch (error) {
    console.log('Error occurred in editCommentInfo', error);
    throw error;
  }
};

/**
 * Method to get comment info based on comment id
 * @param {int} commentId
 */
const fetchCommentInfo = async (commentId) => {
  try {
    let result = {};
    let data = await commentInfoDao.getById(commentId);
    if (data === null) result = { message: 'comment information not exist' };
    else result['data'] = data;
    return result;
  } catch (error) {
    console.log('Error occurred in fetchCommentInfo', error);
    throw error;
  }
};

/**
 * Method to get comment info based on Parent Comment Id by Pagination
 * @param {JSON} body
 */

const fetchByParentCommentId = async (body) => {
  try {
    let result = null;
    const {
      page = 0,
      sort = 'desc',
      size = 5,
      parent_comment_id,
      feed_id,
    } = body;
    let query = `select
            ci.*,
            case
              when ci.event_id is not null then jsonb_build_object('id', e.event_id , 'name', e.event_name , 'avatar' , e.event_logo , 'type' , 'E')
              when ci.user_id is null then jsonb_build_object('id', c.company_id , 'name', c.company_name , 'avatar' , c.company_profile_img , 'type' , 'C')
              else jsonb_build_object('id' , u.user_id, 'name', concat(u.first_name, ' ', u.last_name) , 'avatar' , u.user_profile_img , 'type' , 'U')
            end as detail,
            res.commentlikecount
          from
            comment_info ci
          left join company c on
            c.company_id = ci.company_id
          left join users u on
            u.user_id = ci.user_id
          left join events e on
            e.event_id = ci.event_id 
          left join
                      (
            select
              l2.feed_id,
              count(*)as commentlikecount ,
              l2.comment_id
            from
              likes l2
            where
              l2.
                      comment_id is not null
            group by
              l2.feed_id,
              l2.comment_id) as res
                      on
            res.feed_id = ci.feed_id
            and res.comment_id = ci.comment_id
            where  `;

    let subQuery1 = ` ci.parent_comment_id = ${parent_comment_id} `;
    let subQuery2 = ` ci.feed_id = '${feed_id}' and ci.parent_comment_id is null `;

    // let countQuery = `	select count(*) from comment_info ci where parent_comment_id='${parent_comment_id}' `;
    let offset = page > 0 ? page * size : 0;

    if (parent_comment_id) {
      countQuery = `	select count(*) from comment_info ci where parent_comment_id='${parent_comment_id}' `;
      query =
        query +
        subQuery1 +
        `order by ci.updated_date ${sort} limit ${size} offset ${offset}`;
    }
    if (feed_id && parent_comment_id === undefined) {
      query =
        query +
        subQuery2 +
        `order by ci.updated_date ${sort} limit ${size} offset ${offset}`;
      countQuery = `	select count(*) from comment_info ci where ci.feed_id = '${feed_id}' and ci.parent_comment_id is null `;
    }

    // query = query + `order by ci.updated_date ${sort} limit ${size} offset ${offset}`;
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
    console.log('Error occurred in fetchByParentCommentId', error);
    throw error;
  }
};

/**
 * Method to get comment info based on Feed Id by Pagination
 * @param {JSON} body
 */

const fetchByFeedId = async (body) => {
  try {
    let result = null;
    const { page = 0, sort = 'desc', size = 5, feed_id } = body;
    let query = `with parent_comment as (
            select feed_id, comment_id, parent_comment_id, contents, ci.user_id, c.company_id,ci.updated_date ,
            case
                when ci.user_id is null then jsonb_build_object('id', c.company_id, 'name', c.company_name, 'avatar', c.company_profile_img, 'type', 'C')
                else jsonb_build_object('id', u.user_id, 'name', concat(u.first_name, ' ', u.last_name), 'avatar', u.user_profile_img, 'type', 'U')
            end as detail
            from comment_info ci
            left join users u
            on u.user_id = ci.user_id
            left join company c
            on c.company_id = ci.company_id
            ),
            child_comment as (
            select
            array_agg(row_to_json(a)) as reply,
            parent_comment_id from (select feed_id, comment_id, parent_comment_id,ci2.updated_date
            contents, u1.user_id, c1.company_id, null reply,
            case
                when ci2.user_id is null then jsonb_build_object('id', c1.company_id, 'name', c1.company_name, 'avatar', c1.company_profile_img, 'type', 'C')
                else jsonb_build_object('id', u1.user_id, 'name', concat(u1.first_name, ' ', u1.last_name), 'avatar', u1.user_profile_img, 'type', 'U')
            end as detail
            from comment_info ci2
            left join users u1
            on u1.user_id = ci2.user_id
            left join company c1
            on c1.company_id = ci2.company_id
            ) a
            group by parent_comment_id
            )
            select
            a.feed_id, a.comment_id, a.parent_comment_id, a.contents, a.user_id, a.company_id, a.detail,a.updated_date,res.commentlikecount,
            case when b.reply is null
            then '{}' else b.reply end as reply
            from parent_comment a
            left join child_comment b
            on b.parent_comment_id = a.comment_id
           	left join
           	(select l2.feed_id,count(*)as commentlikecount ,l2.comment_id from likes l2
           	where  l2.
           	comment_id is not null
			group by l2.feed_id,l2.comment_id) as res
           	on
           	res.feed_id =a.feed_id and res.comment_id=a.comment_id
            where a.feed_id = '${feed_id}'`;

    let countQuery = `select count(v) from (with parent_comment as (
            select feed_id, comment_id, parent_comment_id, contents, ci.user_id, c.company_id,ci.updated_date ,
            case
                when ci.user_id is null then jsonb_build_object('id', c.company_id, 'name', c.company_name, 'avatar', c.company_profile_img, 'type', 'C')
                else jsonb_build_object('id', u.user_id, 'name', concat(u.first_name, ' ', u.last_name), 'avatar', u.user_profile_img, 'type', 'U')
            end as detail
            from comment_info ci
            left join users u
            on u.user_id = ci.user_id
            left join company c
            on c.company_id = ci.company_id
            ),
            child_comment as (
            select
            array_agg(row_to_json(a)) as reply,
            parent_comment_id from (select feed_id, comment_id, parent_comment_id,ci2.updated_date
            contents, u1.user_id, c1.company_id, null reply,
            case
                when ci2.user_id is null then jsonb_build_object('id', c1.company_id, 'name', c1.company_name, 'avatar', c1.company_profile_img, 'type', 'C')
                else jsonb_build_object('id', u1.user_id, 'name', concat(u1.first_name, ' ', u1.last_name), 'avatar', u1.user_profile_img, 'type', 'U')
            end as detail
            from comment_info ci2
            left join users u1
            on u1.user_id = ci2.user_id
            left join company c1
            on c1.company_id = ci2.company_id
            ) a
            group by parent_comment_id
            )
            select
            a.feed_id, a.comment_id, a.parent_comment_id, a.contents, a.user_id, a.company_id, a.detail,a.updated_date,res.commentlikecount,
            case when b.reply is null
            then '{}' else b.reply end as reply
            from parent_comment a
            left join child_comment b
            on b.parent_comment_id = a.comment_id
           	left join
           	(select l2.feed_id,count(*)as commentlikecount ,l2.comment_id from likes l2
           	where  l2.
           	comment_id is not null
			group by l2.feed_id,l2.comment_id) as res
           	on
           	res.feed_id =a.feed_id and res.comment_id=a.comment_id
            where a.feed_id = '${feed_id}')v`;
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
    console.log('Error occurred in fetchByFeedId', error);
    throw error;
  }
};

/**
 * Method to get all comment info
 * @param {int} commentId
 */
const fetchAll = async (commentId) => {
  try {
    let data = await commentInfoDao.getAll();
    return data;
  } catch (error) {
    console.log('Error occurred in fetchCommentInfo', error);
    throw error;
  }
};

/**
 * Method to delete comment info based on comment id
 * @param {int} commentId
 */
const deleteCommentInfo = async (commentId) => {
  try {
    let result = {};
    let commentTagData = await commentTagDao.getByCommentId(commentId);
    if (commentTagData) {
      let commenTagDataDelete = await commentTagDao.deleteById(
        commentTagData?.comment_tag_id
      );
    }
    let data = await commentInfoDao.deleteById(commentId);
    if (data === null) result = { message: 'comment information not exist' };
    else result['data'] = 'Successfully Deleted!';
    return result;
  } catch (error) {
    console.log('Error occurred in deleteCommentInfo', error);
    throw error;
  }
};

/**
 * Method to Get Comment Info By Feed Id
 * @param {uuid} feed_id
 * @returns
 */
const fetchCommentInfoByFeedId = async (feed_id) => {
  try {
    let result = {};
    let data = {};
    data = await commentInfoDao.getCommentByFeedId(feed_id);
    if (data.length > 0) result = data;
    else result = { message: 'comment information not exist' };
    return result;
  } catch (error) {
    console.log('Error occurred in fetchCommentInfo', error);
    throw error;
  }
};

module.exports = {
  createCommentInfo,
  editCommentInfo,
  fetchCommentInfo,
  fetchByParentCommentId,
  deleteCommentInfo,
  fetchAll,
  fetchCommentInfoByFeedId,
  fetchByFeedId,
};
