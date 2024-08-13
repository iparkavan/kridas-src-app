import axios from "../utils/axios";
import { objToFormData } from "../helper/form-data";
class GalleryMediaService {
  async createGalleryMedia(data) {
    let formData = new FormData();
    formData.append("gallery_id", data.gallery_id);
    for (let i = 0; i < data.file.length; i++)
      formData.append("file", data.file[i]);
    const response = await axios.post("/gallery-media", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
}

export default new GalleryMediaService();
