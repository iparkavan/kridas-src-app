const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const userService = require("../services/user.service");
const cloudinaryService = require("../services/cloudinary.service");
const errorText = "Error";
const { handleError, ErrorHandler } = require("./../config/error");

const uploadTest = catchAsync(async (req, res) => {
  const user = await userService.uploadTest(req);
  res.status(httpStatus.CREATED).send(user);
});

const uploadCloudinary = catchAsync(async (req, res) => {
  cloudinaryService.uploadCloudinary(req.file);

  res.status(httpStatus.CREATED).send({});
});

const createUser = catchAsync(async (req, res) => {
  const methodName = "/createUser";
  try {
    let requestBody = req.body;
    // requestBody.sports_interested=JSON.parse(requestBody.sports_interested)
    requestBody["files"] = req.files;
    const user = await userService.createUser(requestBody);
    res.status(httpStatus.CREATED).send(user);
  } catch (err) {
    console.log("Error occurred in createUser: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const editUser = catchAsync(async (req, res) => {
  const methodName = "/editUser";
  try {
    let requestBody = req.body;
    requestBody.sports_interested =
      JSON.parse(requestBody?.sports_interested) !== null
        ? JSON.parse(requestBody?.sports_interested).length > 0
          ? JSON.parse(requestBody?.sports_interested)
          : []
        : [];
    requestBody["files"] = req.files;
    const user = await userService.editUser(requestBody);
    res.send(user);
  } catch (err) {
    console.log("Error occurred in editUser: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const updateByToken = catchAsync(async (req, res) => {
  const methodName = "/updateByToken";
  try {
    const user = await userService.updateByToken(req.body);
    res.send(user);
  } catch (err) {
    console.log("Error occurred in updateByToken: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const activateUser = catchAsync(async (req, res) => {
  const methodName = "/activateUser";
  try {
    const user = await userService.activateUser(req.body);
    res.send(user);
  } catch (err) {
    console.log("Error occurred in activateUser: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const updateByTokenAndEmail = catchAsync(async (req, res) => {
  const methodName = "/updateByTokenAndEmail";
  try {
    const user = await userService.updateByTokenAndEmail(req.body);
    res.send(user);
  } catch (err) {
    console.log("Error occurred in updateByTokenAndEmail: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchUser = catchAsync(async (req, res) => {
  const methodName = "/fetchUser";
  try {
    const user = await userService.fetchUser(req.params.user_id);
    res.send(user);
  } catch (err) {
    console.log("Error occurred in fetchUser: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchUserByEmail = catchAsync(async (req, res) => {
  const methodName = "/fetchUserByEmail";
  try {
    const user = await userService.fetchUserByEmail(req.params.user_email);
    res.send(user);
  } catch (err) {
    console.log("Error occurred in fetchUserByEmail: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchUserByToken = catchAsync(async (req, res) => {
  const methodName = "/fetchUserByToken";
  try {
    const user = await userService.fetchUserByToken(req.params.token);
    res.send(user);
  } catch (err) {
    console.log("Error occurred in fetchUserByToken: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAllUsers = catchAsync(async (req, res) => {
  const methodName = "/fetchAllUsers";
  try {
    const users = await userService.fetchAllUsers();
    res.send(users);
  } catch (err) {
    console.log("Error occurred in fetchUserByToken: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const searchUser = catchAsync(async (req, res) => {
  const methodName = "/searchUser";
  try {
    const user = await userService.searchUser(req.body);
    res.send(user);
  } catch (err) {
    console.log("Error occurred in searchUser: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const search = catchAsync(async (req, res) => {
  const methodName = "/searchName";
  try {
    const user = await userService.searchName(req.body);
    res.send(user);
  } catch (err) {
    console.log("Error occurred in searchUser: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const deleteUser = catchAsync(async (req, res) => {
  const methodName = "/deleteUser";
  try {
    const user = await userService.deleteUser(req.params.user_id);
    res.send(user);
  } catch (err) {
    console.log("Error occurred in deleteUser: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const userData = catchAsync(async (req, res) => {
  const methodName = "/followerData";
  try {
    const follower = await userService.fetchUserData(
      req.params.user_id,
      req.params.type
    );
    res.send(follower);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const verifyReferralCode = catchAsync(async (req, res) => {
  const methodName = "/verifyCode";
  try {
    const code = await userService.verifyReferralCode(req.params.code);
    res.send(code);
  } catch (err) {
    console.log("Error occurred in verifyReferralCode: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchUserName = catchAsync(async (req, res) => {
  const methodName = "/fetchUser";
  try {
    const user = await userService.fetchUserName(
      req.params.user_name,
      req.query.user_id
    );
    res.send(user);
  } catch (err) {
    console.log("Error occurred in fetchUserName: ", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const getByPlayerId = catchAsync(async (req, res) => {
  const methodName = "/getByPlayerId";
  try {
    const user = await userService.getByPlayerId(req.params.player_id);
    res.send(user);
  } catch (err) {
    console.log("Error occurred in user controller : getByPlayerId", err);
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const userProfileVerification = catchAsync(async (req, res) => {
  const methodName = "/userProfileVerification";
  try {
    const user = await userService.userProfileVerification(req.body);
    res.send(user);
  } catch (err) {
    console.log(
      "Error occurred in user controller : userProfileVerification",
      err
    );
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createUser,
  deleteUser,
  fetchUser,
  editUser,
  uploadTest,
  fetchAllUsers,
  uploadCloudinary,
  searchUser,
  fetchUserByEmail,
  updateByToken,
  fetchUserByToken,
  search,
  userData,
  updateByTokenAndEmail,
  verifyReferralCode,
  fetchUserName,
  activateUser,
  getByPlayerId,
  userProfileVerification,
};
