import { objToFormData } from "../helper/form-data";
import axios from "../utils/axios";

class SponsorService {
  async createSponsor(data) {
    const { type, ...updatedData } = data;
    let formData = new FormData();
    formData = objToFormData(updatedData, formData);
    const requestUrl =
      type === "company" ? "/sponsor" : "/sponsor/event-sponsor";
    const res = await axios.post(requestUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async updateSponsor(data) {
    const { type, ...updatedData } = data;
    let formData = new FormData();
    formData = objToFormData(updatedData, formData);
    const requestUrl =
      type === "company" ? "/sponsor" : "/sponsor/event-sponsor";
    const res = await axios.put(requestUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async deleteSponsor({ sponsorId }) {
    const res = await axios.delete(`/sponsor/deleteById/${sponsorId}`);
    // if (res.data.message) {
    //   throw new Error(res.data.message);
    // }
    return res.data;
  }

  async saveSponsorOrder(data) {
    const { type, id, ...updatedData } = data;
    const requestUrl =
      type === "company" ? "/sponsor/save" : "/sponsor/event-sponsor/save";
    const res = await axios.post(requestUrl, updatedData);
    return res.data;
  }
}

export default new SponsorService();
