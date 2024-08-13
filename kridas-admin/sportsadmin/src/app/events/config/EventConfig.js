class EventConfig {
  getEventById(id) {
    return {
      method: "GET",
      url: `/events/get/${id}`,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  getAllEvent() {
    return {
      method: "GET",
      url: "/events/getAll",
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  updateEventIsFeature(data) {
    return {
      method: "PUT",
      url: "/events/updateIsFeature",
      headers: { "Content-Type": "application/json" },
      data: data,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }
  // searchEvent(data) {
  //   return {
  //     method: "POST",
  //     url: "/events/searchEvent",
  //     headers: { "Content-Type": "application/json" },
  //     data: data,
  //     baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
  //   };
  // }
}
export default new EventConfig();
