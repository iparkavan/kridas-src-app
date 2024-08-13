const db = require('../utils/db');
const userService = require('../services/user.service')
const categoryService = require('../services/category.service')
const sportService = require('../services/sports.service')
const userStatisticsDao = require('../dao/userStatistics.dao')
const userDao = require('../dao/user.dao')
const { documentUpload, deleteDocuments } = require('../utils/common')
const fs = require("fs");

/**
 * Method for add multiple user statistics
 * @param {JSON} body 
 * @returns 
 */
const addMultipleUserStatistics = async (body, connectionObj = null) => {
    try {
        const { files, userStats = null, user_id } = body
        let result = await db.tx(async (transaction) => {
            let statsArr = []
            let statsIds = [0]
            let count = 0
            let type = 'STATS'
            await userStatisticsDao.deleteStatistcsByUserId(user_id, type, transaction)
            if (userStats !== null && JSON.parse(userStats).length > 0) {
                for await (let stats of JSON.parse(userStats)) {
                    // if (count === 0) {
                    //     // user_id = stats?.user_id;
                    //     await userStatisticsDao.deleteStatistcsByUserId(user_id, type, transaction)
                    //     // await userStatisticsDao.hardDeleteStatistcsByUserId(stats?.user_id, type, transaction)
                    // }
                    let file = await getDocs(files, count)
                    stats["files"] = file.length > 0 ? { "document": file } : {}
                    let data = await addUserStatistics(stats, transaction)
                    statsIds.push(data?.user_statistics_id);
                    statsArr.push(data);
                    count++
                }
                // await userStatisticsDao.hardDeleteStatistcsByUserId(user_id, type, statsIds.toString(), transaction)
            }
            await userStatisticsDao.hardDeleteStatistcsByUserId(user_id, type, statsIds.toString(), transaction)

            return statsArr;
        }).then(data => {
            console.log("successfully data returned")
            return data;
        }).catch(error => {
            console.log("failure, ROLLBACK was executed", error)
            throw error;
        });
        return result;
    }
    catch (error) {
        console.log("Error occurred in Create UserStatistics", error)
        throw error;
    }
}

/**
 * Method to get docs
 * @param {file} files 
 * @returns 
 */
const getDocs = async (files, key) => {
    try {
        return files.filter((file) => {
            if (file?.fieldname === `document[${key}]`)
                return file;
        })
    } catch (error) {
        console.log("Error occurred in getDocs", error)
        throw error;
    }
}

/**
 * Method to create new user statistics with transaction
 * @param {JSON} body 
 * @returns 
 */
const addUserStatistics = async (body, connectionObj = null) => {
    try {
        let result = null;
        const { user_id, sports_id, skill_level = null, playing_status = 'AC', statistics_desc = null, sportwise_statistics = null, statistics_links = null, statistics_docs = [], files = {} } = body
        let transaction = connectionObj !== null ? connectionObj : db
        let count = await userStatisticsDao.checkDuplicate(user_id, sports_id, transaction);
        let identity_docs = [];

        let sportwiseStatistics = sportwise_statistics === null ? '{"statsInfo": [{"statsSubInfo": {}}]}' : sportwise_statistics
        if (count?.count === undefined) {
            // S3 file upload
            if (JSON.stringify(files) !== JSON.stringify({}))
                identity_docs = await documentUpload(files);
            result = await userStatisticsDao.add(user_id, sports_id, skill_level, playing_status, statistics_desc, sportwiseStatistics, statistics_links, JSON.stringify(identity_docs), transaction)
        } else {
            body["user_statistics_id"] = count.user_statistics_id;
            body["statistics_docs"] = JSON.stringify(statistics_docs)
            result = await editUserStatistics(body, transaction)
        }
        return result;
    }
    catch (error) {
        console.log("Error occurred in Create UserStatistics", error)
        throw error;
    }
}


/**
 * Method to create new user statistics 
 * @param {JSON} body 
 * @returns 
 */
