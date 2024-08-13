class OrganizerConfig {
  getAllOrganizers() {
    return {
      method: "GET",
      url: "organizer/getAll",
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_BACKEND_API_URL,
    };
  }

  getOrganizer(id) {
    return {
      method: "GET",
      url: `organizer/${id}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_BACKEND_API_URL,
    };
  }

  approveOrganizer(data) {
    return {
      method: "PUT",
      url: "organizer/approve-organizer",
      headers: { "Content-Type": "application/json" },
      data: data,
      baseURL: process.env.REACT_APP_BACKEND_API_URL,
    };
  }

  getOrganizerByUserId(id) {
    return {
      method: "GET",
      url: `organizer/getByUserId/${id}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_BACKEND_API_URL,
    };
  }

  getOrganizerByCompanyId(id) {
    return {
      method: "GET",
      url: `organizer/getByCompanyId/${id}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_BACKEND_API_URL,
    };
  }
}

export default new OrganizerConfig();
