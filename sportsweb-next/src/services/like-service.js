import axios from "../utils/axios";

class LikeService {
  async createLike(data) {
    const { feedId, likeType, type, id } = data;
    const likeObj = {
      feed_id: feedId,
      like_type: likeType,
      [`${type}_id`]: id,
    };
    const res = await axios.post("/like", likeObj);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async updateLike(data) {
    const { feedId, likeId, likeType, type, id } = data;
    const likeObj = {
      like_id: likeId,
      feed_id: feedId,
      like_type: likeType,
      [`${type}_id`]: id,
    };
    const res = await axios.put("/like", likeObj);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async deleteLike(data) {
    const { likeId } = data;
    const res = await axios.delete(`/like/delete/${likeId}`);
    return res.data;
  }

  async getInfiniteFeedLikes({ pageParam = 0, data }) {
    const size = 10;
    const res = await axios.post("/like/search", {
      page: pageParam,
      size,
      ...data,
    });
    return res.data;
  }
}

export default new LikeService();
