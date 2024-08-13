const eventFixturesDao = require("../dao/eventFixtures.dao");
const eventsDao = require("../dao/events.dao");

/**
 * Method to get event_fixtures based on event_id
 * @param {JSON} body
 * @returns
 */
const getByEventId = async (body) => {
  try {
    let result = {};
    const { event_id, image_type } = body;
    let eventData = await eventsDao.getById(event_id);
    if (eventData === null) {
      return (result = { message: "Event Id Not Exist" });
    }
    let data = await eventFixturesDao.getByEventId(event_id, image_type);
    if (data.length === 0) result = "[]";
    else result = data;
    return result;
  } catch (error) {
    console.log(
      "Error occurred in Event Fixtures Service : getByEventId",
      error
    );
    throw error;
  }
};

module.exports = {
  getByEventId,
};
