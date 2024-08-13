class countryConfig {

  //Country By Id
  getCountryById(countryId) {
    return {
      method: "GET",
      url: `/country/get/${countryId}`,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    }
  }

  //Country All
  getAllCountry() {
    return {
      method: "GET",
      url: `/country/getAll`,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  //Country By Name
  geyCountryByName(country_name) {
    return {
      method: "GET",
      url: `/country/getCountryName/${country_name}`,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    }
  }

  //Country By Code
  getCountryByCode(country_code) {
    return {
      method: "GET",
      url: `/country/fetchCountryByCode/${country_code}`,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    }
  }
}
export default new countryConfig();
