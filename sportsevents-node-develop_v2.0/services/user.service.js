const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");
const { uploadFile } = require("../services/s3.service");
const fs = require("fs");
const {
  sendMail,
  confirmationMail,
  activationMail,
  inActivationMail,
} = require("../services/mail.service");
const userDao = require("../dao/user.dao");
const countryDao = require("../dao/country.dao");
const {
  documentUpload,
  cloudinaryUpload,
  deleteDocuments,
  cloudinaryImageDelete,
} = require("../utils/common");
const { otpGenerator } = require("../utils/util");
const { referralCode } = require("../utils/randomNumber");
const sportHashtagDao = require("../dao/sportsHashtag.dao");
const userHashtagFollowDao = require("../dao/userHashtagFollow.dao");
const activityLogDao = require("../dao/activityLog.dao");

/**
 * Method for file upload
 * @param {file} req
 * @returns
 */
const uploadTest = async (req) => {
  const file = req.file;

  let data = await uploadFile(file);

  if (fs.existsSync(file.path)) {
    fs.unlink(file.path, (err) => {
      if (err) {
        console.log(err);
      }
      console.log("deleted");
    });
  }
  return "";
};

/**
 * Method to create new user
 * @param {json} requestBody
 * @param {Json} database
 */
const createUser = async (requestBody, database = null) => {
  let result = null;
  try {
    const {
      first_name,
      last_name,
      middle_name = null,
      user_email,
      user_phone,
      user_website = null,
      user_desc = null,
      alternate_name = null,
      user_gender = null,
      user_dob = null,
      user_passport_nric = null,
      user_nationality = null,
      user_ethinicity = null,
      social = null,
      address = null,
      user_type = ["USR"],
      player_code = null,
      user_status = "IN",
      files = {},
      user_age_group = null,
      user_profile_verified = false,
      registered_referral_code,
      reward_point = null,
      // sports_interested = null
    } = requestBody;
    let name = `${first_name} ${last_name}`;
    let { count } = await userDao.checkDuplicate(user_email);

    let imageUrl = null;
    let identity_docs = [];
    let userProfileImage = null;
    let imagemetaData = null;
    let profileImageMetaData = null;
    let userName = null;
    let referredUserId = null;

    if (Number(count) !== 0) {
      result = { message: "Email already exist" };
      return result;
    }
    //cloudinary image upload
    if (JSON.stringify(files) !== JSON.stringify({})) {
      if (files?.image !== null && files?.image !== undefined) {
        imagemetaData = await cloudinaryUpload(files.image[0]);
        imageUrl = imagemetaData.url;
      }

      if (
        files?.userProfileImage !== null &&
        files?.userProfileImage !== undefined
      ) {
        profileImageMetaData = await cloudinaryUpload(
          files.userProfileImage[0]
        );
        userProfileImage = profileImageMetaData.url;

        await activityLogDao.addActivityLog(
          "USR",
          "PIC",
          null,
          null,
          null,
          user_id,
          null
        );
      }

      // S3 file upload
      if (JSON.stringify(files) !== JSON.stringify({}))
        identity_docs = await documentUpload(files);
    }

    if (registered_referral_code) {
      referredUserId = await userDao.getUserByReferralCode(
        registered_referral_code
      );
    }

    let token = otpGenerator();
    let transaction = database !== null ? database : db;
    let sports_interested = "{}";
    let countUserName = await userDao.getByName(first_name, last_name);
    if (countUserName.count === "0") {
      userName = `${first_name.replace(/[^a-zA-Z0-9]/g, "").trim()}.${last_name
        .replace(/[^a-zA-Z0-9]/g, "")
        .trim()}`;

      let userNameExisting = await userDao.getByUserName(userName);
      if (userNameExisting.count !== "0") {
        userName = `${first_name
          .replace(/[^a-zA-Z0-9]/g, "")
          .trim()}.${last_name.replace(/[^a-zA-Z0-9]/g, "").trim()}.${
          userNameExisting.count
        }`;
      }
    } else {
      userName = `${first_name.replace(/[^a-zA-Z0-9]/g, "").trim()}.${last_name
        .replace(/[^a-zA-Z0-9]/g, "")
        .trim()}.${countUserName.count}`;
      let userNameExisting = await userDao.getByUserName(userName);
      if (userNameExisting.count !== "0") {
        userName = `${first_name
          .replace(/[^a-zA-Z0-9]/g, "")
          .trim()}.${last_name.replace(/[^a-zA-Z0-9]/g, "").trim()}.${
          userNameExisting.count
        }`;
      }
    }

    result = await userDao.add(
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
      JSON.stringify(identity_docs),
      social,
      address,
      user_type,
      player_code,
      user_status,
      user_age_group,
      user_profile_verified,
      sports_interested,
      profileImageMetaData,
      imagemetaData,
      userName,
      registered_referral_code,
      reward_point,
      transaction
    );

    if (referredUserId) {
      if (referredUserId.user_id) {
        await activityLogDao.addActivityLog(
          "USR",
          "REF",
          null,
          null,
          result.user_id,
          referredUserId.user_id,
          null
        );
      }
    }

    return result;
  } catch (error) {
    console.log("Error occurred in create: ", error);
    throw error;
  }
};

