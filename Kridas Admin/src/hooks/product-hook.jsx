import { useQuery } from "@tanstack/react-query";
import ProductService from "../services/product-service";

const useSearchProducts = (data) => {
  return useQuery({
    queryKey: ["list-products", data],
    queryFn: () => {
      return ProductService.searchProducts(data);
    },
  });
};

const useProductById = (productId) => {
  return useQuery({
    queryKey: ["products", productId],
    queryFn: () => ProductService.getProductById(productId),
  });
};

export { useSearchProducts, useProductById };
