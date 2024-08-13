const catchAsync = require("../utils/catchAsync");
const dashboardService = require("../services/dashboard.service")
const { handleError, ErrorHandler } = require("./../config/error");
const errorText = 'Error';

const fetchGraph = catchAsync(async (req, res) => {
    const methodName = '/fetchGraph'
    try {
        const users = await dashboardService.fetchGraph();
        res.send(users);
    } catch (err) {
        console.log("Error occurred in fetchGraph: ", err)
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});

const fetchApprovals = catchAsync(async (req, res) => {
    const methodName = '/fetchApprovals'
    try {
        const users = await dashboardService.fetchApprovals();
        res.send(users);
    } catch (err) {
        console.log("Error occurred in fetchApprovals: ", err)
        handleError(new ErrorHandler(errorText, methodName, err), res);
    }
});
const fetchDashBoard = catchAsync(async (req, res) => {
    const methodName = '/fetchDashBoard'
    try {
      const dashBoard = await dashboardService.fetchDashBoard();
      res.send(dashBoard);
    } catch (err) {
      handleError(new ErrorHandler(errorText, methodName, err), res);
    }
  });
  
  const getTopFollower = catchAsync(async (req, res) => {
    const methodName = '/getTopFollower'
    try {
      const dashBoard = await dashboardService.getTopFollower();
      res.send(dashBoard);
    } catch (err) {
      handleError(new ErrorHandler(errorText, methodName, err), res);
    }
  });
  


module.exports = {
    fetchGraph,
    fetchApprovals,
    fetchDashBoard,
    getTopFollower
}