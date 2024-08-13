const sponsorDao = require("../dao/sponsor.dao");
const companyDao = require("../dao/company.dao");
const companySponsorTypeDao = require("../dao/companySponsorType.dao");
const companySponsorDao = require("../dao/companySponsor.dao");
const eventsDao = require("../dao/events.dao");
const eventSponsorDao = require("../dao/eventSponsor.dao");
const tournamentDao = require("../dao/tournaments.dao");
let eventSponsorTypeDao = require("../dao/eventSponsorType.dao");
const companyService = require("../services/company.service");
const userDao = require("../dao/user.dao");
const axios = require("axios");
const db = require("../utils/db");
const { cloudinaryUpload, cloudinaryImageDelete } = require("../utils/common");
const { otpGenerator } = require("../utils/util");

/**
 *Method to create sponsor
 * @param {JSON} body
 */
const createSponsorInfo = async (body) => {
  let result = null;
  try {
    const sponsor = body;

    let company = await companyDao.getById(sponsor?.company_id);

    if (company === null) {
      return (result = { message: "Company Not Exist" });
    }

    result = await db
      .tx(async (transaction) => {
        let sponsorInfo = await createSponsor(sponsor, transaction);

        let sort_order = 0;
        let is_deleted = false;
        sort_order = sponsor?.sort_order ? sponsor?.sort_order : sort_order;
        is_deleted = sponsor?.is_deleted ? sponsor?.is_deleted : is_deleted;

        let companySponsorTypeExisting =
          await companySponsorTypeDao.getByCompanySponsorTypeNamewithId(
            sponsor?.company_sponsor_type_name,
            sponsor?.company_id,
            transaction
          );

        let companySponsorTypeCount =
          await companySponsorTypeDao.getAllCompanySponsorTypeCountByCompanyId(
            sponsor?.company_id,
            transaction
          );

        if (companySponsorTypeExisting === null) {
          let sponsorTypeName =
            sponsor?.company_sponsor_type_name.toLowerCase();

          let titleExisting = sponsorTypeName.includes("title");

          /* if (titleExisting === true) {
             let companySponsorTypeByCompanyIdExisting =
               await companySponsorTypeDao.getAllCompanySponsorTypeByCompanyId(
                 sponsor?.company_id,
                 transaction
               );
 
             if (companySponsorTypeByCompanyIdExisting?.length > 0) {
               for await (let sponsorType of companySponsorTypeByCompanyIdExisting) {
                 let companySponsorType = await companySponsorTypeDao.edit(
                   sponsorType?.company_sponsor_type_name,
                   sponsorType?.company_id,
                   sponsorType?.sort_order + 1,
                   sponsorType?.is_deleted,
                   sponsorType?.company_sponsor_type_id,
                   transaction
                 );
               }
             }
 
             let companySponsorType = await companySponsorTypeDao.add(
               sponsor?.company_sponsor_type_name,
               sponsor?.company_id,
               0,
               is_deleted,
               transaction
             );
             sponsorInfo["company_sponsor_type"] = companySponsorType;
 
             let is_featured = false;
             is_featured = sponsor?.is_featured
               ? sponsor?.is_featured
               : is_featured;
             let seq_number = 0;
             seq_number = sponsor?.seq_number ? sponsor?.seq_number : seq_number;
 
             let companySponsor = await companySponsorDao.add(
               sponsorInfo?.sponsor_id,
               sponsor?.company_id,
               companySponsorType?.company_sponsor_type_id,
               is_featured,
               (seq_number = 0),
               transaction
             );
 
             sponsorInfo["company_sponsor"] = companySponsor;
           }
           
           else { */
          let companySponsorType = await companySponsorTypeDao.add(
            sponsor?.company_sponsor_type_name,
            sponsor?.company_id,
            companySponsorTypeCount?.count,
            is_deleted,
            transaction
          );

          sponsorInfo["company_sponsor_type"] = companySponsorType;

          let is_featured = false;
          is_featured = sponsor?.is_featured
            ? sponsor?.is_featured
            : is_featured;
          let seq_number = 0;
          seq_number = sponsor?.seq_number ? sponsor?.seq_number : seq_number;

          let companySponsor = await companySponsorDao.add(
            sponsorInfo?.sponsor_id,
            sponsor?.company_id,
            companySponsorType?.company_sponsor_type_id,
            is_featured,
            (seq_number = 0),
            transaction
          );

          sponsorInfo["company_sponsor"] = companySponsor;
          // }

          // let companySponsorType = await companySponsorTypeDao.add(
          //   sponsor?.company_sponsor_type_name,
          //   sponsor?.company_id,
          //   companySponsorTypeCount?.count,
          //   is_deleted,
          //   transaction
          // );

          // sponsorInfo["company_sponsor_type"] = companySponsorType;
        } else {
          let is_featured = false;
          let seq_number = 0;
          is_featured = sponsor?.is_featured
            ? sponsor?.is_featured
            : is_featured;
          seq_number = sponsor?.seq_number ? sponsor?.seq_number : seq_number;

          let companySponsorCount =
            await companySponsorDao.getCompanySponsorCount(
              sponsor?.company_id,
              companySponsorTypeExisting?.company_sponsor_type_id
            );

          let companySponsor = await companySponsorDao.add(
            sponsorInfo?.sponsor_id,
            sponsor?.company_id,
            companySponsorTypeExisting?.company_sponsor_type_id,
            is_featured,
            companySponsorCount?.count,
            transaction
          );
          sponsorInfo["company_sponsor"] = companySponsor;

          if (companySponsorTypeExisting?.is_deleted === true) {
            let sponsorTypeName =
              sponsor?.company_sponsor_type_name.toLowerCase();

            let titleExisting = sponsorTypeName.includes("title");

            /* if (titleExisting === true) {
               let companySponsorTypeByCompanyIdExisting =
                 await companySponsorTypeDao.getAllCompanySponsorTypeByCompanyId(
                   sponsor?.company_id,
                   transaction
                 );
 
               if (companySponsorTypeByCompanyIdExisting?.length > 0) {
                 for await (let sponsorType of companySponsorTypeByCompanyIdExisting) {
                   let companySponsorType = await companySponsorTypeDao.edit(
                     sponsorType?.company_sponsor_type_name,
                     sponsorType?.company_id,
                     sponsorType?.sort_order + 1,
                     sponsorType?.is_deleted,
                     sponsorType?.company_sponsor_type_id,
                     transaction
                   );
                 }
               }
 
               let companySponsorType = await companySponsorTypeDao.edit(
                 sponsor?.company_sponsor_type_name,
                 sponsor?.company_id,
                 0,
                 (is_deleted = false),
                 companySponsorTypeExisting?.company_sponsor_type_id,
                 transaction
               );
               sponsorInfo["company_sponsor_type"] = companySponsorType;
             } 
             else {*/
            let companySponsorType = await companySponsorTypeDao.edit(
              sponsor?.company_sponsor_type_name,
              sponsor?.company_id,
              companySponsorTypeCount?.count,
              (is_deleted = false),
              companySponsorTypeExisting?.company_sponsor_type_id,
              transaction
            );
            sponsorInfo["company_sponsor_type"] = companySponsorType;
            // }

            // let companySponsorType = await companySponsorTypeDao.edit(
            //   sponsor?.company_sponsor_type_name,
            //   sponsor?.company_id,
            //   companySponsorTypeCount?.count,
            //   (is_deleted = false),
            //   companySponsorTypeExisting?.company_sponsor_type_id,
            //   transaction
            // );
            // sponsorInfo["company_sponsor_type"] = companySponsorType;
          } else {
            let sponsorTypeName =
              sponsor?.company_sponsor_type_name.toLowerCase();

            // let titleExisting = sponsorTypeName.includes("title");

            /*  if (titleExisting === true) {
                let companySponsorType = await companySponsorTypeDao.edit(
                  sponsor?.company_sponsor_type_name,
                  sponsor?.company_id,
                  0,
                  (is_deleted = false),
                  companySponsorTypeExisting?.company_sponsor_type_id,
                  transaction
                );
                sponsorInfo["company_sponsor_type"] = companySponsorType;
              } else {*/
            let companySponsorType = await companySponsorTypeDao.edit(
              sponsor?.company_sponsor_type_name,
              sponsor?.company_id,
              companySponsorTypeExisting?.sort_order,
              (is_deleted = false),
              companySponsorTypeExisting?.company_sponsor_type_id,
              transaction
            );
            sponsorInfo["company_sponsor_type"] = companySponsorType;
            // }

            // let companySponsorType = await companySponsorTypeDao.edit(
            //   sponsor?.company_sponsor_type_name,
            //   sponsor?.company_id,
            //   companySponsorTypeExisting?.sort_order,
            //   (is_deleted = false),
            //   companySponsorTypeExisting?.company_sponsor_type_id,
            //   transaction
            // );
            // sponsorInfo["company_sponsor_type"] = companySponsorType;
          }
        }

        result = sponsorInfo;
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
    console.log("Error occurred in create Sponsor Info", error);
    throw error;
  }
};

/**
 *Method to create sponsor for event
 * @param {JSON} body
 */
const createSponsorInfoForEvent = async (body) => {
  let result = null;
  try {
    const sponsor = body;

    let event = await eventsDao.getById(sponsor?.event_id);
    if (sponsor?.tournament_id) {
      let tournament = await tournamentDao.getById(sponsor?.tournament_id);
      if (tournament === null) {
        return (result = { message: "Tournament Not Exist" });
      }
    }

    if (event === null) {
      return (result = { message: "Event Not Exist" });
    }

    result = await db
      .tx(async (transaction) => {
        let createdSponsorPage;
        if (!sponsor?.sponsor_page_id) {
          let pageDetails = {
            company_name: sponsor.sponsor_name,
            main_category_type: sponsor.main_category_type,
            company_type: sponsor.company_type
              ? JSON.parse(sponsor.company_type)
              : null,
            company_desc: sponsor.sponsor_desc,
            category_id: sponsor.category_id,
            sports_interest: sponsor.sports_interest
              ? JSON.parse(sponsor.sports_interest)
              : null,
            company_category: sponsor.company_category
              ? JSON.parse(sponsor.company_category)
              : null,
            user_id: sponsor.user_id,
          };
          createdSponsorPage = await companyService.createCompany(pageDetails);
        }
        let sponsorPagedata = {
          ...sponsor,
          company_id:
            createdSponsorPage?.company_id || sponsor?.sponsor_page_id,
        };
        let sponsorInfo = await createSponsor(sponsorPagedata, transaction);
        let tournament_id = sponsor?.tournament_id
          ? sponsor?.tournament_id
          : null;

        let sort_order = 0;
        let is_deleted = false;
        sort_order = sponsor?.sort_order ? sponsor?.sort_order : sort_order;
        is_deleted = sponsor?.is_deleted ? sponsor?.is_deleted : is_deleted;

        let eventSponsorTypeExisting =
          await eventSponsorTypeDao.getByEventSponsorTypeNamewithId(
            sponsor?.event_sponsor_type_name,
            sponsor?.event_id,
            transaction
          );

        let eventSponsorTypeCount =
          await eventSponsorTypeDao.getAllEventSponsorTypeCountByEventId(
            sponsor?.event_id,
            transaction
          );

        if (eventSponsorTypeExisting === null) {
          let sponsorTypeName = sponsor?.event_sponsor_type_name.toLowerCase();

          // let titleExisting = sponsorTypeName.includes("title");

          // if (titleExisting === true) {
          //   let eventSponsorTypeByEventIdExisting =
          //     await eventSponsorTypeDao.getAllEventSponsorTypeByEventId(
          //       sponsor?.event_id,
          //       transaction
          //     );

          //   if (eventSponsorTypeByEventIdExisting?.length > 0) {
          //     for await (let sponsorType of eventSponsorTypeByEventIdExisting) {
          //       let eventSponsorType = await eventSponsorTypeDao.edit(
          //         sponsorType?.event_sponsor_type_name,
          //         sponsorType?.event_id,
          //         sponsorType?.sort_order + 1,
          //         sponsorType?.is_deleted,
          //         sponsorType?.event_sponsor_type_id,
          //         transaction
          //       );
          //     }
          //   }

          //   let eventSponsorType = await eventSponsorTypeDao.add(
          //     sponsor?.event_sponsor_type_name,
          //     sponsor?.event_id,
          //     0,
          //     is_deleted,
          //     transaction
          //   );
          //   sponsorInfo["event_sponsor_type"] = eventSponsorType;

          //   let is_featured = false;
          //   is_featured = sponsor?.is_featured
          //     ? sponsor?.is_featured
          //     : is_featured;
          //   let seq_number = 0;
          //   seq_number = sponsor?.seq_number ? sponsor?.seq_number : seq_number;

          //   let eventSponsor = await eventSponsorDao.add(
          //     sponsorInfo?.sponsor_id,
          //     sponsor?.event_id,
          //     tournament_id,
          //     is_featured,
          //     (seq_number = 0),
          //     eventSponsorType?.event_sponsor_type_id,
          //     transaction
          //   );

          //   sponsorInfo["event_sponsor"] = eventSponsor;
          // } else {
          let eventSponsorType = await eventSponsorTypeDao.add(
            sponsor?.event_sponsor_type_name,
            sponsor?.event_id,
            eventSponsorTypeCount?.count,
            is_deleted,
            transaction
          );

          sponsorInfo["event_sponsor_type"] = eventSponsorType;

          let is_featured = false;
          is_featured = sponsor?.is_featured
            ? sponsor?.is_featured
            : is_featured;
          let seq_number = 0;
          seq_number = sponsor?.seq_number ? sponsor?.seq_number : seq_number;

          let eventSponsor = await eventSponsorDao.add(
            sponsorInfo?.sponsor_id,
            sponsor?.event_id,
            tournament_id,
            is_featured,
            (seq_number = 0),
            eventSponsorType?.event_sponsor_type_id,
            transaction
          );

          sponsorInfo["event_sponsor"] = eventSponsor;
          // }

          // let eventSponsorType = await eventSponsorTypeDao.add(
          //   sponsor?.event_sponsor_type_name,
          //   sponsor?.event_id,
          //   eventSponsorTypeCount?.count,
          //   is_deleted,
          //   transaction
          // );

          // sponsorInfo["event_sponsor_type"] = eventSponsorType;

          // let is_featured = false;
          // is_featured = sponsor?.is_featured
          //   ? sponsor?.is_featured
          //   : is_featured;
          // let seq_number = 0;
          // seq_number = sponsor?.seq_number ? sponsor?.seq_number : seq_number;

          // let eventSponsor = await eventSponsorDao.add(
          //   sponsorInfo?.sponsor_id,
          //   sponsor?.event_id,
          //   tournament_id,
          //   is_featured,
          //   (seq_number = 0),
          //   eventSponsorType?.event_sponsor_type_id,
          //   transaction
          // );

          // sponsorInfo["event_sponsor"] = eventSponsor;
        } else {
          let is_featured = false;
          let seq_number = 0;
          is_featured = sponsor?.is_featured
            ? sponsor?.is_featured
            : is_featured;
          seq_number = sponsor?.seq_number ? sponsor?.seq_number : seq_number;

          let eventSponsorCount = await eventSponsorDao.getEventSponsorCount(
            sponsor?.event_id,
            eventSponsorTypeExisting?.event_sponsor_type_id
          );

          let eventSponsor = await eventSponsorDao.add(
            sponsorInfo?.sponsor_id,
            sponsor?.event_id,
            tournament_id,
            is_featured,
            eventSponsorCount?.count,
            eventSponsorTypeExisting?.event_sponsor_type_id,
            transaction
          );
          sponsorInfo["event_sponsor"] = eventSponsor;

          if (eventSponsorTypeExisting?.is_deleted === true) {
            let sponsorTypeName =
              sponsor?.event_sponsor_type_name.toLowerCase();

            // let titleExisting = sponsorTypeName.includes("title");

            /*             if (titleExisting === true) {
              let eventSponsorTypeByEventIdExisting =
                await eventSponsorTypeDao.getAllEventSponsorTypeByEventId(
                  sponsor?.event_id,
                  transaction
                );

              if (eventSponsorTypeByEventIdExisting?.length > 0) {
                for await (let sponsorType of eventSponsorTypeByEventIdExisting) {
                  let eventSponsorType = await eventSponsorTypeDao.edit(
                    sponsorType?.event_sponsor_type_name,
                    sponsorType?.event_id,
                    sponsorType?.sort_order + 1,
                    sponsorType?.is_deleted,
                    sponsorType?.event_sponsor_type_id,
                    transaction
                  );
                }
              }

              let eventSponsorType = await eventSponsorTypeDao.edit(
                sponsor?.event_sponsor_type_name,
                sponsor?.event_id,
                0,
                (is_deleted = false),
                eventSponsorTypeExisting?.event_sponsor_type_id,
                transaction
              );
              sponsorInfo["event_sponsor_type"] = eventSponsorType;
            } else { */
            let eventSponsorType = await eventSponsorTypeDao.edit(
              sponsor?.event_sponsor_type_name,
              sponsor?.event_id,
              eventSponsorTypeCount?.count,
              (is_deleted = false),
              eventSponsorTypeExisting?.event_sponsor_type_id,
              transaction
            );
            sponsorInfo["event_sponsor_type"] = eventSponsorType;
            // }

            // let eventSponsorType = await eventSponsorTypeDao.edit(
            //   sponsor?.event_sponsor_type_name,
            //   sponsor?.event_id,
            //   eventSponsorTypeCount?.count,
            //   (is_deleted = false),
            //   eventSponsorTypeExisting?.event_sponsor_type_id,
            //   transaction
            // );
            // sponsorInfo["event_sponsor_type"] = eventSponsorType;
          } else {
            let sponsorTypeName =
              sponsor?.event_sponsor_type_name.toLowerCase();

            /*             let titleExisting = sponsorTypeName.includes("title");

            if (titleExisting === true) {
              let eventSponsorTypeByEventIdExisting =
                await eventSponsorTypeDao.getAllEventSponsorTypeByEventId(
                  sponsor?.event_id,
                  transaction
                );

              if (eventSponsorTypeByEventIdExisting?.length > 0) {
                for await (let sponsorType of eventSponsorTypeByEventIdExisting) {
                  let eventSponsorType = await eventSponsorTypeDao.edit(
                    sponsorType?.event_sponsor_type_name,
                    sponsorType?.event_id,
                    sponsorType?.sort_order + 1,
                    sponsorType?.is_deleted,
                    sponsorType?.event_sponsor_type_id,
                    transaction
                  );
                }
              }

              let eventSponsorType = await eventSponsorTypeDao.edit(
                sponsor?.event_sponsor_type_name,
                sponsor?.event_id,
                0,
                (is_deleted = false),
                eventSponsorTypeExisting?.event_sponsor_type_id,
                transaction
              );
              sponsorInfo["event_sponsor_type"] = eventSponsorType;
            } else { */
            let eventSponsorType = await eventSponsorTypeDao.edit(
              sponsor?.event_sponsor_type_name,
              sponsor?.event_id,
              eventSponsorTypeExisting?.sort_order,
              (is_deleted = false),
              eventSponsorTypeExisting?.event_sponsor_type_id,
              transaction
            );
            sponsorInfo["event_sponsor_type"] = eventSponsorType;
            // }

            // let eventSponsorType = await eventSponsorTypeDao.edit(
            //   sponsor?.event_sponsor_type_name,
            //   sponsor?.event_id,
            //   eventSponsorTypeExisting?.sort_order,
            //   (is_deleted = false),
            //   eventSponsorTypeExisting?.event_sponsor_type_id,
            //   transaction
            // );
            // sponsorInfo["event_sponsor_type"] = eventSponsorType;
          }
        }

        result = sponsorInfo;
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
    console.log("Error occurred in create Sponsor Info", error);
    throw error;
  }
};

/**
 *Method to create sponsor
 * @param {JSON} body
 */
const createSponsor = async (body, connectionObj = null) => {
  let result = null;
  try {
    const {
      sponsor_name,
      sponsor_desc = null,
      files = {},
      sponsor_media_type = null,
      sponsor_click_url,
      company_id,
      connectionObj,
    } = body;

    let sponsor_media_url = null;

    if (JSON.stringify(files) !== JSON.stringify({})) {
      if (
        files.sponsor_media_url[0] !== null &&
        files.sponsor_media_url[0] !== undefined
      ) {
        imagemetaData = await cloudinaryUpload(files.sponsor_media_url[0]);
      }
      let sponsor_media_url_meta = imagemetaData;

      let sponsor_media_type =
        imagemetaData?.resource_type === "image" ? "I" : "V";
      let sponsor_media_url = imagemetaData?.url;

      result = await sponsorDao.add(
        sponsor_name,
        sponsor_desc,
        sponsor_media_url,
        sponsor_media_type,
        sponsor_click_url,
        sponsor_media_url_meta,
        company_id,
        connectionObj
      );
    }
    return result;
  } catch (error) {
    console.log("Error occurred in create Sponsor", error);
    throw error;
  }
};

/**
 *Method to edit sponsor
 * @param {JSON} body
 */
const editSponsorInfo = async (body) => {
  let result = null;
  try {
    const sponsor = body;

    let company = await companyDao.getById(sponsor?.company_id);
    let sponsorExisting = await sponsorDao.getById(sponsor?.sponsor_id);
    if (sponsor?.tournament_id) {
      let tournament = await tournamentDao.getById(sponsor?.tournament_id);
      if (tournament === null) {
        return (result = { message: "Tournament Not Exist" });
      }
    }

    if (company === null) {
      return (result = { message: "Company Not Exist" });
    }

    if (sponsorExisting === null) {
      return (result = { message: "Sponsor Not Exist" });
    }

    result = await db
      .tx(async (transaction) => {
        let sponsorInfo = await updateSponsor(sponsor, transaction);

        let sort_order = 0;
        let is_deleted = false;
        sort_order = sponsor?.sort_order ? sponsor?.sort_order : sort_order;
        is_deleted = sponsor?.is_deleted ? sponsor?.is_deleted : is_deleted;

        let company_sponsor_type_name = sponsor?.company_sponsor_type_name;
        let company_sponsor_type_id = sponsor?.company_sponsor_type_id;
        let company_id = sponsor?.company_id;

        let companySponsorTypeNameExisting =
          await companySponsorTypeDao.getByCompanySponsorTypeNamewithId(
            company_sponsor_type_name,
            company_id,
            transaction
          );

        let companySponsorTypeCount =
          await companySponsorTypeDao.getAllCompanySponsorTypeCountByCompanyId(
            sponsor?.company_id,
            transaction
          );

        let companySponsorDetail =
          await companySponsorDao.getCompanySponsorBySponsorId(
            sponsor?.company_id,
            sponsorInfo?.sponsor_id,
            transaction
          );
        if (companySponsorTypeNameExisting !== null) {
          let is_featured = false;
          let seq_number = 0;
          is_featured = sponsor?.is_featured
            ? sponsor?.is_featured
            : is_featured;
          seq_number = sponsor?.seq_number ? sponsor?.seq_number : seq_number;

          if (companySponsorTypeNameExisting?.is_deleted === true) {
            let sponsorTypeName =
              sponsor?.company_sponsor_type_name.toLowerCase();

            /*    let titleExisting = sponsorTypeName.includes("title");

            if (titleExisting === true) {
              let companySponsorTypeByCompanyIdExisting =
                await companySponsorTypeDao.getAllCompanySponsorTypeByCompanyId(
                  sponsor?.company_id,
                  transaction
                );

              if (companySponsorTypeByCompanyIdExisting?.length > 0) {
                for await (let sponsorType of companySponsorTypeByCompanyIdExisting) {
                  let companySponsorType = await companySponsorTypeDao.edit(
                    sponsorType?.company_sponsor_type_name,
                    sponsorType?.company_id,
                    sponsorType?.sort_order + 1,
                    sponsorType?.is_deleted,
                    sponsorType?.company_sponsor_type_id,
                    transaction
                  );
                }
              }

              let companySponsorType = await companySponsorTypeDao.edit(
                sponsor?.company_sponsor_type_name,
                sponsor?.company_id,
                0,
                (is_deleted = false),
                companySponsorTypeNameExisting?.company_sponsor_type_id,
                transaction
              );
              sponsorInfo["company_sponsor_type"] = companySponsorType;
            } else { */
            let companySponsorType = await companySponsorTypeDao.edit(
              sponsor?.company_sponsor_type_name,
              sponsor?.company_id,
              companySponsorTypeCount?.count,
              (is_deleted = false),
              companySponsorTypeNameExisting?.company_sponsor_type_id,
              transaction
            );

            sponsorInfo["company_sponsor_type"] = companySponsorType;
            // }
          } else {
            let sponsorTypeName =
              sponsor?.company_sponsor_type_name.toLowerCase();

            /*             let titleExisting = sponsorTypeName.includes("title");

            if (titleExisting === true) {
              let companySponsorTypeByCompanyIdExisting =
                await companySponsorTypeDao.getAllCompanySponsorTypeByCompanyId(
                  sponsor?.company_id,
                  transaction
                );

              if (companySponsorTypeByCompanyIdExisting?.length > 0) {
                for await (let sponsorType of companySponsorTypeByCompanyIdExisting) {
                  let companySponsorType = await companySponsorTypeDao.edit(
                    sponsorType?.company_sponsor_type_name,
                    sponsorType?.company_id,
                    sponsorType?.sort_order + 1,
                    sponsorType?.is_deleted,
                    sponsorType?.company_sponsor_type_id,
                    transaction
                  );
                }
              }

              let companySponsorType = await companySponsorTypeDao.edit(
                sponsor?.company_sponsor_type_name,
                sponsor?.company_id,
                0,
                (is_deleted = false),
                companySponsorTypeNameExisting?.company_sponsor_type_id,
                transaction
              );
              sponsorInfo["company_sponsor_type"] = companySponsorType;
            } else { */
            let companySponsorType = await companySponsorTypeDao.edit(
              sponsor?.company_sponsor_type_name,
              sponsor?.company_id,
              companySponsorTypeNameExisting?.sort_order,
              (is_deleted = false),
              companySponsorTypeNameExisting?.company_sponsor_type_id,
              transaction
            );
            sponsorInfo["company_sponsor_type"] = companySponsorType;
            // }
          }

          let companySponsor = await companySponsorDao.updateBySponsorId(
            sponsorInfo?.sponsor_id,
            sponsor?.company_id,
            companySponsorTypeNameExisting?.company_sponsor_type_id,
            is_featured,
            companySponsorDetail?.seq_number,
            transaction
          );
          sponsorInfo["company_sponsor"] = companySponsor;
        } else {
          let sponsorTypeName =
            sponsor?.company_sponsor_type_name.toLowerCase();

          /*           let titleExisting = sponsorTypeName.includes("title");

          if (titleExisting === true) {
            let companySponsorTypeByCompanyIdExisting =
              await companySponsorTypeDao.getAllCompanySponsorTypeByCompanyId(
                sponsor?.company_id,
                transaction
              );

            if (companySponsorTypeByCompanyIdExisting?.length > 0) {
              for await (let sponsorType of companySponsorTypeByCompanyIdExisting) {
                let companySponsorType = await companySponsorTypeDao.edit(
                  sponsorType?.company_sponsor_type_name,
                  sponsorType?.company_id,
                  sponsorType?.sort_order + 1,
                  sponsorType?.is_deleted,
                  sponsorType?.company_sponsor_type_id,
                  transaction
                );
              }
            }

            let companySponsorType = await companySponsorTypeDao.add(
              sponsor?.company_sponsor_type_name,
              sponsor?.company_id,
              0,
              is_deleted,
              transaction
            );
            sponsorInfo["company_sponsor_type"] = companySponsorType;

            let is_featured = false;
            let seq_number = 0;
            is_featured = sponsor?.is_featured
              ? sponsor?.is_featured
              : is_featured;
            seq_number = sponsor?.seq_number ? sponsor?.seq_number : seq_number;

            let companySponsor = await companySponsorDao.updateBySponsorId(
              sponsorInfo?.sponsor_id,
              sponsor?.company_id,
              companySponsorType?.company_sponsor_type_id,
              is_featured,
              companySponsorDetail?.seq_number,
              transaction
            );

            sponsorInfo["company_sponsor"] = companySponsor;
          } else { */
          let companySponsorType = await companySponsorTypeDao.add(
            sponsor?.company_sponsor_type_name,
            sponsor?.company_id,
            companySponsorTypeCount?.count,
            is_deleted,
            transaction
          );

          sponsorInfo["company_sponsor_type"] = companySponsorType;
          // }

          // let is_featured = false;
          // let seq_number = 0;
          // is_featured = sponsor?.is_featured
          //   ? sponsor?.is_featured
          //   : is_featured;
          // seq_number = sponsor?.seq_number ? sponsor?.seq_number : seq_number;

          // let companySponsor = await companySponsorDao.updateBySponsorId(
          //   sponsorInfo?.sponsor_id,
          //   sponsor?.company_id,
          //   companySponsorType?.company_sponsor_type_id,
          //   is_featured,
          //   companySponsorDetail?.seq_number,
          //   transaction
          // );

          // sponsorInfo["company_sponsor"] = companySponsor;
        }

        let companySponsorDataWithTypeId =
          await companySponsorDao.getBySponsorTypeId(
            company_sponsor_type_id,
            transaction
          );

        if (companySponsorDataWithTypeId?.length === 0) {
          let companySponsorTypeUpdate = companySponsorTypeDao.deleteById(
            company_sponsor_type_id,
            transaction
          );
        }

        result = sponsorInfo;
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
    console.log("Error occurred in update Sponsor Info", error);
    throw error;
  }
};

/**
 *Method to edit sponsor
 * @param {JSON} body
 */
const editSponsorInfoForEvent = async (body) => {
  let result = null;
  try {
    const sponsor = body;

    let event = await eventsDao.getById(sponsor?.event_id);
    let sponsorExisting = await sponsorDao.getById(sponsor?.sponsor_id);
    if (sponsor?.tournament_id) {
      let tournament = await tournamentDao.getById(sponsor?.tournament_id);
      if (tournament === null) {
        return (result = { message: "Tournament Not Exist" });
      }
    }
    if (event === null) {
      return (result = { message: "Event Not Exist" });
    }

    if (sponsorExisting === null) {
      return (result = { message: "Sponsor Not Exist" });
    }

    result = await db
      .tx(async (transaction) => {
        let sponsorInfo = await updateSponsor(sponsor, transaction);
        let tournament_id = sponsor?.tournament_id
          ? sponsor?.tournament_id
          : null;

        let sort_order = 0;
        let is_deleted = false;
        sort_order = sponsor?.sort_order ? sponsor?.sort_order : sort_order;
        is_deleted = sponsor?.is_deleted ? sponsor?.is_deleted : is_deleted;

        let event_sponsor_type_name = sponsor?.event_sponsor_type_name;
        let event_sponsor_type_id = sponsor?.event_sponsor_type_id;
        let event_id = sponsor?.event_id;

        let eventSponsorTypeNameExisting =
          await eventSponsorTypeDao.getByEventSponsorTypeNamewithId(
            event_sponsor_type_name,
            event_id,
            transaction
          );

        let eventSponsorTypeCount =
          await eventSponsorTypeDao.getAllEventSponsorTypeCountByEventId(
            sponsor?.event_id,
            transaction
          );

        let eventSponsorDetail =
          await eventSponsorDao.getEventSponsorBySponsorId(
            sponsor?.event_id,
            sponsorInfo?.sponsor_id,
            transaction
          );
        if (eventSponsorTypeNameExisting !== null) {
          let is_featured = false;
          let seq_number = 0;
          is_featured = sponsor?.is_featured
            ? sponsor?.is_featured
            : is_featured;
          seq_number = sponsor?.seq_number ? sponsor?.seq_number : seq_number;

          if (eventSponsorTypeNameExisting?.is_deleted === true) {
            let sponsorTypeName =
              sponsor?.event_sponsor_type_name.toLowerCase();

            /*             let titleExisting = sponsorTypeName.includes("title");

            if (titleExisting === true) {
              let eventSponsorTypeByEventIdExisting =
                await eventSponsorTypeDao.getAllEventSponsorTypeByEventId(
                  sponsor?.event_id,
                  transaction
                );

              if (eventSponsorTypeByEventIdExisting?.length > 0) {
                for await (let sponsorType of eventSponsorTypeByEventIdExisting) {
                  let eventSponsorType = await eventSponsorTypeDao.edit(
                    sponsorType?.event_sponsor_type_name,
                    sponsorType?.event_id,
                    sponsorType?.sort_order + 1,
                    sponsorType?.is_deleted,
                    sponsorType?.event_sponsor_type_id,
                    transaction
                  );
                }
              }

              let eventSponsorType = await eventSponsorTypeDao.edit(
                sponsor?.event_sponsor_type_name,
                sponsor?.event_id,
                0,
                (is_deleted = false),
                eventSponsorTypeNameExisting?.event_sponsor_type_id,
                transaction
              );
              sponsorInfo["event_sponsor_type"] = eventSponsorType;
            } else { */
            let eventSponsorType = await eventSponsorTypeDao.edit(
              sponsor?.event_sponsor_type_name,
              sponsor?.event_id,
              eventSponsorTypeCount?.count,
              (is_deleted = false),
              eventSponsorTypeNameExisting?.event_sponsor_type_id,
              transaction
            );

            sponsorInfo["event_sponsor_type"] = eventSponsorType;
            // }

            //   let eventSponsorType = await eventSponsorTypeDao.edit(
            //     sponsor?.event_sponsor_type_name,
            //     sponsor?.event_id,
            //     eventSponsorTypeCount?.count,
            //     (is_deleted = false),
            //     eventSponsorTypeNameExisting?.event_sponsor_type_id,
            //     transaction
            //   );

            //   sponsorInfo["event_sponsor_type"] = eventSponsorType;
            // } else {
            //   let eventSponsorType = await eventSponsorTypeDao.edit(
            //     sponsor?.event_sponsor_type_name,
            //     sponsor?.event_id,
            //     eventSponsorTypeNameExisting?.sort_order,
            //     (is_deleted = false),
            //     eventSponsorTypeNameExisting?.event_sponsor_type_id,
            //     transaction
            //   );
            //   sponsorInfo["event_sponsor_type"] = eventSponsorType;
          } else {
            let sponsorTypeName =
              sponsor?.event_sponsor_type_name.toLowerCase();

            /*             let titleExisting = sponsorTypeName.includes("title");

            if (titleExisting === true) {
              let eventSponsorTypeByEventIdExisting =
                await eventSponsorTypeDao.getAllEventSponsorTypeByEventId(
                  sponsor?.event_id,
                  transaction
                );

              if (eventSponsorTypeByEventIdExisting?.length > 0) {
                for await (let sponsorType of eventSponsorTypeByEventIdExisting) {
                  let eventSponsorType = await eventSponsorTypeDao.edit(
                    sponsorType?.event_sponsor_type_name,
                    sponsorType?.event_id,
                    sponsorType?.sort_order + 1,
                    sponsorType?.is_deleted,
                    sponsorType?.event_sponsor_type_id,
                    transaction
                  );
                }
              }

              let eventSponsorType = await eventSponsorTypeDao.edit(
                sponsor?.event_sponsor_type_name,
                sponsor?.event_id,
                0,
                (is_deleted = false),
                eventSponsorTypeNameExisting?.event_sponsor_type_id,
                transaction
              );
              sponsorInfo["event_sponsor_type"] = eventSponsorType;
            } else { */
            let eventSponsorType = await eventSponsorTypeDao.edit(
              sponsor?.event_sponsor_type_name,
              sponsor?.event_id,
              eventSponsorTypeNameExisting?.sort_order,
              (is_deleted = false),
              eventSponsorTypeNameExisting?.event_sponsor_type_id,
              transaction
            );
            sponsorInfo["event_sponsor_type"] = eventSponsorType;
            // }
          }

          let eventSponsor = await eventSponsorDao.updateBySponsorId(
            sponsorInfo?.sponsor_id,
            sponsor?.event_id,
            tournament_id,
            is_featured,
            eventSponsorDetail?.seq_number,
            eventSponsorTypeNameExisting?.event_sponsor_type_id,
            transaction
          );
          sponsorInfo["event_sponsor"] = eventSponsor;
        } else {
          let sponsorTypeName =
            sponsor?.company_sponsor_type_name.toLowerCase();

          /*           let titleExisting = sponsorTypeName.includes("title");

          if (titleExisting === true) {
            let eventSponsorTypeByEventIdExisting =
              await eventSponsorTypeDao.getAllCompanySponsorTypeByCompanyId(
                sponsor?.event_id,
                transaction
              );

            if (eventSponsorTypeByEventIdExisting?.length > 0) {
              for await (let sponsorType of eventSponsorTypeByEventIdExisting) {
                let eventSponsorType = await eventSponsorTypeDao.edit(
                  sponsorType?.event_sponsor_type_name,
                  sponsorType?.event_id,
                  sponsorType?.sort_order + 1,
                  sponsorType?.is_deleted,
                  sponsorType?.event_sponsor_type_id,
                  transaction
                );
              }
            }

            let eventSponsorType = await eventSponsorTypeDao.add(
              sponsor?.event_sponsor_type_name,
              sponsor?.event_id,
              0,
              is_deleted,
              transaction
            );
            sponsorInfo["event_sponsor_type"] = eventSponsorType;

            let is_featured = false;
            let seq_number = 0;
            is_featured = sponsor?.is_featured
              ? sponsor?.is_featured
              : is_featured;
            seq_number = sponsor?.seq_number ? sponsor?.seq_number : seq_number;

            let eventSponsor = await eventSponsorDao.updateBySponsorId(
              sponsorInfo?.sponsor_id,
              sponsor?.event_id,
              tournament_id,
              is_featured,
              eventSponsorDetail?.seq_number,
              eventSponsorType?.event_sponsor_type_id,
              transaction
            );

            sponsorInfo["event_sponsor"] = eventSponsor;
          } else { */
          let eventSponsorType = await eventSponsorTypeDao.add(
            sponsor?.event_sponsor_type_name,
            sponsor?.event_id,
            eventSponsorTypeCount?.count,
            is_deleted,
            transaction
          );

          sponsorInfo["event_sponsor_type"] = eventSponsorType;
          // }

          // let eventSponsorType = await eventSponsorTypeDao.add(
          //   sponsor?.event_sponsor_type_name,
          //   sponsor?.event_id,
          //   eventSponsorTypeCount?.count,
          //   is_deleted,
          //   transaction
          // );

          // sponsorInfo["event_sponsor_type"] = eventSponsorType;

          // let is_featured = false;
          // let seq_number = 0;
          // is_featured = sponsor?.is_featured
          //   ? sponsor?.is_featured
          //   : is_featured;
          // seq_number = sponsor?.seq_number ? sponsor?.seq_number : seq_number;

          // let eventSponsor = await eventSponsorDao.updateBySponsorId(
          //   sponsorInfo?.sponsor_id,
          //   sponsor?.event_id,
          //   tournament_id,
          //   is_featured,
          //   eventSponsorDetail?.seq_number,
          //   eventSponsorType?.event_sponsor_type_id,
          //   transaction
          // );

          // sponsorInfo["event_sponsor"] = eventSponsor;
        }

        let eventSponsorDataWithTypeId =
          await eventSponsorDao.getBySponsorTypeId(
            event_sponsor_type_id,
            transaction
          );

        if (eventSponsorDataWithTypeId?.length === 0) {
          let eventSponsorTypeUpdate = eventSponsorTypeDao.deleteById(
            event_sponsor_type_id,
            transaction
          );
        }

        result = sponsorInfo;
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
    console.log("Error occurred in update Sponsor Info", error);
    throw error;
  }
};

/**
 *Method to update  sponsor
 * @param {JSON} body
 */
const updateSponsor = async (body, connectionObj = null) => {
  let result = null;
  try {
    const {
      sponsor_name,
      sponsor_desc = null,
      files = {},
      sponsor_click_url,
      sponsor_id,
    } = body;
    let sponsor_media_url = null;
    let sponsor_media_type = null;
    let sponsor_media_url_meta = null;

    let Sponsor = await sponsorDao.getById(sponsor_id);

    if (Sponsor === null && sponsor_id !== null) {
      result = { message: "Sponsor not exist" };
      return result;
    } else {
      sponsor_media_url = Sponsor?.sponsor_media_url;
      sponsor_media_type = Sponsor?.sponsor_media_type;
      sponsor_media_url_meta = Sponsor?.sponsor_media_url_meta;

      if (JSON.stringify(files) !== JSON.stringify({})) {
        if (
          files.sponsor_media_url[0] !== null &&
          files.sponsor_media_url[0] !== undefined
        ) {
          imagemetaData = await cloudinaryUpload(files.sponsor_media_url[0]);
          await cloudinaryImageDelete(Sponsor?.sponsor_media_url_meta);
        }

        let sponsor_media_url_meta = imagemetaData;
        let sponsor_media_type =
          imagemetaData?.resource_type === "image" ? "I" : "V";
        let sponsor_media_url = imagemetaData?.url;

        result = await sponsorDao.edit(
          sponsor_name,
          sponsor_desc,
          sponsor_media_url,
          sponsor_media_type,
          sponsor_click_url,
          sponsor_media_url_meta,
          sponsor_id,
          connectionObj
        );
      } else {
        result = await sponsorDao.edit(
          sponsor_name,
          sponsor_desc,
          sponsor_media_url,
          sponsor_media_type,
          sponsor_click_url,
          sponsor_media_url_meta,
          sponsor_id,
          connectionObj
        );
      }
      return result;
    }
  } catch (error) {
    console.log("Error occurred in edit Sponsor", error);
    throw error;
  }
};

/**
 *Method to Save sponsor
 * @param {JSON} body
 */
const saveSponsor = async (body) => {
  let result = null;
  try {
    const sponsor = body;
    result = await db
      .tx(async (transaction) => {
        let companySponsorTypeOrder = sponsor?.company_sponsor_type_order;
        let companySponsorType = sponsor?.company_sponsor_type;
        let sponsors = sponsor?.sponsors;
        let sort_order = 0;

        for (const companySponsorTypeId of companySponsorTypeOrder) {
          let SponsorIds = companySponsorType[companySponsorTypeId].sponsor_ids;
          let company_id = companySponsorType[companySponsorTypeId]?.company_id;
          let company_sponsor_type_id =
            companySponsorType[companySponsorTypeId].company_sponsor_type_id;
          let company_sponsor_type_name =
            companySponsorType[companySponsorTypeId].company_sponsor_type_name;

          let companySponsorTypeUpdate = await companySponsorTypeDao.edit(
            company_sponsor_type_name,
            company_id,
            sort_order,
            false,
            company_sponsor_type_id,
            transaction
          );

          if (SponsorIds.length === 0) {
            let companySponsorTypeDelete =
              await companySponsorTypeDao.deleteById(
                company_sponsor_type_id,
                transaction
              );

            let companySponsorDelete =
              await companySponsorDao.deleteBySponsorTypeId(
                company_sponsor_type_id,
                transaction
              );
          } else {
            for (const [index, sponsorId] of SponsorIds.entries()) {
              let sponsor_id = sponsorId;
              let is_featured = sponsors[sponsorId].is_featured;
              let companySponsorExistingBySponsorId =
                await companySponsorDao.getCompanySponsorBySponsorId(
                  company_id,
                  sponsor_id,
                  transaction
                );

              if (companySponsorExistingBySponsorId !== null) {
                let companySponsorUpdate =
                  await companySponsorDao.updateSeqNoBySponsorId(
                    sponsor_id,
                    company_sponsor_type_id,
                    index,
                    transaction
                  );
              } else {
                let companySponsorAdd = await companySponsorDao.add(
                  sponsor_id,
                  company_id,
                  company_sponsor_type_id,
                  is_featured,
                  index,
                  transaction
                );
              }
            }
          }
          sort_order = sort_order + 1;
        }
        return (result = { message: "Saved Successfully!" });
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
    console.log("Error occurred in save Sponsor Info", error);
    throw error;
  }
};

/**
 *Method to Save sponsor for Event
 * @param {JSON} body
 */
const saveSponsorforEvent = async (body) => {
  let result = null;
  try {
    const sponsor = body;
    result = await db
      .tx(async (transaction) => {
        let eventSponsorTypeOrder = sponsor?.event_sponsor_type_order;
        let eventSponsorType = sponsor?.event_sponsor_type;
        let sponsors = sponsor?.sponsors;
        let sort_order = 0;

        for (const eventSponsorTypeId of eventSponsorTypeOrder) {
          let SponsorIds = eventSponsorType[eventSponsorTypeId].sponsor_ids;
          let event_id = eventSponsorType[eventSponsorTypeId]?.event_id;
          let tournament_id = eventSponsorType[eventSponsorTypeId]
            ?.tournament_id
            ? eventSponsorType[eventSponsorTypeId]?.tournament_id
            : null;
          let event_sponsor_type_id =
            eventSponsorType[eventSponsorTypeId].event_sponsor_type_id;
          let event_sponsor_type_name =
            eventSponsorType[eventSponsorTypeId].event_sponsor_type_name;

          let eventSponsorTypeUpdate = await eventSponsorTypeDao.edit(
            event_sponsor_type_name,
            event_id,
            sort_order,
            false,
            event_sponsor_type_id,
            transaction
          );

          if (SponsorIds.length === 0) {
            let eventSponsorTypeDelete = await eventSponsorTypeDao.deleteById(
              event_sponsor_type_id,
              transaction
            );

            let eventSponsorDelete =
              await eventSponsorDao.deleteBySponsorTypeId(
                event_sponsor_type_id,
                transaction
              );
          } else {
            for (const [index, sponsorId] of SponsorIds.entries()) {
              let sponsor_id = sponsorId;
              let is_featured = sponsors[sponsorId].is_featured;
              let eventSponsorExistingBySponsorId =
                await eventSponsorDao.getEventSponsorBySponsorId(
                  event_id,
                  sponsor_id,
                  transaction
                );

              if (eventSponsorExistingBySponsorId !== null) {
                let eventSponsorUpdate =
                  await eventSponsorDao.updateSeqNoBySponsorId(
                    sponsor_id,
                    event_sponsor_type_id,
                    index,
                    transaction
                  );
              } else {
                let eventSponsorAdd = await eventSponsorDao.add(
                  sponsor_id,
                  event_id,
                  tournament_id,
                  is_featured,
                  index,
                  event_sponsor_type_id,
                  transaction
                );
              }
            }
          }
          sort_order = sort_order + 1;
        }
        return (result = { message: "Saved Successfully!" });
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
    console.log("Error occurred in save Sponsor Info", error);
    throw error;
  }
};

/**
 * Method to get  sponsor based on sponsor_id
 * @param {int} sponsor_id
 */
const getById = async (sponsor_id) => {
  try {
    let Sponsor = {};
    let data = await sponsorDao.getById(sponsor_id);
    if (data === null) Sponsor = { message: "Sponsor not exist" };
    else Sponsor["data"] = data;
    return Sponsor;
  } catch (error) {
    console.log("Error occurred in Sponsor getById Service", error);
    throw error;
  }
};

/**
 * Method to get all  sponsors
 */
const getAll = async () => {
  try {
    let Sponsor = null;
    let data = await sponsorDao.getAll();
    Sponsor = data;
    return Sponsor;
  } catch (error) {
    console.log("Error occurred in getAll Sponsors", error);
    throw error;
  }
};

/**
 * Method to delete Sponsor based on sponsor_id
 * @param {int} sponsor_id
 */
const deleteById = async (sponsor_id) => {
  try {
    let Sponsor = {};
    let result = null;
    let sponsorInfo = await sponsorDao.getById(sponsor_id);
    if (sponsorInfo === null) {
      return (result = { message: "Sponsor Not Found" });
    }
    let company_sponsor_type_id =
      sponsorInfo?.company_sponsor_type?.company_sponsor_type_id;
    let company_sponsor_id = sponsorInfo?.company_sponsor?.company_sponsor_id;

    result = await db
      .tx(async (transaction) => {
        let companySponsor = await companySponsorDao.deleteById(
          company_sponsor_id,
          transaction
        );
        let companySponsorDataWithTypeId =
          await companySponsorDao.getBySponsorTypeId(
            company_sponsor_type_id,
            transaction
          );

        if (companySponsorDataWithTypeId?.length === 0) {
          let companySponsorTypeUpdate = companySponsorTypeDao.deleteById(
            company_sponsor_type_id,
            transaction
          );
        }

        let data = await sponsorDao.deleteById(sponsor_id, transaction);
        if (data === null) Sponsor = { message: "Sponsor not exist" };
        else Sponsor["data"] = "Sponsor Deleted Successfully!";
        return Sponsor;
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
    console.log("Error occurred in delete Sponsor", error);
    throw error;
  }
};

/**
 * Method to delete Event Sponsor based on sponsor_id
 * @param {int} sponsor_id
 */
const deleteForEventSponsor = async (sponsor_id) => {
  try {
    let Sponsor = {};
    let result = null;
    let sponsorInfo = await sponsorDao.getById(sponsor_id);
    if (sponsorInfo === null) {
      return (result = { message: "Sponsor Not Found" });
    }
    let event_sponsor_type_id =
      sponsorInfo?.event_sponsor_type?.event_sponsor_type_id;
    let event_sponsor_id = sponsorInfo?.event_sponsor?.event_sponsor_id;

    result = await db
      .tx(async (transaction) => {
        let eventSponsor = await eventSponsorDao.deleteById(
          event_sponsor_id,
          transaction
        );
        let eventSponsorDataWithTypeId =
          await eventSponsorDao.getBySponsorTypeId(
            event_sponsor_type_id,
            transaction
          );

        if (eventSponsorDataWithTypeId?.length === 0) {
          let eventSponsorTypeUpdate = eventSponsorTypeDao.deleteById(
            event_sponsor_type_id,
            transaction
          );
        }

        let data = await sponsorDao.deleteById(sponsor_id, transaction);
        if (data === null) Sponsor = { message: "Sponsor not exist" };
        else Sponsor["data"] = "Sponsor Deleted Successfully!";
        return Sponsor;
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
    console.log("Error occurred in deleteForEventSponsor Service", error);
    throw error;
  }
};

module.exports = {
  createSponsorInfo,
  createSponsor,
  editSponsorInfo,
  updateSponsor,
  getById,
  getAll,
  deleteById,
  saveSponsor,
  createSponsorInfoForEvent,
  editSponsorInfoForEvent,
  saveSponsorforEvent,
  deleteForEventSponsor,
};
