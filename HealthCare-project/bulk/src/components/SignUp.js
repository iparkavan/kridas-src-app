import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { ToastError } from "../service/toast/Toast";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import FormControl from "@material-ui/core/FormControl";
import logo from "../img/beats-health.png";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

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
         color: '#fff',
       },
   }),
);
const BootstrapInput = withStyles((theme: Theme) =>
   createStyles({
      root: {
         'label + &': {
            marginTop: theme.spacing(3),
         },
      },
      input: {


      },
   }),
)(InputBase);

const SignUp = () => {
   const classes = useStyles();
   const [userName, setUserName] = React.useState("");
   const [isLoading, setLoading] = React.useState(false);
   const history = useHistory();
   const signUpUser = () => {
      if (userName === "") {
         ToastError("Please enter valid email or contact Beats Health");
         return false;
      }
      let data = JSON.stringify({ useremail: userName });
      let config = {
        method: "post",
        url: process.env.REACT_APP_BEATS_USER_SIGN_UP_API,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      setLoading(true);
      axios(config)
        .then(function (response) {
          setLoading(false);
          history.push("/EmailVerification");
        })
        .catch(function (error) {
          setLoading(false);
          if(error.response.data!==undefined){
            ToastError(error.response.data.error);
          }else{
            ToastError("UnExpected Error Occurred !");
          }
          console.log(error);
        });
     
    };
   return (
      <div className={classes.root} justify="center" alignItems="center"  >
         <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
         </Backdrop>
      <CssBaseline />
      <ToastContainer />
         <Grid container className="h100" justify="center" alignItems="center">

            <Box component="div" className="signin h100" >
               <Box component="div" className="mainlogo">
                  <img src={logo} alt="Logo" />
               </Box>
               <Box component="div" boxShadow={3} className="signinbox " >
                  <Box component="div" className="signinbox-in ">

                     <h6 className="btitle">Eligibility, Coverage, Claims, and ERA Verification Platform</h6>
                     <p className="txtbdr">Get started with a new account</p>

                     <FormControl className="txtform">


                        <Grid container spacing={3}>
                           <Grid item xs={12} >
                              <BootstrapInput className="primary-input  width100p" placeholder="Your work email" onChange={(e) => setUserName(e.target.value)} />
                             </Grid>

                        </Grid>

                     </FormControl>

                     <p className="termstxt"> &nbsp;</p>
                     <p className="termstxt">
                        By signing in, I agree to Beats Health's {" "}
                        <a href = {process.env.REACT_APP_REGION == 'INDIA' ? "https://b9137071-9ec2-4f99-8a27-84ba40c770a8.usrfiles.com/ugd/b91370_62f94f573a2b482ea01df13afccfa38d.pdf" : "https://95c241c3-f72d-4075-8a74-2e51b42fb168.filesusr.com/ugd/b91370_61edc289b5734e008f8dadd088b6dbf8.pdf"} target="_blank" rel="noreferrer" className="linkprim">
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
                </a>{" "}
                     </p>

                     <Grid container className="pb30 pt30">
                        <Grid item xs={12} sm={12} md={12}>
                        <button className="btn-primary" onClick={signUpUser}>
                           Sign Up
                        </button>
                        </Grid>
                     </Grid>


                  </Box>

                  <Grid container className="signinbototm" >
                     <Grid item xs={12} sm={6} md={6} >
                        <p className="txt-left linkprim">Need Help? <a href="https://www.thebeatshealth.com/#adi_page1001_1_102" target={'_blank'} rel="noreferrer">Contact Us</a></p>
                     </Grid>
                     <Grid item xs={12} sm={6} md={6} >
                        <p className="txt-right linkprim">Existing User? <a href="/SignIn" >Sign In</a></p>
                     </Grid>
                  </Grid>
               </Box>

            </Box>


         </Grid>


      </div>


   );
}


export default SignUp;
