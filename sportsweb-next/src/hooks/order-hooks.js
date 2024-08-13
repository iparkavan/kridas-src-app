import { useMutation, useQuery, useQueryClient } from 'react-query';
import orderService from '../services/order-service';

const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  return useMutation((data) => orderService.placeOrder(data), {
    onSettled: () => {
      queryClient.invalidateQueries(['cart']);
    },
  });
};

const useOrders = (data) => {
  return useQuery(['orders', data.userId], () => orderService.getOrders(data), {
    enabled: !!data.userId,
  });
};

const useOrder = (orderId) => {
  return useQuery(['order', orderId], () => orderService.getOrder(orderId), {
    enabled: !!orderId,
  });
};

const useCheckoutSession = () => {
  return useMutation((data) => orderService.checkoutSession(data));
};

const useCreatePaymentIntent = () => {
  return useMutation((data) => orderService.createPaymentIntent(data));
};

const useCreateRazorpayOrder = () => {
  return useMutation((data) => orderService.createRazorpayOrder(data));
};

const useVerifyRazorpayPayment = () => {
  return useMutation((data) => orderService.verifyRazorpayPayment(data));
};

export {
  usePlaceOrder,
  useOrders,
  useOrder,
  useCheckoutSession,
  useCreatePaymentIntent,
  useCreateRazorpayOrder,
  useVerifyRazorpayPayment,
};
