import { axiosMarketPlace } from '../utils/axios';

class OrderService {
  async placeOrder(data) {
    const res = await axiosMarketPlace.post('/orders/add', data);
    return res.data;
  }

  async getOrders(data) {
    const res = await axiosMarketPlace.post('/orders/user', data);
    return res.data;
  }

  async getOrder(id) {
    const res = await axiosMarketPlace.get(`/orders/${id}`);
    return res.data;
  }

  async checkoutSession(data) {
    const res = await axiosMarketPlace.post('/orders/checkoutSession', data);
    return res.data;
  }

  async createPaymentIntent(data) {
    const res = await axiosMarketPlace.post(
      '/orders/createPaymentIntent',
      data
    );
    return res.data;
  }

  //Razorpay payment gateway - Step1 - Order Creation
  async createRazorpayOrder(data) {
    const res = await axiosMarketPlace.post(`/orders/payment`, data);
    return res.data;
  }

  //Razorpay payment gateway - Step2 - Payment Verification
  async verifyRazorpayPayment(data) {
    const res = await axiosMarketPlace.post(
      `/orders/paymentVerification`,
      data
    );
    return res.data;
  }
}

export default new OrderService();
