const db = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

const add = async (
  feed_content,
  feed_creator_user_id,
  feed_creator_company_id,
  search_tags,
  share_count,
  like_count,
  event_id,
  feed_type,
  //feed_content_html,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO feeds (feed_id , feed_content, feed_creator_user_id, feed_creator_company_id,  search_tags, share_count, like_count, created_date, updated_date,event_id,feed_type) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`;

    result = await transaction.one(query, [
      uuidv4(),
      feed_content,
      feed_creator_user_id,
      feed_creator_company_id,
      search_tags,
      share_count,
      like_count,
      currentDate,
      currentDate,
      event_id,
      feed_type,
      //feed_content_html,
    ]);
    return result;
  } catch (error) {
    console.log('Error occurred in feedDao add', error);
    throw error;
  }
};

const edit = async (
  feed_content,
  feed_creator_user_id,
  feed_creator_company_id,
  search_tags,
  share_count,
  like_count,
  //feed_content_html,
  feed_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `UPDATE feeds SET  feed_content=$1, feed_creator_user_id=$2, feed_creator_company_id=$3,  search_tags=$4, share_count=$5, like_count=$6, updated_date=$7 WHERE feed_id=$8 RETURNING *`;
    result = await transaction.one(query, [
      feed_content,
      feed_creator_user_id,
      feed_creator_company_id,
      search_tags,
      share_count,
      like_count,
      currentDate,
      //feed_content_html,
      feed_id,
    ]);
    return result;
  } catch (error) {
    console.log('Error occurred in feedDao update', error);
    throw error;
  }
};

const editLikeCount = async (feed_id, like_count, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `UPDATE feeds SET  like_count=$1 WHERE feed_id=$2 RETURNING *`;
    result = await transaction.one(query, [like_count, feed_id]);
    return result;
  } catch (error) {
    console.log('Error occurred in feedDao update Like Count', error);
    throw error;
  }
};

const editShareCount = async (feed_id, share_count, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `UPDATE feeds SET  share_count=$1 WHERE feed_id=$2 RETURNING *`;
    result = await transaction.one(query, [share_count, feed_id]);
    return result;
  } catch (error) {
    console.log('Error occurred in feedDao update Share Count', error);
    throw error;
  }
};

const getById = async (feed_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = 'select * from feeds where feed_id = $1 and is_delete = false';
    result = await transaction.oneOrNone(query, [feed_id]);
    return result;
  } catch (error) {
    console.log('Error occurred in feedDao getById', error);
    throw error;
  }
};

const getFeedWithAssociationData = async (
  feed_id,
  id,
  type,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let condition =
      type === 'C' ? 'l.company_id' : type === 'U' ? 'l.user_id' : 'l.event_id';
    let query = `select
          f.*,
          row_to_json(l) as like,
          count(ci.comment_id) :: INTEGER as comment_count,
          row_to_json(u) as user,
          row_to_json(c) as company,
          row_to_json(t2.*) as feed_share,
          row_to_json(e.*) as event 
        from
          feeds f
        left join users u on
          u.user_id = f.feed_creator_user_id
        left join (
          select
            c.*,
            cu.user_id as created_by
          from
            company c
          left join company_users cu on
            cu.company_id = c.company_id
            and cu.user_type ='p' ) c on
          c.company_id = f.feed_creator_company_id
        left join comment_info ci on
          f.feed_id = ci.feed_id
          left join events e 
          on e.event_id =f.event_id 
        left join likes l on
          l.feed_id = f.feed_id
          and l.is_delete = false
          and l.comment_id isnull
          and ${condition} ='${id}'
        left join (
          select
            fs2.feed_id as original_feed_id,
            f3.*,
            row_to_json(u1)::jsonb as user,
            row_to_json(c1)::jsonb as company,
            row_to_json(e2)::jsonb as event
          from
            feed_share fs2
          left join feeds f3 on
            fs2.shared_feed_id = f3.feed_id
          left join users u1 on
            u1.user_id = f3.feed_creator_user_id
          left join company c1 on
            c1.company_id = f3.feed_creator_company_id
          left join events e2 on
            e2.event_id = f3.event_id 
                ) t2 on
          t2.original_feed_id = f.feed_id
        where
          f.feed_id = '${feed_id}'
          and f.is_delete = false
        group by
          l.* ,
          f.feed_id ,
          c.company_id,
          c.*,
          u.user_id,
          t2.*,
          e.*`;
    result = await transaction.oneOrNone(query, []);
    return result;
  } catch (error) {
    console.log('Error occurred in feedDao getFeedWithAssociationData', error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = 'select * from feeds where is_delete = false';
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log('Error occurred in feedDao getAll', error);
    throw error;
  }
};

