import axios from "../utils/axios";
import { objToFormData } from "../helper/form-data";
class ArticleService {
  async createArticle(type, data) {
    let formData = new FormData();
    formData = objToFormData(data, formData);
    const res = await axios.post("/articles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }
  async createArticleFeed(values) {
    let formData = new FormData();
    const {
      feedData,
      hashTags,
      mentions,
      type,
      id,
      pics,
      videos,
      articleValues,
      article_content,
    } = values;
    if (articleValues?.article_id) {
      formData.append("article_id", articleValues.article_id);
    }
    formData.append("cover_image_url", articleValues?.cover_image_url);
    formData.append("article_heading", articleValues.article_heading);
    formData.append("article_content", JSON.stringify(article_content));
    formData.append("article_publish_status", "PUB");
    if (articleValues?.type === "user")
      formData.append("user_id", articleValues.user_id);
    else formData.append("company_id", articleValues.company_id);
    let feedObj = {};
    const feed = {};
    feed["feed_content"] = feedData;
    feed[`feed_creator_${type}_id`] = id;
    feed["feed_type"] = "AR";
    feed["share_count"] = 0;
    feed["like_count"] = 0;
    feedObj["hashTags"] = hashTags?.map((hash) => hash.hashtag);
    feedObj["tags"] = mentions;
    feedObj["image"] = pics;
    feedObj["video"] = videos;
    feedObj = { feed, ...feedObj };
    formData.append("feed", JSON.stringify(feedObj));
    const res = await axios.post("/articles/articleFeed", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }
  async editArticle(values, articleData, feed) {
    let formData = new FormData();
    if (feed) {
      const { feedData } = feed;
      let feedObj;
      feedObj = { ...articleData.feed, feed_content: feedData };
      formData.append("feed", JSON.stringify(feedObj));
      formData.append("article_publish_status", "PUB");
    } else formData.append("article_publish_status", "DRT");
    formData.append("article_id", articleData.article_id);
    formData.append("cover_image_url", values.cover_image_url);
    formData.append("article_heading", values.article_heading);
    formData.append("article_content", JSON.stringify(values.article_content));
    formData.append("is_delete", articleData?.is_deleted);
    if (values.type === "user") formData.append("user_id", values.user_id);
    else formData.append("company_id", values.company_id);
    const res = await axios.put("/articles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }

  async fetchArticlesByUserId(userId) {
    const response = await axios.get(`/articles/getByUserId/${userId}`);
    return response.data.data;
  }

  async getInfiniteUserArticles({ pageParam = 0, userId }) {
    const size = 8;
    const res = await axios.post("/articles/searchByUserId", {
      page: pageParam,
      size,
      user_id: userId,
    });
    return res.data;
  }

  async fetchArticleById(articleId, userId) {
    let url = `/articles/get/${articleId}`;
    if (userId) {
      url += `?user_id=${userId}`;
    }
    const response = await axios.get(url);
    return response.data.data;
  }

  async fetchPublishedArticles({ pageParam = 0, filters }) {
    let size = 8;
    const response = await axios.post("/articles/search", {
      page: pageParam,
      size,
      sort: "desc",
      ...filters,
    });
    return response.data;
  }

  async fetchFeaturedArticles({ pageParam = 0 }) {
    let size = 3;
    const response = await axios.post("/articles/searchIsFeature", {
      page: pageParam,
      size,
    });
    return response.data;
  }
}

export default new ArticleService();
