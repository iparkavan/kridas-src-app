/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React from "react";
import clsx from "clsx";
import { ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import axios from "axios";
import LeftsideMenu from "./LeftsideMenu";
import "react-toastify/dist/ReactToastify.css";
import { ToastError, ToastSuccess } from "../service/toast/Toast";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import { createStyles, Theme } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import CloudUpload from "@material-ui/icons/CloudUpload";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import logodb from "../img/Beats-health-logo.png";
import PropTypes from "prop-types";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Widget from "./doublebox";
import ImageUploader from "react-images-upload";
import Select from 'react-select';

import MaterialTable from "material-table";
import { useState } from "react";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeUpdate from './StripeUpdate';
import StateManager from "react-select";

import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MUIselect from "@material-ui/core/Select";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from "@material-ui/core/MenuItem";
import TextField from '@mui/material/TextField';
import StaffDetailsGride from '../components/Util/StaffDetailsGride';
import Addstaffpopup from "./addstaffpopup";
import Mapping from "./Mapping";
import AdminConfiguration from "./AdminConfiguration";
import MyDetailsComponent from "./MyDetailsComponent";
const tableIcons = {
  Add: forwardRef((props, ref) => <>
    {/*<AddBox  {...props} ref={ref} style={{ color: "red" }} />*/}
    <Button
      variant="contained"
      className="btn-primary addstaff"
      style={{ margin: 0, padding: 0 }}
    >
      <h style={{ fontSize: "14px", color: "white" }}>Add Staff</h>
    </Button>
  </>),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};


const drawerWidth = 240;
const stripePromise = loadStripe('pk_test_51Ij5ayC2V2ajAK3d3juQBP9WJa8iBbj28QCpVyvCFfK2GNYNVWZY3ykXnBtW63PZcr1MTfQApRXgArNU3jSpI6ac004zNPrvoA');

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    textAlign: 'left',
    borderBottom: '1px dotted pink',
    padding: 20,
  }),
}



const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
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
  customWidth: { fontSize: "1px" },
  formControl: {
    margin: theme.spacing(1),
    width: '100%',
    /**minWidth:120 */
    minWidth: 120,
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
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "label + &": {
        marginTop: theme.spacing(3),
      },
    },
    input: {},

    paper: {
      padding: theme.spacing(0),
      color: theme.palette.text.secondary,
    },
  })
)(InputBase);

