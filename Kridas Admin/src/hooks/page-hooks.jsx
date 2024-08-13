import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import pageService from "../services/page-service";

const usePage = (pageId) => {
  return useQuery({
    queryKey: ["page", pageId],
    queryFn: () => pageService.getPage(pageId),
    enabled: !!pageId,
  });
};

const useAllPages = () => {
  return useQuery({
    queryKey: ["all-pages"],
    queryFn: () => pageService.getAllPages(),
  });
};

const usePageVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pageVerification) =>
      pageService.companyProfileVerification(pageVerification),
    onSuccess: () => queryClient.invalidateQueries(["all-pages"]),
  });
};

const useGetCompanyId = (companyId) => {
  return useQuery({
    queryKey: ["company_id"],
    queryFn: () => pageService.getCompanyId(companyId),
  });
};

const useEditCompanyData = (data) => {

  let formData = new FormData()

  return useMutation({
    queryFn: () => pageService.editCompanyData(formData)
  })
};

export { usePage, useAllPages, usePageVerification, useGetCompanyId };
