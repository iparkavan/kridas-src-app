import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import auth from "./service/AuthService";
import "react-dates/initialize";

const token = localStorage.getItem("userInfo");

if (token) {
	auth.authenticated = true;
}

ReactDOM.render(<App />, document.getElementById("root"));
