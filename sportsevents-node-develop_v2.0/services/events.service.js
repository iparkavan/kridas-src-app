const eventDao = require("../dao/events.dao");
const eventMasterDao = require("../dao/eventMaster.dao");
const trurnmentService = require("../services/tournaments.service");
const tournmentCategoryService = require("../services/tournamentCategories.service");
const tournamentCategoryDao = require("../dao/tournamentCategories.dao");
const organizerDao = require("../dao/organizer.dao");
const tounmentDao = require("../dao/tournaments.dao");
const eventOrganizerDao = require("../dao/eventOrganizer.dao");
const feedDao = require("../dao/feeds.dao");
const {
  cloudinaryUpload,
  cloudinaryImageDelete,
  documentUpload,
} = require("../utils/common");
const db = require("../utils/db");
const customQueryExecutor = require("../dao/common/utils.dao");
const companyDao = require("../dao/company.dao");
const categoryDao = require("../dao/category.dao");
const countryDao = require("../dao/country.dao");
const feedService = require("../services/feeds.service");
const { as } = require("pg-promise");
const activityLogDao = require("../dao/activityLog.dao");
const { addBulkEntry } = require("../dao/notification.dao");
const tournamentPlayerRegistrationDao = require("../dao/tournamentPlayerRegistration.dao");
const sportsDao = require("../dao/sports.dao");

/**
 * Method to create new event
 * @param {Object} body
 * @returns
 */
const createEvent = async (body) => {
  try {
    let result = null;
    let parentEvent = null;
    let event_banner = null;
    let event_banner_meta = null;
    let event_logo = null;
    let event_logo_meta = null;
    let tournamentArr = [];
    const {
      event_contacts = null,
      event_name,
      event_short_desc = null,
      event_desc,
      parent_event_id = null,
      event_startdate,
      event_enddate,
      event_reg_startdate = null,
      event_reg_lastdate = null,
      event_regfee = null,
      event_regfee_currency = null,
      files = {},
      event_status = "DRT",
      event_rules = null,
      is_public_event = "Y",
      collect_pymt_online = null,
      collect_pymt_offline = null,
      event_venue = null,
      event_venue_other = null,
      virtual_venue_url = null,
      standard_playing_conditions = null,
      standard_event_rules = null,
      indemnity_clause = null,
      agree_to_terms = "Y",
      search_tags = null,
      location_code = null,
      sports = [],
      company_id,
      event_category,
      event_doc = "[]",
    } = body;

    result = await db
      .tx(async (transaction) => {
        let organizer = await createOrganizer(company_id, transaction);
        let company = await companyDao.getById(company_id);
        let category = await categoryDao.getById(event_category);
        let parentEventId = parent_event_id;

        if (parent_event_id === null) {
          let requstData = {
            event_contacts,
            event_name,
            event_desc,
            event_short_desc,
            event_type: "NEW",
            event_category_refid: event_category,
            event_owner_id: organizer?.organizer_id,
          };
          let eventMaster = await createEventMaster(requstData, transaction);
          parentEventId = eventMaster?.event_master_id;
        }

        if (JSON.stringify(files) !== JSON.stringify({})) {
          if (files.event_banner !== null && files.event_banner !== undefined) {
            event_banner_meta = await cloudinaryUpload(files.event_banner[0]);
            event_banner = event_banner_meta.url;
          }

          if (files.event_logo !== null && files.event_logo !== undefined) {
            event_logo_meta = await cloudinaryUpload(files.event_logo[0]);
            event_logo = event_logo_meta.url;
          }
        }

        let event = await eventDao.add(
          event_contacts,
          event_name,
          event_short_desc,
          event_desc,
          parentEventId,
          event_startdate,
          event_enddate,
          event_reg_startdate,
          event_reg_lastdate,
          event_regfee,
          event_regfee_currency,
          event_banner,
          event_banner_meta,
          event_logo,
          event_logo_meta,
          event_status,
          event_rules,
          is_public_event,
          collect_pymt_online,
          collect_pymt_offline,
          event_venue,
          event_venue_other,
          virtual_venue_url,
          standard_playing_conditions,
          standard_event_rules,
          indemnity_clause,
          agree_to_terms,
          search_tags,
          location_code,
          event_doc,
          transaction
        );

        for await (let sport of sports) {
          let tounament = await tournamentCreate(
            event,
            sport.sport_id,
            null,
            transaction
          );
          let tourn_category = await tournamentCategoryCreate(
            tounament.tournament_id,
            sport,
            null,
            transaction
          );
          tounament["tourn_category"] = tourn_category;
          tournamentArr.push(tounament);
        }

        let eventOrganizerRequest = {
          event_refid: event?.event_id,
          organizer_refid: organizer?.organizer_id,
          organizer_role: "ORG",
        };
        await createEventOrganizer(eventOrganizerRequest, transaction);

        // if (event_status === 'PUB') {
        //     let metaData = event_banner_meta !== null ? { ...event_banner_meta } : {}
        //     let defaultContent = { ...feedDefaultContent }
        //     metaData["src"] = event_banner
        //     defaultContent["blocks"]["0"]["text"] = `${company.company_name} has created the ${category.category_name} event`
        //     defaultContent["entityMap"]["0"]["type"] = "IMAGE"
        //     defaultContent["entityMap"]["0"]["data"] = metaData
        //     await createEventFeed(defaultContent, company_id, transaction)
        // }
        event["tournaments"] = tournamentArr;
        // await activityLogDao.add(
        //     "EVENT",
        //     "CREATE",
        //     null,
        //     company_id,
        //     event?.event_id,
        //     null,
        //     "E",
        //     transaction
        // );

        return event;
      })
      .then((data) => {
        console.log("successfully data returned");
        return data;
      })
      .catch((error) => {
        console.log("failure, ROLLBACK was executed", error);
        throw error;
      });
    return result;
  } catch (error) {
    console.log("Error occurred in createEvent", error);
    throw error;
  }
};

/**
 * Method to create organizer
 * @param {uuid} company_id
 * @param {string} connectionObj
 * @returns
 */
const createOrganizer = async (company_id, connectionObj) => {
  try {
    let user_id = null;
    let organizer = await organizerDao.getByCompanyId(company_id);
    if (organizer === null)
      organizer = await organizerDao.add(company_id, user_id, connectionObj);
    return organizer;
  } catch (error) {
    console.log("Error occurred in createOrganizer", error);
    throw error;
  }
};

/**
 * Method to Create Event Master
 * @param {JSON} requestBody
 * @param {String} connectionObj
 * @returns
 */
const createEventMaster = async (requestBody, connectionObj) => {
  try {
    const {
      event_contacts = null,
      event_name,
      event_short_desc,
      event_desc,
      event_type,
      event_category_refid = null,
      event_owner_id,
    } = requestBody;
    let event_master = await eventMasterDao.add(
      event_contacts,
      event_name,
      event_short_desc,
      event_desc,
      event_type,
      event_category_refid,
      event_owner_id,
      connectionObj
    );
    return event_master;
  } catch {
    console.log("Error occurred in createEventMaster", error);
    throw error;
  }
};

/**
 * Method to create Tournament
 */
const tournamentCreate = async (
  event,
  sport_id,
  tournament_id = null,
  connectionObj
) => {
  try {
    const { event_startdate, event_enddate, event_id, event_venue } = event;
    let tournament_rules = null;
    let tournment = null;
    let eventSport = null;
    eventSport = await tounmentDao.getEventSport(
      event_id,
      sport_id,
      connectionObj
    );
    if (tournament_id === null && eventSport === null) {
      tournment = await tounmentDao.add(
        event_id,
        sport_id,
        event_startdate,
        event_enddate,
        tournament_rules,
        event_venue,
        connectionObj
      );
    } else if (eventSport !== null) {
      tournment = await tounmentDao.edit(
        event_id,
        sport_id,
        event_startdate,
        event_enddate,
        tournament_rules,
        event_venue,
        eventSport?.tournament_id,
        connectionObj
      );
    } else {
      tournment = await tounmentDao.edit(
        event_id,
        sport_id,
        event_startdate,
        event_enddate,
        tournament_rules,
        event_venue,
        tournament_id,
        connectionObj
      );
    }
    return tournment;
  } catch (error) {
    console.log("Error occurred in create tournment", error);
    throw error;
  }
};

