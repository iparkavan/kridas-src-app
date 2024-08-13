import axios from "../utils/axios";

class FeedService {
  async createFeed(data) {
    const {
      feedData,
      hashTags,
      mentions,
      type,
      id,
      pics,
      videos,
      pageId,
      feedId,
      feedType,
    } = data;
    let feedObj = {};
    const feed = {};

    feed["feed_content"] = feedData;
    if (type === "user" || type === "company") {
      feed[`feed_creator_${type}_id`] = id;
    } else if (type === "event") {
      feed[`feed_creator_company_id`] = pageId;
      feed["event_id"] = id;
    }
    feed["share_count"] = 0;
    feed["like_count"] = 0;
    if (feedType) {
      feed["feed_type"] = feedType;
    }

    feedObj["hashTags"] = hashTags?.map((hash) => hash.hashtag);
    feedObj["tags"] = mentions;
    feedObj["image"] = pics;
    feedObj["video"] = videos;
    if (feedId) {
      feedObj["shared_feed_id"] = feedId;
    }

    feedObj = { feed, ...feedObj };

    const res = await axios.post("/feeds", feedObj);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async getUserFeed(userId) {
    const res = await axios.get(`/feeds/getByFeedUserId/${userId}`);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data.data;
  }

  async getFeed(feedId, id, type) {
    const data = {
      feed_id: feedId,
      id,
      type,
    };
    const res = await axios.post("/feeds/getIndividualFeed", data);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data.data;
  }

  async getInfiniteFeedsByUserId({ pageParam = 0, data }) {
    const size = 10;
    const res = await axios.post("feeds/getByUserId", {
      page: pageParam,
      size,
      ...data,
    });
    return res.data;
  }

  async getInfiniteFeedsByCompanyId({ pageParam = 0, data }) {
    const size = 10;
    const res = await axios.post("feeds/getByCompanyId", {
      page: pageParam,
      size,
      ...data,
    });
    return res.data;
  }

  async getInfiniteFeeds({ pageParam = 0, type, id }) {
    const size = 10;
    const res = await axios.post("/feeds/search", {
      page: pageParam,
      size,
      [`${type}_id`]: id,
    });
    return res.data;
  }

  async updateFeed(data) {
    const {
      feedId,
      feedData,
      hashTags,
      mentions,
      type,
      id,
      pics,
      videos,
      pageId,
    } = data;
    let feedObj = {};
    const feed = {};

    feed["feed_id"] = feedId;
    feed["feed_content"] = feedData;
    if (type === "user" || type === "company") {
      feed[`feed_creator_${type}_id`] = id;
    } else if (type === "event") {
      feed[`feed_creator_company_id`] = pageId;
      feed["event_id"] = id;
    }

    feedObj["hashTags"] = hashTags?.map((hash) => hash.hashtag);
    feedObj["tags"] = mentions;
    feedObj["image"] = pics;
    feedObj["video"] = videos;

    feedObj = { feed, ...feedObj };

    const res = await axios.put("/feeds", feedObj);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async deleteFeed({ feedId }) {
    const res = await axios.delete(`/feeds/delete/${feedId}`);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async getInfiniteEventFeeds({ pageParam = 0, data }) {
    const size = 10;
    const res = await axios.post("/feeds/searchFeedByEvent", {
      page: pageParam,
      size,
      ...data,
    });
    return res.data;
  }
}

export default new FeedService();
