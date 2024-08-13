class EventCategoryConfig {
  getAllEventCategories() {
    return {
      method: "GET",
      url: "category/getByParentType/EVT",
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_BACKEND_API_URL,
    };
  }

  getAllCategories() {
    return {
      method: "GET",
      url: "category/getAll",
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_BACKEND_API_URL,
    };
  }

  getCategory(id) {
    return {
      method: "GET",
      url: `category/${id}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_BACKEND_API_URL,
    };
  }

  addNewCategory(data) {
    return {
      method: "POST",
      url: "category",
      headers: { "Content-Type": "application/json" },
      data: {
        ...data,
        parentCategoryId: parseInt(data.parentCategoryId),
      },
      baseURL: process.env.REACT_APP_BACKEND_API_URL,
    };
  }

  updateCategory(data) {
    return {
      method: "PUT",
      url: "category",
      headers: { "Content-Type": "application/json" },
      data: {
        ...data,
        parentCategoryId: parseInt(data.parentCategoryId),
      },
      baseURL: process.env.REACT_APP_BACKEND_API_URL,
    };
  }
}

export default new EventCategoryConfig();
