const db = require('../utils/db');


const add = async ( user_id, previous_current_sponsor, roi_options , connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let currentDate = new Date();
        let query = `INSERT INTO sponsor_info ( user_id, previous_current_sponsor, roi_options, created_date, updated_date) 
        values ($1,$2,$3,$4,$5) RETURNING *`
        result = await transaction.one(query, [ user_id, previous_current_sponsor, roi_options, currentDate, currentDate]);
        return result;
    }
    catch (error) {
        console.log("Error occurred in SponsorDao add", error)
        throw error;
    }
}



const getAll = async (connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from sponsor_info'
        result = await transaction.manyOrNone(query, [])
        return result;
    }
    catch (error) {
        console.log("Error occurred in SponsorDao getAll", error)
        throw error;
    }
}



const getById = async (sponsor_info_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from sponsor_info where sponsor_info_id = $1'
        result = await transaction.oneOrNone(query, [sponsor_info_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in SponsorDao getById", error)
        throw error;
    }
}

const getByUserId = async (user_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `select si.*,row_to_json(u.*) as users from sponsor_info si 
        left join users u on
        u.user_id =si.user_id 
        where si.user_id =$1`
        result = await transaction.manyOrNone(query, [user_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in SponsorDao getByUserId", error)
        throw error;
    }
}

const edit = async ( user_id, previous_current_sponsor,roi_options,sponsor_info_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let currentDate = new Date();
        let query = `update sponsor_info set  user_id=$1, previous_current_sponsor=$2, roi_options=$3, created_date= $4, updated_date=$5 where sponsor_info_id=$6 RETURNING *`
        result = await transaction.one(query, [ user_id, previous_current_sponsor, roi_options, currentDate, currentDate,sponsor_info_id ])
        return result;
    }
    catch (error) {
        console.log("Error occurred in SponsorDao edit", error)
        throw error;
    }
}

const deleteById = async (sponsor_info_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db

        let query = 'delete from sponsor_info where sponsor_info_id = $1 RETURNING *'
        result = await transaction.oneOrNone(query, [sponsor_info_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in SponsorDao delete", error)
        throw error;
    }
}

module.exports = {
    getAll,
    add,
    getById,
    getByUserId,
    edit,
    deleteById

}