const tournamentCategoryCreate = async (
  tournament_id,
  sport,
  tournament_cat_id = null,
  connectionObj
) => {
  try {
    const {
      tournament_category,
      tournament_format = null,
      age_group = null,
      sport_desc = null,
      min_age = 0,
      max_age = 100,
      minimum_players,
      maximum_players,
      min_reg_count,
      max_reg_count,
      reg_fee,
      reg_fee_currency,
      min_male,
      max_male,
      min_female,
      max_female,
      tournament_category_prizes,
      doc_list,
      // tournament_config,
    } = sport;
    let requestBodytournamnet = {
      tournament_refid: tournament_id,
      tournament_category: tournament_category,
      tournament_format: tournament_format,
      age_restriction: age_group,
      tournament_category_desc: sport_desc,
      min_age: min_age,
      max_age: max_age,
      tournament_category_id: tournament_cat_id,
      minimum_players: minimum_players,
      maximum_players: maximum_players,
      min_reg_count: min_reg_count,
      max_reg_count: max_reg_count,
      reg_fee: reg_fee,
      reg_fee_currency: reg_fee_currency,
      min_male: min_male,
      max_male: max_male,
      min_female: min_female,
      max_female: max_female,
      tournament_category_prizes: tournament_category_prizes,
      doc_list: doc_list,
      // tournament_config: tournament_config,
    };
    let tourn_category = null;
    if (tournament_cat_id === null)
      tourn_category = await tournmentCategoryService.createTournamentCatgories(
        requestBodytournamnet,
        connectionObj
      );
    else
      tourn_category = await tournmentCategoryService.updateTournament(
        requestBodytournamnet,
        connectionObj
      );

    return tourn_category;
  } catch (error) {
    console.log("Error occurred in create tournment", error);
    throw error;
  }
};

/**
 * Method to Create Event Organizer
 */
const createEventOrganizer = async (body, connectionObj) => {
  try {
    const { event_refid, tournaments, organizer_refid, organizer_role } = body;
    let eventOrg = await eventOrganizerDao.getByEventIdAndOrgannizerId(
      event_refid,
      organizer_refid,
      connectionObj
    );
    if (eventOrg === null)
      await eventOrganizerDao.add(
        event_refid,
        null,
        organizer_refid,
        organizer_role,
        connectionObj
      );
  } catch (error) {
    console.log("Error occurred in createEventOrganizer", error);
    throw error;
  }
};

/**
 * Method to update existing event
 * @param {JSON} body
 * @returns
 */
