const db = require('../utils/db');

const add = async (user_id, sports_id, skill_level, playing_status, statistics_desc, sportwise_statistics, statistics_links, identity_docs, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let currentDate = new Date();
        let sport_career = '[]'
        let query = `INSERT INTO user_statistics (user_id, sports_id, skill_level, playing_status, statistics_desc, sportwise_statistics,statistics_links,statistics_docs,created_date,updated_date,sport_career)  
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`
        let result = await transaction.one(query, [user_id, sports_id, skill_level, playing_status, statistics_desc, sportwise_statistics, JSON.stringify(statistics_links), identity_docs, currentDate, currentDate, sport_career]);
        return result;
    }
    catch (error) {
        console.log("Error occurred in user Statistics dao add ", error)
        throw error;
    }
}

const edit = async (user_id, sports_id, skill_level, playing_status, statistics_desc, sportwise_statistics, statistics_links, identity_docs, user_statistics_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let currentDate = new Date();
        let query = `UPDATE user_statistics SET user_id=$1, sports_id=$2, skill_level=$3, playing_status=$4, statistics_desc=$5, sportwise_statistics=$6,statistics_links=$7,statistics_docs=$8,updated_date=$9 WHERE user_statistics_id=$10 RETURNING *`
        result = await transaction.one(query, [user_id, sports_id, skill_level, playing_status, statistics_desc, sportwise_statistics, JSON.stringify(statistics_links), identity_docs, currentDate, user_statistics_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in user Statistics dao update", error)
        throw error;
    }
}

const getById = async (user_statistics_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `SELECT us.*,s.sports_name ,s.sports_code,c.category_name ,u.first_name ,
        s.sports_profile ,s.sports_role 
        FROM user_statistics us LEFT JOIN sports s ON us.sports_id = s.sports_id 
        left join category c on us.skill_level =c.category_id 
        left join users u on u.user_id =us.user_id where user_statistics_id =$1`

        result = await transaction.oneOrNone(query, [user_statistics_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in user Statistics dao getById", error)
        throw error;
    }
}

const getAll = async (connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select * from user_statistics'
        result = await transaction.manyOrNone(query, [])
        return result;
    }
    catch (error) {
        console.log("Error occurred in user Statistics dao getAll", error)
        throw error;
    }
}

const deleteById = async (user_statistics_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'delete from user_statistics where user_statistics_id = $1 RETURNING *'
        result = await transaction.oneOrNone(query, [user_statistics_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in user Statistics dao deleteById", error)
        throw error;
    }
}

const checkDuplicate = async (user_id, sport_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select us.*,count(us.*) from user_statistics us where us.user_id =$1 and us.sports_id =$2 group by us.user_statistics_id '
        result = await transaction.oneOrNone(query, [user_id, sport_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in user Statistics dao checkDuplicate", error)
        throw error;
    }
}

const getByUserId = async (user_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = 'select us.*,s.sports_name ,s.sports_role,s.sports_code,s.sports_profile,c.category_name from user_statistics us left join sports s on us.sports_id = s.sports_id left join category c on us.skill_level = c.category_id where user_id = $1'
        result = await transaction.manyOrNone(query, [user_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in user Statistics dao getByUserId", error)
        throw error;
    }
}

const addSportCareer = async (user_id, sports_id, sport_career, user_statistics_id, connectionObj = null) => {
    try {
        let query = null;
        let result = null;
        let currentDate = new Date();
        let sport_stats = '{"statsInfo": [{"statsSubInfo": {}}]}'
        let transaction = connectionObj !== null ? connectionObj : db
        if (user_statistics_id === null || user_statistics_id === undefined) {
            query = `INSERT INTO user_statistics (user_id, sports_id, sport_career,sportwise_statistics)  
            values ($1,$2,$3,$4) RETURNING *`
            result = await transaction.one(query, [user_id, sports_id, JSON.stringify(sport_career), sport_stats]);
        } else {
            query = `UPDATE user_statistics SET user_id=$1, sports_id=$2, sport_career=$3,updated_date=$4 WHERE user_statistics_id=$5 RETURNING *`
            result = await transaction.one(query, [user_id, sports_id, JSON.stringify(sport_career), currentDate, user_statistics_id]);
        }
        return result;
    }
    catch (error) {
        console.log("Error occurred in user Statistics dao add ", error)
        throw error;
    }
}

const editUserStatisticsInfo = async (user_id, sports_id, skill_level, playing_status, statistics_desc, sportwise_statistics, sport_career, statistics_links, identity_docs, user_statistics_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let currentDate = new Date();
        let query = `UPDATE user_statistics SET user_id=$1, sports_id=$2, skill_level=$3, playing_status=$4, statistics_desc=$5, sportwise_statistics=$6,sport_career = $7, statistics_links=$8,statistics_docs=$9,updated_date=$10 WHERE user_statistics_id=$11 RETURNING *`
        result = await transaction.one(query, [user_id, sports_id, skill_level, playing_status, statistics_desc, sportwise_statistics, sport_career, statistics_links, identity_docs, currentDate, user_statistics_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in user Statistics dao update", error)
        throw error;
    }
}

const deleteStatsById = async (user_statistics_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let statsFormat = '{"statsInfo": [{"statsSubInfo":{}}]}'
        let query = 'update user_statistics set sportwise_statistics =$2,skill_level=null where user_statistics_id = $1 RETURNING *'
        result = await transaction.oneOrNone(query, [user_statistics_id, statsFormat])
        return result;
    }
    catch (error) {
        console.log("Error occurred in user Statistics dao deleteStatsById", error)
        throw error;
    }
}

const deleteCareerById = async (user_statistics_id, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = `update user_statistics set sport_career ='[]' where user_statistics_id = $1 RETURNING *`
        result = await transaction.oneOrNone(query, [user_statistics_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in user Statistics dao deleteCareerById", error)
        throw error;
    }
}


const deleteStatistcsByUserId = async (user_id, type = 'CAREER', connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db
        let query = ``

        if (type === 'CAREER')
            query = `update user_statistics set sport_career ='[]' where user_id = $1 RETURNING *`
        else if (type === 'STATS')
            query = `update user_statistics set sportwise_statistics  = '{"statsInfo": [{"statsSubInfo": {}}]}', skill_level =null where user_id = $1 RETURNING *`

        result = await transaction.manyOrNone(query, [user_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in user Statistics dao deleteCareerById", error)
        throw error;
    }
}

const hardDeleteStatistcsByUserId = async (user_id, type = 'CAREER', stats_ids = null, connectionObj = null) => {
    try {
        let transaction = connectionObj !== null ? connectionObj : db

        let query = ``
        if (type === 'CAREER')
            query = `delete from user_statistics us where us.sportwise_statistics  = '{"statsInfo": [{"statsSubInfo": {}}]}' and us.skill_level notnull and us.user_id = $1 RETURNING *`
        else if (type === 'STATS' && stats_ids !== null)
            query = `delete from user_statistics us where us.sport_career  = '[]' and us.user_statistics_id not in (${stats_ids}) and us.user_id = $1 RETURNING *`

        result = await transaction.manyOrNone(query, [user_id])
        return result;
    }
    catch (error) {
        console.log("Error occurred in user Statistics dao deleteCareerById", error)
        throw error;
    }
}


module.exports = {
    add,
    edit,
    getById,
    getAll,
    deleteById,
    checkDuplicate,
    getByUserId,
    addSportCareer,
    editUserStatisticsInfo,
    deleteStatsById,
    deleteCareerById,
    deleteStatistcsByUserId,
    hardDeleteStatistcsByUserId
}