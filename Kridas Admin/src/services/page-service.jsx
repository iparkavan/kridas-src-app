import { instance } from "../utils/axios";

class PageService {
  async getPage(pageId) {
    const res = await instance.get(
      `http://3.143.119.220:5001/api/company/get/${pageId}`
    );
    // if (userId) {
    //   url += `?user_id=${userId}`;
    // }
    // const res = await axios.get(url);
    return res.data.data;
  }

  async getAllPages() {
    const res = await instance.get("company/getAll");
    return res.data;
  }

  async companyProfileVerification(pageVerification) {
    const res = await instance.put("company/verifyProfile", pageVerification);
    return res.data;
  }

  async getCompanyId(companyId) {
    const res = await instance.get(`company/get/${companyId}`);
    return res;
  }

  async editCompanyData() {
    const res = await instance.put('company')
    return res
  }

}

export default new PageService();
