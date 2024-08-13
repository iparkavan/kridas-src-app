const lookupDao = require('../dao/lookupType.dao')

/**
 *Method to create lookup type
 * @param {JSon} body 
 */
const insertLookupType = async (body) => {
    try {
        let result = null;
        let dbLookupType = null;
        const { lookup_type, lookup_desc } = body
        dbLookupType = await lookupDao.getByType(lookup_type);
        if (dbLookupType === null) {
            result = await lookupDao.add(lookup_type, lookup_desc)

        } else {
            result = { message: "Lookup already exist" };
        }
        return result;
    } catch (error) {
        console.log("Error occurred in insertLookupType: ", error);
        throw error;
    }
}

/**
 *Method to update lookup type
 * @param {JSon} body 
 */
const editLookupType = async (body) => {
    try {
        let result = null;
        let dbLookupType = null;
        const { lookup_type, lookup_desc } = body
        let query = `update lookup_type set lookup_desc= $2 where lookup_type =$1  returning *`
        dbLookupType = await lookupDao.getByType(lookup_type);
        if (dbLookupType !== null) {
            result = await lookupDao.edit(lookup_type, lookup_desc)
        } else {
            result = { message: "lookup type not exist" };
        }
        return result;
    } catch (error) {
        console.log("Error occurred in editLookupType: ", error);
        throw error;
    }
}

/**
 * Method to get lookup type based on type
 * @param {string} type 
 */
const fetchLookupType = async (type) => {
    try {
        let result = await lookupDao.getByType(type);
        if(result === null){
            result = { message: "lookup type not exist" };
        }
        return result;
    } catch (error) {
        console.log("Error occurred in fetchLookupType: ", error);
        throw error;
    }
};

/**
 * Method to get all lookup type
 */
const fetchAll = async () => {
    try {
        return await lookupDao.getAll();
    } catch (error) {
        console.log("Error occurred in fetchAll: ", error);
        throw error;
    }
};

/**
 * Method to delete lookup type based on type
 * @param {string} type 
 */

const deleteLookupType = async (type) => {
    try {
      let lookupType = {
        data: null,
      };
      let data = await lookupDao.deleteByType(type);
      if (data === null) lookupType = { message: "lookupType not exist" };
      else lookupType["data"] = "Success";
      return lookupType;
    } catch (error) {
      console.log("Error occurred in delete lookup Type", error);
      throw error;
    }
};

module.exports = {
    insertLookupType,
    editLookupType,
    fetchLookupType,
    deleteLookupType,
    fetchAll
};