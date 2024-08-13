class OrdersConfig {
  postSearchOrders(data) {
    return {
      method: "POST",
      url: "/apiMarketPlace/orders/all",
      headers: { "Content-Type": "application/json" },
      data: data,
      baseURL: process.env.REACT_APP_MIDDLEWARE_URL,
    };
  }

  getOrder(orderId) {
    return {
      method: "GET",
      url: `/apiMarketPlace/orders/${orderId}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_URL,
    };
  }

  postVendorReport(data) {
    return {
      method: "POST",
      url: "/apiMarketPlace/orders/vendorReport",
      headers: { "Content-Type": "application/json" },
      data: data,
      baseURL: process.env.REACT_APP_MIDDLEWARE_URL,
    };
  }
}

export default new OrdersConfig();
