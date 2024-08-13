import axios from "../utils/axios";

class MediaService {
  async getInfiniteUserMedia({ pageParam = 0, userId, resource_type }) {
    const size = 6;
    const res = await axios.post("/media/getByUserId", {
      page: pageParam,
      size,
      user_id: userId,
      type: resource_type,
    });
    return res.data;
  }

  async getInfinitePageMedia({ pageParam = 0, pageId, resource_type }) {
    const size = 6;
    const res = await axios.post("/media/getByCompanyId", {
      page: pageParam,
      size,
      company_id: pageId,
      type: resource_type,
    });
    return res.data;
  }

  async getInfiniteTaggedPhotoForUser({ pageParam = 0, userId }) {
    const size = 5;
    const res = await axios.post("/media/getTaggedPostByUserId", {
      page: pageParam,
      size,
      user_id: userId,
      type: "I",
    });
    return res.data;
  }

  async getInfiniteTaggedPhotoForPage({ pageParam = 0, pageId }) {
    const size = 5;
    const res = await axios.post("/media/getTaggedPostByCompanyId", {
      page: pageParam,
      size,
      company_id: pageId,
      type: "I",
    });
    return res.data;
  }

  async getInfiniteTaggedPhotoForEvent({ pageParam = 0, eventId }) {
    const size = 5;
    const res = await axios.post("/media/getTaggedPostByEventId", {
      page: pageParam,
      size,
      event_id: eventId,
      type: "I",
    });
    return res.data;
  }

  async getFeedByMediaId(media_id, type, id) {
    const res = await axios.get(
      `/media/getFeedByMedia/${media_id}?type=${type}&id=${id}`
    );
    return res.data.data;
  }

  async updateMedia(data) {
    const res = await axios.post("/media/api/like/search", data);
    return res.data;
  }
}

export default new MediaService();
