import { objToFormData, objToFormDataSet } from "../helper/form-data";
import axios from "../utils/axios";

class PageService {
  async createPage(data) {
    let formData = new FormData();
    formData = objToFormData(data, formData);

    const res = await axios.post("/company", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async updatePage(type, data) {
    const { pageData, values } = data;
    var formData = new FormData();
    var modifiedFormData = objToFormData(pageData, formData);
    switch (type) {
      case "contact_info":
        modifiedFormData = objToFormDataSet(values, formData);
        break;

      case "about_detail":
        modifiedFormData.set("company_name", values.company_name);
        modifiedFormData.set("main_category_type", values.main_category_type);
        modifiedFormData.set(
          "company_type",
          JSON.stringify(values.company_type)
        );
        if (values.sports_interest) {
          modifiedFormData.set(
            "sports_interest",
            JSON.stringify(values.sports_interest)
          );
          modifiedFormData.delete("company_category");
        }

        modifiedFormData.set("category_id", values.category_id);
        if (values.company_category) {
          modifiedFormData.set(
            "company_category",
            JSON.stringify(values.company_category)
          );
          modifiedFormData.delete("sports_interest");
        }

        modifiedFormData.set("company_desc", values.company_desc);
        if (values.categorywise_statistics) {
          modifiedFormData.set(
            "categorywise_statistics",
            JSON.stringify(values.categorywise_statistics)
          );
        }
        break;

      case "social":
        modifiedFormData = objToFormDataSet(values, formData);
        break;

      case "image":
        if (values.pageProfileImage) {
          modifiedFormData.append(
            "companyProfileImage",
            values.pageProfileImage
          );
        }

        if (values.pageCoverImage) {
          modifiedFormData.append("image", values.pageCoverImage);
        }
        break;
      default:
        break;
    }
    return await axios.put("/company", modifiedFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async getPage(pageId, userId) {
    let url = `/company/get/${pageId}`;
    if (userId) {
      url += `?user_id=${userId}`;
    }
    const res = await axios.get(url);
    return res.data.data;
  }

  async getAllPages() {
    const res = await axios.get("/company/getAll");
    return res.data;
  }

  async getInfiniteUserPages({ pageParam = 0, userId }) {
    const size = 5;
    const res = await axios.post("/company/search", {
      page: pageParam,
      size,
      user_id: userId,
    });
    return res.data;
  }

  async getInfinitePages({
    pageParam = 0,
    pageName = "",
    city = "",
    parentCategories,
    subCategories,
    sportIds,
    userId,
  }) {
    const size = 10;
    const res = await axios.post("/company/searchByName", {
      page: pageParam,
      size,
      company_name: pageName,
      city: city,
      parent_category_id: parentCategories,
      sub_category_type: subCategories,
      sports_id: sportIds,
      user_id: userId,
    });
    return res.data;
  }

  async getPageFollowersById(pageId) {
    const response = await axios.get(`/company/getCompanyData/${pageId}`);
    return response.data;
  }
  async getInfiniteSearchChildPages(venue_name) {
    // console.log(venue_name, "venue form service 2");
    // let venueName = venue_name;
    const res = await axios.post("/company/getChildPages", {
      venue_name,
    });
    return res.data.data;
  }

  async getChildPagesById(data) {
    const res = await axios.post("/company/getChildPages", data);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data.data;
  }

  async getParentTeamPages(data) {
    const res = await axios.post("/company/getParentTeamPages", data);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }
}

export default new PageService();
