import { useQuery, useMutation, useQueryClient } from "react-query";
import galleryService from "../services/gallery-service";

const useCreateGallery = () => {
  return useMutation((data) => galleryService.createGallery(data));
};

const useUpdateGallery = (type) => {
  const queryClient = useQueryClient();
  return useMutation((data) => galleryService.updateGallery(data), {
    onSuccess: ({
      gallery_id,
      gallery_company_id,
      gallery_user_id,
      gallery_event_id,
    }) => {
      const id = gallery_user_id || gallery_company_id || gallery_event_id;
      queryClient.invalidateQueries([`${type}-gallery`, id]);
      queryClient.invalidateQueries(["gallery", gallery_id]);
    },
  });
};

const useGalleryData = (gallery_id) => {
  return useQuery(
    ["gallery", gallery_id],
    () => galleryService.getGalleryByGalleryId(gallery_id),
    {
      enabled: !!gallery_id,
    }
  );
};

const useUserGallery = (userId) => {
  return useQuery(
    ["user-gallery", userId],
    () => galleryService.getGalleryByUserId(userId),
    {
      enabled: !!userId,
    }
  );
};

const usePageGallery = (pageId) => {
  return useQuery(
    ["page-gallery", pageId],
    () => galleryService.getGalleryByPageId(pageId),
    {
      enabled: !!pageId,
    }
  );
};

const useEventGallery = (eventId) => {
  return useQuery(
    ["event-gallery", eventId],
    () => galleryService.getGalleryByEventId(eventId),
    {
      enabled: !!eventId,
    }
  );
};

export {
  useCreateGallery,
  useUserGallery,
  useGalleryData,
  usePageGallery,
  useUpdateGallery,
  useEventGallery,
};
