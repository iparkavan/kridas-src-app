const db = require("../utils/db");
const tournamentCategoriesDao = require("../dao/tournamentCategories.dao");
const tournamentDao = require("../dao/tournaments.dao");

const createTournamentCatgories = async (body, connectionObj = null) => {
  try {
    let result = null;
    const {
      tournament_refid,
      tournament_category,
      parent_category_id = null,
      tournament_format,
      reg_fee = null,
      reg_fee_currency = null,
      minimum_players = null,
      maximum_players = null,
      min_reg_count = null,
      max_reg_count = null,
      seeded_teams = null,

      age_restriction = null,
      sex_restriction = null,
      average_age = null,
      tournament_config,
      participant_dob_startdate,
      participant_dob_enddate,
      tournament_category_name,
      tournament_category_prizes,
      tournament_category_desc,
      max_age,
      min_age,
      min_male = null,
      max_male = null,
      min_female = null,
      max_female = null,
      doc_list = null,
    } = body;

    // if (parent_category_id !== null) {
    //     let data = await tournamentCategoriesDao.getById(parent_category_id);
    //     if (data === null) {
    //         result = { message: "parent_category_id not Found" }
    //         return result;
    //     }
    // }

    // let TournamentReferId = await tournamentDao.getById(tournament_refid);

    // if (TournamentReferId === null) {
    //     result = { message: "TournamentReferId not Found" }
    //     return result;
    // }
    result = await tournamentCategoriesDao.add(
      tournament_refid,
      tournament_category,
      parent_category_id,
      tournament_format,
      reg_fee,
      reg_fee_currency,
      minimum_players,
      maximum_players,
      min_reg_count,
      max_reg_count,
      seeded_teams,

      age_restriction,
      sex_restriction,
      average_age,
      tournament_config,
      participant_dob_startdate,
      participant_dob_enddate,
      tournament_category_name,
      tournament_category_prizes,
      tournament_category_desc,
      max_age,
      min_age,
      min_male,
      max_male,
      min_female,
      max_female,
      doc_list,
      connectionObj
    );
    return result;
  } catch (error) {
    console.log(
      "Error occurred in create tournament catgeories service ",
      error
    );
    throw error;
  }
};

const updateTournament = async (body, connectionObj = null) => {
  try {
    let result = null;
    const {
      tournament_refid,
      tournament_category,
      parent_category_id = null,
      tournament_format,
      reg_fee = null,
      reg_fee_currency = null,
      minimum_players = null,
      maximum_players = null,
      min_reg_count = null,
      max_reg_count = null,
      seeded_teams = null,

      age_restriction = null,
      sex_restriction = null,
      average_age = null,
      // tournament_config,
      participant_dob_startdate,
      participant_dob_enddate,
      tournament_category_name,
      tournament_category_prizes,
      tournament_category_desc,
      tournament_category_id,
      max_age,
      min_age,
      min_male = null,
      max_male = null,
      min_female = null,
      max_female = null,
      doc_list = null,
    } = body;
    // if (parent_category_id !== null) {
    //     let data = await tournamentCategoriesDao.getById(parent_category_id);
    //     if (data === null) {
    //         result = { message: "parent_category_id not Found" }
    //         return result;
    //     }
    // }

    // let TournamentReferId = await tournamentDao.getById(tournament_refid);

    // if (TournamentReferId === null) {
    //     result = { message: "tournament_refid not found" }
    //     return result;
    // }

    // let data = await tournamentCategoriesDao.getById(tournament_category_id)

    // if (data === null) {
    //     result = { message: "tournament_category_id not found" }
    //     return result;
    // }

    result = await tournamentCategoriesDao.edit(
      tournament_refid,
      tournament_category,
      parent_category_id,
      tournament_format,
      reg_fee,
      reg_fee_currency,
      minimum_players,
      maximum_players,
      min_reg_count,
      max_reg_count,
      seeded_teams,
      age_restriction,
      sex_restriction,
      average_age,
      // tournament_config,
      participant_dob_startdate,
      participant_dob_enddate,
      tournament_category_name,
      tournament_category_prizes,
      tournament_category_desc,
      tournament_category_id,
      max_age,
      min_age,
      min_male,
      max_male,
      min_female,
      max_female,
      doc_list,
      connectionObj
    );
    return result;
  } catch (error) {
    console.log(
      "Error occurred in create tournament catgeories service ",
      error
    );
    throw error;
  }
};

const fetchTournament = async (tournament_category_id) => {
  try {
    let result = {};
    let data = null;
    data = await tournamentCategoriesDao.getById(tournament_category_id);
    if (data === null)
      result = { message: "tournament_category_id not exist " };
    else result["data"] = data;
    return result;
  } catch (error) {
    console.log("Error occurred in tournament categories", error);
    throw error;
  }
};

const fetchAll = async () => {
  try {
    let data = await tournamentCategoriesDao.getAll();
    return data;
  } catch (error) {
    console.log("Error occurred in fetchAll", error);
    throw error;
  }
};

const deleteTournament = async (tournament_category_id) => {
  try {
    let tournament = {
      data: null,
    };
    let data = await tournamentCategoriesDao.deleteById(tournament_category_id);
    if (data === null)
      tournament = { message: "Tournament Categories not exist" };
    else tournament["data"] = "Success";
    return tournament;
  } catch (error) {
    console.log("Error occurred in delete tournament Categories", error);
    throw error;
  }
};

module.exports = {
  createTournamentCatgories,
  fetchTournament,
  fetchAll,
  deleteTournament,
  updateTournament,
};
