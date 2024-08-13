import axios from "../utils/axios";

class GalleryService {
  async createGallery(data) {
    const { type, Id, ...values } = data;
    if (type === "page") {
      values.user_id = null;
      values.company_id = Id;
    } else if (type === "user") {
      values.company_id = null;
      values.user_id = Id;
    } else if (type === "event") {
      values.gallery_event_id = Id;
      // values.event_id = Id;
    }

    const response = await axios.post("/gallery", values);
    return response.data;
  }

  async updateGallery(data) {
    // console.log(data);
    const response = await axios.put("/gallery", data);
    return response.data;
  }

  async getGalleryByUserId(userId) {
    const response = await axios.get(`/gallery/getByUserId/${userId}`);
    return response.data.data;
  }

  async getGalleryByGalleryId(gallery_id) {
    const response = await axios.get(`/gallery/get/${gallery_id}`);
    return response.data.data;
  }

  async getGalleryByPageId(pageId) {
    const response = await axios.get(`/gallery/getByCompanyId/${pageId}`);
    return response.data.data;
  }

  async getGalleryByEventId(eventId) {
    const response = await axios.get(`/gallery/getByEventId/${eventId}`);
    return response.data.data;
  }
}

export default new GalleryService();