// const deleteById = async (feed_id, connectionObj = null) => {
//     try {
//         let transaction = connectionObj !== null ? connectionObj : db
//         let query = 'delete from feeds where feed_id = $1 RETURNING *'
//         result = await transaction.oneOrNone(query, [feed_id])
//         return result;
//     }
//     catch (error) {
//         console.log("Error occurred in feedDao deleteById", error)
//         throw error;
//     }
// }

const getFeedsByHashTag = async (hash_Tag, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select f.* from hashtag_feeds hf left join hashtags h on hf.hashtag_id =h.hashtag_id left join feeds f on hf.feed_id = f.feed_id where h.hashtag_title and is_delete = false like '${hash_Tag}%'`;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log('Error occurred in feedDao getFeedsByHashTag', error);
    throw error;
  }
};

const getEventNameByFeedId = async (feed_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
            e.event_name
        from
            feeds f
        left join events e 
        on
            f.event_id = e.event_id
        where
            f.feed_id = $1`;
    result = await transaction.oneOrNone(query, [feed_id]);
    return result;
  } catch (error) {
    console.log('Error occurred in feedDao getEventNameByFeedId', error);
    throw error;
  }
};

const deleteFeed = async (feed_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;

    let query1 = `delete from hashtag_feeds hs where hs.feed_id ='${feed_id}'~delete from feed_tags ft where ft.feed_id ='${feed_id}'~delete from feeds f where f.feed_id ='${feed_id}' RETURNING *`;
    // let query2=`delete from feed_tags ft where ft.feed_id ='${feed_id}'`;
    // let query3=`delete from feeds f where f.feed_id ='${feed_id}' RETURNING *`
    let query = query1.split('~');
    // let query = 'delete from feeds where feed_id = $1 RETURNING *'
    let result = null;
    for (let i = 0; i < 3; i++) {
      result = await transaction.oneOrNone(query[i], [feed_id]);
    }
    return result;
  } catch (error) {
    console.log('Error occurred in feedDao deleteById', error);
    throw error;
  }
};

const customQueryExecutor = async (customQuery, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = customQuery;
    result = await transaction.query(query, []);
    return result;
  } catch (error) {
    console.log('Error occurred in feedDao customQueryExecutor', error);
    throw error;
  }
};

const getByFeedCreaterUserId = async (
  feed_creator_user_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      'select * from feeds where feed_creator_user_id = $1 and is_delete = false order by created_date';
    result = await transaction.manyOrNone(query, [feed_creator_user_id]);
    return result;
  } catch (error) {
    console.log('Error occurred in feedDao getByFeedCreaterUserId', error);
    throw error;
  }
};

const getByFeedCreaterCompanyId = async (
  feed_creator_company_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      'select * from feeds where feed_creator_company_id = $1 and is_delete = false order by created_date';
    result = await transaction.manyOrNone(query, [feed_creator_company_id]);
    return result;
  } catch (error) {
    console.log('Error occurred in feedDao getByFeedCreaterCompanyId', error);
    throw error;
  }
};

const deleteById = async (feed_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      'update feeds set is_delete = true where feed_id = $1 RETURNING *';
    result = await transaction.oneOrNone(query, [feed_id]);
    return result;
  } catch (error) {
    console.log('Error occurred in feedDao deleteById', error);
    throw error;
  }
};

module.exports = {
  add,
  edit,
  editLikeCount,
  editShareCount,
  getById,
  getAll,
  deleteById,
  customQueryExecutor,
  deleteFeed,
  getFeedsByHashTag,
  getEventNameByFeedId,
  getByFeedCreaterUserId,
  getByFeedCreaterCompanyId,
  getFeedWithAssociationData,
};
