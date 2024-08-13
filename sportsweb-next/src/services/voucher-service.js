import { axiosMarketPlace } from "../utils/axios";

class VoucherService {
  async getVoucherById(voucherId) {
    const res = await axiosMarketPlace.get(`/voucher/${voucherId}`);
    return res.data;
  }

  async getVoucherByProductId(productId) {
    const res = await axiosMarketPlace.get(`/voucher/product/${productId}`);
    return res.data;
  }

  async getVoucherDiscount(data = {}) {
    const res = await axiosMarketPlace.post("/voucher/get-discount", data);
    return res.data;
  }

  async searchVouchers(data = {}) {
    const res = await axiosMarketPlace.post("/voucher/search", data);
    return res.data;
  }
}

export default new VoucherService();
