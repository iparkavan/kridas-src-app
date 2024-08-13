import React, {useState} from 'react';
import axios from 'axios';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
// MUI Components
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import InputBase from '@material-ui/core/InputBase';
import TextField from '@material-ui/core/TextField';
import { Text, StyleSheet } from 'react-native';
import { Redirect, Route } from 'react-router-dom'
// Util imports
// import {makeStyles} from '@material-ui/core/styles';
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import Grid from '@material-ui/core/Grid';
import {
    fade,
    withStyles,
    createMuiTheme,
 } from '@material-ui/core/styles';
import { ToastError, ToastSuccess } from "../service/toast/Toast";
import CardInput from './CardInput';
import { useHistory } from 'react-router-dom';
import Loader from "react-loader-spinner";
import Popup from "./Popup"
import { SettingsVoice } from '@material-ui/icons';
import { setSeconds } from 'date-fns';
import {loadStripe} from '@stripe/stripe-js';
import FormControl from '@material-ui/core/FormControl';
import {Elements} from '@stripe/react-stripe-js';
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
// const useStyles = makeStyles({
//   root: {
//     maxWidth: 500,
//     margin: '35vh auto',
//   },
//   content: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignContent: 'flex-start',
//   },
//   div: {
//     display: 'flex',
//     flexDirection: 'row',
//     alignContent: 'flex-start',
//     justifyContent: 'space-between',
//   },
//   button: {
//     margin: '2em auto 1em',
//   },
// });
const StripeUpdate = ({NPI}) => {
//   const classes = useStyles();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [zipCode, setZip] = useState('');
  const [add1, setAdd1] = useState('');
  const [add2, setAdd2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const[trigger, setTrigger] = useState(false);
  const [pay, payTrigger]= useState(false);
  const stripePromise = loadStripe('pk_test_51Ij5ayC2V2ajAK3d3juQBP9WJa8iBbj28QCpVyvCFfK2GNYNVWZY3ykXnBtW63PZcr1MTfQApRXgArNU3jSpI6ac004zNPrvoA');
  const npi = {NPI};
  const [subtotal, setSubtotal] = useState('');
  const [tax, setTax] = useState('');
  const [taxPercent, setTaxPercent] = useState('');
  const [invoice, setInvoice] = useState('');
  const [end, setEnd] = useState('');
  const [total, setTotal] = useState('');
  const [description, setDescription] = useState('');
  const [clientSecret, setclientSecret] = useState('');
  const [fees, setFees] = useState('');
  const [taxFees, setTaxFees] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();
  const [paymentMethod, setPaymentMethod] = useState('');
  function  waveHello (){
    
    ToastSuccess("Successfully Updated.");
  }
  const handleSubmit = async (event) => {
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    console.log(elements.getElement(CardElement))
    const result = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
            billing_details: {
            address: {
                line1: add1,
                line2: add2, 
                city: city,
                postal_code: zipCode,
                state: state,
                country: 'US',
                },
            },
    })
    //console.log(result.paymentMethod)
    const paymentId = result.paymentMethod['id']
    console.log(paymentId)
    const res = await axios.post(process.env.REACT_APP_BEATS_STRIPE_UPDATE,{paymentId: paymentId, NPI: NPI});
    console.log(res)
  };
  return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={12} className="txt-left pd0" >
                <label>Card Details</label>
            </Grid>

            
            <Grid item xs={12} md={12} >
            {/* <Elements stripe={stripePromise}> */}
                <CardInput/>
            {/* </Elements> */}
                
                {/* <BootstrapInput className="primary-input  width100p" placeholder="Card Holder Name"   /> */}
            </Grid>
            {/* <Grid item xs={12} md={6}>
                <BootstrapInput className="primary-input  width100p" placeholder="Card Number"  />
            </Grid>
            <Grid item xs={12} md={6}>
                <BootstrapInput className="primary-input  width100p" placeholder="Expiry Date (MM/YY)"  />
            </Grid>
            <Grid item xs={12} md={6}>
                <BootstrapInput className="primary-input  width100p" placeholder="CVV"   />
            </Grid> */}
            <Grid item xs={12} md={12} className="txt-left pd0" >
                <label>Billing Details</label>
            </Grid>
            
            <Grid item xs={12} md={6} >
            <TextField label='Address Line 1' id='add1' margin='normal' variant='outlined' type='add1' required value={add1} onChange={(e) => setAdd1(e.target.value)} fullWidth/>
                {/* <BootstrapInput className="primary-input  width100p" placeholder="Address line 1"  /> */}
            </Grid>
            <Grid item xs={12} md={6}>
            <TextField label='Address Line 2' id='Address Line 2' margin='normal' variant='outlined' type='Address' value={add2} onChange={(e) => setAdd2(e.target.value)} fullWidth/>
            </Grid>
            <Grid item xs={12} md={6}>
            <TextField
                label='City'
                id='City'
                margin='normal'
                variant='outlined'
                type='City'
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                fullWidth
                
            />
            </Grid>
            <Grid item xs={12} md={6}>
            <TextField
                label='State (e.g. IL)'
                id='State'
                margin='normal'
                variant='outlined'
                type='State'
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                fullWidth
            />
            </Grid>
            <Grid item xs={12} md={6}>
                    <TextField
                label='Zip Code'
                id='Zip'
                margin='normal'
                variant='outlined'
                type='Zip'
                required
                value={zipCode}
                onChange={(e) => setZip(e.target.value)}
                fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={12} md={12}  >
                <p className="txt-center  mt30 mb20 "><a href="#" className="btn-primary" onClick={() => {handleSubmit(); waveHello(); }} >Save</a></p>
            </Grid>
        </Grid>
    
  );
}
export default StripeUpdate;