/**
 * Method to update existing user
 * @param {json} requestBody
 * @param {Json} database
 */
const editUser = async (body, database = null) => {
  let result = null;
  try {
    const {
      user_id,
      first_name,
      last_name,
      middle_name = null,
      user_profile_img = null,
      user_email,
      user_phone,
      user_website = null,
      user_desc = null,
      reset_token = null,
      alternate_name = null,
      user_img = null,
      user_gender = null,
      user_dob = null,
      user_passport_nric = null,
      user_nationality = null,
      user_ethinicity = null,
      user_identity_docs = "[]",
      social = null,
      address = null,
      user_type,
      player_code = null,
      user_status = "IN",
      files = null,
      user_age_group = null,
      user_profile_verified = false,
      sports_interested = [],
      // user_name,
      registered_referral_code,
      bio_details = null,
      reward_point = null,
    } = body;

    let user = null;
    let isProfileComplete = false;
    let percentage = 0;
    let userData = null;
    let wasBioPresent = false;
    let previousPercentage = 0;

    user = await userDao.getById(user_id);

    if (user === null) {
      result = { message: "user not exist" };
      return result;
    } else if (
      user.bio_details?.sports_id &&
      user.bio_details?.profession &&
      user.bio_details?.description
    ) {
      wasBioPresent = true;
    }

    if (user.user_profile_img) {
      previousPercentage += 10;
    }
    if (user.user_img) {
      previousPercentage += 10;
    }
    if (
      user.first_name &&
      user.last_name &&
      user.user_email &&
      user.user_gender &&
      user.user_dob &&
      user.address?.pincode &&
      user.address?.country &&
      user.address?.state &&
      user.address?.city
    ) {
      previousPercentage += 40;
    }
    if (
      user.bio_details?.sports_id &&
      user.bio_details?.profession &&
      user.bio_details?.description
    ) {
      previousPercentage += 20;
    }
    if (user.social?.some((soc) => soc?.link)) {
      previousPercentage += 10;
    }
    if (user.sports_interested?.length >= 1) {
      previousPercentage += 10;
    }

    let imageUrl = user?.user_img === undefined ? null : user?.user_img;
    // let identity_docs = user?.user_identity_docs === undefined ? null : user?.user_identity_docs;
    let userProfileImage =
      user?.user_profile_img === undefined ? null : user?.user_profile_img;
    let userProfilePic =
      user?.user_profile_img === undefined ? null : user?.user_profile_img;
    let imagemetaData =
      user?.user_img_meta === undefined ? null : user?.user_img_meta;
    let profileImageMetaData =
      user?.user_profile_img_meta === undefined
        ? null
        : user?.user_profile_img_meta;
    let identity_docs = JSON.parse(user_identity_docs).filter(
      (doc) => doc.is_delete === "N"
    );
    let deleted_doc_list = JSON.parse(user_identity_docs).filter(
      (doc) => doc.is_delete === "Y"
    );

    //creating dynamic folder path in cloudinary
    let profilePath = `profle/user/${user.user_id}`;
    let bannerPath = `banner/user/${user.user_id}`;

    if (JSON.stringify(files) !== JSON.stringify({})) {
      if (files?.image !== null && files?.image !== undefined) {
        imagemetaData = await cloudinaryUpload(files.image[0], bannerPath);
        imageUrl = imagemetaData?.url;
        // await cloudinaryImageDelete(user?.user_profile_img_meta)
      }

      if (
        files?.userProfileImage !== null &&
        files?.userProfileImage !== undefined
      ) {
        profileImageMetaData = await cloudinaryUpload(
          files.userProfileImage[0],
          profilePath
        );

        userProfileImage = profileImageMetaData?.url;

        // await cloudinaryImageDelete(user?.user_img_meta)
      }

      // S3 file upload
      if (files?.document !== null && files?.document !== undefined) {
        let docRespons = await documentUpload(files);
        identity_docs = [...identity_docs, ...docRespons];
      }
    }

    //s3 delete
    await deleteDocuments(deleted_doc_list);

    result = await db
      .tx(async (transaction) => {
        userData = await userDao.edit(
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
          JSON.stringify(identity_docs),
          social,
          address,
          user.user_type,
          player_code,
          user_id,
          user_age_group,
          user_profile_verified,
          sports_interested,
          profileImageMetaData,
          imagemetaData,
          // user_name,
          // referral_code,
          registered_referral_code,
          bio_details,
          reward_point,
          transaction
        );

        for await (let sports_id of sports_interested) {
          let hashTag = await sportHashtagDao.getBySportId(
            sports_id,
            transaction
          );
          if (hashTag !== null && hashTag.length > 0) {
            for await (let hashtags of hashTag) {
              let UserHashTag = await userHashtagFollowDao.getByUserHashtag(
                user_id,
                hashtags.hashtag_id,
                transaction
              );
              if (UserHashTag.count === "0") {
                let userHashtagFollow = await userHashtagFollowDao.add(
                  user_id,
                  hashtags.hashtag_id,
                  transaction
                );
              }
            }
          }
        }

        // await activityLogDao.add(
        //   "USER",
        //   "UPDATE",
        //   user_id,
        //   null,
        //   null,
        //   null,
        //   "U",
        //   null,
        //   transaction
        // );

        // if (
        //   files?.userProfileImage === null ||
        //   files?.userProfileImage === undefined
        // ) {
        //   await activityLogDao.addActivityLog(
        //     "USR",
        //     "EDT",
        //     null,
        //     null,
        //     null,
        //     user_id,
        //     null
        //   );
        // }

        // if (
        //   !wasBioPresent &&
        //   userData.bio_details?.sports_id &&
        //   userData.bio_details?.profession &&
        //   userData.bio_details?.description
        // ) {
        //   await activityLogDao.addActivityLog(
        //     "USR",
        //     "BIO",
        //     null,
        //     null,
        //     null,
        //     user_id,
        //     null
        //   );
        // }

        // if (userData.user_profile_img) {
        //   percentage += 10;
        // }
        // if (userData.user_img) {
        //   percentage += 10;
        // }
        // if (
        //   userData.first_name &&
        //   userData.last_name &&
        //   userData.user_email &&
        //   userData.user_gender &&
        //   userData.user_dob &&
        //   userData.address?.pincode &&
        //   userData.address?.country &&
        //   userData.address?.state &&
        //   userData.address?.city
        // ) {
        //   percentage += 40;
        // }
        // if (
        //   userData.bio_details?.sports_id &&
        //   userData.bio_details?.profession &&
        //   userData.bio_details?.description
        // ) {
        //   percentage += 20;
        // }
        // if (userData.social?.some((soc) => soc?.link)) {
        //   percentage += 10;
        // }
        // if (userData.sports_interested?.length >= 1) {
        //   percentage += 10;
        // }
        // isProfileComplete = percentage === 100;

        // if (percentage === 100) {
        //   await activityLogDao.addActivityLog(
        //     "USR",
        //     "PRO",
        //     null,
        //     null,
        //     null,
        //     user_id,
        //     null
        //   );
        // }

        return userData;
      })
      .then(async (userData) => {
        if (
          files?.userProfileImage === null ||
          files?.userProfileImage === undefined
        ) {
          await activityLogDao.addActivityLog(
            "USR",
            "EDT",
            null,
            null,
            null,
            user_id,
            null
          );
        }

        if (
          files?.userProfileImage !== null &&
          files?.userProfileImage !== undefined
        ) {
          if (userProfilePic === null) {
            await activityLogDao.addActivityLog(
              "USR",
              "PIC",
              null,
              null,
              null,
              user_id,
              null
            );
          }
        }

        if (
          !wasBioPresent &&
          userData.bio_details?.sports_id &&
          userData.bio_details?.profession &&
          userData.bio_details?.description
        ) {
          await activityLogDao.addActivityLog(
            "USR",
            "BIO",
            null,
            null,
            null,
            user_id,
            null
          );
        }

        // if (userData.bio_details) {
        //   if (
        //     userData.bio_details?.sports_id &&
        //     userData.bio_details?.profession &&
        //     userData.bio_details?.description
        //   ) {
        //     await activityLogDao.addActivityLog(
        //       "USR",
        //       "BIO",
        //       null,
        //       null,
        //       null,
        //       user_id,
        //       null
        //     );
        //   }
        // }

        if (userData.user_profile_img) {
          percentage += 10;
        }
        if (userData.user_img) {
          percentage += 10;
        }
        if (
          userData.first_name &&
          userData.last_name &&
          userData.user_email &&
          userData.user_gender &&
          userData.user_dob &&
          userData.address?.pincode &&
          userData.address?.country &&
          userData.address?.state &&
          userData.address?.city
        ) {
          percentage += 40;
        }
        if (
          userData.bio_details?.sports_id &&
          userData.bio_details?.profession &&
          userData.bio_details?.description
        ) {
          percentage += 20;
        }
        if (userData.social?.some((soc) => soc?.link)) {
          percentage += 10;
        }
        if (userData.sports_interested?.length >= 1) {
          percentage += 10;
        }
        isProfileComplete = percentage === 100;

        if (previousPercentage !== 100 && percentage === 100) {
          await activityLogDao.addActivityLog(
            "USR",
            "PRO",
            null,
            null,
            null,
            user_id,
            null
          );
        }

        return userData;
      })
      // .then((data) => {
      //   return data;
      // })
      .catch((error) => {
        console.log("failure, ROLLBACK was executed", error);
        throw error;
      });
    return result;
  } catch (error) {
    console.log("Error occurred in editUser: ", error);
    throw error;
  }
};

