const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");

const add = async (
  article_heading,
  cover_image_url,
  cover_image_url_meta,
  article_content,
  user_id,
  company_id,
  article_publish_status,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let is_deleted = "N";
    let query = `INSERT INTO articles (article_id,article_heading, cover_image_url, cover_image_url_meta, article_content, user_id, company_id, article_publish_status, is_deleted,  created_date, updated_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`;
    result = await transaction.one(query, [
      uuidv4(),
      article_heading,
      cover_image_url,
      cover_image_url_meta,
      article_content,
      user_id,
      company_id,
      article_publish_status,
      is_deleted,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in articles add", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      a.*,
      case
        when a.company_id is null
                then concat(u.first_name, ' ', u.last_name)
        else c.company_name
      end as name
    from
      articles a
    left join users u on
      u.user_id = a.user_id
    left join company c on
      c.company_id = a.company_id
    where
      a.is_deleted = false
      and a.article_publish_status = 'PUB'
    order by
      a.updated_date desc`;

    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in articles getAll", error);
    throw error;
  }
};

const getById = async (article_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      a.*,
      row_to_json(t1.*)::jsonb as feed,
      case 
        when a.company_id is null then json_build_object('id', u2.user_id, 'name', concat(u2.first_name, ' ', u2.last_name), 'avatar', u2.user_profile_img, 'type', 'U')
        else
        json_build_object('id', c2.company_id, 'name', c2.company_name, 'avatar', c2.company_profile_img, 'type', 'C')
      end as author
    from
      articles a
    left join article_feed af on
      af.article_id = a.article_id
    left join (
      select
        f.*,
        row_to_json(c)::jsonb as company,
        row_to_json(u)::jsonb as user
      from
        feeds f
      left join users u on
        u.user_id = f.feed_creator_user_id
      left join company c on
        c.company_id = f.feed_creator_company_id) t1 on
      t1.feed_id = af.feed_id
    left join users u2 on
      u2.user_id = a.user_id
    left join company c2 on
      c2.company_id = a.company_id
    where
      a.article_id = $1
      and a.is_deleted = false`;
    result = await transaction.oneOrNone(query, [article_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in Article Dao getById", error);
    throw error;
  }
};

// const getArticleById = async (article_id, connectionObj = null) => {
//   try {
//     let transaction = connectionObj !== null ? connectionObj : db;
//     let query = `select
//       a.*,
//       row_to_json(t1.*)::jsonb as feed,
//       case
//         when a.company_id is null then json_build_object('id', u2.user_id, 'name', concat(u2.first_name, ' ', u2.last_name), 'avatar', u2.user_profile_img, 'type', 'U')
//         else
//         json_build_object('id', c2.company_id, 'name', c2.company_name, 'avatar', c2.company_profile_img, 'type', 'C')
//       end as author,
//       v.content
//     from
//       articles a
//     left join article_feed af on
//       af.article_id = a.article_id
//     left join (
//       select
//         f.*,
//         row_to_json(c)::jsonb as company,
//         row_to_json(u)::jsonb as user
//       from
//         feeds f
//       left join users u on
//         u.user_id = f.feed_creator_user_id
//       left join company c on
//         c.company_id = f.feed_creator_company_id) t1 on
//       t1.feed_id = af.feed_id
//     left join users u2 on
//       u2.user_id = a.user_id
//     left join company c2 on
//       c2.company_id = a.company_id
//     left join (with data as (
//       select
//         (
//         select
//           (
//           select
//             a.article_content ::json->'blocks'
//           from
//             articles a
//           where
//             a.article_id = $1
//     )
//     )::jsonb as jsondata,
//         a.article_id as article_id
//       from
//         articles a
//       where
//         a.article_id = $1
//     )
//       select
//         elems.value -> 'text' as content,
//         article_id
//       from
//         data,
//         jsonb_array_elements(jsondata) as elems)v
//     on
//       v.article_id = a.article_id
//     where
//       a.article_id = $1
//       and a.is_deleted = false`;
//     result = await transaction.oneOrNone(query, [article_id]);
//     return result;
//   } catch (error) {
//     console.log("Error occurred in Article Dao getById", error);
//     throw error;
//   }
// };

const edit = async (
  article_heading,
  cover_image_url,
  cover_image_url_meta,
  article_content,
  user_id,
  company_id,
  article_publish_status,
  article_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let is_deleted = "N";
    let query = `update articles set  article_heading=$1, cover_image_url=$2, cover_image_url_meta=$3, article_content=$4, user_id=$5, company_id=$6, article_publish_status=$7, is_deleted=$8, created_date=$9, updated_date=$10 where article_id=$11 RETURNING *`;
    result = await transaction.one(query, [
      article_heading,
      cover_image_url,
      cover_image_url_meta,
      article_content,
      user_id,
      company_id,
      article_publish_status,
      is_deleted,
      currentDate,
      currentDate,
      article_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in ArticleDao edit", error);
    throw error;
  }
};

const deleteArticle = async (article_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "update articles set is_deleted = true where article_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [article_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in ArticleDao deleteById", error);
    throw error;
  }
};

const getByUserId = async (user_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from articles a where user_id = $1 and is_deleted = false";
    result = await transaction.manyOrNone(query, [user_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in Article Dao getByUserId", error);
    throw error;
  }
};

const getByCompanyId = async (company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from articles a where company_id = $1 and is_deleted = false";
    result = await transaction.manyOrNone(query, [company_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in Article Dao getByCompanyId", error);
    throw error;
  }
};

const getFeedIdByArticle = async (article_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from article_feed af where af.article_id = $1";
    result = await transaction.oneOrNone(query, [article_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in Article Dao getFeedIdByArticle", error);
    throw error;
  }
};

const updateIsFeature = async (
  is_featured,
  article_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update articles set is_featured =$1,updated_date=$2 where article_id =$3 returning *`;
    result = await transaction.one(query, [
      is_featured,
      currentDate,
      article_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in Article Dao updateIsFeature", error);
    throw error;
  }
};

module.exports = {
  add,
  getAll,
  getById,
  edit,
  deleteArticle,
  getByUserId,
  getByCompanyId,
  getFeedIdByArticle,
  updateIsFeature,
  // getArticleById,
};
