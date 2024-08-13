const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const eventFixturesService = require("../services/eventFixtures.service");
const { handleError, ErrorHandler } = require("../config/error");
const errorText = "Error";

const getByEventId = catchAsync(async (req, res) => {
  const methodName = "/getByEventId";
  try {
    const eventFixures = await eventFixturesService.getByEventId(req.body);
    res.send(eventFixures);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  getByEventId,
};
