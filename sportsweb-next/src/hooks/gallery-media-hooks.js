import { useMutation, useQueryClient } from "react-query";
import galleryMediaService from "../services/gallery-media-service";

const useCreateGalleryMedia = (type) => {
  const queryClient = useQueryClient();
  return useMutation((data) => galleryMediaService.createGalleryMedia(data), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${type}-gallery`]);
    },
  });
};

export { useCreateGalleryMedia };
