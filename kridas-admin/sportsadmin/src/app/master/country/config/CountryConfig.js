class CountryTableConfig {
  //to get all country
    getAllCountry(){
        return{
            method:"GET",
            url:"country/getAll",
            headers:{"Content-Type": "application/json"},
            baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,

        };
    }
//Add new country
    addNewCountryTableValue(data) {
        return {
          method: "POST",
          url: "country",
          headers: { "Content-Type": "application/json" },
          data: data,
          baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
        };
      }
//get country
      getCountryById(countryId) {
        return {
          method: "GET",
          url: `country/get/${countryId}`,
          headers: { "Content-Type": "application/json" },
          baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
        };
      }
//editcountry
      EditCountryTableValue(data) {
        return {
          method: "PUT",
          url: "country",
          headers: { "Content-Type": "application/json" },
          data: data,
          baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
        };
      }
//delete country
      deleteCountryById(countryId) {
        return {
          method: "DELETE",
          url: `country/delete/${countryId}`,
          headers: { "Content-Type": "application/json" },
          baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
        };
      }
// get countrycode
      getCountryCode(countryCode) {
        return {
          method: "GET",
          url: `country/fetchCountryByCode/${countryCode}`,
          headers: { "Content-Type": "application/json" },
          baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
        };
      }

  //Country By Name
  getCountryByName(country_name) {
    return {
      method: "GET",
      url: `/country/getCountryName/${country_name}`,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    }
  }
    
}
export default new CountryTableConfig();