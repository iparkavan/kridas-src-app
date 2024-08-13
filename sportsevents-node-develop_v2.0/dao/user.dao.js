const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");
const { confirmationMail } = require("../services/mail.service");
const { query } = require("../utils/db");

const add = async (
  first_name,
  last_name,
  middle_name,
  userProfileImage,
  user_email,
  user_phone,
  user_website,
  user_desc,
  token,
  alternate_name,
  imageUrl,
  user_gender,
  user_dob,
  user_passport_nric,
  user_nationality,
  user_ethinicity,
  identity_docs,
  social,
  address,
  user_type,
  player_code,
  user_status,
  user_age_group,
  user_profile_verified,
  sports_interested,
  user_profile_img_meta,
  user_img_meta,
  user_name,
  registered_referral_code,
  reward_point,
  connectionObj = null
) => {
  try {
    let result = null;
    let dev = process.env.NODE_ENV;
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let referral_code = await transaction.one(
      `select concat('USR',lpad(nextval('user_sequence')::text,8,'0'))`,
      []
    );
    let query = `INSERT INTO users (user_id,first_name,last_name,middle_name,user_profile_img,user_email,user_phone,user_website,user_desc,reset_token,alternate_name,user_img,user_gender,user_dob,user_passport_nric,user_nationality,user_ethinicity,user_identity_docs,social,address,user_type,player_code,created_date,updated_date,user_status,user_age_group,user_profile_verified,sports_interested,user_profile_img_meta,user_img_meta,user_name,referral_code, registered_referral_code,reward_point) VALUES 
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34) RETURNING *`;
    result = await transaction.one(query, [
      uuidv4(),
      first_name,
      last_name,
      middle_name,
      userProfileImage,
      user_email.toLowerCase(),
      user_phone,
      user_website,
      user_desc,
      token,
      alternate_name,
      imageUrl,
      user_gender,
      user_dob,
      user_passport_nric,
      user_nationality,
      user_ethinicity,
      identity_docs,
      social,
      address,
      user_type,
      player_code,
      currentDate,
      currentDate,
      user_status,
      user_age_group,
      user_profile_verified,
      sports_interested,
      user_profile_img_meta,
      user_img_meta,
      user_name.toLowerCase(),
      referral_code.concat,
      registered_referral_code,
      reward_point,
    ]);
    if (result !== null) {
      let environment =
        dev === "development" ? "(Dev)" : dev === "uat" ? "(Uat)" : "";
      confirmationMail(result, environment);
      return result;
    }
  } catch (error) {
    console.log("Error occurred in userDao add", error);
    throw error;
  }
};

