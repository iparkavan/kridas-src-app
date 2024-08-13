const db = require('../../utils/db');

const customQueryExecutor = async (customQuery, connectionObj=null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = customQuery
        result = await transaction.query(query, [])
        return result;
    }
    catch (error) {
        console.log("Error occurred in customQueryExecutor", error)
        throw error;
    }
}

module.exports = {
    customQueryExecutor

}