export default function MyDetails() {
  const classes = useStyles();
  const { id } = useParams();
  const [open] = React.useState(false);

  const [value, setValue] = React.useState(0);
  const [providerName, setProviderName] = React.useState("");
  const [add1, setAdd1] = React.useState("");
  const [add2, setAdd2] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [zip, setZip] = React.useState("");
  const [currentPass, setCurrentPass] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPass, setConfirmPass] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const [typeOfPractice, setTypeofPractice] = React.useState("");
  const [typeOfService, setTypeofService] = React.useState("");
  const [pictures, setProfilePicture] = React.useState({ image: "", url: "" });
  const [addressLine1, setAddressLine1] = React.useState("");
  const [addressLine2, setAddressLine2] = React.useState("");
  const [cityName, setCityName] = React.useState("");
  const [stateName, setStateName] = React.useState("");
  const [countryName, setCountryName] = React.useState("");
  const [zipCode, setZipCode] = React.useState("");
  const [taxonomyDesc, setTaxonomyDesc] = React.useState("");
  const [taxonomyCode, setTaxonomyCode] = React.useState("");
  const [taxonomyGroup, setTaxonomyGroup] = React.useState("");
  const [taxonomyState, setTaxonomyState] = React.useState("");
  const [taxonomyLicense, setTaxonomyLicense] = React.useState("");
  const [contactNumber, setContactNumber] = React.useState("");
  const uploadInputRef = React.useRef(null);
  const [isDateChecked, setisDateChecked] = React.useState(false);
  const [isOnDateServiceChecked, setOnDateServiceChecked] =
    React.useState(false);
  const [noOfDays, setNumbOfDays] = React.useState(0);
  const [npiDetails, setNpiDetails] = React.useState("");
  const [subscriberDetails, setSubscriberDetails] = React.useState({});

  const [nameError, setNameError] = React.useState({
    error: false,
    label: "",
    helperText: "",
    validateInput: false,
  });

  //for specialty ui drop down
  const [specialtiesListV, setSpecialtiesListV] = React.useState([]);

  let localStoragetest = {
    "idToken": "eyJraWQiOiJvYzVVeVwvdkxKRnJHVlFUY3Y3TkhXTFBcL0hoSXBVWFJMU2FJdklaVWZxXC9BPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI2MjMzNzEwZC0yMzVhLTRkYmEtYjNlOC0yN2YwZTA1YWRkNzYiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfSzdHbWxUN3F0IiwiY29nbml0bzp1c2VybmFtZSI6IjYyMzM3MTBkLTIzNWEtNGRiYS1iM2U4LTI3ZjBlMDVhZGQ3NiIsImN1c3RvbTpUeXBlT2ZTZXJ2aWNlIjoiMTgyIiwib3JpZ2luX2p0aSI6ImVhMmQ0NTYwLWRhYmMtNDQ1ZS05ODkzLTM3Y2JhZjkyN2QyYyIsImN1c3RvbTpUeXBlT2ZQcmFjdGljZSI6IkgiLCJhdWQiOiI0cWo4ODJuMnZnYWFqcWF1NWNvNGxsaDlzNSIsImN1c3RvbTpOUEkiOiIxMTk0MjMxNTYzIiwiZXZlbnRfaWQiOiJiMzJhOGM1Ni0xYzVjLTRjODUtYTE4MC1kYWJhZTdlYmRmYzQiLCJjdXN0b206T3JnYW5pemF0aW9uIjoiVE9UQUwgT1JUSE9QRURJQyBQRVJGT1JNQU5DRSBQSFlTSUNBTCBUSEVSQVBZLCBMTEMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY0NzI1NjI5NywiZXhwIjoxNjQ3MjU5ODk3LCJpYXQiOjE2NDcyNTYyOTcsImp0aSI6IjlmMjE5YTEwLTBlMWItNGM1YS04MjI1LTU2Yjc1ZDY0ZjExZiIsImVtYWlsIjoic3VyZXNoQHRoZWJlYXRzaGVhbHRoLmNvbSJ9.P6i8_bVBCUTkKSc1TWMkzOyjrMPlhoMFPF4dL96SRK_cYeAiYS375fGxu1OnnbDUF_6vbnwmI4SzaLh7GuH2IneXLB8VD7M4ASDbZhfubecxBW7koI0AF_0G9EVIwJ6kOoyeLF3Un9hLQFznYMSCu5WJN5K2BEd9EdtDu-2j1ub87RWNGNTujZHI5_7_or8GPy1xKsm4BVlSBKzCCoQtwHUnK4tKMeOu_g3Q_-nDeoAMauK4WN1O9t2uI2j3koAA7ABUc33zevR_TvC3t0yjAF35oMteJaV4o_7_St_iGGwZRQ3dQ0cMWteOPKbZtzybBpWwFmgSJtd3IptlMsXFDQ",
    "accessToken": "eyJraWQiOiJneVwvc2h2RXB4cE8wbHNkT0s0dm5jUFRXQmpEdzlSekhIR2pnYVdyMkNxbz0iLCJhbGciOiJSUzI1NiJ9.eyJvcmlnaW5fanRpIjoiZWEyZDQ1NjAtZGFiYy00NDVlLTk4OTMtMzdjYmFmOTI3ZDJjIiwic3ViIjoiNjIzMzcxMGQtMjM1YS00ZGJhLWIzZTgtMjdmMGUwNWFkZDc2IiwiZXZlbnRfaWQiOiJiMzJhOGM1Ni0xYzVjLTRjODUtYTE4MC1kYWJhZTdlYmRmYzQiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNjQ3MjU2Mjk3LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9LN0dtbFQ3cXQiLCJleHAiOjE2NDcyNTk4OTcsImlhdCI6MTY0NzI1NjI5NywianRpIjoiZGE5ZTc5ZjgtMWJiNy00ZjQwLTk0ZjctMjBmNDNhYTVjNjEwIiwiY2xpZW50X2lkIjoiNHFqODgybjJ2Z2FhanFhdTVjbzRsbGg5czUiLCJ1c2VybmFtZSI6IjYyMzM3MTBkLTIzNWEtNGRiYS1iM2U4LTI3ZjBlMDVhZGQ3NiJ9.AUq-FMGqoj7Rb80AonCMr-akVzzXMVfDBJTpfHwo76oLjv3zXtZyl5hR5pM7dN_oVUbdATVdFRZSSUeFQZoJc0raKFQOv6624aZWpn3-_6f2WW15JuP5QTvUjgcIvmGRfpLh8GbFYTuvl_RX8llA7cHVdP82o7nAXJsiqY6az11_XCq5eQv-y5IB08fsu8evq_mr6tduJH4E6XyH8Rubk2RdSquYMOsVorXQUwwDjJzDoyvF0n7Rg7b-4VRmOE_G1MYjEY8zKbr37t6EVtzDLUFafraIiAsRMT_jAtr0nANVi96uE64Qi6sww_J4AgJletg0UiyMVVbz039tPPzfiA",
    "refreshToken": "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.DN3ykycAWGsJ0Pyh18Stk8xIPrmYU5fV9acr77UhcybM_4VrjUoJj3v_oqz6g_0zZGeiZ__v-J9vsFGOJ6dgje8Om5F-FqSJSg4mFY5FHS0ikEWyBE-bqMC--IK7x3J4B5FHM3ylqEFrT2yfFE0DHkxmlqMMR1FuRLw-PKFjLzcLCsbgS39ycaZ8WJe-qo_Mgzt-6n-iPhCX0M4kw3NlhSQ72WdHCZRlm4qNU4qEkbAAO31cKQzIM6O97wFQ8sY09J6xTpFn-iK8kKldoLKjg9TPRGS_2smEkXb71lAAO2zJJGY5AOmPAJnjs7qaU6jsKoHsLXGXzYTnfq6Nv2LV1Q.guxf_Yx7CYQMRT0X.WQ8u7tdWpWxFfC1es09wO-Yh0R_G8I_zlnUd1uUPuJLtFm8Z1-IyIsn0gZ-33HBmQO4OtJUyigHmwFbjDCLOyId8VYvLr2UdzyXiKp6OWR_vqxWfmWzCR4M0CZAYrJbszDihXkPMoxFnK49kXPRvHWe7xZ5BpiigHwH20621Xczr8_kYy29tfwwpBk9JgA4FvtxjtMFnnaN_X69SCljqEhiML9iGp0pvs5Detxp-fJay9RZqhYs-EZjXXPQGwOQq3eVrsWdL7iArxU7jqn2QsZxzxxTnD6hY7xxXtiGXrzY18AjL74NC9SW-MO036FHbXz924XxdFihS6vdLiJLbfrGncxD06IH0CyDxI_GcDnk6oLSC-N4pvc77BIpnSA6KIavfXW-ohzl2q_UJAMcYMQV8DSUm4J0hoNvkvW5svei8e5uPTb6FGpWfNR2MiOUsMcg0Xlld2Ug6IOCDKGc9G7YyvW9l7C-VoATWgnQyav_RjIBCDdl4PqT8Zf7DDOAXxhanJxE8r_hPh15w1qA1lB-GCLupnydreSiJEoByKXPgD7QnrScn5p3mp4eesGXIimUFcrSgHc8mOTr_WoToJnophcXpsUl1UOrUueLt0e_eQeyH5J-o7XjBBVEmfTXQ17Ek5vWJpqJuJ4zqIf-QOLM9nW_vOqMLE-yw_oo5_UytmLQfp6qbdZ-3jI4wElHdPzAJI6oMBtFrh7db_Sfu2iA0TCrVw8uqpVcOYyLDwEq4WACw2EPhPvQP87j5vhWTUZ03R4KXCmYv4xaQb-YFXLPq5RRDgVvXVFh-H3dupYY3sqH-vbdLAkB6VeY1cmGEHMWqqRkTB-nle2E3rDNGMHTRpc1ziGqs3fbeQ77HTCu68Qm29eIpTxfY0aVPe5Cdd6b0xOitQfmRyIwhAyyvLGG8h1mySFQT8wN-QCkfZQI_mRK4uN4kuBdYOuoifK8T4L3wLSnIlxWpQ-9c_ez_Fi39FaJiu3jLGcl-4CkdRssfXbB9YphLDFOzw9VvQ0Tm4CqCtAULIXhrqM7GIlr-SjwgFbANqvuRd8WawMXX8dtb8b3EjGNBF9bRKOcETkSzYq1UnTt19MfrC_1KdawxpjOGx9BMkNMJF4D_ebA9mB3V0MLJHSKYr4c420HLL6WJkcmcusFUDwMys098BNF_A75JOKpMy3vXTku2vut9kayWqU_asK6UrGWmfuVtqn1gePURjmRFhCNaW3aW6WHgcJzus9fQ4NlHhsPFtTBfMdoeLsbx5aXxvqhGz_nFS080gBlrk4pwXHIMUs_X0ArDwTDt66SJRM_PCjqCET_LtDzpqBYbgil1L8ghDQ.jjpaixx0mLfb24NDfMPb4A",
    "attributes": "[{\"name\":\"sub\",\"value\":\"6233710d-235a-4dba-b3e8-27f0e05add76\"},{\"name\":\"custom:TypeOfPractice\",\"value\":\"H\"},{\"name\":\"custom:NPI\",\"value\":\"1194231563\"},{\"name\":\"email_verified\",\"value\":\"true\"},{\"name\":\"custom:Organization\",\"value\":\"TOTAL ORTHOPEDIC PERFORMANCE PHYSICAL THERAPY, LLC\"},{\"name\":\"custom:TypeOfService\",\"value\":\"182\"},{\"name\":\"email\",\"value\":\"suresh@thebeatshealth.com\"},{\"name\":\"url\",\"value\":null}]"
}

