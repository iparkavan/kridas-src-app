import React from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import AuthService from "../../service/AuthService";
import styles from "./login.module.css";

import hallacademylogo from "../../assets/images/hallmark-physio-logo.png";

class HomeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: "",
      password: "",
      message: ""
    };
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    localStorage.clear();
  }

  login = e => {
    e.preventDefault();
    const credentials = {
      userEmail: this.state.userEmail,
      password: this.state.password
    };
    AuthService.login(credentials).then(res => {
      console.log("Result..." + res.data.userEmail);
      if (res.status === 200) {
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        this.props.history.push("/dash");
        //this.props.history.push("/users");
      } else {
        this.setState({ message: res.data.message });
      }
    });
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <React.Fragment>
        <div className={styles.login__wrapper}>
          <div className={styles.left}>
            <div className={styles.logo}>
              <img
                src={hallacademylogo}
                alt="hallmark academy logo"
                className={styles.imgstyle}
              />
            </div>
            <div className={styles.academy__name}>
              Hallmark Physiotherapy Academy
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.form__block}>
              <form autoComplete="off">
                <div className="flex-container">
                  <div className="flex-item">
                    <TextField
                      type="text"
                      label="EMAIL"
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
                      label="PASSWORD"
                      fullWidth
                      margin="normal"
                      name="password"
                      value={this.state.password}
                      onChange={this.onChange}
                    />
                  </div>

                  <div className={styles.styl__center}>
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      onClick={this.login}
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

// const styles= {
//     center :{
//         display: 'flex',
//         justifyContent: 'center'

//     },
//     notification: {
//         display: 'flex',
//         justifyContent: 'center',
//         color: '#dc3545'
//     }
// }

export default HomeComponent;
