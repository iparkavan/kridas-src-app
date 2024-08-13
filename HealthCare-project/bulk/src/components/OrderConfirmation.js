import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
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

const SignIn = () => {
    const classes = useStyles();
    return (
        <div className={classes.root} justify="center" alignItems="center"  >

            <Grid container className="h100" justify="center" alignItems="center">

                <Box component="div" className="signin h100" >
                    <Box component="div" className="mainlogo">
                        <img src={logo} alt="Logo" />
                    </Box>
                    <Box component="div" boxShadow={3} className="signinbox" >


                        <Box component="div" className="signinbox-in">



                            <h5 className="btitle">Order Confirmation</h5>
                            <p className="txtbdr mxw350 txt-center marcenter">Pro Account (Monthly)</p>

                            <Grid container className="orderconfirmation" >
                                <Grid item xs={12}>
                                    <Grid container className=" txt-left" >
                                        <Grid item xs={7} sm={6}  >
                                            <p className="bodycopy">Fee breakup</p>
                                        </Grid>
                                        <Grid item xs={3} sm={3}  >
                                            <p className="bodycopy"> </p>
                                        </Grid>
                                        <Grid item xs={2} sm={3}  >
                                            <p className="bodycopy"> </p>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container  className=" txt-left" >
                                        <Grid item xs={7} sm={7}  >
                                            <p className="bodycopy">Subtotal Before Tax</p>
                                        </Grid>
                                        <Grid item xs={3} sm={3}  >
                                            <p className="bodycopy">$250 </p>
                                        </Grid>
                                        <Grid item xs={2} sm={2}  >
                                            <p className="bodycopy"> </p>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container  className=" txt-left" >
                                        <Grid item xs={7} sm={7}  >
                                            <p className="bodycopy">Estimated Taxes/Fees</p>
                                        </Grid>
                                        <Grid item xs={5} sm={5}  >
                                            <p className="bodycopy">$2.70 <span className="bodycopygc"> <a href="/Dashboard"> Show details</a> </span></p>
                                        </Grid>
                                        
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container  className=" txt-left" >
                                        <Grid item xs={7} sm={7}  >
                                            <p className="bodycopy primary-copy"><b>Total</b></p>
                                        </Grid>
                                        <Grid item xs={3} sm={3}  >
                                            <p className="bodycopy primary-copy"><b> $252.70</b></p>
                                        </Grid>
                                         
                                    </Grid>
                                </Grid>
                            </Grid>
                            <hr className="redline" />

                            <Grid container className="orderconfirmation" >
                                <Grid item xs={12}>
                                    <Grid container className=" txt-left" >
                                        <Grid item xs={12}  >
                                            <h5 className="bodytitle">Monthly Charges</h5>
                                            <p className="bodycopy">Your total monthly charges will include monthly subscription fee + transaction fees associated to number of eligibility checks performed during this period +  applicable taxes. For transaction details, you can view the monthly invoice uploaded to your account</p>
                                        </Grid>
                                   
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container  className=" txt-left" >
                                        <Grid item xs={7} sm={7}  >
                                            <p className="bodytitle">Recurring Monthly Charge</p>
                                            <small>Transaction fees and applicable taxes to be included in above charges</small>
                                        </Grid>
                                        <Grid item xs={5} sm={5}  >
                                            <p className="bodytitle"> $250 </p>
                                            <p className="bodycopy">Renews on 30 April 2021</p>
                                        </Grid>
                                         
                                    </Grid>
                                </Grid>
                                </Grid>
    
                            <Grid container className="pb30 pt30 mt30">
                                <Grid item xs={12} sm={12} md={12}>
                                    <a href="/PasswordReset" className="btn-primary" >Place Order</a>
                                </Grid>
                            </Grid>

                          
                        </Box>

                        <Grid container className="signinbototm" >
                            <Grid item xs={12} sm={6} md={6} >
                                <p className="txt-left linkprim">  <a href="/Dashboard" >Back</a></p>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} >
                                
                            </Grid>
                        </Grid>
                    </Box>

                </Box>


            </Grid>
        </div>


    );
}


export default SignIn;
