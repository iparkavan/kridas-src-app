import axios from "../utils/axios";

class PageSponsorService {
  async getSponsorByPageId(pageId) {
    const res = await axios.get(`/company-sponsor/getByCompanyId/${pageId}`);
    // if (res.data.message) {
    //   throw new Error(res.data.message);
    // }
    return res.data.data;
  }
}

export default new PageSponsorService();