const editEvent = async (body) => {
  try {
    let result = null;
    // let parentEvent = null;
    let event_banner = null;
    let event_banner_meta = null;
    let event_logo = null;
    let event_logo_meta = null;
    let tournamentArr = [];
    const {
      event_contacts = null,
      event_name,
      event_short_desc = null,
      event_desc,
      parent_event_id,
      event_startdate,
      event_enddate,
      event_reg_startdate = null,
      event_reg_lastdate = null,
      event_regfee = null,
      event_regfee_currency = null,
      files = {},
      event_status,
      event_rules = null,
      is_public_event = "Y",
      collect_pymt_online = null,
      collect_pymt_offline = null,
      event_venue = null,
      event_venue_other = null,
      virtual_venue_url = null,
      standard_playing_conditions = null,
      standard_event_rules = null,
      indemnity_clause = null,
      agree_to_terms = "Y",
      search_tags = null,
      location_code = null,
      event_id,
      company_id,
      event_category,
      sports = [],
      stream_url,
      event_doc,
    } = body;

    let data = await eventDao.getById(event_id);
    let eventMaster = await eventMasterDao.getById(parent_event_id);
    if (data === null) {
      result = { message: "event not exist" };
      return result;
    }
    event_banner = data?.event_banner;
    event_banner_meta = data?.event_banner_meta;
    event_logo = data?.event_logo;
    event_logo_meta = data?.event_logo_meta;
    // if (event_doc?.length === 0) {
    //   event_doc = data?.event_doc;
    // }

    result = await db
      .tx(async (transaction) => {
        let organizer = await createOrganizer(company_id, transaction);
        // if (data?.event_status === 'DRT') {
        //     await tournamentCategoryDao.deleteByEventId(event_id, transaction);
        //     await eventOrganizerDao.deleteByEventId(event_id, transaction)
        //     await tounmentDao.deleteByEventId(event_id, transaction);
        // }
        if (JSON.stringify(files) !== JSON.stringify({})) {
          if (files.event_banner !== null && files.event_banner !== undefined) {
            event_banner_meta = await cloudinaryUpload(files.event_banner[0]);
            event_banner = event_banner_meta.url;
            await cloudinaryImageDelete(data?.event_banner_meta);
          }

          if (files.event_logo !== null && files.event_logo !== undefined) {
            event_logo_meta = await cloudinaryUpload(files.event_logo[0]);
            event_logo = event_logo_meta.url;
            await cloudinaryImageDelete(data?.event_logo_meta);
          }
        }

        if (
          data.event_status !== "PUB" &&
          eventMaster.event_category_refid !== Number(event_category)
        ) {
          const {
            event_contacts,
            event_name,
            event_short_desc,
            event_desc,
            event_type,
            event_owner_id,
            event_master_id,
          } = eventMaster;
          event_master = await eventMasterDao.edit(
            event_contacts,
            event_name,
            event_short_desc,
            event_desc,
            event_type,
            event_category,
            event_owner_id,
            event_master_id,
            transaction
          );
        }

        let event = await eventDao.edit(
          event_contacts,
          event_name,
          event_short_desc,
          event_desc,
          parent_event_id,
          event_startdate,
          event_enddate,
          event_reg_startdate,
          event_reg_lastdate,
          event_regfee,
          event_regfee_currency,
          event_banner,
          event_banner_meta,
          event_logo,
          event_logo_meta,
          event_status,
          event_rules,
          is_public_event,
          collect_pymt_online,
          collect_pymt_offline,
          event_venue,
          event_venue_other,
          virtual_venue_url,
          standard_playing_conditions,
          standard_event_rules,
          indemnity_clause,
          agree_to_terms,
          search_tags,
          location_code,
          stream_url,
          event_doc,
          event_id,
          transaction
        );

        let eventOrganizerRequest = {
          event_refid: event?.event_id,
          organizer_refid: organizer?.organizer_id,
          organizer_role: "ORG",
          // tournaments: tournamentArr,
        };
        // if (data?.event_status === 'DRT') {
        for await (let sport of sports) {
          let tournament_id =
            sport?.tournament_id === undefined ? null : sport?.tournament_id;
          let tournament_category_id =
            sport?.tournament_category_id === undefined
              ? null
              : sport?.tournament_category_id;

          if (
            event_status === "PUB" &&
            tournament_category_id === null &&
            tournament_id === null
          ) {
            let sportId = sport.sport_id;
            let sportName = await sportsDao.getSportNameBySportId(sportId);
            let tournamentCategory = sport?.tournament_category;
            let feed = {
              feed_content: {
                blocks: [
                  {
                    key: "ov3r",
                    text: `New Sports Category - ${sportName?.sports_name} - ${tournamentCategory} is Added in ${event_name} event`,
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [
                      {
                        offset: 0,
                        length:
                          `New Sports Category - ${sportName?.sports_name} - ${tournamentCategory} is Added in ${event_name} event`
                            .length,
                        style: "CODE",
                      },
                    ],
                    entityRanges: [],
                    data: {},
                  },
                ],
                entityMap: {
                  0: {
                    type: "LINK",
                    mutability: "MUTABLE",
                    data: {
                      url: `/events/${event_id}`,
                    },
                  },
                },
              },
              feed_creator_user_id: null,
              feed_creator_company_id: company_id,
              search_tags: null,
              share_count: 0,
              like_count: 0,
              files: {},
              event_id: event_id,
              feed_type: "EU",
              feed_content_html: null,
            };
            let hashTags = [];
            let tags = [];
            let image = [];
            let video = [];
            let shared_feed_id = null;
            let socket_request = null;

            let feedPage = {
              feed_content: {
                blocks: [
                  {
                    key: "9gm3s",
                    text: `${event_name}`,
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [
                      {
                        offset: 0,
                        length: `${event_name}`.length,
                        style: "BOLD",
                      },
                    ],
                    entityRanges: [
                      {
                        offset: 0,
                        length: `${event_name}`.length,
                        key: 0,
                      },
                    ],
                    data: {},
                  },
                  {
                    key: "ov3r",
                    text: `New Sports Category - ${sportName?.sports_name} - ${tournamentCategory} is Added in ${event_name} event`,
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [
                      {
                        offset: 0,
                        length:
                          `New Sports Category - ${sportName?.sports_name} - ${tournamentCategory} is Added in ${event_name} event`
                            .length,
                        style: "CODE",
                      },
                    ],
                    entityRanges: [],
                    data: {},
                  },
                ],
                entityMap: {
                  0: {
                    type: "LINK",
                    mutability: "MUTABLE",
                    data: {
                      url: `/events/${event_id}`,
                    },
                  },
                },
              },
              feed_creator_user_id: null,
              feed_creator_company_id: company_id,
              search_tags: null,
              share_count: 0,
              like_count: 0,
              files: {},
              event_id: null,
              feed_type: "EU",
              feed_content_html: null,
            };
            // let feedData = { ...feed };
            // for (let key in feed?.feed?.feed_content?.entityMap) {
            //   if (
            //     feed.feed.feed_content.entityMap[key]?.type === "LINK" &&
            //     feed.feed.feed_content.entityMap[key]?.data?.url ===
            //       "/events/null"
            //   )
            //     feedData.feed.feed_content.entityMap[
            //       key
            //     ].data.url = `/events/${event?.event_id}`;
            // }
            // feedData["feed"]["feed_type"] = "E";
            // feedData["feed"]["event_id"] = event?.event_id
            let feedBody = [];
            feedBody["feed"] = feedPage;
            feedBody["hashTags"] = hashTags;
            feedBody["tags"] = tags;
            feedBody["image"] = image;
            feedBody["video"] = video;
            feedBody["shared_feed_id"] = shared_feed_id;
            feedBody["socket_request"] = socket_request;

            let pageFeed = [];
            pageFeed["feed"] = feed;
            pageFeed["hashTags"] = hashTags;
            pageFeed["tags"] = tags;
            pageFeed["image"] = image;
            pageFeed["video"] = video;
            pageFeed["shared_feed_id"] = shared_feed_id;
            pageFeed["socket_request"] = socket_request;

            let eventCreatedFeed = await feedService.createFeed(
              feedBody,
              transaction
            );
            let pageCreatedFeed = await feedService.createFeed(
              pageFeed,
              transaction
            );

            event["event_feed_id"] = eventCreatedFeed.feed_id;
            event["page_feed_id"] = pageCreatedFeed.feed_id;
          }

          if (sport?.is_delete === "Y") {
            let RegisteredTeam =
              await tournamentPlayerRegistrationDao.getTeamByEventSport(
                event_id,
                sport.sport_id,
                tournament_category_id,
                transaction
              );

            if (RegisteredTeam.length === 0) {
              deleteTournamentCategory = await tournamentCategoryDao.deleteById(
                tournament_category_id,
                transaction
              );

              tournamentExisting =
                await tournamentCategoryDao.getByTournamentId(
                  deleteTournamentCategory?.tournament_refid,
                  transaction
                );

              if (tournamentExisting.length === 0) {
                deleteTournament = await tounmentDao.deleteById(
                  tournament_id,
                  transaction
                );
              }
            }
          } else {
            let tounament = await tournamentCreate(
              event,
              sport.sport_id,
              tournament_id,
              transaction
            );

            let tourn_category = await tournamentCategoryCreate(
              tounament.tournament_id,
              sport,
              tournament_category_id,
              transaction
            );
            tounament["tourn_category"] = tourn_category;
            tournamentArr.push(tounament);
          }
        }
        await createEventOrganizer(eventOrganizerRequest, transaction);
        // } else if (data?.event_status === 'PUB') {
        //     for await (let sport of sports) {
        //         let tournament_id = sport?.tournament_id === undefined ? null : sport?.tournament_id
        //         let tournament_category_id = sport?.tournament_category_id === undefined ? null : sport?.tournament_category_id
        //         let tounament = await tournamentCreate(event, sport.sport_id, tournament_id, transaction)
        //         let tourn_category = await tournamentCategoryCreate(tounament.tournament_id, sport, tournament_category_id, transaction)
        //         tounament["tourn_category"] = tourn_category
        //         tournamentArr.push(tounament)
        //     }
        //     await createEventOrganizer(eventOrganizerRequest, transaction)
        // }
        event["tournaments"] = tournamentArr;

        await activityLogDao.addActivityLog(
          "EVT",
          "EDT",
          company_id,
          null,
          event_id,
          null,
          null
        );

        return event;
      })
      .then((data) => {
        console.log("successfully data returned");
        return data;
      })
      .catch((error) => {
        console.log("failure, ROLLBACK was executed", error);
        throw error;
      });
    return result;
  } catch (error) {
    console.log("Error occurred in editEvent", error);
    throw error;
  }
};

/**
 * Method to get the event based on event Id
 * @param {int} event_id
 */

const fetchEvent = async (event_id, user_id) => {
  try {
    let event = {
      data: null,
    };
    let connectionObj = null;
    let data = await eventDao.getById(event_id);
    if (data === null) event = { message: "event not exist" };
    else {
      event["data"] = data;
      if (user_id) {
        // await activityLogDao.add(
        //   "VIEW",
        //   "EVENT",
        //   user_id,
        //   null,
        //   event_id,
        //   null,
        //   "EVENT",
        //   null,
        //   connectionObj
        // );

        await activityLogDao.addActivityLog(
          "EVT",
          "VIW",
          null,
          null,
          event_id,
          user_id,
          null
        );
      }
    }

    if (data.event_venue_other && data.event_venue_other?.country) {
      let country_code = data.event_venue_other?.country;
      let countryData = await countryDao.fetchcountrybyCode(country_code);
      event["data"]["countryData"] = JSON.stringify(countryData);
    }
    return event;
  } catch (error) {
    console.log("Error occurred in fetch event", error);
    throw error;
  }
};

/**
 * Method to get the event based on event Id
 * @param {int} event_id
 */

const updateIsFeature = async (body) => {
  try {
    let event = {
      data: null,
    };

    const { is_featured, event_id } = body;
    event = await eventDao.updateIsFeature(is_featured, event_id);
    return event;
  } catch (error) {
    console.log("Error occurred in updateIsFeature", error);
    throw error;
  }
};

/**
 *  Method to delete the event based on event id
 * @param {uuid} event_id
 */

const deleteEvent = async (event_id) => {
  try {
    let event = {
      data: null,
    };
    let data = await eventDao.deleteById(event_id);
    if (data === null) event = { message: "event not exist" };
    else event["data"] = "Success";
    return event;
  } catch (error) {
    console.log("Error occurred in delete event", error);
    throw error;
  }
};

