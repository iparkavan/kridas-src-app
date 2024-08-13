import axios from "../utils/axios";

class UploadService {
  async uploadData(data) {
    let formData = new FormData();
    formData.append("type", "POST");

    data?.files &&
      Array.from(data.files).map((file) => {
        formData.append("image", file);
      });

    const res = await axios.post("/cloudinary", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }
  async uploadDocument(data) {
    let formData = new FormData();
    data?.files &&
      Array.from(data.files).map((file) => {
        formData.append("document", file);
      });
    const res = await axios.post("/cloudinary/docs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
    // const res = await axios.post("/cloudinary/docs", data);
    // if (res.data.message) {
    //   throw new Error(res.data.message);
    // }
    // return res.data;
  }
}

export default new UploadService();
