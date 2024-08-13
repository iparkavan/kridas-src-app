import { useState, useEffect } from "react";
import { useParams } from "react-router";
import useHttp from "../../../hooks/useHttp";
import companyConfig from "../config/CompanyConfig";
import { Box } from "@material-ui/core";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/styles";
import Button from "../../common/ui/components/Button";
import CountryConfig from "../../master/country/config/CountryConfig";
import * as yup from "yup";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Social from "../../user/components/Social";
import CompanyInfomation from "./CompanyInformation";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Image from "../../user/components/Image";
import Address from "../../user/components/Address";
import PageContainer from "../../common/layout/components/PageContainer";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons//Cancel";
import CompanyPageVerfication from "./CompanyPageVerfication";
import CompanyBank from "../components/CompanyBank";
import BottomRightRectangleImage from "../../../../src/assets/bottom-right-rectangle.png";
import style from "./CompanyPageBorder.module.css";

const useStyles = makeStyles((theme) => ({
  btn: {
    padding: "2--px",
    margin: "10px",
  },

  buttonfield: {
    marginTop: "15px",
    marginLeft: "25px",
  },

  userTab: {
    width: "100%",
  },
}));

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

const CompanyEdit = (props) => {
  const history = useHistory();
  const [value, setValue] = useState(0);
  const classes = useStyles();
  const [country, setCountry] = useState([]);
  const { companyId } = useParams();
  const [editId] = useState(companyId);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [snackError, setSnackError] = useState("success");
  const [snackMsg, setSnackMsg] = useState("Company Updated Successfully");
  const [companyDetails, setCompanyDetails] = useState({});
  const { sendRequest } = useHttp();
  const [, setClear] = useState({});
  const { countryData } = companyDetails;
  const { sendRequest: fetchallcountry } = useHttp();
  let defaultAddress = {
    city: "",
    line1: "",
    line2: "",
    state: "",
    country: "",
    pincode: "",
  };

  useEffect(() => {
    const config = companyConfig.getCompanyById(companyId);
    const transformDate = (data) => {
      if (data.data.address === null) {
        data.data.address = defaultAddress;
      }
      setCompanyDetails(data.data);
    };
    sendRequest(config, transformDate);
    return () => {
      setClear({});
    };
  }, [sendRequest, companyId]);

  useEffect(() => {
    const countries = CountryConfig.getAllCountry();
    const transformData = (data) => {
      setCountry(data);
    };
    fetchallcountry(countries, transformData);
    return () => {
      setClear({});
    };
  }, [fetchallcountry]);

  const Cancelbtn = async (e) => {
    history.push(`/pages`);
  };
  const validateCompanyName = async (company_name) => {
    let flag = false;
    const config = await companyConfig.getCompanyName(company_name);
    const transformDate = (data) => {
      if (data.company_id !== editId && data.company_id !== undefined) {
        flag = true;
      } else {
        flag = false;
      }
    };
    await sendRequest(config, transformDate);
    return flag;
  };

  const editCompany = async (e) => {
    e.preventDefault();
    setErrors({});

    const scheme = yup.object().shape({
      company_name: yup
        .string()
        .typeError("Please enter company page name")
        .max(255, "Page Name must be maximum of 255 characters")
        .test(
          "company_name",
          "Page name is already present ",
          async function (company_name) {
            try {
              let checkname = await validateCompanyName(company_name);
              if (checkname) {
                return this.createError({
                  message: "page name is already present",
                });
              }
              return true;
            } catch (e) {
              return false;
            }
          }
        )
        .required("Please enter Page name"),
      company_email: yup.string().email("Email is not valid").nullable(),

      company_contact_no: yup
        .string()
        .nullable()
        .max(20, "Phone number must be maximum of 20 characters")
        .transform((curr, orig) => (orig === "" ? null : curr)),

      company_website: yup
        .string()
        .nullable(true)
        .matches(
          /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,

          " Please enter Valid URL"
        )
        .transform((curr, orig) => (orig === "" ? null : curr)),
      address: yup.object().shape({
        city: yup
          .string()
          .max(40, "City must be maximum of 40 characters")
          .matches(/^[aA-zZ\s]+$/, "Symbols and number are not allowed ")
          .nullable()
          .transform((curr, orig) => (orig === "" ? null : curr)),

        pincode: yup
          .number()
          .typeError("Symbols and Character are not allowed")
          .nullable()
          .transform((curr, orig) => (orig === "" ? null : curr)),
      }),
    });

    await scheme
      .validate(companyDetails, { abortEarly: false })
      .then(() => {
        if (countryData) {
          let companyDetailsTmp = companyDetails;
          companyDetailsTmp.address.country =
            JSON.parse(countryData).country_code;
          const editConfig = companyConfig.editCompanyData(companyDetailsTmp);
          const transformData = (data) => {
            setCompanyDetails(data);
            history.push(`/pages`);
          };
          sendRequest(editConfig, transformData);
          setSnackError("success");
          setSnackMsg("Company Updated Successfully");
          setOpen(true);
        } else {
          let companyDetailsTmp = companyDetails;
          const editConfig = companyConfig.editCompanyData(companyDetailsTmp);
          const transformData = (data) => {
            setCompanyDetails(data);
            history.push(`/pages`);
          };
          sendRequest(editConfig, transformData);
          setSnackError("success");
          setSnackMsg("Company Updated Successfully");
          setOpen(true);
        }
      })
      .catch((e) => {
        let errorObj = {};
        e.inner.map((error) => {
          if (
            error.path === "address.city" ||
            error.path === "address.pincode"
          ) {
            let errorCityMsg = "city";
            let errorPincodeMsg = "pincode";
            error.path =
              error.path === "address.city" ? errorCityMsg : errorPincodeMsg;
            errorObj[error.path] = error.message;
          }
          errorObj[error.path] = error.message;
          if (error) {
            setSnackError("warning");
            setSnackMsg(`${error.message}`);
            setOpen(true);
          }
          return null;
        });
        setErrors({
          ...errorObj,
        });
      });
  };

  const handleChangeTab = (event, newValue) => {
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
      <PageContainer heading="Edit Company">
        <img
          className={style.stripe_1}
          src={BottomRightRectangleImage}
          alt="#borderImage"
        />
        <AppBar className={classes.userTab} position="static">
          <Tabs
            value={value}
            onChange={handleChangeTab}
            aria-label="simple tabs example"
          >
            <Tab label="Company Information" {...a11yProps(0)} />
            <Tab label="Page Verification" {...a11yProps(2)} key={1} />
            <Tab label="Bank Details" {...a11yProps(2)} key={2} />
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0}>
          <CompanyInfomation
            companyDetails={companyDetails}
            setCompanyDetails={setCompanyDetails}
            errors={errors}
          />
          <Address
            setUserDetails={setCompanyDetails}
            userDetails={companyDetails}
            errors={errors}
            country={country}
            countryData={countryData}
          />
          <Image
            setUserDetails={setCompanyDetails}
            userDetails={companyDetails}
            component="Company"
            errors={errors}
          />
          <Social
            userDetails={companyDetails}
            setUserDetails={setCompanyDetails}
          />

          <div className={classes.buttonfield}>
            <Button
              className={classes.btn}
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={(e) => editCompany(e)}
            >
              Update
            </Button>
            <Button
              className={classes.btn}
              type="submit"
              startIcon={<CancelIcon />}
              onClick={() => Cancelbtn()}
            >
              {" "}
              Cancel{" "}
            </Button>
          </div>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <CompanyPageVerfication companyId={companyId} />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <CompanyBank companyId={companyId} />
        </TabPanel>

        <div className={classes.imgbtn}></div>

        <form className={classes.root}>
          <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
          >
            <MuiAlert
              elevation={6}
              onClose={() => setOpen(false)}
              variant="filled"
              severity={snackError}
            >
              {snackMsg}
            </MuiAlert>
          </Snackbar>
        </form>
      </PageContainer>
    </>
  );
};
export default CompanyEdit;
