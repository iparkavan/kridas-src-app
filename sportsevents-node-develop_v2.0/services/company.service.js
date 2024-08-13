const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");
const { sendMail, sendMailGeneric } = require("../services/mail.service");
const companyDao = require("../dao/company.dao");
const countryDao = require("../dao/country.dao");
const {
  documentUpload,
  cloudinaryUpload,
  deleteDocuments,
} = require("../utils/common");
const commonDao = require("../dao/common/utils.dao");
const companyUserDao = require("../dao/companyUser.dao");
const { referralCode } = require("../utils/randomNumber");
const SponsorRequestorDealDao = require("../dao/sponsorRequestorDeal.dao");
const SportsDao = require("../dao/sports.dao");
const EventsDao = require("../dao/events.dao");
const TournamentDao = require("../dao/tournaments.dao");
const CompanySports = require("../dao/companySport.dao");
const activityLogDao = require("../dao/activityLog.dao");
const companyStatisticsDao = require("../dao/companyStatistics.dao");
const followerService = require("../services/follower.service");
const categoryDao = require("../dao/category.dao");

/**
 * Method to create new company
 * @param {json} body
 * @param {Json} database
 */
const createCompany = async (body, database = null) => {
  let result = null;
  try {
    // if (result !== null) {
    //   sendMailGeneric(
    //     result.company_email,
    //     result,
    //     "COMPANY_EMAIL_ACTIVATION",
    //     null
    //   );
    // }

    result = await db
      .tx(async (t) => {
        const {
          company_name,
          company_reg_no = null,
          company_email = null,
          company_contact_no = null,
          company_website = null,
          company_desc = null,
          alternate_name = null,
          social = null,
          address = null,
          parent_company_id = null,
          company_type,
          files = {},
          company_profile_verified = false,
          user_id,
          main_category_type = null,
          sports_interest = null,
          company_contacts = null,
          company_tax_info = null,
          company_bank_details = null,
          category_id = 0,
          company_category = null,
        } = body;
        let companyName = null;
        let companyCount = null;
        let reset_token = uuidv4();
        let role = "ADM";

        let imageUrl = null;
        let identity_docs = [];
        let companyProfileImage = null;

        if (JSON.stringify(files) !== JSON.stringify({})) {
          if (files?.image !== null && files?.image !== undefined)
            imageUrl = await cloudinaryUpload(files.image[0]);

          if (
            files?.companyProfileImage !== null &&
            files?.companyProfileImage !== undefined
          )
            companyProfileImage = await cloudinaryUpload(
              files.companyProfileImage[0]
            );

          // S3 file upload
          if (JSON.stringify(files) !== JSON.stringify({}))
            identity_docs = await documentUpload(files);
        }
        //connection obj
        let transaction = database !== null ? database : db;

        companyName = await companyDao.getCompanyNameCount(company_name);
        let companyPublicUrlName;
        if (companyName[0].count === "0") {
          companyPublicUrlName = company_name
            .replace(/[^a-zA-Z0-9]/g, "")
            .trim();
          let companyNameExisting = await companyDao.getCompanyNameCount(
            companyPublicUrlName
          );
          if (companyNameExisting[0].count !== "0") {
            companyPublicUrlName = company_name
              .replace(/[^a-zA-Z0-9]/g, "")
              .trim().companyNameExisting[0].count;
          }
        } else {
          companyPublicUrlName =
            company_name.replace(/[^a-zA-Z0-9]/g, "").trim() +
            "." +
            companyName[0].count;
          let companyNameExisting = await companyDao.getCompanyNameCount(
            companyPublicUrlName
          );
          if (companyNameExisting[0].count !== "0") {
            companyPublicUrlName = company_name
              .replace(/[^a-zA-Z0-9]/g, "")
              .trim().companyNameExisting[0].count;
          }
        }

        let parentCategoryIdQuery = `select
        category_id
      from
        category c2
      where
        c2.category_type = 'ACD'
        and c2.parent_category_id =(
        select
          c3.category_id
        from
          category c3
        where
          c3.category_type = 'CAT')`;

        let subCatQueryForAcademy = `select
          c.category_id 
        from
          category c
        where
          c.parent_category_id =(
          select
            category_id
          from
            category c2
          where
            c2.category_type = 'ACD'
            and c2.parent_category_id =(
            select
              c3.category_id
            from
              category c3
            where
              c3.category_type = 'CAT')
        )
          and c.category_type = 'ACD'`;

        let parentCat = await commonDao.customQueryExecutor(
          parentCategoryIdQuery,
          transaction
        );

        let subCat = await commonDao.customQueryExecutor(
          subCatQueryForAcademy,
          transaction
        );

        let parentVenueCategoryIdQuery = `select
          category_id
        from
          category c2
        where
          c2.category_type = 'VEN'
          and c2.parent_category_id =(
          select
            c3.category_id
          from
            category c3
          where
            c3.category_type = 'CAT')`;

        let subCatQueryForVenue = `select
            c.category_id 
          from
            category c
          where
            c.parent_category_id =(
            select
              category_id
            from
              category c2
            where
              c2.category_type = 'VEN'
              and c2.parent_category_id =(
              select
                c3.category_id
              from
                category c3
              where
                c3.category_type = 'CAT')
          )
            and c.category_type = 'VEN'`;

        let parentVenCat = await commonDao.customQueryExecutor(
          parentVenueCategoryIdQuery,
          transaction
        );

        let subVenCat = await commonDao.customQueryExecutor(
          subCatQueryForVenue,
          transaction
        );

        let main_category_type_id = parentCat[0].category_id;
        let sub_category_id = subCat[0].category_id;
        let ven_main_category_type_id = parentVenCat[0].category_id;
        let ven_sub_category_id = subVenCat[0].category_id;

        if (main_category_type_id === Number(main_category_type)) {
          if (company_type === null || company_type.length === 0) {
            let academy_company_type = sub_category_id;

            result = await companyDao.add(
              company_name,
              company_reg_no,
              companyProfileImage,
              company_email,
              company_contact_no,
              company_website,
              company_desc,
              alternate_name,
              imageUrl,
              social,
              address,
              JSON.stringify(identity_docs),
              reset_token,
              parent_company_id,
              [academy_company_type],
              company_profile_verified,
              companyPublicUrlName,
              main_category_type,
              company_contacts,
              company_tax_info,
              company_bank_details,
              t
            );
          } else {
            result = await companyDao.add(
              company_name,
              company_reg_no,
              companyProfileImage,
              company_email,
              company_contact_no,
              company_website,
              company_desc,
              alternate_name,
              imageUrl,
              social,
              address,
              JSON.stringify(identity_docs),
              reset_token,
              parent_company_id,
              company_type,
              company_profile_verified,
              companyPublicUrlName,
              main_category_type,
              company_contacts,
              company_tax_info,
              company_bank_details,
              t
            );
          }
        } else if (ven_main_category_type_id === Number(main_category_type)) {
          if (company_type === null || company_type.length === 0) {
            let venue_company_type = ven_sub_category_id;

            result = await companyDao.add(
              company_name,
              company_reg_no,
              companyProfileImage,
              company_email,
              company_contact_no,
              company_website,
              company_desc,
              alternate_name,
              imageUrl,
              social,
              address,
              JSON.stringify(identity_docs),
              reset_token,
              parent_company_id,
              [venue_company_type],
              company_profile_verified,
              companyPublicUrlName,
              main_category_type,
              company_contacts,
              company_tax_info,
              company_bank_details,
              t
            );
          } else {
            result = await companyDao.add(
              company_name,
              company_reg_no,
              companyProfileImage,
              company_email,
              company_contact_no,
              company_website,
              company_desc,
              alternate_name,
              imageUrl,
              social,
              address,
              JSON.stringify(identity_docs),
              reset_token,
              parent_company_id,
              company_type,
              company_profile_verified,
              companyPublicUrlName,
              main_category_type,
              company_contacts,
              company_tax_info,
              company_bank_details,
              t
            );
          }
        } else {
          result = await companyDao.add(
            company_name,
            company_reg_no,
            companyProfileImage,
            company_email,
            company_contact_no,
            company_website,
            company_desc,
            alternate_name,
            imageUrl,
            social,
            address,
            JSON.stringify(identity_docs),
            reset_token,
            parent_company_id,
            company_type,
            company_profile_verified,
            companyPublicUrlName,
            main_category_type,
            company_contacts,
            company_tax_info,
            company_bank_details,
            t,
            category_id,
            company_category
          );
        }

        let currentDate = new Date();

        let userFollowOwnCompanyBody = {
          follower_userid: user_id,
          follower_companyid: null,
          following_companyid: result?.company_id,
          following_userid: null,
          followed_from: currentDate,
          following_event_id: null,
        };

        await followerService.createFollower(userFollowOwnCompanyBody, t);

        if (main_category_type_id === Number(main_category_type)) {
          let companyPublicURLNameExisting =
            await companyDao.getByCompanyPublicURLName(companyPublicUrlName, t);

          let companyPublicUrlNameNew =
            companyPublicUrlName + "." + companyPublicURLNameExisting?.count;

          // let categorywise_statistics = {
          //   academy_name: company_name,
          //   sports_id: sports_interest !== null ? sports_interest[0] : "",
          //   category: "ACD",
          //   gender: "",
          //   age_group: "",
          //   skill_level: "",
          // };

          let childAcademy = await companyDao.add(
            company_name,
            null,
            null,
            null,
            null,
            null,
            "",
            null,
            null,
            null,
            null,
            "[]",
            null,
            result?.company_id,
            [sub_category_id],
            false,
            companyPublicUrlNameNew,
            main_category_type,
            company_contacts,
            company_tax_info,
            company_bank_details,
            t
          );

          await companyUserDao.add(
            childAcademy.company_id,
            user_id,
            "p",
            role,
            currentDate,
            null,
            t
          );

          // let companyStatistics = await companyStatisticsDao.add(
          //   childAcademy?.company_id,
          //   categorywise_statistics,
          //   null,
          //   null,
          //   t
          // );

          if (sports_interest && sports_interest.length > 0) {
            let companySportsResponse = [];
            // let SportLength = sports_interest.length;
            // for (let i = 0; i < SportLength; i++) {
            let companySports = await CompanySports.add(
              childAcademy?.company_id,
              sports_interest[0],
              (is_delete = false),
              t
            );
            companySportsResponse.push(companySports);
            // }
          }

          // result["company-sports"] = companySportsResponse;

          let academy_id = childAcademy?.company_id;

          let academyFollowerBody = {
            follower_userid: null,
            follower_companyid: result?.company_id,
            following_companyid: academy_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(academyFollowerBody, t);

          let userFollowOwnCompanyBody = {
            follower_userid: user_id,
            follower_companyid: null,
            following_companyid: academy_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(userFollowOwnCompanyBody, t);
        }

        if (ven_main_category_type_id === Number(main_category_type)) {
          let companyPublicURLNameExisting =
            await companyDao.getByCompanyPublicURLName(companyPublicUrlName, t);

          let companyPublicUrlNameNew =
            companyPublicUrlName + "." + companyPublicURLNameExisting?.count;

          // let categorywise_statistics = {
          //   venue_name: company_name,
          //   sports_id: sports_interest !== null ? sports_interest[0] : "",
          //   category: "VEN",
          // };

          let childVenue = await companyDao.add(
            company_name,
            null,
            null,
            null,
            null,
            null,
            "",
            null,
            null,
            null,
            null,
            "[]",
            null,
            result?.company_id,
            [ven_sub_category_id],
            false,
            companyPublicUrlNameNew,
            main_category_type,
            company_contacts,
            company_tax_info,
            company_bank_details,
            t
          );

          await companyUserDao.add(
            childVenue.company_id,
            user_id,
            "p",
            role,
            currentDate,
            null,
            t
          );

          // let companyStatistics = await companyStatisticsDao.add(
          //   childVenue?.company_id,
          //   categorywise_statistics,
          //   null,
          //   null,
          //   t
          // );

          if (sports_interest && sports_interest.length > 0) {
            let companySportsResponse = [];
            // let SportLength = sports_interest.length;
            // for (let i = 0; i < SportLength; i++) {
            let companySports = await CompanySports.add(
              childVenue?.company_id,
              sports_interest[0],
              (is_delete = false),
              t
            );
            companySportsResponse.push(companySports);
            // }
          }

          let venue_id = childVenue?.company_id;

          let academyFollowerBody = {
            follower_userid: null,
            follower_companyid: result?.company_id,
            following_companyid: venue_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(academyFollowerBody, t);

          let userFollowOwnCompanyBody = {
            follower_userid: user_id,
            follower_companyid: null,
            following_companyid: venue_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(userFollowOwnCompanyBody, t);
        }

        await companyUserDao.add(
          result.company_id,
          user_id,
          "p",
          role,
          currentDate,
          null,
          t
        );

        if (sports_interest && sports_interest.length > 0) {
          let SportLength = sports_interest.length;
          for (let i = 0; i < SportLength; i++) {
            companySports = await CompanySports.add(
              result.company_id,
              sports_interest[i],
              (is_delete = false),
              t
            );
          }
        }

        // await activityLogDao.add(
        //   "PAGE",
        //   "CREATE",
        //   null,
        //   result.company_id,
        //   null,
        //   null,
        //   "C",
        //   null,
        //   t
        // );

        await activityLogDao.addActivityLog(
          "PAG",
          "CRE",
          null,
          null,
          result.company_id,
          user_id,
          null
        );

        return result;
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log("failure, ROLLBACK was executed", error);
        throw error;
      });
    return result;
  } catch (error) {
    console.log("Error occurred in create company:", error);
    throw error;
  }
};

/**
 * Method to update existing company
 * @param {json} body
 * @param {Json} database
 */
const editCompany = async (body, database = null) => {
  try {
    let result = null;
    const {
      company_name,
      company_reg_no = null,
      company_profile_img = null,
      company_email,
      company_contact_no,
      company_website = null,
      company_desc = null,
      alternate_name = null,
      company_img = null,
      social = null,
      address = null,
      company_identity_docs = "[]",
      documentTypes,
      parent_company_id = null,
      company_type,
      files = {},
      company_profile_verified = false,
      company_status,
      company_id,
      // company_public_url_name,
      main_category_type = null,
      sports_interest = null,
      categorywise_statistics,
      company_contacts = null,
      company_tax_info = null,
      company_bank_details = null,
      category_id,
      company_category,
      // is_featured
    } = body;

    const company = await fetchCompany(company_id);

    let pageOwner = await companyUserDao.getByCompanyId(company_id);
    let user_id = pageOwner[0].user_id;

    if (!(company?.message === undefined)) {
      result = { message: "company not exist" };
      return result;
    }

    // const companyPublicUrlName = await companyDao.getPublicUrlNameCount(company_public_url_name)

    if (parent_company_id != null) {
      const parentCompany = await fetchCompany(parent_company_id);
      if (!(parentCompany?.message === undefined)) {
        result = { message: "parent company not exist" };
        return result;
      }
    }

    let imageUrl =
      company?.data?.company_img === undefined
        ? null
        : company?.data?.company_img;
    let companyProfileImage =
      company?.data?.company_profile_img === undefined
        ? null
        : company?.data?.company_profile_img;
    let imageMetaData =
      company?.data?.company_img_meta === undefined
        ? null
        : company?.data?.company_img_meta;
    let profileImageMetaData =
      company?.data?.company_profile_img_meta === undefined
        ? null
        : company?.data?.company_profile_img_meta;
    let identity_docs = JSON.parse(company_identity_docs).filter(
      (doc) => doc.is_delete === "N"
    );
    let deleted_doc_list = JSON.parse(company_identity_docs).filter(
      (doc) => doc.is_delete === "Y"
    );

    let profilePath = `profle/company/${company?.data?.company_id}`;
    let bannerPath = `banner/company/${company?.data?.company_id}`;

    if (JSON.stringify(files) !== JSON.stringify({})) {
      if (files?.image !== null && files?.image !== undefined) {
        imageMetaData = await cloudinaryUpload(files.image[0], bannerPath);
        imageUrl = imageMetaData.url;
      }

      if (
        files?.companyProfileImage !== null &&
        files?.companyProfileImage !== undefined
      ) {
        profileImageMetaData = await cloudinaryUpload(
          files.companyProfileImage[0],
          profilePath
        );
        companyProfileImage = profileImageMetaData.url;
      }

      // S3 file upload
      if (JSON.stringify(files) !== JSON.stringify({})) {
        let docRespons = await documentUpload(files);
        if (documentTypes) {
          const documentType = JSON.parse(documentTypes);
          docRespons = docRespons.map((resDoc, index) => {
            resDoc.type = documentType[index] || "";
            return resDoc;
          });
          identity_docs = [...identity_docs, ...docRespons];
        }
      }
    }
    //s3 delete
    await deleteDocuments(deleted_doc_list);

    let transaction = database !== null ? database : db;
    result = await companyDao.edit(
      company_name,
      company_reg_no,
      companyProfileImage,
      company_email,
      company_contact_no,
      company_website,
      company_desc,
      alternate_name,
      imageUrl,
      social,
      address,
      JSON.stringify(identity_docs),
      parent_company_id,
      company_type,
      company_profile_verified,
      company_status,
      company_id,
      profileImageMetaData,
      imageMetaData,
      // company_public_url_name.replace(/\s+/g, '.').trim(),
      main_category_type,
      // is_featured,
      company_contacts,
      company_tax_info,
      company_bank_details,
      category_id,
      company_category,
      transaction
    );

    if (sports_interest && sports_interest.length > 0) {
      await CompanySports.updateIsdelete(company_id, transaction);
      let dbCompanySport = null;
      for await (let sport of sports_interest) {
        dbCompanySport = await CompanySports.getbyCompanySports(
          company_id,
          sport
        );
        let is_deleted = false;
        if (dbCompanySport !== null)
          await CompanySports.edit(
            company_id,
            sport,
            is_deleted,
            dbCompanySport.company_sport_id,
            transaction
          );
        else
          await CompanySports.add(company_id, sport, is_deleted, transaction);
      }
    } else if (
      sports_interest !== null &&
      !sports_interest.length &&
      sports_interest.length === 0
    ) {
      await CompanySports.updateIsdelete(company_id, transaction);
    }

    if (categorywise_statistics) {
      let companyStatisticsExisting = await companyStatisticsDao.getCompanyById(
        company_id,
        transaction
      );

      if (companyStatisticsExisting?.length !== 0) {
        let companyStatistics = await companyStatisticsDao.updateByCompanyId(
          company_id,
          categorywise_statistics,
          null,
          null,
          transaction
        );
        result["company-statistics"] = companyStatistics;
      } else {
        let companyStatistics = await companyStatisticsDao.add(
          company_id,
          categorywise_statistics,
          null,
          null,
          transaction
        );
        result["company-statistics"] = companyStatistics;
      }
    }

    // await activityLogDao.add(
    //   "PAGE",
    //   "UPDATE",
    //   null,
    //   result.company_id,
    //   null,
    //   null,
    //   "C",
    //   null,
    //   transaction
    // );

    await activityLogDao.addActivityLog(
      "PAG",
      "EDT",
      null,
      null,
      result.company_id,
      user_id,
      null
    );

    return result;
  } catch (error) {
    console.log("Error occurred in update company: ", error);
    throw error;
  }
};

/**
 * Method to get company based on user id
 * @param {uuid} user_id
 * @param  country_code
 */
const fetchCompanyByUser = async (user_id) => {
  try {
    let company = {};
    let data = await companyDao.getCompanyByUserId(user_id);
    if (data === null) company = { message: "company not exist" };
    else company["data"] = data;
    return company;
  } catch (error) {
    console.log("Error occurred in fetch company: ", error);
    throw error;
  }
};

/**
 * Method to get company based on company id
 * @param {uuid} company_id
 * @param  country_code
 */
const fetchCompany = async (company_id, user_id) => {
  try {
    let company = {};
    let query = `WITH CompanyCategories AS (
      SELECT
          company_id,
          UNNEST(company_category) AS category_id
      FROM
          company
      WHERE
          company_id = '${company_id}' 
  )
  
  SELECT
      cc.company_id,
      ARRAY_AGG(cat.category_name) AS company_category_name
  FROM
      CompanyCategories cc
  JOIN
      category cat ON cat.category_id = cc.category_id
  GROUP BY
      cc.company_id;
  `;
    let query2 = `select s.*, es.* from sponsor s join event_sponsor es on s.sponsor_id = es.sponsor_id where company_id ='${company_id}'`;

    let company_category_name = await commonDao.customQueryExecutor(query);
    let company_event_sponsor = await commonDao.customQueryExecutor(query2);

    let data = await companyDao.getByIdWithCatDetails(company_id);
    let connectionObj = null;

    if (data === null) {
      company = { message: "company not exist" };
      return company;
    } else {
      company["data"] = data;
      if (user_id) {
        // await activityLogDao.add(
        //   "VIEW",
        //   "PAGE",
        //   user_id,
        //   null,
        //   company_id,
        //   null,
        //   "PAGE",
        //   null,
        //   connectionObj
        // );

        await activityLogDao.addActivityLog(
          "PAG",
          "VIW",
          null,
          null,
          company_id,
          user_id,
          null
        );
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
        country_code_iso2: countryData?.country_code_iso2,
      };
      company["data"]["countryData"] = JSON.stringify(data1);
    }
    if (company_category_name && company_category_name.length > 0) {
      company["data"]["company_category_name"] = company_category_name.map(
        (item) => item.company_category_name
      );
    }
    company["data"]["company_event_sponsor"] = company_event_sponsor;
    return company;
  } catch (error) {
    console.log("Error occurred in fetch company: ", error);
    throw error;
  }
};

/**
 * Method to get all companies
 */
const fetchAll = async () => {
  try {
    let companies = null;
    let data = await companyDao.getAll();
    companies = data;
    return companies;
  } catch (error) {
    console.log("Error occurred in fetchAll company: ", error);
    throw error;
  }
};

/**
 * Method to delete company based on company id
 * @param {uuid} company_id
 */
const deleteCompany = async (company_id) => {
  try {
    let company = {};
    let sponsorRequestorDeals =
      await SponsorRequestorDealDao.getPreferredBrandCount(company_id);
    let SportsBrand = await SportsDao.getBrandCount(company_id);
    let EventVenue = await EventsDao.getEventVenueCount(company_id);
    let Tournaments = await TournamentDao.getEventVenueCount(company_id);
    if (
      sponsorRequestorDeals.count === "0" &&
      SportsBrand.count === "0" &&
      EventVenue.count === "0" &&
      Tournaments.count === "0"
    ) {
      let data = await companyDao.deleteById(company_id);
      if (data === null) company = { message: "company not exist" };
      else company["data"] = "Success";
    } else {
      company = {
        message:
          "Unable to Delete This Company.It is still referenced as Foreign Key",
      };
    }
    return company;
  } catch (error) {
    console.log("Error occurred in delete company: ", error);
    throw error;
  }
};

/**
 * Method to get company based on company email
 * @param {string} company_email
 */
const fetchCompanyByEmail = async (company_email) => {
  try {
    let result = {};
    let data = await companyDao.getByEmail(company_email);
    if (data === null) result = { message: "company not exist" };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetchCompanyByEmail: ", error);
    throw error;
  }
};

/**
 * Method to get company based on company type
 * @param {String} company_type
 */
const fetchCompanyByType = async (company_type) => {
  try {
    let result = {};
    let data = await companyDao.getByType(company_type);
    if (data === null) result = { message: "company not exist" };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetchCompanyByType: ", error);
    throw error;
  }
};

/**
 * Method to get company based on reset token
 * @param {uuid} token
 */
const fetchCompanyByToken = async (token) => {
  try {
    let result = {};
    let data = await companyDao.getByToken(token);
    if (data === null) result = { message: "company not exist" };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetchCompanyByToken: ", error);
    throw error;
  }
};

/**
 * Method to update company based on reset token
 * @param {json} body
 */
const updateByToken = async (body) => {
  try {
    let result = null;
    const { token } = body;
    let { data } = await fetchCompanyByToken(token);
    if (data !== null) {
      let company_status = "AC";
      result = await companyDao.updateByToken(company_status, token);
      return result;
    } else {
      result = { message: "company not exist" };
    }
  } catch (error) {
    console.log("Error occurred in updateByToken: ", error);
    throw error;
  }
};

/**
 * Method to get company by company email
 * @param {email} company_email
 * @returns
 */
const fetchCompanyByEmailBase = async (company_email) => {
  try {
    return await db.oneOrNone(
      "select * from company where company_email = $1",
      [company_email]
    );
  } catch (error) {
    console.log("Error occurred in fetchCompanyByEmailBase", error);
    throw error;
  }
};

/**
 * Method to Search Company
 * @param {JSON} body
 * @returns
 */
const searchCompany = async (body) => {
  let result = null;
  try {
    const { page = 0, sort = "desc", size = 5, user_id } = body;
    //  let query = `select c.*, t.following_count, cu.user_id, ct.* from company c left join ( select c.company_id , COUNT(f2.follower_companyid) as following_count from company c left join follower f2 on f2.follower_companyid = c.company_id and f2.is_delete=false  group by c.company_id ) t on t.company_id = c.company_id join company_users cu on cu.company_id = c.company_id left join ( select t.company_id, ARRAY_AGG(c3.category_name) category_name_arr, c3.parent_category_id , c4.category_name parent_category_name from ( select company_id, unnest(c.company_type) category_id from company c) t left join category c3 on c3.category_id = t.category_id left join category c4 on c4.category_id = c3.parent_category_id group by t.company_id, c3.parent_category_id, c4.category_name ) ct on ct.company_id = c.company_id where cu.user_id = '${user_id}'`
    let query = `select
        c.*,
        (select count(*) from follower where following_companyid = c.company_id and is_delete = '0') as follower_count,
        (select count(*) from media where media_creator_company_id = c.company_id and media_type='I') as image_count,
        (select count(*) from media where media_creator_company_id = c.company_id and media_type='V') as video_count,
        t.following_count,
        cu.user_id,
      ct.*,
        c2.category_id as parent_category_id,
        c2.category_name as parent_category_name,
        case
        when c.parent_company_id is null then jsonb_build_object('company_type', 'Parent Page', 'parent_page_id', c.company_id)
      when comp.company_id is not null
      and c4.company_id is null then jsonb_build_object('company_type', 'Child Page', 'parent_page_id', c.parent_company_id)
      when comp.company_id is not null
      and c4.company_id is not null then jsonb_build_object('company_type', 'SubTeam Page', 'parent_page_id', c4.company_id)
    end as company_type_name
    from
        company c
    left join (
    select
      c.company_id ,
      COUNT(f2.follower_companyid) as following_count
    from
      company c
    left join follower f2 on
      f2.follower_companyid = c.company_id
      and f2.is_delete = false
    group by
      c.company_id ) t on
        t.company_id = c.company_id
    join company_users cu on
        cu.company_id = c.company_id
        and cu.user_type ='p' 
    left join (
    select
      t.company_id as page_id,
      ARRAY_AGG(c3.category_name) category_name_arr
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
      t.company_id
          ) ct on
        ct.page_id = c.company_id
    left join category c2 
        on
    c2.category_id = c.main_category_type
    left join company comp on
      comp.company_id = c.parent_company_id
    left join company c4 on
      c4.company_id = comp.parent_company_id
    where
      cu.user_id ='${user_id}'`;

    let countQuery = `select
        count(1)
    from
        company c
    left join (
    select
      c.company_id ,
      COUNT(f2.follower_companyid) as following_count
    from
      company c
    left join follower f2 on
      f2.follower_companyid = c.company_id
      and f2.is_delete = false
    group by
      c.company_id ) t on
        t.company_id = c.company_id
    join company_users cu on
        cu.company_id = c.company_id
        and cu.user_type ='p' 
    left join (
    select
      t.company_id as page_id,
      ARRAY_AGG(c3.category_name) category_name_arr
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
      t.company_id
          ) ct on
        ct.page_id = c.company_id
    left join category c2 
        on
    c2.category_id = c.main_category_type
    left join company comp on
      comp.company_id = c.parent_company_id
    left join company c4 on
      c4.company_id = comp.parent_company_id
    where
      cu.user_id ='${user_id}'`;
    let offset = page > 0 ? page * size : 0;

    query =
      query + ` order by c.updated_date ${sort} limit ${size} offset ${offset}`;
    let data = await commonDao.customQueryExecutor(query);
    const count = await commonDao.customQueryExecutor(countQuery);

    let length = Number(count[0].count);
    let totalPages = length < size ? 1 : Math.ceil(length / size);

    let tempData = {
      totalCount: length,
      totalPage: totalPages,
      size: size,
      content: data,
    };
    result = tempData;
    return tempData;
  } catch (error) {
    console.log("Error occurred in search user ", error);
    throw error;
  }
};

/**
 * Method for fetch company types
 * @param {uuid} company_id
 * @returns
 */
const fetchCompanyTypes = async (company_id) => {
  return db
    .task("get-everything", async (t) => {
      const organizerCount = await t.one(
        "select count(*) from organizer where company_refid=$1",
        [company_id],
        (a) => +a.count
      );
      const serviceProviderCount = await t.one(
        "select count(*) from service_provider where company_id=$1",
        [company_id],
        (a) => +a.count
      );
      const sponsorProviderCount = await t.one(
        "select count(*) from sponsor_provider where company_id=$1",
        [company_id],
        (a) => +a.count
      );

      return { organizerCount, serviceProviderCount, sponsorProviderCount };
    })
    .then(({ organizerCount, serviceProviderCount, sponsorProviderCount }) => {
      return {
        org: organizerCount,
        psr: serviceProviderCount,
        psp: sponsorProviderCount,
      };
    })
    .catch((error) => {
      console.log("Error occurred in fetchCompanyTypes: ", error);
      throw error;
    });
};

/**
 * Method to fetch company details by Company Id
 * @param {uuid} company_id
 * @param {String} company_type
 * @returns
 */
const fetchCompanyTypeDetailsByCompanyId = async (company_id, company_type) => {
  let tableName = "";
  switch (company_type) {
    case "PSR":
      tableName = "service_provider";
      break;
    case "ORG":
      tableName = "organizer";
      break;
    case "PSP":
      tableName = "sponsor_provider";
      break;
    default:
      break;
  }

  return db
    .task("get-everything", async (t) => {
      const mainTable = await t.one(
        `select * from ${tableName} sp inner join company c on sp.company_id = c.company_id where sp.company_id = $1`,
        [company_id]
      );

      const associatedUsers = await t.manyOrNone(
        "select * from company_users cu inner join users usr on cu.user_id = usr.user_id where cu.company_id = $1 and cu.user_role=$2",
        [company_id, company_type]
      );

      return { mainTable, associatedUsers };
    })
    .then(({ mainTable, associatedUsers }) => {
      return {
        [tableName]: mainTable,
        users: associatedUsers,
      };
    })
    .catch((error) => {
      console.log("Error occurred in fetchServiceProviderByCompanyId: ", error);
      throw error;
    });
};

/**
 * Method to update company type
 */
const updateCompanyType = async (body, dbTxn) => {
  let result = null;
  try {
    let dbConn = dbTxn !== null ? dbTxn : db;
    const { company_type, company_id, submission_status } = body;
    let { data } = await fetchCompany(company_id);
    if (data !== null) {
      let date = new Date();

      let companyTypeList = [...data.company_type];

      //If submission, add the new type. if reject, remove from type.
      if (submission_status === "APR") {
        companyTypeList.push(company_type);
      } else {
        const index = companyTypeList.indexOf(company_type);
        if (index > -1) {
          companyTypeList.splice(index, 1);
        }
      }

      let query = `update company set company_type=$1,updated_date=$2 where company_id=$3 RETURNING *`;
      result = new Promise(function (resolve, reject) {
        dbConn
          .one(query, [companyTypeList, date, company_id])
          .then((data) => {
            console.log("company type updated successfully: " + data.id);
            resolve(data);
          })
          .catch((error) => {
            console.log("object.. error " + JSON.stringify(error));
            reject(error);
          });
      });
    } else {
      result = { message: "company not exist" };
    }
  } catch (error) {
    console.log("Error occurred in updateCompanyType: ", error);
    throw error;
  }
  return result;
};

/**
 * Method to get country based on country code
 * @param {string} company_name
 */
const fetchCompanyByName = async (company_name) => {
  try {
    let company = {
      data: null,
    };
    let data = await companyDao.fetchCompanyByName(company_name);
    return data;
  } catch (error) {
    console.log("Error occurred in fetchCompanybyName", error);
    throw error;
  }
};

/**
 *  Method to get the categories based on parent category id
 * @param {uuid} parent_company_id
 */

const fetchByParentCompany = async (parent_company_id) => {
  try {
    let company = {
      data: null,
    };
    let data = await companyDao.getByParentId(parent_company_id);
    if (!data.length) category = { message: "company not exist" };
    else company["data"] = data;
    return company;
  } catch (error) {
    console.log("Error occurred in fetch company", error);
    throw error;
  }
};

/**
 * Method to get all companies
 */
const fetchAllParentCompany = async () => {
  try {
    let companies = null;
    let data = await companyDao.fetchAllParentCompany();
    companies = data;
    return companies;
  } catch (error) {
    console.log("Error occurred in fetchAll parent company: ", error);
    throw error;
  }
};

/**
 * Method to get company based on company id
 * @param {uuid} company_id
 */

// const fetchCompanyDataById = async (company_id) => {
//   try {
//     let company = {};
//     let data = await companyDao.getCompanyDataById(company_id)
//     if (data === null) {
//       company = { message: "company not exist" };
//       return company;
//     }
//     else company["data"] = data;
//     return company;
//   } catch (error) {
//     throw error;
//   }
// }

const fetchCompanyData = async (company_id) => {
  try {
    let result = {};
    let companyData = await companyDao.getById(company_id);
    let companyFollower = await companyDao.getCompanyFollower(company_id);
    let companyFollowing = await companyDao.getCompanyFollowing(company_id);
    result["companyData"] = companyData;
    result["companyFollower"] = companyFollower;
    result["companyFollowing"] = companyFollowing;
    if (
      result.companyData === null ||
      result.companyFollower === null ||
      result.companyFollowing === null
    ) {
      return (result = { message: "company not exist" });
    }
    return result;
  } catch (error) {
    console.log("Error occurred in fetchCompanyFollower: ", error);
    throw error;
  }
};

/**
 * Method to get company by company public url name
 * @param {String} company_public_url_name
 * @returns
 */
const fetchCompanyUrlName = async (company_public_url_name) => {
  try {
    let result = {};
    let data = await companyDao.getCompanyUrlName(company_public_url_name);
    if (data === null)
      result = { message: "company public url name not exist" };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetchCompanyUrlName: ", error);
    throw error;
  }
};

/**
 * Method to get child company based on parent company id
 * @param {String} company_id
 * @returns
 */
const getByParentCompanyId = async (body) => {
  try {
    const {
      company_id,
      type,
      name = null,
      sports_id = null,
      gender = null,
      age_group = null,
      skill_level = null,
      user_id = null,
      venue_name,
      category_type_id = null,
    } = body;
    let result = {};

    let query = `select
        c.*,
        t.*,
        cat.category_type as parent_category_type,
        jsonb_build_object('company_type', 'Child Page', 'parent_page_id', c.parent_company_id) as company_type_name,
        v.* as sports_id
      from
        company c
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
          t.company_id ) t on
        c.company_id = t.page_id
      left join category cat on
        cat.category_id = c.main_category_type
      left join company_sport cs on
        c.company_id =cs.company_id 
      left join (
          select
            cs.categorywise_statistics ->> 'sports_id' as sports_id,
            cs.company_id as statistics_company_id,
            cs.categorywise_statistics,
            cs.categorywise_statistics ->> 'gender' as gender,
            cs.categorywise_statistics ->> 'age_group' as age_group,
            cs.categorywise_statistics ->> 'skill_level' as skill_level
          from
            company_statistics cs
              )v on
            v.statistics_company_id = c.company_id
      where
        c.parent_company_id = '${company_id}'`;

    if (type) {
      query =
        query +
        ` and c.company_type <@ (select
            array_agg (c2.category_id)
          from
            category c2
          where
            c2.category_type = '${type}')`;
    }

    if (type !== "TEA" && sports_id === "") {
      query = `select
          c.*,
          t.*,
          cat.category_type as parent_category_type,
          jsonb_build_object('company_type', 'Child Page', 'parent_page_id', c.parent_company_id) as company_type_name,
          v.* as sports_id
        from
          company c
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
            t.company_id ) t on
          c.company_id = t.page_id
        left join category cat on
          cat.category_id = c.main_category_type
        left join (
            select
              cs.categorywise_statistics ->> 'sports_id' as sports_id,
              cs.company_id as statistics_company_id,
              cs.categorywise_statistics,
              cs.categorywise_statistics ->> 'gender' as gender,
              cs.categorywise_statistics ->> 'age_group' as age_group,
              cs.categorywise_statistics ->> 'skill_level' as skill_level
            from
              company_statistics cs
                )v on
              v.statistics_company_id = c.company_id
        where
          c.parent_company_id = '${company_id}'
          and c.company_type <@ (select
            array_agg (c2.category_id)
          from
            category c2
          where
            c2.category_type = '${type}')`;
    }

    if (name) {
      query = query + ` and c.company_name ilike '%${name}%'`;
    }

    if (type === "TEA" && sports_id) {
      query = query + ` and v.sports_id = '${sports_id}'`;
    }
    if (type !== "TEA" && sports_id) {
      query = query + `  and cs.sports_refid  = ${sports_id}`;
    }

    if (gender) {
      query = query + ` and v.gender = '${gender}'`;
    }

    if (age_group) {
      query = query + ` and v.age_group = '${age_group}'`;
    }

    if (skill_level) {
      query = query + ` and v.skill_level = '${skill_level}'`;
    }

    if (user_id && sports_id) {
      if (category_type_id) {
        query = `select
        c.*
      from
        company_users cu
      left join company c on
        c.company_id = cu.company_id
      left join company_sport cs on
        cs.company_id = c.company_id
      left join company c3 on
        c3.company_id = c.parent_company_id
      where
        cu.user_id = '${user_id}'
        and c.parent_company_id is not null
        and c.company_type <@ (
        select
          array_agg (c2.category_id)
        from
          category c2
        where
          c2.category_type = 'TEA')
        and cs.sports_refid = '${sports_id}'
        and c3.parent_company_id is null
        and c.main_category_type =(
        select
          c.category_id
        from
          category c
        where
          c.category_type =(
          select
            c.category_type
          from
            category c
          where
            c.category_id = ${category_type_id})
          and c.parent_category_id =(
          select
            c2.category_id
          from
            category c2
          where
            c2.category_type = 'CAT'))`;
      } else {
        query = `select
        c.*
      from
        company_users cu
      left join company c on
        c.company_id = cu.company_id
      left join company_sport cs on
        cs.company_id = c.company_id
      left join company c3 on
        c3.company_id = c.parent_company_id
      where
        cu.user_id = '${user_id}'
        and c.parent_company_id is not null
        and c.company_type <@ (
        select
          array_agg (c2.category_id)
        from
          category c2
        where
          c2.category_type = 'TEA')
        and cs.sports_refid = '${sports_id}'
        and c3.parent_company_id is null`;
      }
    }

    if (venue_name === "") {
      query = `select
          c.*,
          t.*,
          cat.category_type as parent_category_type,
          jsonb_build_object('company_type', 'Child Page', 'parent_page_id', c.parent_company_id) as company_type_name,
          v.* as sports_id
        from
          company c
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
            t.company_id ) t on
          c.company_id = t.page_id
        left join category cat on
          cat.category_id = c.main_category_type
        left join (
          select
            cs.categorywise_statistics ->> 'sports_id' as sports_id,
            cs.company_id as statistics_company_id,
            cs.categorywise_statistics,
            cs.categorywise_statistics ->> 'gender' as gender,
            cs.categorywise_statistics ->> 'age_group' as age_group,
            cs.categorywise_statistics ->> 'skill_level' as skill_level
          from
            company_statistics cs
                        )v on
          v.statistics_company_id = c.company_id
        where
          c.company_type <@ (
          select
            array_agg (c2.category_id)
          from
            category c2
          where
            c2.category_type = 'VEN')
          and c.company_type != '{}'`;
    }
    if (venue_name !== "" && venue_name !== undefined) {
      query = `select
          c.*,
          t.*,
          cat.category_type as parent_category_type,
          jsonb_build_object('company_type', 'Child Page', 'parent_page_id', c.parent_company_id) as company_type_name,
          v.* as sports_id
        from
          company c
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
            t.company_id ) t on
          c.company_id = t.page_id
        left join category cat on
          cat.category_id = c.main_category_type
        left join (
          select
            cs.categorywise_statistics ->> 'sports_id' as sports_id,
            cs.company_id as statistics_company_id,
            cs.categorywise_statistics,
            cs.categorywise_statistics ->> 'gender' as gender,
            cs.categorywise_statistics ->> 'age_group' as age_group,
            cs.categorywise_statistics ->> 'skill_level' as skill_level
          from
            company_statistics cs
                        )v on
          v.statistics_company_id = c.company_id
        where
          c.company_type <@ (
          select
            array_agg (c2.category_id)
          from
            category c2
          where
            c2.category_type = 'VEN')
          and c.company_type != '{}'
          and c.company_name ilike '%${venue_name}%'`;
    }

    let data = await commonDao.customQueryExecutor(query);

    if (data.length === 0) result["data"] = [];
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in getByParentCompanyId: ", error);
    throw error;
  }
};

/**
 * For SearchByName Pagination API - Company
 * @param {JSON} body
 * @returns
 */

const search = async (body) => {
  let result = null;
  try {
    const {
      page = 0,
      sort = "desc",
      size = 5,
      company_name = null,
      parent_category_id = null,
      // category_ids = null,
      sports_id = null,
      city = null,
      user_id = null,
      sub_category_type = null,
    } = body;

    let query = null;
    let countQuery = null;

    query = `select
        c.*,
        v.category_arr,
        c2.category_name as parent_category_name,
        c2.category_type as parent_category_type,
        count(f) as follower_count,
          case
          when c.parent_company_id is null then jsonb_build_object('company_type', 'Parent Page', 'parent_page_id', c.company_id)
          when comp.company_id is not null
          and c4.company_id is null then jsonb_build_object('company_type', 'Child Page', 'parent_page_id', c.parent_company_id)
          when comp.company_id is not null
          and c4.company_id is not null then jsonb_build_object('company_type', 'SubTeam Page', 'parent_page_id', c4.company_id)
        end as company_type_name
      from
        company c
      left join (
        select
          t.company_id as page_id,
          ARRAY_AGG(jsonb_build_object('category_id', c3.category_id,'parent_category_id',c3.parent_category_id, 'category_type',c3.category_type,'category_name', c3.category_name,'category_desc',c3.category_desc,'created_date',c3.created_date,'updated_date',c3.updated_date)) as category_arr
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
          t.company_id )v
                          on
        v.page_id = c.company_id
      left join category c2 on
        c2.category_id = c.main_category_type
      left join follower f on
        f.following_companyid = c.company_id
        and f.is_delete = false
      left join company comp on
        comp.company_id = c.parent_company_id
      left join company c4 on
        c4.company_id = comp.parent_company_id
      where
        1 = 1 
        and c.company_id not in (
          select
            distinct company_id
          from
            teams)`;
    countQuery = `select
        count(c.*)
      from
        company c
      where
        1 = 1
        and c.company_id not in (
        select
          distinct company_id
        from
          teams) `;

    if (company_name !== null) {
      query = query + ` and c.company_name ilike '%${company_name}%' `;
      countQuery = countQuery + `and c.company_name ilike '%${company_name}%' `;
    }
    if (sports_id !== null && sports_id.length > 0) {
      query =
        query +
        `and c.company_id in (select cs.company_id from company_sport cs where cs.sports_refid in (${sports_id})) `;
      countQuery =
        countQuery +
        `and c.company_id in (select cs.company_id from company_sport cs where cs.sports_refid in (${sports_id})) `;
    }

    if (parent_category_id) {
      query = query + ` and c.main_category_type=${parent_category_id}`;
      countQuery =
        countQuery + ` and c.main_category_type=${parent_category_id}`;
    }
    if (parent_category_id && sub_category_type) {
      let sub_category_id = [];
      for await (let type of sub_category_type) {
        let category_type = type;
        let categoryId = await categoryDao.getCategoryIdByType(
          category_type,
          parent_category_id
        );
        sub_category_id.push(categoryId?.category_id);
      }
      query =
        query +
        ` and c.main_category_type=${parent_category_id} 
      and  c.company_type && array [(select array_agg(c2.category_id) from category c2 where c2.category_id in (select category_id from category c5 where c5.category_id in (${sub_category_id}) and c5.parent_category_id=(${parent_category_id})))] `;

      countQuery =
        countQuery +
        `and c.main_category_type=${parent_category_id} 
      and  c.company_type && array [(select array_agg(c2.category_id) from category c2 where c2.category_id in (select category_id from category c5 where c5.category_id in (${sub_category_id}) and c5.parent_category_id=(${parent_category_id})))]`;
    }

    if (parent_category_id === null && sub_category_type) {
      let sub_category_id = [];
      let parentCompanyId = [];
      let subCatIdByType = [];
      for await (let type of sub_category_type) {
        let category_type = type;
        let parentCat = await categoryDao.getParentCategoryIdByType(
          category_type
        );
        let parentCategoryId = parentCat?.category_id;
        if (parentCategoryId) {
          parentCompanyId.push(parentCat?.category_id);

          let categoryId = await categoryDao.getCategoryIdByType(
            category_type,
            parentCategoryId
          );
          sub_category_id.push(categoryId?.category_id);
        } else {
          let subCatIdArray = await categoryDao.getAllCategoryIdByCatType(
            category_type
          );
          subCatIdByType.push(subCatIdArray.category_id);
        }
      }
      if (parentCompanyId.length > 0) {
        query =
          query +
          ` and (c.main_category_type in (${parentCompanyId}) or
        c.company_type && array [(select array_agg(c2.category_id) from category c2 where c2.category_id in (select category_id from category c5 where c5.category_id in (${sub_category_id}) and c5.parent_category_id in (${parentCompanyId})))])`;

        countQuery =
          countQuery +
          `and (c.main_category_type in (${parentCompanyId}) or
        c.company_type && array [(select array_agg(c2.category_id) from category c2 where c2.category_id in (select category_id from category c5 where c5.category_id in (${sub_category_id}) and c5.parent_category_id in (${parentCompanyId})))])`;
      } else {
        query =
          query +
          ` and c.company_type && array [(select array_agg(c2.category_id) from category c2 where c2.category_id in (select category_id from category c5 where c5.category_id in (${subCatIdByType})))]`;
        countQuery =
          countQuery +
          ` and c.company_type && array [(select array_agg(c2.category_id) from category c2 where c2.category_id in (select category_id from category c5 where c5.category_id in (${subCatIdByType})))]`;
      }
    }

    // if (sub_category_type) {
    //   query =
    //     query +
    //     ` and  c.company_type && array [(select array_agg(c2.category_id) from category c2 where c2.category_type='${sub_category_type}')]`;

    //   countQuery =
    //     countQuery +
    //     `and  c.company_type && array [(select array_agg(c2.category_id) from category c2 where c2.category_type='${sub_category_type}')]`;
    // }

    if (city) {
      // if (category_type !== null) {
      //   query = query + `and c.main_category_type in (select c2.category_id from category c2 where c2.category_type = '${category_type}') `;
      //   countQuery = countQuery + `and c.main_category_type in (select c2.category_id from category c2 where c2.category_type = '${category_type}') `
      // }
      /*  if (parent_category_ids !== null && category_ids !== null) {
      query =
        query +
        `and  c.company_type && array [(select array_agg(c2.category_id) from category c2 where c2.category_id in (${category_ids}))]  `;
      countQuery =
        countQuery +
        `and c.company_type && array [(select array_agg(c2.category_id) from category c2 where c2.category_id in (${category_ids}))]  `;
    } else if (parent_category_ids !== null) {
      query =
        query +
        `and c.company_type && array [(select array_agg(c2.category_id) from category c2 where parent_category_id in (${parent_category_ids}))] `;
      countQuery =
        countQuery +
        `and c.company_type && array [(select array_agg(c2.category_id) from category c2 where parent_category_id in (${parent_category_ids}))] `;
    } */

      query = query + ` and c.address ->>'city' ilike '${city}%'`;

      countQuery = countQuery + ` and c.address ->>'city' ilike '${city}%'`;
    }

    let offset = page > 0 ? page * size : 0;

    query =
      query +
      `group by
          c.company_id,
          v.category_arr,
          c2.category_name,
          c2.category_type ,
          comp.company_id ,
          c4.company_id 
        order by
          c.updated_date ${sort} limit ${size} offset ${offset}`;

    if (user_id) {
      query = `select
          c.*,
          (select count(*) from follower where following_companyid = c.company_id and is_delete = '0') as follower_count,
          (select count(*) from media where media_creator_company_id = c.company_id and media_type='I') as image_count,
          (select count(*) from media where media_creator_company_id = c.company_id and media_type='V') as video_count,
          t.following_count,
          cu.user_id,
        ct.*,
          c2.category_id as parent_category_id,
          c2.category_name as parent_category_name,
          case
          when c.parent_company_id is null then jsonb_build_object('company_type', 'Parent Page', 'parent_page_id', c.company_id)
        when comp.company_id is not null
        and c4.company_id is null then jsonb_build_object('company_type', 'Child Page', 'parent_page_id', c.parent_company_id)
        when comp.company_id is not null
        and c4.company_id is not null then jsonb_build_object('company_type', 'SubTeam Page', 'parent_page_id', c4.company_id)
      end as company_type_name
      from
          company c
      left join (
      select
        c.company_id ,
        COUNT(f2.follower_companyid) as following_count
      from
        company c
      left join follower f2 on
        f2.follower_companyid = c.company_id
        and f2.is_delete = false
      group by
        c.company_id ) t on
          t.company_id = c.company_id
      join company_users cu on
          cu.company_id = c.company_id
          and cu.user_type ='p' 
      left join (
      select
        t.company_id as page_id,
        ARRAY_AGG(c3.category_name) category_name_arr
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
        t.company_id
            ) ct on
          ct.page_id = c.company_id
      left join category c2 
          on
      c2.category_id = c.main_category_type
      left join company comp on
        comp.company_id = c.parent_company_id
      left join company c4 on
        c4.company_id = comp.parent_company_id
      where
        cu.user_id ='${user_id}' `;

      countQuery = `select
          count(1)
      from
          company c
      left join (
      select
        c.company_id ,
        COUNT(f2.follower_companyid) as following_count
      from
        company c
      left join follower f2 on
        f2.follower_companyid = c.company_id
        and f2.is_delete = false
      group by
        c.company_id ) t on
          t.company_id = c.company_id
      join company_users cu on
          cu.company_id = c.company_id
          and cu.user_type ='p' 
      left join (
      select
        t.company_id as page_id,
        ARRAY_AGG(c3.category_name) category_name_arr
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
        t.company_id
            ) ct on
          ct.page_id = c.company_id
      left join category c2 
          on
      c2.category_id = c.main_category_type
      left join company comp on
        comp.company_id = c.parent_company_id
      left join company c4 on
        c4.company_id = comp.parent_company_id
      where
        cu.user_id ='${user_id}'`;

      if (company_name !== null) {
        query = query + `and c.company_name ilike '%${company_name}%' `;
        countQuery =
          countQuery + `and c.company_name ilike '%${company_name}%' `;
      }
      if (sports_id !== null && sports_id.length > 0) {
        query =
          query +
          `and c.company_id in (select cs.company_id from company_sport cs where cs.sports_refid in (${sports_id})) `;
        countQuery =
          countQuery +
          `and c.company_id in (select cs.company_id from company_sport cs where cs.sports_refid in (${sports_id})) `;
      }

      /*  if (parent_category_ids !== null && category_ids !== null) {
        query =
          query +
          `and  c.company_type && array [(select array_agg(c2.category_id) from category c2 where c2.category_id in (${category_ids}))]  `;
        countQuery =
          countQuery +
          `and c.company_type && array [(select array_agg(c2.category_id) from category c2 where c2.category_id in (${category_ids}))]  `;
      } else if (parent_category_ids !== null) {
        query =
          query +
          `and c.company_type && array [(select array_agg(c2.category_id) from category c2 where parent_category_id in (${parent_category_ids}))] `;
        countQuery =
          countQuery +
          `and c.company_type && array [(select array_agg(c2.category_id) from category c2 where parent_category_id in (${parent_category_ids}))] `;
      } */

      if (parent_category_id) {
        query = query + ` and c.main_category_type=${parent_category_id}`;
        countQuery =
          countQuery + ` and c.main_category_type=${parent_category_id}`;
      }
      if (parent_category_id && sub_category_type) {
        let sub_category_id = [];
        for await (let type of sub_category_type) {
          let category_type = type;
          let categoryId = await categoryDao.getCategoryIdByType(
            category_type,
            parent_category_id
          );
          sub_category_id.push(categoryId?.category_id);
        }
        query =
          query +
          ` and c.main_category_type=${parent_category_id} 
        and  c.company_type && array [(select array_agg(c2.category_id) from category c2 where c2.category_id in (select category_id from category c5 where c5.category_id in (${sub_category_id}) and c5.parent_category_id=(${parent_category_id})))] `;

        countQuery =
          countQuery +
          `and c.main_category_type=${parent_category_id} 
        and  c.company_type && array [(select array_agg(c2.category_id) from category c2 where c2.category_id in (select category_id from category c5 where c5.category_id in (${sub_category_id}) and c5.parent_category_id=(${parent_category_id})))]`;
      }

      if (parent_category_id === null && sub_category_type) {
        let sub_category_id = [];
        let parentCompanyId = [];
        let subCatIdByType = [];
        for await (let type of sub_category_type) {
          let category_type = type;
          let parentCat = await categoryDao.getParentCategoryIdByType(
            category_type
          );
          let parentCategoryId = parentCat?.category_id;
          if (parentCategoryId) {
            parentCompanyId.push(parentCat?.category_id);

            let categoryId = await categoryDao.getCategoryIdByType(
              category_type,
              parentCategoryId
            );
            sub_category_id.push(categoryId?.category_id);
          } else {
            let subCatIdArray = await categoryDao.getAllCategoryIdByCatType(
              category_type
            );
            subCatIdByType.push(subCatIdArray.category_id);
          }
        }
        if (parentCompanyId.length > 0) {
          query =
            query +
            ` and (c.main_category_type in (${parentCompanyId}) or
          c.company_type && array [(select array_agg(c2.category_id) from category c2 where c2.category_id in (select category_id from category c5 where c5.category_id in (${sub_category_id}) and c5.parent_category_id in (${parentCompanyId})))])`;

          countQuery =
            countQuery +
            `and (c.main_category_type in (${parentCompanyId}) or
          c.company_type && array [(select array_agg(c2.category_id) from category c2 where c2.category_id in (select category_id from category c5 where c5.category_id in (${sub_category_id}) and c5.parent_category_id in (${parentCompanyId})))])`;
        } else {
          query =
            query +
            ` and c.company_type && array [(select array_agg(c2.category_id) from category c2 where c2.category_id in (select category_id from category c5 where c5.category_id in (${subCatIdByType})))]`;
          countQuery =
            countQuery +
            ` and c.company_type && array [(select array_agg(c2.category_id) from category c2 where c2.category_id in (select category_id from category c5 where c5.category_id in (${subCatIdByType})))]`;
        }
      }

      if (city) {
        query = query + ` and c.address ->>'city' ilike '${city}%'`;

        countQuery = countQuery + ` and c.address ->>'city' ilike '${city}%'`;
      }

      query =
        query +
        ` order by c.updated_date ${sort} limit ${size} offset ${offset}`;
    }

    let data = await commonDao.customQueryExecutor(query);
    const count = await commonDao.customQueryExecutor(countQuery);

    let length = Number(count[0].count);
    let totalPages = length < size ? 1 : Math.ceil(length / size);

    let tempData = {
      totalCount: length,
      totalPage: totalPages,
      size: size,
      content: data,
    };
    result = tempData;
  } catch (error) {
    console.log("Error occurred in search Company ", error);
    throw error;
  }
  return result;
};

const dateFormat = (type, start_date, end_date) => {
  let query = null;
  switch (type) {
    case "year":
      query = ` c.created_date >= NOW() - interval '1 year' `;
      break;
    case "month":
      query = ` c.created_date >= NOW() - interval '1 month' `;
      break;
    case "week":
      query = ` c.created_date >= NOW() - interval '1 week' `;
      break;
    case "today":
      query = ` c.created_date >= NOW() - interval '1 day' `;
      break;
    case "yesterday":
      query = ` c.created_date >= NOW() - interval '2 day' `;
    case "custom":
      query = ` c.created_date between '${start_date}' and '${end_date}' `;
      break;
    default:
      break;
  }
  return query;
};

/**
 * Method to search company by is feature
 */
const searchByIsFeature = async (body) => {
  try {
    let result = null;
    const { page = 0, sort = "desc", size = 5, is_feature = true } = body;

    let query = `select * from company c where c.is_featured = ${is_feature} `;
    let countQuery = `select count(*) from company c where c.is_featured =  ${is_feature} `;
    let offset = page > 0 ? page * size : 0;

    query =
      query + `order by c.updated_date ${sort} limit ${size} offset ${offset}`;

    let data = await commonDao.customQueryExecutor(query);
    let count = await commonDao.customQueryExecutor(countQuery);

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
    console.log("Error occurred in searchByIsFeature", error);
    throw error;
  }
};

/**
 * Method to search company by user id
 */
const searchByUserId = async (body) => {
  try {
    const { page = 0, sort = "desc", size = 5, user_id } = body;

    if (user_id) {
      let query = `select
      *
    from
      (
      select
        c.*,
        0 as sortorder,
        jsonb_build_object('id', u.user_id , 'name', concat(u.first_name, ' ', u.last_name), 'avatar', u.user_profile_img, 'type', 'U') as userdetails,
        c2.category_name as main_category_name,
        v.category_arr as company_type_name
      from
        company c
      left join company_users cu on
        cu.company_id = c.company_id
        and cu.user_type ='p' 
      left join users u on
        u.user_id = cu.user_id
      left join category c2 
        on
        c2.category_id = c.main_category_type
      left join (
        select
          t.company_id as page_id,
          ARRAY_AGG(jsonb_build_object('category_id',c3.category_id,'category_name',c3.category_name)) as category_arr
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
          t.company_id )v
        on
        v.page_id = c.company_id
      where
        cu.user_id = '${user_id}'
    union all
      select
        c.*,
        1 as sortorder,
        jsonb_build_object('id', u2.user_id , 'name', concat(u2.first_name, ' ', u2.last_name), 'avatar', u2.user_profile_img, 'type', 'U') as userdetails,
        c3.category_name as main_category_name,
        v.category_arr as company_type_name
      from
        company c
      left join company_users cu2 on
        cu2.company_id = c.company_id
        and cu2.user_type ='p' 
      left join users u2 on
        u2.user_id = cu2.user_id
      left join category c3 
        on
        c3.category_id = c.main_category_type
      left join (
        select
          t.company_id as page_id,
          ARRAY_AGG(jsonb_build_object('category_id',c3.category_id,'category_name',c3.category_name)) as category_arr
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
          t.company_id )v
        on
        v.page_id = c.company_id
      where
        c.company_id not in (
        select
          c.company_id
        from
          company c
        left join company_users cu on
          cu.company_id = c.company_id
          and cu.user_type ='p' 
        left join users u on
          u.user_id = cu.user_id
        where
          cu.user_id = '${user_id}'))a`;

      let countQuery = `select count(*) from (select
        c.*,0 as sortorder,jsonb_build_object('id',u.user_id ,'name',concat(u.first_name,' ',u.last_name),'avatar',u.user_profile_img,'type','U') as userdetails
      from
        company c
      left join company_users cu on
        cu.company_id = c.company_id
        and cu.user_type ='p' 
      left join users u on
        u.user_id = cu.user_id
      where
        cu.user_id = '${user_id}'	
      union all
        select
       c.*,1 as sortorder,jsonb_build_object('id',u2.user_id ,'name',concat(u2.first_name,' ',u2.last_name),'avatar',u2.user_profile_img,'type','U') as userdetails
      from
        company c
        left join company_users cu2 on
        cu2.company_id =c.company_id
        and cu2.user_type ='p' 
        left join users u2 on
        u2.user_id =cu2.user_id 
      where
        c.company_id not in (
        select
          c.company_id
        from
          company c
        left join company_users cu on
          cu.company_id = c.company_id
          and cu.user_type ='p' 
        left join users u on
          u.user_id = cu.user_id
        where
          cu.user_id = '${user_id}'))a`;

      let offset = page > 0 ? page * size : 0;

      query =
        query +
        ` order by sortorder asc,updated_date ${sort} limit ${size} offset ${offset}`;

      let data = await commonDao.customQueryExecutor(query);
      let count = await commonDao.customQueryExecutor(countQuery);

      let length = Number(count[0].count);
      let totalPages = length < size ? 1 : Math.ceil(length / size);
      let tempData = {
        totalCount: length,
        totalPage: totalPages,
        size: size,
        content: data,
      };
      return (result = tempData);
    } else {
      return (result = { message: "user_id is required" });
    }
  } catch (error) {
    console.log("Error occurred in searchByIsFeature", error);
    throw error;
  }
};

/**
 * Method to get get Parent Team Pages By UserId
 * @param {string} body
 */
const getParentTeamPagesByUserId = async (body, connectionObj = null) => {
  try {
    const { user_id, category_type_id = null } = body;

    let query = null;

    if (category_type_id) {
      query = `select
      c.* as pages
    from
      company_users cu
    left join company c on
      cu.company_id = c.company_id
    left join company_team_players ctp on
      ctp.company_id = c.company_id
    left join users u on
      u.user_id = ctp.user_id
    where
      c.company_type && (
      select
        array_agg(c2.category_id)
      from
        category c2
      where
        c2.category_type = 'TEA'
        and c2.parent_category_id in (
        select
          c.category_id
        from
          category c
        where
          c.category_type =(
          select
            c.category_type
          from
            category c
          where
            c.category_id = ${category_type_id})
          and c.parent_category_id =(
          select
            c5.category_id
          from
            category c5
          where
            c5.category_type = 'CAT')))
      and c.parent_company_id is null
      and cu.user_id = '${user_id}'
      and (cu.user_role = 'ADM'
        or cu.user_role = 'PDM')
      and c.main_category_type =(
      select
        c.category_id
      from
        category c
      where
        c.category_type =(
        select
          c.category_type
        from
          category c
        where
          c.category_id = ${category_type_id})
        and c.parent_category_id =(
        select
          c5.category_id
        from
          category c5
        where
          c5.category_type = 'CAT'))
    group by
        c.company_id`;
    } else {
      query = `select
      c.* as pages
    from
      company_users cu
    left join company c on
      cu.company_id = c.company_id
    left join company_team_players ctp on
      ctp.company_id = c.company_id
    left join users u on
      u.user_id = ctp.user_id
    where
      c.company_type && (
      select
        array_agg(c2.category_id)
      from
        category c2
      where
        c2.category_type = 'TEA')
      and c.parent_company_id is null
      and cu.user_id = '${user_id}'
      and (cu.user_role = 'ADM'
        or cu.user_role = 'PDM')
        and c.company_type !='{}'
    group by
      c.company_id`;
    }

    let data = await commonDao.customQueryExecutor(query);
    return data;
  } catch (error) {
    console.log("Error occurred in getParentTeamPagesByUserId", error);
    throw error;
  }
};

/**
 * Method to get all registered cities
 */
const getAllCities = async () => {
  try {
    let company = {
      data: null,
    };
    let data = await companyDao.getAllCities();
    if (data.length === 0) company = { message: "Cities not available" };
    else company["data"] = data;
    return company;
  } catch (error) {
    console.log("Error occurred in Company Service : getAllCities", error);
    throw error;
  }
};

/**
 * Method for Company Profile Verification
 */
const companyProfileVerification = async (body) => {
  try {
    let company_profile_verified = body.company_profile_verified;
    let company_id = body.company_id;
    let company = {
      data: null,
    };
    let data = await companyDao.companyProfileVerification(
      company_profile_verified,
      company_id
    );
    if (data === null) company = { message: "Company not available " };
    else company["data"] = data;
    return company;
  } catch (error) {
    console.log(
      "Error occurred in Company Service : companyProfileVerification",
      error
    );
    throw error;
  }
};

module.exports = {
  createCompany,
  editCompany,
  fetchCompany,
  deleteCompany,
  fetchAll,
  fetchCompanyByEmail,
  updateByToken,
  fetchCompanyByToken,
  fetchCompanyByType,
  fetchCompanyByEmailBase,
  fetchCompanyTypeDetailsByCompanyId,
  updateCompanyType,
  fetchCompanyByName,
  fetchByParentCompany,
  fetchAllParentCompany,
  searchCompany,
  fetchCompanyTypes,
  fetchCompanyByUser,
  fetchCompanyData,
  fetchCompanyUrlName,
  search,
  searchByIsFeature,
  searchByUserId,
  getByParentCompanyId,
  getParentTeamPagesByUserId,
  getAllCities,
  companyProfileVerification,
};
