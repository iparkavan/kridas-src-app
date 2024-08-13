const activityLogDao = require("../dao/activityLog.dao");
const customQueryExecutor = require("../dao/common/utils.dao");

/**
 *Method to create new activity log
 * @param {JSon} body
 */
const createLog = async (body, connectionObj = null) => {
  try {
    const {
      event_type,
      event_action,
      user_id = null,
      company_id = null,
      event_type_ref_id = null,
      additional_info = null,
      event_ref_type = null,
      event_id = null,
    } = body;
    let result = await activityLogDao.add(
      event_type,
      event_action,
      user_id,
      company_id,
      event_type_ref_id,
      additional_info,
      event_ref_type,
      event_id,
      connectionObj
    );
    return result;
  } catch (error) {
    console.log("Error occurred in createLog", error);
    throw error;
  }
};

/**
 *Method to create new activity log
 * @param {JSon} body
 */
const addActivityLog = async (body) => {
  try {
    const {
      activityOn,
      activityType,
      companyId = null,
      eventId = null,
      eventTypeRefId = null,
      userId = null,
      additionalInfo = null,
    } = body;
    let result = await activityLogDao.addActivityLog(
      activityOn,
      activityType,
      companyId,
      eventId,
      eventTypeRefId,
      userId,
      additionalInfo
    );
    return result;
  } catch (error) {
    console.log("Error occurred in addActivityLog", error);
    throw error;
  }
};

/**
 *Method to create new activity log
 * @param {JSon} body
 */
const logOut = async (body, connectionObj = null) => {
  try {
    const { user_id } = body;
    // let result = await activityLogDao.add(
    //   "LOGAC",
    //   "LOGOUT",
    //   user_id,
    //   null,
    //   null,
    //   null,
    //   "LOGOUT",
    //   null,
    //   connectionObj
    // );
    let result = await activityLogDao.addActivityLog(
      "USR",
      "LGT",
      null,
      null,
      null,
      user_id,
      null
    );
    return result;
  } catch (error) {
    console.log("Error occurred in logOut", error);
    throw error;
  }
};

/**
 * Method to get log based on id and type
 * @param {UUID} id
 * @param {String} type
 * @param {JSON} connectionObj
 * @returns
 */
const fetchByIdAndType = async (id, type, connectionObj = null) => {
  try {
    let result = await activityLogDao.fetchByIdAndType(id, type, connectionObj);
    return result;
  } catch (error) {
    console.log("Error occurred in fetchByIdAndType", error);
    throw error;
  }
};

/**
 * Method to get id based activity log
 * @param {int} id
 * @param {json} connectionObj
 * @returns
 */
const fetchById = async (id, connectionObj = null) => {
  try {
    let result = await activityLogDao.fetchById(id, connectionObj);
    if (result === null) result = { message: "activity log not found" };
    return result;
  } catch (error) {
    console.log("Error occurred in fetchById", error);
    throw error;
  }
};

/**
 * Method for Pagination Based on User Id or Company id
 * @param {JSON} body
 * @returns
 */
