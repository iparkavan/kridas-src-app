const db = require("../utils/db");
const processActivity = require("../dao/processActivity.dao");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

const add = async (
  event_type,
  event_action,
  user_id,
  company_id,
  event_type_ref_id,
  additional_info,
  event_ref_type = null,
  event_id,
  connectionObj = null
) => {
  try {
    let result = null;
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    // let query = `INSERT into activity_log (event_type, event_action, user_id, company_id,event_type_ref_id,additional_info,event_ref_type,event_id, created_date)
    //     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;
    // result = await transaction.one(query, [
    //   event_type,
    //   event_action,
    //   user_id,
    //   company_id,
    //   event_type_ref_id,
    //   additional_info,
    //   event_ref_type,
    //   event_id,
    //   currentDate,
    // ]);
    return result;
  } catch (error) {
    console.log("Error occurred in activity log add", error);
    throw error;
  }
};
const addActivityLog = async (
  activityOn,
  activityType,
  companyId,
  eventId,
  eventTypeRefId,
  userId,
  additionalInfo
) => {
  try {
    let result = null;
    let activityLogAdd = null;
    data = {
      activityOn: activityOn,
      activityType: activityType,
      companyId: companyId,
      eventId: eventId,
      eventTypeRefId: eventTypeRefId,
      userId: userId,
      additionalInfo: additionalInfo,
    };
    result = await processActivity.add(data);

    return result;
  } catch (error) {
    // console.log("Error occurred in activity log add", error);
    // throw error;
    let errorMessage = error;
    return (result = { message: errorMessage });
  }
};

// const addActivityLog = async (data) => {
//   try {
//     let result;
//     let activityLogAdd = await processActivity.add(data);
//     result = activityLogAdd.data;
//     return result;
//   } catch (error) {
//     // console.log("Error occurred in activity log add", error);
//     // throw error;
//     return (result = { message: error });
//   }
// };

const fetchByIdAndType = async (id, type, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    // let query = `select al.*, case when al.user_id is null then jsonb_build_object('id', c.company_id, 'name', c.company_name, 'avatar', c.company_profile_img, 'type', 'C') else jsonb_build_object('id', u.user_id, 'name', concat(u.first_name, ' ', u.last_name), 'avatar', u.user_profile_img, 'type', 'U') end as detail from activity_log al left join users u on al.user_id = u.user_id left join company c on al.company_id = c.company_id where `
    let query = `select al.*, case when al.user_id is null then jsonb_build_object('id', c.company_id, 'name', c.company_name, 'avatar', c.company_profile_img, 'type', 'C') else jsonb_build_object('id', u.user_id, 'name', concat(u.first_name, ' ', u.last_name), 'avatar', u.user_profile_img, 'type', 'U') end as detail, case when (al.event_ref_type = 'E' or al.event_ref_type = 'UFWE' or al.event_ref_type='FWE') then json_build_object('id',e.event_id,'name',e.event_name,'avatar',e.event_logo,'banner',e.event_banner,'type','E') when al.event_ref_type = 'AR' then json_build_object('id',a.article_id ,'name',a.article_heading ,'avatar',a.cover_image_url ,'banner',null,'type','AR') when (al.event_ref_type = 'FWU' or al.event_ref_type = 'UFWU') then json_build_object('id', u2.user_id, 'name', concat(u2.first_name, ' ', u2.last_name), 'avatar', u2.user_profile_img, 'type', 'U') when (al.event_ref_type = 'FWC' or al.event_ref_type = 'UFWC') then json_build_object('id', c2.company_id, 'name', c2.company_name, 'avatar', c2.company_profile_img, 'type', 'C') else null end as action_details from activity_log al left join users u on al.user_id = u.user_id left join company c on al.company_id = c.company_id left join events e on e.event_id = al.event_type_ref_id::uuid and (al.event_ref_type = 'E' or al.event_ref_type = 'UFWE' or al.event_ref_type='FWE') left join articles a on a.article_id =al.event_type_ref_id::uuid and al.event_ref_type = 'AR' left join users u2 on u2.user_id =al.event_type_ref_id::uuid and (al.event_ref_type = 'FWU' or al.event_ref_type = 'UFWU') left join company c2 on c2.company_id = al.event_type_ref_id::uuid and (al.event_ref_type = 'FWC' or al.event_ref_type = 'UFWC') where `;
    if (type === "U") query = query + `al.user_id=$1`;
    else if (type === "C") query = query + `al.company_id=$1`;
    result = await transaction.manyOrNone(query, [id]);
    return result;
  } catch (error) {
    console.log("Error occurred in activity log add", error);
    throw error;
  }
};

const fetchById = async (id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select * from activity_log al where al.activity_log_id =$1`;
    result = await transaction.oneOrNone(query, [id]);
    return result;
  } catch (error) {
    console.log("Error occurred in fetchById", error);
    throw error;
  }
};

module.exports = {
  add,
  fetchByIdAndType,
  fetchById,
  addActivityLog,
};
