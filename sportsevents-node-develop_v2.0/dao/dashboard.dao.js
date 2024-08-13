const db = require("../utils/db");

const fetchGraph = async (created_date, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let CURRENT_DATE = new Date();
    let result = {};
    let query =
      "select TO_CHAR( TO_DATE ( extract(month from t.created_date) ::text, 'MM'), 'Month' ) as monthName, t.usercount from ( select DATE_TRUNC('month', u.created_date) as created_date , count(u.user_id) as usercount from users u where u.created_date between NOW() - interval '6 MONTH' and NOW() group by DATE_TRUNC('month', u.created_date) ) t";
    resultUser = await transaction.manyOrNone(query, []);

    let queryPages =
      "select TO_CHAR( TO_DATE ( extract(month from t.created_date) ::text, 'MM'), 'Month' ) as monthName, t.pagecount from ( select DATE_TRUNC('month', u.created_date) as created_date , count(u.company_id) as pagecount from company u where u.created_date between NOW() - interval '6 MONTH' and NOW() group by DATE_TRUNC('month', u.created_date) ) t";
    resultPages = await transaction.manyOrNone(queryPages, []);

    result["users"] = resultUser;
    result["pages"] = resultPages;

    return result;
  } catch (error) {
    console.log("Error occurred in userDao fetchGraph", error);
    throw error;
  }
};

const fetchApprovals = async (created_date, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let CURRENT_DATE = new Date();
    let query = `select pending_verified_users, pending_verified_company from (select count(1) as pending_verified_users, '1' as id from users where user_profile_verified = false)a
        left join (select count(1) as pending_verified_company, '1' as id from company c where company_profile_verified = false)b
        on b.id = a.id`;
    result = await transaction.oneOrNone(query, [created_date, CURRENT_DATE]);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao fetchApprovals", error);
    throw error;
  }
};

const getDashBoard = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    // query to get  count of (total_users, verified_users,unconfirmed_users,total_pages,verified_company)
    let query = `select total_users,verified_users,unconfirmed_users, total_pages,verified_company from (select count(1) as "total_users", '1' as id from users) a left join (select count(1) as "verified_users", '1' as id from users where user_profile_verified = true) b 
        on b.id = a.id 
        left join (select count(1) as "unconfirmed_users", '1' as id from users where reset_token is not null) c 
        on c.id = a.id
        left join (select count(1) as "total_pages", '1' as id from company) d 
        on d.id = a.id 
        left join (select count(1) as "verified_company", '1' as id from company where company_profile_verified = true) e 
        on e.id = a.id`;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in dashBoard", error);
    throw error;
  }
};

const getTopFollower = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    // query to get top followers in company
    let pages = `select c.company_name, a.following_count,c.company_profile_img from (
            select following_companyid,count(1) as following_count from follower f 
            where following_companyid is not null and f.is_delete = false
            group by following_companyid 
            ) a
            join company c 
            on a.following_companyid = c.company_id 
            order by a.following_count desc limit 5`;

    let pagesData = await transaction.manyOrNone(pages, []);

    // query to get top followers in pages

    let users = `select c.first_name,c.user_profile_img, a.following_count from (
            select follower_userid,count(1) as following_count from follower f 
            where follower_userid is not null and f.is_delete = false 
            group by follower_userid 
            ) a
            join users c 
            on a.follower_userid = c.user_id 
            order by a.following_count desc limit 5`;

    let usersData = await transaction.manyOrNone(users, []);
    let result = {};
    if (pagesData != null && usersData != null) {
      result["company"] = pagesData;
      result["users"] = usersData;
    }
    return result;
  } catch (error) {
    console.log("Error occurred in getTopFollower", error);
    throw error;
  }
};

module.exports = {
  fetchGraph,
  fetchApprovals,
  getDashBoard,
  getTopFollower,
};
