import axios from "../utils/axios";

class AccountDeletionService {
  async postAccountDeletion(data) {
    const res = await axios.post("/users/accountDeletionRequest", data);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async getAccountDeletionByUserId(userId) {
    const res = await axios.get(
      `/account-deletion-request/getByUserID/${userId}`
    );
    return res.data;
  }
}

export default new AccountDeletionService();