const createUserStatistics = async (body, connectionObj = null) => {
    let result = null;
    try {
        const { user_id, sports_id, skill_level = null, playing_status = 'AC', statistics_desc = null, sportwise_statistics = null, statistics_links = null, statistics_docs = '[]', files = null } = body
        let transaction = connectionObj !== null ? connectionObj : db

        //ckeck duplicate data

        if (user_id != null) {
            const user = await userService.fetchUser(user_id);
            if (!(user?.message === undefined)) {
                result = { message: "user not exist" }
                return result;
            }
        }

        if (sports_id != null) {
            const sport = await sportService.fetchSport(sports_id);
            if (!(sport?.message === undefined)) {
                result = { message: "sport not exist" }
                return result;
            }
        }

        // let { count } = await userStatisticsDao.checkDuplicate(user_id, sports_id);
        // if (Number(count) !== 0) {
        //     result = { message: "user and sport combination already exist" }
        //     return result;
        // }

        if (skill_level != null) {
            const category = await categoryService.fetchCategory(skill_level);
            if (!(category?.message === undefined)) {
                result = { message: "category not exist" }
                return result;
            }
        }

        let identity_docs = [];
        // S3 file upload
        if (JSON.stringify(files) !== JSON.stringify({}))
            identity_docs = await documentUpload(files);


        let count = await userStatisticsDao.checkDuplicate(user_id, sports_id);

        let sportwiseStatistics = sportwise_statistics === null ? '{"statsInfo": [{"statsSubInfo": {}}]}' : sportwise_statistics
        if (count?.count === undefined) {
            result = await userStatisticsDao.add(user_id, sports_id, skill_level, playing_status, statistics_desc, sportwiseStatistics, statistics_links, JSON.stringify(identity_docs), transaction)
        } else {
            body["user_statistics_id"] = count.user_statistics_id;
            // body["statistics_docs"] = JSON.stringify(count.statistics_docs)
            result = await editUserStatistics(body, transaction)
        }

        // result = await userStatisticsDao.add(user_id, sports_id, skill_level, playing_status, statistics_desc, sportwise_statistics, sport_career, statistics_links, JSON.stringify(identity_docs), transaction)
        return result;
    }
    catch (error) {
        console.log("Error occurred in Create UserStatistics", error)
        throw error;
    }
}

/**
 * Method to update new user statistics 
 * @param {JSON} body 
 * @returns 
 */
const editUserStatistics = async (body, connectionObj = null) => {
    try {
        let result = null;
        let userStatistics = null;
        const { user_statistics_id, user_id, sports_id, skill_level, playing_status, statistics_desc, sportwise_statistics, statistics_links, statistics_docs = '[]', files = {} } = body
        if (user_statistics_id != null) {
            userStatistics = await fetchUserStatistics(user_statistics_id, connectionObj)
            if (!(userStatistics.message === undefined)) {
                result = { message: "userStatistics not found" }
                return result;
            }
        }

        // if (user_id != null) {
        //     const user = await userService.fetchUser(user_id, connectionObj);
        //     if (!(user?.message === undefined)) {
        //         result = { message: "user not exist" }
        //         return result;
        //     }
        // }

        // if (sports_id != null) {
        //     const sport = await sportService.fetchSport(sports_id, connectionObj);
        //     if (!(sport?.message === undefined)) {
        //         result = { message: "sport not exist" }
        //         return result;
        //     }
        // }

        // if (skill_level != null) {
        //     const category = await categoryService.fetchCategory(skill_level, connectionObj);
        //     if (!(category?.message === undefined)) {
        //         result = { message: "category not exist" }
        //         return result;
        //     }
        // }

        let identity_docs = JSON.parse(statistics_docs).filter(doc => doc.is_delete === "N");
        let deleted_doc_list = JSON.parse(statistics_docs).filter(doc => doc.is_delete === "Y");
        // S3 file upload
        if (JSON.stringify(files) !== JSON.stringify({})) {
            let docRespons = await documentUpload(files);
            identity_docs = [...identity_docs, ...docRespons]
        }

        //test s3 delete 
        await deleteDocuments(deleted_doc_list)

        result = await userStatisticsDao.edit(user_id, sports_id, skill_level, playing_status, statistics_desc, sportwise_statistics, statistics_links, JSON.stringify(identity_docs), user_statistics_id, connectionObj)
        return result;
    }
    catch (error) {
        console.log("Error occurred in update UserStatistics", error)
        throw error;
    }
}

