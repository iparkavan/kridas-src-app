import React from "react";

import TextField from "@material-ui/core/TextField";

import UserService from "../../../service/UserService";
import "./signup.scss";
import { Link } from "react-router-dom";

import hallacademylogo from "../../../assets/images/hallmark-physio-logo.png";
import Featured from "../../../assets/images/featured.jpg";

class SignupComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: "",
      password: "",
      message: "",
      firstName: "",
      lastName: "",
      userPhone: ""
    };
    //	this.login = this.login.bind(this);
  }

  componentDidMount() {
    localStorage.clear();
  }

  // 	<button
  // 	onClick={() => {
  // 	  auth.login(() => {
  // 		props.history.push("/app");
  // 	  });
  // 	}}
  //   >
  // 	Login
  //   </button>

  // login = e => {
  // 	e.preventDefault();
  // 	const credentials = { userEmail: this.state.userEmail, password: this.state.password };
  // 	AuthService.login(credentials).then(res => {
  // 		console.log("Result..." + res.data.userEmail);
  // 		if (res.status === 200) {
  // 			localStorage.setItem("userInfo", JSON.stringify(res.data));
  // 			this.props.history.push("/dash");

  // 		} else {
  // 			this.setState({ message: res.data.message });
  // 		}
  // 	});
  // };

  saveUser = e => {
    e.preventDefault();
    let user = {
      userEmail: this.state.userEmail,
      userPassword: this.state.userPassword,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      middleName: this.state.middleName,
      userPhone: this.state.userPhone,
      userWebsite: this.state.userWebsite
    };
    UserService.addUser(user).then(res => {
      this.setState({ message: "User added successfully." });
      this.props.history.push("/users");
    });
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <>
        <div className="login__wrapper">
          <div className="login_left">
            <img
              src={Featured}
              alt="hallmark academy logo"
              className="left_img"
            />
          </div>
          <div className="login_right">
            <div className="form_block">
              <form autoComplete="off">
                <div className="signup_flex_container">
                  <div className="login_caps">
                    <img
                      src={hallacademylogo}
                      alt="hallmark academy logo"
                      className="imgstyle"
                    />
                    <div className="academy__name">
                      Hallmark Physiotherapy Academy
                    </div>
                  </div>

                  <div className="flex-item">
                    <TextField
                      label="First Name"
                      fullWidth
                      margin="normal"
                      name="firstName"
                      value={this.state.firstName}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="flex-item">
                    <TextField
                      label="Last Name"
                      fullWidth
                      margin="normal"
                      name="lastName"
                      value={this.state.lastName}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="flex-item">
                    <TextField
                      label="Phone"
                      fullWidth
                      margin="normal"
                      name="userPhone"
                      value={this.state.userPhone}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="flex-item">
                    <TextField
                      type="text"
                      label="Enter Email"
                      fullWidth
                      margin="normal"
                      name="userEmail"
                      value={this.state.userEmail}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="flex-item">
                    <TextField
                      type="password"
                      label="Enter Password"
                      fullWidth
                      margin="normal"
                      name="password"
                      value={this.state.password}
                      onChange={this.onChange}
                    />
                  </div>

                  <div className="fgt_pass">
                    <div className="login_rememberme">&nbsp;</div>
                    <div className="login_forgotpass">&nbsp;</div>
                  </div>
                  <div className="styl__center">
                    <div class="neuBtn" onClick={this.saveUser}>
                      <span>Sign up</span>
                    </div>
                  </div>
                  <div className="login_signup">
                    Already have an account?&nbsp;
                    <span className="login_links">
                      <Link to="/">Sign In</Link>
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default SignupComponent;