const searchById = async (body) => {
  try {
    const { page = 0, sort = "desc", size = 5, id, type, event_type } = body;

    let query = `select
      al.*,
      case
        when al.user_id is null then jsonb_build_object('id', c.company_id, 'name', c.company_name, 'avatar', c.company_profile_img, 'type', 'C')
        else jsonb_build_object('id', u.user_id, 'name', concat(u.first_name, ' ', u.last_name), 'avatar', u.user_profile_img, 'type', 'U')
      end as detail,
      case
        when (al.event_ref_type = 'E'
        or al.event_ref_type = 'EVENT'
        or al.event_ref_type = 'UFWE'
        or al.event_ref_type = 'FWE') then json_build_object('id', e.event_id, 'name', e.event_name, 'avatar', e.event_logo, 'banner', e.event_banner, 'type', 'E')
        when (al.event_ref_type = 'SHR'
        or al.event_ref_type = 'TAG'
        or al.event_ref_type = 'LIKE'
        or al.event_ref_type = 'CMT'
        or al.event_ref_type = 'CTG'
        or al.event_ref_type = 'FEED'
        or al.event_ref_type = 'ARFD'
        or al.event_ref_type = 'RTN') then json_build_object('id', v.feed_id , 'feed_content', v.feed_content , 'like_count', v.like_count , 'share_count', v.share_count , 'feed_type', v.feed_type , 'type', 'F', 'details', v.details)
        when (al.event_ref_type = 'AR'
        or al.event_ref_type = 'ARTICLE')then json_build_object('id', a.article_id , 'name', a.article_heading , 'avatar', a.cover_image_url , 'banner', null, 'type', 'AR')
        when (al.event_ref_type = 'FWU'
        or al.event_ref_type = 'USER'
        or al.event_ref_type = 'UFWU') then json_build_object('id', u2.user_id, 'name', concat(u2.first_name, ' ', u2.last_name), 'avatar', u2.user_profile_img, 'type', 'U')
        when (al.event_ref_type = 'FWC'
        or al.event_ref_type = 'PAGE'
        or al.event_ref_type = 'UFWC') then json_build_object('id', c2.company_id, 'name', c2.company_name, 'avatar', c2.company_profile_img, 'type', 'C')
        else null
      end as action_details
    from
      activity_log al
    left join users u on
      al.user_id = u.user_id
    left join company c on
      al.company_id = c.company_id
    left join events e on
      e.event_id = al.event_type_ref_id::uuid
      and (al.event_ref_type = 'E'
        or al.event_ref_type = 'EVENT'
        or al.event_ref_type = 'UFWE'
        or al.event_ref_type = 'FWE')
    left join (
      select
        f.*,
        case
          when f.feed_creator_company_id is null 
            then jsonb_build_object('id', u.user_id, 'name', concat(u.first_name, ' ', u.last_name), 'avatar', u.user_profile_img, 'type', 'U')
          else
            jsonb_build_object('id', c.company_id, 'name', c.company_name, 'avatar', c.company_profile_img, 'type', 'C')
        end as details
      from
        feeds f
      left join users u on
        u.user_id = f.feed_creator_user_id
      left join company c on
        c.company_id = f.feed_creator_company_id)v on
      v.feed_id = al.event_type_ref_id::uuid
      and (al.event_ref_type = 'LIKE'
        or al.event_ref_type = 'RTN'
        or al.event_ref_type = 'SHR'
        or al.event_ref_type = 'CMT'
        or al.event_ref_type = 'CTG'
        or al.event_ref_type = 'FEED'
        or al.event_ref_type = 'TAG'
        or al.event_ref_type = 'ARFD')
    left join articles a on
      a.article_id = al.event_type_ref_id::uuid
      and (al.event_ref_type = 'AR'
        or al.event_ref_type = 'ARTICLE')
    left join users u2 on
      u2.user_id = al.event_type_ref_id::uuid
      and (al.event_ref_type = 'FWU'
        or al.event_ref_type = 'USER'
        or al.event_ref_type = 'UFWU')
    left join company c2 on
      c2.company_id = al.event_type_ref_id::uuid
      and (al.event_ref_type = 'FWC'
        or al.event_ref_type = 'PAGE'
        or al.event_ref_type = 'UFWC')
    where
          ${type === "U" ? "al.user_id " : "al.company_id"} = '${id}'
          and al.event_type ='${event_type}'`;

    let countQuery = `select
            count(*)
          from
            activity_log al
          left join users u on
            al.user_id = u.user_id
          left join company c on
            al.company_id = c.company_id
          left join events e on
            e.event_id = al.event_type_ref_id::uuid
            and (al.event_ref_type = 'E'
              or al.event_ref_type = 'EVENT'
              or al.event_ref_type = 'UFWE'
              or al.event_ref_type = 'FWE')
          left join (
            select
              f.*,
              case
                when f.feed_creator_company_id is null 
                  then jsonb_build_object('id', u.user_id, 'name', concat(u.first_name, ' ', u.last_name), 'avatar', u.user_profile_img, 'type', 'U')
                else
                  jsonb_build_object('id', c.company_id, 'name', c.company_name, 'avatar', c.company_profile_img, 'type', C)
              end as details
            from
              feeds f
            left join users u on
              u.user_id = f.feed_creator_user_id
            left join company c on
              c.company_id = f.feed_creator_company_id)v on
            v.feed_id = al.event_type_ref_id::uuid
            and (al.event_ref_type = 'LIKE'
              or al.event_ref_type = 'RTN'
              or al.event_ref_type = 'SHR'
              or al.event_ref_type = 'CMT'
              or al.event_ref_type = 'CTG'
              or al.event_ref_type = 'FEED'
              or al.event_ref_type = 'TAG'
              or al.event_ref_type = 'ARFD')
          left join articles a on
            a.article_id = al.event_type_ref_id::uuid
            and (al.event_ref_type = 'AR'
              or al.event_ref_type = 'ARTICLE')
          left join users u2 on
            u2.user_id = al.event_type_ref_id::uuid
            and (al.event_ref_type = 'FWU'
              or al.event_ref_type = 'USER'
              or al.event_ref_type = 'UFWU')
          left join company c2 on
            c2.company_id = al.event_type_ref_id::uuid
            and (al.event_ref_type = 'FWC'
              or al.event_ref_type = 'PAGE'
              or al.event_ref_type = 'UFWC')
      where
          ${type === "U" ? "al.user_id " : "al.company_id"} = '${id}'
          and al.event_type = '${event_type}'`;

    let offset = page > 0 ? page * size : 0;

    query =
      query +
      ` order by al.created_date ${sort} limit ${size} offset ${offset} `;
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
    return tempData;
  } catch (error) {
    console.log("Error occurred in searchByUserId ", error);
    throw error;
  }
};

module.exports = {
  createLog,
  fetchByIdAndType,
  fetchById,
  searchById,
  logOut,
  addActivityLog,
};