/**
 * Method to get user statistics by user statistics id
 * @param {int8} user_statistics_id 
 * @returns 
 */
const fetchUserStatistics = async (user_statistics_id, connectionObj = null) => {
    try {
        let result = {
            data: null,
        }
        let data = await userStatisticsDao.getById(user_statistics_id, connectionObj);
        if (data === null)
            result = { message: "userStatistics not exist" }
        else
            result["data"] = data;

        return result;
    } catch (error) {
        console.log("Error occurred in fetch userStatistics", error)
        throw error;
    }
};

/**
 * Method to get all user statistics
 * @returns 
 */
const fetchAll = async () => {
    try {
        let result = {
            data: null,
        };
        let data = await userStatisticsDao.getAll();
        if (data === null)
            result = { message: "UserStatistics not exist" }
        else
            result["data"] = data;

        return result;
    } catch (error) {
        console.log("Error occurred in fetchAll UserStatistics", error)
        throw error;
    }
};

/**
 * Method to delete user statistics by user statistics id
 * @param {int8} user_statistics_id 
 * @returns 
 */
const deleteUserStatistics = async (user_statistics_id, type = "S") => {
    let result = {
        data: null,
    };
    try {
        let userStats = await userStatisticsDao.getById(user_statistics_id);
        let stats = null;
        let statsFormat = '{"statsInfo": [{"statsSubInfo":{}}]}'
        if (userStats === null) {
            result = { message: "UserStatistics not exist" }
        } else {
            if (type === 'C') {
                if (userStats?.skill_level === null && JSON.stringify(userStats?.sportwise_statistics) === JSON.stringify(statsFormat))
                    stats = userStatisticsDao.deleteById(user_statistics_id)
                else
                    stats = userStatisticsDao.deleteCareerById(user_statistics_id)
            } else {
                if (userStats?.sport_career !== null && userStats?.sport_career?.length > 0)
                    stats = userStatisticsDao.deleteStatsById(user_statistics_id)
                else
                    stats = userStatisticsDao.deleteById(user_statistics_id)

            }
            result["data"] = "Success";
        }


        // let data = await userStatisticsDao.deleteById(user_statistics_id);
        // if (data === null)
        //     result = { message: "UserStatistics not exist" }
        // else
        //     result["data"] = "Success";
        return result;
    } catch (error) {
        console.log("Error occurred in delete UserStatistics", error)
        throw error;
    }
};

/**
 * Fetch company by UserStatistics user id
 * @param {uuid} user_id
 */
const fetchUserId = async (user_id) => {
    try {
        let result = {
            data: null,
        }
        let user = null;
        user = await userDao.getById(user_id);
        if (user === null && user_id !== null)
            return result = { message: "user not exist" }

        let data = await userStatisticsDao.getByUserId(user_id);
        if (data === null)
            result = { message: "userStatistics not exist" }
        else
            result["data"] = data;

        return result;
    } catch (error) {
        console.log("Error occurred in fetchUserId userStatistics", error)
        throw error;
    }
};

/**
 * Method to create sports career
 * @param {JSON} body  
 * @returns 
 */
const createSportsCareer = async (body, connectionObj = null) => {
    let result = null;
    try {
        const { user_id, sports_id, sports_career } = body
        let duplicate = await userStatisticsDao.checkDuplicate(user_id, sports_id)
        if (duplicate?.count === undefined) {
            result = await userStatisticsDao.addSportCareer(user_id, sports_id, sports_career)
        } else {
            result = await userStatisticsDao.addSportCareer(user_id, sports_id, sports_career, duplicate.user_statistics_id)
        }
        return result;
    }
    catch (error) {
        console.log("Error occurred in Create UserStatistics", error)
        throw error;
    }
}

/**
 * Method to create multiple sports career
 * @param {JSON} body  
 * @returns 
 */
