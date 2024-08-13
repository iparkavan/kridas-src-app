import { axiosMarketPlace } from "../utils/axios";

class CartService {
  async addToCart(data) {
    const res = await axiosMarketPlace.post("/cart/add", data);
    return res.data;
  }

  async getUserCart(userId) {
    const res = await axiosMarketPlace.get(`/cart/user/${userId}`);
    return res.data;
  }

  async updateUserCart(data) {
    const res = await axiosMarketPlace.put(
      `/cart/update/${data.shoppingCartId}`,
      data
    );
    return res.data;
  }

  async deleteUserCart({ cartId }) {
    const res = await axiosMarketPlace.delete(`/cart/delete/${cartId}`);
    return res.data;
  }
}

export default new CartService();