/**
 *  Method to get all the events
 */

const fetchAll = async () => {
  try {
    return await eventDao.getAll();
  } catch (error) {
    console.log("Error occurred in fetchAll: ", error);
    throw error;
  }
};

/**
 * Method to search event with multiple parameter
 * @param {Json} body
 * @returns
 */
const search = async (body) => {
  let result = null;
  try {
    const {
      page = 0,
      sort = "desc",
      size = 5,
      event_name = null,
      sport_ids = null,
      start_date = null,
      end_date = null,
      category_id = null,
      is_past = false,
      type = null,
      user_id = null,
      event_status = null,
      is_public_event = null,
      city = null,
    } = body;

    let newType = type;
    newType = is_past === false ? "year" : type;

    let query = null;
    let countQuery = null;

    query = `select
        e.*,
        array_agg(jsonb_build_object('sport_id', t.sports_refid, 'sport_name', s.sports_name)),
        em.event_category_refid,
        c.category_name 
    from
        events e
    left join tournaments t on
        t.event_refid = e.event_id
    left join sports s on
        t.sports_refid = s.sports_id
    left join events_master em 
            on
        em.event_master_id = e.parent_event_id
    left join category c on
        c.category_id = em.event_category_refid
    where
        e.event_status = 'PUB'`;
    countQuery = `select
        e.*,
        array_agg(jsonb_build_object('sport_id', t.sports_refid, 'sport_name', s.sports_name)),
        em.event_category_refid,
        c.category_name
    from
        events e
    left join tournaments t on
        t.event_refid = e.event_id
    left join sports s on
        t.sports_refid = s.sports_id
    left join events_master em 
                on
        em.event_master_id = e.parent_event_id
    left join category c on
        c.category_id = em.event_category_refid
    where
        e.event_status = 'PUB'`;

    if (is_public_event) {
      query = query + `and e.is_public_event = '${is_public_event}'`;
      countQuery = countQuery + `and e.is_public_event = '${is_public_event}'`;
    }
    // if (city) {
    //   let eventVenueId = [];
    //   let citiesArr = [];
    //   let eventConductedCitiesQuery = `select unnest(e.event_venue)  as event_venue from events e`;
    //   let eventVenueData = await customQueryExecutor.customQueryExecutor(
    //     eventConductedCitiesQuery
    //   );
    //   for await (let eventVenue of eventVenueData) {
    //     companyIdOfEventVenue = eventVenue.event_venue;
    //     eventVenueId.push(companyIdOfEventVenue);
    //   }
    //   // let eventCitiesQuery = `select distinct c.address ->>'city' as city from company c where c.company_id in (${eventVenueId})`;
    //   // let cityNameData = await customQueryExecutor.customQueryExecutor(
    //   //   eventCitiesQuery
    //   // );

    //   // for await (let city of cityNameData) {
    //   //   citiesArr.push(city);
    //   // }

    //   // for await (let Id of eventVenueId) {
    //   //   let company_id = Id;
    //   //   let companyExisting = await companyDao.getById(company_id);
    //   //   if (
    //   //     companyExisting !== null &&
    //   //     companyExisting.address !== null &&
    //   //     companyExisting.address.city
    //   //   ) {
    //   //     citiesArr.push(companyExisting.address.city);
    //   //   }
    //   // }

    //   console.log({ citiesArr });
    // }

    if (event_name !== null) {
      // query = query + `and (e.event_name ilike '%${event_name}%' or e.event_venue_other ->> 'city' ilike '%${event_name}%' or e.event_venue_other ->> 'state' ilike '%${event_name}%'' or e.event_venue_other ->> 'country' ilike '%${event_name}%') `
      // countQuery = countQuery + `and (e.event_name ilike '%${event_name}%' or e.event_venue_other ->> 'city' ilike '%${event_name}%' or e.event_venue_other ->> 'state' ilike '%${event_name}%'' or e.event_venue_other ->> 'country' ilike '%${event_name}%') `
      query = query + `and e.event_name ilike '%${event_name}%'`;
      countQuery = countQuery + `and e.event_name ilike '%${event_name}%'`;
    }
    if (newType !== null && newType !== undefined) {
      let month_end = `select (date_trunc('month',current_date) + interval '1 month' - interval '1 day') as date`;
      let year_end = `select (date_trunc('year',current_date) + interval '1 year' - interval '1 day') as date`;
      let month_start = is_past
        ? `select date_trunc('month', current_date)`
        : `NOW()`;
      let year_start = is_past
        ? `select date_trunc('year', current_date)`
        : `NOW()`;
      switch (newType) {
        case "today":
          query =
            query +
            `and ((e.event_startdate >= NOW() and e.event_startdate < NOW() + interval '1 day') or (e.event_enddate >= NOW() and e.event_enddate < NOW() + interval '1 day'))`;
          countQuery =
            countQuery +
            `and ((e.event_startdate >= NOW() and e.event_startdate < NOW() + interval '1 day') or (e.event_enddate >= NOW() and e.event_enddate < NOW() + interval '1 day')) `;
          break;
        case "tomorrow":
          query =
            query +
            `and (e.event_startdate >= NOW() and e.event_startdate <= NOW() + interval '2 days') or (e.event_enddate >= NOW() and e.event_enddate <= NOW() + interval '2 days')`;
          countQuery =
            countQuery +
            `and ((e.event_startdate >= NOW() and e.event_startdate <= NOW() + interval '2 days') or (e.event_enddate >= NOW() and e.event_enddate <= NOW() + interval '2 days')) `;
          break;
        case "week":
          query =
            query +
            ` and ((e.event_startdate >= NOW() and e.event_startdate <= NOW() + interval '1 week') or (e.event_enddate >= NOW() and e.event_enddate <= NOW() + interval '1 week')) `;
          countQuery =
            countQuery +
            ` and ((e.event_startdate >= NOW() and e.event_startdate <= NOW() + interval '1 week') or (e.event_enddate >= NOW() and e.event_enddate <= NOW() + interval '1 week')) `;
          break;
        case "month":
          query =
            query +
            ` and ((e.event_startdate >= (${month_start}) and e.event_startdate <= (${month_end})) or (e.event_enddate >= (${month_start}) and e.event_enddate <= (${month_end}))) `;
          countQuery =
            countQuery +
            ` and ((e.event_startdate >= (${month_start}) and e.event_startdate <= (${month_end})) or (e.event_enddate >= (${month_start}) and e.event_enddate <= (${month_end}))) `;
          break;
        case "year":
          query =
            query +
            ` and ((e.event_startdate >= (${year_start}) and e.event_startdate <= (${year_end})) or (e.event_enddate >= (${year_start}) and e.event_enddate <= (${year_end}))) `;
          countQuery =
            countQuery +
            ` and ((e.event_startdate >= (${year_start}) and e.event_startdate <= (${year_end})) or (e.event_enddate >= (${year_start}) and e.event_enddate <= (${year_end}))) `;
          break;
        case "custom":
          query =
            query +
            ` and (e.event_startdate between '${start_date}' and '${end_date}' or e.event_enddate between '${start_date}' and '${end_date}') `;
          countQuery =
            countQuery +
            ` and (e.event_startdate between '${start_date}' and '${end_date}' or e.event_enddate between '${start_date}' and '${end_date}') `;
          break;
        default:
          break;
      }
    }
    if (sport_ids !== null && sport_ids.length > 0) {
      query = query + ` and s.sports_id in (${sport_ids}) `;
      countQuery = countQuery + ` and s.sports_id in (${sport_ids}) `;
    }
    if (category_id !== null && category_id.length > 0) {
      query = query + ` and em.event_category_refid in (${category_id}) `;
      countQuery =
        countQuery + ` and em.event_category_refid in (${category_id}) `;
    }

    if (user_id) {
      let newType = type;
      newType = is_past === false ? "year" : type;

      let userSubQuery = `select eo.event_refid from company_users cu left join organizer o on o.company_refid = cu.company_id and cu.user_type ='p'  left join event_organizer eo on o.organizer_id = eo.organizer_refid where cu.user_id = '${user_id}' and eo.event_refid notnull`;
      query = `select
          e.*,
          array_agg(jsonb_build_object('sport_id', t.sports_refid, 'sport_name', s.sports_name)),
          em.event_category_refid ,
          c.category_name 
      from
          events e
      left join tournaments t on
          t.event_refid = e.event_id
      left join sports s on
          t.sports_refid = s.sports_id
      left join events_master em 
              on
          em.event_master_id = e.parent_event_id
      left join category c on
          c.category_id = em.event_category_refid where e.event_id in (${userSubQuery}) `;
      countQuery = `select
          e.event_id,
          em.event_category_refid ,
          c.category_name 
      from
          events e
      left join tournaments t on
          t.event_refid = e.event_id
      left join sports s on
          t.sports_refid = s.sports_id
      left join events_master em 
              on
          em.event_master_id = e.parent_event_id
          left join category c on
          c.category_id =em.event_category_refid 
      where
          e.event_id in  (${userSubQuery}) `;

      if (is_public_event) {
        query = query + ` and e.is_public_event = '${is_public_event}'`;
        countQuery =
          countQuery + ` and e.is_public_event = '${is_public_event}'`;
      }

      if (event_status !== null) {
        query = query + `and e.event_status ='${event_status}' `;
        countQuery = countQuery + `and e.event_status ='${event_status}' `;
      }
      if (event_name !== null) {
        // query = query + `and (e.event_name ilike '%${event_name}%' or e.event_venue_other ->> 'city' ilike '%${event_name}%' or e.event_venue_other ->> 'state' ilike '%${event_name}%' or e.event_venue_other ->> 'country' ilike '%${event_name}%') `
        // countQuery = countQuery + `and (e.event_name ilike '%${event_name}%' or e.event_venue_other ->> 'city' ilike '%${event_name}%' or e.event_venue_other ->> 'state' ilike '%${event_name}%' or e.event_venue_other ->> 'country' ilike '%${event_name}%') `
        query = query + `and e.event_name ilike '%${event_name}%' `;
        countQuery = countQuery + `and e.event_name ilike '%${event_name}%' `;
      }
      if (newType !== null && newType !== undefined) {
        let start_day = `select date_trunc('day', current_date)`;
        let end_day = `select date_trunc('day', current_date) + interval '1 day'`;
        let month_start = is_past
          ? `select date_trunc('month', current_date)`
          : `NOW()`;
        let month_end = `select (date_trunc('month',current_date) + interval '1 month' - interval '1 day') as date`;
        let year_start = is_past
          ? `select date_trunc('year', current_date)`
          : `NOW()`;
        let year_end = `select (date_trunc('year',current_date) + interval '1 year' - interval '1 day') as date`;

        switch (newType) {
          case "today":
            query =
              query +
              `and ((e.event_startdate >= (${start_day}) and e.event_startdate < (${end_day})) or (e.event_enddate >= (${start_day}) and e.event_enddate < (${end_day}))) `;
            countQuery =
              countQuery +
              `and ((e.event_startdate >= (${start_day}) and e.event_startdate < (${end_day})) or (e.event_enddate >= (${start_day}) and e.event_enddate < (${end_day}))) `;
            break;
          case "tomorrow":
            query =
              query +
              `and (e.event_startdate >= NOW() and e.event_startdate <= NOW() + interval '2 days') or (e.event_enddate >= NOW() and e.event_enddate <= NOW() + interval '2 days')`;
            countQuery =
              countQuery +
              `and ((e.event_startdate >= NOW() and e.event_startdate <= NOW() + interval '2 days') or (e.event_enddate >= NOW() and e.event_enddate <= NOW() + interval '2 days')) `;
            break;
          case "week":
            query =
              query +
              ` and ((e.event_startdate >= NOW() and e.event_startdate <= NOW() + interval '1 week') or (e.event_enddate >= NOW() and e.event_enddate <= NOW() + interval '1 week')) `;
            countQuery =
              countQuery +
              ` and ((e.event_startdate >= NOW() and e.event_startdate <= NOW() + interval '1 week') or (e.event_enddate >= NOW() and e.event_enddate <= NOW() + interval '1 week')) `;
            break;
          case "month":
            query =
              query +
              ` and ((e.event_startdate >= (${month_start}) and e.event_startdate <= (${month_end})) or (e.event_enddate >= (${month_start}) and e.event_enddate <= (${month_end}))) `;
            countQuery =
              countQuery +
              ` and ((e.event_startdate >= (${month_start}) and e.event_startdate <= (${month_end})) or (e.event_enddate >= (${month_start}) and e.event_enddate <= (${month_end}))) `;
            break;
          case "year":
            query =
              query +
              ` and ((e.event_startdate >= (${year_start}) and e.event_startdate <= (${year_end})) or (e.event_enddate >= (${year_start}) and e.event_enddate <= (${year_end}))) `;
            countQuery =
              countQuery +
              ` and ((e.event_startdate >= (${year_start}) and e.event_startdate <= (${year_end})) or (e.event_enddate >= (${year_start}) and e.event_enddate <= (${year_end}))) `;
            break;
          case "custom":
            query =
              query +
              ` and (e.event_startdate between '${start_date}' and '${end_date}' or e.event_enddate between '${start_date}' and '${end_date}') `;
            countQuery =
              countQuery +
              ` and (e.event_startdate between '${start_date}' and '${end_date}' or e.event_enddate between '${start_date}' and '${end_date}') `;
            break;
          default:
            break;
        }
      }
      if (sport_ids !== null && sport_ids.length > 0) {
        query = query + ` and s.sports_id in (${sport_ids}) `;
        countQuery = countQuery + ` and s.sports_id in (${sport_ids}) `;
      }

      if (category_id !== null && category_id.length > 0) {
        query = query + ` and em.event_category_refid in (${category_id})`;
        countQuery =
          countQuery + ` and em.event_category_refid in (${category_id}) `;
      }

      // let offset = page > 0 ? page * size : 0;

      // query =
      //   query +
      //   ` group by e.event_id,em.event_category_refid,c.category_name  order by e.event_startdate ${sort} limit ${size} offset ${offset}`;
      // countQuery =
      //   countQuery +
      //   `group by e.event_id,em.event_category_refid,c.category_name `;
    }

    let offset = page > 0 ? page * size : 0;

    query =
      query +
      ` group by e.event_id,em.event_category_refid,c.category_name  order by e.event_startdate ${sort} limit ${size} offset ${offset}`;
    countQuery =
      countQuery +
      `group by e.event_id,em.event_category_refid,c.category_name`;
    let data = await customQueryExecutor.customQueryExecutor(query);
    const count = await customQueryExecutor.customQueryExecutor(countQuery);

    let length = Number(count.length);
    let totalPages = length < size ? 1 : Math.ceil(length / size);

    let tempData = {
      totalCount: length,
      totalPage: totalPages,
      size: size,
      content: data,
    };
    result = tempData;
  } catch (error) {
    console.log("Error occurred in customSearch ", error);
    throw error;
  }
  return result;
};

