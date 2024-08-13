const eventMasterDao = require('../dao/eventMaster.dao')
const categoryDao = require('../dao/category.dao')
const organizerDao = require('../dao/organizer.dao')

/*
 * Method to create new eventMaster
 * @param {Json} body 
 */
const createEventMaster = async (body) => {
    try {
        let result = null;
        const { event_contacts = null, event_name, event_short_desc, event_desc, event_type, event_category_refid = null, event_owner_id } =
            body;
        let category = await categoryDao.getById(event_category_refid)
        if (category === null && event_category_refid != null) {
            result = { message: "category not exist" };
            return result
        }
        let organizer = await organizerDao.getById(event_owner_id)
        if (organizer === null) {
            result = { message: "organizer not exist" };
            return result
        }
        result = await eventMasterDao.add(event_contacts, event_name, event_short_desc, event_desc, event_type, event_category_refid, event_owner_id)
        return result;

    } catch (error) {
        console.log("Error occurred in createEventMaster", error);
        throw error;
    }
};

/**
 * Method to get event_master based on event_master_id
 * @param {uuid} event_master_id 
 */
const fetchById = async (event_master_id) => {
    try {
        let result = {};
        let data = await eventMasterDao.getById(event_master_id);
        if (data === null)
            result = { message: " event_master not exist" }
        else
            result["data"] = data;
        return result;
    } catch (error) {
        console.log("Error occurred in fetcheventmaster", error);
        throw error;
    }
};

/**
 * Method to get all event masters  
 */
const fetchAll = async () => {
    try {
        let data = await eventMasterDao.getAll();
        return data;
    } catch (error) {
        console.log("Error occurred in fetch event master", error);
        throw error;
    }
};

/**
 *Method to update existing event master
 * @param {JSon} body 
 */
const editEventMaster = async (body) => {
    let result = null;
    try {
        const { event_contacts = null, event_name, event_short_desc, event_desc, event_type, event_category_refid = null, event_owner_id, event_master_id } = body
        let category = await categoryDao.getById(event_category_refid)
        if (category === null && event_category_refid != null) {
            result = { message: "category not exist" };
            return result
        }
        let eventMaster = await eventMasterDao.getById(event_master_id)
        if (eventMaster === null) {
            result = { message: "eventMaster not exist" };
            return result
        }
        let organizer = await organizerDao.getById(event_owner_id)
        if (organizer === null) {
            result = { message: "organizer not exist" };
            return result
        }
        result = await eventMasterDao.edit(event_contacts, event_name, event_short_desc, event_desc, event_type, event_category_refid, event_owner_id, event_master_id);
        return result;
    } catch (error) {
        console.log("Error occurred in editEventMaster", error);
        throw error;
    }
}

/**
 * Method to delete comment info based on comment id
 * @param {uuid}  event_master_id
 */
const deleteEventMaster = async (event_master_id) => {
    try {
        let result = {};
        let data = await eventMasterDao.deleteById(event_master_id)
        if (data === null)
            result = { message: "event_master not exist" }
        else
            result["data"] = "Success";
        return result;
    } catch (error) {
        console.log("Error occurred in deleteEventMaster", error);
        throw error;
    }
};

module.exports = {
    createEventMaster,
    fetchById,
    fetchAll,
    editEventMaster,
    deleteEventMaster
};
