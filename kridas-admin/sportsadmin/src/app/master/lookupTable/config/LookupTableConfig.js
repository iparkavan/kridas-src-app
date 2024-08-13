class LookupTableConfig {
  getAllLookupTypes() {
    return {
      method: "GET",
      url: "/lookup-type/getAll",
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  getLookupTableByType(lookup_type) {
    return {
      method: "GET",
      url: `/lookup-table/getByType/${lookup_type}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  getLookupTableByKeyType(lookup_key, lookup_type) {
    return {
      method: "GET",
      url: `/lookup-table/get/${lookup_key}/${lookup_type}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  getLookupTableByKey(lookupKey) {
    return {
      method: "GET",
      url: `/looku-table/get/${lookupKey}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  addNewLookupTableValue(data) {
    return {
      method: "POST",
      url: "/lookup-table",
      headers: { "Content-Type": "application/json" },
      data: {
        lookup_key: data.lookup_key,
        lookup_value: data.lookup_value,
        lookup_type: data.lookup_type,
      },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  updateLookupTableValue(data) {
    return {
      method: "PUT",
      url: "/lookup-table",
      headers: { "Content-Type": "application/json" },
      data: {
        lookup_key: data.lookup_key,
        lookup_value: data.lookup_value,
        lookup_type: data.lookup_type,
      },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }


}

export default new LookupTableConfig();