/**
 * Method to update existing user based on token
 * @param {json} body
 */
const updateByToken = async (body) => {
  try {
    const { token } = body;
    let result = null;
    let user = null;
    user = await userDao.fetchUserByToken(token);
    if (user === null) {
      result = { message: "invalid otp" };
      return result;
    }
    let userStatus = "AC";
    result = await userDao.updateByToken(userStatus, token);
    return result;
  } catch (error) {
    console.log("Error occurred in updateByToken: ", error);
    throw error;
  }
};

/**
 * Method to update existing user based on token and email id
 * @param {json} body
 */
const updateByTokenAndEmail = async (body) => {
  try {
    const { token, email } = body;
    let result = null;
    let user = null;
    let userEmail = null;

    userEmail = await userDao.getByEmail(email);
    if (userEmail === null) {
      result = {
        message: "invalid email id",
        statusCode: "USR404",
      };
      return result;
    }

    if (userEmail.user_status === "AC") {
      result = {
        message: "This Email ID is already Active",
        statusCode: "USR409",
      };
      return result;
    }

    user = await userDao.getByEmailAndToken(email, token);
    if (user === null) {
      result = {
        message: "invalid one time password",
        statusCode: "USR422",
      };
      return result;
    }
    let userStatus = "AC";
    result = await userDao.updateByEmailAndToken(userStatus, token, email);
    return result;
  } catch (error) {
    console.log("Error occurred in updateByToken: ", error);
    throw error;
  }
};

