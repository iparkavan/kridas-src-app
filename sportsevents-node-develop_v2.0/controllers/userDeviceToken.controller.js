const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userDeviceTokenService = require('../services/userDeviceToken.service');
const { handleError, ErrorHandler } = require('../config/error');
const errorText = 'Error';

const createUserDevice = catchAsync(async (req, res) => {
  const methodName = '/createUserDevice';
  try {
    let requestBody = req.body;
    const userDevice = await userDeviceTokenService.createUserDevice(
      requestBody
    );
    res.status(httpStatus.CREATED).send(userDevice);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

const fetchAll = catchAsync(async (req, res) => {
  const methodName = '/fetchAll';
  try {
    const userDevices = await userDeviceTokenService.fetchAll();
    res.send(userDevices);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createUserDevice,
  fetchAll,
};
