const db = require("../utils/db");
const dashboardDao = require("../dao/dashboard.dao")

/**
* Method to get past 6 month registered user,company and pending verified profile  
*/
const fetchGraph = async () => {
  try {
    let result = null;
    let data = await dashboardDao.fetchGraph();
    let testData = await getLastSixMonth()
    result = data;
    let res = []
    for (let d of testData) {
      let obj = {}
      obj.month = d;
      obj.users = 0;
      obj.pages = 0;
      for (let d2 of data.users) {
        if (d2.monthname.trim() === d) {
          obj.users = d2.usercount;
          break;
        }
      }
      for (let d2 of data.pages) {
        if (d2.monthname.trim() === d) {
          obj.pages = d2.pagecount;
          break;
        }
      }
      res.push(obj)
    }
    result = res;

    return result;
  } catch (error) {
    console.log("Error occurred in fetchGraph", error);
    throw error;
  }
};

/**
 * Method to get Approved users and pages
 */
const fetchApprovals = async () => {
  try {
    let result = null;
    let data = await dashboardDao.fetchApprovals();
    result = data;
    return result;
  } catch (error) {
    console.log("Error occurred in fetchApprovals", error);
    throw error;
  }
};

/**
* Method to get count of user,company and profile verified 
*/
const fetchDashBoard = async () => {
  try {
    let data = await dashboardDao.getDashBoard();
    return data;
  } catch (error) {
    console.log("Error occurred in fetchDashBoard", error);
    throw error;
  }
};

/**
 * Method to get Top Follower
 */
const getTopFollower = async () => {
  try {
    let data = await dashboardDao.getTopFollower();
    return data;
  } catch (error) {
    console.log("Error occurred in Top followers", error);
    throw error;
  }
};

/**
 * Method to get last six months data
 */
const getLastSixMonth = () => {
  let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let today = new Date();
  let d;
  let month;
  let response = []
  for (let i = 6; i > 0; i -= 1) {
    d = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);
    month = monthNames[d.getMonth()];
    response.push(month)
  }
  return response;
}

module.exports = {
  fetchGraph,
  fetchApprovals,
  fetchDashBoard,
  getTopFollower
}