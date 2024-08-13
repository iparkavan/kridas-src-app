const express = require('express');
const lookupType = require('../v1/lookupType.route');
const lookupTable = require('../v1/lookupTable.route');
const country = require('../v1/country.route');
const sports = require('../v1/sport.route');
const category = require('../v1/category.route');
const company = require('../v1/company.route');
const user = require('../v1/user.route');
const companyUser = require('../v1/companyUser.route');
const userStatistics = require('../v1/userStatistics.route');
const companyStatistics = require('../v1/companyStatistics.route');
const profileVerification = require('../v1/profileVerification.route');
const feeds = require('../v1/feeds.route');
const sponsorInfo = require('../v1/sponsorInfo.route');
const commentInfo = require('../v1/commentInfo.route');
const sponserRequestorDeal = require('../v1/sponsorRequestorDeal.route');
const like = require('../v1/like.route');
const follower = require('../v1/follower.route');
const feedTag = require('../v1/feedTag.route');
const upload = require('../v1/upload.route');
const hashtags = require('../v1/hashtags.route');
const hashTagFeeds = require('../v1/hashTagFeeds.route');
const dashboard = require('../v1/dashboard.route');
const galleryMedia = require('../v1/galleryMedia.route');
const gallery = require('../v1/gallery.route');
const feedMedia = require('../v1/feedMedia.route');
const preRegister = require('../v1/preRegister.route');
const media = require('../v1/media.route');
const companySponsorInfo = require('../v1/companySponsorInfo.route');
const article = require('../v1/articles.route');
const event = require('../v1/events.route');
const tournament = require('../v1/tournament.route');
const mediaLikes = require('../v1/mediaLikes.routes');
const mediaCommentInfo = require('../v1/mediaCommentInfo.route');
const eventMaster = require('../v1/eventMaster.route');
const evenyOrganizer = require('../v1/eventOrganizer.route');
const organizer = require('../v1/organizer.route');
const tournamentCategories = require('../v1/tournamentCategories.route');
const feedShare = require('../v1/feedShare.route');
const sportsHashtag = require('../v1/sportHashtag.route');
const userHashtagFollow = require('./userHashtagFollow.route');
const notification = require('../v1/notification.route');
const activityLog = require('../v1/activityLog.route');
const teams = require('../v1/teams.route');
const tournamentPlayerRegistration = require('../v1/tournamentPlayerRegistration.route');
const advertisement = require('../v1/advertisement.route');
const eventSponsor = require('../v1/eventSponsor.route');
const sponsor = require('../v1/sponsor.route');
const commentTag = require('../v1/commentTag.route');
const galleryImage = require('../v1/galleryImage.route');
const languages = require('../v1/languages.route');
const productCategory = require('../v1/productCategory.route');
const companySponsorType = require('../v1/companySponsorType.route');
const companySponsor = require('../v1/companySponsor.route');
const eventSponsorType = require('../v1/eventSponsorType.route');
const companyTeamPlayer = require('../v1/companyTeamPlayers.route');
const payment = require('../v1/payment.route');
const eventFixtures = require('../v1/eventFixtures.route');
const userDeviceToken = require('../v1/userDeviceToken.route');
const accountDeletionRequest = require('../v1/accountDeletionRequest.router');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/lookup-type',
    route: lookupType,
  },
  {
    path: '/lookup-table',
    route: lookupTable,
  },
  {
    path: '/country',
    route: country,
  },
  {
    path: '/sports',
    route: sports,
  },
  {
    path: '/category',
    route: category,
  },
  {
    path: '/company',
    route: company,
  },
  {
    path: '/users',
    route: user,
  },
  {
    path: '/company-user',
    route: companyUser,
  },
  {
    path: '/users/statistics',
    route: userStatistics,
  },
  {
    path: '/company/statistics',
    route: companyStatistics,
  },
  {
    path: '/profile-verification',
    route: profileVerification,
  },
  {
    path: '/feeds',
    route: feeds,
  },
  {
    path: '/sponsor_info',
    route: sponsorInfo,
  },
  {
    path: '/comment-info',
    route: commentInfo,
  },
  {
    path: '/sponsor-requestor-deals',
    route: sponserRequestorDeal,
  },
  {
    path: '/like',
    route: like,
  },
  {
    path: '/follower',
    route: follower,
  },
  {
    path: '/feed-tag',
    route: feedTag,
  },
  {
    path: '/cloudinary',
    route: upload,
  },
  {
    path: '/hash-tag',
    route: hashtags,
  },

  {
    path: '/hash-tag-feeds',
    route: hashTagFeeds,
  },
  {
    path: '/dashboard',
    route: dashboard,
  },
  {
    path: '/gallery-media',
    route: galleryMedia,
  },
  {
    path: '/gallery',
    route: gallery,
  },
  {
    path: '/feed-media',
    route: feedMedia,
  },
  {
    path: '/pre-register',
    route: preRegister,
  },
  {
    path: '/media',
    route: media,
  },
  {
    path: '/company-sponsor-info',
    route: companySponsorInfo,
  },
  {
    path: '/articles',
    route: article,
  },
  {
    path: '/events',
    route: event,
  },
  {
    path: '/tournaments',
    route: tournament,
  },
  {
    path: '/media-likes',
    route: mediaLikes,
  },
  {
    path: '/media/comment-info',
    route: mediaCommentInfo,
  },
  {
    path: '/event-master',
    route: eventMaster,
  },
  {
    path: '/event-organizer',
    route: evenyOrganizer,
  },
  {
    path: '/organizer',
    route: organizer,
  },
  {
    path: '/tournament-categories',
    route: tournamentCategories,
  },
  {
    path: '/feed-share',
    route: feedShare,
  },
  {
    path: '/sports-hashtag',
    route: sportsHashtag,
  },
  {
    path: '/user-hashtag-follow',
    route: userHashtagFollow,
  },
  {
    path: '/notification',
    route: notification,
  },
  {
    path: '/activity-log',
    route: activityLog,
  },
  {
    path: '/teams',
    route: teams,
  },
  {
    path: '/tournamentPlayerRegistration',
    route: tournamentPlayerRegistration,
  },
  {
    path: '/advertisement',
    route: advertisement,
  },
  {
    path: '/event-sponsor',
    route: eventSponsor,
  },
  {
    path: '/sponsor',
    route: sponsor,
  },
  {
    path: '/comment-tag',
    route: commentTag,
  },
  {
    path: '/gallery-image',
    route: galleryImage,
  },
  {
    path: '/languages',
    route: languages,
  },
  {
    path: '/product-category',
    route: productCategory,
  },
  {
    path: '/company-sponsor-type',
    route: companySponsorType,
  },
  {
    path: '/company-sponsor',
    route: companySponsor,
  },
  {
    path: '/event-sponsor-type',
    route: eventSponsorType,
  },
  {
    path: '/company-team-player',
    route: companyTeamPlayer,
  },
  {
    path: '/payment',
    route: payment,
  },
  {
    path: '/event-fixtures',
    route: eventFixtures,
  },
  {
    path: '/user-device-token',
    route: userDeviceToken,
  },
  {
    path: '/account-deletion-request',
    route: accountDeletionRequest,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
