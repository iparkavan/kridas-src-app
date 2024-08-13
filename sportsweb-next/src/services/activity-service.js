import { objToFormData, objToFormDataSet } from "../helper/form-data";
import axios, { axiosCommon, axiosEvents } from "../utils/axios";

class UserActivityService {
  async getUserActivity(id, type) {
    const res = await axios.get(`activity-log/getByIdAndType/${id}/${type}`);
    return res.data;
  }

  async getUserRewards(data) {
    const res = await axiosCommon.post("rewards/user", data);
    return res.data;
  }

  async getInfiniteUserActivity({ pageParam = 0, id, type }) {
    const size = 5;
    const res = await axios.post("/activity-log/searchById", {
      page: pageParam,
      size,
      id: id,
      type: "U",
      event_type: type,
    });
    return res.data;
  }

  // async getUserActivityJava(userId, type) {
  //   const res = await axiosCommon.post("/activity/searchActivityLog", {
  //     activityGroup: type,
  //     companyId: null,
  //     endDate: null,
  //     eventId: null,
  //     startDate: null,
  //     userId: userId,
  //     offset: 0,
  //     limit: 2,
  //   });
  //   return res.data;
  // }

  async getUserActivityJava(pageParams, data) {
    const { limit } = data;
    const offSet = pageParams * limit;
    const res = await axiosCommon.post("/activity/searchActivityLog", {
      ...pageParams,
      ...data,
      // activityGroup: type,
      // companyId: null,
      // endDate: null,
      // eventId: null,
      // startDate: null,
      // userId: userId,
      offSet,
      limit,
    });
    return res.data;
  }

  async userLogout(data) {
    const res = await axios.post("/activity-log/log-out", data);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }
}
export default new UserActivityService();
