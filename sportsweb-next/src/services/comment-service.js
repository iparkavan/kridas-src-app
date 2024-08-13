import axios from "../utils/axios";

class CommentService {
  async createComment(data) {
    const { commentData, feedId, type, id } = data;
    let commentObj = {};

    commentObj["contents"] = commentData;
    commentObj["feed_id"] = feedId;
    commentObj[`${type}_id`] = id;

    const res = await axios.post("/comment-info", commentObj);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async getInfiniteComments({ pageParam = 0, feedId }) {
    const size = 5;
    const res = await axios.post("/comment-info/getByParent", {
      page: pageParam,
      size,
      feed_id: feedId,
    });
    return res.data;
  }

  async updateComment(data) {
    const { commentId, commentData, feedId, type, id } = data;
    let commentObj = {};

    commentObj["comment_id"] = commentId;
    commentObj["contents"] = commentData;
    commentObj["feed_id"] = feedId;
    commentObj[`${type}_id`] = id;

    const res = await axios.put("/comment-info", commentObj);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async deleteComment({ commentId }) {
    const res = await axios.delete(`/comment-info/delete/${commentId}`);
    return res.data;
  }
}

export default new CommentService();
