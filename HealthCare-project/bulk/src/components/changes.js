import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Datepickermod from "./datepicker";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import EligibilityData from "../service/EligibilityData";
import CreateSharpIcon from "@material-ui/icons/CreateSharp";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import NotesDialog from "./Notes";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import LeftsideMenu from "./LeftsideMenu";
import logodb from "../img/Beats-health-logo.png";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import { createStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import MaterialTable from "material-table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastError, ToastSuccess } from "../service/toast/Toast";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Base64Downloader from "react-base64-downloader";
import DescriptionIcon from "@material-ui/icons/Description";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import ImagePreview from "./showImageModal";

import Collapsible from 'react-collapsible';
import { useState } from "react";



/*function createData(PatientID, pDate, FullName, Eligibility, Status, Coverage, Onboarding, PayerName) {
    return { PatientID, pDate, FullName, Eligibility, Status, Coverage, Onboarding, PayerName };
}

const rows = [
    createData('NY1234', '02-May-2021', 'John amir Manoly', 'Eligible', 'InNetwork', 'Health Benefit', 'Eligibiity check complete', 'John'),
    createData('NY1234', '02-May-2021', 'John amir Manoly', 'Eligible', 'InNetwork', 'Health Benefit', 'Eligibiity check complete', 'John'),
    createData('NY1234', '02-May-2021', 'John amir Manoly', 'Eligible', 'InNetwork', 'Health Benefit', 'Eligibiity check complete', 'John'),
    createData('NY1234', '02-May-2021', 'John amir Manoly', 'Eligible', 'InNetwork', 'Health Benefit', 'Eligibiity check complete', 'John'),
    createData('NY1234', '02-May-2021', 'John amir Manoly', 'Eligible', 'InNetwork', 'Health Benefit', 'Eligibiity check complete', 'John'),
];*/

// Create our number formatter.
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const BootstrapInput = withStyles((theme) =>
  createStyles({
    root: {
      "label + &": {
        marginTop: theme.spacing(3),
      },
    },
    input: {},
  })
)(InputBase);

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

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
  unExpand: {
    top: "24px",
    position: "absolute",
    width: "50px",
    height: "40px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    display: "inline",
    right: "5px",
    textAlign: "center",
    transition: "width 1s",
  },
  Expand: {
    top: "24px",
    transition: "width 1s",
    position: "absolute",
    width: "550px",
    height: "40px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    display: "inline",
    right: "5px",
    textAlign: "center",
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
  const [patientDocuments, setpatientDocuments] = React.useState({
    front: "",
    back: "",
  });
  const [imageModal, setImageModal] = React.useState({
    isModalOpen: false,
    image: "",
  });

  const [notesCompOpen, openNotes] = React.useState(false);
  const [open] = React.useState(false);
  const [gridData, setGridData] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);
  const [isExpand, selectedExpand] = React.useState("");
  const [openViewModel, setOpenViewMode] = React.useState(false);
  const [openViewModel2, setOpenViewMode2] = React.useState(false);
  const [editedFlag, setEditedFlag] = React.useState(false);
  const [searchedFlag, setSearchedFlag] = React.useState(false);
  const [includeInactive, setIncludeInactive] = React.useState(false);
  const [viewRecord, setViewRecord] = React.useState([]);
  const [tabState, setTabState] = React.useState("view");
  const [attributeData, setAttributeData] = React.useState({
    payer: [],
    servicetype: [],
  });
  const [documentTypeHistory, setDocumentTypeHistory] = React.useState({
    front:false,
    back:false,
    combined:false
  });
  const [patientNoteData, setpatientNoteData] = React.useState([]);
  const [columnToFilter, setColumnToFilter] = React.useState("");
  const [toFilter, setToFilter] = React.useState("");
  const [frontImage, setFrontImage] = React.useState("");
  const [backImage, setBackImage] = React.useState("");
  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  const [patientDeleteId, setpatientDeleteId] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  var today = new Date();
  const columnOptions = [
    { value: "patientName", label: "Patient Name" },
    { value: "eligibility", label: "Eligibility" },
    { value: "network", label: "Network Status" },
    { value: "coverageType", label: "Coverage Type" },
    { value: "onBoardingStatus", label: "Registration Status" },
    { value: "payorName", label: "Payer Name" },
    { value: "dateOfService", label: "Date of Service" },
    { value: "dob", label: "Date of Birth" },
  ];

  const handleConfirmOpen = () => {
    setConfirmOpen(true);
  };

  const sendLinkApi = (patientId) => {
    ////debugger;
    let data = {
      patient_id: patientId,
    };
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_RESEND_PATIENT_LINK,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
      data: data,
    };

    setLoading(true);
    axios(config)
      .then(function (response) {
        ////debugger;
        setLoading(false);
        // setPatientId(response.data.lastInsertedPatient.insertId);
        ToastSuccess("Link sent successfully!");
      })
      .catch(function (error) {
        setLoading(false);
        ToastError("Failed to sent link");
        console.log(error);
      });
  };

  const savePatientNotes = (notes) => {
    setpatientNoteData([]);
    setTabState("view");
    setOpenViewMode(false);
    if (notes === "" || toUpdatePatientInfo["patient_id"] === "") {
      ToastError("Please Enter Note");
      return false;
    }
    let data = {
      patient_id: parseInt(toUpdatePatientInfo["patient_id"]),
      note_description: notes,
    };
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_SAVE_PATIENT_NOTES,
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
        setTabState("view");
        setOpenViewMode(false);
        openNotes(false);
        // setPatientId(response.data.lastInsertedPatient.insertId);
        ToastSuccess("Note saved successfully");
      })
      .catch(function (error) {
        setLoading(false);
        setpatientNoteData([]);
        ToastError("Failed to save note");
        console.log(error);
      });
  };

  const clearFilter = () => {
    setColumnToFilter("");
    setToFilter("");
    setIncludeInactive(false);
    if (searchedFlag) {
      fetchData();
    }
  };

  const Search = async () => {
    ////debugger;
    if (columnToFilter === "") {
      ToastError("Please Select Column To Filter");
      return false;
    }
    if (toFilter === "") {
      ToastError("Please Enter Text To Search");
      return false;
    }

    setLoading(true);

    let data = JSON.stringify({
      key: columnToFilter,
      value: toFilter,
      inactive: includeInactive ? 0 : 1,
    });

    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_FILTER_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        ////debugger;
        let patientGridata = [...gridData];
        patientGridata = JSON.parse(response.data.data);
        setGridData(patientGridata);
        setSearchedFlag(true);
        setLoading(false);
      })
      .catch(function (error) {
        ////debugger;
        console.log(error);
        setLoading(false);
        setColumnToFilter("");
        setToFilter("");
        fetchData();
        ToastError("Failed To Filter!");
      });
  };

  const fetchPatientNotes = async (id) => {
    let patientNotesData = [];
    let notes = {
      method: "post",
      url: process.env.REACT_APP_BEATS_FETCH_PATIENT_NOTES_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
      data: {
        patient_id: id,
      },
    };

    setLoading(true);
    try {
      let notesData = await axios(notes);
      let fetchedNotedata = JSON.parse(notesData.data.data);
      for (var i = 0; i < fetchedNotedata.length; i++) {
        let obj = {
          id: fetchedNotedata[i].note_id,
          desc: fetchedNotedata[i].note_description,
          time: fetchedNotedata[i].created_time,
          by: fetchedNotedata[i].name,
        };
        patientNotesData.push(obj);
      }
      setpatientNoteData(patientNotesData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      ToastError("Failed To Fetch Patient Note Information!");
      console.log(error);
    }
  };

  const saveNotes = (data) => {
    //  alert(data);
    ////debugger;
    savePatientNotes(data);
    openNotes(false);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setpatientDeleteId("");
  };
  const handleConfirmDelete = () => {
    ////debugger;
    setConfirmOpen(false);
    if (patientDeleteId === "") {
      ToastError("Please Select Patient Before Deleting");
      return;
    }
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_DELETE_PATIENT_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
      data: {
        patient_id: patientDeleteId,
      },
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        ////debugger;
        setLoading(false);
        setpatientDeleteId("");
        ToastSuccess("Patient record deleted successfully");
        fetchData();
      })
      .catch(function (error) {
        setLoading(false);
        setpatientDeleteId("");
        ToastError("Failed to delete patient record");
        console.log(error);
      });
  };
  const [toUpdatePatientInfo, setUpdatePatientInfo] = React.useState({
    patient_id: "",
    patient_insurance_record_id: "",
    pfname: "",
    dateOfService:
      today.getFullYear() +
      "/" +
      (today.getMonth() + 1) +
      "/" +
      today.getDate(),
    dob:
      today.getFullYear() +
      "/" +
      (today.getMonth() + 1) +
      "/" +
      today.getDate(),
    country_code_label: "US",
    country_code: "",
    contact_number: "",
    email: "",
    payor_external_id: "",
    network_coverage: "",
    eligibility: "",
    service_type: null,
    comments: "",
    middle_name: "",
    last_name: "",
  });
  const [patientFName, setPatientFName] = React.useState("");
  const [patientLName, setPatientLName] = React.useState("");
  const [networkType, setNetworkType] = React.useState("");
  const [payerName, setPayerName] = React.useState("");
  const [serviceName, setServiceName] = React.useState("");
  const [medicareAdditionalPayers, setMedicareAdditionalPayers] = React.useState("");

  const [deductiblesInFamInfo, setDeductiblesInFamInfo] = React.useState({
    amount: "",
    amountTimePeriod: "",
    notes: "",
    remaining: "",
    remainingTimePeriod: "",
    total: "",
    totalTimePeriod: "",
  });

  const [deductiblesInIndInfo, setDeductiblesInIndInfo] = React.useState({
    amount: "",
    amountTimePeriod: "",
    notes: "",
    remaining: "",
    remainingTimePeriod: "",
    total: "",
    totalTimePeriod: "",
  });

  const [deductiblesNAFamInfo, setDeductiblesNAFamInfo] = React.useState({
    amount: "",
    amountTimePeriod: "",
    notes: "",
    remaining: "",
    remainingTimePeriod: "",
    total: "",
    totalTimePeriod: "",
  });

  const [deductiblesNAIndInfo, setDeductiblesNAIndInfo] = React.useState({
    amount: "",
    amountTimePeriod: "",
    notes: "",
    remaining: "",
    remainingTimePeriod: "",
    total: "",
    totalTimePeriod: "",
  });

  const [deductiblesNoFamInfo, setDeductiblesNoFamInfo] = React.useState({
    amount: "",
    amountTimePeriod: "",
    notes: "",
    remaining: "",
    remainingTimePeriod: "",
    total: "",
    totalTimePeriod: "",
  });

  const [deductiblesNoIndInfo, setDeductiblesNoIndInfo] = React.useState({
    amount: "",
    amountTimePeriod: "",
    notes: "",
    remaining: "",
    remainingTimePeriod: "",
    total: "",
    totalTimePeriod: "",
  });

  const [deductiblesOutFamInfo, setDeductiblesOutFamInfo] = React.useState({
    amount: "",
    amountTimePeriod: "",
    notes: "",
    remaining: "",
    remainingTimePeriod: "",
    total: "",
    totalTimePeriod: "",
  });

  const [deductiblesOutIndInfo, setDeductiblesOutIndInfo] = React.useState({
    amount: "",
    amountTimePeriod: "",
    notes: "",
    remaining: "",
    remainingTimePeriod: "",
    total: "",
    totalTimePeriod: "",
  });


  const [pocketInFamInfo, setPocketInFamInfo] = React.useState({
    amount: "",
    notes: "",
    remaining: "",
    remainingTimePeriod: "",
  });

  const [pocketInIndInfo, setPocketInIndInfo] = React.useState({
    amount: "",
    notes: "",
    remaining: "",
    remainingTimePeriod: "",
  });

  const [pocketNAFamInfo, setPocketNAFamInfo] = React.useState({
    amount: "",
    notes: "",
    remaining: "",
    remainingTimePeriod: "",
  });

  const [pocketNAIndInfo, setPocketNAIndInfo] = React.useState({
    amount: "",
    notes: "",
    remaining: "",
    remainingTimePeriod: "",
  });

  const [pocketNoFamInfo, setPocketNoFamInfo] = React.useState({
    amount: "",
    notes: "",
    remaining: "",
    remainingTimePeriod: "",
  });

  const [pocketNoIndInfo, setPocketNoIndInfo] = React.useState({
    amount: "",
    notes: "",
    remaining: "",
    remainingTimePeriod: "",
  });

  const [pocketOutFamInfo, setPocketOutFamInfo] = React.useState({
    amount: "",
    remaining: "",
    remainingTimePeriod: "",
  });

  const [pocketOutIndInfo, setPocketOutIndInfo] = React.useState({
    amount: "",
    remaining: "",
    remainingTimePeriod: "",
  });

  const [coInsuranceIn, setCoInsuranceIn] = React.useState({
    amount: "",
    notes: "",
  });

  const [coInsuranceOut, setCoInsuranceOut] = React.useState({
    amount: "",
    notes: "",
  });

  const [coInsuranceNA, setCoInsuranceNA] = React.useState({
    amount: "",
    notes: "",
  });

  const [coInsuranceNo, setCoInsuranceNo] = React.useState({
    amount: "",
    notes: "",
  });

  const [coPaymentIn, setCoPaymentIn] = React.useState({
    amount: "",
    notes: "",
  });

  const [coPaymentOut, setCoPaymentOut] = React.useState({
    amount: "",
    notes: "",
  });

  const [coPaymentNA, setCoPaymentNA] = React.useState({
    amount: "",
    notes: "",
  });

  const [coPaymentNo, setCoPaymentNo] = React.useState({
    amount: "",
    notes: "",
  });

  const [limitationsIn, setLimitationsIn] = React.useState({
    amount: "",
    remaining: "",
    notes: "",
  });

  const [limitationsOut, setLimitationsOut] = React.useState({
    amount: "",
    remaining: "",
    notes: "",
  });

  const [limitationsNA, setLimitationsNA] = React.useState({
    amount: "",
    remaining: "",
    notes: "",
  });

  const [limitationsNo, setLimitationsNo] = React.useState({
    amount: "",
    remaining: "",
    notes: "",
  });
  



 
    const inNetworkIndData = [
      { title: "Co-Payment ", yearToDate: coPaymentIn['amount'] , remaining: "N/A", notes: coPaymentIn['notes'] },
      { title: "Deductible", yearToDate: deductiblesInIndInfo['amount'] , remaining: deductiblesInIndInfo['remaining'], notes: deductiblesInIndInfo['notes'] },
      { title: "Out-of-Pocket", yearToDate: pocketInIndInfo['amount'] , remaining: pocketInIndInfo['remaining'], notes: pocketInIndInfo['notes'] },
      { title: "Co-Insurance", yearToDate: coInsuranceIn['amount'] , remaining: "N/A", notes: coInsuranceIn['notes'] },
      { title: "Limitations", yearToDate: limitationsIn['amount'] , remaining: limitationsIn['remaining'], notes: limitationsIn['notes'] },
    ];
      
    const inNetworkFamData = [
      { title: "Co-Payment", yearToDate: coPaymentIn['amount'] , remaining: "N/A", notes: coPaymentIn['notes'] },
      { title: "Deductible", yearToDate: deductiblesInFamInfo['amount'] , remaining: deductiblesInFamInfo['remaining'], notes: deductiblesInFamInfo['notes'] },
      { title: "Out-of-Pocket", yearToDate: pocketInFamInfo['amount'] , remaining: pocketInFamInfo['remaining'], notes: pocketInFamInfo['notes'] },
      { title: "Co-Insurance", yearToDate: coInsuranceIn['amount'], remaining: "N/A", notes: coInsuranceIn['notes'] },
      { title: "Limitations", yearToDate: limitationsIn['amount'] , remaining: limitationsIn['remaining'], notes: limitationsIn['notes'] },
    ];

    const outNetworkIndData = [
      { title: "Co-Payment", yearToDate: coPaymentOut['amount'] , remaining: "N/A", notes: coPaymentOut['notes'] },
      { title: "Deductible", yearToDate: deductiblesOutIndInfo['amount'] , remaining: deductiblesOutIndInfo['remaining'], notes: deductiblesOutIndInfo['notes'] },
      { title: "Out-of-Pocket", yearToDate: pocketOutIndInfo['amount'] , remaining: pocketOutIndInfo['remaining'], notes: pocketOutIndInfo['notes'] },
      { title: "Co-Insurance", yearToDate: coInsuranceOut['amount'] , remaining: "N/A", notes: coInsuranceOut['notes'] },
      { title: "Limitations", yearToDate: limitationsOut['amount'] , remaining: limitationsOut['remaining'], notes: limitationsOut['notes'] },
      
    ];

    const outNetworkFamData = [
      { title: "Co-Payment", yearToDate: coPaymentOut['amount'] , remaining: "N/A", notes: coPaymentOut['notes'] },
      { title: "Deductible", yearToDate: deductiblesOutFamInfo['amount'], remaining: deductiblesOutFamInfo['remaining'], notes: deductiblesOutFamInfo['notes'] },
      { title: "Out-of-Pocket", yearToDate: pocketOutFamInfo['amount'], remaining: pocketOutFamInfo['remaining'], notes: pocketOutFamInfo['notes'] },
      { title: "Co-Insurance", yearToDate:  coInsuranceOut['amount'] , remaining: "N/A", notes: coInsuranceOut['notes'] },
      { title: "Limitations", yearToDate: limitationsOut['amount'] , remaining: limitationsOut['remaining'], notes: limitationsOut['notes'] },
    ];


    const NANetworkIndData = [
      { title: "Co-Payment", yearToDate: coPaymentNA['amount'] , remaining: "N/A", notes: coPaymentNA['notes'] },
      { title: "Deductible", yearToDate: deductiblesNAIndInfo['amount'] , remaining: deductiblesNAIndInfo['remaining'], notes: deductiblesNAIndInfo['notes'] },
      { title: "Out-of-Pocket", yearToDate: pocketNAIndInfo['amount'] , remaining: pocketNAIndInfo['remaining'], notes: pocketNAIndInfo['notes'] },
      { title: "Co-Insurance", yearToDate: coInsuranceNA['amount'] , remaining: "N/A", notes: coInsuranceNA['notes'] },
      { title: "Limitations", yearToDate: limitationsNA['amount'] , remaining: limitationsNA['remaining'], notes: limitationsNA['notes'] },
      
    ];

    const NANetworkFamData = [
      { title: "Co-Payment", yearToDate: coPaymentNA['amount'] , remaining: "N/A", notes: coPaymentNA['notes'] },
      { title: "Deductible", yearToDate: deductiblesNAFamInfo['amount'], remaining: deductiblesNAFamInfo['remaining'], notes: deductiblesNAFamInfo['notes'] },
      { title: "Out-of-Pocket", yearToDate: pocketNAFamInfo['amount'], remaining: pocketNAFamInfo['remaining'], notes: pocketNAFamInfo['notes'] },
      { title: "Co-Insurance", yearToDate:  coInsuranceNA['amount'] , remaining: "N/A", notes: coInsuranceNA['notes'] },
      { title: "Limitations", yearToDate: limitationsNA['amount'] , remaining: limitationsNA['remaining'], notes: limitationsNA['notes'] },
    ];


    const NoNetworkIndData = [
      { title: "Co-Payment", yearToDate: coPaymentNo['amount'] , remaining: "N/A", notes: coPaymentNo['notes'] },
      { title: "Deductible", yearToDate: deductiblesNoIndInfo['amount'] , remaining: deductiblesNoIndInfo['remaining'], notes: deductiblesNoIndInfo['notes'] },
      { title: "Out-of-Pocket", yearToDate: pocketNoIndInfo['amount'] , remaining: pocketNoIndInfo['remaining'], notes: pocketNoIndInfo['notes'] },
      { title: "Co-Insurance", yearToDate: coInsuranceNo['amount'] , remaining: "N/A", notes: coInsuranceNo['notes'] },
      { title: "Limitations", yearToDate: limitationsNo['amount'] , remaining: limitationsNo['remaining'], notes: limitationsNo['notes'] },
      
    ];

    const NoNetworkFamData = [
      { title: "Co-Payment", yearToDate: coPaymentNo['amount'] , remaining: "N/A", notes: coPaymentNo['notes'] },
      { title: "Deductible", yearToDate: deductiblesNoFamInfo['amount'], remaining: deductiblesNoFamInfo['remaining'], notes: deductiblesNoFamInfo['notes'] },
      { title: "Out-of-Pocket", yearToDate: pocketNoFamInfo['amount'], remaining: pocketNoFamInfo['remaining'], notes: pocketNoFamInfo['notes'] },
      { title: "Co-Insurance", yearToDate:  coInsuranceNo['amount'] , remaining: "N/A", notes: coInsuranceNo['notes'] },
      { title: "Limitations", yearToDate: limitationsNo['amount'] , remaining: limitationsNo['remaining'], notes: limitationsNo['notes'] },
    ];



  
  const benefitsTableColumns = [

    {
      title: "",
      field: "title",
      cellStyle: {
        fontWeight: 'bold',
        fontSize: '14px',
        whiteSpace: 'nowrap',
      },
    },

    {
      title: "Year-To-Date",
      field: "Year to Date",
      headerStyle: {
        fontSize: '13px',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
      },
    },
    {
      title: "Remaining",
      field: "Remaining",
      headerStyle: {
        fontWeight: 'bold',
      },
    },
    {
      title: "Notes",
      field: "Notes",
      headerStyle: {
        fontWeight: 'bold',
      },
      cellStyle: {
        fontSize: '11px',
      },
    },
  ];


  const benefitsSpecialtyTableColumns = [

    {
      title: "Network Type",
      field: "Network Type",
      headerStyle: {
        fontSize: '13px',
        fontWeight: 'bold',
      },
      cellStyle: {
        fontWeight: 'bold',
        fontSize: '14px',
      },
    },

    {
      title: "Item",
      field: "Item",
      headerStyle: {
        fontSize: '13px',
        fontWeight: 'bold',

      },
      cellStyle: {
        fontWeight: 'bold',
        fontSize: '14px',
      },
    },

    {
      title: "Value",
      field: "Value",
      headerStyle: {
        fontSize: '13px',
        fontWeight: 'bold',
      },
    },

    {
      title: "Notes",
      field: "Notes",
      headerStyle: {
        fontWeight: 'bold',
      },
      cellStyle: {
        fontSize: '11px',
      },
    },
  ];





  const nonMedTables = [];


  const[specialtyInfoData, setSpecialtyInfoData] = useState([]);

  const[medicareTrigger, setMedicareTrigger] = useState(false);

  const[medicareTriggerA, setMedicareTriggerA] = useState(false);
  const[medicareTriggerB, setMedicareTriggerB] = useState(false);
  const[medicareTriggerC, setMedicareTriggerC] = useState(false);
  const[medicareTriggerD, setMedicareTriggerD] = useState(false);

  const[medicareCoInsTriggerA, setMedicareCoInsTriggerA] = useState(false);
  const[medicareCoInsTriggerB, setMedicareCoInsTriggerB] = useState(false);
  const[medicareCoInsTriggerC, setMedicareCoInsTriggerC] = useState(false);
  const[medicareCoInsTriggerD, setMedicareCoInsTriggerD] = useState(false);

  const [medicareDeductibleA, setMedicareDeductibleA] = React.useState({
    amount: "",
    remaining: "",
  });

  const [medicareDeductibleB, setMedicareDeductibleB] = React.useState({
    amount: "",
    remaining: "",
  });
  const [medicareDeductibleC, setMedicareDeductibleC] = React.useState({
    amount: "",
    remaining: "",
  });
  const [medicareDeductibleD, setMedicareDeductibleD] = React.useState({
    amount: "",
    remaining: "",
  });



  const [medicareCoInsA, setMedicareCoInsA] = React.useState({
    amount: "0",
  });

  const [medicareCoInsB, setMedicareCoInsB] = React.useState({
    amount: "0",
  });

  const [medicareCoInsC, setMedicareCoInsC] = React.useState({
    amount: "0",
  });
  const [medicareCoInsD, setMedicareCoInsD] = React.useState({
    amount: "0",
  });

  const [limitationsA, setLimitationsA] = React.useState({
    amount: "N/A",
    remaining: "N/A",
  });

  const [limitationsB, setLimitationsB] = React.useState({
    amount: "N/A",
    remaining: "N/A",
  });

  const [limitationsC, setLimitationsC] = React.useState({
    amount: "N/A",
    remaining: "N/A",
  });

  const [limitationsD, setLimitationsD] = React.useState({
    amount: "N/A",
    remaining: "N/A",
  });
  


  
  const medicareAData = [
    { title: "Deductible", yearToDate: formatter.format(medicareDeductibleA['amount']) , remaining: formatter.format(medicareDeductibleA['remaining'])},
    { title: "Co-Insurance", yearToDate: medicareCoInsA['amount'] +"%", remaining: "N/A" },
    { title: "Limitations", yearToDate: limitationsA['amount'], remaining: limitationsA['remaining'] },
  ];
    
  const medicareBData = [
    { title: "Deductible", yearToDate: formatter.format(medicareDeductibleB['amount']) , remaining: formatter.format(medicareDeductibleB['remaining'])},
    { title: "Co-Insurance", yearToDate: medicareCoInsB['amount'] +"%", remaining: "N/A" },
    { title: "Limitations", yearToDate: limitationsB['amount'], remaining: limitationsB['remaining'] },
  ];
  const medicareCData = [
    { title: "Deductible", yearToDate: formatter.format(medicareDeductibleC['amount']) , remaining: formatter.format(medicareDeductibleC['remaining']) },
    { title: "Co-Insurance", yearToDate: medicareCoInsC['amount'] +"%", remaining: "N/A" },
    { title: "Limitations", yearToDate: limitationsC['amount'], remaining: limitationsC['remaining'] },
  ];
  const medicareDData = [
    { title: "Deductible", yearToDate: formatter.format(medicareDeductibleD['amount']) , remaining: formatter.format(medicareDeductibleD['remaining'])},
    { title: "Co-Insurance", yearToDate: medicareCoInsD['amount'] +"%", remaining: "N/A" },
    { title: "Limitations", yearToDate: limitationsD['amount'] , remaining: limitationsD['remaining']},
  ];

  


  const medicareTableColumns = [

    {
      title: "",
      field: "title",
      cellStyle: {
        fontWeight: 'bold',
        fontSize: '14px',
      },
    },

    {
      title: "Year-To-Date",
      field: "Year to Date",
      headerStyle: {
        fontSize: '13px',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
      },
    },
    {
      title: "Remaining",
      field: "Remaining",
      headerStyle: {
        fontWeight: 'bold',
      },
    },
    {
      title: "Notes",
      field: "Notes",
      headerStyle: {
        fontWeight: 'bold',
      },
      cellStyle: {
        fontSize: '11px',
      },
    },
  ];


  const [medicarePartAAvailable, setMedicarePartAAvailable] = React.useState("");
  const [medicarePartBAvailable, setMedicarePartBAvailable] = React.useState("");
  const [medicarePartCAvailable, setMedicarePartCAvailable] = React.useState("");
  const [medicarePartDAvailable, setMedicarePartDAvailable] = React.useState("");

  const[noDataAvailable, setNoDataAvailable] = useState(false);





  const medicarePartData = [
    { title: "Part A", available: medicarePartAAvailable},
    { title: "Part B", available: medicarePartBAvailable },
    { title: "Part C", available: medicarePartCAvailable},
    { title: "Part D", available: medicarePartDAvailable },
  ];

  



  const medicarePartTableColumns = [

    {
      title: "Medicare",
      field: "title",
      headerStyle: {
        fontSize: '13px',
        fontWeight: 'bold',
      },
      cellStyle: {
        fontWeight: 'bold',
        fontSize: '14px',
      },
    },

    {
      title: "Available",
      field: "available",
      headerStyle: {
        fontSize: '13px',
        fontWeight: 'bold',
      },
    },

  ];


  
  const contactInfoColumns = [

    {
      title: "Category",
      field: "Category",
      cellStyle: {
        fontWeight: 'bold',
        fontSize: '14px',
      },
    },

    {
      title: "Type",
      field: "Type",
      headerStyle: {
        fontSize: '13px',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
      },
    },
    {
      title: "Name",
      field: "Name",
      headerStyle: {
        fontWeight: 'bold',
      },
    },
    {
      title: "Phone",
      field: "Phone",
      headerStyle: {
        fontWeight: 'bold',
      },
      cellStyle: {
        fontSize: '11px',
      },
    },
  ];


  const [inCollapsible, setInCollapsible] = React.useState([]);
  const [outCollapsible, setOutCollapsible] = React.useState([]);
  const [noCollapsible, setNoCollapsible] = React.useState([]);
  const [NACollapsible, setNACollapsible] = React.useState([]);
  const [specialtyCollapsible, setSpecialtyCollapsible] = React.useState([]);
  const [medicareCollapsible, setMedicareCollapsible] = React.useState([]);
  const [medicarePartCollapsible, setMedicarePartCollapsible] = React.useState([]);

  const [benefitsLastVerifiedTime, setBenefitsLastVerifiedTime] = React.useState("");
  const [benefitsPullStatus, setBenefitsPullStatus] = React.useState("");
  const [datetimeOfQuery, setDatetimeOfQuery] = React.useState("");
  const [benefitsRefresh, setBenefitsRefresh] = React.useState(false);
  const [benefitsButtonText, setBenefitsButtonText] = React.useState("Refresh");
  const [patientRecordID, setPatientRecordID] = React.useState("");
  const [eligibilityCheck, setEligibilityCheck] = React.useState(false);


  const [contactInfoCollapsible, setContactInfoCollapsible] = React.useState([]);


  const eligibilityArray = () => {
    return EligibilityData.map((row) => (
      <option value={row.value}>{row.displayVal}</option>
    ));
  };

  const setpatientUpdatedData = (key, val) => {
    ////debugger;
    let patientData = { ...toUpdatePatientInfo };
    const regex = new RegExp(
      "/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im"
    );
    const regex1 = new RegExp("^[0-9]+$");

    if (key === "contact_number" && val.length > 12) {
      if (regex.test(val) === false) {
        ToastError("Please enter a valid cell number");
        return;
      }
    }
    if (key === "contact_number" && val.length === 10) {
      val =
        val.substring(0, 3) +
        "-" +
        val.substring(3, 6) +
        "-" +
        val.substring(6, 10);
    }
    if (key === "contact_number" && val.length < 10 && val.length > 0) {
      if (regex1.test(val) === false) {
        ToastError("Please enter a valid cell number");
        val = "";
      }
    }
    patientData[key] = val;
    setEditedFlag(true);
    setUpdatePatientInfo(patientData);
  };

  const fetchPatientDocuments = async (data) => {
    let frontDocument = "";
    let backDocument = "";
    let documents = { ...patientDocuments };
    if (
      data[0].card_front_image_link !== null &&
      data[0].card_front_image_link !== ""
    ) {
      let config = {
        method: "post",
        url: process.env.REACT_APP_BEATS_GET_PATIENT_DOCUMENTS,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("idToken"),
        },
        data: { key: data[0].card_front_image_link },
      };
      try {
        frontDocument = await axios(config);
        documents["front"] = frontDocument.data;
      } catch (error) {
        console.log("Error occurred while fetching patient Document");
      }
    }

    if (
      data[0].card_back_image_link !== null &&
      data[0].card_back_image_link !== ""
    ) {
      let backConfig = {
        method: "post",
        url: process.env.REACT_APP_BEATS_GET_PATIENT_DOCUMENTS,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("idToken"),
        },
        data: { key: data[0].card_back_image_link },
      };
      try {
        backDocument = await axios(backConfig);
        documents["back"] = backDocument.data;
      } catch (error) {
        console.log("Error occurred while fetching patient Document");
      }
    }
    if (frontDocument !== "" || backDocument !== "") {
      setpatientDocuments(documents);
    }
  };

  const updatePatientInfo = () => {
    ////debugger;
    let data = { ...toUpdatePatientInfo };
    if (data.service_type !== "" && data.service_type !== null) {
      data["service_type"] = parseInt(data["service_type"]);
    }
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_UPDATE_PATIENT_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
      data: data,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        //  ////debugger;

        ToastSuccess("Patient record updated successfully.");
        ToastSuccess(
          "Please set the eligibility status to 'Check Pending', if you would like to trigger Eligibility Re-Check"
        );
        setOpenViewMode(false);
        setTabState("view");
        fetchData();
        //setLoading(false);
        setpatientUpdatedData({
          patient_id: "",
          patient_insurance_record_id: "",
          pfname: "",
          dateOfService:
            today.getFullYear() +
            "/" +
            (today.getMonth() + 1) +
            "/" +
            today.getDate(),
          dob:
            today.getFullYear() +
            "/" +
            (today.getMonth() + 1) +
            "/" +
            today.getDate(),
          country_code_label: "US",
          country_code: "",
          contact_number: "",
          email: "",
          payor_external_id: "",
          subId: "",
          network_coverage: "",
          eligibility: "",
          service_type: null,
          comments: "",
          middle_name: "",
          last_name: "",
        });

        setEditedFlag(false);
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        ToastError("Failed To Update Patient Info!");
        setpatientUpdatedData({
          patient_id: "",
          patient_insurance_record_id: "",
          pfname: "",
          dateOfService:
            today.getFullYear() +
            "/" +
            (today.getMonth() + 1) +
            "/" +
            today.getDate(),
          dob:
            today.getFullYear() +
            "/" +
            (today.getMonth() + 1) +
            "/" +
            today.getDate(),
          country_code_label: "US",
          country_code: "",
          contact_number: "",
          email: "",
          payor_external_id: "",
          subId: "",
          network_coverage: "",
          eligibility: "",
          service_type: null,
          comments: "",
          middle_name: "",
          last_name: "",
        });
        console.log(error);
      });
  };

  const calculateAge = (date) => {
    var dob = new Date(date);
    //calculate month difference from current date in time
    var month_diff = Date.now() - dob.getTime();

    //convert the calculated difference in date format
    var age_dt = new Date(month_diff);

    //extract year from date
    var year = age_dt.getUTCFullYear();

    //now calculate the age of the user
    var age = Math.abs(year - 1970);
    return age;
  };

  const patientDelete = (id) => {
    let patient_id = parseInt(id);
    setpatientDeleteId(patient_id);
    handleConfirmOpen();
  };
        
  const handleClickOpen2 = (id) => {
    let data = gridData;
    let patientData = { ...toUpdatePatientInfo };
    let filteredData = data.filter((d) => d.patient_id === id);
    setpatientNoteData([]);
    fetchPatientNotes(id);
    fetchPatientDocuments(filteredData);
    patientData["pfname"] = filteredData[0].first_name;
    patientData["middle_name"] = filteredData[0].middle_name;
    patientData["last_name"] = filteredData[0].last_name;
    patientData["dos"] = filteredData[0].dos;
    patientData["dob"] = filteredData[0].dob;
    patientData["phoneNumber"] = filteredData[0].contact_number;
    patientData["email"] = filteredData[0].email;
    patientData["payer_id"] = filteredData[0].payor_external_id;
    patientData["subscriber_id"] = filteredData[0].subscriber_id;
    patientData["network_coverage"] = filteredData[0].network;
    patientData["eligibility"] = filteredData[0].eligibility;
    patientData["country_code"] = filteredData[0].country_code;
    patientData["coverage_type_id"] = filteredData[0].coverage_type;
    patientData["patient_id"] = filteredData[0].patient_id;
    patientData["patient_insurance_record_id"] = filteredData[0].patient_insurance_record_id;

    console.log(patientData);

    // const attData = JSON.parse(sessionStorage.getItem("attributes"));
    // const nameOfHospital = attData.find(
    //   (x) => x.name === "custom:Organization"
    // ).value;
    // const npi = attData.find((x) => x.name === "custom:NPI").value;






    // if payer_id is empty, then break

    let dob = patientData["dob"].split("T")[0];

    setPatientFName(patientData["pfname"]);
    setPatientLName(patientData["last_name"]);
    setNetworkType(patientData["network_coverage"]);

    // benefitsLambda2(patientData, npi, dob,  nameOfHospital);
    benefitsLambda2(patientData);
    
  };


  const handleClickOpen = (id) => {
    let data = gridData;
    let patientData = { ...toUpdatePatientInfo };
    let filteredData = data.filter((d) => d.patient_id === id);
    setpatientNoteData([]);
    fetchPatientNotes(id);
    fetchPatientDocuments(filteredData);
    patientData["pfname"] = filteredData[0].first_name;
    patientData["middle_name"] = filteredData[0].middle_name;
    patientData["last_name"] = filteredData[0].last_name;
    patientData["dateOfService"] = filteredData[0].dos;
    patientData["dob"] = filteredData[0].dob;
    patientData["contact_number"] = filteredData[0].contact_number;
    patientData["email"] = filteredData[0].email;
    patientData["payor_external_id"] = filteredData[0].payor_external_id;
    patientData["subId"] = filteredData[0].subscriber_id;
    patientData["network_coverage"] = filteredData[0].network;
    patientData["eligibility"] = filteredData[0].eligibility;
    patientData["country_code"] = filteredData[0].country_code;
    patientData["service_type"] = filteredData[0].coverage_type;
    patientData["patient_id"] = filteredData[0].patient_id;
    patientData["patient_insurance_record_id"] =
      filteredData[0].patient_insurance_record_id;
    let viewData = [...viewRecord];
    viewData = filteredData;
    setUpdatePatientInfo(patientData);
    setViewRecord(viewData);
    getImage(
      viewRecord.length > 0
        ? viewRecord[0].card_front_image_link != null
          ? viewRecord[0].card_front_image_link
          : ""
        : ""
    );
    expand("");
    setUploadedFiles([])
    let type = {...documentTypeHistory};
    type['front'] = false;
    type['back'] = false;
    setDocumentTypeHistory(type);
    setOpenViewMode(true);
  };

  const aws = require("aws-sdk");


  const benefitsRefreshLambda = async()=>{


    let data = gridData;
    let patientData = { ...toUpdatePatientInfo };
    let filteredData = data.filter((d) => d.patient_id === patientRecordID);
    console.log(patientRecordID);

    patientData["patient_insurance_record_id"] = parseInt(patientRecordID);
    // patientData["patient_insurance_record_id"] = 191;

    let api_url = process.env.REACT_APP_BEATS_FETCH_BENEFITS_DETAILS;
    // let api_url = "https://b4n7f2pnyb.execute-api.us-east-1.amazonaws.com/dev/patient_benefits_v2_async";
    // let api_url = "https://npsr1z1sf4.execute-api.us-east-2.amazonaws.com/Uat/patient_benefits_v2_async";
    let refresh = "yes";
    

    try{
      // const res = await axios.post(api_url,{"PAYER_ID": payer_id, "PATIENT_FIRST_NAME": patient_first_name, "PATIENT_LAST_NAME": patient_last_name, "MEMBER_ID": member_id,  "PATIENT_BIRTH_DATE":dob,  "PROVIDER_NPI": provider_npi, "SERVICE_TYPE":service_type, "PROVIDER_TYPE": provider_type, "PROVIDER_LAST_NAME": provider_last_name});
      const res = await axios.post(api_url,{"patient_insurance_record_id": patientData["patient_insurance_record_id"], "refresh": refresh});
      console.log(res);

      if(res['status'] == 202){
        setBenefitsRefresh(false);
        setBenefitsButtonText("In Progress");
        setOpenViewMode2(false);
        ToastSuccess("Retrieving latest benefits information, please check back in a few minutes");

      }
      else{
        ToastError("Unable to refresh benefits information. Please try again later.");
      }
    }
    catch{
      console.log("Error with refreshing patient benefits data.");
      ToastError("Unable to refresh benefits information. Please try again later.");
    }



  }

  const benefitsLambda2 = async(patientData)=>{

    // let api_url = "https://npsr1z1sf4.execute-api.us-east-2.amazonaws.com/Uat/patient_benefits_v2_async";
    // let api_url = "https://b4n7f2pnyb.execute-api.us-east-1.amazonaws.com/dev/patient_benefits_v2_async";

    let api_url = process.env.REACT_APP_BEATS_FETCH_BENEFITS_DETAILS;

    let patient_insurance_record_id = parseInt(patientData["patient_insurance_record_id"]);
    console.log(patient_insurance_record_id);
    //For the refresh call
    setPatientRecordID(patientData["patient_insurance_record_id"]);
    console.log(patientRecordID);

    // if(patientData["eligibility"] == "Active Coverage"){
    //   setEligibilityCheck(true);
    // }
    // else{
    //   setEligibilityCheck(false);
    // }
    

    
    // let payer_id = patientData["payer_id"];
    // let patient_first_name = patientData["pfname"].toUpperCase() ;
    // let patient_last_name = patientData["last_name"].toUpperCase();
    // let member_id = patientData["subscriber_id"];
    // if(payer_id == "CMS"){
    //   let patient_dob = "";
    // }
    // else{
    //   let patient_dob = dob;
    // }
    // let provider_npi = npi;//"1194231563";
    let service_type = patientData["coverage_type_id"];
    // let provider_type = "H";
    // let provider_last_name = nameOfHospital;//"TOTAL ORTHOPEDIC PERFORMANCE PHYSICAL THERAPY";

    let serviceConfig = {
      method: "get",
      url: process.env.REACT_APP_BEATS_LIST_SERVICE_TYPE_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
    };

    let service = await axios(serviceConfig);

    for (var j = 0; j < service.data.length; j++) {

      if(service.data[j].service_type_Id == service_type ){

        service_type = service.data[j].service_type_name;
        setServiceName(service.data[j].service_name);
        
      }
    }

    let payerConfig = {
      method: "get",
      url: process.env.REACT_APP_BEATS_GET_PAYER_TYPE_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
    };

    let payer = await axios(payerConfig);

    setPayerName(patientData["payer_id"]);


    for (var i = 0; i < payer.data.length; i++) {
      if(payer.data[i].payor_external_id == patientData["payer_id"]){
        setPayerName(payer.data[i].payor_name);

      }
    }

    try{
      // const res = await axios.post(api_url,{"PAYER_ID": payer_id, "PATIENT_FIRST_NAME": patient_first_name, "PATIENT_LAST_NAME": patient_last_name, "MEMBER_ID": member_id,  "PATIENT_BIRTH_DATE":dob,  "PROVIDER_NPI": provider_npi, "SERVICE_TYPE":service_type, "PROVIDER_TYPE": provider_type, "PROVIDER_LAST_NAME": provider_last_name});
      const res = await axios.post(api_url,{"patient_insurance_record_id": patient_insurance_record_id, "refresh": "no"});
      console.log(res['data']); 

      const response = res['data'];

      if ('meta' in response){
        if('datetimeOfQuery' in response['meta']){
          setDatetimeOfQuery(response['meta']['datetimeOfQuery']);
        }
        if('benefits_last_verified_time' in response['meta']){
          setBenefitsLastVerifiedTime(response['meta']['benefits_last_verified_time']);
          
        }
        if('benefits_pull_status' in response['meta']){
          setBenefitsPullStatus(response['meta']['benefits_pull_status']);
          if(response['meta']['benefits_pull_status'] == "Complete"){
            setBenefitsRefresh(true);
            setBenefitsButtonText("Refresh");
          }
          else{
            setBenefitsRefresh(false);
            setBenefitsButtonText("In Progress");
            setOpenViewMode2(false);
            ToastSuccess("Retrieving latest benefits information, please check back in a few minutes");
            return;
          }
        }
      }
      if ('contactInfo' in response){

        var levelRows = [];
        var levelKey;
        var collapsibleLocal = [];
        var rows;


        for(levelKey in response['contactInfo']){
          
          for(rows in response['contactInfo'][levelKey]){

            console.log(response['contactInfo'][levelKey][rows]);

            levelRows.push(response['contactInfo'][levelKey][rows]);

          }
          var triggerNamePlus = "+ "+levelKey
          var triggerNameMinus = "- "+levelKey
          collapsibleLocal.push(
            <Collapsible trigger={triggerNamePlus} triggerWhenOpen = {triggerNameMinus} triggerStyle =  {{ fontWeight: "bold", color: "gray", textAlign: "left", marginLeft: "1rem" , cursor: "pointer" }}>

            <MaterialTable
                  // title="In-Network Individual Benefits"
                  data={levelRows}
                  columns={contactInfoColumns}
                  options={{ toolbar: false, showTitle: false, search: false, paging: false, filtering: false, exportButton: false }}
            />
              
          </Collapsible>)
          

          collapsibleLocal.push(
            <Grid item xs={12}>
              <Grid className="detail-list" container spacing={2}>
          
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className="details-label">
                    </Grid>
                    <Grid item xs={12} className="details-value">
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>)
            levelRows = [];
          // console.log(collapsible);
          
          
        }

        setContactInfoCollapsible([]);
        setContactInfoCollapsible(collapsibleLocal);



      }
      console.log(response);
      var levelKey;
      var rows;
      var collapsibleLocal = [];
      var collapsibleMedPartLocal = [];
      var partAAvailable = "";
      var partBAvailable = "";
      var partCAvailable = "";
      var partDAvailable = "";

      var levelRows = [];
      var levelPartRows = [];

      const medicarePartData = [
        { title: "Part A", available: medicarePartAAvailable},
        { title: "Part B", available: medicarePartBAvailable },
        { title: "Part C", available: medicarePartCAvailable},
        { title: "Part D", available: medicarePartDAvailable },
      ];

      
      if(response['insurance']['payerId'] == "CMS"){
        setNoDataAvailable(false);
        setMedicareTrigger(true);
        setMedicareAdditionalPayers(response['additionalPayers']);

        
        if ('Medicare Part A' in response['No Network']){
          levelPartRows.push({ title: "Part A", available: "✔"})
        }
        else{
          levelPartRows.push({ title: "Part A", available: ""})
        }
        if ('Medicare Part B' in response['No Network']){
          levelPartRows.push({ title: "Part B", available: "✔"})
        }
        else{
          levelPartRows.push({ title: "Part B", available: ""})
        }
        if ('Medicare Part C' in response['No Network']){
          levelPartRows.push({ title: "Part C", available: "✔"})
        }
        else{
          levelPartRows.push({ title: "Part C", available: ""})
        }
        if ('Medicare Part D' in response['No Network']){
          levelPartRows.push({ title: "Part D", available: "✔"})
        }
        else{
          levelPartRows.push({ title: "Part D", available: ""})
        }
        
        collapsibleMedPartLocal.push(
          <MaterialTable
                            // title="In-Network Individual Benefits"
                            data={levelPartRows}
                            columns={medicarePartTableColumns}
                            options={{ toolbar: false, showTitle: false, search: false, paging: false, filtering: false, exportButton: false }}
          />
        )


        for(levelKey in response['No Network']){
          
          for(rows in response['No Network'][levelKey]){

            console.log(response['No Network'][levelKey][rows]);

            levelRows.push(response['No Network'][levelKey][rows]);

          }
          var triggerNamePlus = "+ "+levelKey
          var triggerNameMinus = "- "+levelKey

          collapsibleLocal.push(
            <Grid item xs={12}>
              <Grid className="detail-list" container spacing={2}>
          
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className="details-label">
                    </Grid>
                    <Grid item xs={12} className="details-value">
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>)

          collapsibleLocal.push(
            <Collapsible trigger={triggerNamePlus} triggerWhenOpen = {triggerNameMinus} triggerStyle =  {{ fontWeight: "bold", color: "gray", textAlign: "left", marginLeft: "1rem" , cursor: "pointer" }}>

            <MaterialTable
                  // title="In-Network Individual Benefits"
                  data={levelRows}
                  columns={medicareTableColumns}
                  options={{ toolbar: false, showTitle: false, search: false, paging: false, filtering: false, exportButton: false }}
            />
              
          </Collapsible>)
          


            levelRows = [];
          // console.log(collapsible);
          
          
        }

        setMedicareCollapsible([]);
        setMedicareCollapsible(collapsibleLocal);

        setMedicarePartCollapsible([]);
        setMedicarePartCollapsible(collapsibleMedPartLocal);



        var collapsibleLocal = [];
        var levelRows = [];

      }
      else if("In Network" in response)
      {
        setNoDataAvailable(false);
        setMedicareTrigger(false);
        for(levelKey in response['Not Applicable Network']){
          
          for(rows in response['Not Applicable Network'][levelKey]){

            console.log(response['Not Applicable Network'][levelKey][rows]);

            levelRows.push(response['Not Applicable Network'][levelKey][rows]);

          }
          var triggerNamePlus = "+ "+levelKey
          var triggerNameMinus = "- "+levelKey
          collapsibleLocal.push(
            <Collapsible trigger={triggerNamePlus} triggerWhenOpen = {triggerNameMinus} triggerStyle =  {{ fontWeight: "bold", color: "gray", textAlign: "left", marginLeft: "1rem" , cursor: "pointer" }}>

            <MaterialTable
                  // title="In-Network Individual Benefits"
                  data={levelRows}
                  columns={benefitsTableColumns}
                  options={{ toolbar: false, showTitle: false, search: false, paging: false, filtering: false, exportButton: false }}
            />
              
          </Collapsible>)
          

          collapsibleLocal.push(
            <Grid item xs={12}>
              <Grid className="detail-list" container spacing={2}>
          
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className="details-label">
                    </Grid>
                    <Grid item xs={12} className="details-value">
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>)
            levelRows = [];
          // console.log(collapsible);
          
          
        }

        setNACollapsible([]);
        setNACollapsible(collapsibleLocal);
        console.log(NACollapsible);

        var collapsibleLocal = [];
        var levelRows = [];

        for(levelKey in response['In Network']){
          
          for(rows in response['In Network'][levelKey]){

            console.log(response['In Network'][levelKey][rows]);

            levelRows.push(response['In Network'][levelKey][rows]);

          }
          var triggerNamePlus = "+ "+levelKey
          var triggerNameMinus = "- "+levelKey
          collapsibleLocal.push(
            <Collapsible trigger={triggerNamePlus} triggerWhenOpen = {triggerNameMinus} triggerStyle =  {{ fontWeight: "bold", color: "gray", textAlign: "left", marginLeft: "1rem" , cursor: "pointer" }}>

            <MaterialTable
                  // title="In-Network Individual Benefits"
                  data={levelRows}
                  columns={benefitsTableColumns}
                  options={{ toolbar: false, showTitle: false, search: false, paging: false, filtering: false, exportButton: false }}
            />
              
          </Collapsible>)

          collapsibleLocal.push(
            <Grid item xs={12}>
              <Grid className="detail-list" container spacing={2}>

                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className="details-label">
                    </Grid>
                    <Grid item xs={12} className="details-value">
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>)
            levelRows = [];
          // console.log(collapsible);
          
          
        }

        setInCollapsible([]);
        setInCollapsible(collapsibleLocal);



        var collapsibleLocal = [];
        var levelRows = [];

        for(levelKey in response['Out of Network']){
          
          for(rows in response['Out of Network'][levelKey]){

            console.log(response['Out of Network'][levelKey][rows]);

            levelRows.push(response['Out of Network'][levelKey][rows]);

          }
          var triggerNamePlus = "+ "+levelKey
          var triggerNameMinus = "- "+levelKey
          collapsibleLocal.push(
            <Collapsible trigger={triggerNamePlus} triggerWhenOpen = {triggerNameMinus} triggerStyle =  {{ fontWeight: "bold", color: "gray", textAlign: "left", marginLeft: "1rem" , cursor: "pointer" }}>

            <MaterialTable
                  // title="In-Network Individual Benefits"
                  data={levelRows}
                  columns={benefitsTableColumns}
                  options={{ toolbar: false, showTitle: false, search: false, paging: false, filtering: false, exportButton: false }}
            />
              
          </Collapsible>

          
          
          )
          collapsibleLocal.push(
            <Grid item xs={12}>
              <Grid className="detail-list" container spacing={2}>

                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className="details-label">
                    </Grid>
                    <Grid item xs={12} className="details-value">
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            )
            levelRows = [];

          // console.log(collapsible);
          
          
        }

        setOutCollapsible([]);
        setOutCollapsible(collapsibleLocal);


        var collapsibleLocal = [];
        var levelRows = [];

        for(levelKey in response['No Network']){
          
          for(rows in response['No Network'][levelKey]){

            console.log(response['No Network'][levelKey][rows]);

            levelRows.push(response['No Network'][levelKey][rows]);

          }
          var triggerNamePlus = "+ "+levelKey
          var triggerNameMinus = "- "+levelKey
          collapsibleLocal.push(
            <Collapsible trigger={triggerNamePlus} triggerWhenOpen = {triggerNameMinus} triggerStyle =  {{ fontWeight: "bold", color: "gray", textAlign: "left", marginLeft: "1rem" , cursor: "pointer" }}>

            <MaterialTable
                  // title="In-Network Individual Benefits"
                  data={levelRows}
                  columns={benefitsTableColumns}
                  options={{ toolbar: false, showTitle: false, search: false, paging: false, filtering: false, exportButton: false }}
            />
              
          </Collapsible>

        )

        collapsibleLocal.push(
          <Grid item xs={12}>
            <Grid className="detail-list" container spacing={2}>

              <Grid item xs={6}>
                <Grid container spacing={1}>
                  <Grid item xs={12} className="details-label">
                  </Grid>
                  <Grid item xs={12} className="details-value">
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>)
          levelRows = [];
          // console.log(collapsible);
          
          
        }

        setNoCollapsible([]);
        setNoCollapsible(collapsibleLocal);

        var collapsibleLocal = [];
        var levelRows = [];

        if('Specialty' in response){
        
        console.log(response['Specialty']);

        for(levelKey in response['Specialty']){
          
          for(rows in response['Specialty'][levelKey]){

            console.log(response['Specialty'][levelKey][rows]);

            levelRows.push(response['Specialty'][levelKey][rows]);

          }
          var triggerNamePlus = "+ "+levelKey
          var triggerNameMinus = "- "+levelKey
          collapsibleLocal.push(
            <Collapsible trigger={triggerNamePlus} triggerWhenOpen = {triggerNameMinus} triggerStyle =  {{ fontWeight: "bold", color: "gray", textAlign: "left", marginLeft: "1rem" , cursor: "pointer" }}>

            <MaterialTable
                  // title="In-Network Individual Benefits"
                  data={levelRows}
                  columns={benefitsSpecialtyTableColumns}
                  options={{ toolbar: false, showTitle: false, search: false, paging: false, filtering: false, exportButton: false }}
            />
              
          </Collapsible>

        )

        collapsibleLocal.push(
          <Grid item xs={12}>
            <Grid className="detail-list" container spacing={2}>

              <Grid item xs={6}>
                <Grid container spacing={1}>
                  <Grid item xs={12} className="details-label">
                  </Grid>
                  <Grid item xs={12} className="details-value">
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>)
          levelRows = [];
          // console.log(collapsible);
          
          
        }
      }

        // if('Specialty' in response){
          
        //   for(rows in response['Specialty']){

        //     console.log(response['Specialty'][rows]);

        //     levelRows.push(response['Specialty'][rows]);

        //   }
        //   var triggerNamePlus = "+ Specialty"
        //   var triggerNameMinus = "- Specialty"


        //   collapsibleLocal.push(
        //     <Collapsible trigger={triggerNamePlus} triggerWhenOpen = {triggerNameMinus} triggerStyle =  {{ fontWeight: "bold", color: "gray", textAlign: "left", marginLeft: "0rem" , cursor: "pointer" }}>

        //     <MaterialTable
        //           // title="In-Network Individual Benefits"
        //           data={levelRows}
        //           columns={benefitsSpecialtyTableColumns}
        //           options={{ toolbar: false, showTitle: false, search: false, paging: false, filtering: false, exportButton: false }}
        //     />
              
        //   </Collapsible>

        // )


        //   levelRows = [];
        //   // console.log(collapsible);
          
          
        // }

        setSpecialtyCollapsible([]);
        setSpecialtyCollapsible(collapsibleLocal);

    }
    else{

      setNoDataAvailable(true);
      setMedicareTrigger(false);


    }

      setOpenViewMode2(true);
    }
    catch{
      console.log("error");

      setNoDataAvailable(true);
      setMedicareTrigger(false);
      setOpenViewMode2(true);

      //return different component, also for medicare
    }



  
  }
        

  const getImage = (urlString) => {
    if (urlString === "") {
      return;
    }
    
    aws.config.setPromisesDependency(); //use so you can promisify to get the actual images
    aws.config.update({
      accessKeyId: process.env.REACT_APP_S3_ACCESS_ID,
      secretAccessKey: process.env.REACT_APP_S3_ACCESS_SECRET,
      region: process.env.REACT_APP_S3_REGION,
    });

    const s3 = new aws.S3();

    var params = { Bucket: process.env.REACT_APP_S3_BUCKET, Key: urlString };
    var promise = s3.getSignedUrlPromise("getObject", params);
    promise.then(
      function (url) {
        setFrontImage(url);
      },
      function (err) {
        console.log(err);
        return "";
      }
    );
  };

  const handleClose = (value) => {
    if (tabState !== "view" && editedFlag === true) {
      ToastError(
        "Please hit save to update record or cancel to discard changes"
      );
      return;
    }
    setpatientDocuments({ front: "", back: "" });
    setpatientNoteData([]);
    setOpenViewMode(false);
    setOpenViewMode2(false);
    setTabState("view");
  };

  const discardChanges = () => {
    setTabState("view");
    setpatientUpdatedData({
      patient_id: "",
      patient_insurance_record_id: "",
      pfname: "",
      dateOfService:
        today.getFullYear() +
        "/" +
        (today.getMonth() + 1) +
        "/" +
        today.getDate(),
      dob:
        today.getFullYear() +
        "/" +
        (today.getMonth() + 1) +
        "/" +
        today.getDate(),
      country_code_label: "US",
      country_code: "",
      contact_number: "",
      email: "",
      payor_external_id: "",
      subId: "",
      network_coverage: "",
      eligibility: "",
      service_type: null,
      comments: "",
      middle_name: "",
      last_name: "",
    });
    setUploadedFiles([])
    let type = {...documentTypeHistory};
    type['front'] = false;
    type['back'] = false;
    setDocumentTypeHistory(type);
    setEditedFlag(false);
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      textAlign: "left",
      borderBottom: "1px dotted pink",
      padding: 20,
      fontSize: 14,
      color: "black",
    }),
  };

  const expand = (id) => {
    selectedExpand(id);
  };

  const onFileChangeNew = async(docTypeInt, event) => {
    ////debugger;
    if (event.target.files.length === 0) {
      let type = {...documentTypeHistory};
      if(docTypeInt==="1") {
        type['front'] = false;
      }else if(docTypeInt==="2"){
        type['back'] = false;
      }else{
        type['combined'] = false;
      }
      setDocumentTypeHistory(type);
      return;
    }

    const imgPreview = docTypeInt === "1" ? document.getElementById("img1-preview") : document.getElementById("img2-preview");
    const imgfiles = event.target.files[0];
    if (imgfiles) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(imgfiles);
      fileReader.addEventListener("load", function () {
        imgPreview.style.display = "block";
        imgPreview.innerHTML = '<img src="' + this.result + '" />';
      });    
    }
  
    const fileinfonew = {
      filename: event.target.files[0].name,
      fileInfo: event.target.files[0],
    };
    const filedata = [...uploadedFiles];
    filedata.push(fileinfonew);
    var data = new FormData();
    const result = await toBase64(event.target.files[0]).catch(e => Error(e));
    if(result instanceof Error) {
      console.log('Error: ', result.message);
      return;
    }
    let filename = event.target.files[0].name;
    // convertedFile = result.replace(/^data:image\/\w+;base64,/, "")
    let convertedFile = result.split(',')[1];
    data.append("file", convertedFile);
    let fileData = {
      "fileData": convertedFile
    }
    setUploadedFiles([])
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_MANUALOBONARDING_PATIENT_DOCUMENT_UPLOAD_API,
      headers: {
        "Content-Type": "application/json",
        filename: filename,
        patientId: parseInt(toUpdatePatientInfo["patient_id"]),
        "type-of-side": docTypeInt,
        "type-of-file": event.target.files[0].type,
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
      data: fileData
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        setEditedFlag(true);
        setLoading(false);
        let documents = { ...patientDocuments };
        let type = {...documentTypeHistory};
        if(docTypeInt==="1"){
          type['front'] = true;
          documents["front"] = "";
          ToastSuccess("Successfully uploaded frontside image");
        }else if(docTypeInt==="2"){
          type['back'] = true;
          documents["back"] = "";
          ToastSuccess("Successfully uploaded backside image");
        }else{
          type['combined'] = true;
          documents["front"] = "";
          documents["back"] = "";
          ToastSuccess("Successfully uploaded frontside and backside image");
        }
        setDocumentTypeHistory(type);
        setpatientDocuments(documents);
    })
    .catch(function (error) {
      setLoading(false);
      ToastError("Failed To upload document!");
      console.log(error);
    });
    setUploadedFiles(filedata);
  };

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const fetchData = async () => {
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_FETCH_ONBOARDED_PATIENTS,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
    };
    let payerConfig = {
      method: "get",
      url: process.env.REACT_APP_BEATS_GET_PAYER_TYPE_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
    };

    let serviceConfig = {
      method: "get",
      url: process.env.REACT_APP_BEATS_LIST_SERVICE_TYPE_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
    };
    setLoading(true);
    try {
      let patientData = await axios(config);
      let patientGridata = [...gridData];
      patientGridata = patientData.data;
      let payer = await axios(payerConfig);
      let service = await axios(serviceConfig);
      let optionsData = [];
      let serviceData = [];

      for (var i = 0; i < payer.data.length; i++) {
        let obj = {
          value: payer.data[i].payor_external_id,
          label:
            payer.data[i].payor_external_id + " - " + payer.data[i].payor_name,
        };
        optionsData.push(obj);
      }
      for (var j = 0; j < service.data.length; j++) {
        let objval = {
          value: service.data[j].service_type_Id,
          label: service.data[j].service_name,
        };
        serviceData.push(objval);
      }
      setAttributeData({ payer: optionsData, servicetype: serviceData });
      setGridData(patientGridata);
      setSearchedFlag(false);
      setLoading(false);
    } catch (error) {
      // //debugger;
      setLoading(false);
      ToastError("Failed To Fetch Patient Information!");
      console.log(error);
    }
    /* axios(config)
      .then(function (response) {
        setLoading(false);
        setGridData(response.data);
        // ToastSuccess("Successfully onboarded");
      })
      .catch(function (error) {
        setLoading(false);
        ToastError("Failed to fetch patient info");
        console.log(error);
      });*/
  };

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseImageModal = () => {
    setImageModal({
      image: "",
      isModalOpen: false,
    });
  };


  return (
    <div className={classes.root}>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <CssBaseline />
      <ToastContainer />
      <ImagePreview
        open={imageModal.isModalOpen}
        img={imageModal.image}
        handleClose={handleCloseImageModal}
      />
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
        </div>

        <LeftsideMenu />
      </Drawer>
      <main id="maindiv" className={classes.content}>
        <div>
          <NotesDialog
            open={notesCompOpen}
            saveNotes={saveNotes}
            closeNotes={() => openNotes(false)}
          />
          <Dialog
            open={confirmOpen}
            onClose={handleConfirmClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this patient?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleConfirmClose} color="primary" autoFocus>
                No
              </Button>
              <Button onClick={handleConfirmDelete} color="primary">
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        <div className={classes.root}>
          <Grid container spacing={3}>

        
                            
          {noDataAvailable ? ( 
                <Dialog
                className="mainpopup2"
                maxWidth={"sm"}
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={openViewModel2}
                scroll="paper"
                style={{ margin: "auto", left: "0!important" }}
              >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Coverage/Benefits 
                </DialogTitle>
                
                <DialogContent dividers>
                  <Paper elevation={0}>
                    <Grid container spacing={3} justify="center">
                      <Grid item xs={12}>
                        <Grid container spacing={1} justify="center">
                          <Grid item xs={6}>
                            <Grid
                              container
                              spacing={2}
                              justify="center"
                              alignItems="center"
                              className="detail-list"
                            >
                              <Grid
                                item
                                xs={12}
                                justify="center"
                                className="details-label"
                              >
                                Patient Name
                              </Grid>
                              <Grid item xs={12} className="details-value">
                                <span>
                                    {patientFName} {patientLName}
                                </span>

                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={6}>
                            <Grid container className="detail-list" spacing={1}>
                              <Grid
                                item
                                xs={12}
                                justify="center"
                                className="details-label"
                              >
                              Network Type
                              </Grid>
                              <Grid item xs={12} className="details-value">
                                <div>
                              {networkType}
                                </div>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid className="detail-list" container spacing={2}>
                          <Grid item xs={6}>
                            <Grid container spacing={1}>
                              <Grid item xs={12} className="details-label">
                              Payer Name
                              </Grid>
                              <Grid item xs={12} className="details-value">
                              {payerName}
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={6}>
                            <Grid container spacing={1}>
                              <Grid item xs={12} className="details-label">
                              Service Type
                              </Grid>
                              <Grid item xs={12} className="details-value">
                              {serviceName}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      </Grid>
                      <Divider variant="middle" className="dividercls" />

                      <Grid item xs={12}>
                        <Grid className="detail-list" container spacing={2}>
                    
                          <Grid item xs={6}>
                            <Grid container spacing={1}>
                              <Grid item xs={12} className="details-label">
                              </Grid>
                              <Grid item xs={12} className="details-value">
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>

                        <Grid item xs={12}>
                        <Grid className="detail-list" container spacing={2}>
                    
                          <Grid item xs={6}>
                            <Grid container spacing={1}>
                              <Grid item xs={12} className="details-label">
                                  No Benefit Information Available
                              </Grid>
                              <Grid item xs={12} className="details-value">
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Divider variant="middle" className="dividercls" />
                  <Collapsible trigger="+ Contact Info"  triggerWhenOpen= "- Contact Info" triggerStyle =  {{ fontWeight: "bold", color: "gray", textAlign: "left", marginLeft: "0rem" , cursor: "pointer"  }}>
                    
                    <Grid item xs={12}>
                      <Grid className="detail-list" container spacing={2}>
                  
                        <Grid item xs={6}>
                          <Grid container spacing={1}>
                            <Grid item xs={12} className="details-label">
                            </Grid>
                            <Grid item xs={12} className="details-value">
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    {contactInfoCollapsible}
                    

                </Collapsible>

                <Divider variant="middle" className="dividercls" />


                <Grid
                  className="detail-list"
                  container
                  spacing={3}
                  justify="center"
                >
                  <Grid item xs={6}>
                    <Grid
                      container
                      spacing={1}
                      style={{
                        display: tabState === "view" ? "none" : "flex",
                      }}
                    >
                      <Button
                        variant="contained"
                        className="btn-primary"
                        onClick={discardChanges}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </DialogContent>
              </Dialog>):(
                <div>
                  {!medicareTrigger ? (
                <Dialog
                className="mainpopup2"
                maxWidth={"sm"}
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={openViewModel2}
                scroll="paper"
                style={{ margin: "auto", left: "0!important" }}
              >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Coverage/Benefits 
                </DialogTitle>
                
                <DialogContent dividers>
                  <Paper elevation={0}>
                    <Grid container spacing={3} justify="center">
                      <Grid item xs={12}>
                        <Grid container spacing={1} justify="center">
                          <Grid item xs={6}>
                            <Grid
                              container
                              spacing={2}
                              justify="center"
                              alignItems="center"
                              className="detail-list"
                            >
                              <Grid
                                item
                                xs={12}
                                justify="center"
                                className="details-label"
                              >
                                Patient Name
                              </Grid>
                              <Grid item xs={12} className="details-value">
                                <span>
                                    {patientFName} {patientLName}
                                </span>

                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={6}>
                            <Grid container className="detail-list" spacing={1}>
                              <Grid
                                item
                                xs={12}
                                justify="center"
                                className="details-label"
                              >
                              Network Type
                              </Grid>
                              <Grid item xs={12} className="details-value">
                                <div>
                              {networkType}
                                </div>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid className="detail-list" container spacing={2}>
                          <Grid item xs={6}>
                            <Grid container spacing={1}>
                              <Grid item xs={12} className="details-label">
                              Payer Name
                              </Grid>
                              <Grid item xs={12} className="details-value">
                                {payerName}
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={6}>
                            <Grid container spacing={1}>
                              <Grid item xs={12} className="details-label">
                              Service Type
                              </Grid>
                              <Grid item xs={12} className="details-value">
                              {serviceName}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid className="detail-list" container spacing={2}>
                          <Grid item xs={6}>
                            <Grid container spacing={1}>
                              <Grid item xs={12} className="details-label">
                              Last Verified Date
                              </Grid>
                              <Grid item xs={12} className="details-value">
                                {benefitsLastVerifiedTime}
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={6}>
                            <Grid container spacing={1}>
                              <Grid item xs={12} className="details-label">
                              </Grid>
                              <Grid item xs={12} className="details-value">
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      </Grid>
                      <Divider variant="middle" className="dividercls" />
                  <Collapsible trigger="+ In Network"  triggerWhenOpen= "- In Network" triggerStyle =  {{ fontWeight: "bold", color: "gray", textAlign: "left", marginLeft: "0rem" , cursor: "pointer"  }}>
                    
                      <Grid item xs={12}>
                        <Grid className="detail-list" container spacing={2}>
                    
                          <Grid item xs={6}>
                            <Grid container spacing={1}>
                              <Grid item xs={12} className="details-label">
                              </Grid>
                              <Grid item xs={12} className="details-value">
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>

                      {inCollapsible}
                      

                  </Collapsible>

                  <Divider variant="middle" className="dividercls" />

                  <Collapsible trigger="+ Out-of-Network" triggerWhenOpen = "- Out-of-Network" triggerStyle =  {{ fontWeight: "bold", color: "gray", textAlign: "left", marginLeft: "0rem" , cursor: "pointer"  }}>
                    
                    <Grid item xs={12}>
                      <Grid className="detail-list" container spacing={2}>
                  
                        <Grid item xs={6}>
                          <Grid container spacing={1}>
                            <Grid item xs={12} className="details-label">
                            </Grid>
                            <Grid item xs={12} className="details-value">
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    {outCollapsible}

                </Collapsible>

                <Divider variant="middle" className="dividercls" />

                <Collapsible trigger="+ Not-Applicable-Network (common to both networks)" triggerWhenOpen = "- Not-Applicable-Network (common to both networks)" triggerStyle =  {{ fontWeight: "bold", color: "gray", textAlign: "left", marginLeft: "0rem" , cursor: "pointer"  }}>
                  
                  <Grid item xs={12}>
                    <Grid className="detail-list" container spacing={2}>

                      <Grid item xs={6}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} className="details-label">
                          </Grid>
                          <Grid item xs={12} className="details-value">
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  {NACollapsible}

                </Collapsible>
                <Divider variant="middle" className="dividercls" />

                <Collapsible trigger="+ No Network" triggerWhenOpen = "- No Network" triggerStyle =  {{ fontWeight: "bold", color: "gray", textAlign: "left", marginLeft: "0rem" , cursor: "pointer"  }}>
                  
                  <Grid item xs={12}>
                    <Grid className="detail-list" container spacing={2}>

                      <Grid item xs={6}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} className="details-label">
                          </Grid>
                          <Grid item xs={12} className="details-value">
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  {noCollapsible}

                </Collapsible>
                
              
                  <Divider variant="middle" className="dividercls" />
                  <Collapsible trigger="+ Specialty" triggerWhenOpen = "- Specialty" triggerStyle =  {{ fontWeight: "bold", color: "gray", textAlign: "left", marginLeft: "0rem" , cursor: "pointer"  }}>
                  
                  <Grid item xs={12}>
                    <Grid className="detail-list" container spacing={2}>

                      <Grid item xs={6}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} className="details-label">
                          </Grid>
                          <Grid item xs={12} className="details-value">
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  {specialtyCollapsible}

                  </Collapsible>

          <Divider variant="middle" className="dividercls" />

          <Collapsible trigger="+ Contact Info"  triggerWhenOpen= "- Contact Info" triggerStyle =  {{ fontWeight: "bold", color: "gray", textAlign: "left", marginLeft: "0rem" , cursor: "pointer"  }}>
                    
                    <Grid item xs={12}>
                      <Grid className="detail-list" container spacing={2}>
                  
                        <Grid item xs={6}>
                          <Grid container spacing={1}>
                            <Grid item xs={12} className="details-label">
                            </Grid>
                            <Grid item xs={12} className="details-value">
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    {contactInfoCollapsible}
                    

              </Collapsible>

              <Divider variant="middle" className="dividercls" />

          <Button
            variant="contained"
            className=  {
              benefitsRefresh ? "btn-primary" : "btn-disabled"
            }
            disabled = {!benefitsRefresh}
            onClick =  {()=> {benefitsRefreshLambda(); }}
            // onClick={benefitsRefreshLambda()}
            style={{ marginLeft: "11rem"}}
          >
                            {benefitsButtonText}
          </Button>

                    <Grid
                      className="detail-list"
                      container
                      spacing={3}
                      justify="center"
                    >
                      <Grid item xs={6}>
                        <Grid
                          container
                          spacing={1}
                          style={{
                            display: tabState === "view" ? "none" : "flex",
                          }}
                        >
                          <Button
                            variant="contained"
                            className="btn-primary"
                            onClick={discardChanges}
                          >
                            Cancel
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </DialogContent>
            </Dialog>

          ):(<Dialog
            className="mainpopup2"
            maxWidth={"sm"}
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openViewModel2}
            scroll="paper"
            style={{ margin: "auto", left: "0!important" }}
          >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
             Coverage/Benefits 
            </DialogTitle>
            
            <DialogContent dividers>
              <Paper elevation={0}>
              

                <Grid container spacing={3} justify="center">

                  <Grid item xs={12}>
                    <Grid container spacing={1} justify="center">
                      <Grid item xs={6}>
                        <Grid
                          container
                          spacing={2}
                          justify="center"
                          alignItems="center"
                          className="detail-list"
                        >
                          <Grid
                            item
                            xs={12}
                            justify="center"
                            className="details-label"
                          >
                            Patient Name
                          </Grid>
                          <Grid item xs={12} className="details-value">
                            <span>
                                {patientFName} {patientLName}
                            </span>

                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <Grid container className="detail-list" spacing={1}>
                          <Grid
                            item
                            xs={12}
                            justify="center"
                            className="details-label"
                          >
                          Network Type
                          </Grid>
                          <Grid item xs={12} className="details-value">
                            <div>
                            {networkType}
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid className="detail-list" container spacing={2}>
                      <Grid item xs={6}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} className="details-label">
                          Payer Name
                          </Grid>
                          <Grid item xs={12} className="details-value">
                            {payerName}  
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} className="details-label">
                          Service Type 
                          </Grid>
                          <Grid item xs={12} className="details-value">
                          {serviceName}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid className="detail-list" container spacing={2}>
                      <Grid item xs={6}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} className="details-label">
                          Additional Plans
                          </Grid>
                          <Grid item xs={12} className="details-value">
                          {medicareAdditionalPayers}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} className="details-label">
                          Last Verified Date
                          </Grid>
                          <Grid item xs={12} className="details-value">
                          {benefitsLastVerifiedTime}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  </Grid>
                  <Divider variant="middle" className="dividercls" />

                  {medicarePartCollapsible}

                  <Divider variant="middle" className="dividercls" />

              <Collapsible trigger="+ Medicare Parts" triggerWhenOpen = "- Medicare Parts" triggerStyle =  {{ fontWeight: "bold", color: "gray", textAlign: "left", marginLeft: "0rem" , cursor: "pointer" }}>
                
                {medicareCollapsible}

              </Collapsible>

              <Divider variant="middle" className="dividercls" />

              <Collapsible trigger="+ Contact Info"  triggerWhenOpen= "- Contact Info" triggerStyle =  {{ fontWeight: "bold", color: "gray", textAlign: "left", marginLeft: "0rem" , cursor: "pointer"  }}>
                    
                    <Grid item xs={12}>
                      <Grid className="detail-list" container spacing={2}>
                  
                        <Grid item xs={6}>
                          <Grid container spacing={1}>
                            <Grid item xs={12} className="details-label">
                            </Grid>
                            <Grid item xs={12} className="details-value">
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    {contactInfoCollapsible}
                    

              </Collapsible>

              <Divider variant="middle" className="dividercls" />

              <Button
                variant="contained"
                className=  {
                  benefitsRefresh ? "btn-primary" : "btn-disabled"
                }
                disabled = {!benefitsRefresh}
                onClick =  {()=> {benefitsRefreshLambda(); }}
                // onClick={benefitsRefreshLambda()}
                style={{ marginLeft: "11rem"}}
              >
                                {benefitsButtonText}
              </Button>
          
              
      <Divider variant="middle" className="dividercls" />
                <Grid
                  className="detail-list"
                  container
                  spacing={3}
                  justify="center"
                >
                  <Grid item xs={6}>
                    <Grid
                      container
                      spacing={1}
                      style={{
                        display: tabState === "view" ? "none" : "flex",
                      }}
                    >
                      <Button
                        variant="contained"
                        className="btn-primary"
                        onClick={discardChanges}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </DialogContent>
  </Dialog>)}
  </div>)}

            <Dialog
              className="mainpopup"
              maxWidth={"sm"}
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={openViewModel}
              scroll="paper"
              style={{ margin: "auto", left: "0!important" }}
            >
              <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Patient Details {viewRecord.length > 0
                                  ? "(#" + viewRecord[0].patient_id + ")"
                                  : ""}
              </DialogTitle>

              <DialogContent dividers>
                <Paper elevation={0}>
                  <Grid container spacing={3} justify="center">
                    <Grid item xs={12}>
                      <Grid container spacing={1} justify="center">
                        <Grid item xs={6}>
                          <Grid
                            container
                            spacing={2}
                            justify="center"
                            alignItems="center"
                            className="detail-list"
                          >
                            <Grid item xs={6}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              Patient Full Name
                            </Grid>
                            <Grid item xs={6}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              <CreateSharpIcon
                                style={{
                                  display:
                                    tabState !== "view" ? "none" : "block",
                                }}
                                onClick={() => setTabState("edit")}
                              ></CreateSharpIcon>
                            </Grid>
                            <Grid item xs={12} className="details-value">
                              <span
                                style={{
                                  display:
                                    tabState !== "view" ? "none" : "block",
                                }}
                              >
                                {viewRecord.length > 0
                                  ? viewRecord[0].first_name +
                                    " " +
                                    viewRecord[0].middle_name +
                                    " " +
                                    viewRecord[0].last_name
                                  : ""}
                              </span>
                              <BootstrapInput
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                                className="primary-input mb20 width100p"
                                placeholder="First Name"
                                value={toUpdatePatientInfo.pfname}
                                onChange={(e) => {
                                  setpatientUpdatedData(
                                    "pfname",
                                    e.target.value
                                  );
                                }}
                              />
                              <BootstrapInput
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                                className="primary-input mb20 width100p"
                                placeholder="Middle Name"
                                value={toUpdatePatientInfo.middle_name}
                                onChange={(e) => {
                                  setpatientUpdatedData(
                                    "middle_name",
                                    e.target.value
                                  );
                                }}
                              />
                              <BootstrapInput
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                                className="primary-input mb20 width100p"
                                placeholder="Last Name"
                                value={toUpdatePatientInfo.last_name}
                                onChange={(e) => {
                                  setpatientUpdatedData(
                                    "last_name",
                                    e.target.value
                                  );
                                }}
                              ></BootstrapInput>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={6}>
                          <Grid container className="detail-list" spacing={1}>
                            <Grid item xs={6}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              Date of Service
                            </Grid>
                            <Grid item xs={6}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              <CreateSharpIcon
                                style={{
                                  display:
                                    tabState !== "view" ? "none" : "block",
                                }}
                                onClick={() => setTabState("edit")}
                              ></CreateSharpIcon>
                            </Grid>
                            <Grid item xs={12} className="details-value">
                              <div
                                style={{
                                  display:
                                    tabState !== "view" ? "none" : "block",
                                }}
                              >
                                {viewRecord.length > 0
                                  ? viewRecord[0].dos !==
                                      "0000-00-00 00:00:00" &&
                                    viewRecord[0].dos !== null
                                    ? viewRecord[0].dos
                                        .split("T")[0]
                                        .split("-")[1] +
                                      "/" +
                                      viewRecord[0].dos
                                        .split("T")[0]
                                        .split("-")[2] +
                                      "/" +
                                      viewRecord[0].dos
                                        .split("T")[0]
                                        .split("-")[0]
                                    : ""
                                  : ""}
                              </div>
                              <div
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                              >
                                <Datepickermod
                                  value={
                                    (toUpdatePatientInfo.dateOfService === null || toUpdatePatientInfo.dateOfService === "0000-00-00 00:00:00")
                                      ? new Date()
                                      : (toUpdatePatientInfo.dateOfService.length === 20 || toUpdatePatientInfo.dateOfService.length === 24) ? toUpdatePatientInfo.dateOfService.split("T")[0]+"T12:00:00Z" : toUpdatePatientInfo.dateOfService
                                  }
                                  label={"Date of Service"}
                                  minDate={Date.now()}
                                  dateChanged={(val) => {
                                    setpatientUpdatedData("dateOfService", val);
                                  }}
                                />
                              </div>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid className="detail-list" container spacing={2}>
                        <Grid item xs={6}>
                          <Grid container spacing={1}>
                            <Grid item xs={6}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              Date of Birth (dd/mm/yyyy)
                            </Grid>
                            <Grid item xs={6}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              <CreateSharpIcon
                                style={{
                                  display:
                                    tabState !== "view" ? "none" : "block",
                                }}
                                onClick={() => setTabState("edit")}
                              ></CreateSharpIcon>
                            </Grid>
                            <Grid item xs={12} className="details-value">
                              <div
                                style={{
                                  display:
                                    tabState !== "view" ? "none" : "block",
                                }}
                              >
                                {viewRecord.length > 0
                                  ? viewRecord[0].dob !==
                                      "0000-00-00 00:00:00" &&
                                    viewRecord[0].dob !== null
                                    ? viewRecord[0].dob
                                        .split("T")[0]
                                        .split("-")[1] +
                                      "/" +
                                      viewRecord[0].dob
                                        .split("T")[0]
                                        .split("-")[2] +
                                      "/" +
                                      viewRecord[0].dob
                                        .split("T")[0]
                                        .split("-")[0]
                                    : ""
                                  : ""}
                              </div>
                              <div
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                              >
                                <Datepickermod
                                  value={
                                    (toUpdatePatientInfo.dob === null || toUpdatePatientInfo.dob === "0000-00-00 00:00:00")
                                      ? new Date()
                                      : (toUpdatePatientInfo.dob.length === 20 || toUpdatePatientInfo.dob.length === 24) ? toUpdatePatientInfo.dob.split("T")[0]+"T12:00:00Z" : toUpdatePatientInfo.dob
                                  }
                                  label={"DOB"}
                                  maxDate={Date.now()}
                                  dateChanged={(val) => {
                                    setpatientUpdatedData("dob", val);
                                  }}
                                />
                              </div>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={6}>
                          <Grid container spacing={1}>
                            <Grid item xs={12} className="details-label">
                              Age
                            </Grid>
                            <Grid item xs={12} className="details-value">
                              {viewRecord.length > 0
                                ? (viewRecord[0].dob !== "0000-00-00 00:00:00" && viewRecord[0].dob !== null)
                                  ? calculateAge(viewRecord[0].dob)
                                  : ""
                                : ""}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid className="detail-list" container spacing={2}>
                        <Grid item xs={6} spacing={3}>
                          <Grid container spacing={1}>
                            <Grid item xs={6}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              Contact Number
                            </Grid>
                            <Grid item xs={6}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              <CreateSharpIcon
                                style={{
                                  display:
                                    tabState !== "view" ? "none" : "block",
                                }}
                                onClick={() => setTabState("edit")}
                              ></CreateSharpIcon>
                            </Grid>
                            <Grid item xs={12} className="details-value">
                              <div
                                style={{
                                  display:
                                    tabState !== "view" ? "none" : "block",
                                }}
                              >
                                {viewRecord.length > 0
                                  ? viewRecord[0].contact_number.length === 10
                                    ? viewRecord[0].contact_number.substring(
                                        0,
                                        3
                                      ) +
                                      "-" +
                                      viewRecord[0].contact_number.substring(
                                        3,
                                        6
                                      ) +
                                      "-" +
                                      viewRecord[0].contact_number.substring(
                                        6,
                                        10
                                      )
                                    : viewRecord[0].contact_number
                                  : ""}
                              </div>
                              <BootstrapInput
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                                className="primary-input mb20 width100p"
                                placeholder="Phone Number"
                                value={toUpdatePatientInfo.contact_number}
                                onChange={(e) => {
                                  setpatientUpdatedData(
                                    "contact_number",
                                    e.target.value
                                  );
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={6}>
                          <Grid container spacing={1}>
                            <Grid item xs={3}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              Email
                            </Grid>
                            <Grid item xs={9}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              <CreateSharpIcon
                                style={{
                                  display:
                                    tabState !== "view" ? "none" : "block",
                                }}
                                onClick={() => setTabState("edit")}
                              ></CreateSharpIcon>
                            </Grid>
                            <Grid item xs={12} className="details-value">
                              <div
                                style={{
                                  display:
                                    tabState !== "view" ? "none" : "block",
                                }}
                              >
                                {viewRecord.length > 0
                                  ? viewRecord[0].email
                                  : ""}
                              </div>
                              <BootstrapInput
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                                className="primary-input mb20 width100p"
                                placeholder="Email"
                                value={toUpdatePatientInfo.email}
                                onChange={(e) => {
                                  setpatientUpdatedData(
                                    "email",
                                    e.target.value
                                  );
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Divider variant="middle" className="dividercls" />

                  <Grid container spacing={3} justify="center">
                    <Grid item xs={12}>
                      <Grid
                        className="detail-list"
                        container
                        spacing={1}
                        justify="center"
                      >
                        <Grid item xs={2}
                          className="details-label"
                          style={{ color: "#828282" }}
                        >
                          Insurance Details
                        </Grid>
                        <Grid item xs={10}
                          className="details-label"
                          style={{ color: "#828282" }}
                        >
                          <CreateSharpIcon
                            style={{
                              display:
                                tabState !== "view" ? "none" : "block",
                            }}
                            onClick={() => setTabState("edit")}
                          ></CreateSharpIcon>
                        </Grid>
                        <Grid item xs={12}>
                          <div
                            className="details-value"
                            style={{
                              display: tabState !== "view" ? "none" : "block",
                            }}
                          >
                            {viewRecord.length > 0
                              ? viewRecord[0].payor_name
                              : ""}
                          </div>
                          <div
                            style={{
                              display: tabState === "view" ? "none" : "block",
                            }}
                          >
                            <Select
                              isVisible={tabState === "view" ? true : false}
                              onChange={(selectedOption) => {
                                setpatientUpdatedData(
                                  "payor_external_id",
                                  selectedOption.value
                                );
                              }}
                              styles={customStyles}
                              options={attributeData.payer}
                              value={attributeData.payer.filter(
                                (option) =>
                                  option.value ===
                                  toUpdatePatientInfo["payor_external_id"]
                              )}
                            />
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid
                        className="detail-list"
                        container
                        spacing={1}
                        justify="center"
                      >
                        <Grid item xs={2}
                          className="details-label"
                          style={{ color: "#828282" }}
                        >
                          Member ID
                        </Grid>
                        <Grid item xs={10}
                          className="details-label"
                          style={{ color: "#828282" }}
                        >
                          <CreateSharpIcon
                            style={{
                              display:
                                tabState !== "view" ? "none" : "block",
                            }}
                            onClick={() => setTabState("edit")}
                          ></CreateSharpIcon>
                        </Grid>
                        <Grid item xs={12}>
                            <div
                                className="details-value"
                                style={{
                                  display:
                                    tabState !== "view" ? "none" : "block",
                                }}
                              >
                                {viewRecord.length > 0
                                  ? viewRecord[0].subscriber_id
                                  : ""}
                              </div>
                              <BootstrapInput
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                                className="primary-input mb20 width100p"
                                placeholder="Subscriber ID"
                                value={toUpdatePatientInfo.subId}
                                onChange={(e) => {
                                  setpatientUpdatedData(
                                    "subId",
                                    e.target.value
                                  );
                                }}
                              />
                        </Grid>
                      </Grid>
                    </Grid>
                    
                  </Grid>

                  {/* <Grid item xs={12}>
                      <Grid
                        className="detail-list"
                        container
                        spacing={1}
                        justify="center"
                      >
                        <Grid item xs={6}>
                          <Grid
                            container
                            spacing={2}
                            justify="center"
                            alignItems="center"
                          >
                            <Grid item xs={5}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              Member ID
                            </Grid>
                            <Grid item xs={7}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              <CreateSharpIcon
                                style={{
                                  display:
                                    tabState !== "view" ? "none" : "block",
                                }}
                                onClick={() => setTabState("edit")}
                              ></CreateSharpIcon>
                            </Grid>
                            <Grid item xs={12} className="details-value">
                              <div
                                style={{
                                  display:
                                    tabState !== "view" ? "none" : "block",
                                }}
                              >
                                {viewRecord.length > 0
                                  ? viewRecord[0].subscriber_id
                                  : ""}
                              </div>
                              <BootstrapInput
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                                className="primary-input mb20 width100p"
                                placeholder="Subscriber ID"
                                value={toUpdatePatientInfo.subId}
                                onChange={(e) => {
                                  setpatientUpdatedData(
                                    "subId",
                                    e.target.value
                                  );
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid> */}
                    

                  <Divider className="dividercls" />

                  <Grid
                    className="detail-list"
                    container
                    spacing={3}
                    justify="center"
                  >
                    <Grid item xs={12}>
                      <Grid container spacing={1} justify="center">
                        <Grid item xs={12} className="details-label">
                          Registration Date
                        </Grid>
                        <Grid item xs={12} className="details-value">
                          {viewRecord.length > 0
                            ? viewRecord[0].onboarding_status
                            : ""}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={1} justify="center">
                        <Grid item xs={12} className="details-label">
                          Last Visit Date
                        </Grid>
                        <Grid item xs={12} className="details-value">
                          {viewRecord.length > 0
                            ? viewRecord[0]
                                .last_eligibility_verified_timestamp !==
                                "0000-00-00 00:00:00" &&
                              viewRecord[0]
                                .last_eligibility_verified_timestamp !== null
                              ? viewRecord[0].last_eligibility_verified_timestamp
                                  .split("T")[0]
                                  .split("-")[1] +
                                "/" +
                                viewRecord[0].last_eligibility_verified_timestamp
                                  .split("T")[0]
                                  .split("-")[2] +
                                "/" +
                                viewRecord[0].last_eligibility_verified_timestamp
                                  .split("T")[0]
                                  .split("-")[0]
                              : //+ " " + viewRecord[0].last_eligibility_verified_timestamp.split("T")[1].split(":")[0]+":"+viewRecord[0].last_eligibility_verified_timestamp.split("T")[1].split(":")[1]
                                ""
                            : ""}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <br />
                  <br />
                  <br />
                  <Divider style={{ background: "blue" }} variant="middle" />
                  <br />
                  <br />
                  <Grid container spacing={3} justify="center">
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={2}
                          className="details-label"
                          style={{ color: "#828282" }}
                        >
                          Uploaded Documents
                        </Grid>
                        <Grid item xs={10}>
                          <CreateSharpIcon
                            style={{
                              display:
                                tabState !== "view" ? "none" : "block",
                            }}
                            onClick={() => setTabState("edit")}
                          ></CreateSharpIcon>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                    <div
                      className="details-value"
                      style={{
                        display:
                          tabState !== "view" ? "none" : "block",
                      }}
                    >
                      <Grid container spacing={2} justify="center">
                        <Grid item xs={6}>
                          <div
                            style={{
                              letterSpacing:'0.2em',
                              display:
                                patientDocuments["front"] !== ""
                                  ? "block"
                                  : "none",
                            }}
                          >
                            <Button
                              variant="contained"
                              color="default"
                              onClick={() => {
                                setImageModal({
                                  isModalOpen: true,
                                  image: patientDocuments["front"],
                                });
                              }}
                            >
                              {viewRecord.length > 0
                                ? viewRecord[0].card_front_image_link != null
                                  ? "Front Image"
                                  : ""
                                : ""}
                            </Button>
                            {/*<Base64Downloader
                              base64={patientDocuments["front"]}
                              downloadName={
                                viewRecord.length > 0
                                  ? viewRecord[0].card_front_image_link != null
                                    ? viewRecord[0].card_front_image_link
                                        .split("/")[3]
                                        .split(".")[0]
                                    : ""
                                  : ""
                              }
                            >
                              {viewRecord.length > 0
                                ? viewRecord[0].card_front_image_link != null
                                  ? viewRecord[0].card_front_image_link.split(
                                      "/"
                                    )[3]
                                  : ""
                                : ""}
                            </Base64Downloader>*/}
                            {/*<img style="width:128px;height:128px;" src={`${frontImage}`} alt="font"/>*/}
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <div
                            style={{
                              letterSpacing:'0.2em',
                              display:
                                patientDocuments["back"] !== ""
                                  ? "block"
                                  : "none",
                            }}
                          >
                            <Button
                              variant="contained"
                              color="default"
                              onClick={() => {
                                setImageModal({
                                  isModalOpen: true,
                                  image: patientDocuments["back"],
                                });
                              }}
                            >
                              {viewRecord.length > 0
                                ? viewRecord[0].card_back_image_link != null
                                  ? "Back Image"
                                  : ""
                                : ""}
                            </Button>
                            {/*<Base64Downloader
                              base64={patientDocuments["back"]}
                              downloadName={
                                viewRecord.length > 0
                                  ? viewRecord[0].card_back_image_link != null
                                    ? viewRecord[0].card_back_image_link
                                        .split("/")[3]
                                        .split(".")[0]
                                    : ""
                                  : ""
                              }
                            >
                              {viewRecord.length > 0
                                ? viewRecord[0].card_back_image_link != null
                                  ? viewRecord[0].card_back_image_link.split(
                                      "/"
                                    )[3]
                                  : ""
                                : ""}
                            </Base64Downloader>*/}
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                    <div
                      style={{
                        display:
                          tabState === "view" ? "none" : "block",
                      }}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={12}>
                          <Box component="div" className="uploadfile">
                            <Grid container spacing={3}>
                              <Grid item xs={12} sm={12} md={12}>
                                <Box component="div" className="filedone">
                                  <Grid container spacing={1}>
                                    <Grid item xs={2}>
                                      <DescriptionIcon />
                                    </Grid>
                                    <Grid item xs={2} style={{ display: "flex!important", alignItems: "center!important", }} >
                                      <div>
                                        <p>Front side</p>
                                      </div>
                                    </Grid>
                                    <Grid item xs={6} className="txt-right">
                                    {
                                      documentTypeHistory.front?
                                      <CheckCircleIcon style={{ color: "green" }} />:<HighlightOffIcon style={{ color: "red" }} />
                                    } 
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} className="pd20">
                                      <input type="file" id="upload1" accept=".jpg,.jpeg.,.gif,.png" hidden onChange={(e) => {
                                        onFileChangeNew("1", e);
                                      }}
                                      />
                                      <label for="upload1" class="custom-file-input"></label>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} className="pd20">
                                      <div id="img1-preview" class="cust-select"></div>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Grid>
                            </Grid>
                            <Grid container spacing={3} className="pt30">
                              <Grid item xs={12} sm={12} md={12}>
                                <Box component="div" className="filedone">
                                  <Grid container spacing={1}>
                                    <Grid item xs={2}>
                                      <DescriptionIcon />
                                    </Grid>
                                    <Grid item xs={2} style={{ display: "flex!important", alignItems: "center!important", }} >
                                      <div>
                                        <p>Back side</p>
                                      </div>
                                    </Grid>
                                    <Grid item xs={6} className="txt-right">
                                    {
                                      documentTypeHistory.back?
                                      <CheckCircleIcon style={{ color: "green" }} />:<HighlightOffIcon style={{ color: "red" }} />
                                    } 
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} className="pd20">
                                      <input type="file" id="upload2" accept=".jpg,.jpeg.,.gif,.png" hidden onChange={(e) => {
                                        onFileChangeNew("2", e);
                                      }}
                                      />
                                      <label for="upload2" class="custom-file-input"></label>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} className="pd20">
                                      <div id="img2-preview" class="cust-select"></div>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      </Grid>
                    </div>
                    </Grid>
                  </Grid>
                  <br />
                  <Divider style={{ background: "blue" }} variant="middle" />
                  <br />
                  <Grid container spacing={3} justify="center">
                    <Grid item xs={12}>
                      <Grid container spacing={1} style={{ color: "#828282" }}>
                        Notes:
                      </Grid>
                    </Grid>
                  </Grid>
                  <br />
                  <br />
                  <Grid container spacing={3} justify="center">
                    <Grid item xs={12}>
                      {patientNoteData.map((row, idx) => (
                        <Grid
                          container
                          spacing={1}
                          justify="left"
                          style={{ color: "#092C4C", fontSize: "14px" }}
                        >
                          <Grid item xs={3}>
                            {row.time !== "0000-00-00 00:00:00" &&
                            row.time !== null
                              ? row.time.split("T")[0].split("-")[1] +
                                "/" +
                                row.time.split("T")[0].split("-")[2] +
                                "/" +
                                row.time.split("T")[0].split("-")[0]
                              : ""}
                          </Grid>
                          <Grid item xs={4} justify="left">
                            <div
                              style={{
                                width: "180px",
                              }}
                            >
                              {row.desc}
                            </div>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <br />
                  <br />
                  <br />

                  <Grid container spacing={3} justify="center">
                    <Grid item xs={12}>
                      <Grid container spacing={1} justify="center">
                        <Grid
                          item
                          xs={2}
                          style={{ margin: "auto", color: "#828282" }}
                        >
                          Add Notes
                        </Grid>
                        <Grid item xs={10}>
                          <CreateSharpIcon
                            onClick={() => openNotes(true)}
                          ></CreateSharpIcon>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={6}>
                      <Grid
                        container
                        spacing={1}
                        style={{
                          display: tabState === "view" ? "none" : "flex",
                          flexDirection: "row-reverse",
                          color: "#092C4C",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                        justify="right"
                      >
                        <Button
                          variant="contained"
                          className={
                            editedFlag ? "btn-primary" : "btn-disabled"
                          }
                          disabled={editedFlag ? false : true}
                          onClick={updatePatientInfo}
                        >
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid item xs={6}>
                      <Grid
                        container
                        spacing={1}
                        style={{
                          display: tabState === "view" ? "none" : "flex",
                        }}
                      >
                        <Button
                          variant="contained"
                          className="btn-primary"
                          onClick={discardChanges}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  <br />
                  <br />
                </Paper>
              </DialogContent>
            </Dialog>
            <Grid item xs={12} sm={12}>
              <Paper className=" txt-center bx-shadow dbbox">
                <Box component="div" className="txt-center">
                  <h5 className="btitle pt30">
                    Patient Eligibility Monitoring Dashboard
                  </h5>
                  <div>
                    <Grid
                      container
                      spacing={3}
                      className="mt20"
                      direction="row"
                      justify="center"
                      alignItems="center"
                    >
                      <Grid
                        item
                        xs={12}
                        sm={3}
                        className="pad0 txt-left Patientdd"
                      >
                        <Select
                          onChange={(selectedOption) => {
                            setColumnToFilter(selectedOption.value);
                          }}
                          options={columnOptions}
                          value={columnOptions.filter(
                            (option) => option.value === columnToFilter
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={5} className="pad0 table-search">
                        <Box className={classes.root}>
                          <InputBase
                            className={classes.input}
                            value={toFilter}
                            placeholder={
                              columnToFilter === "dateOfService" ||
                              columnToFilter === "dob"
                                ? "mm/dd/yyyy"
                                : "Search string . . ."
                            }
                            inputProps={{ "aria-label": "Start Typing . . ." }}
                            onChange={(e) => {
                              setToFilter(e.target.value);
                            }}
                          />
                          <div
                            title={"Clear Filter"}
                            style={{
                              position: "absolute",
                              right: "110px",
                              top: "15px",
                              fontSize: "25px",
                              fontWeight: "bolder",
                              cursor: "pointer",
                            }}
                            onClick={clearFilter}
                          >
                            X
                          </div>

                          <IconButton
                            className={classes.iconButton}
                            aria-label="search"
                            style={{ right: "30px!important" }}
                            onClick={() => Search()}
                          >
                            Search
                          </IconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={5} className="pad0">
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="checkedc"
                              checked={includeInactive}
                              onChange={(e) => {
                                setIncludeInactive(e.target.checked);
                              }}
                            />
                          }
                          label="Include inactive patients"
                        />
                      </Grid>
                    </Grid>
                    <Grid container className="mt20">
                      <Grid item xs={12} sm={12} className="custom-table">
                        <TableContainer className="mt30" component={Paper}>
                          <Table
                            className={classes.table}
                            aria-label="simple table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Select</TableCell>
                                <TableCell>Date of Service</TableCell>
                                <TableCell>Patient Full Name</TableCell>
                                <TableCell>Specialty</TableCell>
                                <TableCell>Reason for Visit</TableCell>
                                <TableCell>Last Visit Date</TableCell>
                                <TableCell>Attending Doctor</TableCell>
                                <TableCell>Registration Status</TableCell>
                                <TableCell>Date Last Verified</TableCell>
                                <TableCell>Payer Name</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {gridData.map((row) => (
                                <TableRow
                                  key={row.patient_id}
                                  style={{ position: "relative" }}
                                >
                                  <TableCell className="patientid">
                                    <FormControlLabel
                                      control={<Checkbox name="checkedA" />}
                                      label={" "}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {row.dos !== "0000-00-00 00:00:00" &&
                                    row.dos !== null
                                      ? row.dos.split("T")[0].split("-")[1] +
                                        "/" +
                                        row.dos.split("T")[0].split("-")[2] +
                                        "/" +
                                        row.dos.split("T")[0].split("-")[0]
                                      : ""}
                                  </TableCell>
                                  <TableCell>
                                    {row.first_name +
                                      " " +
                                      row.middle_name +
                                      " " +
                                      row.last_name}
                                  </TableCell>
                                  <TableCell
                                    onClick={() => {
                                      expand("");
                                    }}
                                  >
                                    <p
                                      className={
                                        row.eligibility === "Active Coverage"
                                          ? "greencolumn"
                                          : row.eligibility ===
                                            "Coverage Unknown"
                                          ? "redcolumn"
                                          : row.eligibility ===
                                            "Active - Full Risk Capitation"
                                          ? "ambercolumn"
                                          : row.eligibility ===
                                            "Active - Services Capitated"
                                          ? "ambercolumn"
                                          : "graycolumn"
                                      }
                                    >
                                      {row.eligibility}
                                    </p>
                                  </TableCell>
                                  <TableCell
                                    onClick={() => {
                                      expand("");
                                    }}
                                  >
                                    <p
                                      className={
                                        row.network === "In Network"
                                          ? "greencolumn"
                                          : row.network ==="Out of Network"
                                          ? "lightbluecolumn"
                                          : "redcolumn"
                                      }
                                    >
                                      {row.network}
                                    </p>
                                  </TableCell>
                                  <TableCell
                                    onClick={() => {
                                      expand("");
                                    }}
                                  >
                                    <p
                                      className={
                                        row.preauth_required === "Yes"
                                          ? "redcolumn"
                                          : row.preauth_required ==="No"
                                          ? "greencolumn"
                                          : "lightbluecolumn"
                                      }
                                    >
                                      {row.preauth_required}
                                    </p>
                                  </TableCell>
                                  <TableCell
                                    onClick={() => {
                                      expand("");
                                    }}
                                  >
                                    {row.service_name}
                                  </TableCell>
                                  <TableCell
                                    onClick={() => {
                                      expand("");
                                    }}
                                  >
                                    <p
                                      className={
                                        row.onboarding_status ===
                                        "Manual Verification Required"
                                          ? "redcolumn"
                                          : "blackcolumn"
                                      }
                                    >
                                      {row.onboarding_status}
                                    </p>
                                  </TableCell>
                                  <TableCell>
                                    {row.last_eligibility_verified_timestamp !==
                                      "0000-00-00 00:00:00" &&
                                    row.last_eligibility_verified_timestamp !==
                                      null
                                      ? row.last_eligibility_verified_timestamp
                                          .split("T")[0]
                                          .split("-")[1] +
                                        "/" +
                                        row.last_eligibility_verified_timestamp
                                          .split("T")[0]
                                          .split("-")[2] +
                                        "/" +
                                        row.last_eligibility_verified_timestamp
                                          .split("T")[0]
                                          .split("-")[0]
                                      : //+ " " + row.last_eligibility_verified_timestamp.split("T")[1].split(":")[0]+":"+row.last_eligibility_verified_timestamp.split("T")[1].split(":")[1]
                                        ""}
                                  </TableCell>
                                  <TableCell style={{ position: "relative" }}>
                                    {row.payor_name}{" "}
                                    <Paper
                                      elevation={3}
                                      className={
                                        isExpand === row.patient_id
                                          ? classes.Expand
                                          : classes.unExpand
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      <span
                                        className="threedot"
                                        style={
                                          isExpand === row.patient_id
                                            ? { display: "none" }
                                            : {
                                                display: "block",
                                              }
                                        }
                                        onClick={() => {
                                          expand(row.patient_id);
                                        }}
                                      >
                                        ...
                                      </span>
                                      <span
                                        className="listmenu"
                                        style={
                                          isExpand === row.patient_id
                                            ? {
                                                display: "block",
                                                padding: "10px",
                                                whiteSpace: "nowrap",
                                              }
                                            : { display: "none" }
                                        }
                                      >
                                        <span
                                          onClick={() =>
                                            handleClickOpen(row.patient_id)
                                          }
                                        >
                                          View Patient Details
                                        </span>
                                        <span> {" "} | {" "} </span>

                                        {row.eligibility === "Active Coverage"? <span
                                          onClick={() =>
                                            handleClickOpen2(row.patient_id)
                                          }
                                        >
                                          View Notes/Reports
                                        </span>: <span style = {{ color: "#DCDCDC", cursor: "default", textDecorationLine: "none",}}>
                                          View Notes/Reports
                                        </span> }
                                        {/* <span
                                          onClick={() =>
                                            handleClickOpen2(row.patient_id)
                                          }
                                        >
                                          Coverage/Benefits
                                        </span> */}
                                        <span> | </span>
                                        <span
                                          onClick={() =>
                                            sendLinkApi(row.patient_id)
                                          }
                                        >
                                          Add Notes/Reports
                                        </span>
                                        {/* <span> {" "} | {" "} </span>
                                        <span
                                          onClick={() => openNotes(true)}
                                        > Add Notes</span> */}
                                        {/* <span> {" "} | {" "} </span> */}
                                        {/* <span
                                          onClick={() =>
                                            patientDelete(row.patient_id)
                                          }
                                        >
                                          Cancel
                                        </span> */}
                                        <span>
                                          {" "}
                                          &nbsp;&nbsp;{" "}
                                        </span>
                                        <span onClick={() => expand("")}>
                                          {">>>"}
                                        </span>
                                      </span>
                                    </Paper>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                  </div>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </main>
    </div>
  );
}
