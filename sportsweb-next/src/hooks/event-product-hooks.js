import { useMutation } from "react-query";
import eventProductService from "../services/event-product-service";

const usePostEventProduct = (data) => {
  return useMutation((data) => eventProductService.postEventProduct(data));
};

export { usePostEventProduct };
