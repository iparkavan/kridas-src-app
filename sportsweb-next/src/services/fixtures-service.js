import { axiosEvents } from "../utils/axios";

class FixturesService {
  async generateFixtures(data) {
    const res = await axiosEvents.post("/tournament/generateFixtures", data);
    return res.data;
  }
}
export default new FixturesService();
