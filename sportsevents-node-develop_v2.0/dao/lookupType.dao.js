const db = require('../utils/db');

const add = async (lookup_type, lookup_desc, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `INSERT INTO lookup_type (lookup_type,lookup_desc) VALUES ($1, $2) RETURNING *`
        let result = await transaction.one(query, [lookup_type, lookup_desc]);
        return result;
    }
    catch (error) {
        console.log("Error occurred in lookupType dao add", error)
        throw error;
    }
}

const edit = async (lookup_type, lookup_desc, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `update lookup_type set lookup_desc= $2 where lookup_type =$1  returning *`
        result = await transaction.one(query, [lookup_type, lookup_desc])
        return result;
    }
    catch (error) {
        console.log("Error occurred in lookupType dao edit", error)
        throw error;
    }
}

const getByType = async (type, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from lookup_type where lookup_type = $1'
        result = await transaction.oneOrNone(query, [type])
        return result;
    }
    catch (error) {
        console.log("Error occurred in lookupType dao getByType", error)
        throw error;
    }
}

const getAll = async (connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from lookup_type'
        result = await transaction.manyOrNone(query, [])
        return result;
    }
    catch (error) {
        console.log("Error occurred in lookupType dao getAll", error)
        throw error;
    }
}

const deleteByType = async (type, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'delete from lookup_type where lookup_type = $1 RETURNING *'
        result = await transaction.oneOrNone(query, [type])
        return result;
    }
    catch (error) {
        console.log("Error occurred in lookupType dao deleteById", error)
        throw error;
    }
}



module.exports = {
    add,
    edit,
    getByType,
    getAll,
    deleteByType,

}