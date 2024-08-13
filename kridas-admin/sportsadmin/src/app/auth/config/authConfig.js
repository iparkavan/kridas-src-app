class AuthConfig {
  getSignInConfig(data) {
    return {
      method: "POST",
      url: "/users/login",
      headers: { "Content-Type": "application/json" },
      data: data,
      // baseURL: process.env.REACT_APP_BACKEND_API_URL,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL
    };
  }
}

export default new AuthConfig();
