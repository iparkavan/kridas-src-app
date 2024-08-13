class MarketPlaceConfig {
  /* To fetch all Products */

  postSearchProducts(data) {
    return {
      method: "POST",
      url: "/apiMarketPlace/product/search",
      headers: { "Content-Type": "application/json" },
      data: data,
      baseURL: process.env.REACT_APP_MIDDLEWARE_URL,
    };
  }

  getProducts(productId) {
    return {
      method: "GET",
      url: `/apiMarketPlace/product/${productId}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_URL,
    };
  }
}

export default new MarketPlaceConfig();
