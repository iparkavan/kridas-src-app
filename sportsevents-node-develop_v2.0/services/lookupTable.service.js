const { fetchLookupType } = require('../services/lookupType.service')
const lookupTableDao = require('../dao/lookupTable.dao')
const lookupDao = require('../dao/lookupType.dao')

/**
 *Method to create lookup table
 * @param {JSon} body 
 */
const createLookupTable = async (body) => {
    try {
        let result = null;
        const { lookup_key, lookup_value, lookup_type } = body
        let dbLookupType = await fetchLookupType(lookup_type);
        let dbLookupTable = null;
        dbLookupTable = await fetchLookupKeyAndType(lookup_key, lookup_type);
        console.log("dblookuptable", dbLookupTable)
        if (dbLookupTable !== null) {
            result = { message: "lookup table already exist" };
        }
        else if (dbLookupType !== null) {
            result = await lookupTableDao.add(lookup_key, lookup_value, lookup_type)
        } else {
            result = { message: "lookup type is not exist" }
        }
        return result;
    }
    catch (error) {
        console.log("Error occurred in createLookupTable", error)
        throw error;
    }
}

/**
 *Method to update lookup table
 * @param {JSon} body 
 */
const editLookupTable = async (body) => {
    try {
        let result = null;
        const { lookup_key, lookup_value, lookup_type } = body;
        let dbLookupType = await fetchLookupType(lookup_type);
        if (dbLookupType !== null) {
            result = await lookupTableDao.edit(lookup_value, lookup_type, lookup_key)
        } else {
            result = { message: "lookup type is not exist" }
        }
        return result;
    }
    catch (error) {
        console.log("Error occurred in editLookupTable", error)
        throw error;
    }
}

/**
 * Method to get lookup based on key and type
 * @param {String} lookupKey 
 * @param {String} lookUpType 
 */

const fetchLookupKeyAndType = async (lookup_key, lookup_type) => {
    try {
        let dbLookupKeyAndType = await lookupTableDao.getByKeyAndType(lookup_key, lookup_type);
        let result = await lookupDao.getByType(lookup_type);
        let key = await lookupTableDao.getByKey(lookup_key)
        if (result === null || key === null) {
            dbLookupKeyAndType = { message: "lookup type and key not exist" };
        }
        return dbLookupKeyAndType;

        // if (dbLookupKeyAndType === null) {
        // result = { message: "lookup key and type not exist" };
        // return result;
        // } else {
        // let data =lookupTableDao.getByKeyAndType(lookup_key, lookup_type)
        // return data;
        // }else{
        //     result = { message: "lookup key and type not exist" };
        //     return result;
        // }
    }
    catch (error) {
        console.log("Error occurred in fetch By Key And Type", error)
        throw error;
    }
};

/**
 * Method to get lookup table based on key
 * @param {String} key 
 */

const fetchLookupTable = async (key) => {
    try {
        let dbLookupKey = await lookupTableDao.getByKey(key);

        if (dbLookupKey === null) {
            result = { message: "lookup key not exist" };
            return result;
        } else {
            let data = await lookupTableDao.getByKey(key)
            return data;
        }
    }
    catch (error) {
        console.log("Error occurred in fetchByKey", error)
        throw error;
    }
};


/**
 * Method to get lookup table based on type
 * @param {string} type 
 */
const fetchByType = async (type) => {
    try {
        let dbLookupType = await fetchLookupType(type);
        console.log("lookup type", dbLookupType)

        if (dbLookupType === null) {
            result = { message: "lookup type not exist" };
            return result;
        } else {
            let data = await lookupTableDao.getByType(type)
            return data;
        }
    }
    catch (error) {
        console.log("Error occurred in fetchByType", error)
        throw error;
    }
};

/**
 * Method for delete the Look up Table
 * @param {string} key 
 * @param {string} type 
 * @returns 
 */
const deleteLookupTable = async (key, type) => {
    try {
        let lookupTable = {
            data: null,
        };
        let data = await lookupTableDao.deleteByKey(key, type)
        if (data === null) lookupTable = { message: "lookupTable not exist" };
        else lookupTable["data"] = "Success";
        return lookupTable;
    } catch (error) {
        console.log("Error occurred in delete lookupTable", error);
        throw error;
    }
};

module.exports = {
    createLookupTable,
    editLookupTable,
    fetchLookupTable,
    deleteLookupTable,
    fetchLookupKeyAndType,
    fetchByType
};