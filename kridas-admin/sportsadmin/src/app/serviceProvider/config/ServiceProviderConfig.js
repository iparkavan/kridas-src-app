class ServiceProviderConfig {
  approveServiceProvider(data) {
    return {
      method: "PUT",
      url: "partner/approveServiceProvider",
      headers: { "Content-Type": "application/json" },
      data: data,
      baseURL: process.env.REACT_APP_BACKEND_API_URL,
    };
  }

  approveSponsorProvider(data) {
    return {
      method: "PUT",
      url: "partner/approveSponsorProvider",
      headers: { "Content-Type": "application/json" },
      data: data,
      baseURL: process.env.REACT_APP_BACKEND_API_URL,
    };
  }

  getServiceProviderByUserId(id) {
    return {
      method: "GET",
      url: `partner/getServiceProviderByUserId/${id}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_BACKEND_API_URL,
    };
  }

  getServiceProviderByCompanyId(id) {
    return {
      method: "GET",
      url: `partner/getServiceProviderByCompanyId/${id}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_BACKEND_API_URL,
    };
  }

  getSponsorProviderByUserId(id) {
    return {
      method: "GET",
      url: `partner/getSponsorProviderByUserId/${id}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_BACKEND_API_URL,
    };
  }

  getSponsorProviderByCompanyId(id) {
    return {
      method: "GET",
      url: `partner/getSponsorProviderByCompanyId/${id}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_BACKEND_API_URL,
    };
  }
}

export default new ServiceProviderConfig();
