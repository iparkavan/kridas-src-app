import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import productService from "../services/product-service";

const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return productService.addProduct(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["search-products"]);
      },
    }
  );
};

const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return productService.updateProduct(data);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["product", variables.productId]);
      },
    }
  );
};

const useGetProductsByCompanyId = (pageId) => {
  return useQuery(["product-page", pageId], () =>
    productService.getProductsByCompanyId(pageId)
  );
};

const useGetProductCategoryById = (id) => {
  return useQuery(
    ["product-category", id],
    () => productService.getProductCategoryById(id),
    {
      enabled: !!id,
    }
  );
};

const useGetProductCategory = (id) => {
  return useQuery(
    ["service-category", id],
    () => productService.getProductCategory(id),
    {
      enabled: !!id,
    }
  );
};

const useProductById = (productId) => {
  return useQuery(
    ["product", productId],
    () => productService.getProductById(productId),
    {
      enabled: !!productId,
    }
  );
};

const useProductByIdMutation = () => {
  return useMutation((productId) => productService.getProductById(productId));
};

const useSearchProducts = (data) => {
  const { limit } = data;
  return useInfiniteQuery(
    ["search-products", data],
    ({ pageParam = 0 }) => productService.searchProducts(pageParam, data),
    {
      getNextPageParam: (lastPage, pages) => {
        const isNextPagePresent = lastPage.length < limit;
        return isNextPagePresent ? undefined : pages.length;
      },
    }
  );
};

const useSearchProductsMutation = () => {
  return useMutation((data) => productService.searchProducts(0, data));
};

const useProductCount = () => {
  return useMutation((productId) => productService.getProductCount(productId));
};

const useGetService = (serviceId, serviceDate) => {
  return useQuery(
    ["booked-services", serviceId, serviceDate],
    () => productService.getService(serviceId, serviceDate),
    {
      enabled: !!serviceId && !!serviceDate,
    }
  );
};

const useGetBookedService = () => {
  return useMutation(({ serviceId, serviceDate }) => {
    return productService.getService(serviceId, serviceDate);
  });
};

export {
  useAddProduct,
  useUpdateProduct,
  useGetProductsByCompanyId,
  useGetProductCategoryById,
  useGetProductCategory,
  useProductById,
  useProductByIdMutation,
  useSearchProducts,
  useSearchProductsMutation,
  useProductCount,
  useGetService,
  useGetBookedService,
};
