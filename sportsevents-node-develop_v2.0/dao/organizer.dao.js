const db = require('../utils/db');

const add = async (company_refid, user_refid, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let currentDate = new Date();

        let query = `INSERT INTO organizer(company_refid,user_refid,created_date,updated_date) VALUES ($1,$2,$3,$4) RETURNING *`
        result = await transaction.one(query, [company_refid, user_refid, currentDate, currentDate]);
        return result;
    }
    catch (error) {
        console.log("Error occurred in organizerDao add", error);
        throw error;
    }
}


// const edit = async (company_refid, user_refid, organizer_id, connectionObj = null) => {
//     try {
//         let transaction = connectionObj !== null ? connectionObj : db
//         let currentDate = new Date();
//         let query = `UPDATE organizer SET company_refid=$1,user_refid=$2 ,created_date=$3,updated_date=$4 WHERE organizer_id = $5 RETURNING *`
//         result = await transaction.one(query, [company_refid, user_refid, currentDate, currentDate, organizer_id]);
//         return result;
//     }
//     catch (error) {
//         console.log("Error occurred in organizerDao edit", error);
//         throw error;
//     }
// }

const getById = async (organizer_id, connectionObj = null) => {
    try {

        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from organizer where organizer_id = $1'
        result = await transaction.oneOrNone(query, [organizer_id])
        return result;
    } catch (error) {
        console.log("Error occurred in organizer getById", error)
        throw error;
    }
}
const getAll = async (connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from organizer order by updated_date desc;'
        result = await transaction.manyOrNone(query, [])
        return result;
    }
    catch (error) {
        console.log("Error occurred in OrganizerDao getAll", error)
        throw error;
    }
}

const deleteById = async (organizer_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db

        let query = 'delete from organizer where organizer_id = $1 RETURNING *'
        result = await transaction.oneOrNone(query, [organizer_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in OrganizerDao deleteById", error)
        throw error;
    }
}

const getByCompanyId = async (company_refid, connectionObj = null) => {
    try {

        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from organizer where company_refid = $1'
        result = await transaction.oneOrNone(query, [company_refid])
        return result;
    } catch (error) {
        console.log("Error occurred in tournament_categories  getByCompanyId", error)
        throw error;
    }
}

const getByUserId = async (user_refid, connectionObj = null) => {
    try {

        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from organizer where user_refid = $1'
        result = await transaction.manyOrNone(query, [user_refid])
        return result;
    } catch (error) {
        console.log("Error occurred in tournament_categories getByUserId", error)
        throw error;
    }
}

module.exports = {
    add,
    // edit,
    getById,
    getAll,
    deleteById,
    getByCompanyId,
    getByUserId

}
