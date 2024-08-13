import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest.url === process.env.REACT_APP_BEATS_USER_SIGN_IN_API &&
      localStorage.getItem("rememberMe") !== "true"
    ) {
      return Promise.reject(error);
    }

    console.log(error.response);

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      return axios
        .post(process.env.REACT_APP_BEATS_REFRESH_TOKEN, {
          refreshToken: refreshToken,
          email: JSON.parse(localStorage.getItem("attributes")).find(x => x.name === 'email').value
        })
        .then((response) => {
          if (response.status === 201) {
            let idToken = response.data.idToken;
            console.log(JSON.stringify(response.data));
            sessionStorage.setItem("accessToken", response.data.accessToken);
            sessionStorage.setItem("idToken", response.data.idToken);
            sessionStorage.setItem("refreshToken", response.data.refreshToken);
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("idToken", response.data.idToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + idToken;
            return axios(originalRequest);
          }
        });
    }
    return Promise.reject(error);
  }
);

ReactDOM.render(
  <BrowserRouter>
    <App /> {/* The various pages will be displayed by the `Main` component. */}
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
