const db = require('../utils/db');

const add = async (
  user_id,
  socket_id,
  notification_type_id,
  notification_type,
  event_id = null,
  connectionObj = null,
  type = 'FD',
  notification_triggered_id = null,
  notification_triggered_type = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let is_read = false;
    let query = `INSERT INTO notifications
        (user_id,socket_id, notification_type_id, notification_type,event_id, is_read, created_date, updated_date,feed_type,notification_triggered_id,notification_triggered_type)
        VALUES($1, $2,$3 ,$4, $5, $6,$7,$8,$9,$10,$11) RETURNING *`;

    result = await transaction.one(query, [
      user_id,
      socket_id,
      notification_type_id,
      notification_type,
      event_id,
      is_read,
      currentDate,
      currentDate,
      type,
      notification_triggered_id,
      notification_triggered_type,
    ]);
    console.log(result);
    return result;
  } catch (error) {
    console.log('Error occurred in notification add', error);
    throw error;
  }
};

// const addBulkEntry = async (
//   feed_id,
//   notification_type,
//   feed_type,
//   user_id,
//   event_id = null,
//   connectionObj = null
// ) => {
//   try {
//     let transaction = connectionObj !== null ? connectionObj : db;
//     let currentDate = new Date();
//     let query = `INSERT INTO public.notifications (socket_id, user_id, notification_type_id, notification_type,event_id, is_read,feed_type, created_date, updated_date) select null as socket_id,u.user_id , '${feed_id}' as notification_type_id,'${notification_type}' as notification_type, '${event_id}' as event_id,false as is_read,'${feed_type}' as feed_type,CURRENT_TIMESTAMP as created_date,CURRENT_TIMESTAMP as updated_date from users u where u.user_id != '${user_id}' and u.user_status = 'AC'`;

//     // query= query+ `where u.user_id ='ed8d033b-8d12-45cb-927e-d084cde9b329'`

//     result = await transaction.manyOrNone(query, []);
//     return result;
//   } catch (error) {
//     console.log("Error occurred in notification add", error);
//     throw error;
//   }
// };

const addBulkEntry = async (
  feed_id,
  notification_type,
  feed_type,
  user_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO notifications (socket_id, user_id, notification_type_id, notification_type, is_read,feed_type, created_date, updated_date) select null as socket_id,u.user_id , '${feed_id}' as notification_type_id,'${notification_type}' as notification_type, false as is_read,'${feed_type}' as feed_type,CURRENT_TIMESTAMP as created_date,CURRENT_TIMESTAMP as updated_date from users u where u.user_id != '${user_id}' and u.user_status = 'AC'`;

    // query= query+ `where u.user_id ='ed8d033b-8d12-45cb-927e-d084cde9b329'`

    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log('Error occurred in notification add', error);
    throw error;
  }
};

const updateNotification = async (user_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let is_read = true;
    let query = `update notifications set is_read =$1,updated_date =$2 where user_id = $3 RETURNING *`;
    result = await transaction.manyOrNone(query, [
      is_read,
      currentDate,
      user_id,
    ]);
    return result;
  } catch (error) {
    console.log('Error occurred in notification add', error);
    throw error;
  }
};

const getByUserId = async (user_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      'select count(*) from notifications n where n.user_id = $1 and n.is_read =false';
    result = await transaction.oneOrNone(query, [user_id]);
    return result;
  } catch (error) {
    console.log('Error occurred in notifications get by user id', error);
    throw error;
  }
};

const getNotificationCountByUserId = async (user_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      'select count(*) from notifications n where n.user_id = $1 and n.is_read =false';
    result = await transaction.oneOrNone(query, [user_id]);
    return result;
  } catch (error) {
    console.log('Error occurred in notifications get by user id', error);
    throw error;
  }
};

const getNotificationByUserId = async (user_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
        n.*,
        row_to_json(f2.*)as feeds,
        case
            when f2.feed_creator_user_id is null then jsonb_build_object('id', c.company_id , 'name', c.company_name, 'publicname', c.company_public_url_name , 'avatar' , c.company_profile_img , 'type' , 'C')
            else jsonb_build_object('id' , u.user_id, 'name', concat(u.first_name, ' ', u.last_name) , 'public_name', u.user_name, 'avatar' , u.user_profile_img , 'banner', u.user_img , 'type' , 'U')
        end as detail,
        json_build_object('id',e.event_id,'name',e.event_name,'logo',e.event_logo,'banner',e.event_banner,'type','E')as event_details  
    from
        notifications n
    left join feeds f2 on
        f2.feed_id = n.notification_type_id::uuid
    left join events e on
    e.event_id = n.event_id
    left join users u on
        u.user_id = f2.feed_creator_user_id
    left join company c on
        (c.company_id = f2.feed_creator_company_id)
        or (n.notification_type = 'C'
            and c.company_id = n.notification_type_id::uuid )
    where
        n.user_id = '${user_id}'
    order by
        n.created_date desc
    `;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log('Error occurred in notifications get by user id', error);
    throw error;
  }
};

module.exports = {
  add,
  getByUserId,
  getNotificationByUserId,
  updateNotification,
  getNotificationCountByUserId,
  addBulkEntry,
};
