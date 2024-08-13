import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { ToastSuccess, ToastError } from "../service/toast/Toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Grid from "@material-ui/core/Grid";
import Backdrop from "@material-ui/core/Backdrop";
import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import FormControl from "@material-ui/core/FormControl";
import logo from "../img/beats-health.png";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    paper: {
      padding: theme.spacing(0),
      color: theme.palette.text.secondary,
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
  const classes = useStyles();
  const [userName, setUserName] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const [isMailSent, setIsMailSent] = React.useState(false);
  const [isResentOnce, setIsResentOnce] = React.useState(false);

  const resendEmail = () => {
    if (userName === "") {
      ToastError("Registered Email is required");
      return false;
    }
    let data = JSON.stringify({ email: userName });
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_FORGOT_PASSWORD,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        setIsResentOnce(true);
        setLoading(false);
        setUserName("");
        ToastSuccess("Password reset link sent successFully. Please check your email.")
      })
      .catch(function (error) {
        ////debugger;
        setUserName("")
        setLoading(false);
        ToastError("Failed To send password reset link.");
        console.log(error);
      });
  }
  const forGotPassword = () => {
    if (userName === "") {
      ToastError("Registered Email is required");
      return false;
    }
    let data = JSON.stringify({ email: userName });
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_FORGOT_PASSWORD,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        setIsMailSent(true);
        setLoading(false);
        ToastSuccess("Please check your email for password reset verification link.");
      })
      .catch(function (error) {
        //debugger;
        setUserName("");
        setLoading(false);
        if(error.response.status===404){
          ToastError(error.response.data.msg);
        }else{
          ToastError("Failed to send email for verification.");
        }
        console.log(error);
      });
  };

  return (
    <div className={classes.root} justify="center" alignItems="center">
     <Backdrop className={classes.backdrop} open={isLoading} >
        <CircularProgress color="inherit" />
      </Backdrop>
      <ToastContainer />
      <Grid container className="h100" justify="center" alignItems="center">
      {isMailSent===false?
        <Box component="div" className="signin h100">
          <Box component="div" className="mainlogo">
            <img src={logo} alt="Logo" />
          </Box>
          <Box component="div" boxShadow={3} className="signinbox">
            <Box component="div" className="signinbox-in">
              <h6 className="btitle">Forgot Password?</h6>
              <p className="txtbdr mxw350 txt-center marcenter">
              Don't worry! Please tell us the email address you registered with us.
              </p>

              <FormControl className="txtform">
                <BootstrapInput
                  className="primary-input mb10"
                  placeholder="Registered Email"
                  id="bootstrap-input"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </FormControl>

              <Grid container className="pb30 pt10 mt30">
                <Grid item xs={12} sm={12} md={12}>
                  <button className="btn-primary" onClick={forGotPassword}>
                    Send Password Reset Link
                  </button>
                </Grid>
              </Grid>

            </Box>

            <Grid container className="signinbototm">
              <Grid item xs={12} sm={6} md={6}>
                <p className="txt-left linkprim">
                  Need Help? <a href="https://www.thebeatshealth.com/#adi_page1001_1_102" target={'_blank'} rel="noreferrer">Contact Us</a>
                </p>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <p className="txt-right linkprim">
                  New User? <a href="/SignUp">Sign Up</a>
                </p>
              </Grid>
            </Grid>
          </Box>
        </Box>:  
        <Box component="div" className="signin h100">
          <Box component="div" className="mainlogo">
            <img src={logo} alt="Logo" />
          </Box>
          <Box component="div" boxShadow={3} className="signinbox">
            <Box component="div" className="signinbox-in">
              <h5 className="btitle">Password Reset</h5>
              <p className="termstxt mxw450 txt-center marcenter pb30">If you haven't received verification email, please check your spam or junk folder. If you still haven't received, click below to resend verification email</p>
              <p className="txtbdr mxw450 txt-center marcenter pb30"> Click the reset link in your email to update your password</p>
              <p className="termstxt mxw450 txt-center marcenter mt4em">
                If you did not receive the confirmation email, please click below
               </p>

              <Grid container className="pb30 mt2em  ">
                <Grid item xs={12} sm={12} md={12}>
                  <button 
                  style={isResentOnce?{opacity:'0.3'}:{opacity:'1'}}
                  className="btn-primary" 
                  onClick={resendEmail} 
                  disabled={isResentOnce?true:false}
                  >
                    Resend Email
                  </button>
                </Grid>
              </Grid>

            </Box>

            <Grid container className="signinbototm">
              <Grid item xs={12} sm={6} md={6}>
                <p className="txt-left linkprim">
                  Need Help? <a href="https://www.thebeatshealth.com/#adi_page1001_1_102" target={'_blank'} rel="noreferrer">Contact Us</a>
                </p>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <p className="txt-right linkprim">New user?  <a href="/SignUp" >Sign Up</a></p>
              </Grid>,
                   </Grid>
          </Box>
        </Box>
        }
      </Grid>
    </div>
  );
};

export default SignIn;
