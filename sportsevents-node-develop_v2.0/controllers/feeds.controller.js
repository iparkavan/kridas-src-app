const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const FeedsService = require("../services/feeds.service");
const { handleError, ErrorHandler } = require("../config/error");
const userDao = require("../dao/user.dao");
const companyDao = require("../dao/company.dao");
const notificationDao = require("../dao/notification.dao");
const errorText = "Error";

const createFeeds = catchAsync(async (req, res) => {
  const methodName = "/createFeeds";
  try {
    let requestBody = req.body;
    requestBody["socket_request"] = req.socket_request;
    const { feed } = requestBody;
    const feeds = await FeedsService.createFeed(requestBody);
    // let userList=[];
    // if(feed.feed_creator_user_id)
    //     userList = await userDao.fetchFollowerList(feed.feed_creator_user_id)
    // else
    //     userList = await companyDao.getCompanyFollower(feed.feed_creator_company_id)
    // for await (let user of userList) {
    //     await notificationAdd(user.id, feeds.feed_id, 'P')
    //     let { count } = await notificationDao.getByUserId(user.id);
    //     req.io.emit(user.id, {
    //         "message": "test notification",
    //         count
    //     });
    // }
    res.status(httpStatus.CREATED).send(feeds);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const notificationAdd = async (
  user_id,
  feed_id,
  type,
  connectionObj = null
) => {
  try {
    let socket = null;
    let notification_type_id = feed_id;
    const notification = await notificationDao.add(
      user_id,
      socket,
      notification_type_id,
      type,
      connectionObj
    );
    return notification;
  } catch (error) {
    console.log("Error occurred in publish event", error);
    throw error;
  }
};

const fetchAll = catchAsync(async (req, res) => {
  const methodName = "/fetchAll";
  try {
    const feeds = await FeedsService.fetchAll();
    res.send(feeds);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchFeeds = catchAsync(async (req, res) => {
  const methodName = "/fetchFeeds";
  try {
    const feeds = await FeedsService.fetchFeeds(req.params.feed_id);
    res.send(feeds);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const editFeeds = catchAsync(async (req, res) => {
  const methodName = "/editFeeds";
  try {
    const feeds = await FeedsService.updateFeed(req.body);
    res.send(feeds);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteFeeds = catchAsync(async (req, res) => {
  const methodName = "/deleteFeeds";
  try {
    const feeds = await FeedsService.deleteFeeds(req.params.feed_id);
    res.send(feeds);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchFeedsByHashTag = catchAsync(async (req, res) => {
  const methodName = "/fetchFeedsByHashTag";
  try {
    const user = await FeedsService.fetchFeedsByHashTag(req.params.search_key);
    res.send(user);
  } catch (err) {
    console.log("Error occurred in searchFeed: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchFeed = catchAsync(async (req, res) => {
  const methodName = "/searchFeed";
  try {
    const user = await FeedsService.searchFeed(req.body);
    res.send(user);
  } catch (err) {
    console.log("Error occurred in searchFeed: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchFeedByEvent = catchAsync(async (req, res) => {
  const methodName = "/searchFeedByEvent";
  try {
    const user = await FeedsService.searchFeedByEvent(req.body);
    res.send(user);
  } catch (err) {
    console.log("Error occurred in searchFeedByEvent: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchByFeedCreatorUserId = catchAsync(async (req, res) => {
  const methodName = "/fetchByFeedCreatorUserId";
  try {
    // const feeds = await FeedsService.fetchByFeedCreatorUserId(req.params.feed_creator_user_id);
    const feeds = await FeedsService.fetchByFeedCreatorUserId(req.body);
    res.send(feeds);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchByFeedCreatorCompanyId = catchAsync(async (req, res) => {
  const methodName = "/fetchByFeedCreatorCompanyId";
  try {
    // const feeds = await FeedsService.fetchByFeedCreatorCompanyId(req.params.feed_creator_company_id);
    const feeds = await FeedsService.fetchByFeedCreatorCompanyId(req.body);
    res.send(feeds);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchByFeedCreatorCompanyIdwithEvent = catchAsync(async (req, res) => {
  const methodName = "/fetchByFeedCreatorCompanyIdwithEvent";
  try {
    // const feeds = await FeedsService.fetchByFeedCreatorCompanyId(req.params.feed_creator_company_id);
    const feeds = await FeedsService.fetchByFeedCreatorCompanyIdwithEvent(
      req.body
    );
    res.send(feeds);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchByName = catchAsync(async (req, res) => {
  const methodName = "/searchByName";
  try {
    const feeds = await FeedsService.searchByName(req.body);
    res.send(feeds);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getFeedWithAssociationData = catchAsync(async (req, res) => {
  const methodName = "/getFeedWithAssociationData";
  try {
    const feeds = await FeedsService.getFeedWithAssociationData(req.body);
    res.send(feeds);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createFeeds,
  fetchAll,
  fetchFeeds,
  editFeeds,
  deleteFeeds,
  searchFeed,
  fetchFeedsByHashTag,
  fetchByFeedCreatorUserId,
  fetchByFeedCreatorCompanyId,
  searchByName,
  searchFeedByEvent,
  getFeedWithAssociationData,
  fetchByFeedCreatorCompanyIdwithEvent,
};
