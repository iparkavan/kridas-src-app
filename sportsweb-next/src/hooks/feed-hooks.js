import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import feedService from "../services/feed-service";

const useCreateFeed = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return feedService.createFeed(data);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([`${variables.type}-feeds`]);
        queryClient.invalidateQueries([`${variables.type}-posts`]);
        if (variables?.pics?.length > 0 || variables?.videos?.length > 0) {
          const queryType =
            variables.type === "company" ? "page" : variables.type;
          queryClient.invalidateQueries([`${queryType}-photo`]);
          queryClient.invalidateQueries([`${queryType}-video`]);
        }
        // if (variables.eventId) {
        //   queryClient.invalidateQueries(["event-feeds", variables.eventId]);
        // }
      },
    }
  );
};

const useUserFeed = (userId) => {
  return useQuery(["feeds"], () => feedService.getUserFeed(userId), {
    enabled: !!userId,
  });
};

const useFeedInfiniteByUserId = (data) => {
  return useInfiniteQuery(
    ["user-posts"],
    (params) => feedService.getInfiniteFeedsByUserId({ ...params, data }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
      enabled: !!data?.["user_id"],
    }
  );
};

const useFeedInfiniteByCompanyId = (data) => {
  return useInfiniteQuery(
    ["company-posts"],
    (params) => feedService.getInfiniteFeedsByCompanyId({ ...params, data }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
      enabled: !!data?.["company_id"],
    }
  );
};

const useInfiniteFeed = (type, id) => {
  return useInfiniteQuery(
    [`${type}-feeds`],
    (params) => feedService.getInfiniteFeeds({ ...params, type, id }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
    }
  );
};

const useUpdateFeed = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return feedService.updateFeed(data);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([`${variables.type}-feeds`]);
        queryClient.invalidateQueries([`${variables.type}-posts`]);
        // queryClient.invalidateQueries(["event-feeds"]);
        queryClient.invalidateQueries(["feed", variables.feedId]);
      },
    }
  );
};

const useDeleteFeed = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return feedService.deleteFeed(data);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([`${variables.type}-feeds`]);
        queryClient.invalidateQueries([`${variables.type}-posts`]);
        // queryClient.invalidateQueries(["event-feeds"]);
      },
      onSettled: (_, __, variables) => {
        queryClient.invalidateQueries(["feed", variables.feedId]);
      },
    }
  );
};

const useInfiniteEventFeed = (data) => {
  return useInfiniteQuery(
    ["event-posts", data["event_id"]],
    (params) => feedService.getInfiniteEventFeeds({ ...params, data }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
      enabled: !!data?.["company_id"] && !!data?.["event_id"],
    }
  );
};

const useFeed = (
  feedId,
  id,
  type,
  enabled = true,
  queryKey = ["feed", feedId]
) => {
  return useQuery(queryKey, () => feedService.getFeed(feedId, id, type), {
    enabled: Boolean(feedId && id && type && enabled),
  });
};

export {
  useCreateFeed,
  useUserFeed,
  useInfiniteFeed,
  useFeedInfiniteByUserId,
  useFeedInfiniteByCompanyId,
  useUpdateFeed,
  useDeleteFeed,
  useInfiniteEventFeed,
  useFeed,
};
