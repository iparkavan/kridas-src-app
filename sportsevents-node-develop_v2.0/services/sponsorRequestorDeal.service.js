const db = require('../utils/db');
const userService = require('../services/user.service')
const sportService = require('../services/sports.service')
const companyService = require("../services/company.service")
const categoryService = require("../services/category.service")
const sponsorRequestorDealDao = require('../dao/sponsorRequestorDeal.dao')

/**
 * Method to add new SponsorRequestorDeals
 * @param {json} body 
 */
const createSponsorRequestorDeals = async (body) => {
    try {
        let result = null;
        const { company_id, user_id, sponsorship_type, sports_id, preferred_brand, roi_options, due_date, deal_status } = body

        if (company_id != null) {
            const company = await companyService.fetchCompany(company_id);
            if (!(company?.message === undefined)) {
                result = { message: "Company not exist" }
                return result;
            }
        }

        if (sponsorship_type != null) {
            const sponsorshipType = await categoryService.fetchCategory(sponsorship_type);
            if (!(sponsorshipType?.message === undefined)) {
                result = { message: "Sponsorship Type not exist" }
                return result;
            }
        }

        if (user_id != null) {
            const user = await userService.fetchUser(user_id);
            if (!(user?.message === undefined)) {
                result = { message: "user not exist" }
                return result;
            }
        }

        if (sports_id != null) {
            const sport = await sportService.fetchSport(sports_id);
            if (!(sport?.message === undefined)) {
                result = { message: "sport not exist" }
                return result;
            }
        }

        let date = new Date();
        result = await sponsorRequestorDealDao.add(company_id, user_id, sponsorship_type, sports_id, preferred_brand, roi_options, due_date, deal_status)
        return result;
    } catch (error) {
        throw error;
    }
}

/**
 * Method to update existing SponsorRequestorDeals
 * @param {json} body 
 */
const editSponsorRequestorDeals = async (body) => {
    try {
        let result = null;
        const { sponsor_requestor_deal_id, company_id, user_id, sponsorship_type, sports_id, preferred_brand, roi_options, due_date, deal_status } = body
        if (sponsor_requestor_deal_id != null) {
            const sponsorRequesterDeal = await sponsorRequestorDealDao.getById(sponsor_requestor_deal_id)
            if (sponsorRequesterDeal === null) {
                result = { message: "sponsorRequesterDeal not exist" }
                return result;
            }
        }
        if (user_id != null) {
            const user = await userService.fetchUser(user_id);
            if (!(user?.message === undefined)) {
                result = { message: "user not exist" }
                return result;
            }
        }
        if (sports_id != null) {
            const sport = await sportService.fetchSport(sports_id);
            if (!(sport?.message === undefined)) {
                result = { message: "sport not exist" }
                return result;
            }
        }
        let SponsorRequestorDeals = await fetchSponsorRequestorDeals(sponsor_requestor_deal_id);
        if (SponsorRequestorDeals !== null) {
            result = await sponsorRequestorDealDao.edit(company_id, user_id, sponsorship_type, sports_id, preferred_brand, roi_options, due_date, deal_status, sponsor_requestor_deal_id)
        } else {
            result = { message: "SponsorRequestorDeals is not exist" }
        }
        return result;
    } catch (error) {
        throw error;
    }
}

/**
 * Method to get country based on sponsor_requestor_deal_id
 * @param {int} sponsor_requestor_deal_id 
 */
const fetchSponsorRequestorDeals = async (sponsor_requestor_deal_id) => {
    try {
        let SponsorRequestorDeals = {
            data: null,
        };
        let data = await sponsorRequestorDealDao.getById(sponsor_requestor_deal_id)
        if (data === null) SponsorRequestorDeals = { message: "SponsorRequestorDeals not exist" };
        else SponsorRequestorDeals["data"] = data;
        return SponsorRequestorDeals;
    } catch (error) {
        throw error;
    }
};

/**
 * Method to get SponsorRequestorDeals list
 */
const fetchAll = async () => {
    try {
        let data = await sponsorRequestorDealDao.getAll()
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Method to delete country based on country id
 * @param {int} sponsor_requestor_deal_id 
 */
const deleteSponsorRequestorDeals = async (sponsor_requestor_deal_id) => {
    try {
        let SponsorRequestorDeals = {
            data: null,
        };
        let data = await sponsorRequestorDealDao.deleteById(sponsor_requestor_deal_id)
        if (data === null) category = { message: "SponsorRequestorDeals not exist" };
        else SponsorRequestorDeals["data"] = "Success";
        return SponsorRequestorDeals;

    } catch (error) {
        throw error;
    }
};

module.exports = {
    createSponsorRequestorDeals,
    editSponsorRequestorDeals,
    fetchSponsorRequestorDeals,
    deleteSponsorRequestorDeals,
    fetchAll
};