const edit = async (
  first_name,
  last_name,
  middle_name,
  user_status,
  userProfileImage,
  user_email,
  user_phone,
  user_website,
  user_desc,
  reset_token,
  alternate_name,
  imageUrl,
  user_gender,
  user_dob,
  user_passport_nric,
  user_nationality,
  user_ethinicity,
  identity_docs,
  social,
  address,
  user_type,
  player_code,
  user_id,
  user_age_group,
  user_profile_verified,
  sports_interested,
  user_profile_img_meta,
  user_img_meta,
  // user_name,
  // referral_code,
  registered_referral_code,
  bio_details,
  reward_point,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update users set first_name =$1,last_name=$2,middle_name=$3,user_status=$4,user_profile_img=$5,user_email=$6,user_phone=$7,user_website=$8,user_desc=$9,reset_token=$10,alternate_name=$11,user_img=$12,user_gender=$13,user_dob=$14,user_passport_nric=$15,user_nationality=$16,user_ethinicity=$17,user_identity_docs=$18,social=$19,address=$20,user_type=$21,player_code=$22,updated_date=$23,user_age_group=$25,user_profile_verified=$26,sports_interested=$27,user_profile_img_meta=$28,user_img_meta=$29, registered_referral_code= $30,bio_details=$31,reward_point=$32 where user_id=$24 RETURNING *`;
    result = await transaction.one(query, [
      first_name,
      last_name,
      middle_name,
      user_status,
      userProfileImage,
      user_email.toLowerCase(),
      user_phone,
      user_website,
      user_desc,
      reset_token,
      alternate_name,
      imageUrl,
      user_gender,
      user_dob,
      user_passport_nric,
      user_nationality,
      user_ethinicity,
      identity_docs,
      social,
      JSON.parse(address),
      user_type,
      player_code,
      currentDate,
      user_id,
      user_age_group,
      user_profile_verified,
      sports_interested,
      user_profile_img_meta,
      user_img_meta,
      registered_referral_code,
      JSON.parse(bio_details),
      reward_point,
    ]);
    return result;
  } catch (error) {
    // if (error.constraint === 'username_unique') {
    //     result = { message: "UserName Already Exists" }
    //     return result;
    // }
    console.log("Error occurred in userDao update", error);
    throw error;
  }
};

const updateByToken = async (userStatus, token, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let token_data = null;
    let currentDate = new Date();
    let query = `update users set user_status=$1,reset_token=$2,updated_date=$3 where reset_token=$4 RETURNING *`;
    result = await transaction.oneOrNone(query, [
      userStatus,
      token_data,
      currentDate,
      token,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao updateByToken", error);
    throw error;
  }
};

const updateByEmailAndToken = async (
  userStatus,
  token,
  email,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let token_data = null;
    let currentDate = new Date();
    let query = `update users set user_status=$1,reset_token=$2,updated_date=$3 where reset_token=$4 and user_email=$5 RETURNING *`;
    result = await transaction.oneOrNone(query, [
      userStatus,
      token_data,
      currentDate,
      token,
      email.toLowerCase(),
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao updateByEmailAndToken", error);
    throw error;
  }
};

const documentUppdate = async (doc, user_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update users set user_identity_docs=$1,updated_date=$2 where user_id=$3 RETURNING *`;
    result = await transaction.oneOrNone(query, [doc, currentDate, user_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao documentUppdate", error);
    throw error;
  }
};

const updateUserType = async (user_id, userTypeList) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update users set user_type=$1,updated_date=$2 where user_id=$3 RETURNING *`;
    result = await transaction.one(query, [userTypeList, currentDate, user_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao updateUserType", error);
    throw error;
  }
};

const updateUserStatus = async (user_id, status, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update users set user_status = $1,reset_token =null,updated_date = $2 where user_id = $3 RETURNING *`;
    result = await transaction.one(query, [status, currentDate, user_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao updateUserStatus", error);
    throw error;
  }
};
const getById = async (user_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
            u.*,
            (bio_details->>'sports_id')as sportsid,
            (bio_details->>'profession')as profession,
            s.sports_name,
            lt.lookup_value
        from
            users u
        left join sports s on
            s.sports_id = (bio_details->>'sports_id')::int
        left join lookup_table lt on
            lt.lookup_key =(bio_details->>'profession')
        where
            user_id = $1`;
    result = await transaction.oneOrNone(query, [user_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao getById", error);
    throw error;
  }
};

const fetchUserByToken = async (token, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from users where reset_token = $1";
    result = await transaction.oneOrNone(query, [token]);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao fetchUserByToken", error);
    throw error;
  }
};

const getByEmail = async (email, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select * from users where lower(user_email) = lower($1)`;
    result = await transaction.oneOrNone(query, [email]);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao getByEmail", error);
    throw error;
  }
};

const getByEmailAndToken = async (email, token, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from users where lower(user_email) = lower($1) and reset_token = $2";
    result = await transaction.oneOrNone(query, [email, token]);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao getByEmail", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from users order by updated_date DESC";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao getAll", error);
    throw error;
  }
};

const deleteById = async (user_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from users where user_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [user_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao deleteById", error);
    throw error;
  }
};

const checkDuplicate = async (user_email, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select count(*) from users where lower(user_email) = lower($1)";
    result = await transaction.oneOrNone(query, [user_email]);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao checkDuplicate", error);
    throw error;
  }
};

const customQueryExecutor = async (customQuery, connectionObj) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = customQuery;
    result = await transaction.any(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao customQueryExecutor", error);
    throw error;
  }
};

const customQueryExecutor1 = async (query, parameter, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    // let query = query
    result = await transaction.query(query, parameter);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao customQueryExecutor", error);
    throw error;
  }
};

