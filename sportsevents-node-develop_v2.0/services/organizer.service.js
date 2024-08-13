const db = require('../utils/db');
const organizerDao = require('../dao/organizer.dao');
const companyDao = require('../dao/company.dao')
const userDao = require('../dao/user.dao')

/**
 * Method to create new organizer
 * @param {JSON} body 
 * @returns 
 */
const createOrganizer = async (body, connectionObj = null) => {
    try {
        let result = null;
        const { company_refid, user_refid } = body
        if (company_refid != null) {
            let Company = await companyDao.getById(company_refid)
            if (Company === null) {
                result = { message: " company id not found" }
                return result;
            }
        }

        if (user_refid != null) {
            let User = await userDao.getById(user_refid)
            if (User === null) {
                result = { message: "user id not found" }
                return result;
            }
        }


        if (company_refid != null) {
            let companyFind = await organizerDao.getByCompanyId(company_refid)
            if (companyFind !== null) {
                result = { message: "Already company is present" }
                return result;
            }
        }

        if (user_refid != null) {
            let userFind = await organizerDao.getByUserId(user_refid)
            if (userFind !== null) {
                result = { message: "Already user is present" }
                return result;
            }
        }


        result = await organizerDao.add(company_refid, user_refid, connectionObj)
        return result;

    } catch (error) {
        console.log("Error occurred in createOrganizer", error);
        throw error;
    }
}


// const editOrganizer = async (body) => {
//     try {
//         let result = null;
//         const { company_refid, user_refid, organizer_id } = body

//         let data = await organizerDao.getById(organizer_id)
//         if (data === null) {
//             result = { message: "organizer not exist" }
//             return result;
//         }


//         if (company_refid != null) {
//             let Company = await companyDao.getById(company_refid)
//             if (Company === null) {
//                 result = { message: " company id not found" }
//                 return result;
//             }
//         }

//         if (user_refid != null) {
//             let User = await userDao.getById(user_refid)
//             if (User === null) {
//                 result = { message: "user id not found" }
//                 return result;
//             }
//         }

//         if (company_refid != null) {
//             let companyFind = await organizerDao.getByCompanyId(company_refid)
//             if (companyFind !== null) {
//                 result = { message: "Already company is present" }
//                 return result;
//             }
//         }

//         result = await organizerDao.edit(company_refid, user_refid, organizer_id)

//         return result;
//     } catch (error) {
//         console.log("Error occurred in edit organizer", error);
//         throw error;
//     }
// }

/**
 * Method to get organizer by organizer id
 * @param {uuid} organizer_id 
 * @returns 
 */
const fetchOrganizer = async (organizer_id) => {
    try {
        let result = {};
        let data = await organizerDao.getById(organizer_id)
        if (data === null) result = { message: "organizer not exist" };
        else result["data"] = data;
        return result;
    } catch (error) {
        console.log("Error occurred in fetchOrganizer", error);
        throw error;
    }
};

/**
 * Method to get all organizers
 * @returns 
 */
const fetchAll = async () => {
    try {
        let data = await organizerDao.getAll()
        return data;
    } catch (error) {
        console.log("Error occurred in fetchAll", error);
        throw error;
    }
};

/**
 * Method to delete organizer by country id
 * @param {uuid} country_id 
 * @returns 
 */
const deleteOrganizer = async (country_id) => {
    try {
        let organizer = {
            data: null,
        };
        let data = await organizerDao.deleteById(country_id)
        if (data === null) organizer = { message: "Organizer not exist" };
        else organizer["data"] = "Success";
        return organizer;

    } catch (error) {
        console.log("Error occurred in delete organizer", error);
        throw error;
    }
};

module.exports = {
    createOrganizer,
    // editOrganizer,
    fetchOrganizer,
    fetchAll,
    deleteOrganizer

}