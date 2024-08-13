import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import LeftsideMenu from './LeftsideMenu';
import logodb from "../img/Beats-health-logo.png";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Select from 'react-select';
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import { createStyles, Theme } from "@material-ui/core/styles";
import Datepickermod from "./datepicker";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastError, ToastSuccess } from "../service/toast/Toast";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

const drawerWidth = 240;
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

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function MiniDrawer() {
  const classes = useStyles();
  const [isLoading, setLoading] = React.useState(false);
  const [serviceOptions, setServiceOptions] = React.useState([]);
  const [defServiceId, setDefServiceId] = React.useState(30);
  const [open] = React.useState(false);
  var today = new Date();
  const [patientDetails, setPatientDetails] = React.useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    dob: today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) + 'T12:00:00.000Z',
    country_code_label: "US",
    country_code: "",
    contact_number: "",
    email: "",
    dateOfService: today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) + 'T12:00:00.000Z',
    serviceRequiredFor: "self",
    service_type: defServiceId
  });
  const relationshipOptions = [ { value: 'Self', label: 'Self' },
                                { value: 'Spouse', label: 'Spouse' },
                                { value: 'Child', label: 'Child' },
                                { value: 'Employee', label: 'Employee' },
                                { value: 'Organ Donor', label: 'Organ Donor' },
                                { value: 'Cadaver Donor', label: 'Cadaver Donor' },
                                { value: 'Life Partner', label: 'Life Partner' },
                                { value: 'Other Relationship', label: 'Other Relationship' },
                                { value: 'Other Adult', label: 'Other Adult' },
                              ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      textAlign: 'left',
      borderBottom: '1px dotted pink',
      padding: 20,
    }),
  }

  const setPatientDetailsdata = (fieldName, val) => {
    //debugger;
    const data = { ...patientDetails };
    const regExNumberOnly = /^\d{0,10}$/;
    const regExNumberDash = /^(?:\d[-]?){0,10}$/;

    if (fieldName === 'contact_number' && val.length > 12) {
      ToastError("Please enter a valid cell number");
      return;
    } 
    if (fieldName === 'contact_number' && val.length === 10 && regExNumberOnly.test(val)) {
      val  = val.substring(0, 3) + '-' + val.substring(3, 6) + '-' + val.substring(6, 10) ;
    }
    if (fieldName === 'contact_number' && val.length < 10 && val.length > 0 ) {
      if (regExNumberDash.test(val) === false) {
        ToastError("Please enter a valid cell number");
      } 
    }
    data[fieldName] = val;
    setPatientDetails(data);
    if(fieldName === 'service_type') {
      setDefServiceId(val);
    }
  };

  const fetchData = async() => {
    ////debugger;
    let serviceConfig = {
      method: "get",
      url: process.env.REACT_APP_BEATS_LIST_SERVICE_TYPE_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
    };

    setLoading(true);

    try{
      const data = { ...patientDetails };
      let service = await axios(serviceConfig);
      let defaultServiceTypeId = "30";
      try {
        defaultServiceTypeId = JSON.parse(sessionStorage.getItem("attributes")).find((x) => x.name === "custom:TypeOfService").value;
      }catch(error){
        console.log("Service Type not set for profile");
      }
      const defaultServiceTypeIdInt = parseInt(defaultServiceTypeId);
      data['service_type'] = defaultServiceTypeIdInt;
      setPatientDetails(data);
      const defaultServiceTypeName = "Service Type (" + service.data.find(x => x.service_type_Id === defaultServiceTypeIdInt).service_name + ")";
      let options = [{ value: defaultServiceTypeIdInt, label: defaultServiceTypeName }];

      for (var j = 0; j < service.data.length; j++) {
        let objval = {
          value: service.data[j].service_type_Id,
          label: service.data[j].service_name,
        };
        if(service.data[j].service_type_Id !== defaultServiceTypeIdInt) {
          options.push(objval);
        }
      }
      
      setServiceOptions(options);
      setDefServiceId(defaultServiceTypeIdInt);
      setLoading(false);

    }catch(error){
      console.log(error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initiateOnBoarding = () => {
    let data = {...patientDetails};

    //Validations - TO BE COMPLETED
    var isError = false;

    if (data.first_name === '') {
      ToastError("Enter patient's first name");
      isError = true;
    }
    if (data.last_name === '') {
      ToastError("Enter patient's last name");
      isError = true;
    }
    if (data.contact_number === '') {
      ToastError("Enter contact number");
      isError = true;
    }
    if (data.email === '') {
      ToastError("Enter valid email");
      isError = true;
    }
    if(isError) {
      return;
    }
    if(data.service_type!=="" && data.service_type!==null){
      data['service_type'] = parseInt(data['service_type']);
    }
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_REMOTE_ONBOARDING_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
      data: data,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        setLoading(false);
        setPatientDetails({
            first_name: "",
            middle_name: "",
            last_name: "",
            dob: today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) + 'T12:00:00.000Z',
            country_code: "US",
            contact_number: "",
            email: "",
            dateOfService: today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) + 'T12:00:00.000Z',
            serviceRequiredFor: "Self",
            service_type: defServiceId
          });
        ToastSuccess("Patient successfully registered");
      })
      .catch(function (error) {
        setLoading(false);
        ToastError("Failed to register patient");
        console.log(error);
      });
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <ToastContainer />
      <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      {/* <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Mini variant drawer
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <img src={logodb} className="dblogo" alt="Beats Logo" />
          {/*  <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton> */}
        </div>

          <LeftsideMenu/>

        {/*    <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List> */}
      </Drawer>
      <main id="maindiv" className={classes.content}>
        <div className={classes.root}>
          <Grid container spacing={3} className="remoteonboard">
            <Grid item xs={12} sm={12}>
              <h5 className="btitle">Remote Registration</h5>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Paper className="pad20 txt-center bx-shadow dbbox">
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={12} className="pd0">
                    <p class="txt-left linkprim">Patient Details</p>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={3} className="pd0">
                    <BootstrapInput
                      className="primary-input mb20 width100p"
                      placeholder="Patient First Name"
                      value={patientDetails.first_name}
                      onChange={(e) => {
                        setPatientDetailsdata("first_name", e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={3}  className="pd0">
                    <BootstrapInput
                      className="primary-input mb20 width100p"
                      placeholder="Patient Middle Name (Optional)"
                      value={patientDetails.middle_name}
                      onChange={(e) => {
                        setPatientDetailsdata("middle_name", e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}  md={4} lg={6}  className="pd0">
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12} md={12} lg={4} className="pd0">
                        <BootstrapInput
                          className="primary-input mb20 width100p"
                          placeholder="Patient Last Name"
                          value={patientDetails.last_name}
                          onChange={(e) => {
                            setPatientDetailsdata("last_name", e.target.value);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={3}  className="pt0">
                  <Datepickermod
                      label={"Date of Birth (mm/dd/yyyy)"}
                      value={(patientDetails.dob.length === 20 || patientDetails.dob.length === 24) ? patientDetails.dob.split("T")[0]+"T12:00:00Z" : patientDetails.dob }
                      maxDate={Date.now()}
                      dateChanged={(val) => {
                        setPatientDetailsdata("dob", val);
                        console.log("Date selected:", val);
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={12}>
                    <p className="txt-left linkprim">Service Details</p>
                  </Grid>
                  <Grid item xs={12} sm={12} md={3} className="datepicker-cut">
                        <Datepickermod 
                          label={"Date of Service (mm/dd/yyyy)"}
                          value={(patientDetails.dateOfService.length === 20 || patientDetails.dateOfService.length === 24) ? patientDetails.dateOfService.split("T")[0]+"T12:00:00Z" : patientDetails.dateOfService }
                          minDate={Date.now()}
                          dateChanged={(val) => {
                            setPatientDetailsdata("dateOfService", val);
                          }}
                        />
                      </Grid>
                    </Grid>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={4}>
                      <Grid item xs={12} sm={12} md={12} className="txt-left form-radio" >
                         <Select className="selectbox1"
                          onChange = {(selectedOption) => {
                            setPatientDetailsdata("serviceRequiredFor", selectedOption.value);
                            console.log(`Option selected:`, selectedOption);
                          }}
                          styles={customStyles}
                          options={relationshipOptions} 
                          defaultValue={{ value: 'self', label: 'Relationship to Subscriber (Self)' }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                      <Grid item xs={12} sm={12} md={12}>
                      <Select className="selectbox1"
                          onChange = {(selectedOption) => {
                            setPatientDetailsdata("service_type", selectedOption.value);
                            console.log(`Option selected:`, selectedOption);
                          }}
                          options={serviceOptions} 
                          styles={customStyles}
                          value = {
                            serviceOptions.filter(option => 
                              option.value === defServiceId)
                            }
                        />
                      </Grid>
                    </Grid>  
                  </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={12} className="pd0">
                    <p class="txt-left linkprim">Contact Details</p>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} className="pd0">
                    <BootstrapInput
                      className="primary-input mb20 width100p"
                      placeholder="Cell Number"
                      value={patientDetails.contact_number}
                      onChange={(e) => {
                        setPatientDetailsdata("contact_number", e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} className="pd0">
                      <BootstrapInput
                        className="primary-input mb20 width100p"
                        placeholder="Email"
                        value={patientDetails.email}
                        onChange={(e) => {
                          setPatientDetailsdata("email", e.target.value);
                        }}
                      />
                  </Grid>
                </Grid>
                <Grid container className="pb30 pt30 resp-1">
                  <Grid item xs={12} sm={12} md={3} className="txt-right pd0 pt25 resp-button1">
                    <a href="/Dashboard" className="btn-secondary mr30">
                      Cancel
                    </a>
                  </Grid>
                  <Grid item xs={12} sm={12} md={5} className="txt-left pd0  resp-button2">
                    <Button
                      variant="contained"
                      className="btn-primary"
                      onClick = {initiateOnBoarding}
                    >
                      Initiate Registration
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </main>
    </div>
  );
}
