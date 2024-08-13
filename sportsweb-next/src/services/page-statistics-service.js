import { objToFormData } from "../helper/form-data";
import axios from "../utils/axios";

class PageStatisticsService {
  async getAllPagesStatistics() {
    const response = await axios.get("/company/statistics/getAll");
    return response.data.data;
  }

  async getPageStatistics(id) {
    const response = await axios.get(
      `/company/statistics/getCompanyById/${id}`
    );
    return response.data.data;
  }

  async getStatisticsById(id) {
    const response = await axios.get(`/company/statistics/get/${id}`);
    return response.data.data;
  }

  async createCompanyStatistics(data) {
    let formData = new FormData();
    if (data?.statistics_links)
      data.statistics_links = data.statistics_links?.filter((link) => link);

    formData = objToFormData(data, formData);
    data?.statistics_docs?.forEach((file) => {
      if (file instanceof File) {
        formData.append("document", file);
      }
    });
    formData.delete("statistics_docs");
    const response = await axios.post("/company/statistics", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response.data.message) {
      throw new Error(response.data.message);
    }
    return response.data;
  }

  async updateStatisticsById(data) {
    const { statistic, values } = data;
    let formData = new FormData();
    if (values?.statistics_links)
      values.statistics_links = values.statistics_links?.filter((link) => link);

    formData = objToFormData({ ...statistic, ...values }, formData);
    values?.statistics_docs?.forEach((doc) => {
      if (doc instanceof File) {
        formData.append("document", doc);
      }
    });

    return await axios.put("/company/statistics", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async deleteStatisticById(id) {
    return await axios.delete(`/company/statistics/delete/${id}`);
  }
}

export default new PageStatisticsService();
