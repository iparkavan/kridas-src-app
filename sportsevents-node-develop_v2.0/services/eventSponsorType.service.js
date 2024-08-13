const eventSponsorTypeDao = require("../dao/eventSponsorType.dao");
const eventService = require("../services/events.service");

/**
 * Method to add new event Sponsor Type
 * @param {json} body
 */
const createEventSponsorType = async (body) => {
  try {
    let result = null;
    const {
      event_sponsor_type_name,
      event_id,
      sort_order = 0,
      is_deleted = false,
    } = body;

    result = await eventSponsorTypeDao.add(
      event_sponsor_type_name,
      event_id,
      sort_order,
      is_deleted
    );
    return result;
  } catch (error) {
    console.log("Error occurred in createEventSponsorType", error);
    throw error;
  }
};

/**
 * Method to get event Sponsor Type based on event SponsorType id
 * @param {int} event_sponsor_type_id
 */
const fetchEventSponsorType = async (event_sponsor_type_id) => {
  try {
    let eventSponsorType = {
      data: null,
    };
    let data = await eventSponsorTypeDao.getById(event_sponsor_type_id);
    if (data === null)
      eventSponsorType = { message: "event Sponsor Type not exist" };
    else eventSponsorType["data"] = data;
    return eventSponsorType;
  } catch (error) {
    console.log("Error occurred in fetchEventSponsorType", error);
    throw error;
  }
};

/**
 * Method to get event Sponsor Type list
 */
const fetchAll = async () => {
  try {
    let data = await eventSponsorTypeDao.getAll();
    return data;
  } catch (error) {
    console.log("Error occurred in fetchAll", error);
    throw error;
  }
};

/**
 * Method to update existing event Sponsor Type
 * @param {json} body
 */
const editEventSponsorType = async (body) => {
  try {
    let eventSponsorType = null;
    let result = null;
    let event = null;
    const {
      event_sponsor_type_name,
      event_id,
      sort_order = 0,
      is_deleted = false,
      event_sponsor_type_id,
    } = body;
    eventSponsorType = await eventSponsorTypeDao.getById(event_sponsor_type_id);
    event = await eventService.fetchEvent(event_id);

    if (eventSponsorType === null) {
      result = { message: " eventSponsorType not found" };
      return result;
    }

    if (!(event?.message === undefined)) {
      result = { message: " event not found" };
      return result;
    }

    result = await eventSponsorTypeDao.edit(
      event_sponsor_type_name,
      event_id,
      sort_order,
      is_deleted,
      event_sponsor_type_id
    );
    return result;
  } catch (error) {
    console.log("Error occurred in editEventSponsorType", error);
    throw error;
  }
};

/**
 * Method to delete event Sponsor Type based on event Sponsor Type id
 * @param {int}  event_sponsor_type_id
 */
const deleteEventSponsorType = async (event_sponsor_type_id) => {
  try {
    let result = {};
    let eventSponsorExist = await eventSponsorTypeDao.getById(
      event_sponsor_type_id
    );
    if (eventSponsorExist === null)
      result = { message: "event Sponsor Type not exist" };
    else {
      let data = await eventSponsorTypeDao.deleteById(event_sponsor_type_id);
      result["data"] = "Deleted Successfully!";
    }

    return result;
  } catch (error) {
    console.log("Error occurred in deleteEventSponsorType", error);
    throw error;
  }
};

module.exports = {
  fetchAll,
  createEventSponsorType,
  fetchEventSponsorType,
  editEventSponsorType,
  deleteEventSponsorType,
};
