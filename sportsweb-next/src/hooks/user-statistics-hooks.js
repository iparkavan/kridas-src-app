import { useQuery, useMutation, useQueryClient } from "react-query";
import userStatisticsService from "../services/user-statistics-service";

const useCreateUserStatistics = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return userStatisticsService.createUserStatistics(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user-statistics"]);
      },
    }
  );
};

const useUserStatistics = (userId) => {
  return useQuery(
    ["user-statistics", userId],
    () => userStatisticsService.getUserStatistics(userId),
    {
      enabled: !!userId,
    }
  );
};

const useUpdateUserStatistics = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return userStatisticsService.updateUserStatistics(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user-statistics"]);
      },
    }
  );
};

const useDeleteUserStatisticsOrCareer = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return userStatisticsService.deleteUserStatisticsOrCareer(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user-statistics"]);
      },
    }
  );
};

const useCreateUserSportsCarrer = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return userStatisticsService.createSportsCareer(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user-statistics"]);
      },
    }
  );
};

export {
  useCreateUserStatistics,
  useUserStatistics,
  useDeleteUserStatisticsOrCareer,
  useUpdateUserStatistics,
  useCreateUserSportsCarrer,
};
