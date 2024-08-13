const db = require('../utils/db');

const add = async (company_id = null, user_id = null, sponsorship_type, sports_id, preferred_brand = null, roi_options = null, due_date, deal_status = null, created_date, updated_date, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let currentDate = new Date();

        let query = `INSERT INTO sponsor_requestor_deals (company_id,user_id,sponsorship_type,sports_id,preferred_brand,roi_options,due_date,deal_status,created_date,updated_date) 
        values ($1,$2,$3,$4,$5::uuid[],$6,$7,$8,$9,$10) RETURNING *`
        result = await transaction.one(query, [company_id, user_id, sponsorship_type, sports_id, preferred_brand, roi_options, due_date, deal_status, currentDate, currentDate]);
        return result;
    }
    catch (error) {
        throw error;
    }
}

const edit = async (company_id, user_id, sponsorship_type, sports_id, preferred_brand, roi_options, due_date, deal_status, sponsor_requestor_deal_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let currentDate = new Date();
        let query = `update  sponsor_requestor_deals set company_id=$1,user_id=$2,sponsorship_type=$3,sports_id=$4,preferred_brand=$5::uuid[],roi_options=$6,due_date=$7,deal_status=$8,updated_date=$9 where sponsor_requestor_deal_id=$10 RETURNING *`
        result = await transaction.one(query, [company_id, user_id, sponsorship_type, sports_id, preferred_brand, roi_options, currentDate, deal_status, currentDate, sponsor_requestor_deal_id])
        return result;
    }
    catch (error) {
        throw error;
    }
}

const getById = async (sponsor_requestor_deal_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from sponsor_requestor_deals where sponsor_requestor_deal_id = $1 '
        result = await transaction.oneOrNone(query, [sponsor_requestor_deal_id])
        return result;
    }
    catch (error) {
        throw error;
    }
}

const getPreferredBrandCount = async (company_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `select
            count(*)
        from
            sponsor_requestor_deals srd
        where
            srd.preferred_brand && array ['${company_id}']::uuid[]`
        result = await transaction.oneOrNone(query, [])
        return result;
    }
    catch (error) {
        throw error;
    }
}

const getAll = async (connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from sponsor_requestor_deals'
        result = await transaction.manyOrNone(query, [])
        return result;
    }
    catch (error) {
        throw error;
    }
}

const deleteById = async (sponsor_requestor_deal_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db

        let query = 'delete from sponsor_requestor_deals where sponsor_requestor_deal_id = $1 RETURNING *'
        result = await transaction.oneOrNone(query, [sponsor_requestor_deal_id])
        return result;
    }
    catch (error) {
        throw error;
    }
}

module.exports = {
    add,
    edit,
    getById,
    getPreferredBrandCount,
    getAll,
    deleteById
}