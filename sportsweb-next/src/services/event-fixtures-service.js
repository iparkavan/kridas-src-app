import axios from "../utils/axios";

class EventFixturesService {
  async getFixturesByEventId(data) {
    const res = await axios.post("/event-fixtures/getByEventId", data);
    return res.data;
  }
}

export default new EventFixturesService();
