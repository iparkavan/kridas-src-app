const teamsDao = require("../dao/teams.dao");
const userDao = require("../dao/user.dao");
const companyDao = require("../dao/company.dao");
const commonDao = require("../dao/common/utils.dao");
const tournamentCategoryDao = require("../dao/tournamentCategories.dao");
const teamPlayerRegistrationDao = require("../dao/tournamentPlayerRegistration.dao");
const companyUserDao = require("../dao/companyUser.dao");
const mailService = require("../services/mail.service");
const notificationDao = require("../dao/notification.dao");
const companyStatisticsDao = require("../dao/companyStatistics.dao");
const followerService = require("../services/follower.service");
const followerDao = require("../dao/followers.dao");
const db = require("../utils/db");
const { otpGenerator } = require("../utils/util");
const axios = require("axios");
const companySportDao = require("../dao/companySport.dao");
const companyTeamPlayerDao = require("../dao/companyTeamPlayers.dao");
const CompanySports = require("../dao/companySport.dao");
const activityLogDao = require("../dao/activityLog.dao");
const categoryDao = require("../dao/category.dao");

/**
 * Method to register team
 * @param {json} body
 * @param {string} connectionObj
 * @returns
 */
const teamRegister = async (body, connectionObj) => {
  try {
    const {
      tournament_category_id,
      team_name,
      team_members = [],
      user_id,
      selected_team_id,
      page_category,
      new_team_name,
      players = [],
      socket_request = null,
      player_type,
      parent_company_id,
    } = body;
    result = await db
      .tx(async (transaction) => {
        let userEmail = null;
        let company = null;
        let eventName = null;
        let tournamentCategoryVenueName = null;
        let identity_docs = "[]";
        let team = null;
        let teamPlayerRegistrationValue = [];
        let teamPlayerRegistration = null;
        let updated_team = [];
        let currentDate = new Date();
        let parentCompany = null;
        let childCompany = null;
        let companyTeamPlayerResponse = [];
        let tournamentPlayerCount = null;
        let tournament_player_reg_id =
          await teamPlayerRegistrationDao.getTournamentPlayerRegistrationId(
            transaction
          );

        eventName = await teamsDao.getEventNameByTournamentCategoryId(
          tournament_category_id,
          transaction
        );

        tournamentCategoryVenueName =
          await teamsDao.getTournCatVenueByTournCatId(
            tournament_category_id,
            transaction
          );

        let sports_interest =
          await tournamentCategoryDao.getSportsIdByTournCatId(
            tournament_category_id,
            transaction
          );

        if (team_name) {
          let teamNameExisting =
            await teamPlayerRegistrationDao.getTeamNameExistingByTournCatId(
              team_name,
              tournament_category_id,
              transaction
            );

          if (teamNameExisting?.length !== 0) {
            return (team = {
              message: "This Event Team Name already exists",
            });
          }
        }

        if (parent_company_id) {
          childCompany = await createCompany(
            new_team_name,
            user_id,
            parent_company_id,
            page_category,
            tournament_category_id,
            (type = "Existing"),
            transaction
          );

          let companySportsExisting = await companySportDao.getbyCompanySports(
            parent_company_id,
            sports_interest.sports_refid,
            transaction
          );

          if (companySportsExisting === null) {
            let parentCompanySports = await companySportDao.add(
              parent_company_id,
              sports_interest.sports_refid,
              (is_delete = false),
              transaction
            );
          }

          let childCompanySports = await companySportDao.add(
            childCompany?.company_id,
            sports_interest.sports_refid,
            (is_delete = false),
            transaction
          );

          let parentFollowingChildBody = {
            follower_userid: null,
            follower_companyid: parent_company_id,
            following_companyid: childCompany?.company_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(
            parentFollowingChildBody,
            transaction
          );

          let userFollowingChildBody = {
            follower_userid: user_id,
            follower_companyid: null,
            following_companyid: childCompany?.company_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(
            userFollowingChildBody,
            transaction
          );

          company = await createCompany(
            team_name,
            user_id,
            childCompany?.company_id,
            page_category,
            tournament_category_id,
            (type = "Existing"),
            transaction
          );

          let subTeamCompanySports = await companySportDao.add(
            company?.company_id,
            sports_interest.sports_refid,
            (is_delete = false),
            transaction
          );

          let userFollowingSubTeamBody = {
            follower_userid: user_id,
            follower_companyid: null,
            following_companyid: company?.company_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(
            userFollowingSubTeamBody,
            transaction
          );

          let parentFollowingSubTeamBody = {
            follower_userid: null,
            follower_companyid: parent_company_id,
            following_companyid: company?.company_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(
            parentFollowingSubTeamBody,
            transaction
          );

          let childFollowingSubTeamBody = {
            follower_userid: null,
            follower_companyid: childCompany?.company_id,
            following_companyid: company?.company_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(
            childFollowingSubTeamBody,
            transaction
          );
        } else if (new_team_name) {
          parentCompany = await createCompany(
            new_team_name,
            user_id,
            null,
            page_category,
            tournament_category_id,
            null,
            transaction
          );

          let parentCompanySports = await companySportDao.add(
            parentCompany?.company_id,
            sports_interest.sports_refid,
            (is_delete = false),
            transaction
          );

          let userFollowingParentTeamBody = {
            follower_userid: user_id,
            follower_companyid: null,
            following_companyid: parentCompany?.company_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(
            userFollowingParentTeamBody,
            transaction
          );

          childCompany = await createCompany(
            new_team_name,
            user_id,
            parentCompany?.company_id,
            page_category,
            tournament_category_id,
            null,
            transaction
          );

          let childCompanySports = await companySportDao.add(
            childCompany?.company_id,
            sports_interest.sports_refid,
            (is_delete = false),
            transaction
          );

          let parentFollowingChildBody = {
            follower_userid: null,
            follower_companyid: parentCompany?.company_id,
            following_companyid: childCompany?.company_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(
            parentFollowingChildBody,
            transaction
          );

          let userFollowingChildBody = {
            follower_userid: user_id,
            follower_companyid: null,
            following_companyid: childCompany?.company_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(
            userFollowingChildBody,
            transaction
          );

          company = await createCompany(
            team_name,
            user_id,
            childCompany?.company_id,
            page_category,
            tournament_category_id,
            null,
            transaction
          );

          let subTeamCompanySports = await companySportDao.add(
            company?.company_id,
            sports_interest.sports_refid,
            (is_delete = false),
            transaction
          );

          let userFollowingSubTeamBody = {
            follower_userid: user_id,
            follower_companyid: null,
            following_companyid: company?.company_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(
            userFollowingSubTeamBody,
            transaction
          );

          let parentFollowingSubTeamBody = {
            follower_userid: null,
            follower_companyid: parentCompany?.company_id,
            following_companyid: company?.company_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(
            parentFollowingSubTeamBody,
            transaction
          );

          let childFollowingSubTeamBody = {
            follower_userid: null,
            follower_companyid: childCompany?.company_id,
            following_companyid: company?.company_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(
            childFollowingSubTeamBody,
            transaction
          );
        } else if (selected_team_id) {
          let parentCompanyId =
            await companyDao.getParentCompanyByChildCompanyId(
              selected_team_id,
              transaction
            );

          company = await createCompany(
            team_name,
            user_id,
            selected_team_id,
            page_category,
            tournament_category_id,
            (type = "Existing"),
            transaction
          );

          let subTeamCompanySports = await companySportDao.add(
            company?.company_id,
            sports_interest.sports_refid,
            (is_delete = false),
            transaction
          );

          let userFollowingSubTeamBody = {
            follower_userid: user_id,
            follower_companyid: null,
            following_companyid: company?.company_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(
            userFollowingSubTeamBody,
            transaction
          );

          let parentFollowingSubTeamBody = {
            follower_userid: null,
            follower_companyid: parentCompanyId?.company_id,
            following_companyid: company?.company_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(
            parentFollowingSubTeamBody,
            transaction
          );

          let childFollowingSubTeamBody = {
            follower_userid: null,
            follower_companyid: selected_team_id,
            following_companyid: company?.company_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(
            childFollowingSubTeamBody,
            transaction
          );
        }

        if (team_members?.length > 0) {
          team = await teamsDao.add(
            JSON.stringify(team_members),
            null,
            company.company_id,
            transaction
          );
        }
        let tournamentCat = await tournamentCategoryDao.getById(
          tournament_category_id,
          transaction
        );
        if (team?.team_id) {
          teamPlayerRegistration = await teamPlayerRegistrationDao.add(
            tournament_player_reg_id.tournament_player_reg_id + 1,
            null,
            currentDate,
            team.team_id,
            null,
            tournament_category_id,
            tournamentCat.tournament_refid,
            null,
            transaction
          );

          let organizerEmailDetails =
            await tournamentCategoryDao.getDetailsForOrganizerEmail(
              tournament_category_id,
              team?.team_id,
              transaction
            );

          let participant_full_name = team_name;
          let participated_event_name = eventName.event_name;
          let participated_event_startdate = eventName.event_startdate;
          let participated_event_virtual_venue_url =
            eventName.virtual_venue_url;
          let participated_event_venue = participated_event_virtual_venue_url
            ? participated_event_virtual_venue_url
            : tournamentCategoryVenueName;

          let parentPageEmail = organizerEmailDetails?.parent_page_email;
          let thirdLevelPageEmail =
            organizerEmailDetails?.third_level_page_email;

          let pageOwnerEmailId = organizerEmailDetails?.user_email;

          let participantEmailId = thirdLevelPageEmail
            ? thirdLevelPageEmail
            : parentPageEmail
            ? parentPageEmail
            : pageOwnerEmailId;

          let participantRegistrationMail =
            mailService.participantRegistrationMail(
              participant_full_name,
              participated_event_name,
              participated_event_startdate,
              participated_event_venue,
              participantEmailId
            );

          let EventOrganizerEmailDetails =
            await tournamentCategoryDao.getEventOrganizerDetails(
              tournament_category_id,
              team?.team_id,
              "team",
              transaction
            );

          let page_name = EventOrganizerEmailDetails?.event_owner_page_name;
          let event_name = EventOrganizerEmailDetails?.event_name;
          let participant_name = team_name;
          let tournament_category =
            EventOrganizerEmailDetails?.tournament_category;
          let sports_name = EventOrganizerEmailDetails?.sports_name;
          let sports_category = EventOrganizerEmailDetails?.sports_category;
          // let parent_page_email = EventOrganizerEmailDetails?.parent_page_email;
          // let parent_page_contact_number =
          //   EventOrganizerEmailDetails?.parent_page_contact_number;

          let pageOwnerEmail =
            EventOrganizerEmailDetails?.team_page_owner_email;
          let pageOwnerContactNo =
            EventOrganizerEmailDetails?.team_page_owner_contact_number;
          let eventOwnerUserEmail =
            EventOrganizerEmailDetails?.event_owner_user_email;
          let eventOwnerPageEmail =
            EventOrganizerEmailDetails?.event_owner_page_email;
          let teamParentPageOwnerName =
            EventOrganizerEmailDetails?.team_page_owner_name;

          let eventOwnerName =
            EventOrganizerEmailDetails?.event_owner_user_name;

          let mailToBeSentEmail = eventOwnerPageEmail
            ? eventOwnerPageEmail
            : eventOwnerUserEmail;

          let mailToBeSentName = page_name ? page_name : eventOwnerName;

          let contactPersonParentPageName =
            EventOrganizerEmailDetails?.parent_page_name;
          let contactEmailParentPageEmail =
            EventOrganizerEmailDetails?.parent_page_email;
          let contactNoForParentPage =
            EventOrganizerEmailDetails?.parent_page_contact_number;

          let contactPersonParentPageOwner =
            EventOrganizerEmailDetails?.team_page_owner_name;
          let contactEmailForParentPageOwner =
            EventOrganizerEmailDetails?.team_page_owner_email;
          let contactNoForParentPageOwner =
            EventOrganizerEmailDetails?.team_page_owner_contact_number;

          let contactPerson = null;
          let contactEmail = null;
          let contactNo = null;

          if (contactNoForParentPage && contactEmailParentPageEmail) {
            contactPerson = contactPersonParentPageName;
            contactEmail = contactEmailParentPageEmail;
            contactNo = contactNoForParentPage;
          } else {
            contactPerson = contactPersonParentPageOwner;
            contactEmail = contactEmailForParentPageOwner;
            contactNo = contactNoForParentPageOwner;
          }

          let organizerEmail =
            await mailService.organizerMailOnTeamRegistration(
              page_name,
              event_name,
              participant_name,
              tournament_category,
              sports_name,
              sports_category,
              null,
              null,
              parentPageEmail,
              pageOwnerEmail,
              contactNo,
              contactEmail,
              mailToBeSentEmail,
              contactPerson,
              mailToBeSentName,
              teamParentPageOwnerName,
              "team"
            );

          /*           let page_name = organizerEmailDetails?.parent_page_name;
          let event_name = organizerEmailDetails?.event_name;
          let participant_name = team_name;
          let tournament_category = organizerEmailDetails?.tournament_category;
          let sports_name = organizerEmailDetails?.sports_name;
          let sports_category = organizerEmailDetails?.sports_category;
          let event_contacts = organizerEmailDetails?.event_contacts;
          let third_level_page_email =
            organizerEmailDetails?.third_level_page_email;
          let parent_page_email = organizerEmailDetails?.parent_page_email;
          let pageOwnerEmail = organizerEmailDetails?.user_email;

          let organizerEmail =
            await mailService.organizerMailOnTeamRegistration(
              page_name,
              event_name,
              participant_name,
              tournament_category,
              sports_name,
              sports_category,
              event_contacts,
              third_level_page_email,
              parent_page_email,
              pageOwnerEmail
            ); */
        }

        let index = 0;
        if (team_members?.length > 0) {
          updated_team = [...team_members];
          for await (let e of team_members) {
            let emailId = e.email_id;
            let firstName = e.first_name;
            let lastName = e.last_name;
            let phoneNumber = e.contact_number;
            let name = firstName + " " + lastName;
            let gender = e.gender;
            let dob = e.dob;
            let preferencesOpted = e.preferences_opted;
            let registeredUser = await userDao.getByEmail(emailId, transaction);
            if (registeredUser === null) {
              let token = otpGenerator();
              let sports_interested = "{}";
              let userName = null;
              let userRegistration = null;
              let countUserName = await userDao.getByName(firstName, lastName);
              if (countUserName.count === "0") {
                userName = `${firstName
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .trim()}.${lastName.replace(/[^a-zA-Z0-9]/g, "").trim()}`;

                let userNameExisting = await userDao.getByUserName(userName);
                if (userNameExisting.count !== "0") {
                  userName = `${firstName
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .trim()}.${lastName.replace(/[^a-zA-Z0-9]/g, "").trim()}.${
                    userNameExisting.count
                  }`;
                }
              } else {
                userName = `${firstName
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .trim()}.${lastName.replace(/[^a-zA-Z0-9]/g, "").trim()}.${
                  countUserName.count
                }`;
                let userNameExisting = await userDao.getByUserName(userName);
                if (userNameExisting.count !== "0") {
                  userName = `${firstName
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .trim()}.${lastName.replace(/[^a-zA-Z0-9]/g, "").trim()}.${
                    userNameExisting.count
                  }`;
                }
              }
              userRegistration = await userDao.add(
                firstName,
                lastName,
                null,
                null,
                emailId,
                phoneNumber,
                null,
                null,
                token,
                null,
                null,
                gender,
                dob,
                null,
                null,
                null,
                identity_docs,
                null,
                null,
                ["USR"],
                null,
                "IN",
                null,
                false,
                sports_interested,
                null,
                null,
                userName,
                null,
                null,
                transaction
              );

              let firebaseAccount = null;
              data = {
                user_email: emailId,
                password: "Skiya@123",
              };

              firebaseAccount = await axios.post(
                `${process.env.MIDDLEWARE_API_URL}/api/users/signUp`,
                data,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                }
              );

              let regEmail = null;
              regEmail = mailService.registerationMail(
                emailId,
                name,
                team_name,
                eventName.event_name
              );

              if (childCompany?.company_id) {
                let companyTeamPlayer = await companyTeamPlayerDao.add(
                  userRegistration?.user_id,
                  childCompany?.company_id,
                  "AC",
                  null,
                  transaction
                );
                companyTeamPlayerResponse.push(companyTeamPlayer);
              }

              let companyTeamPlayer = await companyTeamPlayerDao.add(
                userRegistration?.user_id,
                company.company_id,
                "AC",
                preferencesOpted,
                transaction
              );
              companyTeamPlayerResponse.push(companyTeamPlayer);
            } else {
              let welcomeEmail = null;
              updated_team[index] = {
                ...updated_team[index],
                player_id: registeredUser?.user_id,
              };
              welcomeEmail = mailService.teamMemberMail(
                emailId,
                name,
                team_name,
                eventName.event_name
              );

              if (childCompany?.company_id) {
                let companyTeamPlayer = await companyTeamPlayerDao.add(
                  registeredUser?.user_id,
                  childCompany?.company_id,
                  "AC",
                  null,
                  transaction
                );
                companyTeamPlayerResponse.push(companyTeamPlayer);
              }
              let companyTeamPlayer = await companyTeamPlayerDao.add(
                registeredUser?.user_id,
                company.company_id,
                "AC",
                preferencesOpted,
                transaction
              );
              companyTeamPlayerResponse.push(companyTeamPlayer);
            }
            index = index + 1;
          }
        }

        if (players?.length > 0) {
          for await (let e of players) {
            let tournamentPlayerRegId =
              await teamPlayerRegistrationDao.getTournamentPlayerRegistrationId(
                transaction
              );

            let tournamentPlayerIdIncrement =
              tournamentPlayerRegId.tournament_player_reg_id + 1;
            let updated_player = [...players];
            let emailId = e.email_id;
            let firstName = e.first_name;
            let lastName = e.last_name;
            let phoneNumber = e.contact_number;
            let name = firstName + " " + lastName;
            let gender = e.gender;
            let dob = e.dob;
            let preferencesOpted = e.preferences_opted;
            let registeredUser = await userDao.getByEmail(emailId, transaction);
            if (registeredUser === null) {
              let token = otpGenerator();
              let sports_interested = "{}";
              let userName = null;
              let userRegistration = null;
              let countUserName = await userDao.getByName(firstName, lastName);
              if (countUserName.count === "0") {
                userName = `${firstName
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .trim()}.${lastName.replace(/[^a-zA-Z0-9]/g, "").trim()}`;

                let userNameExisting = await userDao.getByUserName(userName);
                if (userNameExisting.count !== "0") {
                  userName = `${firstName
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .trim()}.${lastName.replace(/[^a-zA-Z0-9]/g, "").trim()}.${
                    userNameExisting.count
                  }`;
                }
              } else {
                userName = `${firstName
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .trim()}.${lastName.replace(/[^a-zA-Z0-9]/g, "").trim()}.${
                  countUserName.count
                }`;
                let userNameExisting = await userDao.getByUserName(userName);
                if (userNameExisting.count !== "0") {
                  userName = `${firstName
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .trim()}.${lastName.replace(/[^a-zA-Z0-9]/g, "").trim()}.${
                    userNameExisting.count
                  }`;
                }
              }
              userRegistration = await userDao.add(
                firstName,
                lastName,
                null,
                null,
                emailId,
                phoneNumber,
                null,
                null,
                token,
                null,
                null,
                gender,
                dob,
                null,
                null,
                null,
                identity_docs,
                null,
                null,
                ["USR"],
                null,
                "IN",
                null,
                false,
                sports_interested,
                null,
                null,
                userName,
                null,
                null,
                transaction
              );

              let firebaseAccount = null;
              data = {
                user_email: emailId,
                password: "Skiya@123",
              };

              firebaseAccount = await axios.post(
                `${process.env.MIDDLEWARE_API_URL}/api/users/signUp`,
                data,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                }
              );

              let regEmail = null;
              regEmail = mailService.playerRegisterationMail(
                emailId,
                name,
                eventName.event_name
              );

              let participant_full_name = name;
              let participated_event_name = eventName.event_name;
              let participated_event_startdate = eventName.event_startdate;
              let participated_event_virtual_venue_url =
                eventName.virtual_venue_url;
              /* let participated_event_venue = tournamentCategoryVenueName; */
              let participated_event_venue =
                participated_event_virtual_venue_url
                  ? participated_event_virtual_venue_url
                  : tournamentCategoryVenueName;
              let participantEmailId = emailId;

              let participantRegistrationMail =
                mailService.participantRegistrationMail(
                  participant_full_name,
                  participated_event_name,
                  participated_event_startdate,
                  participated_event_venue,
                  participantEmailId
                );

              // let companyTeamPlayer = await companyTeamPlayerDao.add(
              //   userRegistration?.user_id,
              //   company.company_id,
              //   "AC",
              //   transaction
              // );
              // team["company_team_player"] = companyTeamPlayer;

              tournamentPlayerCount =
                await teamPlayerRegistrationDao.getPlayerandTournCatIdComboCount(
                  tournament_category_id,
                  userRegistration?.user_id,
                  transaction
                );

              if (tournamentPlayerCount?.count === "0") {
                if (player_type === "Doubles") {
                  teamPlayerRegistration = await teamPlayerRegistrationDao.add(
                    tournament_player_reg_id.tournament_player_reg_id + 1,
                    userRegistration?.user_id,
                    currentDate,
                    null,
                    null,
                    tournament_category_id,
                    tournamentCat.tournament_refid,
                    preferencesOpted,
                    transaction
                  );
                } else {
                  teamPlayerRegistration = await teamPlayerRegistrationDao.add(
                    tournamentPlayerIdIncrement,
                    userRegistration?.user_id,
                    currentDate,
                    null,
                    null,
                    tournament_category_id,
                    tournamentCat.tournament_refid,
                    preferencesOpted,
                    transaction
                  );

                  let EventOrganizerEmailDetails =
                    await tournamentCategoryDao.getEventOrganizerDetails(
                      tournament_category_id,
                      userRegistration?.user_id,
                      "player",
                      transaction
                    );

                  let page_name =
                    EventOrganizerEmailDetails?.event_owner_page_name;
                  let event_name = EventOrganizerEmailDetails?.event_name;
                  let participant_name = participant_full_name;
                  let tournament_category =
                    EventOrganizerEmailDetails?.tournament_category;
                  let sports_name = EventOrganizerEmailDetails?.sports_name;
                  let sports_category =
                    EventOrganizerEmailDetails?.sports_category;
                  let parent_page_email =
                    EventOrganizerEmailDetails?.company_email;
                  let pageOwnerEmail = EventOrganizerEmailDetails?.user_email;
                  let contact_number = userRegistration?.user_phone;
                  let contact_email = userRegistration?.user_email;
                  let eventOwnerName =
                    EventOrganizerEmailDetails?.event_owner_user_name;
                  let eventOwnerUserEmail =
                    EventOrganizerEmailDetails?.event_owner_user_email;

                  let organizerEmail =
                    await mailService.organizerMailOnTeamRegistration(
                      page_name,
                      event_name,
                      participant_name,
                      tournament_category,
                      sports_name,
                      sports_category,
                      null,
                      null,
                      parent_page_email,
                      pageOwnerEmail,
                      contact_number,
                      contact_email,
                      eventOwnerUserEmail,
                      eventOwnerName,
                      null,
                      null,
                      "player"
                    );
                }
              } else {
                if (player_type === "Doubles") {
                  let result = {
                    message: "These players have already been registered",
                  };
                  return result;
                } else {
                  let result = {
                    message: "This player has already been registered",
                  };
                  return result;
                }
              }

              await activityLogDao.addActivityLog(
                "EVT",
                "REG",
                null,
                null,
                eventName.event_id,
                userRegistration?.user_id,
                null
              );
            } else {
              let welcomeEmail = null;
              updated_player[index] = {
                ...updated_player[index],
                player_id: registeredUser?.user_id,
              };

              /* welcomeEmail = mailService.playerRegistrationUpdationMail(
                emailId,
                name,
                eventName.event_name
              ); */

              // let companyTeamPlayer = await companyTeamPlayerDao.add(
              //   registeredUser?.user_id,
              //   company.company_id,
              //   "AC",
              //   transaction
              // );
              // team["company_team_player"] = companyTeamPlayer;
              tournamentPlayerCount =
                await teamPlayerRegistrationDao.getPlayerandTournCatIdComboCount(
                  tournament_category_id,
                  registeredUser?.user_id,
                  transaction
                );
              ///// this below condition is for singles ////

              if (tournamentPlayerCount?.count === "0") {
                if (player_type === "Doubles") {
                  teamPlayerRegistration = await teamPlayerRegistrationDao.add(
                    tournament_player_reg_id.tournament_player_reg_id + 1,
                    registeredUser?.user_id,
                    currentDate,
                    null,
                    null,
                    tournament_category_id,
                    tournamentCat.tournament_refid,
                    preferencesOpted,
                    transaction
                  );
                } else {
                  teamPlayerRegistration = await teamPlayerRegistrationDao.add(
                    tournamentPlayerIdIncrement,
                    registeredUser?.user_id,
                    currentDate,
                    null,
                    null,
                    tournament_category_id,
                    tournamentCat.tournament_refid,
                    preferencesOpted,
                    transaction
                  );
                }
                teamPlayerRegistrationValue.push(teamPlayerRegistration);

                let participant_full_name =
                  registeredUser?.first_name + " " + registeredUser?.last_name;
                let participated_event_name = eventName.event_name;
                let participated_event_startdate = eventName.event_startdate;
                /* let participated_event_venue = tournamentCategoryVenueName; */
                let participated_event_virtual_venue_url =
                  eventName.virtual_venue_url;
                let participated_event_venue =
                  participated_event_virtual_venue_url
                    ? participated_event_virtual_venue_url
                    : tournamentCategoryVenueName;
                let participantEmailId = registeredUser?.user_email;

                let participantRegistrationMail =
                  mailService.participantRegistrationMail(
                    participant_full_name,
                    participated_event_name,
                    participated_event_startdate,
                    participated_event_venue,
                    participantEmailId
                  );

                if (player_type !== "Doubles") {
                  let EventOrganizerEmailDetails =
                    await tournamentCategoryDao.getEventOrganizerDetails(
                      tournament_category_id,
                      registeredUser?.user_id,
                      "player",
                      transaction
                    );

                  let page_name =
                    EventOrganizerEmailDetails?.event_owner_page_name;
                  let event_name = EventOrganizerEmailDetails?.event_name;
                  let participant_name = participant_full_name;
                  let tournament_category =
                    EventOrganizerEmailDetails?.tournament_category;
                  let sports_name = EventOrganizerEmailDetails?.sports_name;
                  let sports_category =
                    EventOrganizerEmailDetails?.sports_category;
                  let parent_page_email =
                    EventOrganizerEmailDetails?.company_email;
                  let pageOwnerEmail = EventOrganizerEmailDetails?.user_email;
                  let contact_number = registeredUser?.user_phone;
                  let contact_email = registeredUser?.user_email;
                  let eventOwnerName =
                    EventOrganizerEmailDetails?.event_owner_user_name;
                  let eventOwnerUserEmail =
                    EventOrganizerEmailDetails?.event_owner_user_email;

                  let organizerEmail =
                    await mailService.organizerMailOnTeamRegistration(
                      page_name,
                      event_name,
                      participant_name,
                      tournament_category,
                      sports_name,
                      sports_category,
                      null,
                      null,
                      parent_page_email,
                      pageOwnerEmail,
                      contact_number,
                      contact_email,
                      eventOwnerUserEmail,
                      eventOwnerName,
                      null,
                      null,
                      "player"
                    );
                }
              } else {
                if (player_type === "Doubles") {
                  let result = {
                    message: "These players have already been registered",
                  };
                  return result;
                } else {
                  let result = {
                    message: "This player has already been registered",
                  };
                  return result;
                }
              }

              await activityLogDao.addActivityLog(
                "EVT",
                "REG",
                null,
                null,
                eventName.event_id,
                registeredUser?.user_id,
                null
              );
            }

            index = index + 1;
          }
        }

        if (tournamentPlayerCount?.count === "0" && player_type === "Doubles") {
          let EventOrganizerEmailDetails =
            await tournamentCategoryDao.getEventOrganizerDetails(
              tournament_category_id,
              1,
              "doubles",
              transaction
            );

          let firstPlayerName =
            players[0].first_name + " " + players[0].last_name;
          let secondPlayerName =
            players[1].first_name + " " + players[1].last_name;

          let participantName = firstPlayerName + " and " + secondPlayerName;

          let contactNumber01 = players[0].contact_number;
          let contactNumber02 = players[1].contact_number;

          let contactNumber = contactNumber01 + " and " + contactNumber02;

          let contactEmail01 = players[0].email_id;
          let contactEmail02 = players[1].email_id;

          let contactEmail = contactEmail01 + " and " + contactEmail02;

          let page_name = EventOrganizerEmailDetails?.event_owner_page_name;
          let event_name = EventOrganizerEmailDetails?.event_name;
          let participant_name = participantName;
          let tournament_category =
            EventOrganizerEmailDetails?.tournament_category;
          let sports_name = EventOrganizerEmailDetails?.sports_name;
          let sports_category = EventOrganizerEmailDetails?.sports_category;
          let parent_page_email = EventOrganizerEmailDetails?.company_email;
          let pageOwnerEmail = EventOrganizerEmailDetails?.user_email;
          let contact_number = contactNumber;
          let contact_email = contactEmail;
          let eventOwnerName =
            EventOrganizerEmailDetails?.event_owner_user_name;
          let eventOwnerUserEmail =
            EventOrganizerEmailDetails?.event_owner_user_email;

          let organizerEmail =
            await mailService.organizerMailOnTeamRegistration(
              page_name,
              event_name,
              participant_name,
              tournament_category,
              sports_name,
              sports_category,
              null,
              null,
              parent_page_email,
              pageOwnerEmail,
              contact_number,
              contact_email,
              eventOwnerUserEmail,
              eventOwnerName,
              null,
              null,
              "player"
            );
        }

        // userEmail = team_members?.map(async (e, index) => {
        //   let emailId = e.email_id;
        //   let firstName = e.first_name;
        //   let lastName = e.last_name;
        //   let name = firstName + " " + lastName;
        //   let registeredUser = await userDao.getByEmail(emailId, transaction);
        //   if (registeredUser === null) {
        //     let regEmail = null;
        //     regEmail = mailService.registerationMail(emailId, name);
        //   } else {
        //     let welcomeEmail = null;
        //     updated_team[index] = { ...updated_team[index], "player_id": registeredUser.user_id, }
        //     welcomeEmail = mailService.teamMemberMail(emailId, name);
        //   }
        // });

        if (updated_team?.length > 0) {
          teamsDao.updateTeamMember(
            JSON.stringify(updated_team),
            team.team_id,
            transaction
          );

          if (socket_request) {
            await notificationDao.add(
              user_id,
              null,
              company?.company_id,
              "C",
              null,
              transaction,
              undefined,
              null,
              null
            );

            // await notificationDao.addBulkEntry(feeds.feed_id, 'P', 'AR', admin_user, transaction)
            socket_request.emit(`${user_id}`, {
              message: "test notification",
              count: 100,
            });

            //This iteration to send the notification each team member
            updated_team.map((member) => {
              //TM means Team member
              if (member?.player_id !== "" && member?.player_id) {
                notificationDao.add(
                  member?.player_id,
                  null,
                  company?.company_id,
                  "C",
                  null,
                  transaction,
                  "TM",
                  null,
                  null
                );
                socket_request.emit(`${member?.player_id}`, {
                  message: "test notification",
                  count: 100,
                });
              }
            });
          }
        }

        // if (updated_player) {
        //   // teamsDao.updateTeamMember(
        //   //   JSON.stringify(updated_team),
        //   //   team.team_id,
        //   //   transaction
        //   // );

        //   if (socket_request) {
        //     await notificationDao.add(
        //       user_id,
        //       null,
        //       company?.company_id,
        //       "C",
        //       null,
        //       transaction
        //     );
        //     // await notificationDao.addBulkEntry(feeds.feed_id, 'P', 'AR', admin_user, transaction)
        //     socket_request.emit(`${user_id}`, {
        //       message: "test notification",
        //       count: 100,
        //     });

        //     //This iteration to send the notification each team member
        //     updated_player.map((member) => {
        //       //TM means Team member
        //       if (member?.player_id !== "" && member?.player_id) {
        //         notificationDao.add(
        //           member?.player_id,
        //           null,
        //           company?.company_id,
        //           "C",
        //           null,
        //           transaction,
        //           "TM"
        //         );
        //         socket_request.emit(`${member?.player_id}`, {
        //           message: "test notification",
        //           count: 100,
        //         });
        //       }
        //     });
        //   }
        // }
        if (company) {
          team["company"] = company;
        }
        if (updated_team?.length > 0) {
          team["team_members"] = updated_team;
        }
        if (companyTeamPlayerResponse?.length > 0) {
          team["company_team_player"] = companyTeamPlayerResponse;
        }
        if (team) {
          team["player_registration"] = teamPlayerRegistration;
          return team;
        } else if (teamPlayerRegistrationValue?.length > 0) {
          return teamPlayerRegistrationValue;
        }
      })
      .then((data) => {
        console.log("successfully data returned", data);
        return data;
      })
      .catch((error) => {
        console.log("failure, ROLLBACK was executed", error);
        throw error;
      });
    return result;
  } catch (error) {
    console.log("Error occurred in teamRegister: ", error);
    throw error;
  }
};

const createCompany = async (
  team_name,
  user_id,
  selected_team_id,
  page_category,
  tournament_category_id,
  type,
  connectionObj = null
) => {
  try {
    let company = null;
    let main_category_type = null;
    let company_type = null;
    let currentDate = new Date();
    // company = await companyDao.fetchCompanyByNameandUserId(team_name, user_id);
    // if (company === null) {
    if (page_category) {
      main_category_type = page_category;
      let getSubCatId = `select c3.category_id from category c3 where c3.parent_category_id =(${page_category}) and c3.category_type ='TEA'`;
      let subCat = await commonDao.customQueryExecutor(
        getSubCatId,
        connectionObj
      );
      company_type = [subCat[0].category_id];
    } else if (type === "Existing" && selected_team_id) {
      let ParentCompanyDetails = await companyDao.getById(
        selected_team_id,
        connectionObj
      );

      main_category_type = ParentCompanyDetails?.main_category_type;

      let getSubCatId = `select c3.category_id from category c3 where c3.parent_category_id =(${main_category_type}) and c3.category_type ='TEA'`;
      let subCat = await commonDao.customQueryExecutor(
        getSubCatId,
        connectionObj
      );
      company_type = [subCat[0].category_id];
    } else {
      let participantCategoryId =
        await tournamentCategoryDao.getParticipantCatByTournCatId(
          tournament_category_id,
          connectionObj
        );

      let categoryType = await categoryDao.getCategoryTypeById(
        participantCategoryId?.participant_category,
        connectionObj
      );

      let parentCategoryId =
        await categoryDao.getCategoryIdByParticipantCategoryType(
          categoryType?.category_type,
          connectionObj
        );

      main_category_type = parentCategoryId?.category_id;

      let getSubCatId = `select c3.category_id from category c3 where c3.parent_category_id =(${main_category_type}) and c3.category_type ='TEA'`;
      let subCat = await commonDao.customQueryExecutor(
        getSubCatId,
        connectionObj
      );
      company_type = [subCat[0].category_id];
    }

    let companyName = await companyDao.getCompanyNameCount(
      team_name,
      connectionObj
    );
    let companyPublicUrlName = "";

    if (companyName[0].count === "0") {
      companyPublicUrlName = team_name.replace(/[^a-zA-Z0-9]/g, "").trim();
    } else {
      companyPublicUrlName =
        team_name.replace(/[^a-zA-Z0-9]/g, "").trim() +
        "." +
        companyName[0].count;
    }

    company = await companyDao.add(
      team_name,
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
      selected_team_id,
      company_type,
      false,
      companyPublicUrlName,
      main_category_type,
      null,
      null,
      null,
      connectionObj
    );

    let role = "ADM";
    await companyUserDao.add(
      company.company_id,
      user_id,
      "p",
      role,
      currentDate,
      null,
      connectionObj
    );
    // }
    return company;
  } catch (error) {
    console.log("Error occurred in createCompany: ", error);
    throw error;
  }
};

/**
 * Method to getparticipated by tournament category id
 * @param {category_id} team_id
 */
const getParticipantByTournamentCatId = async (category_id) => {
  try {
    // let query = `select t.* as team,tpr.registration_date ,tpr.tournament_category_id ,tpr.tournamentid from tournament_player_registration tpr left join teams t on t.team_id =tpr.team_id where tpr.tournament_category_id =${category_id}`
    let query = `SELECT
    t.* AS team,
    row_to_json(t3.*)::jsonb AS company,
    tpr.registration_date,
    tpr.tournament_category_id,
    tpr.tournamentid,
    tpr.tournament_player_reg_id,
    u.* AS player_details,
    tpr.preferences_opted,
    CASE
      WHEN tpr.player_id IS NULL THEN jsonb_build_object('type', 'team')
      ELSE jsonb_build_object('type', 'Individual')
    END AS type
  FROM
    tournament_player_registration tpr
  LEFT JOIN teams t ON t.team_id = tpr.team_id
  LEFT JOIN users u ON u.user_id = tpr.player_id
  LEFT JOIN (
    SELECT
      c.*,
      t2.*,
      cat.category_name AS parent_category_name,
      cat.parent_category_id,
      cat.category_type AS parent_category_type
    FROM
      company c
    LEFT JOIN category cat ON cat.category_id = c.main_category_type
    LEFT JOIN (
      SELECT
        t1.company_id AS page_id,
        ARRAY_AGG(row_to_json(c3.*)) AS category_arr
      FROM
        (
          SELECT
            company_id,
            unnest(c.company_type) category_id
          FROM
            company c
        ) t1
      LEFT JOIN category c3 ON c3.category_id = t1.category_id
      GROUP BY
        t1.company_id
    ) t2 ON c.company_id = t2.page_id
  ) t3 ON t3.company_id = t.company_id
  WHERE
    tpr.tournament_category_id = ${category_id}`;
    let parentCat = await commonDao.customQueryExecutor(query);
    return parentCat;
  } catch (error) {
    console.log("Error occurred in fetch team", error);
    throw error;
  }
};

/**
 * Method to getparticipated by tournament category id
 * @param {company_id} company_id
 */
const getParticipantByCompanyId = async (company_id) => {
  try {
    // let query = `select t.* as team,tpr.registration_date ,tpr.tournament_category_id ,tpr.tournamentid from tournament_player_registration tpr left join teams t on t.team_id =tpr.team_id where tpr.tournament_category_id =${category_id}`
    let query = `select t.*, row_to_json(t3.*)::jsonb as company, tpr.registration_date , tpr.tournament_category_id , tpr.tournamentid from teams t left join ( select c.*, t2.*, cat.category_name as parent_category_name, cat.parent_category_id, cat.category_type as parent_category_type from company c left join category cat on cat.category_id = c.main_category_type left join ( select t1.company_id as page_id, ARRAY_AGG(row_to_json(c3.*)) as category_arr from ( select company_id, unnest(c.company_type) category_id from company c) t1 left join category c3 on c3.category_id = t1.category_id group by t1.company_id ) t2 on c.company_id = t2.page_id ) t3 on t3.company_id = t.company_id left join tournament_player_registration tpr on tpr.team_id =t.team_id where t.company_id = '${company_id}'`;
    let parentCat = await commonDao.customQueryExecutor(query);
    return parentCat;
  } catch (error) {
    console.log("Error occurred in fetch team", error);
    throw error;
  }
};

/**
 * Method to get team id based members
 * @param {team_id} team_id
 */
const getByTeamId = async (team_id) => {
  try {
    let query = `select t.team_id,member as detail,row_to_json(u.*) as user from teams t LEFT JOIN LATERAL json_array_elements (t.team_members :: json) member ON true left join users u on lower((member ->> 'email_id')) = lower(u.user_email) where t.team_id ='${team_id}'`;
    let parentCat = await commonDao.customQueryExecutor(query);
    return parentCat;
  } catch (error) {
    console.log("Error occurred in fetch team", error);
    throw error;
  }
};

/**
 * Method to create new Team
 * @param {JSON} body
 * @returns
 */
const createTeam = async (body) => {
  try {
    let result = null;
    let user = null;
    let company = null;
    const { team_members, team_captain = null, company_id } = body;

    if (team_captain !== null && team_captain !== undefined) {
      user = await userDao.getById(team_captain);
      if (user === null) {
        result = { message: "Team Captain Id Not Exists" };
        return result;
      }
    }

    if (company_id !== null && company_id !== undefined) {
      company = await companyDao.getById(company_id);
      if (company === null) {
        result = { message: "Company Id Not Exists" };
        return result;
      }
    }

    result = await teamsDao.add(team_members, team_captain, company_id);

    return result;
  } catch (error) {
    console.log("Error occurred in createTeam", error);
    throw error;
  }
};

/**
 * Method to update existing Team
 * @param {JSON} body
 * @returns
 */
const editTeam = async (body) => {
  try {
    let result = null;
    let user = null;
    let company = null;
    let team = null;
    const { team_members, team_captain = null, company_id, team_id } = body;

    if (team_id) {
      team = await teamsDao.getById(team_id);
      if (team === null) {
        return (result = { message: "Team Id Not Exists" });
      }
    }

    if (team_captain !== null && team_captain !== undefined) {
      user = await userDao.getById(team_captain);
      if (user === null) {
        result = { message: "Team Captain Id Not Exists" };
        return result;
      }
    }

    if (company_id !== null && company_id !== undefined) {
      company = await companyDao.getById(company_id);
      if (company === null) {
        result = { message: "Company Id Not Exists" };
        return result;
      }
    }

    result = await teamsDao.edit(
      team_members,
      team_captain,
      company_id,
      team_id
    );
    return result;
  } catch (error) {
    console.log("Error occurred in editTeam", error);
    throw error;
  }
};

/**
 * Method to get the Team based on Team Id
 * @param {uuid} team_id
 */
const fetchTeam = async (team_id) => {
  try {
    let team = {
      data: null,
    };
    let data = await teamsDao.getById(team_id);
    if (data === null) team = { message: "Team not exist" };
    else team["data"] = data;
    return team;
  } catch (error) {
    console.log("Error occurred in fetch team", error);
    throw error;
  }
};

/**
 * Method to check team name and event id combination
 * @param {string} name
 * @param {int} tournament_id
 */
const getByTeamNameandTournamentId = async (body) => {
  try {
    let { team_name, tournament_id } = body;
    let team = {
      data: null,
    };
    let data = await teamsDao.getByTeamNameandTournamentId(
      team_name,
      tournament_id
    );
    if (data === null)
      team = { message: "This Combination does not exist", status: false };
    else team = { message: "This combination already exists", status: true };

    return team;
  } catch (error) {
    console.log(
      "Error occurred in getByTeamNameandEventId team service",
      error
    );
    throw error;
  }
};

/**
 *  Method to delete the team based on team id
 * @param {uuid} team_id
 */
const deleteTeam = async (team_id) => {
  try {
    let team = {
      data: null,
    };
    let data = await teamsDao.deleteById(team_id);
    if (data === null) team = { message: "Team does not exist" };
    else team["data"] = "Deleted Successfully";
    return team;
  } catch (error) {
    console.log("Error occurred in delete team", error);
    throw error;
  }
};

/**
 *  Method to get all the teams
 */

const fetchAll = async () => {
  try {
    return await teamsDao.getAll();
  } catch (error) {
    console.log("Error occurred in fetchAll: ", error);
    throw error;
  }
};

/**
 * Method to create new Club Team
 * @param {JSON} body
 * @returns
 */
const createClubTeam = async (body) => {
  try {
    let result = null;
    let company = null;
    let companyStatistics = null;
    let clubTeam = null;
    const { categorywise_statistics, parent_company_id } = body;

    let companyUser = await companyUserDao.getByCompanyId(parent_company_id);

    let user = companyUser[0]?.user_id;
    let role = "ADM";
    let currentDate = new Date();

    if (parent_company_id !== null && parent_company_id !== undefined) {
      company = await companyDao.getById(parent_company_id);

      if (company === null) {
        result = { message: "Parent Company Id Not Exists" };
        return result;
      }
    }
    result = await db
      .tx(async (transaction) => {
        let followerUser =
          await followerDao.getFollowerUserByFollowingCompanyId(
            parent_company_id,
            transaction
          );
        if (categorywise_statistics?.team_name) {
          let companyName = await companyDao.getCompanyNameCount(
            categorywise_statistics?.team_name,
            transaction
          );

          let sports_interest = categorywise_statistics?.sports_id;

          let parent_category_id = company?.main_category_type;

          // let getParentTeamCatId = `select c.category_id from category c where c.parent_category_id =435 and c.category_type ='TEA'`;
          let getChildTeamCatId = `select c.category_id from category c where c.parent_category_id =${parent_category_id} and c.category_type ='TEA'`;
          // let parentCat = await commonDao.customQueryExecutor(
          //   getParentTeamCatId,
          //   transaction
          // );
          let subCat = await commonDao.customQueryExecutor(
            getChildTeamCatId,
            transaction
          );
          let company_type = [subCat[0].category_id];
          // let main_category_type = parentCat[0].category_id;
          let main_category_type = parent_category_id;

          let companyPublicUrlName = "";

          if (companyName[0].count === "0") {
            companyPublicUrlName = categorywise_statistics?.team_name
              .replace(/[^a-zA-Z0-9]/g, "")
              .trim();
          } else {
            companyPublicUrlName =
              categorywise_statistics?.team_name
                .replace(/[^a-zA-Z0-9]/g, "")
                .trim() +
              "." +
              companyName[0].count;
          }

          clubTeam = await companyDao.add(
            categorywise_statistics?.team_name,
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
            parent_company_id,
            company_type,
            false,
            companyPublicUrlName,
            main_category_type,
            null,
            null,
            null,
            transaction
          );

          let team_id = clubTeam?.company_id;

          if (followerUser?.follower_userid !== null) {
            for await (let user of followerUser?.follower_userid) {
              if (user !== null) {
                let teamFollowerBody = {
                  follower_userid: user,
                  follower_companyid: null,
                  following_companyid: team_id,
                  following_userid: null,
                  followed_from: currentDate,
                  following_event_id: null,
                };

                await followerService.createFollower(
                  teamFollowerBody,
                  transaction
                );
              }
            }
          }

          await companyUserDao.add(
            clubTeam?.company_id,
            user,
            "p",
            role,
            currentDate,
            null,
            transaction
          );

          let teamFollowerBody = {
            follower_userid: null,
            follower_companyid: parent_company_id,
            following_companyid: team_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(teamFollowerBody, transaction);

          clubTeam["parent-page-details"] = company;

          companyStatistics = await companyStatisticsDao.add(
            clubTeam?.company_id,
            categorywise_statistics,
            null,
            null,
            transaction
          );

          let companySportsResponse = [];
          let companySports = await companySportDao.add(
            clubTeam?.company_id,
            sports_interest,
            (is_delete = false),
            transaction
          );
          companySportsResponse.push(companySports);

          clubTeam["company_sport_details"] = companySportsResponse;

          clubTeam["club-team-statistics"] = companyStatistics;
          return clubTeam;
        }

        if (categorywise_statistics?.venue_name) {
          let parent_category_id = company?.main_category_type;

          let companyName = await companyDao.getCompanyNameCount(
            categorywise_statistics?.venue_name,
            transaction
          );

          let getChildVenueCatId = `select c.category_id from category c where c.parent_category_id =${parent_category_id} and c.category_type ='VEN'`;

          // let parentCat = await commonDao.customQueryExecutor(
          //   getParentVenueCatId,
          //   transaction
          // );
          let subCat = await commonDao.customQueryExecutor(
            getChildVenueCatId,
            transaction
          );
          let company_type = [subCat[0].category_id];
          let main_category_type = parent_category_id;

          let companyPublicUrlName = "";

          if (companyName[0].count === "0") {
            companyPublicUrlName = categorywise_statistics?.venue_name
              .replace(/[^a-zA-Z0-9]/g, "")
              .trim();
          } else {
            companyPublicUrlName =
              categorywise_statistics?.venue_name
                .replace(/[^a-zA-Z0-9]/g, "")
                .trim() +
              "." +
              companyName[0].count;
          }

          let companySportsResponse = [];

          let venue = await companyDao.add(
            categorywise_statistics?.venue_name,
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
            parent_company_id,
            company_type,
            false,
            companyPublicUrlName,
            main_category_type,
            null,
            null,
            null,
            transaction
          );

          await companyUserDao.add(
            venue?.company_id,
            user,
            "p",
            role,
            currentDate,
            null,
            transaction
          );
          let venue_id = venue?.company_id;

          if (followerUser?.follower_userid !== null) {
            for await (let user of followerUser?.follower_userid) {
              if (user !== null) {
                let teamFollowerBody = {
                  follower_userid: user,
                  follower_companyid: null,
                  following_companyid: venue_id,
                  following_userid: null,
                  followed_from: currentDate,
                  following_event_id: null,
                };

                await followerService.createFollower(
                  teamFollowerBody,
                  transaction
                );
              }
            }
          }

          let venueFollowerBody = {
            follower_userid: null,
            follower_companyid: parent_company_id,
            following_companyid: venue_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(venueFollowerBody, transaction);

          venue["parent-page-details"] = company;

          // companyStatistics = await companyStatisticsDao.add(
          //   venue?.company_id,
          //   categorywise_statistics,
          //   null,
          //   null,
          //   transaction
          // );

          let sports_interest = categorywise_statistics?.sports_interest;

          if (sports_interest && sports_interest.length > 0) {
            let SportLength = sports_interest.length;
            for (let i = 0; i < SportLength; i++) {
              let companySports = await companySportDao.add(
                venue?.company_id,
                sports_interest[i],
                (is_delete = false),
                transaction
              );
              companySportsResponse.push(companySports);
              // venue["venue-details"] = companySports;
            }
          }

          venue["venue-details"] = companySportsResponse;
          return venue;
        }

        if (categorywise_statistics?.academy_name) {
          let parent_category_id = company?.main_category_type;

          let companyName = await companyDao.getCompanyNameCount(
            categorywise_statistics?.academy_name,
            transaction
          );

          let getChildAcademyCatId = `select c.category_id from category c where c.parent_category_id =${parent_category_id} and c.category_type ='ACD'`;

          // let parentCat = await commonDao.customQueryExecutor(
          //   getParentAcademyCatId,
          //   transaction
          // );
          let subCat = await commonDao.customQueryExecutor(
            getChildAcademyCatId,
            transaction
          );
          let company_type = [subCat[0].category_id];
          let main_category_type = parent_category_id;

          let companyPublicUrlName = "";

          if (companyName[0].count === "0") {
            companyPublicUrlName = categorywise_statistics?.academy_name
              .replace(/[^a-zA-Z0-9]/g, "")
              .trim();
          } else {
            companyPublicUrlName =
              categorywise_statistics?.academy_name
                .replace(/[^a-zA-Z0-9]/g, "")
                .trim() +
              "." +
              companyName[0].count;
          }

          let companySportsResponse = [];

          let academy = await companyDao.add(
            categorywise_statistics?.academy_name,
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
            parent_company_id,
            company_type,
            false,
            companyPublicUrlName,
            main_category_type,
            null,
            null,
            null,
            transaction
          );

          await companyUserDao.add(
            academy?.company_id,
            user,
            "p",
            role,
            currentDate,
            null,
            transaction
          );

          let academy_id = academy?.company_id;

          if (followerUser?.follower_userid !== null) {
            for await (let user of followerUser?.follower_userid) {
              if (user !== null) {
                let teamFollowerBody = {
                  follower_userid: user,
                  follower_companyid: null,
                  following_companyid: academy_id,
                  following_userid: null,
                  followed_from: currentDate,
                  following_event_id: null,
                };

                await followerService.createFollower(
                  teamFollowerBody,
                  transaction
                );
              }
            }
          }

          let academyFollowerBody = {
            follower_userid: null,
            follower_companyid: parent_company_id,
            following_companyid: academy_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(
            academyFollowerBody,
            transaction
          );

          academy["parent-page-details"] = company;

          // companyStatistics = await companyStatisticsDao.add(
          //   academy?.company_id,
          //   categorywise_statistics,
          //   null,
          //   null,
          //   transaction
          // );

          let sports_interest = categorywise_statistics?.sports_interest;

          if (sports_interest && sports_interest.length > 0) {
            let SportLength = sports_interest.length;
            for (let i = 0; i < SportLength; i++) {
              let companySports = await companySportDao.add(
                academy?.company_id,
                sports_interest[i],
                (is_delete = false),
                transaction
              );
              companySportsResponse.push(companySports);
            }
          }

          academy["academy-details"] = companySportsResponse;
          return academy;
        }
      })
      .then((data) => {
        console.log("successfully data returned", data.company_id);
        return data;
      })
      .catch((error) => {
        console.log("failure, ROLLBACK was executed", error);
        throw error;
      });
    return result;
  } catch (error) {
    console.log("Error occurred in createTeam", error);
    throw error;
  }
};

/**
 * Method to create new Third Party Venue
 * @param {JSON} body
 * @returns
 */
const createThirdPartyVenue = async (body) => {
  try {
    let result = [];

    const venueDetails = body;

    if (venueDetails?.length > 0) {
      for await (let venue of venueDetails) {
        let venue_name = venue?.venue_name;
        let address = venue?.address;
        let currentDate = new Date();
        let role = "ADM";

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
          parentVenueCategoryIdQuery
        );

        let subVenCat = await commonDao.customQueryExecutor(
          subCatQueryForVenue
        );
        let ven_main_category_type_id = parentVenCat[0].category_id;
        let ven_sub_category_id = subVenCat[0].category_id;

        let sportsIdQuery = `select s.sports_id  from sports s where s.sports_name ilike 'General Sports'`;

        let sportsId = await commonDao.customQueryExecutor(sportsIdQuery);

        let venue_sports_interest = [sportsId[0].sports_id];

        if (venue_name) {
          let user_id = process.env.KRIDAS_USER_ID;

          companyName = await companyDao.getCompanyNameCount(venue_name);
          let companyPublicUrlName = null;
          if (companyName[0].count === "0") {
            companyPublicUrlName = venue_name
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
              venue_name.replace(/[^a-zA-Z0-9]/g, "").trim() +
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

          let parentVenue = await companyDao.add(
            venue_name,
            null,
            null,
            null,
            null,
            null,
            "",
            null,
            null,
            null,
            address,
            "[]",
            null,
            null,
            [ven_sub_category_id],
            false,
            companyPublicUrlName,
            ven_main_category_type_id,
            null,
            null,
            null
          );

          result.push(parentVenue);

          let userFollowOwnCompanyBody = {
            follower_userid: user_id,
            follower_companyid: null,
            following_companyid: parentVenue?.company_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(userFollowOwnCompanyBody);

          await companyUserDao.add(
            parentVenue?.company_id,
            user_id,
            "p",
            role,
            currentDate,
            null
          );

          if (venue_sports_interest && venue_sports_interest.length > 0) {
            let companySportsResponse = [];
            let companySports = await CompanySports.add(
              parentVenue?.company_id,
              venue_sports_interest[0],
              (is_delete = false)
            );
            companySportsResponse.push(companySports);
          }

          let companyPublicURLNameExisting =
            await companyDao.getByCompanyPublicURLName(companyPublicUrlName);

          let companyPublicUrlNameNew =
            companyPublicUrlName + "." + companyPublicURLNameExisting?.count;

          let childVenue = await companyDao.add(
            venue_name,
            null,
            null,
            null,
            null,
            null,
            "",
            null,
            null,
            null,
            address,
            "[]",
            null,
            parentVenue?.company_id,
            [ven_sub_category_id],
            false,
            companyPublicUrlNameNew,
            ven_main_category_type_id,
            null,
            null,
            null
          );

          result.push(childVenue);

          await companyUserDao.add(
            childVenue?.company_id,
            user_id,
            "p",
            role,
            currentDate,
            null
          );

          if (venue_sports_interest && venue_sports_interest.length > 0) {
            let companySportsResponse = [];
            let companySports = await CompanySports.add(
              childVenue?.company_id,
              venue_sports_interest[0],
              (is_delete = false)
            );
            companySportsResponse.push(companySports);
          }

          let venue_id = childVenue?.company_id;

          let venueFollowerBody = {
            follower_userid: null,
            follower_companyid: parentVenue?.company_id,
            following_companyid: venue_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(venueFollowerBody);

          let userFollowOwnCompanyBodyforChildVenue = {
            follower_userid: user_id,
            follower_companyid: null,
            following_companyid: venue_id,
            following_userid: null,
            followed_from: currentDate,
            following_event_id: null,
          };

          await followerService.createFollower(
            userFollowOwnCompanyBodyforChildVenue
          );

          // await activityLogDao.add(
          //   "PAGE",
          //   "CREATE",
          //   null,
          //   parentVenue?.company_id,
          //   null,
          //   null,
          //   "C",
          //   null
          // );

          await activityLogDao.addActivityLog(
            "PAG",
            "CRE",
            null,
            null,
            parentVenue?.company_id,
            user_id,
            null
          );

          // await activityLogDao.add(
          //   "PAGE",
          //   "CREATE",
          //   null,
          //   venue_id,
          //   null,
          //   null,
          //   "C",
          //   null
          // );

          await activityLogDao.addActivityLog(
            "PAG",
            "CRE",
            null,
            null,
            venue_id,
            user_id,
            null
          );
        }
      }
    }
    return result;
  } catch (error) {
    console.log("Error occurred in createThirdPartyVenue", error);
    throw error;
  }
};

/**
 * Method to create new brand product
 * @param {JSON} body
 * @returns
 */
const createBrandProduct = async (body) => {
  try {
    let result = [];

    const { company_name, sport_ids = [] } = body;

    let companies = await companyDao.fetchCompaniesByName(company_name);

    if (companies != null && companies.length > 0) {
      result = companies;
    } else {
      let venue_name = company_name;
      let address = null;
      let currentDate = new Date();
      let role = "ADM";

      let parentVenueCategoryIdQuery = `select
      category_id
    from
      category c2
    where
      c2.category_type = 'CMP'
      and c2.parent_category_id =(
      select
        c3.category_id
      from
        category c3
      where
        c3.category_type = 'CAT')`;

      let subCatQueryForVenue = `select
      category_id
    from
      category c
    where
      c.category_type = 'PRD'
      and c.parent_category_id =(
      select
        category_id
      from
        category c2
      where
        c2.category_type = 'CMP'
        and c2.parent_category_id =(
        select
          category_id
        from
          category c4
        where
          c4.category_type = 'CAT'))`;

      let parentVenCat = await commonDao.customQueryExecutor(
        parentVenueCategoryIdQuery
      );

      let subVenCat = await commonDao.customQueryExecutor(subCatQueryForVenue);
      let ven_main_category_type_id = parentVenCat[0].category_id;
      let ven_sub_category_id = subVenCat[0].category_id;

      let sportsIdQuery = `select s.sports_id  from sports s where s.sports_name ilike 'General Sports'`;

      let sportsId = await commonDao.customQueryExecutor(sportsIdQuery);

      // let venue_sports_interest = [sportsId[0].sports_id];

      let venue_sports_interest = sport_ids;

      if (venue_name) {
        let user_id = process.env.KRIDAS_USER_ID;

        companyName = await companyDao.getCompanyNameCount(venue_name);
        let companyPublicUrlName = null;
        if (companyName[0].count === "0") {
          companyPublicUrlName = venue_name.replace(/[^a-zA-Z0-9]/g, "").trim();
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
            venue_name.replace(/[^a-zA-Z0-9]/g, "").trim() +
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

        let parentVenue = await companyDao.add(
          venue_name,
          null,
          null,
          null,
          null,
          null,
          "",
          null,
          null,
          null,
          address,
          "[]",
          null,
          null,
          [ven_sub_category_id],
          false,
          companyPublicUrlName,
          ven_main_category_type_id,
          null,
          null,
          null
        );

        result.push(parentVenue);

        let userFollowOwnCompanyBody = {
          follower_userid: user_id,
          follower_companyid: null,
          following_companyid: parentVenue?.company_id,
          following_userid: null,
          followed_from: currentDate,
          following_event_id: null,
        };

        await followerService.createFollower(userFollowOwnCompanyBody);

        await companyUserDao.add(
          parentVenue?.company_id,
          user_id,
          "p",
          role,
          currentDate,
          null
        );

        if (venue_sports_interest && venue_sports_interest.length > 0) {
          let companySportsResponse = [];
          for await (let id of venue_sports_interest) {
            let companySports = await CompanySports.add(
              parentVenue?.company_id,
              id,
              (is_delete = false)
            );
            companySportsResponse.push(companySports);
          }
        }
      }
    }
    return result;
  } catch (error) {
    console.log("Error occurred in create brnad product", error);
    throw error;
  }
};

/**
 * Method to validate team register
 * @param {json} body
 */
const teamRegisterValidation = async (body) => {
  try {
    const {
      tournament_category_id,
      team_name,
      team_members = [],
      user_id,
      selected_team_id,
      page_category,
      new_team_name,
      players = [],
      socket_request = null,
      player_type,
      parent_company_id,
    } = body;
    let tournamentPlayerCount = null;

    if (team_name) {
      let teamNameExisting =
        await teamPlayerRegistrationDao.getTeamNameExistingByTournCatId(
          team_name,
          tournament_category_id
        );

      if (teamNameExisting?.length !== 0) {
        let result = {
          message: "This Event Team Name already exists",
        };
        return result;
      }
    } else if (players?.length > 0) {
      for await (let e of players) {
        let emailId = e.email_id;
        let firstName = e.first_name;
        let lastName = e.last_name;
        let phoneNumber = e.contact_number;
        let name = firstName + " " + lastName;
        let gender = e.gender;
        let dob = e.dob;
        let registeredUser = await userDao.getByEmail(emailId);
        if (registeredUser) {
          tournamentPlayerCount =
            await teamPlayerRegistrationDao.getPlayerandTournCatIdComboCount(
              tournament_category_id,
              registeredUser?.user_id
            );

          if (tournamentPlayerCount?.count !== "0") {
            if (player_type === "Doubles") {
              let result = {
                message: "These players have already been registered",
              };
              return result;
            } else {
              let result = {
                message: "This player has already been registered",
              };
              return result;
            }
          }
        }
      }
    } else {
      let result = {
        message: "Please enter team name or player details to validate",
      };
      return result;
    }
  } catch (error) {
    console.log("Error occurred in teamRegisterValidation", error);
    throw error;
  }
};

const fetchPreferencesOpted = async (tournament_category_id) => {
  try {
    let query = `SELECT * FROM tournament_player_registration tpr WHERE tpr.tournament_category_id = ${tournament_category_id};`;
    let lookUpQueryForSize = `SELECT * FROM lookup_table lt WHERE lt.lookup_type = 'ASZ'`;
    let data = await commonDao.customQueryExecutor(query);
    let lookUpPreferancesForSize = await commonDao.customQueryExecutor(
      lookUpQueryForSize
    );
    let preferance;

    if (data[0].player_id !== null) {
      let querySingles = `SELECT tc.preferences_offered, tpr.preferences_opted
        FROM tournament_categories AS tc
        LEFT JOIN tournament_player_registration AS tpr ON tc.tournament_category_id = tpr.tournament_category_id
        WHERE tc.tournament_category_id = ${tournament_category_id};`;
      preferance = await teamsDao.getPreferencesOpted(querySingles);
    } else {
      let queryTeam = `SELECT tpr.*, t.*, ctp.*
        FROM tournament_player_registration tpr
        LEFT JOIN teams t ON t.team_id = tpr.team_id
        LEFT JOIN company_team_players ctp ON ctp.company_id = t.company_id
        WHERE tpr.tournament_category_id = ${tournament_category_id};`;
      preferance = await teamsDao.getPreferencesOpted(queryTeam);
    }

    let sizes = lookUpPreferancesForSize.map((item) => item.lookup_key); // Add other sizes here

    let preferences = {
      apparel_preferences: {},
      food_preferences: {
        VEG: 0,
        NVG: 0,
      },
    };

    preferance.forEach((player) => {
      if (player.preferences_opted !== null) {
        const { food_preference, apparel_preference } =
          player.preferences_opted;
        if (food_preference) {
          // Increment count for veg or NVG only
          if (food_preference === "VEG" || food_preference === "NVG") {
            preferences.food_preferences[food_preference] =
              (preferences.food_preferences[food_preference] || 0) + 1;
          }
        }
        if (apparel_preference) {
          Object.entries(apparel_preference).forEach(
            ([apparelType, { size }]) => {
              if (size) {
                preferences.apparel_preferences[apparelType] =
                  preferences.apparel_preferences[apparelType] || {};
                sizes.forEach((size) => {
                  preferences.apparel_preferences[apparelType][size] =
                    (preferences.apparel_preferences[apparelType][size] || 0) +
                    0; // Set the initial count to 0
                });
                preferences.apparel_preferences[apparelType][size] =
                  (preferences.apparel_preferences[apparelType][size] || 0) + 1;
              }
            }
          );
        }
      }
    });

    if (
      preferences.food_preferences.VEG === 0 &&
      preferences.food_preferences.NVG === 0
    ) {
      preferences.food_preferences = {};
    }
    return preferences;
  } catch (error) {
    console.log("Error occurred in fetchPreferencesOpted", error);
    throw error;
  }
};

const fetchPreferencesDetails = async (body) => {
  try {
    const { tournament_category_id, apparel_preference, food_preference } =
      body;
    let query = `SELECT * FROM tournament_player_registration tpr WHERE tpr.tournament_category_id = ${tournament_category_id};`;
    let data = await commonDao.customQueryExecutor(query);
    let preferences = [];

    if (data[0].player_id !== null) {
      let querySingles = `SELECT tpr.preferences_opted, u.first_name, u.last_name
        FROM tournament_player_registration tpr
        LEFT JOIN users u ON tpr.player_id = u.user_id
        WHERE tpr.tournament_category_id = ${tournament_category_id};`;
      preferences = await teamsDao.getPreferencesDetails(querySingles);
    } else {
      let queryTeam = `SELECT ctp.preferences_opted, u.first_name, u.last_name
        FROM tournament_player_registration tpr
        LEFT JOIN teams t ON t.team_id = tpr.team_id
        LEFT JOIN company_team_players ctp ON ctp.company_id = t.company_id
        LEFT JOIN users u ON u.user_id = ctp.user_id
        WHERE tpr.tournament_category_id = ${tournament_category_id}`;
      preferences = await teamsDao.getPreferencesDetails(queryTeam);
    }

    if (apparel_preference && Object.keys(apparel_preference).length !== 0) {
      preferences = preferences.filter((preference) => {
        let filtered = true;
        for (const [apparelKey, apparelValue] of Object.entries(
          apparel_preference
        )) {
          if (
            apparelValue &&
            preference.preferences_opted?.apparel_preference[apparelKey]
              .size !== apparelValue
          ) {
            filtered = false;
            break;
          }
        }
        return filtered;
      });
    }

    if (food_preference) {
      preferences = preferences.filter(
        (preference) =>
          preference.preferences_opted?.food_preference === food_preference
      );
    }

    return preferences;
  } catch (error) {
    console.log("Error occurred in fetchPreferencesDetails", error);
    throw error;
  }
};

module.exports = {
  createTeam,
  editTeam,
  fetchTeam,
  deleteTeam,
  fetchAll,
  teamRegister,
  getParticipantByTournamentCatId,
  getByTeamNameandTournamentId,
  getParticipantByCompanyId,
  getByTeamId,
  createClubTeam,
  createThirdPartyVenue,
  createBrandProduct,
  teamRegisterValidation,
  fetchPreferencesOpted,
  fetchPreferencesDetails,
};