const fetchFollowerList = async (user_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select u.user_id as id,concat(u.first_name,' ',u.last_name) as name,u.user_profile_img as avatar,u.user_img as banner, u.bio_details as bio,'U' as type,null as category_id,null as category_name,
        null as description from follower f
        inner join users u 
        on u.user_id  =f.follower_userid 
        where f.following_userid = '${user_id}' and f.is_delete=false`;

    //     let query = `select
    //     a.*,
    //     count(f2.follower_id) as following_count,
    //     count(f2.following_userid) as follower_count
    // from
    //     (
    //     select
    //         u.user_id as id,
    //         concat(u.first_name, ' ', u.last_name) as name,
    //         u.user_profile_img as avatar,
    //         u.user_img as banner,
    //         'U' as type
    //     from
    //         follower f
    //     left join users u on
    //         f.following_userid = u.user_id
    //     where
    //         f.following_userid = '${user_id}'
    //         and f.is_delete = false
    //     group by
    //         u.user_id ) a
    // left join follower f2
    // on
    //     f2.follower_userid = a.id
    //     and f2.is_delete = false
    // group by
    //     a.id,
    //     a.name,
    //     a.avatar,
    //     a.banner,
    //     a.type;`
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao getById", error);
    throw error;
  }
};

const fetchFollowingList = async (user_id, type, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    // let query = `select u.user_id  as id,concat(u.first_name,' ',u.last_name) as name,u.user_profile_img  as avatar, 'U' as type,u.user_img as banner from follower f
    // inner join users u
    // on u.user_id = f.following_userid
    // where  f.follower_userid = '${user_id}' and f.follower_userid notnull and f.is_delete=false union  all
    // select  c.company_id as id,c.company_name as name,c.company_profile_img  as avatar, 'C' as type,c.company_img as banner from follower f
    // inner join company c
    // on c.company_id =f.following_companyid
    // where  f.follower_userid = '${user_id}' and f.follower_userid notnull and f.is_delete=false `
    let query = "";
    if (type === "C") {
      query = `select
            c.company_id as id,
            c.company_name as name,
            c.company_profile_img as avatar,
            'C' as type,
            c.company_img as banner,
            null as bio,
            c2.category_id,
            c2.category_name,
            c.company_desc as description,
            v.category_arr as sub_categories
        from
            follower f
        inner join company c 
                        on
            c.company_id = f.following_companyid
        left join category c2 on
            c.main_category_type = c2.category_id
        left join (
            select
                t.company_id as page_id,
                ARRAY_AGG(row_to_json(c3.*)) as category_arr
            from
                (
                select
                    company_id,
                    unnest(c.company_type) category_id
                from
                    company c) t
            left join category c3 on
                c3.category_id = t.category_id
            group by
                t.company_id)v on 
                v.page_id = f.following_companyid
        where
            f.follower_userid = '${user_id}'
            and f.follower_userid notnull
            and f.is_delete = false `;
    } else if (type === "U") {
      query = `select
            u.user_id as id,
            concat(u.first_name, ' ', u.last_name) as name,
            u.user_profile_img as avatar,
            'U' as type,
            u.user_img as banner,
            u.bio_details as bio,
            null as category_id,
            null as category_name,
            null as description,
            null as sub_categories
            
        from
            follower f
        inner join users u 
                on
            u.user_id = f.following_userid
        where
            f.follower_userid = '${user_id}'
            and f.follower_userid notnull
            and f.is_delete = false`;
    } else if (type === null) {
      query = `select
            u.user_id as id,
            concat(u.first_name, ' ', u.last_name) as name,
            u.user_profile_img as avatar,
            'U' as type,
            u.user_img as banner,
            u.bio_details as bio,
            null as category_id,
            null as category_name,
            null as description,
            null as sub_categories            
        from
            follower f
        inner join users u 
                on
            u.user_id = f.following_userid
        where
            f.follower_userid = '${user_id}'
            and f.follower_userid notnull
            and f.is_delete = false
        union all 
        select
        c.company_id as id,
        c.company_name as name,
        c.company_profile_img as avatar,
        'C' as type,
        c.company_img as banner,
        null as bio,
        c2.category_id,
        c2.category_name,
        c.company_desc as description,
        v.category_arr as sub_categories
    from
        follower f
    inner join company c 
                    on
        c.company_id = f.following_companyid
    left join category c2 on
        c.main_category_type = c2.category_id
    left join (
        select
            t.company_id as page_id,
            ARRAY_AGG(row_to_json(c3.*)) as category_arr
        from
            (
            select
                company_id,
                unnest(c.company_type) category_id
            from
                company c) t
        left join category c3 on
            c3.category_id = t.category_id
        group by
            t.company_id)v on 
            v.page_id = f.following_companyid
    where
        f.follower_userid = '${user_id}'
        and f.follower_userid notnull
        and f.is_delete = false `;
    }
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao getById", error);
    throw error;
  }
};