/**
 *
 * @param {JSON} body
 * @returns
 */
const searchCompanyId = async (body) => {
  let result = null;
  let query = null;
  let countQuery = null;
  try {
    const {
      page = 0,
      sort = "desc",
      size = 5,
      company_id = null,
      event_name = null,
    } = body;

    query = `select
          e.*,
          c.category_name
        from
          events e
        left join events_master em on
          em.event_master_id = e.parent_event_id
        left join category c on
          c.category_id = em.event_category_refid
        where
          e.event_id in 
                    (
          select
            eo.event_refid
          from
            organizer o
          join 
                    event_organizer eo on
            eo.organizer_refid = o.organizer_id
            where
                o.company_refid = '${company_id}') `;

    countQuery = `select count(*) 
        from
          events e
        left join events_master em on
          em.event_master_id = e.parent_event_id
        left join category c on
          c.category_id = em.event_category_refid
        where
          e.event_id in 
                    (
          select
            eo.event_refid
          from
            organizer o
          join 
                    event_organizer eo on
            eo.organizer_refid = o.organizer_id
            where
                o.company_refid = '${company_id}') `;

    if (event_name !== null) {
      query = query + ` and e.event_name ilike '%${event_name}%'  `;
      countQuery = countQuery + ` and e.event_name ilike '%${event_name}%' `;
    }
    let offset = page > 0 ? page * size : 0;
    query =
      query +
      `order by e.event_startdate ${sort} limit ${size} offset ${offset}`;
    let data = await customQueryExecutor.customQueryExecutor(query);
    const count = await customQueryExecutor.customQueryExecutor(countQuery);
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
    console.log("Error occurred in search user ", error);
    throw error;
  }
  return result;
};

