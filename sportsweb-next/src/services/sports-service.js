import axios from "../utils/axios";

class SportService {
  /**
   * Fetch all sports
   * @returns
   */
  async getAllSports() {
    const res = await axios.get("sports/getAll");
    return res.data;
  }

  /**
   * Fetch enabled sports
   * @returns
   */
  async getEnabledSports() {
    const res = await axios.get("sports/getAllByStats");
    return res.data;
  }
}

export default new SportService();