const userProfileVerified = async (user_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update users set user_profile_verified = true where user_id ='${user_id}'`;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao getById", error);
    throw error;
  }
};

const verifyReferralCode = async (code, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let result = null;
    let query = "select * from users where referral_code = $1";
    let query1 = "select * from company where company_referral_code = $1";
    result = await transaction.oneOrNone(query, [code]);
    if (result === null) {
      result = await transaction.oneOrNone(query1, [code]);
    }
    return result;
  } catch (error) {
    console.log("Error occurred in follower dao verifyCode", error);
    throw error;
  }
};

const getByName = async (first_name, last_name, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select count(*) from users u where replace(lower(u.first_name),' ','') =replace(lower($1),' ','') and replace(lower(u.last_name),' ','') =replace(lower($2),' ','')`;
    result = await transaction.oneOrNone(query, [first_name, last_name]);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao getById", error);
    throw error;
  }
};

const getAllUsersCount = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select count(*) from users u `;
    result = await transaction.one(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao getAllUsersCount", error);
    throw error;
  }
};

const getByUserName = async (user_name, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select count(*) from users u where u.user_name =lower('${user_name}')`;
    result = await transaction.oneOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao getById", error);
    throw error;
  }
};

const getUserName = async (user_name, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from users where user_name = $1";
    result = await transaction.oneOrNone(query, [user_name]);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao getUserName", error);
    throw error;
  }
};

const fetchEvents = async (user_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
        e.event_id as id,
        e.event_name as name,
        e.event_logo as avatar,
        em.event_category_refid as category_id,
        c.category_name as category_name,
        e.event_desc as description,
        e.event_banner as banner,
        'E' as type,
        array_agg(jsonb_build_object('sport_id', s.sports_id, 'sport_name', s.sports_name)) as sport_details, 
        e.event_startdate,
        e.event_enddate
    from
        follower f
    inner join events e 
                    on
        e.event_id = f.following_event_id
    left join events_master em on
        e.parent_event_id = em.event_master_id
    left join category c on
        c.category_id = em.event_category_refid
    left join tournaments t on
        t.event_refid = e.event_id
    left join sports s on
        s.sports_id = t.sports_refid
    where
        f.follower_userid = '${user_id}'
    group by
        e.event_id ,
        em.event_category_refid,
        c.category_name `;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao getById", error);
    throw error;
  }
};

const getSportsInterestedCount = async (sports_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
            count(*)
        from
            users u 
        where
            u.sports_interested && array [${sports_id}]`;
    result = await transaction.one(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao getSportsInterestedCount", error);
    throw error;
  }
};

const getUserByReferralCode = async (referral_code, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      *
    from
      users 
    where
      referral_code = '${referral_code}'`;
    result = await transaction.oneOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao getUserByReferralCode", error);
    throw error;
  }
};

const userProfileVerification = async (
  user_profile_verified,
  user_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update users set user_profile_verified=$1,updated_date=$2 where user_id =$3 RETURNING *`;
    result = await transaction.one(query, [
      user_profile_verified,
      currentDate,
      user_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in userDao userProfileVerification", error);
    throw error;
  }
};

module.exports = {
  add,
  edit,
  getById,
  getAll,
  deleteById,
  checkDuplicate,
  fetchUserByToken,
  updateByToken,
  getByEmail,
  updateUserType,
  customQueryExecutor,
  customQueryExecutor1,
  documentUppdate,
  fetchFollowerList,
  fetchFollowingList,
  getByEmailAndToken,
  updateByEmailAndToken,
  userProfileVerified,
  verifyReferralCode,
  getByName,
  getByUserName,
  getUserName,
  fetchEvents,
  getSportsInterestedCount,
  getAllUsersCount,
  updateUserStatus,
  getUserByReferralCode,
  userProfileVerification,
};
