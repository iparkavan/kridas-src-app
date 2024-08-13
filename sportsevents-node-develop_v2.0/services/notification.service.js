const notificationDao = require("../dao/notification.dao");
const customQueryExecutor = require("../dao/common/utils.dao");

/**
 * Method to get unread notification
 * @param {uuid} user_id
 * @returns
 */
const getByUserId = async (user_id) => {
  try {
    let result = {};
    let Notification = await notificationDao.getNotificationByUserId(user_id);
    let count = await notificationDao.getNotificationCountByUserId(user_id);
    result["notifications"] = Notification;
    result["notification_count"] = Number(count.count);
    if (result.notifications === null || result.count === null) {
      return (result = { message: "Notification not exist" });
    }
    return result;
  } catch (error) {
    console.log("Error occurred in notification getByUserId", error);
    throw error;
  }
};

/**
 * Method for Pagination API for Notifications
 * @param {JSON} body
 * @returns
 */
const searchByUserId = async (body) => {
  let result = null;
  try {
    const { page = 0, sort = "desc", size = 5, user_id } = body;
    if (user_id) {
      let query = `select
        n.*,
        row_to_json(f2.*)as feeds,
        case
            when f2.feed_creator_user_id is null then jsonb_build_object('id', c.company_id , 'name', c.company_name, 'publicname', c.company_public_url_name , 'avatar' , c.company_profile_img , 'type' , 'C')
            else jsonb_build_object('id' , u.user_id, 'name', concat(u.first_name, ' ', u.last_name) , 'public_name', u.user_name, 'avatar' , u.user_profile_img , 'banner', u.user_img , 'type' , 'U')
        end as detail,
        json_build_object('id', e.event_id, 'name', e.event_name, 'logo', e.event_logo, 'banner', e.event_banner, 'type', 'E')as event_details
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
        and n.is_read = false `;

      let countQuery = `select
        count(n.*)
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
        and n.is_read = false`;
      let offset = page > 0 ? page * size : 0;
      query =
        query +
        ` order by n.updated_date ${sort} limit ${size} offset ${offset} `;
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
      result = tempData;
    } else {
      result = { message: "user_id required" };
      return result;
    }
  } catch (error) {
    console.log("Error occurred in search Notifications  ", error);
    throw error;
  }
  return result;
};

/**
 * Method for Pagination API for Notifications
 * @param {JSON} body
 * @returns
 */
const search = async (body) => {
  let result = null;
  try {
    const { page = 0, sort = "desc", size = 5, user_id } = body;
    if (user_id) {
      let query = `select
        n.*,
        row_to_json(f2.*)as feeds,
        case
          when n.notification_type = 'FWU'
              then jsonb_build_object('id' , u2.user_id, 'name', concat(u2.first_name, ' ', u2.last_name) , 'public_name', u2.user_name, 'avatar' , u2.user_profile_img , 'banner', u2.user_img , 'type' , 'U')
          else null
        end as follower_user_details,
        case
          when f2.feed_creator_user_id is null then jsonb_build_object('id', c.company_id , 'name', c.company_name, 'publicname', c.company_public_url_name , 'avatar' , c.company_profile_img , 'type' , 'C')
          else jsonb_build_object('id' , u.user_id, 'name', concat(u.first_name, ' ', u.last_name) , 'public_name', u.user_name, 'avatar' , u.user_profile_img , 'banner', u.user_img , 'type' , 'U')
        end as detail,
        json_build_object('id', e.event_id, 'name', e.event_name, 'logo', e.event_logo, 'banner', e.event_banner, 'type', 'E')as event_details,
        case 
          when n.notification_triggered_type = 'U'
              then jsonb_build_object('id' , u3.user_id, 'name', concat(u3.first_name, ' ', u3.last_name) , 'public_name', u3.user_name, 'avatar' , u3.user_profile_img , 'banner', u3.user_img , 'type' , 'U')
          when n.notification_triggered_type = 'C'
          then jsonb_build_object('id', c2.company_id , 'name', c2.company_name, 'publicname', c2.company_public_url_name , 'avatar' , c2.company_profile_img , 'type' , 'C')
          when n.notification_triggered_type = 'E'
          then jsonb_build_object('id', e2.event_id, 'name', e2.event_name, 'logo', e2.event_logo, 'banner', e2.event_banner, 'type', 'E')
        end as reactor_details	
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
      left join users u2 on
        u2.user_id = n.notification_type_id ::uuid
        and 
          n.notification_type = 'FWU'
      left join users u3 on
        u3.user_id = n.notification_triggered_id ::uuid
        and n.notification_triggered_type = 'U'
      left join company c2 on
        c2.company_id = n.notification_triggered_id ::uuid
        and n.notification_triggered_type = 'C'
      left join events e2 on
        e2.event_id = n.notification_triggered_id ::uuid
        and n.notification_triggered_type = 'E'
      where
          n.user_id = '${user_id}'`;

      let notificationCount =
        await notificationDao.getNotificationCountByUserId(user_id);

      let countQuery = `select
        count(n.*)
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
        left join users u2 on
          u2.user_id = n.notification_type_id ::uuid
          and 
            n.notification_type = 'FWU'
        left join users u3 on
          u3.user_id = n.notification_triggered_id ::uuid
          and n.notification_triggered_type = 'U'
        left join company c2 on
          c2.company_id = n.notification_triggered_id ::uuid
          and n.notification_triggered_type = 'C'
        left join events e2 on
          e2.event_id = n.notification_triggered_id ::uuid
          and n.notification_triggered_type = 'E'
        where
        n.user_id = '${user_id}'`;
      let offset = page > 0 ? page * size : 0;
      query =
        query +
        ` order by n.created_date ${sort} limit ${size} offset ${offset} `;
      let data = await customQueryExecutor.customQueryExecutor(query);
      let count = await customQueryExecutor.customQueryExecutor(countQuery);
      let length = Number(count[0].count);
      let totalPages = length < size ? 1 : Math.ceil(length / size);
      let tempData = {
        totalCount: length,
        totalPage: totalPages,
        size: size,
        notification_count: Number(notificationCount.count),
        content: data,
      };
      result = tempData;
    } else {
      result = { message: "user_id required" };
      return result;
    }
  } catch (error) {
    console.log("Error occurred in search Notifications  ", error);
    throw error;
  }
  return result;
};

/**
 *Method to update notification
 * @param {JSon} body
 */
const updateNotification = async (body) => {
  try {
    let result = null;
    const { user_id } = body;
    result = await notificationDao.updateNotification(user_id);
    return result;
  } catch (error) {
    console.log("Error occurred in updateNotification: ", error);
    throw error;
  }
};

module.exports = {
  getByUserId,
  searchByUserId,
  updateNotification,
  search,
};
