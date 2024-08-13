import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import PatientProfile from "./PatientProfile";
import PatientAppointment from "./PatientAppointment";
import PatientNoteIndex from "./PatientNoteIndex";
import PatientProcedureIndex from "./PatientProcedureIndex";
import PatientInvoiceIndex from "./invoice/PatientInvoiceIndex";
import PatientPaymentIndex from "./payment/PatientPaymentIndex";
import PatientLedgerIndex from "./ledger/PatientLedgerIndex";
import PatientFilesIndex from "./files/PatientFilesIndex";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  },
}));

export default function PatientTab(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    const tabIndex = localStorage.getItem("patientTab");
    if (tabIndex !== null && tabIndex.toString().length > 0) {
      setValue(parseInt(tabIndex));
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem("patientTab", newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          indicatorColor="primary"
          textColor="primary"
          scrollButtons="auto"
          variant="scrollable"
        >
          <Tab label="Profile" {...a11yProps(0)} />
          <Tab label="Appointments" {...a11yProps(1)} />
          <Tab label="Clinical Notes" {...a11yProps(2)} />
          <Tab label="Completed Procedures" {...a11yProps(3)} />
          <Tab label="Invoices" {...a11yProps(4)} />
          <Tab label="Payments" {...a11yProps(5)} />
          <Tab label="Ledger" {...a11yProps(6)} />
          <Tab label="Files" {...a11yProps(7)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <PatientProfile
          patientInfo={props.patientInfo}
          {...props}
        ></PatientProfile>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PatientAppointment
          patientId={props.patientInfo.id}
        ></PatientAppointment>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <PatientNoteIndex patientId={props.patientInfo.id}></PatientNoteIndex>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <PatientProcedureIndex
          patientId={props.patientInfo.id}
        ></PatientProcedureIndex>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <PatientInvoiceIndex
          patientId={props.patientInfo.id}
        ></PatientInvoiceIndex>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <PatientPaymentIndex
          patientId={props.patientInfo.id}
        ></PatientPaymentIndex>
      </TabPanel>
      <TabPanel value={value} index={6}>
        <PatientLedgerIndex
          patientId={props.patientInfo.id}
        ></PatientLedgerIndex>
      </TabPanel>
      <TabPanel value={value} index={7}>
        <PatientFilesIndex patientId={props.patientInfo.id}></PatientFilesIndex>
      </TabPanel>
    </div>
  );
}
