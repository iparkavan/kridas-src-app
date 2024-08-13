const db = require("../utils/db");

const add = async (
  sports_name,
  sports_desc,
  sports_format,
  sports_category,
  sports_age_group,
  sports_brand,
  sports_profile,
  sports_role,
  sports_code,
  is_stats_enabled,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO sports (sports_name,sports_desc,sports_format,sports_category,sports_age_group,created_date,updated_date,sports_brand,sports_profile,sports_role,sports_code,is_stats_enabled) 
        values ($1,$2,$3,$4,$5,$6,$7,$8::uuid[],$9,$10,$11,$12) RETURNING *`;
    result = await transaction.one(query, [
      sports_name,
      sports_desc,
      JSON.stringify(sports_format),
      JSON.stringify(sports_category),
      JSON.stringify(sports_age_group),
      currentDate,
      currentDate,
      sports_brand,
      JSON.stringify(sports_profile),
      JSON.stringify(sports_role),
      sports_code,
      is_stats_enabled,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in sportsDao add", error);
    throw error;
  }
};

const edit = async (
  sports_name,
  sports_desc,
  sports_format,
  sports_category,
  sports_age_group,
  sports_brand,
  sports_profile,
  sports_role,
  sports_code,
  is_stats_enabled,
  sports_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update sports set sports_name=$1,sports_desc=$2,sports_format=$3,sports_category=$4,sports_age_group=$5,updated_date=$6,sports_brand=$7::uuid[], sports_profile=$8, sports_role=$9 ,sports_code=$10,is_stats_enabled=$11 where sports_id=$12 RETURNING *`;
    result = await transaction.one(query, [
      sports_name,
      sports_desc,
      sports_format,
      sports_category,
      sports_age_group,
      currentDate,
      sports_brand,
      JSON.stringify(sports_profile),
      JSON.stringify(sports_role),
      sports_code,
      is_stats_enabled,
      sports_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in sportsDao edit", error);
    throw error;
  }
};

const getById = async (sports_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from sports where sports_id = $1";
    // let query ='select ARRAY_AGG(c.company_name),  s1.sports_name from company c left join (select UNNEST(s.sports_brand) sports_brand_name , s.* from sports s) s1 on s1.sports_brand_name=c.company_id where s1.sports_brand_name is not null and s1.sports_id=$1 group by s1.sports_name;'
    result = await transaction.oneOrNone(query, [sports_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in sportsDao getById", error);
    throw error;
  }
};

const getBrandCount = async (company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
            count(*)
        from
            sports s 
        where
            s.sports_brand && array ['${company_id}']::uuid[]`;
    result = await transaction.oneOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in sportsDao getById", error);
    throw error;
  }
};

const getCompanyNameBySportsId = async (sports_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select ARRAY_AGG(c.company_name),  s1.sports_name from company c left join (select UNNEST(s.sports_brand) sports_brand_name , s.* from sports s) s1 on s1.sports_brand_name=c.company_id where s1.sports_brand_name is not null and s1.sports_id=$1 group by s1.sports_name;";
    result = await transaction.oneOrNone(query, [sports_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in sportsDao getCompanyNameBySportsId", error);
    throw error;
  }
};

const fetchSportsByName = async (sports_name, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from sports where lower(sports_name) = lower($1) ";
    result = await transaction.oneOrNone(query, [sports_name]);
    return result;
  } catch (error) {
    console.log("Error occurred in sportsDao fetchSportsByName", error);
    throw error;
  }
};

const getSportNameBySportId = async (sport_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select s.sports_name  from sports s where s.sports_id =$1`;
    result = await transaction.oneOrNone(query, [sport_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in sportsDao getSportNameBySportId", error);
    throw error;
  }
};

const getAllSportsByStats = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from sports s where s.is_stats_enabled = true  order by sports_name asc";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in sportsDao getByStats", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from sports order by sports_name asc";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in sportsDao getAll", error);
    throw error;
  }
};

const deleteById = async (sports_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from sports where sports_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [sports_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in sportsDao deleteById", error);
    throw error;
  }
};

const checkDuplicate = async (sport_name, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select count(*) from sports where sports_name = $1";
    result = await transaction.oneOrNone(query, [sport_name]);
    return result;
  } catch (error) {
    console.log("Error occurred in sportsDao checkDuplicate", error);
    throw error;
  }
};

module.exports = {
  add,
  edit,
  getById,
  getBrandCount,
  getAllSportsByStats,
  fetchSportsByName,
  getAll,
  deleteById,
  checkDuplicate,
  getCompanyNameBySportsId,
  getSportNameBySportId,
};
