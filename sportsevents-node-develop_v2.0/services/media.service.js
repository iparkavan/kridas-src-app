const db = require("../utils/db");
const mediaDao = require("../dao/media.dao");
const { feedDefaultContent } = require("../utils/util");
const { cloudinaryUpload } = require("../utils/common");
const feedDao = require("../dao/feeds.dao");
const feedMediaDao = require("../dao/feedMedia.dao");

/**
 *Method to create new media
 * @param {JSon} body
 */
const createMedia = async (body, connectionObj = null) => {
  let result = null;
  try {
    const {
      media_type,
      media_url,
      media_url_meta,
      media_desc,
      media_creator_user_id,
      media_creator_company_id,
      search_tags,
      media_creator_event_id,
    } = body;

    result = await mediaDao.add(
      media_type,
      media_url,
      media_url_meta,
      media_desc,
      media_creator_user_id,
      media_creator_company_id,
      search_tags,
      media_creator_event_id,
      connectionObj
    );
    return result;
  } catch (error) {
    console.log("Error occurred in createMedia", error);
    throw error;
  }
};

/**
 * Method to getAll media
 */

const fetchAll = async () => {
  let result = null;
  try {
    let data = await mediaDao.getAll();
    result = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetchAll", error);
    throw error;
  }
};

/**
 * Method to get media user based on media id
 * @param {uuid}  media_id
 */

const fetchMedia = async (media_id) => {
  let result = {
    data: null,
  };
  try {
    let data = await mediaDao.getById(media_id);
    if (data === null) result = { message: "media not exist" };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetchMedia ", error);
    throw error;
  }
};

/**
 *Method to update existing media_id
 * @param {JSon} body
 */

const editMedia = async (body, connectionObj = null) => {
  let result = null;
  try {
    const {
      media_id,
      media_type,
      media_url,
      media_url_meta,
      media_desc,
      media_creator_user_id,
      media_creator_company_id,
      search_tags,
      media_creator_event_id,
    } = body;
    let media = null;

    media = await mediaDao.getById(media_id);
    if (media === null) return (result = { message: "media not exist" });

    result = await mediaDao.edit(
      media_type,
      media_url,
      media_url_meta,
      media_desc,
      media_creator_user_id,
      media_creator_company_id,
      search_tags,
      media_creator_event_id,
      media_id,
      connectionObj
    );
    return result;
  } catch (error) {
    console.log("Error occurred in editMedia", error);
    throw error;
  }
};

/**
 * Method to delete media based on media_id
 * @param {uuid} media_id
 */
const deleteMedia = async (media_id) => {
  try {
    let media = {};
    let data = await mediaDao.deleteById(media_id);
    if (data === null) media = { message: "media not exist" };
    else media["data"] = "Success";
    return media;
  } catch (error) {
    console.log("Error occurred in delete media_id: ", error);
    throw error;
  }
};

/**
 *Method For Pagination By Media Creator User Id
 * @param {JSon} body
 */

const fetchByMediaCreatorUserId = async (body) => {
  try {
    let result = null;
    const { page = 0, sort = "desc", size = 5, user_id, type = null } = body;
    let query = `select m.*,jsonb_build_object('id',u.user_id,'name',concat(u.first_name,' ',u.last_name),'avatar',u.user_profile_img,'type','U')as User from media m left join users u on m.media_creator_user_id = u.user_id where m.media_creator_user_id='${user_id}' `;
    let countQuery = `select count(*) from media m  where m.media_creator_user_id = '${user_id}' `;
    let offset = page > 0 ? page * size : 0;

    if (type !== null) {
      query = query + `and m.media_type='${type}'`;
      countQuery = countQuery + `and m.media_type ='${type}'`;
    }
    query =
      query + `order by m.updated_date ${sort} limit ${size} offset ${offset}`;

    let data = await mediaDao.customQueryExecutor(query);
    let count = await mediaDao.customQueryExecutor(countQuery);
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
    console.log("Error occurred in fetchMedia", error);
    throw error;
  }
};

/**
 *Method to get tagged media by user id
 * @param {JSon} body
 */
const fetchTaggedMediaByUserId = async (body) => {
  try {
    let result = null;
    const { page = 0, sort = "desc", size = 5, user_id, type = null } = body;
    let sub_query = `select fm2.media_id from feed_media fm2 where fm2.feed_id in (select ft2.feed_id from feed_tags ft2 where ft2.user_id ='${user_id}')`;
    let query = `select m.*,jsonb_build_object('id',u.user_id,'name',concat(u.first_name,' ',u.last_name),'avatar',u.user_profile_img,'type','U')as User from media m left join users u on m.media_creator_user_id = u.user_id where m.media_id in (${sub_query}) `;
    let countQuery = `select count(*) from media m  where m.media_id in (${sub_query}) `;
    let offset = page > 0 ? page * size : 0;

    if (type !== null) {
      query = query + `and m.media_type='${type}'`;
      countQuery = countQuery + `and m.media_type ='${type}'`;
    }
    query =
      query + `order by m.updated_date ${sort} limit ${size} offset ${offset}`;

    let data = await mediaDao.customQueryExecutor(query);
    let count = await mediaDao.customQueryExecutor(countQuery);
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
    console.log("Error occurred in fetchTaggedMediaByUserId", error);
    throw error;
  }
};

