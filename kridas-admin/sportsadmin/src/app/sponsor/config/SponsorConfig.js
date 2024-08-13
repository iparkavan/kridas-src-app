class SponsorConfig {
  getByUserId(id) {
    return {
      method: "GET",
      url: `sponsor/getByUserId/${id}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_BACKEND_API_URL,
    };
  }
}

export default new SponsorConfig();
