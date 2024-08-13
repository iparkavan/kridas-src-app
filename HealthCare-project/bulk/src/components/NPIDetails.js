import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastSuccess, ToastError } from "../service/toast/Toast";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import Widget from "./doublebox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import logo from "../img/beats-health.png";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Select from 'react-select';

import HomePage from './HomePage';
import {CardElement} from '@stripe/react-stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {useStripe, useElements} from '@stripe/react-stripe-js';



const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: "100%",
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    paper: {
      padding: theme.spacing(0),
      color: theme.palette.text.secondary,
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
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

export default function HorizontalLabelPositionBelowStepper() {
  const classes = useStyles();
  //const { id, status} = useParams();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('jwttoken');
  const status = urlParams.get('accesstoken');
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);
  const [Organization, setOrganization] = React.useState("");
  const [defaultOrganization, setDefaultOrganization] = React.useState("");
  const [NPI, setNpi] = React.useState("");
  const [TypeOfPractice, setTypeOfPractice] = React.useState("");
  const [taxonomyDesc, setTaxonomyDesc] = React.useState("");
  const [address1, setAddress1] = React.useState("");
  const [address2, setAddress2] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [countryName, setCountryName] = React.useState("");
  const [taxonomyCode, setTaxonomyCode] = React.useState("");
  const [taxonomyState, setTaxonomyState] = React.useState("");
  const [taxonomyLicense, setTaxonomyLicense] = React.useState("");
  const [taxonomyGroup, setTaxonomyGroup] = React.useState("");
  const [contactNumber, setContactNumber] = React.useState("");
  const [isClicked, setButtonClicked] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [serviceType, setServiceType] = React.useState(30);
  const [confirmPass, setConfirmPass] = React.useState("");
  const [successMsg, setShowSuccessMsg] = React.useState(true);
  const [npiDetails, setNpiDetails] = React.useState("");
  const [isDateChecked, setisDateChecked] = React.useState(false);
  const [isOnDateServiceChecked, setOnDateServiceChecked] = React.useState(false);
  const [noOfDays, setNumbOfDays] = React.useState(0);
  const [practiceData, setPracticeData] = React.useState([]);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      textAlign: 'left',
      borderBottom: '1px dotted pink',
      padding: 20,
    }),
  }

  const fetchData = () => {
   // //debugger;
    if (successMsg && status!=="Payer") {
      ToastSuccess("Email ID verified successfully");
    }
    let config = {
      method: "get",
      url: process.env.REACT_APP_BEATS_LIST_SERVICE_TYPE_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + id,
      },
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        setLoading(false);
        let optionsData = [...practiceData];

        let data = response.data;
        for (var i = 0; i < data.length; i++) {
          if(data[i].service_type_Id === 30) {
            let obj = {
              value: data[i].service_type_Id,
              label: "Service Type (" + data[i].service_name + ")",
            };
            optionsData.push(obj);
          } else {
            let obj = {
              value: data[i].service_type_Id,
              label: data[i].service_name,
            };
            optionsData.push(obj);
          }
        }
        setPracticeData(optionsData);
      })
      .catch(function (error) {
        setLoading(false);
        ToastError("Failed To Fetch Type of Practice Information!");
        console.log(error);
      });
  };

  React.useEffect(() => {
    /********NPI DETAILS*********/
    if(status==="Payer"){
      setActiveStep(1);
    }
    fetchData();
  }, []);

  const fetchNPIData = async(val) => {
    ////debugger;
    setNpi(val);
    //Validation for npi
    const regExNumberOnly = /^\d{0,10}$/;
    if(val.length > 10) {
      val = val.substring(0,10);
      setNpi(val);
    }
    if(val.length !== 10) {
      return;
    }

    if(!regExNumberOnly.test(val)) {
      ToastError("Please enter a valid NPI")
      return;
    }

    console.log("Continue with getting NPI details from API ...");
    setLoading(true);

    let config = {
      method: "get",
      url: process.env.REACT_APP_BEATS_FETCH_NPI_DETAILS + "?npi="+val,
      headers: {
        "Content-Type": "application/json",
      }
    };

    axios(config)
      .then(function (response) {
        let data = response.data;              
        console.log(data);
        setOrganization(data.practiceName);
        setDefaultOrganization(data.practiceName);
        setTypeOfPractice(data.typeOfPractice);
        setAddress1(data.address1);
        setAddress2(data.address2);
        setCity(data.city);
        setState(data.state);
        setPostalCode(data.postalCode);
        setCountryName(data.countryName);
        setTaxonomyCode(data.taxonomyCode);
        setTaxonomyState(data.taxonomyState);
        setTaxonomyLicense(data.taxonomyLicense);
        setTaxonomyGroup(data.taxonomyGroup);
        setContactNumber(data.contactNumber);
        setTaxonomyDesc(data.taxonomyDesc);
        setLoading(false);
    })
    .catch(function (error) {
      console.log(error);
      setLoading(false);
    });
  };

  const updateNpiData = (data) => {
    setNpiDetails(data);
  };

  const saveUserConfig = () => {
    const daysbeforeservice = isDateChecked ? 1 : 0;
    const dateservice = isOnDateServiceChecked ? 1 : 0;
    const noDays = daysbeforeservice?noOfDays: 0;
    if(!daysbeforeservice){
      setNumbOfDays(0);
    }
    let data = JSON.stringify({
      onDateService: dateservice,
      daysBeforeDateOfService: daysbeforeservice,
      daysbefore: noDays,
    });
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_SAVE_USER_CONFIG_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + id,
      },
      data: data,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        setLoading(false);
        handleNext();
      })
      .catch(function (error) {
        setLoading(false);
        ToastError("Couldn't Save Npi Information  !");
        console.log(error);
      });
  };

  const saveNpiDetails = () => {
    let npidata = JSON.stringify({
      attr: npiDetails,
    });
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_SAVE_PAYER_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + id,
      },
      data: npidata,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        setLoading(false);
        handleNext();
      })
      .catch(function (error) {
        setLoading(false);
        ToastError("Couldn't Save Npi Information  !");
        console.log(error);
      });
  };

  const updateApi = () => {
    console.log("active steps", activeStep);
    setShowSuccessMsg(false);
    if (activeStep === 3) {
      handleNext();
    } else if (activeStep === 2) {
      saveUserConfig();
      return false;
    } else if (activeStep === 1) {
      saveNpiDetails();
      return false;
    } else if (activeStep === 0) {
      if (NPI === "") {
        ToastError("NPI is required");
        return false;
      }
      if (password === "") {
        ToastError("New Password is required");
        return false;
      }
      if (confirmPass === "") {
        ToastError("Confirm Password is required");
        return false;
      }
      if ((Organization === "") || (TypeOfPractice==='AT' && Organization === defaultOrganization)) {
        ToastError("Business Name is required for Individual practice type");
        return false;
      }

      if (password !== confirmPass) {
        ToastError("New Password and Confirm Password are not Matching");
        return false;
      }

      let data = JSON.stringify({
        Organization: Organization,
        NPI: parseInt(NPI),
        TypeOfPractice: TypeOfPractice,
        TypeOfService: serviceType,
        address1: address1,
        address2: address2,
        city: city,
        state: state,
        postalCode: postalCode,
        countryName: countryName,
        taxonomyCode: taxonomyCode,
        taxonomyDesc: taxonomyDesc,
        taxonomyState: taxonomyState,
        taxonomyLicense: taxonomyLicense,
        taxonomyGroup: taxonomyGroup,
        contactNumber: contactNumber,
        password: "",
        newPassword: confirmPass,
      });
      console.log("Payload ==> ", data)
      let config = {
        method: "post",
        url: process.env.REACT_APP_BEATS_USER_UPDATE_API,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + id,
          "is-update": "insert",
        },
        data: data,
      };
      setLoading(true);
      axios(config)
        .then(function (response) {
          setLoading(false);
          handleNext();
        })
        .catch(function (error) {
          setLoading(false);
          ToastError("Couldn't Save Information  !");
          console.log(error);
        });
    }
  };

  const skipNpiStep = () => {
    console.log("Skipping NPI Details");
    ToastError("Please note till you complete these details, patient network status cannot be determined. Try and complete this as soon as you can by accessing this information in your profile")
    handleNext();
  };

  const getSteps = () => {
    return [
      "NPI Details",
      "Payers In Network",
      "Eligibility Check Frequency",
      "Billing Details",
    ];
  };
  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <FormControl className="txtform">
            <Grid container spacing={3}>
            <Grid item xs={12}>
                <BootstrapInput
                  className="primary-input  width100p"
                  placeholder="National Provider Identifier (NPI)"
                  value={NPI}
                  id="bootstrap-input"
                  onChange={(e) => fetchNPIData(e.target.value)} 
                />
              </Grid>
              <Grid item xs={12}>
                <Grid className="detail-list" container spacing={1} justify="left" >
                  <Grid item xs={12} justify="center" className="details-label">
                    Organization/Hospital/Practice Name
                  </Grid>
                  <Grid item xs={12} justify="center"  className="details-value" >
                    {TypeOfPractice==='H' ? Organization : ""}
                    <BootstrapInput
                      className="primary-input  width100p"
                      placeholder= "Doing Business As ..."
                      style={{ display: TypeOfPractice==='AT' ? "block" : "none" }}
                      value={( TypeOfPractice==='AT' && Organization === defaultOrganization) ? "" : Organization}
                      id="bootstrap-input"
                      onChange={(e) => setOrganization(e.target.value)} 
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid className="detail-list" container spacing={1} justify="left" >
                  <Grid item xs={12} justify="center" className="details-label">
                    Type of Practice
                  </Grid>
                  <Grid item xs={12} justify="center"  className="details-value" >
                    {TypeOfPractice==='H'? 'Institution / Organization':(TypeOfPractice==='AT'?'Individual':'')}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid className="detail-list" container spacing={1} justify="left" >
                  <Grid item xs={12} justify="center" className="details-label">
                    Taxonomy Description
                  </Grid>
                  <Grid item xs={12} justify="center"  className="details-value" >
                    {taxonomyDesc}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Select className="selectbox1"
                  onChange = {(selectedOption) => {
                    setServiceType(selectedOption.value);
                    console.log(`Option selected:`, selectedOption);
                  }}
                  options={practiceData} 
                  styles={customStyles}
                  value = {
                    practiceData.filter(option => 
                      option.value === serviceType)
                    }
                />
              </Grid>
              <Grid item xs={12}>
                <BootstrapInput
                  className="primary-input  width100p"
                  placeholder="Password"
                  type="password"
                  id="bootstrap-input"
                  onChange={(e) => setPassword(e.target.value)}
                ></BootstrapInput>
              </Grid>
              <Grid item xs={12}>
                <BootstrapInput
                  className="primary-input  width100p"
                  placeholder="Confirm Password"
                  type="password"
                  id="bootstrap-input"
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
              </Grid>
            </Grid>
          </FormControl>
        );
      case 1:
        return (
          <div>
            {" "}
            <Widget id={id} setNpiDetail={updateNpiData} loading={(val)=>setLoading(val)}/>{" "}
          </div>
        );
      case 2:
        return (
          <Grid item xs={12} sm={12}>
            <Paper className="pad20 txt-left bx-shadow dbbox">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12} className="pd0">
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="checkedA"
                        checked={isOnDateServiceChecked}
                        onChange={(e) => {
                          setOnDateServiceChecked(!isOnDateServiceChecked);
                        }}
                      />
                    }
                    label="On Date of Service"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={6} className="pd0">
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="checkedB"
                        checked={isDateChecked}
                        onChange={(e) => {
                          if(!isDateChecked===true){
                            setNumbOfDays(0);
                          }
                          setisDateChecked(!isDateChecked);
                        }}
                      />
                    }
                    label="Day(s) Before Date of Service"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={3} className="pd0">
                  <BootstrapInput
                    className="primary-input mb20 width100p"
                    placeholder=""
                    value={noOfDays}
                    style={{ display: isDateChecked ? "block" : "none" }}
                    onChange={(e) => {
                      setNumbOfDays(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        );

      default:
        return (
          <FormControl className="txtform500">
          <Grid container spacing={3}>
          <Grid item xs={12} md={12} >
          <Elements stripe={stripePromise}>
             <HomePage Organization = {Organization} NPI = {NPI} />
             {/* HomePage(); */}
            </Elements>
          </Grid>
          </Grid>
          </FormControl>

          // <FormControl className="txtform500">
          //   <Grid container spacing={3}>
          //     <Grid item xs={12} md={12} className="txt-left pd0">
          //       <label>Card Details</label>
          //     </Grid>
          //     <Grid item xs={12} md={6}>
          //       <BootstrapInput
          //         className="primary-input  width100p"
          //         placeholder="Card Holder Name"
          //         id="bootstrap-input"
          //       />
          //     </Grid>
          //     <Grid item xs={12} md={6}>
          //       <BootstrapInput
          //         className="primary-input  width100p"
          //         placeholder="Card Number"
          //         id="bootstrap-input"
          //       />
          //     </Grid>
          //     <Grid item xs={12} md={6}>
          //       <BootstrapInput
          //         className="primary-input  width100p"
          //         placeholder="Expiry Date (MM/YY)"
          //         id="bootstrap-input"
          //       />
          //     </Grid>
          //     <Grid item xs={12} md={6}>
          //       <BootstrapInput
          //         className="primary-input  width100p"
          //         placeholder="CVV"
          //         id="bootstrap-input"
          //       />
          //     </Grid>

          //     <Grid item xs={12} md={12} className="txt-left pd0">
          //       <label>Address Details</label>
          //     </Grid>
          //     <Grid item xs={12} md={6}>
          //       <BootstrapInput
          //         className="primary-input  width100p"
          //         placeholder="Address line 1"
          //         id="bootstrap-input"
          //       />
          //     </Grid>
          //     <Grid item xs={12} md={6}>
          //       <BootstrapInput
          //         className="primary-input  width100p"
          //         placeholder="Address line 2"
          //         id="bootstrap-input"
          //       />
          //     </Grid>
          //     <Grid item xs={12} md={6}>
          //       <BootstrapInput
          //         className="primary-input  width100p"
          //         placeholder="City"
          //         id="bootstrap-input"
          //       />
          //     </Grid>
          //     <Grid item xs={12} md={6}>
          //       <BootstrapInput
          //         className="primary-input  width100p"
          //         placeholder="Select State"
          //         id="bootstrap-input"
          //       />
          //     </Grid>
          //     <Grid item xs={12} md={6}>
          //       <BootstrapInput
          //         className="primary-input  width100p"
          //         placeholder="Select Country / Region"
          //         id="bootstrap-input"
          //       />
          //     </Grid>
          //     <Grid item xs={12} md={6}>
          //       <BootstrapInput
          //         className="primary-input  width100p"
          //         placeholder="Zip Code"
          //         id="bootstrap-input"
          //       />
          //     </Grid>
          //   </Grid>
          // </FormControl>
        );
    }
  };

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <div className={classes.root} justify="center" alignItems="center">
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <CssBaseline />
      <ToastContainer />
      <Grid container className="h100" justify="center" alignItems="center">
        <Box component="div" className="signin h100">
          <Box component="div" className="mainlogo">
            <img src={logo} alt="Logo" />
          </Box>
          <Box component="div" boxShadow={3} className="signinbox ">
            <Box component="div" className="signinbox-in ">
              <h5 className="btitle">NPI Details</h5>
              <p className="termstxt pb30 pt10 marcenter">
                Please provide accurate details. This information will be used
                to connect with payers to validate your patients' eligibility
              </p>

              <div className={classes.root}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <div>
                  {activeStep === steps.length -1 ? (
                    <div>
                      <Typography className={classes.instructions}>
                        {getStepContent(activeStep)}
                        {/* All steps completed */}
                      </Typography>
                      {/* <Button onClick={handleReset}>Reset</Button> */}
                    </div>
                  ) : (
                    <div>
                      <Typography className={classes.instructions}>
                        {getStepContent(activeStep)}
                      </Typography>
                      <div className="mt2em">
                        <Button
                          variant="contained"
                          className="btn-primary"
                          onClick={updateApi}
                          disabled={isClicked}
                        >
                          {}
                          {activeStep === steps.length - 1
                            ? "Continue"
                            : "Continue"}
                        </Button>
                      </div>
                      <div className="mt2em">
                        <Button
                          variant="contained"
                          className="btn-cancel"
                          onClick={skipNpiStep}
                          style={{ display: (activeStep === 1) ? "block" : "none" }}
                        >
                          {}
                          Skip, I will do this later
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Box>
          </Box>
        </Box>
      </Grid>
    </div>
  );
}
