class ApprovalConfig {
  getAll() {
    return {
      method: "GET",
      url: "profile-verification/getAll",
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  edit(data) {
    return {
      method: "PUT",
      url: `/profile-verification`,
      data: data,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  getById(profileId) {
    return {
      method: "GET",
      url: `profile-verification/get/${profileId}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }
}

export default new ApprovalConfig();
