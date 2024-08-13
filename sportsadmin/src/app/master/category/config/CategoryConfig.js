class CategoryConfig {

  /*   to get all categories */

  getAllCategories() {
    return {
      method: "GET",
      url: "/category/getAll",
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,

    };
  }

  /* to get all parent categories */

  fetchAllParentCategory() {
    return {
      method: "GET",
      url: "/category/fetchAllParentCategory",
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL
    };
  }

  /* Add new category */

  addCategory(data) {
    return {
      method: "POST",
      url: "/category",
      headers: { "Content-Type": "application/json" },
      data: data,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  /* get category */

  getCategortyById(categoryId) {
    return {
      method: "GET",
      url: `/category/get/${categoryId}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }
  

  /*  Edit category */

  updateCategory(data) {
    return {
      method: "PUT",
      url: "/category",
      headers: { "Content-Type": "application/json" },
      data: data,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  /*   delete category */

  deleteCategory(categoryId) {
    return {
      method: "DELETE",
      url: `/category/delete/${categoryId}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  /*  get parent category */

  getCategoryByParent(parent_category_id) {
    return {
      method: "GET",
      url: `/category/getByParent/${parent_category_id}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

}
export default new CategoryConfig();
