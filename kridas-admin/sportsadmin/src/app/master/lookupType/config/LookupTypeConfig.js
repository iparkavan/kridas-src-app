class LookupTypeConfig {
    getAllLookupTypes() {
      return {
        method: "GET",
        url: "/lookup-type/getAll",
        headers: { "Content-Type": "application/json" },
        baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
      };
    }

    getLookupByType(lookupType) {
      return {
        method: "GET",
        url: `lookup-type/get/${lookupType}`,
        headers: { "Content-Type": "application/json" },
        baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
      };
    }
}

export default new LookupTypeConfig();