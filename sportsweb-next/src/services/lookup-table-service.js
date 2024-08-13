import axios from "../utils/axios";

class LookupTableService {
  /**
   * Fetch lookup values based on lookup type
   * @param {string} lookupType
   * @returns
   */
  async getLookupValuesByType(lookupType) {
    const response = await axios.get(`/lookup-table/getByType/${lookupType}`);
    if (response.data.message) {
      throw new Error(response.data.message);
    }
    return response.data;
  }
}

export default new LookupTableService();
