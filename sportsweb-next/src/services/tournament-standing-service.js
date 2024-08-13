import { axiosEvents } from "../utils/axios";

class TournamentStandingService {
  async getTournamentStandingByCategoryId(tournamentCategoryId) {
    const res = await axiosEvents.get(
      `/tournamentStanding/getByCategoryId/${tournamentCategoryId}`
    );
    return res.data;
  }
}

export default new TournamentStandingService();
