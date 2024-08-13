import { objToFormData } from "../helper/form-data";
import axios from "../utils/axios";

class UserStatisticsService {
  async createUserStatistics(data) {
    let formData = new FormData();

    if (data?.statistics_links)
      data.statistics_links = data.statistics_links?.filter((link) => link);

    formData = objToFormData(data, formData);

    data?.documents?.forEach((file) => {
      if (file instanceof File) {
        formData.append("document", file);
      }
    });

    formData.delete("documents");

    const res = await axios.post("/users/statistics", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async getUserStatistics(id) {
    const res = await axios.get(`/users/statistics/getUserById/${id}`);
    return res.data.data;
  }

  async deleteUserStatisticsOrCareer(data) {
    const { id, type } = data;
    const res = await axios.delete(`/users/statistics/delete/${id}/${type}`);
    return res.data;
  }

  async updateUserStatistics(data) {
    let formData = new FormData();

    // data.sports_statistics = data?.["sports_statistics"]?.map(
    const userStats = data?.["sports_statistics"]?.map(
      (sportStatistic, index) => {
        if (sportStatistic?.statistics_links) {
          sportStatistic.statistics_links =
            sportStatistic.statistics_links?.filter((link) => link);
        }

        sportStatistic["statistics_docs"] = sportStatistic?.[
          "statistics_docs"
        ]?.map((doc) => {
          if (sportStatistic?.documents.find((d) => d?.url === doc.url)) {
            return doc;
          }
          return { ...doc, is_delete: "Y" };
        });

        sportStatistic["user_id"] = data?.["user_id"];

        sportStatistic?.documents?.forEach((doc) => {
          if (doc instanceof File) {
            formData.append(`document[${index}]`, doc);
          }
        });

        delete sportStatistic.isInitial;
        delete sportStatistic.documents;
        return sportStatistic;
      }
    );

    formData = objToFormData(
      { userStats, user_id: data?.["user_id"] },
      formData
    );
    // formData = objToFormData(data.sports_statistics, formData);

    const res = await axios.post("/users/statistics/addMultiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async createSportsCareer(data) {
    data.sport_career = JSON.stringify(data.sport_career);
    const res = await axios.post("/users/statistics/sportsCareers", data);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }
}

export default new UserStatisticsService();