/**
 *
 * @param {JSON} body
 * @returns
 */
const getParticipatedEventByCompanyId = async (body) => {
  let result = null;
  let query = null;
  let countQuery = null;
  try {
    const {
      page = 0,
      sort = "desc",
      size = 5,
      company_id = null,
      event_name = null,
      type,
    } = body;

    // query = `select * from events e where e.event_id in (select t2.event_refid as event_id from teams t left join tournament_player_registration tpr on tpr.team_id =t.team_id left join tournaments t2 on t2.tournament_id = tpr.tournamentid where t.company_id = '${company_id}')`;

    // countQuery = `select count(*) from events e where e.event_id in (select t2.event_refid as event_id from teams t left join tournament_player_registration tpr on tpr.team_id =t.team_id left join tournaments t2 on t2.tournament_id = tpr.tournamentid where t.company_id = '${company_id}')`;

    let query = "";
    let countQuery = "";

    if (type === "subteam") {
      query = `select
              *
            from
              events e
            where
              e.event_id in (
              select
                t2.event_refid as event_id
              from
                teams t
              left join tournament_player_registration tpr on
                tpr.team_id = t.team_id
              left join tournaments t2 on
                t2.tournament_id = tpr.tournamentid
              where
                t.company_id = '${company_id}')`;

      countQuery = `select
                count(*)
              from
                events e
              where
                e.event_id in (
                select
                  t2.event_refid as event_id
                from
                  teams t
                left join tournament_player_registration tpr on
                  tpr.team_id = t.team_id
                left join tournaments t2 on
                  t2.tournament_id = tpr.tournamentid
                where
                  t.company_id = '${company_id}')`;
    }

    if (type === "child") {
      query = `select
              *
            from
              events e
            where
              e.event_id in (
              select
                t2.event_refid as event_id
              from
                teams t
              left join tournament_player_registration tpr on
                tpr.team_id = t.team_id
              left join tournaments t2 on
                t2.tournament_id = tpr.tournamentid
              left join company c on
                c.company_id = t.company_id
              left join company c2 on
                c.parent_company_id = c2.company_id
              where
                  c2.company_id = '${company_id}')`;

      countQuery = `select
                count(*)
              from
                events e
              where
                e.event_id in (
                select
                  t2.event_refid as event_id
                from
                  teams t
                left join tournament_player_registration tpr on
                  tpr.team_id = t.team_id
                left join tournaments t2 on
                  t2.tournament_id = tpr.tournamentid
                left join company c on
                  c.company_id = t.company_id
                left join company c2 on
                  c.parent_company_id = c2.company_id
                where
                    c2.company_id = '${company_id}')`;
    }

    if (type === "parent") {
      query = `select
              *
            from
              events e
            where
              e.event_id in (
              select
                t2.event_refid as event_id
              from
                teams t
              left join tournament_player_registration tpr on
                tpr.team_id = t.team_id
              left join tournaments t2 on
                t2.tournament_id = tpr.tournamentid
              left join company c on
                c.company_id = t.company_id
              left join company c2 on
                c.parent_company_id = c2.company_id
              left join company c3 on
              c2.parent_company_id =c3.company_id 
              where
                  c3.company_id = '${company_id}')`;

      countQuery = `select
                count(*)
              from
                events e
              where
                e.event_id in (
                select
                  t2.event_refid as event_id
                from
                  teams t
                left join tournament_player_registration tpr on
                  tpr.team_id = t.team_id
                left join tournaments t2 on
                  t2.tournament_id = tpr.tournamentid
                left join company c on
                  c.company_id = t.company_id
                left join company c2 on
                  c.parent_company_id = c2.company_id
                left join company c3 on
                c2.parent_company_id =c3.company_id 
                where
                    c3.company_id = '${company_id}')`;
    }
    if (event_name !== null) {
      query = query + ` and e.event_name ilike '%${event_name}%'  `;
      countQuery = countQuery + ` and e.event_name ilike '%${event_name}%' `;
    }
    let offset = page > 0 ? page * size : 0;
    query =
      query +
      `order by e.event_startdate ${sort} limit ${size} offset ${offset}`;
    let data = await customQueryExecutor.customQueryExecutor(query);
    const count = await customQueryExecutor.customQueryExecutor(countQuery);
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
    console.log("Error occurred in getParticipatedEventByCompanyId  ", error);
    throw error;
  }
  return result;
};

/**
 * Method to search event with multiple parameter
 * @param {Json} body
 * @returns
 */
