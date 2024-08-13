import { axiosEvents } from "../utils/axios";

class TournamentCategoriesService {
  async updatePointConfig(data) {
    const res = await axiosEvents.put(
      "/tournamentCategories/updatePointSetup",
      data
    );
    return res.data;
  }
}

export default new TournamentCategoriesService();
