const db = require('../utils/db');

const add = async (company_id,category_id,sports_id, previous_current_sponsor, roi_options , connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let currentDate = new Date();
        let query = `INSERT INTO company_sponsor_info (company_id , category_id,sports_id, previous_current_sponsor, roi_options, created_date, updated_date) 
        values ($1,$2,$3,$4,$5,$6,$7) RETURNING *`
        result = await transaction.one(query, [company_id , category_id,sports_id, previous_current_sponsor, roi_options, currentDate, currentDate]);
        return result;
    }
    catch (error) {
        console.log("Error occurred in company sponsor dao add", error)
        throw error;
    }
}

const getAll = async (connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from company_sponsor_info'
        result = await transaction.manyOrNone(query, [])
        return result;
    }
    catch (error) {
        console.log("Error occurred in company sponsor dao getAll", error)
        throw error;
    }
}

const getById = async (sponsor_info_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from company_sponsor_info where company_sponsor_info_id = $1'
        result = await transaction.oneOrNone(query, [sponsor_info_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in company sponsor dao getById", error)
        throw error;
    }
}

const getByCompanyId = async (company_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select csf.*,row_to_json(c.*) as company from company_sponsor_info csf left join company c on csf.company_id = c.company_id where csf.company_id = $1'
        result = await transaction.manyOrNone(query, [company_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in company sponsor dao getByCompanyId", error)
        throw error;
    }
}

const edit = async (company_id,category_id,sports_id, previous_current_sponsor, roi_options,company_sponsor_info_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let currentDate = new Date();
        let query = `update company_sponsor_info set company_id=$1, category_id=$2,sports_id=$3, previous_current_sponsor=$4, roi_options=$5, updated_date=$6 where company_sponsor_info_id=$7 RETURNING *`
        result = await transaction.one(query, [company_id , category_id,sports_id, previous_current_sponsor, roi_options, currentDate,company_sponsor_info_id ])
        return result;
    }
    catch (error) {
        console.log("Error occurred in company sponsor dao edit", error)
        throw error;
    }
}

const deleteById = async (sponsor_info_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db

        let query = 'delete from company_sponsor_info where company_sponsor_info_id = $1 RETURNING *'
        result = await transaction.oneOrNone(query, [sponsor_info_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in company sponsor dao delete", error)
        throw error;
    }
}

module.exports = {
    getAll,
    add,
    getById,
    edit,
    deleteById,
    getByCompanyId

}