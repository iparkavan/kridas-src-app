import axiosMarketPlace from "../utils/axios";

class ProductService {
  async searchProducts(data) {
    const res = await axiosMarketPlace.post("/product/search", data);
    return res.data;
  }

  async getProductById(productId) {
    const res = await axiosMarketPlace.get(`/product/${productId}`);
    return res.data;
  }
}

export default new ProductService();
