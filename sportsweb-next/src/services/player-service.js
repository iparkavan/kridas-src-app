import { objToFormData } from "../helper/form-data";
import axios from "../utils/axios";

class PlayerService {
  async addPlayer(data) {
    let formData = new FormData();
    formData = objToFormData(data, formData);
    const res = await axios.post("/company-team-player/playerReg", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async getPlayersByCompanyId(pageId) {
    const res = await axios.get(
      `/company-team-player/getByCompanyId/${pageId}`
    );
    return res.data.data;
  }

  async getPlayersByParentCompanyId(pageId) {
    const res = await axios.get(`/company-team-player/getByParentId/${pageId}`);
    return res.data.data;
  }

  async updatePlayerStatus(data) {
    const res = await axios.put("/company-team-player/updateStatus", data);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async getInfiniteSearchPlayers({ pageParam = 0, filters }) {
    const size = 9;
    const res = await axios.post("/company-team-player/searchPlayer", {
      page: pageParam,
      size,
      ...filters,
    });
    return res.data;
  }
}

export default new PlayerService();
