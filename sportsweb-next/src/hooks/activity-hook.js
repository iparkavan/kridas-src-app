import { useInfiniteQuery, useMutation, useQuery } from "react-query";
import userActivityService from "../services/activity-service";

const useUserActivity = (userId, type = "") => {
  return useQuery(
    ["user-activity", userId, type],
    () => userActivityService.getUserActivity(userId, type),
    {
      enabled: !!userId,
    }
  );
};

const useUserRewards = (data) => {
  return useQuery(
    ["user-rewards", data.userId],
    () => userActivityService.getUserRewards(data),
    {
      enabled: !!data.userId,
    }
  );
};

const useActivityInfiniteByType = (id, type) => {
  return useInfiniteQuery(
    ["user-activity", id, type],
    (params) =>
      userActivityService.getInfiniteUserActivity({ ...params, id, type }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
    }
  );
};
// const useSearchActivityLogJava = (userId, type) => {
//   return useQuery(
//     ["user-activity-new", userId, type],
//     () => userActivityService.getUserActivityJava(userId, type),
//     {
//       enabled: !!userId,
//     }
//   );
// };

const useSearchActivityLogJava = (data) => {
  const { limit } = data;
  // return useQuery(
  //   ["user-activity-new", userId, type],
  //   () => userActivityService.getUserActivityJava(userId, type),
  //   {
  //     enabled: !!userId,
  //   }
  // );
  return useInfiniteQuery(
    ["user-activity-new", data],
    ({ pageParam = 0 }) =>
      userActivityService.getUserActivityJava(pageParam, data),
    {
      getNextPageParam: (lastPage, pages) => {
        const isNextPagePresent = lastPage.length < limit;
        return isNextPagePresent ? undefined : pages.length;
      },
    }
  );
};

const useLogoutActivity = () => {
  return useMutation((data) => {
    return userActivityService.userLogout(data);
  });
};

export {
  useUserActivity,
  useActivityInfiniteByType,
  useLogoutActivity,
  useSearchActivityLogJava,
  useUserRewards,
};
