const db = require('../utils/db');

const add = async (
  company_id,
  user_id,
  contents,
  feed_id,
  parent_comment_id,
  event_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO comment_info (company_id, user_id,contents,feed_id,parent_comment_id,event_id,created_date,updated_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    result = await transaction.one(query, [
      company_id,
      user_id,
      contents,
      feed_id,
      parent_comment_id,
      event_id,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log('Error occurred in commentInfoDao add', error);
    throw error;
  }
};

const edit = async (
  company_id,
  user_id,
  contents,
  feed_id,
  parent_comment_id,
  event_id,
  comment_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update comment_info set company_id=$1,user_id=$2,contents=$3,feed_id=$4,parent_comment_id=$5,updated_date=$6,event_id=$7 where comment_id=$8 RETURNING *`;
    result = await transaction.one(query, [
      company_id,
      user_id,
      contents,
      feed_id,
      parent_comment_id,
      currentDate,
      event_id,
      comment_id,
    ]);
    return result;
  } catch (error) {
    console.log('Error occurred in companyInfoDao edit', error);
    throw error;
  }
};

const getById = async (comment_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = 'select * from comment_info where comment_id = $1';
    result = await transaction.oneOrNone(query, [comment_id]);
    return result;
  } catch (error) {
    console.log('Error occurred in commentInfoDao getById', error);
    throw error;
  }
};

const deleteById = async (comment_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = 'delete from comment_info where comment_id = $1 RETURNING *';
    result = await transaction.oneOrNone(query, [comment_id]);
    return result;
  } catch (error) {
    console.log('Error occurred in companyUserDao deleteById', error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = 'select * from comment_info';
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log('Error occurred in companyUserDao getAll', error);
    throw error;
  }
};

const getCommentByFeedId = async (feed_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `with parent_comment as (
            select feed_id, comment_id, parent_comment_id, contents, ci.user_id, c.company_id, 
            case
                when ci.user_id is null then jsonb_build_object('id', c.company_id, 'name', c.company_name, 'avatar', c.company_profile_img, 'type', 'C')
                else jsonb_build_object('id', u.user_id, 'name', concat(u.first_name, ' ', u.last_name), 'avatar', u.user_profile_img, 'type', 'U')
            end as detail
            from comment_info ci 
            left join users u
            on u.user_id = ci.user_id 
            left join company c
            on c.company_id = ci.company_id 
            where parent_comment_id is null 
            ),
            child_comment as (
            select 
            array_agg(row_to_json(a)) as reply,
            parent_comment_id from (select feed_id, comment_id, parent_comment_id, 
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
            where parent_comment_id is not null
            ) a
            group by parent_comment_id
            )
            select 
            a.feed_id, a.comment_id, a.parent_comment_id, a.contents, a.user_id, a.company_id, a.detail,
            case when b.reply is null 
            then '{}' else b.reply end as reply
            from parent_comment a 
            left join child_comment b 
            on b.parent_comment_id = a.comment_id 
            where a.feed_id = '${feed_id}';  
   `;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log('Error occurred in  getCommentByFeedId', error);
    throw error;
  }
};

module.exports = {
  add,
  edit,
  getById,
  deleteById,
  getAll,
  getCommentByFeedId,
};
