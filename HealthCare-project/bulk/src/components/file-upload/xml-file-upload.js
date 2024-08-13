import React, { useState } from "react";
import LeftsideMenu from "../LeftsideMenu";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import Dropzone from "../UI/dropzone";
// import logodb from "../img/Beats-health-logo.png";

import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
} from "@material-ui/core";

import { ToastContainer } from "react-toastify";

import SessionTimeOut from "../common/SessionTimeOut";
import { Tab, Tabs, Typography } from "@mui/material";
import FileStatus from "./file-status";
import ReconciliationReport from "./reconciliation-report";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    overflow: "hidden",
    flexDirection: "row",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
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
  dropdownStyle: {
    borderRadius: "3%",
    backgroundColor: "white",
  },
  cntnr: {
    flexGrow: 1,
    marginTop: 30,
    justifyContent: "center",
  },
  slct: {
    width: 260,
  },
  txtField: {
    width: 400,
  },
  formCntrlLabel: {
    marginTop: 20,
  },
  srchButton: {
    background: "#C72C35",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#C72C35",
    },
    textTransform: "none",
  },
  closeIconButton: {
    "&:hover": {
      background: "none",
    },
  },
  btnCntnr: {
    marginTop: 20,
    justifyContent: "right",
  },
  gridDiv: {
    width: 1290,
    minHeight: 400,
  },
  icnBtn: {
    "&:hover": {
      backgroundColor: "none",
      background: "none",
    },
  },
  isModalDialog: {
    backgroundColor: "red",
  },
  paper: {
    marginTop: "20px",
  },
  content: {},
}));

function CustomTabPanel(props) {
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
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const XmlFileUpload = () => {
  const classes = useStyles();
  const [isLoading, setLoading] = React.useState(false);
  const [open] = React.useState(false);
  // const [fileUploads, setFileUploads] = useState([]);
  const [files, setFiles] = useState([]);

  // FileStatus
  const [fileStatusFromDate, fileStatusHandleFromDateChange] = useState(
    new Date()
  );
  const [fileStatusToDate, fileStatusHandleToDateChange] = useState(new Date());
  const [fileStatusData, setFileStatusData] = useState();

  // Reconciliation Report
  const [reportFromDate, reportHandleFromDateChange] = useState(new Date());
  const [reportToDate, reportHandleToDateChange] = useState(new Date());
  const [reportData, setReportData] = useState();

  // console.log("fileUploads", fileUploads);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <CssBaseline />
      <ToastContainer />
      <SessionTimeOut />
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
          {/* <img src={logodb} className="dblogo" alt="Beats Logo" /> */}
        </div>
        <LeftsideMenu />
      </Drawer>
      <Box sx={{ width: "100%", marginTop: 40 }}>
        <Box sx={{ borderBottom: 1, borderColor: "#c72c35" }} id="new">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="XML File Upload" {...a11yProps(0)} />
            <Tab label="File Status" {...a11yProps(1)} />
            <Tab label="Reconciliation Report" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Typography variant="h4" color={"#c72c35"}>
            XML File Upload
          </Typography>
          <Box>
            <Dropzone files={files} setFiles={setFiles} />
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <FileStatus
            fromDate={fileStatusFromDate}
            handleFromDateChange={fileStatusHandleFromDateChange}
            toDate={fileStatusToDate}
            handleToDateChange={fileStatusHandleToDateChange}
            data={fileStatusData}
            setData={setFileStatusData}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <ReconciliationReport
            fromDate={reportFromDate}
            handleFromDateChange={reportHandleFromDateChange}
            toDate={reportToDate}
            handleToDateChange={reportHandleToDateChange}
            data={reportData}
            setData={setReportData}
          />
        </CustomTabPanel>
      </Box>
    </div>
  );
};

export default XmlFileUpload;
