const db = require('../utils/db');
const { preRegisterMail } = require("../services/mail.service");

/**
 * Method for pre register email
 * @returns 
 */
const PreRegisterMail = async (data) => {
    try {
        let result = null;
        if (data.first_name === undefined) {
            result = { message: "first_name is required" }
            return result
        }
        if (data.email === undefined) {
            result = { message: "email is required" }
            return result
        }
        if (data.profile === undefined) {
            result = { message: "profile is required" }
            return result
        }
        if (data.sports === undefined) {
            result = { message: "Sport is required" }
            return result
        }
        result = await preRegisterMail(data)
        return result;

    } catch (error) {
        console.log("Error occurred in preRegister ", error);
        throw error;
    }
};

/**
 * Method for fetch array of pre registered email 
 * @returns 
 */
const arrayMail = async (data) => {
    try {
        let result = null;
        data.map(async (value) => {
            result = await PreRegisterMail(value)
        })
        return result = { Status: "Ok" };

    } catch (error) {
        console.log("Error occurred in preRegister ", error);
        throw error;
    }

}

module.exports = {
    PreRegisterMail,
    arrayMail
}