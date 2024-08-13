import { useQuery } from "@tanstack/react-query";
import { instance } from "../utils/axios";

class UserService {
  async getGraph() {
    const res = await instance.get("/dashboard/getGraph");
    return res.data;
  }

  async getTopUsers() {
    const res = await instance.get("/dashboard/topFollowers");
    return res.data;
  }

  async getFetchStatistics() {
    const res = await instance.get("/dashboard/getUsersCount");
    return res.data;
  }

  async getFetchApprovals() {
    const res = await instance.get("/dashboard/getApprovals");
    return res.data
  }

  // fetchApprovals() {
  //   return {
  //     method: "GET",
  //     url: `/dashboard/getApprovals`,
  //     baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
  //   };
  // }
}

export default new UserService();
