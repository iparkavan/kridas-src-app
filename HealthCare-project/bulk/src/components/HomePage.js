import React, {useState} from 'react';
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from 'axios';
// MUI Components
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import { Text } from 'react-native';
// Util imports
// import {makeStyles} from '@material-ui/core/styles';
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import Grid from '@material-ui/core/Grid';

import CardInput from './CardInput';
import Popup from "./Popup"


const HomePage = ({Organization, NPI}) => {
//   const classes = useStyles();
  //const { id, status} = useParams();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('jwttoken');
  const status = urlParams.get('accesstoken');
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [zipCode, setZip] = useState('');
  const [add1, setAdd1] = useState('');
  const [add2, setAdd2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const[trigger, setTrigger] = useState(false);
  const [pay, payTrigger]= useState(false);
  const org = {Organization};
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

  function  waveHello (){
    
    console.log(clientSecret);
    console.log(elements.getElement(CardElement))

    const result = stripe.confirmCardPayment(clientSecret,{
      payment_method:{
        card: elements.getElement(CardElement)
      },
    });
    
    if (result['paymentIntent']['status'] === "succeeded"){

      console.log("success")
    
    }
  }


  const handleSubmit = async (event) => {

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    

    if (pay === false){
      const res = await axios.post(process.env.REACT_APP_BEATS_STRIPE_REGISTRATION, {Organization: org, NPI: npi, zipCode: zipCode, add1: add1, add2: add2, city: city, state: state } );

      const clientSecret = res.data['client_secret'];
      const subscription = res.data['subscription'];
      const priceId = res.data['price_id'];
      const subtotal = res.data['subtotal'];
      const tax = res.data['tax'];
      const taxPercent = res.data['tax_percent'];
      const total = res.data['total'];
      const invoice_number = res.data['invoice_number'];
      const customer_email = res.data['customer_email'];
      const period_start = res.data['period_start'];
      const period_end = res.data['period_end'];
      const description = res.data['description'];
      const fees = res.data['fees'];
      const taxFees = res.data['tax_fees'];
      
      console.log(fees);

      setFees(fees);
      setTaxFees(taxFees);
      setDescription(description);
      setSubtotal(subtotal);
      setTax(tax);
      setTotal(total);
      setInvoice(invoice_number);
      setEnd(period_end);
      setclientSecret(clientSecret);
      setTaxPercent(taxPercent);

      // console.log(clientSecret)
      // console.log(elements.getElement(CardElement))
      setTrigger(true);
      payTrigger(true);
    }
    else{
        const result = await stripe.confirmCardPayment(clientSecret,{
          payment_method:{
            card: elements.getElement(CardElement)
          },
        });
        
        if(result['paymentIntent']['status'] === "succeeded"){
          completeOnBoarding();
          console.log("success")
          history.push("/ThankYou");
          //window.location.href="/ThankYou";
        }
        else{
          history.push("/PaymentFail");
          //window.location.href="/PaymentFail";
        }

    }

  };

  const completeOnBoarding = () => {

    let configdelete = {
      method: "post",
      url: process.env.REACT_APP_BEATS_COMPLETE_SCREEN_STATUS,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + id,
      },
      data: {
        dummy: "dummy",
      },
    };
    
    axios(configdelete)
      .then(function (response) {
        ////debugger;
        console.log("complete successful");
        return;
      })
      .catch(function (error) {
        console.log(error);
        return;
      });

  };

  return (
    <Card >
      <CardContent >
        <h2> 
            Basic Plan
        </h2>
        <p>Monthly Subscription Amount: <b>$250</b></p>
        <Text>
        {"\n"}
        </Text>
        <CardInput/>
        <Text>
        {"\n"}
        </Text>
        <Grid item xs={12} md={12} className="txt-left pd0" >
        <label><b>Billing Address Details</b></label>
        </Grid>
        <Text>
        {"\n"}
        </Text>
        <Grid container spacing={3}>
        <Grid item xs={12} md={6} >
            {/* <BootstrapInput className="primary-input  width100p" placeholder="Address line 1" /> */}
            <TextField
          label='Address Line 1'
          id='Address Line 1'
          margin='normal'
          variant='outlined'
          type='Address'
          required
          value={add1}
          onChange={(e) => setAdd1(e.target.value)}
          fullWidth
          
        />
        </Grid>
        <Grid item xs={12} md={6}>
            {/* <BootstrapInput className="primary-input  width100p" placeholder="Address line 2" /> */}
        <TextField
          label='Address Line 2'
          id='Address Line 2'
          margin='normal'
          variant='outlined'
          type='Address'
          value={add2}
          onChange={(e) => setAdd2(e.target.value)}
          fullWidth
        />
        </Grid>
        <Grid item xs={12} md={6}>
            {/* <BootstrapInput className="primary-input  width100p" placeholder="City" /> */}
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
            {/* <BootstrapInput className="primary-input  width100p" placeholder="Select State" /> */}
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
        {/* <Grid item xs={12} md={6}> */}
            {/* <BootstrapInput className="primary-input  width100p" placeholder="Select Country / Region" /> */}
        {/* </Grid> */}
        <Grid item xs={12} md={6}>
            {/* <BootstrapInput className="primary-input  width100p" placeholder="Zip Code" /> */}
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
        </Grid>
        <Text>
        {"\n"}
        {"\n"}
        </Text>

        <Popup payTrigger = {payTrigger} handleSubmit = {handleSubmit}  clientSecret = {clientSecret} trigger = {trigger} setTrigger = {setTrigger} description = {description} subtotal = {subtotal} tax = {tax} fees = {fees} taxFees = {taxFees} taxPercent = {taxPercent} total = {total} invoice = {invoice} end = {end} />
        
        <div >
          <Button variant="contained" className="btn-primary" onClick={() => {
          handleSubmit();
        }}>
            Continue 
          </Button>
          {/* <Button variant="contained" color="primary" >
            Subscription
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}

export default HomePage;
