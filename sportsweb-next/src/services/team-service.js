import axios from "../utils/axios";

class TeamService {
  async getTeam(id) {
    const res = await axios.get(`/teams/getParticipantByTournamentCatId/${id}`);
    return res.data;
  }

  async verifyTeamName(tournament_category_id, team_name) {
    const response = await axios.post(`/teams/getByTeamName`, {
      tournament_id: tournament_category_id,
      team_name,
    });
    return response.data;
  }

  async getTeamByCompanyId(id) {
    const res = await axios.get(`/teams/getParticipantByCompanyId/${id}`);
    return res.data;
  }

  async getTeamByTeamId(id) {
    const res = await axios.get(`/teams/getByTeamId/${id}`);
    return res.data;
  }

  async createChildPage(data) {
    const res = await axios.post("/teams/clubTeam", data);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async registerTeam(data) {
    const res = await axios.post("/teams/register", data);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async registerTeamValidation(data) {
    const res = await axios.post("/teams/teamRegisterValidation", data);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async getPreferences(tournamentCategoryId) {
    const res = await axios.get(
      `/teams/getPreferences/${tournamentCategoryId}`
    );
    return res.data;
  }

  async getPreferencesDetails(data) {
    const res = await axios.post("/teams/getPreferencesDetails", data);
    return res.data;
  }
}

export default new TeamService();
