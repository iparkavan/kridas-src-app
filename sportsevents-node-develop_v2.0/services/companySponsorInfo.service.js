const companySponsorInfoDao = require('../dao/companySponsorInfo.dao')
const companyService = require('../services/company.service')

/**
 * Method to add new Company SponsorInfo
 * @param {json} body 
 */
const createCompanySponsorInfo = async (body) => {
    try {
        let result = null;
        const { company_id, category_id, sports_id, previous_current_sponsor, roi_options } = body
        result = await companySponsorInfoDao.add(company_id, category_id, sports_id, previous_current_sponsor, roi_options)
        return result;
    } catch (error) {
        console.log("Error occurred in createCompanySponsorInfo", error);
        throw error;
    }
}

/**
 * Method to get Company Sponsor Info based on company SponsorInfo id
 * @param {int} company_sponsor_info_id 
 */
const fetchCompanySponsorInfo = async (company_sponsor_info_id) => {
    try {
        let companySponsorInfo = {
            data: null,
        };
        let data = await companySponsorInfoDao.getById(company_sponsor_info_id)
        if (data === null) companySponsorInfo = { message: "company Sponsor Info not exist" };
        else companySponsorInfo["data"] = data;
        return companySponsorInfo;
    } catch (error) {
        console.log("Error occurred in fetchCompanySponsorInfo", error);
        throw error;
    }
};


/**
 * Method to get Company Sponsor Info based on company id
 * @param {uuid} company_id 
 */
const getByCompanyId = async (company_id) => {
    try {
        let companySponsorInfo = {
            data: null,
        };
        let data = await companySponsorInfoDao.getByCompanyId(company_id)
        if (data.length > 0) companySponsorInfo["data"] = data;
        else companySponsorInfo = { message: "company Sponsor Info not exist for the given company Idr" };
        return companySponsorInfo;
    } catch (error) {
        console.log("Error occurred in getByCompanyId", error);
        throw error;
    }
};

/**
 * Method to get Company Sponsor Info list
 */
const fetchAll = async () => {
    try {
        let data = await companySponsorInfoDao.getAll()
        return data;
    } catch (error) {
        console.log("Error occurred in fetchAll", error);
        throw error;
    }
};

/**
 * Method to update existing Company Sponsor Info
 * @param {json} body 
 */
const editCompanySponsorInfo = async (body) => {
    try {
        let companySponsorInfo = null;
        let result = null;
        let company = null;
        const { company_sponsor_info_id, company_id, category_id, sports_id, previous_current_sponsor, roi_options } = body
        companySponsorInfo = await companySponsorInfoDao.getById(company_sponsor_info_id);
        company = await companyService.fetchCompany(company_id)

        if (companySponsorInfo === null) {
            result = { message: " companySponsorInfo not found" }
            return result;
        }

        if (!(company?.message === undefined)) {
            result = { message: " company not found" }
            return result;
        }

        result = await companySponsorInfoDao.edit(company_id, category_id, sports_id, previous_current_sponsor, roi_options, company_sponsor_info_id)
        return result;

    } catch (error) {
        console.log("Error occurred in editCompanySponsorInfo", error);
        throw error;
    }
}

/**
 * Method to delete Company Sponsor Info based on Company Sponsor Info id
 * @param {int}  company_sponsor_info_id
 */
const deleteCompanySponsorInfo = async (company_sponsor_info_id) => {
    try {
        let result = {};
        let data = await companySponsorInfoDao.deleteById(company_sponsor_info_id)
        if (data === null) result = { message: "SponsorInfo not exist" };
        else result["data"] = "Success";
        return result;

    } catch (error) {
        console.log("Error occurred in deleteCompanySponsorInfo", error);
        throw error;
    }
};

module.exports = {
    fetchAll,
    createCompanySponsorInfo,
    fetchCompanySponsorInfo,
    editCompanySponsorInfo,
    deleteCompanySponsorInfo,
    getByCompanyId
};