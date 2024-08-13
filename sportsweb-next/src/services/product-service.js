import { objToFormData } from "../helper/form-data";
import { axiosMarketPlace } from "../utils/axios";

class ProductService {
  async addProduct({ file, ...data }) {
    let formData = new FormData();
    formData = objToFormData({ product: data }, formData);
    if (file) {
      formData.append("file", file);
    }

    const res = await axiosMarketPlace.post("/product/addProduct", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }

  async updateProduct({ file, ...data }) {
    let formData = new FormData();
    formData = objToFormData({ product: data }, formData);
    if (file) {
      formData.append("file", file);
    }

    const res = await axiosMarketPlace.put("/product/updateProduct", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }

  async getProductsByCompanyId(pageId) {
    const res = await axiosMarketPlace.get(`/product/company/${pageId}`);
    return res.data;
  }

  async getProductCategoryById(id) {
    const res = await axiosMarketPlace.get(`/product/categoryCode/${id}`);
    return res.data;
  }

  async getProductCategory(id) {
    const res = await axiosMarketPlace.get(`/product/category/${id}`);
    return res.data;
  }

  async getProductById(productId) {
    const res = await axiosMarketPlace.get(`/product/${productId}`);
    return res.data;
  }

  async searchProducts(pageParam, data) {
    const { limit } = data;
    const offSet = pageParam * limit;
    const res = await axiosMarketPlace.post("/product/search", {
      ...data,
      offSet,
      limit,
    });
    return res.data;
  }

  async getProductCount(productId) {
    const res = await axiosMarketPlace.get(`/product/count/${productId}`);
    return res.data;
  }

  async getService(serviceId, serviceDate) {
    const res = await axiosMarketPlace.get(
      `/product/service/${serviceId}/${serviceDate}`
    );
    return res.data;
  }
}

export default new ProductService();
