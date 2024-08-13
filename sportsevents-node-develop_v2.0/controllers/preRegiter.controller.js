const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const preRegisterService = require("../services/preRegister.service");
const { handleError, ErrorHandler } = require('../config/error');
const errorText = 'Error';


const createPreRegisterMail = catchAsync(async (req, res) => {
    const methodName='/createPreRegisterMail'
    try {
        let requestBody = req.body;
        const PreRegisterMail = await preRegisterService.PreRegisterMail(requestBody);
        res.status(httpStatus.CREATED).send(PreRegisterMail);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
    
});

const createArrayMail = catchAsync(async (req, res) => {
    const methodName='/createArrayMail'
    try {
        let requestBody = req.body;
        const PreRegisterMail = await preRegisterService.arrayMail(requestBody);
        res.status(httpStatus.CREATED).send(PreRegisterMail);
    } catch (err) {
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
    
});


module.exports = {
    createPreRegisterMail,
    createArrayMail
  };