const customSearch = async (body) => {
  let result = null;
  try {
    const {
      page = 0,
      sort = "desc",
      size = 5,
      user_id = null,
      event_name = null,
      sport_ids = null,
      event_status = null,
      type = null,
      start_date = null,
      end_date = null,
      is_past = false,
      category_id = null,
    } = body;

    let newType = type;
    newType = is_past === false ? "year" : type;

    let userSubQuery = `select eo.event_refid from company_users cu left join organizer o on o.company_refid = cu.company_id and cu.user_type ='p'  left join event_organizer eo on o.organizer_id = eo.organizer_refid where cu.user_id = '${user_id}' and eo.event_refid notnull`;
    let query = `select
        e.*,
        array_agg(jsonb_build_object('sport_id', t.sports_refid, 'sport_name', s.sports_name)),
        em.event_category_refid ,
        c.category_name 
    from
        events e
    left join tournaments t on
        t.event_refid = e.event_id
    left join sports s on
        t.sports_refid = s.sports_id
    left join events_master em 
            on
        em.event_master_id = e.parent_event_id
    left join category c on
        c.category_id = em.event_category_refid where e.event_id in (${userSubQuery}) `;
    let countQuery = `select
        e.event_id,
        em.event_category_refid ,
        c.category_name 
    from
        events e
    left join tournaments t on
        t.event_refid = e.event_id
    left join sports s on
        t.sports_refid = s.sports_id
    left join events_master em 
            on
        em.event_master_id = e.parent_event_id
        left join category c on
        c.category_id =em.event_category_refid 
    where
        e.event_id in  (${userSubQuery}) `;

    if (event_status !== null) {
      query = query + `and e.event_status ='${event_status}' `;
      countQuery = countQuery + `and e.event_status ='${event_status}' `;
    }
    if (event_name !== null) {
      // query = query + `and (e.event_name ilike '%${event_name}%' or e.event_venue_other ->> 'city' ilike '%${event_name}%' or e.event_venue_other ->> 'state' ilike '%${event_name}%' or e.event_venue_other ->> 'country' ilike '%${event_name}%') `
      // countQuery = countQuery + `and (e.event_name ilike '%${event_name}%' or e.event_venue_other ->> 'city' ilike '%${event_name}%' or e.event_venue_other ->> 'state' ilike '%${event_name}%' or e.event_venue_other ->> 'country' ilike '%${event_name}%') `
      query = query + `and e.event_name ilike '%${event_name}%' `;
      countQuery = countQuery + `and e.event_name ilike '%${event_name}%' `;
    }
    if (newType !== null && newType !== undefined) {
      let start_day = `select date_trunc('day', current_date)`;
      let end_day = `select date_trunc('day', current_date) + interval '1 day'`;
      let month_start = is_past
        ? `select date_trunc('month', current_date)`
        : `NOW()`;
      let month_end = `select (date_trunc('month',current_date) + interval '1 month' - interval '1 day') as date`;
      let year_start = is_past
        ? `select date_trunc('year', current_date)`
        : `NOW()`;
      let year_end = `select (date_trunc('year',current_date) + interval '1 year' - interval '1 day') as date`;

      switch (newType) {
        case "today":
          query =
            query +
            `and ((e.event_startdate >= (${start_day}) and e.event_startdate < (${end_day})) or (e.event_enddate >= (${start_day}) and e.event_enddate < (${end_day}))) `;
          countQuery =
            countQuery +
            `and ((e.event_startdate >= (${start_day}) and e.event_startdate < (${end_day})) or (e.event_enddate >= (${start_day}) and e.event_enddate < (${end_day}))) `;
          break;
        case "tomorrow":
          query =
            query +
            `and (e.event_startdate >= NOW() and e.event_startdate <= NOW() + interval '2 days') or (e.event_enddate >= NOW() and e.event_enddate <= NOW() + interval '2 days')`;
          countQuery =
            countQuery +
            `and ((e.event_startdate >= NOW() and e.event_startdate <= NOW() + interval '2 days') or (e.event_enddate >= NOW() and e.event_enddate <= NOW() + interval '2 days')) `;
          break;
        case "week":
          query =
            query +
            ` and ((e.event_startdate >= NOW() and e.event_startdate <= NOW() + interval '1 week') or (e.event_enddate >= NOW() and e.event_enddate <= NOW() + interval '1 week')) `;
          countQuery =
            countQuery +
            ` and ((e.event_startdate >= NOW() and e.event_startdate <= NOW() + interval '1 week') or (e.event_enddate >= NOW() and e.event_enddate <= NOW() + interval '1 week')) `;
          break;
        case "month":
          query =
            query +
            ` and ((e.event_startdate >= (${month_start}) and e.event_startdate <= (${month_end})) or (e.event_enddate >= (${month_start}) and e.event_enddate <= (${month_end}))) `;
          countQuery =
            countQuery +
            ` and ((e.event_startdate >= (${month_start}) and e.event_startdate <= (${month_end})) or (e.event_enddate >= (${month_start}) and e.event_enddate <= (${month_end}))) `;
          break;
        case "year":
          query =
            query +
            ` and ((e.event_startdate >= (${year_start}) and e.event_startdate <= (${year_end})) or (e.event_enddate >= (${year_start}) and e.event_enddate <= (${year_end}))) `;
          countQuery =
            countQuery +
            ` and ((e.event_startdate >= (${year_start}) and e.event_startdate <= (${year_end})) or (e.event_enddate >= (${year_start}) and e.event_enddate <= (${year_end}))) `;
          break;
        case "custom":
          query =
            query +
            ` and (e.event_startdate between '${start_date}' and '${end_date}' or e.event_enddate between '${start_date}' and '${end_date}') `;
          countQuery =
            countQuery +
            ` and (e.event_startdate between '${start_date}' and '${end_date}' or e.event_enddate between '${start_date}' and '${end_date}') `;
          break;
        default:
          break;
      }
    }
    if (sport_ids !== null && sport_ids.length > 0) {
      query = query + ` and s.sports_id in (${sport_ids}) `;
      countQuery = countQuery + ` and s.sports_id in (${sport_ids}) `;
    }

    if (category_id !== null && category_id.length > 0) {
      query = query + ` and em.event_category_refid in (${category_id})`;
      countQuery =
        countQuery + ` and em.event_category_refid in (${category_id}) `;
    }

    let offset = page > 0 ? page * size : 0;

    query =
      query +
      ` group by e.event_id,em.event_category_refid,c.category_name  order by e.event_startdate ${sort} limit ${size} offset ${offset}`;
    countQuery =
      countQuery +
      `group by e.event_id,em.event_category_refid,c.category_name `;
    let data = await customQueryExecutor.customQueryExecutor(query);
    const count = await customQueryExecutor.customQueryExecutor(countQuery);

    let length = Number(count.length);
    let totalPages = length < size ? 1 : Math.ceil(length / size);

    let tempData = {
      totalCount: length,
      totalPage: totalPages,
      size: size,
      content: data,
    };
    result = tempData;
  } catch (error) {
    console.log("Error occurred in customSearch ", error);
    throw error;
  }
  return result;
};

/**
 * Method to get the event detail and follower details
 * @param {uuid} event_id
 */
const fetchEventData = async (event_id) => {
  try {
    let event = {};
    data = await eventDao.getEventData(event_id);
    let followerList = await eventDao.fetchEventFollowerList(event_id);
    if (data === null) event = { message: "event not exist" };
    else {
      event["event"] = data;
      event["followerList"] = followerList;
    }
    return event;
  } catch (error) {
    console.log("Error occurred in fetchEventData", error);
    throw error;
  }
};

/**
 * Method to publish the event event
 * @param {*} body
 * @returns
 */