/**
 * Method to get user based on user id
 * @param {uuid} user_id
 * @param  country_code
 */
const fetchUser = async (user_id) => {
  try {
    let result = {
      data: null,
      isError: false,
    };
    let connectionObj = null;
    let data = await userDao.getById(user_id);
    if (data === null) result = { message: "user not exist" };
    else {
      result["data"] = data;
    }

    if (data.address && data.address.country) {
      let country_code1 = data?.address?.country;
      let countryData = await countryDao.fetchcountrybyCode(country_code1);
      let data1 = {
        country_id: countryData?.country_id,
        country_code: countryData?.country_code,
        country_name: countryData?.country_name,
        country_currency: countryData?.country_currency,
        country_states: countryData?.country_states,
        created_date: countryData?.created_date,
        updated_date: countryData?.updated_date,
        country_code_iso2: countryData?.country_code_iso2,
      };

      result["data"]["countryData"] = JSON.stringify(data1);
    }
    return result;
  } catch (error) {
    console.log("Error occurred in fetch user", error);
    throw error;
  }
};

/**
 * Method to get user based on user email
 * @param {string} user_email
 */
const fetchUserByEmail = async (user_email) => {
  try {
    let result = {
      data: null,
      isError: false,
    };
    let data = await userDao.getByEmail(user_email);
    if (data === null) result = { message: "user not exist" };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetchUserByEmail", error);
    throw error;
  }
};

