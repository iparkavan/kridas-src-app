const db = require('../utils/db');

const add = async (lookup_key, lookup_value, lookup_type, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'INSERT INTO lookup_table (lookup_key,lookup_value,lookup_type) VALUES ($1, $2,$3) RETURNING *'
        result = await transaction.one(query, [lookup_key, lookup_value, lookup_type]);
        return result;
    }
    catch (error) {
        console.log("Error occurred in lookupTableDao add", error)
        throw error;
    }
}

const edit = async (lookup_value, lookup_type, lookup_key, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `update lookup_table set lookup_value= $1 where lookup_type=$2 and lookup_key =$3  returning *`
        result = await transaction.one(query, [lookup_value, lookup_type, lookup_key])
        return result;
    }
    catch (error) {
        console.log("Error occurred in lookupTableDao edit", error)
        throw error;
    }
}
const getByKeyAndType = async (lookup_key, lookup_type, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from lookup_table where lookup_key = $1 and lookup_type=$2'
        result = await transaction.oneOrNone(query, [lookup_key, lookup_type])
        return result;
    }
    catch (error) {
        console.log("Error occurred in lookupTableDao getByKeyAndType", error)
        throw error;
    }

}

const getByKey = async (key, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from lookup_table where lookup_key = $1'
        result = await transaction.manyOrNone(query, [key])
        return result;
    }
    catch (error) {
        console.log("Error occurred in lookupTableDao getByKey", error)
        throw error;
    }
}
const getByType = async (type, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from lookup_table where lookup_type = $1 order by lookup_key ASC'
        result = await transaction.manyOrNone(query, [type])
        return result;
    }
    catch (error) {
        console.log("Error occurred in lookupTableDao getByType", error)
        throw error;
    }
}

const deleteByKey = async (key,type, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'delete from lookup_table where lookup_key = $1 and lookup_type = $2  RETURNING *'
        result = await transaction.oneOrNone(query, [key,type])
        return result;
    }
    catch (error) {
        console.log("Error occurred in lookupTableDao deleteByKey", error)
        throw error;
    }
}


module.exports = {
    add,
    edit,
    deleteByKey,
    getByType,
    getByKeyAndType,
    getByKey
}