import { format } from "date-fns";
import { axiosEvents } from "../utils/axios";

class TournamentService {
  async getFixturesMasterByTournamentCatId(tournamentCategoryId) {
    const res = await axiosEvents.get(
      `/tournament/getMaster/${tournamentCategoryId}`
    );
    return res.data;
  }

  async saveFixturesSetup(data) {
    const res = await axiosEvents.post(
      "/tournament/saveFixtureMaster-setup-asdraft",
      data
    );
    return res.data;
  }

  async generateFixtures(data) {
    const res = await axiosEvents.post(
      "/tournament/generateFixturesByFixtureConfig",
      data
    );
    return res.data;
  }

  async saveFixtures(data) {
    const res = await axiosEvents.post("/tournament/viewFixtures", data);
    return res.data;
  }

  async getFixturesByTournamentCatId(tournamentCategoryId, fixturesFilter) {
    const filters = { ...fixturesFilter };
    if (filters.fixtureDate) {
      filters.fixtureDate = format(filters.fixtureDate, "yyyy-MM-dd");
    }
    const res = await axiosEvents.post(
      `/tournament/getAllFixtures-categoryId/${tournamentCategoryId}`,
      filters
    );
    return res.data;
  }

  async updateFixture(data) {
    const res = await axiosEvents.put("/tournament/update", data);
    return res.data;
  }
}

export default new TournamentService();
