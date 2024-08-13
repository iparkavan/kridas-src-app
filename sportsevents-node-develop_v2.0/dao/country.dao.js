const db = require("../utils/db");

const add = async (
  country_code,
  country_name,
  country_currency,
  country_states,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO country (country_code,country_name,country_currency,country_states,created_date,updated_date) 
        values ($1,$2,$3,$4,$5,$6) RETURNING *`;
    result = await transaction.one(query, [
      country_code,
      country_name,
      country_currency,
      country_states,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in countryDao add", error);
    throw error;
  }
};

const edit = async (
  country_name,
  country_currency,
  country_code,
  country_states,
  country_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update country set country_code=$1,country_name=$2,country_currency=$3 ,country_states=$4,updated_date=$5 where country_id=$6 RETURNING *`;
    result = await transaction.one(query, [
      country_code,
      country_name,
      country_currency,
      country_states,
      currentDate,
      country_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in countryDao edit", error);
    throw error;
  }
};

const getById = async (country_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from country where country_id = $1";
    result = await transaction.oneOrNone(query, [country_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in countryDao getById", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from country order by country_name asc;";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in countryDao getAll", error);
    throw error;
  }
};

const deleteById = async (country_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;

    let query = "delete from country where country_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [country_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in countryDao deleteById", error);
    throw error;
  }
};

const fetchcountrybyCode = async (country_code, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from country where country_code = $1";
    result = await transaction.oneOrNone(query, [country_code]);
    return result;
  } catch (error) {
    console.log("Error occurred in countryDao getcountryByCode", error);
    throw error;
  }
};

const getByCountryCodeIso = async (country_code_iso, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from country where country_code_iso2 = $1";
    result = await transaction.oneOrNone(query, [country_code_iso]);
    return result;
  } catch (error) {
    console.log("Error occurred in countryDao getByIsoCountryCode", error);
    throw error;
  }
};

// const fetchcountrybyName = async (country_name, connectionObj = null) => {
//     try {
//         let transaction = connectionObj !== null ? connectionObj : db
//         let query = 'select * from country where country_name = $1'
//         result = await transaction.oneOrNone(query, [country_name])
//         return result;
//     }
//         catch (error) {
//             console.log("Error occurred in countryDao getcountryByName", error)
//             throw error;

//     }

// }

module.exports = {
  add,
  edit,
  getById,
  getAll,
  deleteById,
  fetchcountrybyCode,
  // fetchcountrybyName,
  getByCountryCodeIso,
};