/**
 *Method to get tagged media by company id
 * @param {JSon} body
 */
const fetchTaggedMediaByCompanyId = async (body) => {
  try {
    let result = null;
    const { page = 0, sort = "desc", size = 5, company_id, type = null } = body;
    let sub_query = `select fm2.media_id from feed_media fm2 where fm2.feed_id in (select ft2.feed_id from feed_tags ft2 where ft2.company_id ='${company_id}')`;
    let query = `select m.*,jsonb_build_object('id',c.company_id,'name',c.company_name,'avatar',c.company_profile_img,'type','C') as company from media m left join company c on c.company_id =m.media_creator_company_id where m.media_id in (${sub_query}) `;
    let countQuery = `select count(*) from media m  where m.media_id in (${sub_query}) `;

    /*  let query = `select
      m.*,
      case 
        when m.media_creator_company_id is not null
        then jsonb_build_object('id', c.company_id, 'name', c.company_name, 'avatar', c.company_profile_img, 'type', 'C')
        when m.media_creator_user_id is not null
        then jsonb_build_object('id', u.user_id, 'name', concat(u.first_name, ' ', u.last_name) , 'avatar', u.user_profile_img, 'type', 'U')
        else jsonb_build_object('id', e.event_id, 'name', e.event_name, 'avatar', e.event_logo, 'type', 'E')
      end as detail
    from
      media m
    left join company c on
      c.company_id = m.media_creator_company_id
    left join users u on
      u.user_id = m.media_creator_user_id
    left join events e on
      e.event_id = m.media_creator_event_id
    where
      m.media_id in (
      select
        fm2.media_id
      from
        feed_media fm2
      where
        fm2.feed_id in (
        select
          ft2.feed_id
        from
          feed_tags ft2
        where
          ft2.company_id = '${company_id}')) `;

    let countQuery = `select
      count(*)
    from
      media m
    left join company c on
      c.company_id = m.media_creator_company_id
    left join users u on
      u.user_id = m.media_creator_user_id
    left join events e on
      e.event_id = m.media_creator_event_id
    where
      m.media_id in (
      select
        fm2.media_id
      from
        feed_media fm2
      where
        fm2.feed_id in (
        select
          ft2.feed_id
        from
          feed_tags ft2
        where
          ft2.company_id = '${company_id}')) `;
 */
    let offset = page > 0 ? page * size : 0;

    if (type !== null) {
      query = query + `and m.media_type='${type}'`;
      countQuery = countQuery + `and m.media_type ='${type}'`;
    }
    query =
      query + `order by m.updated_date ${sort} limit ${size} offset ${offset}`;

    let data = await mediaDao.customQueryExecutor(query);
    let count = await mediaDao.customQueryExecutor(countQuery);
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
    console.log("Error occurred in fetchTaggedMediaByUserId", error);
    throw error;
  }
};

/**
 *Method to get tagged media by event id
 * @param {JSon} body
 */
const fetchTaggedMediaByEventId = async (body) => {
  try {
    let result = null;
    const { page = 0, sort = "desc", size = 5, event_id, type = null } = body;
    let sub_query = `
      select
        fm2.media_id
      from
        feed_media fm2
      where
        fm2.feed_id in (
        select
          ft2.feed_id
        from
          feed_tags ft2
        where
          ft2.event_id = '${event_id}')`;
    let query = `select
        m.*,
        jsonb_build_object('id', e.event_id , 'name', e.event_name , 'avatar', e.event_logo , 'type', 'E') as event
      from
        media m
      left join events e on
        e.event_id = m.media_creator_event_id
      where
        m.media_id in (${sub_query})`;
    let countQuery = `select count(*) from media m  where m.media_id in (${sub_query}) `;
    let offset = page > 0 ? page * size : 0;

    if (type !== null) {
      query = query + `and m.media_type='${type}'`;
      countQuery = countQuery + `and m.media_type ='${type}'`;
    }
    query =
      query + `order by m.updated_date ${sort} limit ${size} offset ${offset}`;

    let data = await mediaDao.customQueryExecutor(query);
    let count = await mediaDao.customQueryExecutor(countQuery);
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
    console.log("Error occurred in fetchTaggedMediaByEventId", error);
    throw error;
  }
};

/**
 *Method to get media by event id
 * @param {JSon} body
 */