/**
 * Method to get user based on reset token
 * @param {uuid} token
 */
const fetchUserByToken = async (token) => {
  try {
    let result = {
      data: null,
      isError: false,
    };
    let data = await userDao.fetchUserByToken(token);
    if (data === null) result = { message: "user not exist" };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetchUserByToken", error);
    throw error;
  }
};

/**
 * Method to search user
 * @param {JSON} body
 * @returns
 */
const searchUser = async (body) => {
  let result = null;
  try {
    const {
      page = 0,
      sort = "desc",
      size,
      name = null,
      mobileNo = null,
      email = null,
      address = null,
      user_type = null,
      fromDate,
      toDate = new Date(),
    } = body;
    let query = `select * from users where `;
    let countQuery = "select count(*) from users where ";
    // duration @> $1::TIMESTAMPTZ)
    let created_date_sql = ` created_date > '${fromDate}'::TIMESTAMPTZ and`;

    // let created_date_sql=` created_date '${fromDate}' and '${toDate}' `
    let email_sql = `user_email = '${email}' and`;
    let mobile_sql = ` user_phone like '${mobileNo}' and`;
    let address_sql = ` address::jsonb ->> 'state' = '${address}'`;
    if (email !== null) {
      query = query + email_sql;
      countQuery = countQuery + email_sql;
    }
    if (mobileNo != null) {
      query = query + mobile_sql;
      countQuery = countQuery + mobile_sql;
    }
    if (fromDate != null) {
      query = query + created_date_sql;
      countQuery = countQuery + created_date_sql;
    }
    if (address != null) {
      query = query + address_sql;
      countQuery = countQuery + address_sql;
    }

    query = query + ` order by first_name ${sort} limit ${size}`;
    // let data = await db.any(query, []);
    // let count = await db.any(countQuery, []);
    let data = await userDao.customQueryExecutor(query);
    let count = await userDao.customQueryExecutor(countQuery);

    let tempData = {
      totalCount: count[0].count,
      size: size,
      content: data,
    };
    result = tempData;
  } catch (error) {
    console.log("Error occurred in search user ", error);
    throw error;
  }
  return result;
};

/**
 * Method to get all existing users
 */
const fetchAllUsers = async () => {
  try {
    let result = null;
    let data = await userDao.getAll();
    result = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetchAllUsers", error);
    throw error;
  }
};

/**
 * Method to delete user based on user id
 * @param {uuid} user_id
 */