const createSportsCareers = async (body, connectionObj = null) => {
    let result = null;
    try {
        const { user_id, sports_careers } = body
        result = await db.tx(async (transaction) => {
            let statsArr = []
            let type = 'CAREER'
            await userStatisticsDao.deleteStatistcsByUserId(user_id, type, transaction)
            await userStatisticsDao.hardDeleteStatistcsByUserId(user_id, type, null, transaction)
            if (sports_careers && sports_careers.length > 0) {
                for await (const sports of sports_careers) {
                    let duplicate = await userStatisticsDao.checkDuplicate(user_id, sports?.sports_id, transaction)
                    if (duplicate?.count === undefined) {
                        let data = await userStatisticsDao.addSportCareer(user_id, sports?.sports_id, sports?.sport_career, null, transaction)
                        statsArr.push(data);
                    } else {
                        let data = await userStatisticsDao.addSportCareer(user_id, sports?.sports_id, sports?.sport_career, duplicate.user_statistics_id, transaction)
                        statsArr.push(data);
                    }
                }
            }
            return statsArr;
        }).then(data => {
            console.log("successfully data returned")
            return data;
        }).catch(error => {
            console.log("failure, ROLLBACK was executed", error)
            throw error;
        });
        // for (const sports of sports_careers) {
        //     let duplicate = await userStatisticsDao.checkDuplicate(user_id, sports?.sports_id)
        //     if (duplicate?.count === undefined) {
        //         result = await userStatisticsDao.addSportCareer(user_id, sports?.sports_id, sports?.sport_career)
        //     } else {
        //         result = await userStatisticsDao.addSportCareer(user_id, sports?.sports_id, sports?.sport_career, duplicate.user_statistics_id)
        //     }
        // }

        return result;
    }
    catch (error) {
        console.log("Error occurred in Create UserStatistics", error)
        throw error;
    }
}

/**
 * Method to Update User Statistics
 * @param {JSON} body 
 * @returns 
 */
const editUserStatisticsInfo = async (body) => {
    try {
        let result = null;
        let userStatistics = null;
        const { user_statistics_id, user_id, sports_id, skill_level, playing_status, statistics_desc, sportwise_statistics, sport_career, statistics_links, statistics_docs = '[]', files = null } = body
        if (user_statistics_id != null) {
            userStatistics = await fetchUserStatistics(user_statistics_id)
            if (!(userStatistics.message === undefined)) {
                result = { message: "userStatistics not found" }
                return result;
            }
        }

        if (user_id != null) {
            const user = await userService.fetchUser(user_id);
            if (!(user?.message === undefined)) {
                result = { message: "user not exist" }
                return result;
            }
        }

        if (sports_id != null) {
            const sport = await sportService.fetchSport(sports_id);
            if (!(sport?.message === undefined)) {
                result = { message: "sport not exist" }
                return result;
            }
        }

        if (skill_level != null) {
            const category = await categoryService.fetchCategory(skill_level);
            if (!(category?.message === undefined)) {
                result = { message: "category not exist" }
                return result;
            }
        }

        let identity_docs = JSON.parse(statistics_docs).filter(doc => doc.is_delete === "N");
        let deleted_doc_list = JSON.parse(statistics_docs).filter(doc => doc.is_delete === "Y");
        // S3 file upload
        if (JSON.stringify(files) !== JSON.stringify({})) {
            let docRespons = await documentUpload(files);
            identity_docs = [...identity_docs, ...docRespons]
        }

        //test s3 delete 
        await deleteDocuments(deleted_doc_list)

        result = await userStatisticsDao.editUserStatisticsInfo(user_id, sports_id, skill_level, playing_status, statistics_desc, sportwise_statistics, sport_career, statistics_links, JSON.stringify(identity_docs), user_statistics_id)
        return result;
    }
    catch (error) {
        console.log("Error occurred in update UserStatistics", error)
        throw error;
    }
}

module.exports = {
    createUserStatistics,
    fetchUserStatistics,
    deleteUserStatistics,
    fetchAll,
    editUserStatistics,
    fetchUserId,
    createSportsCareers,
    createSportsCareer,
    editUserStatisticsInfo,
    addMultipleUserStatistics
};