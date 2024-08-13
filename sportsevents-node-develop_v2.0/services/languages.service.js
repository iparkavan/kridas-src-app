const languagesDao = require('../dao/languages.dao')

/**
 *Method to create languages
 * @param {JSon} body 
 */
const createLanguage = async (body) => {
    try {
        let result = null;
        const {language_code, language_name, created_by} = body
        result = await languagesDao.add(language_code, language_name, created_by)
        return result;
    } catch (error) {
        console.log("Error occurred in createlanguages", error)
        throw error;
    }
}

/**
 * Method to get language name based on language id 
 * @param {int} language_id 
 */

const fetchLanguage = async (language_id) => {
    try {
        let Languages = {
            data: null,
        };
        let data = await languagesDao.fetchById(language_id)
        if (data === null) Languages = { message: "Languages not exist" };
        else Languages["data"] = data;
        return Languages;
    } catch (error) {
        throw error;
    }
};


/**
 * Method to get all languages
 */
const fetchAllLanguage = async () => {
    try {
        let result = null;
        result = await languagesDao.getAll();
        return result;
    }
    catch (error) {
        console.log("Error occurred in fetchAll language", error)
        throw error;
    }
}

/**
 *Method to update languages
 * @param {JSon} body 
 */
 const editLanguage = async (body) => {
    try {
        let result = null;
        const {language_code, language_name, updated_by, language_id} = body;
        result = await languagesDao.edit(language_code, language_name, updated_by, language_id);
        return result;
    } catch (error) {
        console.log("Error occurred in editLanguages", error)
        throw error;
    }
}

/**
 * Method to delete language based on language id
 * @param {int} language_id 
 */

const deleteLanguage = async (language_id) => {
    try {
        let Languages= {
            data: null,
        };
        let data = await languagesDao.deleteById(language_id)
        if (data === null) Languages = { message: "Languages not exist" };
        else Languages["data"] = "Deleted Successfully!";
        return Languages;

    } catch (error) {
        throw error;
    }
};

module.exports = {
    createLanguage,
    fetchAllLanguage,
    deleteLanguage,
    editLanguage,
    fetchLanguage
};