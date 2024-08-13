import axios from "../utils/axios";

class HashTagService {
  async searchByTag(tagName) {
    console.log("check request data--->", tagName)
    const res = await axios.get(`/hash-tag/getByTitle/${tagName}`);
    return res.data;
  }

  async getInfiniteFeeds({ pageParam = 0, searchkey, userId }) {
    const size = 10;
    const res = await axios.post("/hash-tag/searchByTag", {
      page: pageParam,
      size,
      searchkey: searchkey,
      user_id: userId
    });
    return res.data;
  }

}

export default new HashTagService()