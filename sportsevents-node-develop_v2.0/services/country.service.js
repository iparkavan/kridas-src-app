const db = require("../utils/db");
const countryDao = require("../dao/country.dao");

/**
 * Method to add new country
 * @param {json} body
 */
const createCountry = async (body) => {
  try {
    let result = null;
    const { country_code, country_name, country_currency, country_states } =
      body;
    let date = new Date();
    console.log(JSON.parse(JSON.stringify(country_states)));
    result = await countryDao.add(
      country_code,
      country_name,
      country_currency,
      JSON.parse(JSON.stringify(country_states))
    );
    return result;
  } catch (error) {
    console.log("Error occurred in createCountry", error);
    throw error;
  }
};

/**
 * Method to update existing company
 * @param {json} body
 */
const editCountry = async (body) => {
  try {
    let result = null;
    const {
      country_id,
      country_code,
      country_name,
      country_currency,
      country_states,
    } = body;
    let country = await fetchCountry(country_id);
    if (country !== null) {
      result = await countryDao.edit(
        country_name,
        country_currency,
        country_code,
        JSON.parse(JSON.stringify(country_states)),
        country_id
      );
    } else {
      result = { message: "country is not exist" };
    }
    return result;
  } catch (error) {
    console.log("Error occurred in editCountry", error);
    throw error;
  }
};

/**
 * Method to get country based on country id
 * @param {int} country_id
 */
const fetchCountry = async (country_id) => {
  try {
    let country = {
      data: null,
    };
    let data = await countryDao.getById(country_id);
    if (data === null) country = { message: "country not exist" };
    else country["data"] = data;
    return country;
  } catch (error) {
    console.log("Error occurred in fetchCountry", error);
    throw error;
  }
};

/**
 * Method to get country list
 */
const fetchAll = async () => {
  try {
    let data = await countryDao.getAll();
    return data;
  } catch (error) {
    console.log("Error occurred in fetchAll", error);
    throw error;
  }
};

/**
 * Method to delete country based on country id
 * @param {int} country_id
 */
const deleteCountry = async (country_id) => {
  try {
    let country = {
      data: null,
    };
    let data = await countryDao.deleteById(country_id);
    if (data === null) country = { message: "country not exist" };
    else country["data"] = "Success";
    return country;
  } catch (error) {
    console.log("Error occurred in deleteCountry", error);
    throw error;
  }
};

/**
 * Method to get country based on country code
 * @param {string} country_code
 */
const fetchcountrybyCode = async (country_code) => {
  try {
    let country = {
      data: null,
    };
    let data = await countryDao.fetchcountrybyCode(country_code);
    return data;
  } catch (error) {
    console.log("Error occurred in fetchCountryCode", error);
    throw error;
  }
};

/**
 * Method to get country based on country code iso
 * @param {string} country_code_iso
 */
const getByCountryCodeIso = async (country_code_iso) => {
  try {
    let result = null;
    let data = await countryDao.getByCountryCodeIso(country_code_iso);
    if (data === null) {
      return (result = { message: "Country Not Exist for this Code" });
    }
    return (result = data);
  } catch (error) {
    console.log("Error occurred in getByCountryCodeIso", error);
    throw error;
  }
};

/**
 * Method fo get counntry by country name
 * @param {string} country_name
 * @returns
 */
const fetchCountryByName = (country_name) => {
  return new Promise(function (resolve, reject) {
    db.oneOrNone("select * from country where country_name = $1", [
      country_name,
    ])
      .then((data) => {
        console.log("country name get successfully: " + data);
        resolve(data);
      })
      .catch((error) => {
        console.log("object.. error " + JSON.stringify(error));
        reject(error);
      });
  });
};

module.exports = {
  createCountry,
  editCountry,
  fetchCountry,
  deleteCountry,
  fetchAll,
  fetchCountryByName,
  fetchcountrybyCode,
  getByCountryCodeIso,
};
