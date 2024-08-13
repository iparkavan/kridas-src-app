import { axiosEvents } from "../utils/axios";

class EventProductService {
  async postEventProduct(data) {
    const res = await axiosEvents.post(`/eventProduct/`, data);
    return res.data;
  }
}

export default new EventProductService();
