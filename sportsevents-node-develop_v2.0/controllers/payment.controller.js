const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const paymentService = require("../services/payment.service");
const { handleError, ErrorHandler } = require("../config/error");
const errorText = "Error";

const createCheckOutSession = catchAsync(async (req, res) => {
  const methodName = "/createCheckOutSession";
  try {
    const checkoutSession = await paymentService.createCheckOutSession(
      req.body
    );
    res.status(httpStatus.CREATED).send(checkoutSession);
  } catch (err) {
    handleError(new ErrorHandler(errorText, methodName, err), res);
  }
});

module.exports = {
  createCheckOutSession,
};