const deleteUser = async (user_id) => {
  try {
    let result = {
      data: null,
      isError: false,
    };
    let data = await userDao.deleteById(user_id);
    if (data === null) result = { message: "user not exist" };
    else result["data"] = "Success";

    return result;
  } catch (error) {
    console.log("Error occurred in delete user", error);
    throw error;
  }
};

/**
 * Method to fetch user by email
 * @param {email} user_email
 * @returns
 */
const fetchUserByEmailBase = async (user_email) => {
  try {
    return await userDao.getByEmail(user_email);
  } catch (error) {
    console.log("Error occurred in fetchUserByEmailBase", error);
    throw error;
  }
};

/**
 * Method to update user type
 * @returns
 */
const updateUserType = async (body, dbTxn) => {
  let result = null;
  try {
    let dbConn = dbTxn !== null ? dbTxn : db;
    const { user_type, user_id, submission_status } = body;
    let { data } = await fetchUser(user_id);
    if (data !== null) {
      let userTypeList = [...data.user_type];
      //If submission, add the new type. if reject, remove from type.
      if (submission_status === "APR") {
        userTypeList.push(user_type);
      } else {
        const index = userTypeList.indexOf(user_type);
        if (index > -1) {
          userTypeList.splice(index, 1);
        }
      }
      result = await userDao.updateUserType(user_id, userTypeList, dbConn);
    } else {
      result = { message: "user not exist" };
    }
    return result;
  } catch (error) {
    console.log("Error occurred in updateUserType: ", error);
    throw error;
  }
};

/**
 * Pagination for search name
 * @param {JSON} body
 * @returns
 */
const searchName = async (body) => {
  try {
    let result = null;
    const { search_text, search_area } = body;
    let query = null;
    let searchText = search_text;
    let newText = searchText.replace(`'`, `''`);
    let company_query = `select c.company_id id ,c.company_name as name, c.company_profile_img avatar , 'C' as type from company c where  c.company_name ilike $1`;
    let user_query = `select
      u.user_id id ,
      concat(u.first_name, ' ', u.last_name) as name ,
      u.user_profile_img avatar ,
      'U' as type
    from
      users u
    where
      concat(u.first_name, ' ', u.last_name) ilike $1`;
    let event_query = `select e.event_id as id ,e.event_name as name ,e.event_logo as avatar,'E' as type  from events e where e.event_name ilike $1`;
    switch (search_area) {
      case "C":
        query = company_query;
        break;
      case "U":
        query = user_query;
        break;
      case "E":
        query = event_query;
        break;
      case "B":
        query = `${company_query} union all ${user_query} union all ${event_query}`;
        break;
      default:
        break;
    }
    let data = await userDao.customQueryExecutor1(query, [`%${newText}%`]);
    result = data;
    return result;
  } catch (error) {
    console.log("Error occurred in search user ", error);
    throw error;
  }
};

/**
 * Method to fetch user data by user id
 * @returns
 */
const fetchUserData = async (user_id, type = null) => {
  try {
    let result = {};
    let user = await userDao.getById(user_id);
    let follower = await userDao.fetchFollowerList(user_id);
    let following = await userDao.fetchFollowingList(user_id, type);
    let event = await userDao.fetchEvents(user_id);
    result["user"] = user;
    result["follower"] = follower;
    result["following"] = following;
    result["events"] = event;
    if (
      result.user === null ||
      result.follower === null ||
      result.following === null ||
      result.events === null
    ) {
      return (result = { message: "user not exist" });
    }
    return result;
  } catch (error) {
    console.log("Error occurred in fetch follower", error);
    throw error;
  }
};

/**
 * Method for referral code verification
 * @returns
 */
const verifyReferralCode = async (code) => {
  try {
    let result = {};
    let data = await userDao.verifyReferralCode(code);
    if (data === null) result = { message: "Code Not Found", Status: false };
    else result = { message: "Verified", Status: true };
    return result;
  } catch (error) {
    console.log("Error occurred in VerifiedCode", error);
    throw error;
  }
};

/**
 * Method to fetch user by user name
 * @param {string} user_name,user_id(optional parameter)
 * @returns
 */
