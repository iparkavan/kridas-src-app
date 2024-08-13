const eventSponsorDao = require("../dao/eventSponsor.dao");

/**
 *Method to create event sponsor
 * @param {JSON} body
 */
const createEventSponsor = async (body) => {
  let result = null;
  try {
    const {
      sponsor_id,
      event_id,
      tournamentid,
      is_featured = false,
      seq_number = 1,
      sponsor_type_id,
    } = body;
    result = await eventSponsorDao.add(
      sponsor_id,
      event_id,
      tournamentid,
      is_featured,
      seq_number,
      sponsor_type_id
    );
    return result;
  } catch (error) {
    console.log("Error occurred in create Event Sponsor", error);
    throw error;
  }
};

/**
 *Method to update event sponsor
 * @param {JSON} body
 */
const updateEventSponsor = async (body, connectionObj = null) => {
  let result = null;
  try {
    const {
      sponsor_id,
      event_id,
      tournamentid,
      is_featured,
      seq_number,
      sponsor_type_id,
      event_sponsor_id,
    } = body;
    let eventSponsor = await eventSponsorDao.getById(event_sponsor_id);

    if (eventSponsor === null && event_sponsor_id !== null) {
      result = { message: "eventSponsor not exist" };
      return result;
    } else {
      result = await eventSponsorDao.edit(
        sponsor_id,
        event_id,
        tournamentid,
        is_featured,
        seq_number,
        sponsor_type_id,
        event_sponsor_id,
        connectionObj
      );
      return result;
    }
  } catch (error) {
    console.log("Error occurred in edit Event Sponsor", error);
    throw error;
  }
};

/**
 * Method to get event sponsor based on event_sponsor_id
 * @param {int} event_sponsor_id
 */
const getById = async (event_sponsor_id) => {
  try {
    let eventSponsor = {};
    let data = await eventSponsorDao.getById(event_sponsor_id);
    if (data === null) eventSponsor = { message: "eventSponsor not exist" };
    else eventSponsor["data"] = data;
    return eventSponsor;
  } catch (error) {
    console.log("Error occurred in eventSponsor getById Service", error);
    throw error;
  }
};

/**
 * Method to get the eventSponsor based on event_id
 * @param {uuid} event_id
 */
const getByEventId = async (event_id) => {
  try {
    let eventSponsor = {
      data: null,
    };
    let data = await eventSponsorDao.getByEventId(event_id);
    if (data.length === 0) eventSponsor = { message: "eventSponsor not exist" };
    else eventSponsor["data"] = data;
    return eventSponsor;
  } catch (error) {
    console.log("Error occurred in fetch eventSponsor", error);
    throw error;
  }
};

/**
 * Method to get all event sponsors
 */
const getAll = async () => {
  try {
    let eventSponsor = null;
    let data = await eventSponsorDao.getAll();
    eventSponsor = data;
    return eventSponsor;
  } catch (error) {
    console.log("Error occurred in getAll eventSponsors", error);
    throw error;
  }
};

/**
 * Method to delete eventSponsor based on event_sponsor_id
 * @param {int} event_sponsor_id
 */
const deleteById = async (event_sponsor_id) => {
  try {
    let eventSponsor = {};
    let data = await eventSponsorDao.deleteById(event_sponsor_id);
    if (data === null) eventSponsor = { message: "eventSponsor not exist" };
    else eventSponsor["data"] = "Deleted Successfully!";
    return eventSponsor;
  } catch (error) {
    console.log("Error occurred in delete eventSponsor", error);
    throw error;
  }
};

module.exports = {
  createEventSponsor,
  updateEventSponsor,
  getById,
  getByEventId,
  getAll,
  deleteById,
};
