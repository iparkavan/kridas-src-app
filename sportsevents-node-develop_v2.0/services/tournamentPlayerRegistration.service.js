const tournamentPlayerRegistrationDao = require("../dao/tournamentPlayerRegistration.dao");
const userDao = require("../dao/user.dao");
const teamDao = require("../dao/teams.dao");
const tournamentCategoryDao = require("../dao/tournamentCategories.dao");
const tournamentDao = require("../dao/tournaments.dao");

/**
 * Method to create new TournamentPlayerRegistration
 * @param {JSON} body
 * @returns
 */
const createTournamentPlayerRegistration = async (body) => {
  try {
    let result = null;
    let user = null;
    let team = null;
    let tournamentCategory = null;
    let tournament = null;
    const {
      player_id = null,
      registration_date = null,
      team_id = null,
      seeding = null,
      tournament_category_id,
      tournamentid,
    } = body;

    if (player_id !== null && player_id !== undefined) {
      user = await userDao.getById(player_id);
      if (user === null) {
        result = { message: "player_id not exists" };
        return result;
      }
    }

    if (team_id !== null && team_id !== undefined) {
      team = await teamDao.getById(team_id);
      if (team === null) {
        result = { message: "team_id not exists" };
        return result;
      }
    }

    if (tournament_category_id) {
      tournamentCategory = await tournamentCategoryDao.getById(
        tournament_category_id
      );
      if (tournamentCategory === null) {
        return (result = { message: "tournament_category_id not exists" });
      }
    }

    if (tournamentid) {
      tournament = await tournamentDao.getById(tournamentid);
      if (tournament === null) {
        return (result = { message: "tournamentid not exists" });
      }
    }

    result = await tournamentPlayerRegistrationDao.add(
      player_id,
      registration_date,
      team_id,
      seeding,
      tournament_category_id,
      tournamentid
    );
    return result;
  } catch (error) {
    console.log("Error occurred in createTournamentPlayerRegistration", error);
    throw error;
  }
};

/**
 * Method to update existing TournamentPlayerRegistration
 * @param {JSON} body
 * @returns
 */
const editTournamentPlayerRegistration = async (body) => {
  try {
    let result = null;
    let user = null;
    let team = null;
    let tournamentCategory = null;
    let tournament = null;
    let tournamentPlayerRegistration = null;
    const {
      player_id = null,
      registration_date = null,
      team_id = null,
      seeding = null,
      tournament_category_id,
      tournamentid,
      tournament_player_reg_id,
    } = body;

    if (tournament_player_reg_id) {
      tournamentPlayerRegistration =
        await tournamentPlayerRegistrationDao.getById(tournament_player_reg_id);
      if (tournamentPlayerRegistration === null) {
        return (result = { message: "tournament_player_reg_id not exists" });
      }
    }

    if (player_id !== null && player_id !== undefined) {
      user = await userDao.getById(player_id);
      if (user === null) {
        result = { message: "player_id not exists" };
        return result;
      }
    }

    if (team_id !== null && team_id !== undefined) {
      team = await teamDao.getById(team_id);
      if (team === null) {
        result = { message: "team_id not exists" };
        return result;
      }
    }

    if (tournament_category_id) {
      tournamentCategory = await tournamentCategoryDao.getById(
        tournament_category_id
      );
      if (tournamentCategory === null) {
        return (result = { message: "tournament_category_id not exists" });
      }
    }

    if (tournamentid) {
      tournament = await tournamentDao.getById(tournamentid);
      if (tournament === null) {
        return (result = { message: "tournamentid not exists" });
      }
    }

    result = await tournamentPlayerRegistrationDao.edit(
      player_id,
      registration_date,
      team_id,
      seeding,
      tournament_category_id,
      tournamentid,
      tournament_player_reg_id
    );
    return result;
  } catch (error) {
    console.log("Error occurred in editTournamentPlayerRegistration", error);
    throw error;
  }
};

/**
 * Method to get the TournamentPlayerRegistration based on TournamentPlayerRegistration Id
 * @param {int} tournament_player_reg_id
 */
const fetchTournamentPlayerRegistration = async (tournament_player_reg_id) => {
  try {
    let tournamentPlayerRegistration = {
      data: null,
    };
    let data = await tournamentPlayerRegistrationDao.getById(
      tournament_player_reg_id
    );
    if (data === null)
      tournamentPlayerRegistration = {
        message: "TournamentPlayerRegistration not exist",
      };
    else tournamentPlayerRegistration["data"] = data;
    return tournamentPlayerRegistration;
  } catch (error) {
    console.log("Error occurred in fetch TournamentPlayerRegistration", error);
    throw error;
  }
};

/**
 *  Method to delete the TournamentPlayerRegistration based on TournamentPlayerRegistration id
 * @param {int} tournament_player_reg_id
 */
const deleteTournamentPlayerRegistration = async (tournament_player_reg_id) => {
  try {
    let tournamentPlayerRegistration = {
      data: null,
    };
    let data = await tournamentPlayerRegistrationDao.deleteById(
      tournament_player_reg_id
    );
    if (data === null)
      tournamentPlayerRegistration = {
        message: "TournamentPlayerRegistration does not exist",
      };
    else tournamentPlayerRegistration["data"] = "Deleted Successfully";
    return tournamentPlayerRegistration;
  } catch (error) {
    console.log("Error occurred in delete TournamentPlayerRegistration", error);
    throw error;
  }
};

/**
 *  Method to get all the TournamentPlayerRegistrations
 */

const fetchAll = async () => {
  try {
    return await tournamentPlayerRegistrationDao.getAll();
  } catch (error) {
    console.log("Error occurred in fetchAll: ", error);
    throw error;
  }
};

/**
 *  Method to get the Team by Event id and Sport Id Combination
 * @param {int} tournament_player_reg_id
 */
const getTeamByEventSport = async (event_id, sport_id) => {
  try {
    let tournamentPlayerRegistration = {
      data: null,
    };
    let data = await tournamentPlayerRegistrationDao.getTeamByEventSport(
      event_id,
      sport_id
    );
    if (data.length === 0)
      tournamentPlayerRegistration = {
        message: "Team does not exist",
      };
    else tournamentPlayerRegistration["data"] = data;
    return tournamentPlayerRegistration;
  } catch (error) {
    console.log(
      "Error occurred in getTeamByEventSport TournamentPlayerRegistration",
      error
    );
    throw error;
  }
};

module.exports = {
  createTournamentPlayerRegistration,
  editTournamentPlayerRegistration,
  fetchTournamentPlayerRegistration,
  deleteTournamentPlayerRegistration,
  fetchAll,
  getTeamByEventSport,
};
