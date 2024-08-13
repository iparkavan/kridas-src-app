import axios from "../utils/axios";
class Verifyservice {
  async getVerify(id) {
    const response = await axios.get(`/profile-verification/getByUserId/${id}`);
    return response.data.data;
  }
}

export default new Verifyservice();
