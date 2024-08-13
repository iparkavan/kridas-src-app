import axios from "../utils/axios";

class NotificationService {
  async fetchByUserId(user_id) {
    const response = await axios.get(`/notification/getByUserId/${user_id}`);
    return response.data;
  }

  async notificationAllRead({ userId }) {
    const res = await axios.put("/notification/makeAllRead", {
      user_id: userId,
    });
    return res.data;
  }

  async getInfiniteNotificationsByUserId({ pageParam = 0, id }) {
    const size = 10;
    const res = await axios.post("notification/search", {
      page: pageParam,
      size,
      user_id: id,
    });
    return res.data;
  }
}

export default new NotificationService();
