import { makeStyles } from "@material-ui/styles";
import React, { useState, useEffect } from "react";
import userConfig from "../config/userConfig";
import { Box } from "@material-ui/core";
import useHttp from "../../../hooks/useHttp";
import Button from "../../common/ui/components/Button";
import { useHistory } from "react-router";
import * as yup from 'yup';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CountryConfig from "../../master/country/config/CountryConfig";
import Social from "./Social";
import { Tab, Tabs } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import UserInformation from "./UserInformation";
import Address from "./Address";
import Image from "./Image";
import PageContainer from '../../common/layout/components/PageContainer'
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons//Cancel';
import UserStatistics from "./userStatistics/userStatisticsList";
import SportsInterested from '../components/SportsInterested';

const useStyles = makeStyles((theme) => ({

  Topheading: {
    fontFamily: "Arial, Helvetica, sans-serif",
    paddingBottom: "1%",
    fontSize: "23px",
    marginLeft: "30px",
    marginBottom: "10px"
  },

  btn: {
    padding: '2--px',
    margin: '10px',
  },

  buttonfield: {
    marginTop: "15px",
    marginLeft: '25px'
  },

  userTab: {
    width: "100%",
  },
}))


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
}

const UserEdit = (props) => {

  const classes = useStyles();
  const history = useHistory();
  const { userId } = props.match.params;
  const [open, setOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const { countryData } = userDetails
  const [country, setCountry] = useState([]);
  const [errors, setErrors] = useState({});
  const [snackError, setSnackError] = useState("success");
  const [snackMsg, setSnackMsg] = useState("User Updated Successfully")
  const { sendRequest } = useHttp();
  const { sendRequest: fetchcountry } = useHttp();
  const { sendRequest: userEdit } = useHttp();
  const [, setClear] = useState({});
  const [value, setValue] = useState(0);
  let defaultAddress = {
    city: "",
    line1: "",
    line2: "",
    state: "",
    country: "",
    pincode: ""
  }

  //FETCHING DATA BY METHODS

  useEffect(() => {
    const countries = CountryConfig.getAllCountry();
    const transformCountryData = (data) => {
      setCountry(data);
    };
    fetchcountry(countries, transformCountryData);
  }, [fetchcountry]);


  useEffect(() => {
    const config = userConfig.getUserById(userId);
    const transformUserData = (data) => {
      if (data.data.address === null) {
        data.data.address = defaultAddress
      }
      setUserDetails(data.data);
    };
    sendRequest(config, transformUserData);
    return () => {
      setClear({});
    }
  }, [sendRequest, userId]);

  //CANCEL BUTTON
  const cancelFunction = async (e) => {
    history.push(`/user`)
  }

  // const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  //EDIT BUTTON 
  const editFunction = async (e) => {
    e.preventDefault();
    setErrors({});
    const schema = yup.object().shape(
      {
        first_name: yup
          .string()
          .typeError("Please enter first name")
          .max(30, "First name must be maximum of 30 characters")
          .matches(/^[aA-zZ\s]+$/, "Symbol and Number are not allowed ")
          .required("First name is required"),
        last_name: yup
          .string()
          .typeError("please enter your last name")
          .max(30, "Last name must be maximum of 30 characters")
          .matches(/^[aA-zZ\s]+$/, "Symbol and Number are not allowed ")
          .required("Please enter last name"),
        user_phone: yup
          .string()
          .nullable()
          .max(20, "Phone number must be maximum of 20 characters")
          .transform((curr, orig) => orig === '' ? null : curr),
        player_code: yup
          .string()
          .nullable()
          .max(5, "Player Code must be maximum of 5 characters")
          .transform((curr, orig) => orig === '' ? null : curr),
        user_age_group: yup
          .string()
          .max(5, "Age group must be maximum of 5 characters")
          .nullable()
          .transform((curr, orig) => orig === '' ? null : curr),
        user_website: yup
          .string()
          .nullable()
          .matches(/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/, 'Please enter valid URL')
          .transform((curr, orig) => orig === '' ? null : curr),
        address: yup.object().shape(
          {
            city: yup
              .string()
              .max(40, "City must be maximum of 40 characters")
              .matches(/^[aA-zZ\s]+$/, "Please enter city name")
              .nullable()
              .transform((curr, orig) => orig === '' ? null : curr),
            pincode: yup
              .number()
              .typeError("Symbols and Character are not allowed")
              .nullable()
              .transform((curr, orig) => orig === '' ? null : curr),
          }
        )
      });

    await schema
      .validate(userDetails, { abortEarly: false })
      .then(() => {
        let userDetailsTmp = userDetails;
        if (countryData) {
          userDetailsTmp.address.country = JSON.parse(countryData).country_code;
        }
        const addConfig = userConfig.putUserData(userDetailsTmp);
        const transformData = (data) => {
          setUserDetails(data);
          history.push(`/user`)
        };
        userEdit(addConfig, transformData);
        setSnackError("success");
        setSnackMsg("User Updated Successfully");
        setOpen(true);
        return () => {
          setClear({});
        }

      })
      .catch((e) => {
        let errorObj = {};
        e.inner.map((error) => {
          if (error.path === "address.city" || error.path === "address.pincode") {
            let errorCityMsg = "city";
            let errorPincodeMsg = "pincode";
            error.path = error.path === "address.city" ? errorCityMsg : errorPincodeMsg
            errorObj[error.path] = error.message;
          } else if (error.path === "address") {
            errorObj[error.path] = error.message;
          }
          errorObj[error.path] = error.message;
          if (error) {
            setSnackError("warning");
            setSnackMsg(` ${error.message}`)
            setOpen(true);
          }
          return null
        });
        setErrors({
          ...errorObj,
        });
      });
  }

  //HANDLER
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }


  return (
    <>
      <PageContainer heading="Edit User">

        <AppBar className={classes.userTab} position="static">
          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="User Information" {...a11yProps(0)} />
            <Tab label="Address" {...a11yProps(1)} key={1} />
            <Tab label="Images" {...a11yProps(2)} key={2} />
            <Tab label="Social" {...a11yProps(2)} key={3} />
            <Tab label="User Statistics" {...a11yProps(2)} key={4} />
            <Tab label="Sport Interest" {...a11yProps(2)} key={5} />
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0}>
          <UserInformation setUserDetails={setUserDetails} userDetails={userDetails} errors={errors} />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Address setUserDetails={setUserDetails} userDetails={userDetails} errors={errors} country={country} countryData={countryData} />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <Image setUserDetails={setUserDetails} userDetails={userDetails} component="User" />
        </TabPanel>

        <TabPanel value={value} index={3}>
          <Social setUserDetails={setUserDetails} userDetails={userDetails} />
        </TabPanel>

        <TabPanel value={value} index={4}>
          <UserStatistics userId={userId} userDetails={userDetails} />
        </TabPanel>

        <TabPanel value={value} index={5}>
          <SportsInterested setUserDetails={setUserDetails} userDetails={userDetails} />
        </TabPanel>

        {value !== 4 &&
          <div className={classes.buttonfield} >
            <Button className={classes.btn} variant="contained" color="primary" type="submit" startIcon={<SaveIcon />} onClick={(e) => editFunction(e)}> Update </Button>
            <Button className={classes.btn} type="submit" startIcon={<CancelIcon />} onClick={(e) => cancelFunction(e)}> Cancel </Button>
          </div>
        }

        <Snackbar open={open}
          autoHideDuration={3000} onClose={() => setOpen(false)}>
          <MuiAlert elevation={6} onClose={() => setOpen(false)} variant='filled' severity={snackError}>
            {snackMsg}
          </MuiAlert>
        </Snackbar>
      </PageContainer>
    </>
  )
};

export default UserEdit;

