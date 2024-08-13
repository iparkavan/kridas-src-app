import axios from "../utils/axios";

class CategoryService {
  /**
   * Fetch all categories
   * @returns
   */
  getAllParentCategories() {
    return axios.get("category/fetchAllParentCategory");
  }

  getCategoriesByType(parentType) {
    return axios.get(`category/getByParentType/${parentType}`);
  }

  async getCategoriesById(parentId) {
    const res = await axios.get(`category/getByParent/${parentId}`);
    return res.data.data;
  }

  async getCategoryById(categoryId) {
    const res = await axios.get(`category/get/${categoryId}`);
    return res.data.data;
  }

  async getAllCategories() {
    const res = await axios.get("category/getAll");
    return res.data;
  }

  async getAllSubCategories(parentCategoryType) {
    const res = await axios.get(
      `/category/getAllSubCategories/${parentCategoryType}`
    );
    return res.data;
  }
}

export default new CategoryService();
