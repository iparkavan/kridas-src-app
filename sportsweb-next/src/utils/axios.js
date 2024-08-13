import axios from "axios";
// import humps from "humps";
// import FormData from "form-data";

const instance = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_GATEWAY });

const axiosEvents = axios.create({
  baseURL: process.env.NEXT_PUBLIC_EVENTS_API_GATEWAY,
});

const axiosMarketPlace = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MARKETPLACE_API_GATEWAY,
});

const axiosCommon = axios.create({
  baseURL: process.env.NEXT_PUBLIC_COMMON_API_GATEWAY,
});

/* instance.interceptors.request.use((config) => {
  // To convert camelCase to snake_case
  if (config.data && !(config.data instanceof FormData)) {
    const transformedData = humps.decamelizeKeys(config.data);
    config.data = transformedData;
  }
  return config;
}); */

/* instance.interceptors.response.use((response) => {
  // To convert snake_case to camelCase
  if (response.data) {
    const transformedData = humps.camelizeKeys(response.data);
    response.data = transformedData;
  }
  return response;
}); */

export { axiosEvents, axiosMarketPlace, axiosCommon };
export default instance;
