class SportsConfig {

  /* Get All Sports */

  getAllSports() {
    return {
      method: "GET",
      url: "sports/getAll",
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  /* For Add new Sports */

  addSports(data) {
    return {
      method: "POST",
      url: "/sports",
      headers: { "Content-Type": "application/json" },
      data: data,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  /* For Get Sports By Id */

  getById(sportsId) {
    return {
      method: "GET",
      url: `/sports/get/${sportsId}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  /* For Edit Sports */

  EditSports(data) {
    return {
      method: "PUT",
      url: "/sports",
      headers: { "Content-Type": "application/json" },
      data: data,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  /* For Get Sports By SportsName For Duplicate Name Validation */

  getSportsByName(sportsName) {
    return {
      method: "GET",
      url: `sports/fetchSportsByName/${sportsName}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  /* For Get Company By Type */

  getCompanyByType() {
    return {
      method: "GET",
      url: `company/getByType/BRAND`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  /* For Get Company Name By Sports Id For Sports Brand */

  getCompanyNameBySportsId(sportsId) {
    return {
      method: "GET",
      url: `/sports/getCompanyNameBySportsId/${sportsId}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  /* For Delete Sports */

  deleteSports(sportsId) {
    return {
      method: "DELETE",
      url: `sports/delete/${sportsId}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

}

export default new SportsConfig();
