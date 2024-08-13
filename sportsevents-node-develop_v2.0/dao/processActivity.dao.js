const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

const add = async (data) => {
  try {
    let result = null;
    let transaction = db;
    let query = `
      INSERT into process_activity (process_activity_content)
      VALUES ($1)
      RETURNING *`;
    result = await transaction.manyOrNone(query, [JSON.stringify(data)]);
    return result;
  } catch (error) {
    console.log("Error occurred in activity log processActivityDao add", error);
    throw error;
  }
};

module.exports = {
  add,
};