let sessionStorageTest = {
  "idToken": "eyJraWQiOiJvYzVVeVwvdkxKRnJHVlFUY3Y3TkhXTFBcL0hoSXBVWFJMU2FJdklaVWZxXC9BPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI2MjMzNzEwZC0yMzVhLTRkYmEtYjNlOC0yN2YwZTA1YWRkNzYiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfSzdHbWxUN3F0IiwiY29nbml0bzp1c2VybmFtZSI6IjYyMzM3MTBkLTIzNWEtNGRiYS1iM2U4LTI3ZjBlMDVhZGQ3NiIsImN1c3RvbTpUeXBlT2ZTZXJ2aWNlIjoiMTgyIiwib3JpZ2luX2p0aSI6IjRhZTZhMTIwLWVhNDktNDI1Mi1iYWNjLWQ2YTUwNzE3MWU3MyIsImN1c3RvbTpUeXBlT2ZQcmFjdGljZSI6IkgiLCJhdWQiOiI0cWo4ODJuMnZnYWFqcWF1NWNvNGxsaDlzNSIsImN1c3RvbTpOUEkiOiIxMTk0MjMxNTYzIiwiZXZlbnRfaWQiOiI1NmM4MjdlOS1lOGY2LTQ5ZjgtOWUwNS01NjA0OWViNWY5YmIiLCJjdXN0b206T3JnYW5pemF0aW9uIjoiVE9UQUwgT1JUSE9QRURJQyBQRVJGT1JNQU5DRSBQSFlTSUNBTCBUSEVSQVBZLCBMTEMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY0NzI2MTc3MSwiZXhwIjoxNjQ3MjY1MzcxLCJpYXQiOjE2NDcyNjE3NzEsImp0aSI6ImQ5NTYwOTIyLTlmMzYtNGUxMS05Yzc2LWExMzM3OTlhNmQ4NSIsImVtYWlsIjoic3VyZXNoQHRoZWJlYXRzaGVhbHRoLmNvbSJ9.kYzddNuDbXMbJJwT4o5ULlF5bE61RPq6x9IYLsp4vzGmx2DYTkXWYYPYc8Vi6ranF5jMZATIThh5OAc1KA1R80ylzuWhGBXFdAYn4X1XoqBHrVczp-ywsgrve4PRZhoFpkYykgj-oCIahb_SxHIk1OPQxUTmyJmAziTKZoMR7HOKDoXaoSl07T1kkBi55V2uPUwaSCDGypdXFgAmRUUsaWP93S0oVMzokqxoJVe0a0DNuqfLVRuIcQg26-0JcmwhS6XZzLI2yti6IoAMjI0WmAxyKEJbRGYFf9Xp3OttONp1PwqcLoAoPSTDTZrUJ9pGTyMMytNGXRVFkEEpUGsS7w",
  "accessToken": "eyJraWQiOiJneVwvc2h2RXB4cE8wbHNkT0s0dm5jUFRXQmpEdzlSekhIR2pnYVdyMkNxbz0iLCJhbGciOiJSUzI1NiJ9.eyJvcmlnaW5fanRpIjoiNGFlNmExMjAtZWE0OS00MjUyLWJhY2MtZDZhNTA3MTcxZTczIiwic3ViIjoiNjIzMzcxMGQtMjM1YS00ZGJhLWIzZTgtMjdmMGUwNWFkZDc2IiwiZXZlbnRfaWQiOiI1NmM4MjdlOS1lOGY2LTQ5ZjgtOWUwNS01NjA0OWViNWY5YmIiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNjQ3MjYxNzcxLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9LN0dtbFQ3cXQiLCJleHAiOjE2NDcyNjUzNzEsImlhdCI6MTY0NzI2MTc3MSwianRpIjoiZGZkMDkxZDgtYjdkMS00NmIzLWE5MDEtMzMwODNhZjg4M2ZkIiwiY2xpZW50X2lkIjoiNHFqODgybjJ2Z2FhanFhdTVjbzRsbGg5czUiLCJ1c2VybmFtZSI6IjYyMzM3MTBkLTIzNWEtNGRiYS1iM2U4LTI3ZjBlMDVhZGQ3NiJ9.QTdsQ0CCogmVTMDTWgG3hAsBqjde2A7mrG-5ymk0Q88Hgxz0R1rNDXEN_hFmWTuQeRKSLu_Jbqn0HT1uH1nkytH7DXSOx8LZaxMoiWxpqXzZuI2VjKxjHQez38MUXxWYfrkabxteBGLG7QNgdkvETFWQxIfJonRP-TXtMoHVbHS2aSg5CANqo5CN-pRLL3Wq2EdjlhR9gqAWrjSDwkZIWHYWBUU58UDH_plxVELHTpEimAyqf4T03Ng4GwdTbvf027nazWbaW-0UvKiYEr4jJAhN45KIAG6FT1_nVQvJOWQRjwV05CFemjIRU41-l2jIfzeAQUqcQitxsB75qX-0pg",
  "refreshToken": "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.myWuZ-Uc8fScSOR4gZjXlwDhdmNrlcqGR7MbeeLqSSTuGdV45csci1U3AfwhtXfWYCcZBBeqI_Hb6GZNLNirSAp3sMSH61w-KtqwipfJ5VZ8DZ3JSqIOUaAp-KP--WGS62lbGWI55JyDnB90LpnD7_xVBFVh2ZCWbDWuXnBjCq0Un2-vUn-1lixCIbGglm-I1b15c_-oPIi4lt3vF6B2L5OcGPBWDj0FD0YWWJmmTqyj4rBkchP0xFSaGLrK4ScBnHIRE4EIIOFcsL0QAhzWX0cGIuvMqLDP02QXgRiz5Opauc7NB67Jcm4eVV0VY6C6OrUpMYj11nnGzcNDsS8BIg.SmfJhS7WTyBLHobA.yVf6qeuwp4FKrrxne91HfykcfGzgTaEfjoVAVJl_spjcOWE_D0lNH_AevMKPlO0_gJTrElJUIMXSWzykyKOWnOgqB4GspXgDPT5i3mA5dpgi2TdN4sYzLcNQjJ-ZpNh6KdFjZlM2mecVNt1yhakqYWKcGH0Zw7O_4izTKAx0V8YpxCoZSfinCTWzBxPsRlA0WJALE2VshWtfI-oNuW0bZ5CewqLD_9Rh7TrZwoMRTebvindbgpPpQ3tOp2_V6tWssSXqs1jw-SbJeJ3ocOGPnBx9RHX8CgKKnzJ7pUz_JBBv-igJm__2yJybHsrQvB0_3bmY7kcNbwQU6XOh_Pp7aBe9RkEmnEX4MSxPNjRCe5bmb4Tv1cKCGwbUYOYVjCgLHowLqQZ0-ANbDmyWMNyMJ4V12clUq3ULfrA-CTBVuihG7ZRiXv5URIWnFDuafXzMFgaupH4JUvxjQjwpKcOIU8ughWZgFAtmyAJrMrxHMzwvyvH4O3awF0qbkkzXkDVUuJL9tL_FRzrNMaE7gVMSHT98_eVpy4NWl4zz49C5IU7tEkrqn_9MAQlwLG8FZZ9bGhe_VzbcqozJoERmVjjzrKzx6PFxNOnNsKAth8k6gEXE24CiMiL7iUlTK4mFwJFewYNaCkKsIlfN-NFGgQgO1buFcPjiZKGvVN13eZnztjoXbe3O9u8swc1_avyleTwT6svv6Dd-h2AbYddeY0j5_ptP2yy89deRuw-Xf1zz1o9Sw0_dgWE92DfZcS27mTyQeEArY5gUvkLtgCmpP-F9Jbzl9oS0cWmA7AUCTc4iibMMEBC_XcdCj1_vkvvmUfX6FDqlBc7C3B6x4pmKHqTADQ5GVRtoCmchhCKX_8jaGQRyB16GJEk4H8islLon8RN1jRejWL90xcFwUtm6hSLTb60mNLHRcXE5Siky29-K4JlX8_1O3N33TDPgKcdLwcUnVodZurZgbSlBTiQ9-OGt3Oi8CLvAazQU4HDz9IDc3Wt_Tb3-3bNf1CwRC1WamrUllhHZRJKRwG45cblOWrlTbUtOMIkf8hNuy8yOUSoR7mW3eUi_lPFZW5luzwOniOh9O-5euWEBff7VJH7OuDy5HPzrnQSo9_-uLCcGlJV-WNJadRRwtL9pfjhN32I6udLHHjIh2q4ne0uEsFlgStLjibmcFrFccbTKcSLSYoJWzU7WB5uZXnYJVfBrcGVryTk7xQCTNpZJNGoEiJ9GhcIWitkgjlTM-0Mf0-AT1ebDW24-mdYTAyKGJ2WuEUX4NERrbQHLA9v3xG9ORUTqtX4UGBb-qvGl0N1oiAwPGdcd779kg6nSlNUIAk-wjg.wtYgx-iytdkqQ-3xIrYvug",
  "attributes": "[{\"name\":\"sub\",\"value\":\"6233710d-235a-4dba-b3e8-27f0e05add76\"},{\"name\":\"custom:TypeOfPractice\",\"value\":\"H\"},{\"name\":\"custom:NPI\",\"value\":\"1194231563\"},{\"name\":\"email_verified\",\"value\":\"true\"},{\"name\":\"custom:Organization\",\"value\":\"TOTAL ORTHOPEDIC PERFORMANCE PHYSICAL THERAPY, LLC\"},{\"name\":\"custom:TypeOfService\",\"value\":\"182\"},{\"name\":\"email\",\"value\":\"suresh@thebeatshealth.com\"}]"
}

  React.useEffect(() => {
    fetchServiceType();
    fetchProfilePicture();
    fetchSpecialtiesList();
    let urlParam = window.location.search
    if(urlParam === '?mapping'){
      setValue(1)
    }
    fetchSubscriberDetails()
  }, []);

  const fetchSubscriberDetails =async()=> {
    if(sessionStorage.role == 'Admin'){
      let url = process.env.REACT_APP_BEATS_FETCH_SUBSCRIBER_DETAILS
      let fetchConfig = {
        method: "get",
        url: process.env.REACT_APP_BEATS_FETCH_SUBSCRIBER_DETAILS,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.idToken,
        }
      };

      try {
        let fetchSubscriberDetailsRes = await axios(fetchConfig);
        setSubscriberDetails(fetchSubscriberDetailsRes.data);
        console.log('fetchSubscriberDetailsRes>>>>>>>>>>>', fetchSubscriberDetailsRes)
      } catch (e) {
        console.log("failed to fetch Provider Image");
      }
    }
  }

  const updateSubscriberDetails =async()=> {

    let physycalAddressError = true
    Object.keys(subscriberDetails.physicalAddress).forEach(item => {
      if((item == 'address_line1' && subscriberDetails.physicalAddress[item].trim() == '')
      || (item == 'city' && subscriberDetails.physicalAddress[item].trim() == '')
      || (item == 'contact_number' && subscriberDetails.physicalAddress[item].trim() == '')
      || (item == 'state' && subscriberDetails.physicalAddress[item].trim() == '')
      || (item == 'zip_code' && subscriberDetails.physicalAddress[item].trim() == '')
      || (item == 'country' && subscriberDetails.physicalAddress[item].trim() == '')){
        physycalAddressError = false;
      }
    })

    let blngInvcAddressError = true
    Object.keys(subscriberDetails.blngInvcAddress).forEach(item => {
      if((item == 'address_line1' && subscriberDetails.blngInvcAddress[item].trim() == '')
      || (item == 'city' && subscriberDetails.blngInvcAddress[item].trim() == '')
      || (item == 'contact_number' && subscriberDetails.blngInvcAddress[item].trim() == '')
      || (item == 'state' && subscriberDetails.blngInvcAddress[item].trim() == '')
      || (item == 'zip_code' && subscriberDetails.blngInvcAddress[item].trim() == '')
      || (item == 'country' && subscriberDetails.blngInvcAddress[item].trim() == '')){
        blngInvcAddressError = false;
      }
    })

    const numberPattern = new RegExp(/^[0-9\b]+$/);

    if((subscriberDetails.blngInvcAddress.contact_number && (!numberPattern.test(subscriberDetails.blngInvcAddress.contact_number) || subscriberDetails.blngInvcAddress.contact_number.length != 10)) || (subscriberDetails.physicalAddress.contact_number && (!numberPattern.test(subscriberDetails.physicalAddress.contact_number)  || subscriberDetails.physicalAddress.contact_number.length != 10))){
        ToastError("Please enter a valid contact number");
        return;
    }

    if(!blngInvcAddressError || !physycalAddressError){
      ToastError('Please fill all the required field')
      return;
    }

    let saveConfig = {
      method: "post",
      url: process.env.REACT_APP_BEATS_UPDATE_SUBSCRIBER_DETAILS,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.idToken,
      },
      data: subscriberDetails,
    };

    try {
      setLoading(true);
      let updateSubscriberDetailsRes = await axios(saveConfig);
      setLoading(false);
      if(updateSubscriberDetailsRes.status == 200){
        ToastSuccess("Successfully Updated.");
      }
    } catch (e) {
      console.log("failed to fetch Provider Image");
      setLoading(true);
    }
  }

  const onChangeFormData =(keyName, keyValue, type)=> {
    if(type == 'blngInvcAddress'){
      let tempaddress = {...subscriberDetails.blngInvcAddress}
      tempaddress[keyName] = keyValue
      setSubscriberDetails({
        ...subscriberDetails,
        ...{'blngInvcAddress': tempaddress}
      })
    }else{
      let tempaddress = {...subscriberDetails.physicalAddress}
      tempaddress[keyName] = keyValue
      setSubscriberDetails({
        ...subscriberDetails,
        ...{'physicalAddress': tempaddress}
      })
    }
  }

  /****function to fetch Provider Profile Picture****/
  const fetchProfilePicture = async () => {
    let fileUrl = "";
    const attData = JSON.parse(localStoragetest.attributes);
    try {
      fileUrl = attData.find((x) => x.name === "url").value;
    } catch (error) {
      console.log("url missing in profile");
    }
    if (fileUrl === "" || fileUrl === undefined || fileUrl === null) {
      return false;
    }
    let profilePictureConfig = {
      method: "post",
      url: process.env.REACT_APP_BEATS_FETCH_PROFILE_PICTURE,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorageTest.idToken,
      },
      data: {
        key: fileUrl,
      },
    };

    let specialtiesConfig = {
      method: "get",
      url: process.env.REACT_APP_BEATS_GET_SPECIALTIES_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorageTest.idToken,
      }
    };

    try {
      let profileData = await axios(profilePictureConfig);
      if (profileData !== undefined) {
        setProfilePicture({ image: "", url: profileData.data });
      }
    } catch (e) {
      console.log("failed to fetch Provider Image");
    }
  };

  const fetchServiceType = async () => {
    let serviceConfig = {
      method: "get",
      url: process.env.REACT_APP_BEATS_LIST_SERVICE_TYPE_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorageTest.idToken,
      },
    };

    let providerConfig = {
      method: "post",
      url: process.env.REACT_APP_BEATS_FETCH_PROVIDER_DETAILS,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorageTest.idToken,
      },
    };

    const attData = JSON.parse(sessionStorageTest.attributes);

    setLoading(true);
    const typeofPracticeAttr = attData.find(
      (x) => x.name === "custom:TypeOfPractice"
    ).value;
    let typeofServiceAttr = "30";

    try {
      typeofServiceAttr = attData.find(
        (x) => x.name === "custom:TypeOfService"
      ).value;
    } catch (error) {
      console.log("Default service id missing in profile");
    }

    try {
      let service = await axios(serviceConfig);
      let serviceType = "";
      for (var j = 0; j < service.data.length; j++) {
        if (service.data[j].service_type_Id === parseInt(typeofServiceAttr)) {
          serviceType = service.data[j].service_name;
          break;
        }
      }
      setTypeofService(serviceType);
      setTypeofPractice(typeofPracticeAttr);

      let provider = await axios(providerConfig);
      console.log("Provider call data: ", provider);

      setAddressLine1(provider.data[0].address_line1);
      setAddressLine2(provider.data[0].address_line2);
      setCityName(provider.data[0].city);
      setStateName(provider.data[0].state);
      setCountryName(provider.data[0].country);
      setZipCode(provider.data[0].zip);
      setTaxonomyDesc(provider.data[0].primary_taxonomy_desc);
      setTaxonomyCode(provider.data[0].primary_taxonomy_code);
      setTaxonomyGroup(provider.data[0].primary_taxonomy_group);
      setTaxonomyLicense(provider.data[0].primary_taxonomy_license);
      setTaxonomyState(provider.data[0].primary_taxonomy_state);
      setContactNumber(provider.data[0].contact_number);

      setisDateChecked(provider.data[0].onDateService);
      setOnDateServiceChecked(provider.data[0].daysBeforeDateOfService);
      setNumbOfDays(provider.data[0].daysbefore);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    ////debugger;
  };

  const showLoadMask = (status) => {
    setLoading(status);
  };
  const updatePass = () => {
    let payload = {
      oldPassword: currentPass,
      newPassword: newPassword
    }

    if (!newPassword || !confirmPass || !currentPass) {
      ToastError("Please fill all three fields");
      return;
    }

    if (newPassword != confirmPass) {
      ToastError("New password and confirm password is not matching");
      return;
    }
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_UPDAT_PASSWORD,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.idToken,
        "is-update": "update",
      },
      data: payload,
    };
    showLoadMask(true);
    axios(config)
      .then(function (response) {
        ////debugger;
        showLoadMask(false);
        ToastSuccess("Successfully Updated.");
      })
      .catch(function (error) {
        ////debugger;
        showLoadMask(false);
        ToastError("Update Failed!");
        console.log(error);
      });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const updateNpiData = (data) => {
    setNpiDetails(data);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onDrop = (event) => {
    let obj = event.target.files[0];
    obj["image"] = obj;
    obj["url"] = URL.createObjectURL(obj);
    setProfilePicture(obj);
  };

  const openFileUploader = () => {
    uploadInputRef.current.click();
  };

  const uploadProfile = async () => {
    let pictureObj = pictures;
    const attributeData = JSON.parse(localStoragetest.attributes);
    let providerId = attributeData.find((x) => x.name === "sub").value;
    if (pictureObj["image"] === "") {
      ToastError("Please select image file to upload");
      return false;
    }
    var data = new FormData();
    let filename = pictureObj["image"].name;
    data.append("file", pictureObj["image"]);
    const result = await toBase64(pictureObj["image"]).catch((e) => Error(e));
    if (result instanceof Error) {
      console.log("Error: ", result.message);
      return;
    }

    let convertedFile = result.split(",")[1];
    data.append("file", convertedFile);
    let fileData = {
      fileData: convertedFile,
    };

    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_PROFILE_UPLOAD,
      headers: {
        "Content-Type": "application/json",
        providerid: providerId,
        filename: filename,
        "type-of-file": pictureObj["image"].type,
        Authorization: "Bearer " + sessionStorageTest.idToken
      },
      data: fileData,
    };

    setLoading(true);
    axios(config)
      .then(function (response) {
        ////debugger;
        setLoading(false);
        ToastSuccess("Profile picture is updated successfully");
        let filename = pictures["image"].name;
        setProfilePicture({ ...pictures, image: "" });
        let newArray = attributeData.filter((val) => val.name !== "url");
        let providerId = attributeData.find((val) => val.name === "sub").value;
        newArray.push({ name: "url", value: providerId + "/" + filename });
        localStoragetest.setItem("attributes", JSON.stringify(newArray));
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
        ToastError(error.response.data.error);
        setProfilePicture({ url: "", image: "" });
      });
  };

  const saveUserConfig = () => {
    const daysbeforeservice = isDateChecked ? 1 : 0;
    const dateservice = isOnDateServiceChecked ? 1 : 0;
    const noDays = daysbeforeservice ? noOfDays : 0;
    if (!daysbeforeservice) {
      setNumbOfDays(0);
    }
    let data = JSON.stringify({
      onDateService: dateservice,
      daysBeforeDateOfService: daysbeforeservice,
      daysbefore: noDays,
    });
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_UPDATE_PROVIDER_PROFILE,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorageTest.idToken,
      },
      data: data,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        setLoading(false);
        ToastSuccess("Configuration details saved successfully");
      })
      .catch(function (error) {
        setLoading(false);
        ToastError("Couldn't save configuration information");
        console.log(error);
      });
  };

  const saveNpiDetails = () => {
    if (npiDetails === "") {
      saveUserConfig();
      return;
    }

    let npidata = JSON.stringify({
      attr: npiDetails,
    });
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_SAVE_PAYER_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorageTest.idToken,
      },
      data: npidata,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        setLoading(false);
        saveUserConfig();
      })
      .catch(function (error) {
        setLoading(false);
        ToastError("Couldn't save configuration information");
        console.log(error);
      });
  };

  const data = JSON.parse(localStoragetest.attributes);
  const nameOfHospital = data.find(
    (x) => x.name === "custom:Organization"
  ).value;
  const npi = data.find((x) => x.name === "custom:NPI").value;
  const email = JSON.parse(localStorage.getItem("attributes")).find(x => x.name === 'email').value
  const contact = "";
  const typeOfPracticeVal =
    typeOfPractice === "H"
      ? "Institution/Organization"
      : typeOfPractice === "AT"
        ? "Individual"
        : "";
  const typeOfServiceVal = typeOfService ? typeOfService : "";

  const appointmentHourReminderOptions = [{ value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '10', label: '10' },
  { value: '11', label: '11' },
  { value: '12', label: '12' },
  ];

  const secondReminder = [{ value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
  ];

  function formatPhoneNumber(value) {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 6) return phoneNumber;
    return `${phoneNumber.slice(0, 5)}-${phoneNumber.slice(5, 10)}`;
  }

  const [columns, setColumns] = useState([
    {
      title: 'Title',
      field: 'title',
      lookup: { 'Dr.': 'Dr.', 'Prof.': 'Prof.', 'Mr.': 'Mr.', 'Ms.': 'Ms.', 'Mrs.': 'Mrs.' }
    },
    // { title: 'Name of Clinician/Staff', field: 'name' },
    {
      title: "First Name",
      field: "firstName",
      editComponent: props => (
        <TextField
          type="text"
          variant="standard"
          error={!props.value ? true : (props.value.length < 2)} //this works
          helperText={!props.value ? "Required" : (props.value.length < 2 ? 'Required' : " ")}
          value={props.value ? props.value : ""}
          onChange={e => {
            if (nameError.validateInput) {
              setNameError({
                ...nameError,
                validateInput: false
              });
            }
            props.onChange(e.target.value);
          }}
        />
      )
    },
    {
      title: "Last Name",
      field: "lastName",
      editComponent: props => (
        <TextField
          type="text"
          variant="standard"
          error={!props.value ? true : (props.value.length < 2)}
          helperText={!props.value ? "Required" : (props.value.length < 2 ? 'Required' : ' ')}
          value={props.value ? props.value : ""}
          onChange={e => {
            if (nameError.validateInput) {
              setNameError({
                ...nameError,
                validateInput: false
              });
            }
            props.onChange(e.target.value);
          }}
        />
      )
    },
    {
      title: 'Gender',
      field: 'gender',
      lookup: { "M": "Male", "F": "Female" }
    },

    {
      title: 'License No./NPI',
      field: "mciNo",
      editComponent: props => (
        <TextField
          type="text"
          variant="standard"
          error={!props.value ? true : (props.value.length < 2)}
          helperText={!props.value ? "Required" : (props.value.length < 2 ? 'Required' : ' ')}
          value={props.value ? props.value : ""}
          onChange={e => {
            if (nameError.validateInput) {
              setNameError({
                ...nameError,
                validateInput: false
              });
            }
            props.onChange(e.target.value);
          }}
        />
      )
    },
    {
      title: 'Email',
      field: "email",
      editComponent: props => (
        <TextField
          type="text"
          variant="standard"
          error={!props.value ? true : (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(props.value))}
          helperText={!props.value ? "Required" : (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(props.value) ? "Invalid email" : " ")}
          value={props.value ? props.value : ""}
          onChange={e => {
            if (nameError.validateInput) {
              setNameError({
                ...nameError,
                validateInput: false
              });
            }
            props.onChange(e.target.value);
          }}
        />
      )
    },
    {
      title: 'Cell Number',
      field: "contactNumber",
      editComponent: props => (
        <TextField
          type="tel"
          variant="standard"
          error={!props.value ? true : (!/^\D*(\d\D*){10}$/.test(props.value))}
          helperText={!props.value ? "Required" : (!/^\D*(\d\D*){10}$/.test(props.value) ? "10 digits" : " ")}
          value={props.value ? props.value : ""}
          onChange={e => {
            if (nameError.validateInput) {
              setNameError({
                ...nameError,
                validateInput: false
              });
            }
            props.onChange(e.target.value);
          }}
        />
      )
    },
    {
      title: 'Specialty',
      field: "specialities",
      editComponent: props => (
        <TextField
          type="text"
          variant="standard"
          error={!props.value ? true : (props.value.length < 3)}
          helperText={!props.value ? "Required" : (props.value.length < 3 ? 'Required' : ' ')}
          value={props.value ? props.value : ""}
          onChange={e => {
            if (nameError.validateInput) {
              setNameError({
                ...nameError,
                validateInput: false
              });
            }
            props.onChange(e.target.value);
          }}
        />
      )
    },
    {
      title: 'Practicing Since',
      field: "practisingMedSince",
      editComponent: props => (
        <TextField
          type="text"
          variant="standard"
          error={!props.value ? true : (!/^\D*(\d\D*){4}$/.test(props.value))}
          helperText={!props.value ? "Required" : (!/^\D*(\d\D*){4}$/.test(props.value) ? "YYYY year" : " ")}
          value={props.value ? props.value : ""}
          onChange={e => {
            if (nameError.validateInput) {
              setNameError({
                ...nameError,
                validateInput: false
              });
            }
            props.onChange(e.target.value);
          }}
        />
      )
    },

  ]);

  const [staffData, setStaffData] = useState([
    { title: 'Dr.', firstName: 'Mehmet', middleName: 'Zoya', lastName: 'Baran', gender: 'male', mciNo: 11222929222, email: "BaranMehmet@gmail.com", contactNumber: "637-726-7222", practisingMedSince: 2012, specialities: "Dental" },
    { title: 'Mr.', firstName: 'Zerya', middleName: '', lastName: 'Betul', gender: 'female', mciNo: 11229992922, email: "ZeryaBetul@gmail.com", contactNumber: "757-552-6232", practisingMedSince: 1978, specialities: "Cardiology" },
  ]);

  const addStaffData = (staffData) => {

    let config = {
      method: "post",
      url: "https://4feobrcpq3.execute-api.us-east-2.amazonaws.com/Physician/addPhysician",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorageTest.idToken,
      },
      data: staffData,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        console.log(response);
        ToastSuccess("Added Staff Member");
        setStaffData(oldData => [...oldData, staffData]);
        setLoading(false);
        // saveUserConfig();
      })
      .catch(function (error) {
        setLoading(false);
        ToastError("Couldn't save configuration information");
        console.log(error);
      });
  };


  const updateStaffData = () => {

    let data = staffData[staffData.length - 1];

    let config = {
      method: "post",
      url: "https://4feobrcpq3.execute-api.us-east-2.amazonaws.com/Physician/updatePhysician",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorageTest.idToken,
      },
      data: data,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        console.log(response);
        ToastSuccess("Added Staff Member");
        setLoading(false);
        // saveUserConfig();
      })
      .catch(function (error) {
        setLoading(false);
        ToastError("Couldn't save configuration information");
        console.log(error);
      });
  };

  const deleteStaffData = () => {

    let data = { physicianId: 1 };

    let config = {
      method: "post",
      url: "https://4feobrcpq3.execute-api.us-east-2.amazonaws.com/Physician/deletePhysician",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorageTest.idToken,
      },
      data: data,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        console.log(response);
        ToastSuccess("Deleted staff member");
        setLoading(false);
        // saveUserConfig();
      })
      .catch(function (error) {
        setLoading(false);
        ToastError("Couldn't delete staff member");
        console.log(error);
      });
  };


  const fetchStaffData = async () => {

    let staffDataConfig = {
      method: "post",
      url: "https://4feobrcpq3.execute-api.us-east-2.amazonaws.com/Physician/getPhysicians",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorageTest.idToken,
      },
    };
    try {
      let data = await axios(staffDataConfig);
      if (data !== undefined) {
        setStaffData({ data });
        console.log(data);
        ToastSuccess("Fetch Success");
      }
    } catch (e) {
      console.log("failed to fetch  staff data");
    }
  };

  //for specialty ui drop down
  //const [specialtiesListV, setSpecialtiesListV] = React.useState([]);
  const [spectl, setSpectl] = React.useState("");
  const fetchSpecialtiesList = async () => {
    let specialtiesConfigure = {
      method: "get",
      url: process.env.REACT_APP_BEATS_GET_SPECIALTIES_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorageTest.idToken,
      },
    };
    //var dt = await axios(specialtiesConfigure);
    //console.log("dt", dt.data);
    try {
      let specialties = await axios(specialtiesConfigure);
      //console.log("datauu", specialties.data);

      let specialtiesData = [];
      let specialtiesList = [];
      let tempSpecialtiesList = [];
      for (var i = 0; i < specialties.data.length; i++) {
        if (tempSpecialtiesList.indexOf(specialties.data[i].specialty_name) > -1) {
          continue;
        }
        else {
          let specialtyObj = {
            value: specialties.data[i].specialty_name,
            label: specialties.data[i].specialty_name,
          };
          specialtiesList.push(specialtyObj);
          tempSpecialtiesList.push(specialties.data[i].specialty_name);
        }
        let obj = {
          value: specialties.data[i].specialty_name,
          label: specialties.data[i].specialty_name,

          visit_reason: specialties.data[i].visit_reason,
          specialty_name: specialties.data[i].specialty_name,
        };
        specialtiesData.push(obj);
      }
      setSpecialtiesListV(specialtiesData);
      console.log(specialtiesListV);
    } catch (error) {
      // setSpecialtiesListV([{ value: "Data Not load", label: "Error ! Data Not load 848" }]);
      console.log("my profile specialty data not load", error);
    }
  }
  const getSpeciality = specialtiesListV.map((val) => <MenuItem value={val.value} > {val.label} </MenuItem>)

  return (
    <div className={classes.root}>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <CssBaseline />
      <ToastContainer />
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
        <LeftsideMenu />

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
        <div>
          <Grid className="disblock">
            <div className="maintab">
              <AppBar position="static">
                {process.env.REACT_APP_REGION == 'US' &&
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="simple tabs example"
                  >
                    <Tab label="Healthcare Provider Details"  {...a11yProps(0)} />
                    {/* <Tab label="Staff Details" {...a11yProps(1)} />
                    <Tab label="My Subscriptions" {...a11yProps(2)} /> */}
                    {sessionStorage.role == 'Admin' && <Tab label="My Mappings" {...a11yProps(1)} />}
                    {sessionStorage.role == 'Admin' && <Tab label="Admin configuration" {...a11yProps(2)} />}
                  </Tabs>
                }
                {process.env.REACT_APP_REGION == 'INDIA' &&
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="simple tabs example"
                  >
                    <Tab label="My Profile"  {...a11yProps(0)} />
                    {/* <Tab label="Staff Details" {...a11yProps(1)} />
                    <Tab label="My Subscriptions" {...a11yProps(2)} /> */}
                    {sessionStorage.role == 'Admin' && <Tab label="My Mappings" {...a11yProps(1)} />}
                    {sessionStorage.role == 'Admin' && <Tab label="Admin configuration" {...a11yProps(2)} />}
                  </Tabs>
                }

              </AppBar>
              <TabPanel value={value} index={0}>
                <Grid item xs={12} sm={12}>
                  <Paper className="pad20  bx-shadow dbbox">
                    <Box className="toprightuploadicon  bx-shadow">
                      <CloudUpload onClick={uploadProfile}></CloudUpload>
                    </Box>
                    <Box className="toprighticon  bx-shadow">
                      <input
                        type="file"
                        ref={uploadInputRef}
                        style={{ display: "none" }}
                        onChange={(event) => {
                          onDrop(event);
                        }}
                      />
                      <EditIcon onClick={openFileUploader}></EditIcon>
                    </Box>{" "}
                    <p className="title1 mb20">My Profile</p>
                    <MyDetailsComponent
                      subscriberDetails={subscriberDetails}
                      email={email}
                      onChangeFormData={onChangeFormData}
                      updateSubscriberDetails={updateSubscriberDetails}
                      setConfirmPass={setConfirmPass}
                      setNewPassword={setNewPassword}
                      setCurrentPass={setCurrentPass}
                      pictures={pictures}
                    />
                    <Grid container className="signinbototm mt30">
                      <Grid item xs={12} sm={9} md={9}>
                        <button className="btn-primary" onClick={updatePass}>
                          Save
                        </button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </TabPanel>
             
              <TabPanel value={value} index={1}>
                <Grid item xs={12} sm={12}>
                  <Paper className="MuiPaper-root pad20  bx-shadow dbbox MuiPaper-elevation1 MuiPaper-rounded">
                    <Grid container spacing={3}>
                      <Mapping/>
                    </Grid>
                  </Paper>
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Grid item xs={12} sm={12}>
                  <Paper className="MuiPaper-root pad20  bx-shadow dbbox MuiPaper-elevation1 MuiPaper-rounded">
                    <Grid container spacing={3}>
                      <AdminConfiguration flow="fetch"/>
                    </Grid>
                  </Paper>
                </Grid>
              </TabPanel>
            </div>
          </Grid>
        </div>
      </main>
    </div>
  );
}
