import { useMutation } from "react-query";
import uploadService from "../services/upload-service";

const useCloudinaryUpload = () => {
  return useMutation((data) => {
    return uploadService.uploadData(data);
  });
};

const useDocumentUpload = () => {
  return useMutation((data) => {
    return uploadService.uploadDocument(data);
  });
};

export { useCloudinaryUpload,useDocumentUpload };