const fetchMediaByEventId = async (body) => {
  try {
    let result = null;
    const { page = 0, sort = "desc", size = 5, event_id, type = null } = body;
    let sub_query = `select fm.media_id from feeds f left join feed_media fm on fm.feed_id = f.feed_id where f.event_id = '${event_id}' and f.is_delete = false and fm.media_id notnull`;
    let query = `select m.*, jsonb_build_object('id', c.company_id, 'name', c.company_name, 'avatar', c.company_profile_img, 'type', 'C') as company from media m left join company c on c.company_id = m.media_creator_company_id where m.media_id in (${sub_query}) `;
    let countQuery = `select count(*) from media m  where m.media_id in (${sub_query}) `;
    let offset = page > 0 ? page * size : 0;

    if (type !== null) {
      query = query + `and m.media_type='${type}'`;
      countQuery = countQuery + `and m.media_type ='${type}'`;
    }
    query =
      query + `order by m.updated_date ${sort} limit ${size} offset ${offset}`;

    let data = await mediaDao.customQueryExecutor(query);
    let count = await mediaDao.customQueryExecutor(countQuery);
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
    console.log("Error occurred in fetchMediaByEventId", error);
    throw error;
  }
};

/**
 *Method For Pagination By Media Creator Company Id
 * @param {JSon} body
 */
const fetchByMediaCreatorCompanyId = async (body) => {
  try {
    let result = null;
    const { page = 0, sort = "desc", size = 5, company_id, type = null } = body;
    let countQuery = `select count(*) from media m where m.media_creator_company_id = '${company_id}' `;
    let query = `select m.*,jsonb_build_object('id',c.company_id,'name',c.company_name,'avatar',c.company_profile_img,'type','C') as company from media m left join company c on c.company_id =m.media_creator_company_id where m.media_creator_company_id ='${company_id}' `;
    let offset = page > 0 ? page * size : 0;

    if (type !== null) {
      query = query + `and m.media_type='${type}'`;
      countQuery = countQuery + `and m.media_type ='${type}'`;
    }

    query =
      query + `order by m.updated_date ${sort} limit ${size} offset ${offset}`;

    let data = await mediaDao.customQueryExecutor(query);
    let count = await mediaDao.customQueryExecutor(countQuery);
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
    console.log("Error occurred in fetchMedia", error);
    throw error;
  }
};

/**
 *Get Feed By Media Id
 * @param {uuid} media_id
 */
const getFeedByMedia = async (media_id, id, type) => {
  let result = {
    data: null,
  };
  try {
    let data = await mediaDao.getFeedByMedia(media_id, id, type);
    if (data.length === 0) result = { message: "Media not exist" };
    else result["data"] = data;
    return result;
  } catch {
    console.log("Error occurred in getMediabyfeeds ", error);
    throw error;
  }
};

/**
 * Method for media upload
 */
const mediaUpload = async (body) => {
  try {
    let result = [];
    let metaData = null;
    let image = null;
    const { files = {}, user_id, company_id } = body;
    let id = user_id !== null ? user_id : company_id;
    let defaultContent = { ...feedDefaultContent };
    let path = `gallery/${id}`;
    let feed_type = "M";
    result = await db
      .tx(async (transaction) => {
        if (JSON.stringify(files) !== JSON.stringify({})) {
          let medias = [];
          let j = 0;
          for (const file of files?.file) {
            if (file !== null && file !== undefined) {
              image = await cloudinaryUpload(file, path);
              metaData = image;
            }
            let desc = null;
            let media_type = metaData?.resource_type === "image" ? "I" : "V";
            let media = null;
            metaData["src"] = metaData?.url;
            media = await mediaDao.add(
              media_type,
              metaData?.url,
              metaData,
              desc,
              user_id,
              company_id,
              ["upload"],
              transaction
            );
            let data = {
              type: "IMAGE",
              mutability: "IMMUTABLE",
              data: {},
            };
            data["type"] = media_type === "I" ? "IMAGE" : "VIDEO";
            data["data"] = metaData;
            defaultContent["entityMap"][j.toString()] = data;
            console.log("check defaut data---->", defaultContent);
            medias.push(media);
            j++;
          }

          let feed = await feedDao.add(
            JSON.stringify(defaultContent),
            user_id,
            company_id,
            ["test"],
            0,
            0,
            null,
            feed_type,
            transaction
          );
          for (const media of medias) {
            let feedMedia = await feedMediaDao.add(
              media.media_id,
              feed.feed_id,
              transaction
            );
          }
          return medias;
        }
      })
      .then((data) => {
        console.log("successfully data returned", data);
        return data;
      })
      .catch((error) => {
        throw error;
      });
    return result;
  } catch (error) {
    console.log("Error occurred in mediaUpload", error);
    throw error;
  }
};

module.exports = {
  createMedia,
  fetchAll,
  fetchMedia,
  editMedia,
  deleteMedia,
  fetchByMediaCreatorUserId,
  fetchByMediaCreatorCompanyId,
  fetchTaggedMediaByUserId,
  fetchTaggedMediaByCompanyId,
  getFeedByMedia,
  fetchMediaByEventId,
  mediaUpload,
  fetchTaggedMediaByEventId,
};
