import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import {
   withStyles,
} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import FormControl from '@material-ui/core/FormControl';
import logo from '../img/beats-health.png';

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         flexGrow: 1,
      },
      paper: {
         padding: theme.spacing(0),
         color: theme.palette.text.secondary,
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

const SignIn = () => {
   const classes = useStyles();
   return (
      <div className={classes.root} justify="center" alignItems="center"  >
          
         <Grid  container className="h100"  justify="center" alignItems="center">
       
            <Box component="div" className="signin h100" >
           <Box component="div" className="mainlogo">
           <img src={logo} alt="Logo" />
           </Box>
            <Box component="div" boxShadow={3} className="signinbox" >
           
              
               <Box component="div" className="signinbox-in">

                 

                  <h5 className="btitle">How can we help?</h5>
                  <p className="txtbdr">We usually respond in a few hours</p>

                  <FormControl className="txtform">


                  <Grid container spacing={3}>
                    <Grid item xs={12} >
                    <BootstrapInput className="primary-input  width100p" placeholder="Subject" id="bootstrap-input" />
                 
                    </Grid>
                    <Grid item xs={6}>
                    <BootstrapInput className="primary-input " placeholder="Contact Number" id="bootstrap-input" />
                    
                    </Grid>
                    <Grid item xs={6} >
                    <BootstrapInput className="primary-input  width100p " placeholder="Email" id="bootstrap-input" />
                    
                    </Grid>
 
                    <Grid item xs={12}>
                    <textarea
                        className="primary-input width100p"
                        id="exampleFormControlTextarea1"
                        rows="5"
                        placeholder="How we can help?"
                        />
                    </Grid>
                </Grid>

                   

                    <Grid container className="pb30 pt10 mxw350 marcenter">
                    <Grid item xs={12} sm={12} md={12}>
                   
                        </Grid>
                     <Grid item xs={12} sm={6} md={6}>
                      </Grid>
                     <Grid item xs={12} sm={6} md={6}>
                       </Grid>
                     <Grid item xs={12} sm={12} md={12}>

                    </Grid>
                  </Grid>

                  </FormControl>
                  
                  <Grid container className="pb30 pt30">
                     <Grid item xs={12} sm={12} md={12}>
                        <a href="/SignIn" className="btn-primary" >Sign In</a>
                     </Grid>
                  </Grid>

                  <p className="termstxt">
                     By signing in, I agree to Beats Health's {" "}
                      <a
                   href = {process.env.REACT_APP_REGION == 'INDIA' ? "https://b9137071-9ec2-4f99-8a27-84ba40c770a8.usrfiles.com/ugd/b91370_62f94f573a2b482ea01df13afccfa38d.pdf" : "https://95c241c3-f72d-4075-8a74-2e51b42fb168.filesusr.com/ugd/b91370_61edc289b5734e008f8dadd088b6dbf8.pdf"} 
                  target="_blank"
                  rel="noreferrer"
                  className="linkprim"
                >
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

               </Box>

               <Grid container className="signinbototm">
                  <Grid item xs={12} sm={6} md={6}>
                     <p className="txt-left linkprim">
                        Need Help?{" "}
                        <a href="https://www.thebeatshealth.com/#adi_page1001_1_102" target={'_blank'} rel="noreferrer">
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
}


export default SignIn;
