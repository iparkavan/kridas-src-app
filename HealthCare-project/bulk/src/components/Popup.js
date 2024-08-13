import React from 'react'
import "./Popup.css"
import { useState } from "react";
// MUI Components
import { useStripe } from '@stripe/react-stripe-js';
import { MDBCloseIcon } from "mdbreact"




function Pay(client_secret, card) {

    const stripe = useStripe();
    
      // Use your card Element with other Stripe.js APIs
    const result = stripe.confirmCardPayment(client_secret,{
      payment_method:{
        card: card
      },
    });

    console.log(result);

}



const Popup = ({payTrigger, handleSubmit, clientSecret, trigger, setTrigger, description, subtotal, tax, fees, taxFees, taxPercent, total, end, invoice}) => {

    const [title, setTitle] = useState("Show Details");
    const [display, setDisplay] = useState(false);

    function onClickButton1(){
      if(title === "Show Details"){
        setTitle("Hide Details")
      }
      else{
        setTitle("Show Details")
      }
    }
    function onClickButton2(){
      if(display === true){
        setDisplay(false);
      }
      else{
        setDisplay(true);
      }
    }


    return(trigger)? (
        <div className = "popup" >
            
            <div className = "popup-inner">
                <p style  ={{fontWeight: "bold", fontSize: "25px"}}>Billing Confirmation</p>
                <p style  ={{fontWeight: "bold"}}>Basic Plan (at $250 / month) </p>
                {/* <p style  ={{fontWeight: "bold"}}> {description} </p> */}
                <br></br>
                <button className = "close-btn" onClick = {()=> {payTrigger(false); setTrigger(false);}}><MDBCloseIcon /></button>
                <div className = "popup-details">
                <p style = {{backgroundColor: '#E5E4E2', fontWeight:"bold" }}>Today's Charge</p>
                  <b>Invoice Number: </b> <i> {invoice} </i>
                  <br></br>
                  <b>Next Billing Date: </b> <i>{end}</i>
                  <br></br>
                  <b>Tax &amp; Fees: </b> <i> ${taxFees} </i>&nbsp;&nbsp;<a onClick={() => {onClickButton1(); onClickButton2();} }>{title}</a>
                  <br></br>
                  <b> Subtotal: </b> <i> ${subtotal}</i>
                  <br></br>
                  <b>Total: </b> <i>${total}</i>
                  <div className ="display">
                    {display ? (
                      <div>
                        <b>Standard Pro Monthly: $250 </b>
                        <p style = {{color: 'gray', fontWeight:"bold"}}>Tax Name  <span style ={{paddingLeft: '150px' }}>Jurisdiction</span> <span style ={{paddingLeft: '150px' }}>Tax Amount</span></p>
                        <p>Tax  <span style ={{paddingLeft: '195px' }}>State</span> <span style ={{paddingLeft: '203px' }}>$ {tax}</span></p>
                        <p>Fees  <span style ={{paddingLeft: '195px' }}> </span> <span style ={{paddingLeft: '234px' }}>$ {fees}</span></p>
                      </div>
                    ) : ("")}
                  </div>
                  <p style = {{color: 'gray'}}>
                    Based on the billing information you have provided, your purchase may be subject to taxes.
                  </p>
                  <p style = {{backgroundColor: '#E5E4E2', fontWeight:"bold" }}>Recurring Charge</p>
                  <p style = {{color: 'gray'}}>
                    Recurring plans will auto-renew using the payment method on file you use today. You will be charged each period of renewal until you cancel.
                    You may request cancellation up until the day before auto-renewal for it to go into effect.
                  </p>
                  <p><span style = {{fontWeight:"bold" }}>Recurring Monthly Charge</span> <span style ={{paddingLeft: '120px' }}>$250</span> <span style ={{color: 'gray'}}>(plus applicable tax &amp; fees)</span> </p>
                  <p style ={{paddingLeft: '325px', color: 'gray' }}>Next renewal on: {end} </p>
                </div>
                {/* <CardInput/> */}
                <br></br>
                <button variant="contained" className = "btn-primary btn-pay" onClick = {()=> {handleSubmit(); }}>Confirm</button>
                {/* ()=> Pay(clientSecret, card) */}

            </div>
           
        </div>
    ):"";
}

export default Popup
