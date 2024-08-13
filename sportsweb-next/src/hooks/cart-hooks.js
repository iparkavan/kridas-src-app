import { useMutation, useQuery, useQueryClient } from "react-query";
import cartService from "../services/cart-service";

const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return cartService.addToCart(data);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["cart", variables.userId]);
      },
    }
  );
};

const useUserCart = (userId, config = {}) => {
  return useQuery(["cart", userId], () => cartService.getUserCart(userId), {
    enabled: !!userId,
    ...config,
  });
};

const useUpdateCart = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return cartService.updateUserCart(data);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["cart", variables.userId]);
      },
    }
  );
};

const useDeleteUserCart = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return cartService.deleteUserCart(data);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["cart", variables.userId]);
      },
    }
  );
};

export { useAddToCart, useUserCart, useDeleteUserCart, useUpdateCart };