const eventPublish = async (body) => {
  try {
    let result = null;
    let event_banner = null;
    let event_banner_meta = null;
    let event_logo = null;
    let event_logo_meta = null;
    let tournamentArr = [];
    const {
      event_contacts = null,
      event_name,
      event_short_desc = null,
      event_desc,
      parent_event_id = null,
      event_startdate,
      event_enddate,
      event_reg_startdate = null,
      event_reg_lastdate = null,
      event_regfee = null,
      event_regfee_currency = null,
      files = {},
      event_status = "PUB",
      event_rules = null,
      is_public_event = "Y",
      collect_pymt_online = null,
      collect_pymt_offline = null,
      event_venue = null,
      event_venue_other = null,
      virtual_venue_url = null,
      standard_playing_conditions = null,
      standard_event_rules = null,
      indemnity_clause = null,
      agree_to_terms = "Y",
      search_tags = null,
      location_code = null,
      stream_url,
      sports = [],
      company_id,
      event_category,
      event_id,
      feed,
      event_doc,
      socket_request = null,
    } = body;

    result = await db
      .tx(async (transaction) => {
        let organizer = await createOrganizer(company_id, transaction);
        if (event_id) {
          // await tournamentCategoryDao.deleteByEventId(event_id, transaction);
          // await eventOrganizerDao.deleteByEventId(event_id, transaction);
          // await tounmentDao.deleteByEventId(event_id, transaction);
          let event = await eventDao.getById(event_id);
          event_banner = event?.event_banner;
          event_banner_meta = event?.event_banner_meta;
          event_logo = event?.event_logo;
          event_logo_meta = event?.event_logo_meta;
          // event_doc = event?.event_doc;
        }
        let parentEventId = parent_event_id;
        if (parent_event_id === null) {
          let requstData = {
            event_contacts,
            event_name,
            event_desc,
            event_short_desc,
            event_type: "NEW",
            event_category_refid: event_category,
            event_owner_id: organizer?.organizer_id,
          };
          let eventMaster = await createEventMaster(requstData, transaction);
          parentEventId = eventMaster?.event_master_id;
        }
        if (JSON.stringify(files) !== JSON.stringify({})) {
          if (files.event_banner !== null && files.event_banner !== undefined) {
            event_banner_meta = await cloudinaryUpload(files.event_banner[0]);
            event_banner = event_banner_meta.url;
          }
          if (files.event_logo !== null && files.event_logo !== undefined) {
            event_logo_meta = await cloudinaryUpload(files.event_logo[0]);
            event_logo = event_logo_meta.url;
          }
        }
        let event = null;
        if (event_id) {
          event = await eventDao.edit(
            event_contacts,
            event_name,
            event_short_desc,
            event_desc,
            parentEventId,
            event_startdate,
            event_enddate,
            event_reg_startdate,
            event_reg_lastdate,
            event_regfee,
            event_regfee_currency,
            event_banner,
            event_banner_meta,
            event_logo,
            event_logo_meta,
            event_status,
            event_rules,
            is_public_event,
            collect_pymt_online,
            collect_pymt_offline,
            event_venue,
            event_venue_other,
            virtual_venue_url,
            standard_playing_conditions,
            standard_event_rules,
            indemnity_clause,
            agree_to_terms,
            search_tags,
            location_code,
            stream_url,
            event_doc,
            event_id,
            transaction
          );
        } else {
          event = await eventDao.add(
            event_contacts,
            event_name,
            event_short_desc,
            event_desc,
            parentEventId,
            event_startdate,
            event_enddate,
            event_reg_startdate,
            event_reg_lastdate,
            event_regfee,
            event_regfee_currency,
            event_banner,
            event_banner_meta,
            event_logo,
            event_logo_meta,
            event_status,
            event_rules,
            is_public_event,
            collect_pymt_online,
            collect_pymt_offline,
            event_venue,
            event_venue_other,
            virtual_venue_url,
            standard_playing_conditions,
            standard_event_rules,
            indemnity_clause,
            agree_to_terms,
            search_tags,
            location_code,
            event_doc,
            transaction
          );
        }
        for await (let sport of sports) {
          // let tounament = await tournamentCreate(
          //     event,
          //     sport.sport_id,
          //     transaction
          // );
          // let tourn_category = await tournamentCategoryCreate(
          //     tounament.tournament_id,
          //     sport,
          //     transaction
          // );

          let tournament_id =
            sport?.tournament_id === undefined ? null : sport?.tournament_id;
          let tournament_category_id =
            sport?.tournament_category_id === undefined
              ? null
              : sport?.tournament_category_id;

          // if (sport?.is_delete === "Y") {
          //   let RegisteredTeam =
          //     await tournamentPlayerRegistrationDao.getTeamByEventSport(
          //       event_id,
          //       sport.sport_id,
          //       transaction
          //     );

          //   if (RegisteredTeam.length === 0) {
          //     deleteTournamentCategory = await tournamentCategoryDao.deleteById(
          //       tournament_category_id,
          //       transaction
          //     );
          //     deleteTournament = await tounmentDao.deleteById(
          //       tournament_id,
          //       transaction
          //     );
          //   }
          // } else {
          let tounament = await tournamentCreate(
            event,
            sport.sport_id,
            tournament_id,
            transaction
          );
          let tourn_category = await tournamentCategoryCreate(
            tounament.tournament_id,
            sport,
            tournament_category_id,
            transaction
          );
          tounament["tourn_category"] = tourn_category;
          tournamentArr.push(tounament);
        }
        // }
        let eventOrganizerRequest = {
          event_refid: event?.event_id,
          organizer_refid: organizer?.organizer_id,
          organizer_role: "ORG",
        };
        await createEventOrganizer(eventOrganizerRequest, transaction);
        if (event_status === "PUB") {
          let feedData = { ...feed };
          for (let key in feed?.feed?.feed_content?.entityMap) {
            if (
              feed.feed.feed_content.entityMap[key]?.type === "LINK" &&
              feed.feed.feed_content.entityMap[key]?.data?.url ===
                "/events/null"
            )
              feedData.feed.feed_content.entityMap[
                key
              ].data.url = `/events/${event?.event_id}`;
          }
          feedData["feed"]["feed_type"] = "E";
          // feedData["feed"]["event_id"] = event?.event_id
          let test = await feedService.createFeed(feedData, transaction);
          event["feed_id"] = test.feed_id;
        }
        let companyUser = await companyDao.fetchCompanyUser(
          company_id,
          transaction
        );
        if (socket_request) {
          let admin_user = process.env.KRIDAS_USER_ID;
          if (admin_user === companyUser?.user_id) {
            await addBulkEntry(
              event.feed_id,
              "P",
              "EV",
              admin_user,
              // event_id,
              transaction
            );
            socket_request.emit("public_notification", {
              message: "test notification",
              count: 100,
            });
          }
        }
        event["tournaments"] = tournamentArr;
        // await activityLogDao.add(
        //   "POST",
        //   "EVENT",
        //   null,
        //   company_id,
        //   event?.event_id,
        //   null,
        //   "EVENT",
        //   null,
        //   transaction
        // );

        await activityLogDao.addActivityLog(
          "EVT",
          "CRE",
          company_id,
          null,
          event?.event_id,
          null,
          null
        );

        return event;
      })
      .then((data) => {
        console.log("successfully data returned");
        return data;
      })
      .catch((error) => {
        console.log("failure, ROLLBACK was executed", error);
        throw error;
      });
    return result;
  } catch (error) {
    console.log("Error occurred in publish event", error);
    throw error;
  }
};

/**
 * Method to create Event Feed
 * @param {JSON} feed_content
 * @param {uuid} company_id
 * @param {string} connectionObj
 */
const createEventFeed = async (feed_content, company_id, connectionObj) => {
  try {
    let user_id = null;
    let event_id = null;
    let feed_type = "E";
    let count = 0;
    let search_tags = ["event_promotion"];
    await feedDao.add(
      JSON.stringify(feed_content),
      user_id,
      company_id,
      search_tags,
      count,
      count,
      event_id,
      feed_type,
      connectionObj
    );
  } catch (err) {
    console.log("Error occurred in event_promotion", error);
    throw error;
  }
};

/**
 * Method to search by Is Feature
 */
const searchByIsFeature = async (body) => {
  try {
    let result = null;
    const { page = 0, sort = "desc", size = 5, is_feature = true } = body;
    let query = `select * from events e where e.is_featured = ${is_feature} `;
    let countQuery = `select count(*) from events e where e.is_featured =  ${is_feature} `;
    let offset = page > 0 ? page * size : 0;
    query =
      query + `order by e.updated_date ${sort} limit ${size} offset ${offset}`;
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
    return (result = tempData);
  } catch (error) {
    console.log("Error occurred in searchByIsFeature", error);
    throw error;
  }
};

const searchEvent = async (body) => {
  try {
    const { page = 0, sort = "desc", size = 10 } = body;

    let query = `select
      e.* ,
      c.category_name
    from
      events e
    left join events_master em on
      em.event_master_id = e.parent_event_id
    left join category c on
      c.category_id = em.event_category_refid `;
    let countQuery = `select
      count(e.*)
    from
      events e
    left join events_master em on
      em.event_master_id = e.parent_event_id
    left join category c on
      c.category_id = em.event_category_refid `;
    let offset = page > 0 ? page * size : 0;
    query =
      query + `order by e.updated_date ${sort} limit ${size} offset ${offset}`;
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
    return (result = tempData);
  } catch (error) {
    console.log("Error occurred in searchEvent", error);
    throw error;
  }
};

module.exports = {
  createEvent,
  editEvent,
  fetchEvent,
  deleteEvent,
  fetchAll,
  search,
  searchCompanyId,
  fetchEventData,
  customSearch,
  eventPublish,
  searchByIsFeature,
  getParticipatedEventByCompanyId,
  updateIsFeature,
  searchEvent,
};
