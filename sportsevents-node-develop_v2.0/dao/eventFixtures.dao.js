const db = require("../utils/db");

const getByEventId = async (event_id, image_type, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
        *
    from
        event_fixtures ef
    where
        ef.event_id = '${event_id}'
        and ef.image_type = '${image_type}'
    order by
        ef.sort_order asc`;
    result = await transaction.manyOrNone(query, [event_id, image_type]);
    return result;
  } catch (error) {
    console.log("Error occurred in Event Fixtures Dao : getByEventId", error);
    throw error;
  }
};

module.exports = {
  getByEventId,
};
