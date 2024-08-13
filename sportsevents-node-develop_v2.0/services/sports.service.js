const sportsDao = require('../dao/sports.dao')
const userDao = require('../dao/user.dao')

/**
 *Method to create sport
 * @param {JSon} body 
 */
const createSport = async (body) => {
    try {
        let result = null;
        const { sports_name, sports_desc, sports_format, sports_category, sports_age_group, sports_brand, sports_profile, sports_role, sports_code, is_stats_enabled = false } = body
        //check duplicate
        let { count } = await sportsDao.checkDuplicate(sports_name)
        if (Number(count) === 0) {
            result = await sportsDao.add(sports_name, sports_desc, sports_format, sports_category, sports_age_group, sports_brand, sports_profile, sports_role, sports_code, is_stats_enabled)
        } else {
            result = { message: "sport name already exist" }
        }
        return result;
    } catch (error) {
        console.log("Error occurred in createSport", error)
        throw error;
    }
}

/**
 *Method to update sport
 * @param {JSon} body 
 */
const editSport = async (body) => {
    try {
        let result = null;
        const { sports_name, sports_desc, sports_format, sports_category, sports_age_group, sports_brand, sports_profile, sports_role, sports_code, is_stats_enabled, sports_id } = body
        let date = new Date();
        result = await sportsDao.edit(sports_name, sports_desc, JSON.stringify(sports_format), JSON.stringify(sports_category), JSON.stringify(sports_age_group), sports_brand, sports_profile, sports_role, sports_code, is_stats_enabled, sports_id)
        return result;
    } catch (error) {
        console.log("Error occurred in editSport", error)
        throw error;
    }
}

/**
 * Method to get sport based on sport id 
 * @param {int} sports_id 
 */
const fetchSport = async (sports_id) => {
    try {
        let sport = {};
        let data = await sportsDao.getById(sports_id);
        if (data === null)
            sport = { message: "sport not exist" }
        else
            sport["data"] = data;
        return sport;
    } catch (error) {
        console.log("Error occurred in fetch sport", error)
        throw error;
    }
}

/**
 * Method to get company name based on sport id 
 * @param {int} sports_id 
 */
const getCompanyNameBySportsId = async (sports_id) => {
    try {
        let sport = {};
        let data = await sportsDao.getCompanyNameBySportsId(sports_id);
        if (data === null)
            sport = { message: "sport not exist" }
        else
            sport["data"] = data;
        return sport;
    } catch (error) {
        console.log("Error occurred in getCompanyNameBySportsId", error)
        throw error;
    }
}

/**
 * Method to get all sports
 */
const fetchAllSport = async () => {
    try {
        let sport = null;
        let data = await sportsDao.getAll();
        sport = data;
        return sport;
    }
    catch (error) {
        console.log("Error occurred in fetchAll sport", error)
        throw error;
    }
}

/**
 * Method to get all sports By Stats
 */
const fetchAllSportsByStats = async () => {
    try {
        let sport = null;
        let data = await sportsDao.getAllSportsByStats();
        sport = data;
        return sport;
    }
    catch (error) {
        console.log("Error occurred in fetchAll Sports ByStats", error)
        throw error;
    }
}

/**
 * Method to get sports based on sports name
 * @param {string} sports_name 
 */
const fetchSportsByName = async (sports_name) => {
    try {

        let sport = {};
        let data = await sportsDao.fetchSportsByName(sports_name)
        if (data === null)
            sport = { message: "sport not exist" }
        else
            sport["data"] = data;
        return sport;
    } catch (error) {
        console.log("Error occurred in fetchSportsByName", error);
        throw error;
    }
};

/**
 * Method to delete sport based on sport id 
 * @param {int} sports_id 
 */
const deleteSport = async (sports_id) => {
    try {
        let sport = {};
        let sportsInterested = await userDao.getSportsInterestedCount(sports_id);
        if (sportsInterested.count === '0') {
            let data = await sportsDao.deleteById(sports_id);
            if (data === null)
                sport = { message: "sport not exist" }
            else
                sport["data"] = "Success";
        }
        else {
            sport = { message: "This Sport is referenced from sports_interested column in user Table" }
        }

        return sport;
    } catch (error) {
        console.log("Error occurred in fetch sport", error)
        throw error;
    }
}

module.exports = {
    createSport,
    fetchSport,
    fetchSportsByName,
    editSport,
    deleteSport,
    fetchAllSport,
    fetchAllSportsByStats,
    getCompanyNameBySportsId
};