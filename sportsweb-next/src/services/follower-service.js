import axios from "../utils/axios";

class followerService {
  async createFollower(type, data) {
    if (type === "page-follower") {
      data["follower_companyid"] = null;
      data["following_userid"] = null;
      data["followed_from"] = new Date();
    }
    if (type === "user-follower") {
      // data.follower_companyid = data?.["follower_companyid"];
      // follower_companyid = null;
      // data.following_companyid = data?.["following_companyid"];
      // following_companyid = null;

      data["follower_companyid"] = null;
      data["following_companyid"] = null;
      data["followed_from"] = new Date();
    }
    if (type === "event-follower") {
      data["follower_companyid"] = null;
      data["following_companyid"] = null;
      data["following_userid"] = null;
      data["followed_from"] = new Date();
    }

    const res = await axios.post("/follower", data);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async removeFollower(type, data) {
    if (type === "page-follower") {
      data["follower_companyid"] = null;
      data["following_userid"] = null;
      data["followed_from"] = new Date();
    }
    if (type === "user-follower") {
      data["follower_companyid"] = null;
      data["following_companyid"] = null;
      data["followed_from"] = new Date();
    }
    if (type === "event-follower") {
      data["follower_companyid"] = null;
      data["following_companyid"] = null;
      data["following_userid"] = null;
      data["followed_from"] = new Date();
    }

    const res = await axios.post("/follower/unFollow", data);
    // if (res.data.message) {
    //   throw new Error(res.data.message);
    // }
    return res.data;
  }
}
export default new followerService();
