import { useQuery, useMutation, useQueryClient } from "react-query";
import pageStatisticsService from "../services/page-statistics-service";

const useStatisticsById = (statistics_id) => {
  return useQuery(["statistics", statistics_id], () =>
    pageStatisticsService.getStatisticsById(statistics_id)
  );
};

const useAllPagesStatistics = () => {
  return useQuery(["all_statistics"], () =>
    pageStatisticsService.getAllPagesStatistics()
  );
};

const usePageStatistics = (company_id) => {
  return useQuery(
    ["statistics"],
    () => pageStatisticsService.getPageStatistics(company_id),
    {
      enabled: !!company_id,
    }
  );
};

const useCreatePageStatistics = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return pageStatisticsService.createCompanyStatistics(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["statistics"]);
      },
    }
  );
};

const useUpdateStatisticsById = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return pageStatisticsService.updateStatisticsById(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["statistics"]);
      },
    }
  );
};

const useDeleteStatisticById = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ statistics_id }) => {
      return pageStatisticsService.deleteStatisticById(statistics_id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["statistics"]);
      },
    }
  );
};

export {
  useAllPagesStatistics,
  usePageStatistics,
  useCreatePageStatistics,
  useUpdateStatisticsById,
  useStatisticsById,
  useDeleteStatisticById,
};
