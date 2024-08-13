import { useQuery } from "@tanstack/react-query";
import categoryService from "../services/category-service";

const useCategoryById = (id) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
  });
};

export { useCategoryById };
