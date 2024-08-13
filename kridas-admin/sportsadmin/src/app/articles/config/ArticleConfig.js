class ArticleConfig {
  getAllArticles() {
    return {
      method: "GET",
      url: "/articles/getAll",
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  updateArticleIsFeature(data) {
    return {
      method: "PUT",
      url: "/articles/updateIsfeature",
      headers: { "Content-Type": "application/json" },
      data: data,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }
}
export default new ArticleConfig();
