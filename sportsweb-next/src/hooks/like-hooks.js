import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import likeService from "../services/like-service";

const useCreateLike = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ queryKey, ...data }) => {
      return likeService.createLike(data);
    },
    {
      // Commented optimistic updates coz of individual post page
      // onMutate: async (variables) => {
      //   await queryClient.cancelQueries(variables.queryKey);

      //   const previousFeeds = queryClient.getQueryData(variables.queryKey);
      //   const updatedFeeds =
      //     previousFeeds && JSON.parse(JSON.stringify(previousFeeds));

      //   const newPagesArray = updatedFeeds?.pages.map((page) => {
      //     const feedItem = page.content.find(
      //       (item) => item["feed_id"] === variables.feedId
      //     );
      //     if (feedItem) {
      //       feedItem.like = {};
      //       feedItem.like["like_type"] = variables.likeType;
      //     }
      //     return page;
      //   });

      //   queryClient.setQueryData(variables.queryKey, (data) => ({
      //     pages: newPagesArray,
      //     pageParams: data.pageParams,
      //   }));

      //   return { previousFeeds };
      // },
      // onError: (_, variables, context) => {
      //   queryClient.setQueryData(variables.queryKey, context.previousFeeds);
      // },
      onSettled: (_, __, variables) => {
        queryClient.invalidateQueries(variables.queryKey);
      },
    }
  );
};

const useUpdateLike = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ queryKey, ...data }) => {
      return likeService.updateLike(data);
    },
    {
      // Commented optimistic updates coz of individual post page
      // onMutate: async (variables) => {
      //   await queryClient.cancelQueries(variables.queryKey);

      //   const previousFeeds = queryClient.getQueryData(variables.queryKey);
      //   const updatedFeeds =
      //     previousFeeds && JSON.parse(JSON.stringify(previousFeeds));

      //   const newPagesArray = updatedFeeds?.pages.map((page) => {
      //     const feedItem = page.content.find(
      //       (item) => item["feed_id"] === variables.feedId
      //     );
      //     if (feedItem) {
      //       feedItem.like["like_type"] = variables.likeType;
      //       feedItem.like["is_delete"] = false;
      //     }
      //     return page;
      //   });

      //   queryClient.setQueryData(variables.queryKey, (data) => ({
      //     pages: newPagesArray,
      //     pageParams: data.pageParams,
      //   }));
      //   return { previousFeeds };
      // },
      // onError: (_, variables, context) => {
      //   queryClient.setQueryData(variables.queryKey, context.previousFeeds);
      // },
      onSettled: (_, __, variables) => {
        queryClient.invalidateQueries(variables.queryKey);
      },
    }
  );
};

const useDeleteLike = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ queryKey, ...data }) => {
      return likeService.deleteLike(data);
    },
    {
      // Commented optimistic updates coz of individual post page
      // onMutate: async (variables) => {
      //   await queryClient.cancelQueries(variables.queryKey);

      //   const previousFeeds = queryClient.getQueryData(variables.queryKey);
      //   const updatedFeeds =
      //     previousFeeds && JSON.parse(JSON.stringify(previousFeeds));

      //   const newPagesArray = updatedFeeds?.pages.map((page) => {
      //     const feedItem = page.content.find(
      //       (item) => item["feed_id"] === variables.feedId
      //     );
      //     if (feedItem) {
      //       feedItem.like["is_delete"] = true;
      //     }
      //     return page;
      //   });

      //   queryClient.setQueryData(variables.queryKey, (data) => ({
      //     pages: newPagesArray,
      //     pageParams: data.pageParams,
      //   }));

      //   return { previousFeeds };
      // },
      // onError: (_, variables, context) => {
      //   queryClient.setQueryData(variables.queryKey, context.previousFeeds);
      // },
      onSettled: (_, __, variables) => {
        queryClient.invalidateQueries(variables.queryKey);
      },
    }
  );
};

const useInfiniteFeedLikes = (data) => {
  const queryKey = data["like_type"] || "all";
  return useInfiniteQuery(
    [data["feed_id"], queryKey],
    (params) => likeService.getInfiniteFeedLikes({ ...params, data }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
    }
  );
};

export { useCreateLike, useUpdateLike, useDeleteLike, useInfiniteFeedLikes };
