import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { ToastError, ToastSuccess } from "../service/toast/Toast";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";
import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import FormControl from "@material-ui/core/FormControl";
import logo from "../img/beats-health.png";
import axios from "axios";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import "react-toastify/dist/ReactToastify.css";

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
      }
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

const UpdatePassword = () => {
  const classes = useStyles();
  const history = useHistory();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('jwttoken');
  const status = urlParams.get('accesstoken');
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);

  const updatePassword = () => {
    ////debugger;
    if (password === "") {
      ToastError("Password is required");
      return false;
    }
    if (confirmPassword === "") {
      ToastError("Confirm Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      ToastError("New Password and Confirm Password are not Matching");
      return false;
    }

    if(password.length<=7){
      ToastError("Password Length Should Be At Least 8 Characters");
      return false;
    }

    if(!(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/).test(password)){
      ToastError("Password Should Contain At least One Special Character");
      return false;
    }


    if(password.match(/\d+/g)===null){
      ToastError("Password Should Contain At least One Numeric Number");
      return false;
    }

    if(!isContainsUpperLowerCaseLetter(password, 'upper')){
      ToastError("Password Should Contain At least One Uppercase Number");
      return false;
    }

    if(!isContainsUpperLowerCaseLetter(password, 'lower')){
      ToastError("Password Should Contain At least One LowerCase Number");
      return false;
    }

    let data = JSON.stringify({ password: "", newPassword: password });
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_USER_UPDATE_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + id,
        "is-update": "update"
      },
      data: data,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        setLoading(false);
        ToastSuccess("Password updated SuccessFully. Please Login!");
        history.push('/UpdateSuccess');
      })
      .catch(function (error) {
       // ////debugger;
        setLoading(false);
        ToastError("Failed To Reset Password!");
        console.log(error);
      });
  };

  const isContainsUpperLowerCaseLetter = (val, op)=>{
    let flag = false;
   // let stringArr = val.split();
    if(op === "upper"){
      for(let i=0;i<val.length;i++){
        if(/[A-Z]/.test(val[i])){
          flag = true;
          break;
        }
      }
    }else{
      for(let i=0;i<val.length;i++){
        if(/[a-z]/.test(val[i])){
          flag = true;
          break;
        }
      }
    } 
    return flag;
}


  return (
    <div className={classes.root} justify="center" alignItems="center">
     <Backdrop className={classes.backdrop} open={isLoading} >
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
              
            <Grid container className="pb30 pt30 mt30">
                <Grid item xs={12} sm={12} md={12}>
                  <p className="txtbdr mxw350 txt-center marcenter">
                    Please Enter New Password
                  </p>

                  <FormControl className="txtform">
                    <BootstrapInput
                      className="primary-input mb20"
                      placeholder="New Password"
                      id="bootstrap-input"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>

                  <FormControl className="txtform">
                    <BootstrapInput
                                        type="password"
                      className="primary-input mb20"
                      placeholder="Confirm Password"
                      id="bootstrap-input"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </FormControl>
              </Grid>
              </Grid>

              <p className="termstxt">
                By signing in, I agree to Beats Health's {" "}
                <a  href = {
                  process.env.REACT_APP_REGION == 'INDIA' ? "https://b9137071-9ec2-4f99-8a27-84ba40c770a8.usrfiles.com/ugd/b91370_62f94f573a2b482ea01df13afccfa38d.pdf" : "https://95c241c3-f72d-4075-8a74-2e51b42fb168.filesusr.com/ugd/b91370_61edc289b5734e008f8dadd088b6dbf8.pdf"
                }
                target = "_blank"
                rel = "noreferrer"
                className = "linkprim" >
                  Privacy Policy
                </a>{" "}
                and{" "}
               <a href = {
                  process.env.REACT_APP_REGION == 'INDIA' ? "https://b9137071-9ec2-4f99-8a27-84ba40c770a8.usrfiles.com/ugd/b91370_5eb62d82034544f8af76303559534897.pdf" : "https://95c241c3-f72d-4075-8a74-2e51b42fb168.filesusr.com/ugd/b91370_23cc2539c189446e98b2eca2d7f2b1e1.pdf"
                }
                  
                  target="_blank"
                  rel="noreferrer"
                  className="linkprim"
                >
                  Terms of Service.
                </a>
              </p>
              <Grid container className="pb30 pt30 mt30">
                <Grid item xs={12} sm={12} md={12}>
                  <button className="btn-primary" onClick={updatePassword}>
                    Update Password
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
        </Box>
      </Grid>
    </div>
  );
};

export default UpdatePassword;
