const db = require('../utils/db');
const { verificationMail } = require("../services/mail.service");
const userService = require("../services/user.service");
const companyService = require("../services/company.service")




const add = async (company_id = null, user_id = null, applied_status, verification_comments, status_change_date, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let currentDate = new Date();
        let query = `INSERT INTO profile_verification (company_id, user_id, applied_date, applied_status, verification_comments,status_change_date)  
        values ($1,$2,$3,$4,$5,$6) RETURNING *`
        result = await transaction.one(query, [company_id, user_id, currentDate, applied_status, verification_comments, currentDate]);
        return result;
    }
    catch (error) {
        console.log("Error occurred in add profile verification", error)
        throw error;
    }
}

const edit = async (company_id = null, user_id = null, applied_status, verification_comments, status_change_date, profile_verification_id, connectionObj = null) => {
    try {
        let mail = null;
        let transaction = connectionObj !== null ? connectionObj : db
        let currentDate = new Date();
        let query = `UPDATE profile_verification SET company_id=$1, user_id=$2, applied_status=$3, verification_comments=$4, status_change_date=$5 WHERE profile_verification_id=$6 RETURNING *`
        let result = await transaction.one(query, [company_id, user_id, applied_status, verification_comments, currentDate, profile_verification_id]) 
        if(user_id !== null){
             mail = await userService.fetchUser(user_id);
        }else{
            mail = await companyService.fetchCompany(company_id)
        }
        verificationMail(mail.data , result)
        return result;
    }
    catch (error) {
        console.log("Error occurred in edit profile verification", error)
        throw error;
    }
}

const getById = async (profile_verification_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from profile_verification where profile_verification_id = $1'
        result = await transaction.oneOrNone(query, [profile_verification_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in dao getById", error)
        throw error;
    }
}

const getByTypeAndId = async (id,type, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query=''
        if(type === 'U')
             query= 'select * from profile_verification pv where pv.user_id  = $1'
        else if(type === 'C')
             query= 'select * from profile_verification pv where pv.company_id  = $1'
        result = await transaction.manyOrNone(query, [id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in dao getById", error)
        throw error;
    }
}

const getAll = async (connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `select pv.*, concat(u.first_name , ' ' , u.last_name) user_name, c.company_name  from profile_verification pv 
        left join users u 
        on u.user_id = pv.user_id 
        left join company c 
        on c.company_id = pv.company_id `
        result = await transaction.manyOrNone(query, [])
        return result;
    }
    catch (error) {
        console.log("Error occurred in dao getAll", error)
        throw error;
    }
}

const deleteById = async (profile_verification_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'delete from profile_verification where profile_verification_id = $1 RETURNING *'
        result = await transaction.oneOrNone(query, [profile_verification_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in dao deleteById", error)
        throw error;
    }
}

const getByUserId = async (user_id, applied_status, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `select * from profile_verification where  user_id = $1 and applied_status = $2`
        result = await transaction.oneOrNone(query, [user_id,applied_status])
        return result;
    }
    catch (error) {
        console.log("Error occurred in dao getById", error)
        throw error;
    }
}

const getByCompanyId = async (company_id, applied_status, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `select * from profile_verification where  company_id = $1 and applied_status = $2`
        result = await transaction.oneOrNone(query, [company_id,applied_status])
        return result;
    }
    catch (error) {
        console.log("Error occurred in dao getById", error)
        throw error;
    }
}






module.exports = {
    add,
    edit,
    getById,
    getAll,
    deleteById,
    getByUserId,
    getByCompanyId,
    getByTypeAndId
    
}