import axios from "axios";
import { instance } from "../utils/axios";

class CategoryService {
  async getCategoryById(categoryId) {
    const res = await instance.get(`category/get/${categoryId}`);
    return res.data.data;
  }
}

export default new CategoryService();
