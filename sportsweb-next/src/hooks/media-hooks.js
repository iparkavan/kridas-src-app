import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "react-query";
import mediaService from "../services/media-service";

const useInfiniteUserVideo = (userId, resource_type = "V") => {
  return useInfiniteQuery(
    ["user-video", userId],
    (params) =>
      mediaService.getInfiniteUserMedia({ ...params, userId, resource_type }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
      enabled: !!userId,
    }
  );
};

const useInfiniteUserPhoto = (userId, resource_type = "I") => {
  return useInfiniteQuery(
    ["user-photo", userId],
    (params) =>
      mediaService.getInfiniteUserMedia({ ...params, userId, resource_type }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
      enabled: !!userId,
    }
  );
};

const useInfiniteUserTaggedPhotos = (userId) => {
  return useInfiniteQuery(
    ["user-tagged-photos", userId],
    (params) =>
      mediaService.getInfiniteTaggedPhotoForUser({ ...params, userId }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
      enabled: !!userId,
    }
  );
};

const useInfinitePageTaggedPhotos = (pageId) => {
  return useInfiniteQuery(
    ["page-tagged-photos", pageId],
    (params) =>
      mediaService.getInfiniteTaggedPhotoForPage({ ...params, pageId }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
      enabled: !!pageId,
    }
  );
};

const useInfiniteEventTaggedPhotos = (eventId) => {
  return useInfiniteQuery(
    ["event-tagged-photos", eventId],
    (params) =>
      mediaService.getInfiniteTaggedPhotoForEvent({ ...params, eventId }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
      enabled: !!eventId,
    }
  );
};

const useInfinitePageVideo = (pageId, resource_type = "V") => {
  return useInfiniteQuery(
    ["page-video", pageId],
    (params) =>
      mediaService.getInfinitePageMedia({ ...params, pageId, resource_type }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
      enabled: !!pageId,
    }
  );
};

const useInfinitePagePhoto = (pageId, resource_type = "I") => {
  return useInfiniteQuery(
    ["page-photo", pageId],
    (params) =>
      mediaService.getInfinitePageMedia({ ...params, pageId, resource_type }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { totalPage } = lastPage;
        const nextPage = pages.length;
        return nextPage < totalPage ? nextPage : undefined;
      },
      enabled: !!pageId,
    }
  );
};

const useFeedByMediaId = (media_id, type, id, enabled = true) => {
  return useQuery(
    ["user-feed-media", media_id],
    () => mediaService.getFeedByMediaId(media_id, type, id),
    {
      enabled: !!media_id && enabled,
    }
  );
};

const useUpdateMedia = (type) => {
  const QueryClient = useQueryClient();
  return useMutation((data) => mediaService.updateMedia(data), {
    onSuccess: ({ media_creator_user_id, media_creator_company_id }) => {
      QueryClient.invalidateQueries([
        `${type}-gallery`,
        media_creator_user_id
          ? media_creator_user_id
          : media_creator_company_id,
      ]);
      QueryClient.invalidateQueries([
        `${type}-photo`,
        media_creator_user_id
          ? media_creator_user_id
          : media_creator_company_id,
      ]);
    },
  });
};

export {
  useInfiniteUserVideo,
  useInfiniteUserPhoto,
  useInfinitePageVideo,
  useInfinitePagePhoto,
  useInfiniteUserTaggedPhotos,
  useInfinitePageTaggedPhotos,
  useInfiniteEventTaggedPhotos,
  useFeedByMediaId,
  useUpdateMedia,
};
