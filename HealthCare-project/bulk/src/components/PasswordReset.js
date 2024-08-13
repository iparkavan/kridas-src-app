import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import logo from "../img/beats-health.png";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(0),
      color: theme.palette.text.secondary,
    },
  })
);

const SignIn = () => {
  const history = useHistory();
  const classes = useStyles();
  return (
    <div className={classes.root} justify="center" alignItems="center">
      <Grid container className="h100" justify="center" alignItems="center">
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
                  <button className="btn-primary" onClick={()=>history.push('/ForgotPassword')}>
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
                <p className="txt-right linkprim">Existing User? <a href="/SignIn" >Sign In</a></p>
              </Grid>,
            </Grid>
          </Box>
        </Box>
      </Grid>
    </div>
  );
};

export default SignIn;
