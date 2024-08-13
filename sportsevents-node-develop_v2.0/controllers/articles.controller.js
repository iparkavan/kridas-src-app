const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const articleService = require("../services/articles.service");
const { handleError, ErrorHandler } = require("../config/error");
const { json } = require("body-parser");
const errorText = "Error";

const createArticles = catchAsync(async (req, res) => {
  const methodName = "/createArticle";
  try {
    let requestBody = req.body;
    requestBody["files"] = req.files;
    const article = await articleService.createArticle(requestBody);
    res.status(httpStatus.CREATED).send(article);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAll = catchAsync(async (req, res) => {
  const methodName = "/fetchAll";
  try {
    const article = await articleService.fetchAll();
    res.send(article);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchArticle = catchAsync(async (req, res) => {
  const methodName = "/fetchArticle";
  try {
    const article = await articleService.fetchArticle(
      req.params.article_id,
      req.query.user_id
    );
    res.send(article);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

// const fetchArticleById = catchAsync(async (req, res) => {
//   const methodName = "/fetchArticleById";
//   try {
//     const article = await articleService.fetchArticleById(
//       req.params.article_id
//     );
//     res.send(article);
//   } catch (err) {
//     handleError(new ErrorHandler(errorText, methodName, err), res);
//   }
// });

const editArticle = catchAsync(async (req, res) => {
  const methodName = "/editArticle";
  try {
    let requestBody = req.body;
    requestBody["files"] = req.files;
    const article = await articleService.editArticle(requestBody);
    res.send(article);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteArticle = catchAsync(async (req, res) => {
  const methodName = "/deleteCategory";
  try {
    const article = await articleService.deleteArticle(req.params.article_id);
    res.send(article);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchByUserId = catchAsync(async (req, res) => {
  const methodName = "/fetchByUserId";
  try {
    const article = await articleService.fetchUserId(req.params.user_id);
    res.send(article);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchByCompanyId = catchAsync(async (req, res) => {
  const methodName = "/fetchByCompanyId";
  try {
    const article = await articleService.fetchComapnyId(req.params.company_id);
    res.send(article);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchByUserId = catchAsync(async (req, res) => {
  const methodName = "/searchByUserId";
  try {
    const article = await articleService.searchByUserId(req.body);
    res.send(article);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchByCompanyId = catchAsync(async (req, res) => {
  const methodName = "/searchByCompanyId";
  try {
    const article = await articleService.searchByCompanyId(req.body);
    res.send(article);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const createArticlesFeed = catchAsync(async (req, res) => {
  const methodName = "/createArticlesFeed";
  try {
    let requestBody = req.body;
    requestBody["files"] = req.files;
    requestBody["feed"] = JSON.parse(req.body.feed);
    requestBody["socket_request"] = req.socket_request;
    const article = await articleService.ArticleFeed(requestBody);
    res.status(httpStatus.CREATED).send(article);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const search = catchAsync(async (req, res) => {
  const methodName = "/search";
  try {
    const article = await articleService.search(req.body);
    res.send(article);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchIsFeature = catchAsync(async (req, res) => {
  const methodName = "/searchIsFeature";
  try {
    const article = await articleService.searchByIsFeature(req.body);
    res.send(article);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const articleShare = catchAsync(async (req, res) => {
  const methodName = "/articleShare";
  try {
    const article = await articleService.articleShare(req.body);
    res.send(article);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const updateIsFeature = catchAsync(async (req, res) => {
  const methodName = "/updateIsFeature";
  try {
    const article = await articleService.updateIsFeature(req.body);
    res.send(article);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createArticles,
  fetchAll,
  fetchArticle,
  // fetchArticleById,
  editArticle,
  deleteArticle,
  fetchByUserId,
  fetchByCompanyId,
  searchByUserId,
  searchByCompanyId,
  createArticlesFeed,
  search,
  searchIsFeature,
  articleShare,
  updateIsFeature,
};
