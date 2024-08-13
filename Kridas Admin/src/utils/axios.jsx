import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_MIDDLEWARE_API_URL,
});

const axiosMarketPlace = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_MIDDLEWARE_URL_MARKETPLACE,
});

export default axiosMarketPlace;

export { instance };
