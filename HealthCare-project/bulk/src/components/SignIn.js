import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { ToastError } from "../service/toast/Toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import logo from "../img/beats-health.png";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import MuiAlert from "@material-ui/lab/Alert";
import { isRememberMeActive } from "../service/IsAuthenticated";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(0),
      color: theme.palette.text.secondary,
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
);
const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "label + &": {
        marginTop: theme.spacing(3),
      },
    },
    input: {},
  })
)(InputBase);

const SignIn = () => {
  const history = useHistory();
  const classes = useStyles();
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const [isattempted, setAttempted] = React.useState(0);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    if (isRememberMeActive()) {
      history.push("/Dashboard");
    }
    if (
      localStorage.getItem("rememberMe") != null &&
      localStorage.getItem("rememberMe") !== "" &&
      localStorage.getItem("rememberMe") === "true"
    ) {
      setRememberMe(true);
      if (
        localStorage.getItem("attributes") != null &&
        localStorage.getItem("attributes") !== ""
      ) {
        setUserName(
          JSON.parse(localStorage.getItem("attributes")).find(
            (x) => x.name === "email"
          ).value
        );
        setPassword("*********");
      }
    }
  }, []);

  const screenStatus = async () => {
    try {
      // let config = {
      //   method: "post",
      //   url: process.env.REACT_APP_BEATS_FETCH_SCREEN_STATUS,
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      //   },
      // };
      // let data = await axios(config);
      // let screenStatusObj = data["data"];
      let url = "/Dashboard";
      // if (screenStatusObj.role === "Platform Admin") {
      //   url = "/SuperUser";
      // }
      // if (screenStatusObj.screenToNavigate === "SUBSCRIBER_DETAILS") {
      //   url = "/SubscriberDetails";
      // } else if (screenStatusObj.screenToNavigate === "MAPPING") {
      //   url = "/Mapping";
      // } else if (screenStatusObj.screenToNavigate === "ADMIN_CONFIG") {
      //   url = "/AdminConfiguration";
      // }

      // sessionStorage.setItem("role", screenStatusObj.role);
      // sessionStorage.setItem("lastName", screenStatusObj.last_name);
      // sessionStorage.setItem("firstName", screenStatusObj.first_name);
      sessionStorage.setItem("role", "Platform Admin");
      sessionStorage.setItem("lastName", "");
      sessionStorage.setItem("firstName", "");
      history.push(url);
      setLoading(false);
    } catch (err) {
      if (err.response !== undefined) {
        sessionStorage.clear();
        localStorage.clear();
      }
      setLoading(false);
      console.log(err);
    }
  };

  const rememberChange = () => {
    let rememberVal = !rememberMe;
    localStorage.setItem("rememberMe", rememberVal);
    setRememberMe(rememberVal);
    if (rememberVal === false) {
      setUserName("");
      setPassword("");
      localStorage.clear();
      ToastError("Please provide your credential");
    }
  };

  const rememberMeLogin = () => {
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_REFRESH_TOKEN,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        refreshToken: localStorage.getItem("refreshToken"),
        email: JSON.parse(localStorage.getItem("attributes")).find(
          (x) => x.name === "email"
        ).value,
      },
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        sessionStorage.setItem("accessToken", response.data.accessToken);
        sessionStorage.setItem("idToken", response.data.idToken);
        sessionStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("idToken", response.data.idToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        setLoading(false);
        history.push("/Dashboard");
      })
      .catch(function (error) {
        setUserName("");
        setPassword("");
        localStorage.clear();
        setLoading(false);
        let attemptTimes = isattempted + 1;
        setAttempted(attemptTimes);
        ToastError("Invalid Email or Password!");
        console.log(error);
      });
  };

  const keyPress = (e) => {
    if (e.keyCode === 13) {
      console.log("Enter key pressed");
      signInUser();
    }
  };

  const signInUser = () => {
    if (isattempted === 3) {
      ToastError(
        "Please use forgot password to reset your password if you are a registered user or Sign Up if you are not already registered"
      );
      return false;
    }

    if (userName === "") {
      setErrorMessage("Email is required");
      return false;
    }
    if (password === "") {
      setErrorMessage("Password is required");
      return false;
    }

    let data = JSON.stringify({ username: userName, password: password });
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_USER_SIGN_IN_API,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        sessionStorage.setItem("accessToken", response.data.accessToken);
        sessionStorage.setItem("idToken", response.data.idToken);
        sessionStorage.setItem("refreshToken", response.data.refreshToken);
        // console.log('response', response)
        let data = response.data.attributes;
        let newArray = [];
        data.forEach((val) => {
          let namekey = Object.keys(val)[0];
          let valuekey = Object.keys(val)[1];
          let name = val[namekey];
          let value = val[valuekey];
          newArray.push({
            name: name,
            value: value,
          });
        });
        sessionStorage.setItem("attributes", JSON.stringify(newArray));
        //sessionStorage.setItem("attributes", JSON.stringify(response.data.attributes));
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("idToken", response.data.idToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("attributes", JSON.stringify(newArray));
        //localStorage.setItem("attributes", JSON.stringify(response.data.attributes));
        screenStatus();
        // let url = "/Dashboard";
        // console.log("data", data);
        // history.push(url);
      })
      .catch(function (error) {
        setLoading(false);
        let attemptTimes = isattempted + 1;
        setAttempted(attemptTimes);
        ToastError("Invalid Email or Password!");
        console.log(error);
      });
  };

  return (
    <div className={classes.root} justify="center" alignItems="center">
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ToastContainer />
      <Grid container className="h100" justify="center" alignItems="center">
        <Box component="div" className="signin h100">
          <Box component="div" className="mainlogo">
            <img src={logo} alt="Logo" />
          </Box>
          <Box component="div" boxShadow={3} className="signinbox">
            <Box component="div" className="signinbox-in">
              <h6 className="btitle">
                {process.env.REACT_APP_REGION == "INDIA"
                  ? "Eligibility, Coverage, Claims, and ERA Verification Platform"
                  : "Eligibility, Coverage, Claims, and ERA Verification Platform"}
              </h6>

              <p className="txtbdr">
                {process.env.REACT_APP_REGION == "INDIA"
                  ? "Connect with 5000+ payers"
                  : "Connect with 5000+ payers"}
              </p>

              <div className="alert">
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              </div>

              <FormControl className="txtform">
                <BootstrapInput
                  className="primary-input mb20"
                  placeholder="Registered Email"
                  id="bootstrap-input"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <BootstrapInput
                  className="primary-input"
                  placeholder="Password"
                  type="password"
                  id="bootstrap-input1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => keyPress(e)}
                />
              </FormControl>
              <Grid container className="pb30 pt10 mxw350 marcenter">
                <Grid item xs={12} sm={6} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="checkedA"
                        checked={rememberMe}
                        onChange={rememberChange}
                      />
                    }
                    label="Remember me"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} className="pt10 txt-right">
                  <a href="/ForgotPassword" className="forgotpass txt-right">
                    Forgot Password? &nbsp;
                  </a>
                </Grid>
              </Grid>

              <p className="termstxt">
                By signing in, I agree to Beats Health's{" "}
                <a
                  href={
                    process.env.REACT_APP_REGION == "INDIA"
                      ? "https://b9137071-9ec2-4f99-8a27-84ba40c770a8.usrfiles.com/ugd/b91370_62f94f573a2b482ea01df13afccfa38d.pdf"
                      : "https://95c241c3-f72d-4075-8a74-2e51b42fb168.filesusr.com/ugd/b91370_61edc289b5734e008f8dadd088b6dbf8.pdf"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="linkprim"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href={
                    process.env.REACT_APP_REGION == "INDIA"
                      ? "https://b9137071-9ec2-4f99-8a27-84ba40c770a8.usrfiles.com/ugd/b91370_5eb62d82034544f8af76303559534897.pdf"
                      : "https://95c241c3-f72d-4075-8a74-2e51b42fb168.filesusr.com/ugd/b91370_23cc2539c189446e98b2eca2d7f2b1e1.pdf"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="linkprim"
                >
                  Terms of Service.
                </a>{" "}
              </p>

              <Grid container className="pb30 pt30">
                <Grid item xs={12} sm={12} md={12}>
                  <button className="btn-primary" onClick={signInUser}>
                    Sign In
                  </button>
                </Grid>
              </Grid>
            </Box>

            <Grid container className="signinbototm">
              <Grid item xs={12} sm={6} md={6}>
                <p className="txt-left linkprim">
                  Need Help?{" "}
                  <a
                    href="https://www.thebeatshealth.com/#adi_page1001_1_102"
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    Contact Us
                  </a>
                </p>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <p className="txt-right linkprim">
                  New User? <a href="/SignUp">Sign Up</a>
                </p>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </div>
  );
};

export default SignIn;
