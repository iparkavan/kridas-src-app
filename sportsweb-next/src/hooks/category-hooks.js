import { useQuery } from "react-query";
import categoryService from "../services/category-service";

const useParentCategories = () => {
  return useQuery(
    ["categories"],
    () => categoryService.getAllParentCategories(),
    {
      select: (data) => data.data,
    }
  );
};

const useCategoriesByType = (type) => {
  return useQuery(
    ["category", type],
    () => categoryService.getCategoriesByType(type),
    {
      select: (data) => data.data.data,
      enabled: !!type,
    }
  );
};

const useCategoriesById = (id, config = {}) => {
  return useQuery(
    ["categories", id],
    () => categoryService.getCategoriesById(id),
    {
      ...config,
      enabled: !!id,
    }
  );
};

const useCategoryById = (id) => {
  return useQuery(["category", id], () => categoryService.getCategoryById(id), {
    enabled: !!id,
  });
};

const useAllCategories = () => {
  return useQuery(["categories"], categoryService.getAllCategories);
};

const useAllSubCategories = (parentCategoryType) => {
  return useQuery(["sub-categories", parentCategoryType], () =>
    categoryService.getAllSubCategories(parentCategoryType)
  );
};

export {
  useParentCategories,
  useCategoriesByType,
  useCategoriesById,
  useAllCategories,
  useCategoryById,
  useAllSubCategories,
};
