const db = require('../utils/db');
const sponsorInfoDao = require('../dao/sponsorInfo.dao')
const userService = require("../services/user.service")


/**
 * Method to add new SponsorInfo
 * @param {json} body 
 */
 const createSponsorInfo = async (body) => {
    try {
        let result = null;
        const {user_id, previous_current_sponsor,roi_options } = body
        let date = new Date();
        result =await sponsorInfoDao.add(user_id, previous_current_sponsor,roi_options)
        return result;
    } catch (error) {
        console.log("Error occurred in createSponsorInfo", error);
        throw error;
    }
}


/**
 * Method to get SponsorInfo based on SponsorInfo id
 * @param {int} sponsor_info_id 
 */
 const fetchSponsorInfo =async (sponsor_info_id) => {
    try {
        let sponsorInfo = {
            data: null,
          };
          let data = await sponsorInfoDao.getById(sponsor_info_id)
          if (data === null) sponsorInfo = { message: "SponsorInfo not exist" };
          else sponsorInfo["data"] = data;
          return sponsorInfo;       
    } catch (error) {
        console.log("Error occurred in fetchSponsorInfo", error);
        throw error;
    }
};

/**
 * Method to get SponsorInfo based on User id
 * @param {uuid} user_id 
 */
 const fetchSponsorInfoByUserId =async (user_id) => {
    try {
        let sponsorInfo = {
            data: null,
          };
          let data = await sponsorInfoDao.getByUserId(user_id)
          if (data.length>0) sponsorInfo["data"] = data;
          else sponsorInfo = { message: "SponsorInfo not exist for the given User Id" };
          return sponsorInfo;       
    } catch (error) {
        console.log("Error occurred in fetchSponsorInfoByUserId", error);
        throw error;
    }
};

/**
 * Method to get SponsorInfo list
 */
 const fetchAll = async() => {
    try {
        let data = await sponsorInfoDao.getAll()
        return data;
    } catch (error) {
        console.log("Error occurred in fetchAll", error);
        throw error;
    }
};

/**
 * Method to update existing SponsorInfo
 * @param {json} body 
 */
const editSponsorInfo = async (body) => {
    try {
        let result = null; 
        const { sponsor_info_id ,user_id, previous_current_sponsor,roi_options } = body
        let user = null;
        user = await userService.fetchUser(user_id)      
        if ((!(user?.message === undefined))) {
            result = { message: "User  not found" }
            return result;
        }
        result =await sponsorInfoDao.edit(user_id, previous_current_sponsor,roi_options,sponsor_info_id)
        return result;
        
    } catch (error) {
        console.log("Error occurred in editSponsorInfo", error);
        throw error;
    }
}


/**
 * Method to delete SponsorInfo based on SponsorInfo id
 * @param {int}  sponsor_info_id
 */
const deleteSponsorInfo = async (sponsor_info_id) => {
    try {
        let sponsorInfo = {
            data: null,
          };
          let data = await sponsorInfoDao.deleteById(sponsor_info_id)
          if (data === null) sponsorInfo = { message: "SponsorInfo not exist" };
          else sponsorInfo["data"] = "Success";
          return sponsorInfo;
       
    } catch (error) {
        console.log("Error occurred in deleteSponsorInfo", error);
        throw error;
    }
};


module.exports = {
    fetchAll,
    createSponsorInfo,
    fetchSponsorInfo,
    fetchSponsorInfoByUserId,
    editSponsorInfo,
    deleteSponsorInfo
};