import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "react-query";
import notificationService from "../services/notification.service";

const useNotification = (userId) => {
  return useQuery(
    ["notification", userId],
    () => notificationService.fetchByUserId(userId),
    {
      enabled: !!userId,
      refetchOnMount: true,
    }
  );
};

const useReadAllNotification = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return notificationService.notificationAllRead(data);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["user-notifications", variables.userId]);
      },
    }
  );
};

const useNotificationInfiniteByUserId = (id) => {
  return useInfiniteQuery(
    ["user-notifications", id],
    (params) =>
      notificationService.getInfiniteNotificationsByUserId({ ...params, id }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
      enabled: !!id,
    }
  );
};

export {
  useNotification,
  useReadAllNotification,
  useNotificationInfiniteByUserId,
};
