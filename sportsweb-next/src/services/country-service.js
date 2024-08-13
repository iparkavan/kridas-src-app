import axios from "../utils/axios";

class CountryService {
  /**
   * Fetch all countries
   * @returns
   */
  getAllCountries() {
    return axios.get("country/getAll");
  }

  async getCountryByISOCode(code) {
    const res = await axios.get(`country/getByCountryCodeIso/${code}`);
    return res.data;
  }

  async getCountryByCode(code) {
    const res = await axios.get(`country/fetchCountryByCode/${code}`);
    return res.data;
  }

  getAllCities() {
    return axios.get("company/getAllCities");
  }
}

export default new CountryService();