const fetchUserName = async (user_name, viewed_user_id) => {
  try {
    let result = {};
    let connectionObj = null;
    let data = await userDao.getUserName(user_name);
    if (data === null) return (result = { message: "user_name not exist" });
    else {
      result["data"] = data;

      if (viewed_user_id) {
        // await activityLogDao.add(
        //   "VIEW",
        //   "USER",
        //   viewed_user_id,
        //   null,
        //   data?.user_id,
        //   null,
        //   "USER",
        //   null,
        //   connectionObj
        // );
        if (data?.user_id !== viewed_user_id) {
          await activityLogDao.addActivityLog(
            "USR",
            "VIW",
            null,
            null,
            data?.user_id,
            viewed_user_id,
            null
          );
        }
      }
    }

    if (data.address && data.address.country) {
      let country_code1 = data?.address?.country;
      let countryData = await countryDao.fetchcountrybyCode(country_code1);
      let data1 = {
        country_id: countryData?.country_id,
        country_code: countryData?.country_code,
        country_name: countryData?.country_name,
        country_currency: countryData?.country_currency,
        country_states: countryData?.country_states,
        created_date: countryData?.created_date,
        updated_date: countryData?.updated_date,
      };

      result["data"]["countryData"] = JSON.stringify(data1);
    }

    return result;
  } catch (error) {
    console.log("Error occurred in fetchUserName ", error);
    throw error;
  }
};

/**
 * Method to Activate the user
 * @returns
 */
const activateUser = async (body) => {
  let result = null;
  try {
    const { user_id, status } = body;
    result = await userDao.updateUserStatus(user_id, status);
    if (result === null) {
      result = { message: "user not exist" };
    } else if (result?.user_status === "AC") {
      let firstName = result?.first_name;
      let lastName = result?.last_name;
      let name = firstName + " " + lastName;
      let emailId = result?.user_email;
      activationMail(name, emailId);
    } else if (result?.user_status === "IN") {
      let firstName = result?.first_name;
      let lastName = result?.last_name;
      let name = firstName + " " + lastName;
      let emailId = result?.user_email;
      inActivationMail(name, emailId);
    }
    return result;
  } catch (error) {
    console.log("Error occurred in activateUser: ", error);
    throw error;
  }
};

/**
 * Method to get Player Details by PlayerId
 * @param {Id} player_id
 * @returns
 */
const getByPlayerId = async (player_id) => {
  try {
    let result = {};
    let playerNumber = player_id.replace(/\D/g, "");
    let userString = "USR";
    let playerId = userString.concat(playerNumber);
    let data = await userDao.getUserByReferralCode(playerId);
    if (data === null)
      result = { message: "User not Exist for this player id" };
    else result = data;
    return result;
  } catch (error) {
    console.log("Error occurred in User Service : getByPlayerId", error);
    throw error;
  }
};

/**
 * Method for User Profile Verification
 */
const userProfileVerification = async (body) => {
  try {
    let user_profile_verified = body.user_profile_verified;
    let user_id = body.user_id;
    let user = {
      data: null,
    };
    let data = await userDao.userProfileVerification(
      user_profile_verified,
      user_id
    );
    if (data === null) user = { message: "User not available " };
    else {
      user["data"] = data;

      /*       Activity Log For User Verifies Profile */
      if (user_profile_verified === true) {
        await activityLogDao.addActivityLog(
          "USR",
          "VER",
          null,
          null,
          null,
          user_id,
          null
        );
      }
    }
    return user;
  } catch (error) {
    console.log(
      "Error occurred in User Service : userProfileVerification",
      error
    );
    throw error;
  }
};

module.exports = {
  createUser,
  editUser,
  fetchUser,
  deleteUser,
  uploadTest,
  fetchAllUsers,
  searchUser,
  fetchUserByEmail,
  updateByToken,
  fetchUserByToken,
  fetchUserByEmailBase,
  updateUserType,
  searchName,
  fetchUserData,
  updateByTokenAndEmail,
  verifyReferralCode,
  fetchUserName,
  activateUser,
  getByPlayerId,
  userProfileVerification,
};
