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
import moment from "moment";
import NotesDialog from "./Notes";
import ReportUploadDialog from "./File-upload";
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
import FormControl from "@material-ui/core/FormControl";
import InputLabel from '@material-ui/core/InputLabel';
import Collapsible from "react-collapsible";
import MUIselect from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useState } from "react";
import Reschedule from "./Reschedulepopup";
import { ConfirmationDialog } from "./ConfirmationDialog";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import { Date_format, Date_time_format, SortedPatientNoteDataList } from './Util/Utils';

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
var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
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
    top: "50%",
    position: "absolute",
    width: "50px",
    height: "40px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    display: "inline",
    right: "5px",
    textAlign: "center",
    transition: "width 1s",
    marginTop: "-20px",
  },

  Expand: {
    top: "50%",
    transition: "width 1s",
    position: "absolute",
    width: "570px",
    height: "40px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    display: "inline",
    right: "5px",
    textAlign: "right",
    marginTop: "-20px",
  },

  Expand: {
    top: "50%",
    transition: "width 1s",
    position: "absolute",
    width: "auto",
    height: "40px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    display: "inline",
    right: "5px",
    textAlign: "center",
    paddingLeft: "25px",
    marginTop: "-20px",
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

export default function MonitoringDashboard() {
  const classes = useStyles();
  const [patientDocuments, setpatientDocuments] = React.useState({
    front: "",
    back: "",
  });
  const [imageModal, setImageModal] = React.useState({
    isModalOpen: false,
    image: "",
  });

  const [openDeleteConfirmDailogInNotes,
    setOpenDeleteConfirmDailogInNotes
  ] = React.useState(false);
  const [patientDataHaveId, setPatientDataHaveId] = React.useState("");
  const [notesCompOpen, openNotes] = React.useState(false);

  // Upload report
  const [openUploadDialog, setOpenUploadDialog] = React.useState(false);
  const [reportDesc, setReportDesc] = React.useState("");
  const [labClinician, setLabClinician] = React.useState("");
  const [reportForUpld, setReportForUpld] = React.useState({});
  const [patientNoteId, setPatientNoteId] = React.useState("");
  const [open] = React.useState(false);
  const [gridData, setGridData] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);
  const [isExpand, selectedExpand] = React.useState("");
  const [openViewModel, setOpenViewMode] = React.useState(false);
  const [openViewModel2, setOpenViewMode2] = React.useState(false);
  const [openViewModel3, setOpenViewMode3] = React.useState(false);
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
    front: false,
    back: false,
    combined: false,
  });
  const [patientNoteData, setpatientNoteData] = React.useState([]);
  const [patientReportData, setPatientReportData] = React.useState([]);
  const [columnToFilter, setColumnToFilter] = React.useState("");
  const [toFilter, setToFilter] = React.useState("");
  const [frontImage, setFrontImage] = React.useState("");
  const [backImage, setBackImage] = React.useState("");
  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  const [patientID, setPatientId] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmCancelApptmtOpen, setConfirmCancelApptmtOpen] =
    React.useState(false);

  var today = new Date();
  const usColumnOptions = [
    { value: "patientName", label: "Patient Name" },
    { value: "eligibility", label: "Eligibility" },
    { value: "network", label: "Network Status" },
    { value: "coverageType", label: "Coverage Type" },
    { value: "onBoardingStatus", label: "Registration Status" },
    { value: "payorName", label: "Payer Name" },
    { value: "dateOfService", label: "Date of Service" },
    { value: "dob", label: "Date of Birth" },
  ];

  const indiaColumnOptions = [
    { value: "patientName", label: "Patient Full Name" },
    { value: "dateOfService", label: "Date of Service" },
    { value: "apptStrtTime", label: "Appointment Start Time" },
    { value: "specialty", label: "Specialty" },
    { value: "reasonForVisit", label: "Reason For Visit" },
    { value: "lastVisitDate", label: "Last Visit Date" },
    { value: "clinician", label: "Attending Staff" },
  ];

  const columnOptions =
    process.env.REACT_APP_REGION == "INDIA"
      ? indiaColumnOptions
      : usColumnOptions;

  const handleConfirmOpen = () => {
    setConfirmOpen(true);
  };

  const onNotesReportClick = (patientId) => {
    // TODO: Need to get patient report info.
    let data = gridData;
    let filteredData = data.filter((d) => d.patient_id === patientId);

    setFilteredPatientData(patientId);
    fetchPatientNotes(patientId);
    //fetchPatientDocuments(filteredData);
    fetchPatientReportInfo(patientId);

    setOpenViewMode3(true);
  };

  const handleCancelApptmtOpen = () => {
    setConfirmCancelApptmtOpen(true);
  };

  const sendLinkApi = (patientId) => {
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

  const savePatientNotes = (notes, noteId, operation) => {
    setTabState("view");
    setOpenViewMode(false);
    setLoading(true);
    if ((!notes || !toUpdatePatientInfo?.patient_id) && operation !== 'Delete') {
      ToastError("Please Enter Note");
      return false;
    }
    let data = {
      patient_id: parseInt(toUpdatePatientInfo?.patient_id),
      note_description: notes,
    };

    let msg = "Notes added successfully";
    let failMsg = "Failed to save note";

    if (noteId && operation) {
      data["noteId"] = noteId;
      data["operation"] = operation;

      if (operation == "Update") {
        msg = "Notes updated successfully";
      }
      else {
        msg = `Notes ${operation} successfully`;
      }
      // msg = `Note ${operation} successfully`;
      failMsg = `Failed to ${operation} note`;
    }

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
        ToastSuccess(msg);
        const date = new Date(); // Current date.
        let newNoteObj = {};
        newNoteObj["note_id"] = noteId;
        newNoteObj["desc"] = notes;
        newNoteObj["time"] = date;
        const filteredRec = patientNoteData.filter(
          (note) => note?.id !== noteId
        );
        if (noteId && operation === "Update") {
          filteredRec.push(newNoteObj);
          setpatientNoteData(filteredRec);
        } else if (noteId && operation === "Delete") {
          setpatientNoteData(filteredRec);
        } else {
          setpatientNoteData([...patientNoteData, newNoteObj]);
        }
        openNotes(false);
        setPatientNoteId("");
        setOpenViewMode3(true);
      })
      .catch(function (error) {
        setLoading(false);
        setpatientNoteData([]);
        ToastError(failMsg);
        openNotes(false);
        setPatientNoteId("");

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

    if (columnToFilter === "") {
      ToastError("Please Select Column To Filter");
      return false;
    }
    if (toFilter === "") {
      ToastError("Please Enter Text To Search");
      return false;
    }

    setLoading(true);

    console.log("select colum=key : " + columnToFilter, "    input text : " + toFilter)


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
        let patientGridata = [...gridData];


        patientGridata = JSON.parse(response.data.data);

        console.log("response.data :  ", '\n', response.data);
        console.log("response.data.data", '\n', response.data.data);
        console.log("Full response obj", '\n', response);

        setGridData(patientGridata);
        setSearchedFlag(true);
        setLoading(false);
      })
      .catch(function (error) {
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

  const fetchPatientReportInfo = async (id) => {
    // TODO: Need to get patient report info
    let patientReportData = [];
    let notes = {
      method: "post",
      url: process.env.REACT_APP_BEATS_FETCH_PATIENT_REPORT_INFO_API,
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
      let reportData = await axios(notes);
      let fetchedReportData = JSON.parse(reportData.data.data);
      for (var i = 0; i < fetchedReportData.length; i++) {
        let obj = {
          id: fetchedReportData[i].patient_report_id,
          providerId: fetchedReportData[i].provider_id,
          preparedBy: fetchedReportData[i].prepared_by,
          description: fetchedReportData[i].description,
          fileLocation: fetchedReportData[i].file_location,
          createdTime: fetchedReportData[i].created_time
        };
        patientReportData.push(obj);
      }
      setPatientReportData(patientReportData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      ToastError("Failed To Fetch Patient Report Information!");
      console.log(error);
    }
  };

  const onUploadDialogClose = () => {
    setOpenUploadDialog(false);

    // Resetting state to initial value.
    setReportDesc("");
    setLabClinician("");
    setReportForUpld({});
  };

  const saveNotes = (data, noteId, operation) => {
    /* Patient Note Insert,Update,Delete operations*/
    savePatientNotes(data, noteId, operation);
    openNotes(false);
    setPatientNoteId("");
    // setOpenViewMode3(false);
    setOpenViewMode(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setPatientId("");
  };

  const handleConfirmApptmtClose = () => {
    setConfirmCancelApptmtOpen(false);
    setPatientId("");
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    if (patientID === "") {
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
        patient_id: patientID,
      },
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        setLoading(false);
        setPatientId("");
        ToastSuccess("Appointment cancelled successfully");
        fetchData();
      })
      .catch(function (error) {
        setLoading(false);
        setPatientId("");
        ToastError("Failed to cancel appointment");
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
    gender: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    zip: "",
    customer_number: "",
    policy_number: "",
    insurance_valid_from: "",
    sub_first_name: "",
    sub_middle_name: "",
    sub_last_name: "",
    relationship_to_subscriber: "",
    provider_id: "",
    specialties: "",
    visit_reason: "",
    insurance_name: "",
  });
  const [patientFName, setPatientFName] = React.useState("");
  const [patientLName, setPatientLName] = React.useState("");
  const [networkType, setNetworkType] = React.useState("");
  const [payerName, setPayerName] = React.useState("");
  const [serviceName, setServiceName] = React.useState("");
  const [medicareAdditionalPayers, setMedicareAdditionalPayers] =
    React.useState("");

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

  const time = [
    "12:00 AM",
    "12:30 AM",
    "1:00 AM",
    "1:30 AM",
    "2:00 AM",
    "2:30 AM",
    "3:00 AM",
    "3:30 AM",
    "4:00 AM",
    "4:30 AM",
    "5:00 AM",
    "5:30 AM",
    "6:00 AM",
    "6:30 AM",
    "7:00 AM",
    "7:30 AM",
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
    "10:00 PM",
    "10:30 PM",
    "11:00 PM",
    "11:30 PM",
  ];

  const getFormattedTime = (fromTime) => {
    if (!fromTime || typeof fromTime !== "string") return fromTime;
    const formattedTime = moment(fromTime, ["HH.mm"]).format("hh:mm A"); //moment(fromTime, "hh:mm").format('LT');
    // const indexOfTime = time.findIndex((ele)=> ele === formattedTime);
    //  console.log('fromTime', indexOfTime);
    return formattedTime;
  };

  const inNetworkIndData = [
    {
      title: "Co-Payment ",
      yearToDate: coPaymentIn["amount"],
      remaining: "N/A",
      notes: coPaymentIn["notes"],
    },
    {
      title: "Deductible",
      yearToDate: deductiblesInIndInfo["amount"],
      remaining: deductiblesInIndInfo["remaining"],
      notes: deductiblesInIndInfo["notes"],
    },
    {
      title: "Out-of-Pocket",
      yearToDate: pocketInIndInfo["amount"],
      remaining: pocketInIndInfo["remaining"],
      notes: pocketInIndInfo["notes"],
    },
    {
      title: "Co-Insurance",
      yearToDate: coInsuranceIn["amount"],
      remaining: "N/A",
      notes: coInsuranceIn["notes"],
    },
    {
      title: "Limitations",
      yearToDate: limitationsIn["amount"],
      remaining: limitationsIn["remaining"],
      notes: limitationsIn["notes"],
    },
  ];

  const inNetworkFamData = [
    {
      title: "Co-Payment",
      yearToDate: coPaymentIn["amount"],
      remaining: "N/A",
      notes: coPaymentIn["notes"],
    },
    {
      title: "Deductible",
      yearToDate: deductiblesInFamInfo["amount"],
      remaining: deductiblesInFamInfo["remaining"],
      notes: deductiblesInFamInfo["notes"],
    },
    {
      title: "Out-of-Pocket",
      yearToDate: pocketInFamInfo["amount"],
      remaining: pocketInFamInfo["remaining"],
      notes: pocketInFamInfo["notes"],
    },
    {
      title: "Co-Insurance",
      yearToDate: coInsuranceIn["amount"],
      remaining: "N/A",
      notes: coInsuranceIn["notes"],
    },
    {
      title: "Limitations",
      yearToDate: limitationsIn["amount"],
      remaining: limitationsIn["remaining"],
      notes: limitationsIn["notes"],
    },
  ];

  const outNetworkIndData = [
    {
      title: "Co-Payment",
      yearToDate: coPaymentOut["amount"],
      remaining: "N/A",
      notes: coPaymentOut["notes"],
    },
    {
      title: "Deductible",
      yearToDate: deductiblesOutIndInfo["amount"],
      remaining: deductiblesOutIndInfo["remaining"],
      notes: deductiblesOutIndInfo["notes"],
    },
    {
      title: "Out-of-Pocket",
      yearToDate: pocketOutIndInfo["amount"],
      remaining: pocketOutIndInfo["remaining"],
      notes: pocketOutIndInfo["notes"],
    },
    {
      title: "Co-Insurance",
      yearToDate: coInsuranceOut["amount"],
      remaining: "N/A",
      notes: coInsuranceOut["notes"],
    },
    {
      title: "Limitations",
      yearToDate: limitationsOut["amount"],
      remaining: limitationsOut["remaining"],
      notes: limitationsOut["notes"],
    },
  ];

  const outNetworkFamData = [
    {
      title: "Co-Payment",
      yearToDate: coPaymentOut["amount"],
      remaining: "N/A",
      notes: coPaymentOut["notes"],
    },
    {
      title: "Deductible",
      yearToDate: deductiblesOutFamInfo["amount"],
      remaining: deductiblesOutFamInfo["remaining"],
      notes: deductiblesOutFamInfo["notes"],
    },
    {
      title: "Out-of-Pocket",
      yearToDate: pocketOutFamInfo["amount"],
      remaining: pocketOutFamInfo["remaining"],
      notes: pocketOutFamInfo["notes"],
    },
    {
      title: "Co-Insurance",
      yearToDate: coInsuranceOut["amount"],
      remaining: "N/A",
      notes: coInsuranceOut["notes"],
    },
    {
      title: "Limitations",
      yearToDate: limitationsOut["amount"],
      remaining: limitationsOut["remaining"],
      notes: limitationsOut["notes"],
    },
  ];

  const NANetworkIndData = [
    {
      title: "Co-Payment",
      yearToDate: coPaymentNA["amount"],
      remaining: "N/A",
      notes: coPaymentNA["notes"],
    },
    {
      title: "Deductible",
      yearToDate: deductiblesNAIndInfo["amount"],
      remaining: deductiblesNAIndInfo["remaining"],
      notes: deductiblesNAIndInfo["notes"],
    },
    {
      title: "Out-of-Pocket",
      yearToDate: pocketNAIndInfo["amount"],
      remaining: pocketNAIndInfo["remaining"],
      notes: pocketNAIndInfo["notes"],
    },
    {
      title: "Co-Insurance",
      yearToDate: coInsuranceNA["amount"],
      remaining: "N/A",
      notes: coInsuranceNA["notes"],
    },
    {
      title: "Limitations",
      yearToDate: limitationsNA["amount"],
      remaining: limitationsNA["remaining"],
      notes: limitationsNA["notes"],
    },
  ];

  const NANetworkFamData = [
    {
      title: "Co-Payment",
      yearToDate: coPaymentNA["amount"],
      remaining: "N/A",
      notes: coPaymentNA["notes"],
    },
    {
      title: "Deductible",
      yearToDate: deductiblesNAFamInfo["amount"],
      remaining: deductiblesNAFamInfo["remaining"],
      notes: deductiblesNAFamInfo["notes"],
    },
    {
      title: "Out-of-Pocket",
      yearToDate: pocketNAFamInfo["amount"],
      remaining: pocketNAFamInfo["remaining"],
      notes: pocketNAFamInfo["notes"],
    },
    {
      title: "Co-Insurance",
      yearToDate: coInsuranceNA["amount"],
      remaining: "N/A",
      notes: coInsuranceNA["notes"],
    },
    {
      title: "Limitations",
      yearToDate: limitationsNA["amount"],
      remaining: limitationsNA["remaining"],
      notes: limitationsNA["notes"],
    },
  ];

  const NoNetworkIndData = [
    {
      title: "Co-Payment",
      yearToDate: coPaymentNo["amount"],
      remaining: "N/A",
      notes: coPaymentNo["notes"],
    },
    {
      title: "Deductible",
      yearToDate: deductiblesNoIndInfo["amount"],
      remaining: deductiblesNoIndInfo["remaining"],
      notes: deductiblesNoIndInfo["notes"],
    },
    {
      title: "Out-of-Pocket",
      yearToDate: pocketNoIndInfo["amount"],
      remaining: pocketNoIndInfo["remaining"],
      notes: pocketNoIndInfo["notes"],
    },
    {
      title: "Co-Insurance",
      yearToDate: coInsuranceNo["amount"],
      remaining: "N/A",
      notes: coInsuranceNo["notes"],
    },
    {
      title: "Limitations",
      yearToDate: limitationsNo["amount"],
      remaining: limitationsNo["remaining"],
      notes: limitationsNo["notes"],
    },
  ];

  const NoNetworkFamData = [
    {
      title: "Co-Payment",
      yearToDate: coPaymentNo["amount"],
      remaining: "N/A",
      notes: coPaymentNo["notes"],
    },
    {
      title: "Deductible",
      yearToDate: deductiblesNoFamInfo["amount"],
      remaining: deductiblesNoFamInfo["remaining"],
      notes: deductiblesNoFamInfo["notes"],
    },
    {
      title: "Out-of-Pocket",
      yearToDate: pocketNoFamInfo["amount"],
      remaining: pocketNoFamInfo["remaining"],
      notes: pocketNoFamInfo["notes"],
    },
    {
      title: "Co-Insurance",
      yearToDate: coInsuranceNo["amount"],
      remaining: "N/A",
      notes: coInsuranceNo["notes"],
    },
    {
      title: "Limitations",
      yearToDate: limitationsNo["amount"],
      remaining: limitationsNo["remaining"],
      notes: limitationsNo["notes"],
    },
  ];

  const benefitsTableColumns = [
    {
      title: "",
      field: "title",
      cellStyle: {
        fontWeight: "bold",
        fontSize: "14px",
        whiteSpace: "nowrap",
      },
    },

    {
      title: "Year-To-Date",
      field: "Year to Date",
      headerStyle: {
        fontSize: "13px",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      },
    },
    {
      title: "Remaining",
      field: "Remaining",
      headerStyle: {
        fontWeight: "bold",
      },
    },
    {
      title: "Notes",
      field: "Notes",
      headerStyle: {
        fontWeight: "bold",
      },
      cellStyle: {
        fontSize: "11px",
      },
    },
  ];

  const benefitsSpecialtyTableColumns = [
    {
      title: "Network Type",
      field: "Network Type",
      headerStyle: {
        fontSize: "13px",
        fontWeight: "bold",
      },
      cellStyle: {
        fontWeight: "bold",
        fontSize: "14px",
      },
    },

    {
      title: "Item",
      field: "Item",
      headerStyle: {
        fontSize: "13px",
        fontWeight: "bold",
      },
      cellStyle: {
        fontWeight: "bold",
        fontSize: "14px",
      },
    },

    {
      title: "Value",
      field: "Value",
      headerStyle: {
        fontSize: "13px",
        fontWeight: "bold",
      },
    },

    {
      title: "Notes",
      field: "Notes",
      headerStyle: {
        fontWeight: "bold",
      },
      cellStyle: {
        fontSize: "11px",
      },
    },
  ];

  const nonMedTables = [];

  const [specialtyInfoData, setSpecialtyInfoData] = useState([]);

  const [medicareTrigger, setMedicareTrigger] = useState(false);

  const [medicareTriggerA, setMedicareTriggerA] = useState(false);
  const [medicareTriggerB, setMedicareTriggerB] = useState(false);
  const [medicareTriggerC, setMedicareTriggerC] = useState(false);
  const [medicareTriggerD, setMedicareTriggerD] = useState(false);

  const [medicareCoInsTriggerA, setMedicareCoInsTriggerA] = useState(false);
  const [medicareCoInsTriggerB, setMedicareCoInsTriggerB] = useState(false);
  const [medicareCoInsTriggerC, setMedicareCoInsTriggerC] = useState(false);
  const [medicareCoInsTriggerD, setMedicareCoInsTriggerD] = useState(false);

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

  const getPayer = (payer) => {
    if (!payer) return "";
    const payerName = attributeData?.payer?.find(
      (option) => option.value === payer
    );
    return payerName?.label?.split("-")[1] || "";
  };

  const medicareAData = [
    {
      title: "Deductible",
      yearToDate: formatter.format(medicareDeductibleA["amount"]),
      remaining: formatter.format(medicareDeductibleA["remaining"]),
    },
    {
      title: "Co-Insurance",
      yearToDate: medicareCoInsA["amount"] + "%",
      remaining: "N/A",
    },
    {
      title: "Limitations",
      yearToDate: limitationsA["amount"],
      remaining: limitationsA["remaining"],
    },
  ];

  const medicareBData = [
    {
      title: "Deductible",
      yearToDate: formatter.format(medicareDeductibleB["amount"]),
      remaining: formatter.format(medicareDeductibleB["remaining"]),
    },
    {
      title: "Co-Insurance",
      yearToDate: medicareCoInsB["amount"] + "%",
      remaining: "N/A",
    },
    {
      title: "Limitations",
      yearToDate: limitationsB["amount"],
      remaining: limitationsB["remaining"],
    },
  ];
  const medicareCData = [
    {
      title: "Deductible",
      yearToDate: formatter.format(medicareDeductibleC["amount"]),
      remaining: formatter.format(medicareDeductibleC["remaining"]),
    },
    {
      title: "Co-Insurance",
      yearToDate: medicareCoInsC["amount"] + "%",
      remaining: "N/A",
    },
    {
      title: "Limitations",
      yearToDate: limitationsC["amount"],
      remaining: limitationsC["remaining"],
    },
  ];
  const medicareDData = [
    {
      title: "Deductible",
      yearToDate: formatter.format(medicareDeductibleD["amount"]),
      remaining: formatter.format(medicareDeductibleD["remaining"]),
    },
    {
      title: "Co-Insurance",
      yearToDate: medicareCoInsD["amount"] + "%",
      remaining: "N/A",
    },
    {
      title: "Limitations",
      yearToDate: limitationsD["amount"],
      remaining: limitationsD["remaining"],
    },
  ];

  const medicareTableColumns = [
    {
      title: "",
      field: "title",
      cellStyle: {
        fontWeight: "bold",
        fontSize: "14px",
      },
    },

    {
      title: "Year-To-Date",
      field: "Year to Date",
      headerStyle: {
        fontSize: "13px",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      },
    },
    {
      title: "Remaining",
      field: "Remaining",
      headerStyle: {
        fontWeight: "bold",
      },
    },
    {
      title: "Notes",
      field: "Notes",
      headerStyle: {
        fontWeight: "bold",
      },
      cellStyle: {
        fontSize: "11px",
      },
    },
  ];

  const [medicarePartAAvailable, setMedicarePartAAvailable] =
    React.useState("");
  const [medicarePartBAvailable, setMedicarePartBAvailable] =
    React.useState("");
  const [medicarePartCAvailable, setMedicarePartCAvailable] =
    React.useState("");
  const [medicarePartDAvailable, setMedicarePartDAvailable] =
    React.useState("");

  const [noDataAvailable, setNoDataAvailable] = useState(false);

  const medicarePartData = [
    { title: "Part A", available: medicarePartAAvailable },
    { title: "Part B", available: medicarePartBAvailable },
    { title: "Part C", available: medicarePartCAvailable },
    { title: "Part D", available: medicarePartDAvailable },
  ];

  const medicarePartTableColumns = [
    {
      title: "Medicare",
      field: "title",
      headerStyle: {
        fontSize: "13px",
        fontWeight: "bold",
      },
      cellStyle: {
        fontWeight: "bold",
        fontSize: "14px",
      },
    },

    {
      title: "Available",
      field: "available",
      headerStyle: {
        fontSize: "13px",
        fontWeight: "bold",
      },
    },
  ];

  const contactInfoColumns = [
    {
      title: "Category",
      field: "Category",
      cellStyle: {
        fontWeight: "bold",
        fontSize: "14px",
      },
    },

    {
      title: "Type",
      field: "Type",
      headerStyle: {
        fontSize: "13px",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      },
    },
    {
      title: "Name",
      field: "Name",
      headerStyle: {
        fontWeight: "bold",
      },
    },
    {
      title: "Phone",
      field: "Phone",
      headerStyle: {
        fontWeight: "bold",
      },
      cellStyle: {
        fontSize: "11px",
      },
    },
  ];

  const [inCollapsible, setInCollapsible] = React.useState([]);
  const [outCollapsible, setOutCollapsible] = React.useState([]);
  const [noCollapsible, setNoCollapsible] = React.useState([]);
  const [NACollapsible, setNACollapsible] = React.useState([]);
  const [specialtyCollapsible, setSpecialtyCollapsible] = React.useState([]);
  const [medicareCollapsible, setMedicareCollapsible] = React.useState([]);
  const [medicarePartCollapsible, setMedicarePartCollapsible] = React.useState(
    []
  );

  const [benefitsLastVerifiedTime, setBenefitsLastVerifiedTime] =
    React.useState("");
  const [benefitsPullStatus, setBenefitsPullStatus] = React.useState("");
  const [datetimeOfQuery, setDatetimeOfQuery] = React.useState("");
  const [benefitsRefresh, setBenefitsRefresh] = React.useState(false);
  const [benefitsButtonText, setBenefitsButtonText] = React.useState("Refresh");
  const [patientRecordID, setPatientRecordID] = React.useState("");
  const [eligibilityCheck, setEligibilityCheck] = React.useState(false);

  const [contactInfoCollapsible, setContactInfoCollapsible] = React.useState(
    []
  );
  const [apptmtState, setApptmtState] = React.useState("CheckIn");
  const [disableCheckOutBtn, setDisableCheckOutBtn] = React.useState(false);

  const eligibilityArray = () => {
    return EligibilityData.map((row) => (
      <option value={row.value}>{row.displayVal}</option>
    ));
  };

  const setpatientUpdatedData = (key, val) => {
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

  const deletePatientReport = async (reportId) => {
    if (!reportId) {
      ToastError('No Report Selected.');
      return false;
    }

    setLoading(true);
    let deleteConfig = {
      method: "post",
      url: process.env.REACT_APP_BEATS_DELETE_PATIENT_REPORT,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
      data: { reportId },
    };

    try {
      await axios(deleteConfig);
      const filteredReports = patientReportData.filter((report) => report?.id !== reportId);
      setPatientReportData(filteredReports);
      ToastSuccess('Patient Report Deleted Successfully');
    } catch (error) {
      ToastError('Failed to delete patient report.');
      console.log("Failed to delete patient report.");
    }
  }

  const downloadReport = async (url) => {
    //TODO
    if (url) {
      const splitUrl = url.split("/");
      const fileName = splitUrl[splitUrl.length - 1];

      setLoading(true);
      let config = {
        method: "post",
        url: process.env.REACT_APP_BEATS_GET_PATIENT_DOCUMENTS,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("idToken"),
        },
        data: { key: url },
      };

      try {
        let file = await axios(config);
        setLoading(false);
        const linkSource = file.data;
        const downloadLink = document.createElement("a");

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      } catch (error) {
        console.log("Error occurred while fetching patient Document");
      }
    }
  };

  const updatePatientInfo = () => {
    let data = { ...toUpdatePatientInfo };
    let isError = false;
    var regExContactNumber = /^\d{3}-\d{3}-\d{4}$/;

    if (data.pfname === "") {
      ToastError("Enter patient's first name");
      isError = true;
    }
    if (data.last_name === "") {
      ToastError("Enter patient's last name");
      isError = true;
    }
    if (
      data.dob ===
      today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate()
    ) {
      ToastError("Enter your date of birth");
      isError = true;
    }
    if (data.gender === "") {
      ToastError("Enter your gender");
      isError = true;
    }
    if (
      data.contact_number === "" ||
      !regExContactNumber.test(data.contact_number)
    ) {
      ToastError("Enter contact number");
      isError = true;
    }
    if (data.email === "" || data.email.toString().indexOf("@") === -1) {
      ToastError("Enter valid email");
      isError = true;
    }
    if (data.address_line1 === "") {
      ToastError("Enter address");
      isError = true;
    }
    if (data.city === "") {
      ToastError("Enter city");
      isError = true;
    }
    if (data.state === "") {
      ToastError("Enter state");
      isError = true;
    }
    if (data.zip === "") {
      if (process.env.REACT_APP_REGION === "US") {
        ToastError("Enter zip");
        isError = true;
      } else {
        ToastError("Enter Pin");
        isError = true;
      }
    }

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
        ToastSuccess("Patient record updated successfully.");

        //  ToastSuccess("Please set the eligibility status to 'Check Pending', if you would like to trigger Eligibility Re-Check" );

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
    setPatientId(patient_id);
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
    patientData["dos"] = filteredData[0].date_of_service;
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
    patientData["patient_insurance_record_id"] =
      filteredData[0].patient_insurance_record_id;

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

  const setFilteredPatientData = (id) => {
    let data = gridData;
    let patientData = { ...toUpdatePatientInfo };
    let filteredData = data.filter((d) => d.patient_id === id);

    patientData["pfname"] = filteredData[0].first_name;
    patientData["middle_name"] = filteredData[0].middle_name;
    patientData["last_name"] = filteredData[0].last_name;
    patientData["dateOfService"] = filteredData[0].date_of_service;
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
    patientData["gender"] = filteredData[0].gender;
    patientData["address_line1"] = filteredData[0].address_line1;
    patientData["address_line2"] = filteredData[0].address_line2;
    patientData["city"] = filteredData[0].city;
    patientData["state"] = filteredData[0].state;
    patientData["zip"] = filteredData[0].zip;
    patientData["customer_number"] = filteredData[0].customer_number;
    patientData["policy_number"] = filteredData[0].policy_number;
    patientData["insurance_valid_from"] = filteredData[0].insurance_valid_from;
    patientData["sub_first_name"] = filteredData[0].sub_first_name;
    patientData["sub_middle_name"] = filteredData[0].sub_middle_name;
    patientData["sub_last_name"] = filteredData[0].sub_last_name;
    patientData["relationship_to_subscriber"] =
      filteredData[0].relationship_to_subscriber;
    patientData["provider_id"] = filteredData[0].provider_id;
    patientData["specialties"] = filteredData[0].specialties;
    patientData["physician_first_name"] = filteredData[0].physician_first_name;
    patientData["physician_middle_name"] =
      filteredData[0].physician_middle_name;
    patientData["physician_last_name"] = filteredData[0].physician_last_name;
    patientData["physician_title"] = filteredData[0].physician_title;
    patientData["visit_reason"] = filteredData[0].visit_reason;
    patientData["insurance_name"] = filteredData[0]?.insurance_name;
    patientData["last_visit_date"] = filteredData[0].last_visit_date;
    setUpdatePatientInfo(patientData);
  };

  const handleClickOpen = (id) => {
    let data = gridData;
    let filteredData = data.filter((d) => d.patient_id === id);

    setFilteredPatientData(id);
    setpatientNoteData([]);
    fetchPatientNotes(id);
    fetchPatientDocuments(filteredData);

    let viewData = [...viewRecord];
    viewData = filteredData;
    setViewRecord(viewData);

    getImage(
      viewRecord.length > 0
        ? viewRecord[0].card_front_image_link != null
          ? viewRecord[0].card_front_image_link
          : ""
        : ""
    );
    expand("");
    setUploadedFiles([]);
    let type = { ...documentTypeHistory };
    type["front"] = false;
    type["back"] = false;
    setDocumentTypeHistory(type);
    setOpenViewMode(true);
  };

  const aws = require("aws-sdk");

  const benefitsRefreshLambda = async () => {
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

    try {
      // const res = await axios.post(api_url,{"PAYER_ID": payer_id, "PATIENT_FIRST_NAME": patient_first_name, "PATIENT_LAST_NAME": patient_last_name, "MEMBER_ID": member_id,  "PATIENT_BIRTH_DATE":dob,  "PROVIDER_NPI": provider_npi, "SERVICE_TYPE":service_type, "PROVIDER_TYPE": provider_type, "PROVIDER_LAST_NAME": provider_last_name});
      const res = await axios.post(api_url, {
        patient_insurance_record_id: patientData["patient_insurance_record_id"],
        refresh: refresh,
      });
      console.log(res);

      if (res["status"] == 202) {
        setBenefitsRefresh(false);
        setBenefitsButtonText("In Progress");
        setOpenViewMode2(false);
        ToastSuccess(
          "Retrieving latest benefits information, please check back in a few minutes"
        );
      } else {
        ToastError(
          "Unable to refresh benefits information. Please try again later."
        );
      }
    } catch {
      console.log("Error with refreshing patient benefits data.");
      ToastError(
        "Unable to refresh benefits information. Please try again later."
      );
    }
  };

  const benefitsLambda2 = async (patientData) => {
    // let api_url = "https://npsr1z1sf4.execute-api.us-east-2.amazonaws.com/Uat/patient_benefits_v2_async";
    // let api_url = "https://b4n7f2pnyb.execute-api.us-east-1.amazonaws.com/dev/patient_benefits_v2_async";

    let api_url = process.env.REACT_APP_BEATS_FETCH_BENEFITS_DETAILS;

    let patient_insurance_record_id = parseInt(
      patientData["patient_insurance_record_id"]
    );
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
      if (service.data[j].service_type_Id == service_type) {
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
      if (payer.data[i].payor_external_id == patientData["payer_id"]) {
        setPayerName(payer.data[i].payor_name);
      }
    }

    try {
      // const res = await axios.post(api_url,{"PAYER_ID": payer_id, "PATIENT_FIRST_NAME": patient_first_name, "PATIENT_LAST_NAME": patient_last_name, "MEMBER_ID": member_id,  "PATIENT_BIRTH_DATE":dob,  "PROVIDER_NPI": provider_npi, "SERVICE_TYPE":service_type, "PROVIDER_TYPE": provider_type, "PROVIDER_LAST_NAME": provider_last_name});
      const res = await axios.post(api_url, {
        patient_insurance_record_id: patient_insurance_record_id,
        refresh: "no",
      });
      console.log(res["data"]);

      const response = res["data"];

      if ("meta" in response) {
        if ("datetimeOfQuery" in response["meta"]) {
          setDatetimeOfQuery(response["meta"]["datetimeOfQuery"]);
        }
        if ("benefits_last_verified_time" in response["meta"]) {
          setBenefitsLastVerifiedTime(
            response["meta"]["benefits_last_verified_time"]
          );
        }
        if ("benefits_pull_status" in response["meta"]) {
          setBenefitsPullStatus(response["meta"]["benefits_pull_status"]);
          if (response["meta"]["benefits_pull_status"] == "Complete") {
            setBenefitsRefresh(true);
            setBenefitsButtonText("Refresh");
          } else {
            setBenefitsRefresh(false);
            setBenefitsButtonText("In Progress");
            setOpenViewMode2(false);
            ToastSuccess(
              "Retrieving latest benefits information, please check back in a few minutes"
            );
            return;
          }
        }
      }
      if ("contactInfo" in response) {
        var levelRows = [];
        var levelKey;
        var collapsibleLocal = [];
        var rows;

        for (levelKey in response["contactInfo"]) {
          for (rows in response["contactInfo"][levelKey]) {
            console.log(response["contactInfo"][levelKey][rows]);

            levelRows.push(response["contactInfo"][levelKey][rows]);
          }
          var triggerNamePlus = "+ " + levelKey;
          var triggerNameMinus = "- " + levelKey;
          collapsibleLocal.push(
            <Collapsible
              trigger={triggerNamePlus}
              triggerWhenOpen={triggerNameMinus}
              triggerStyle={{
                fontWeight: "bold",
                color: "gray",
                textAlign: "left",
                marginLeft: "1rem",
                cursor: "pointer",
              }}
            >
              <MaterialTable
                // title="In-Network Individual Benefits"
                data={levelRows}
                columns={contactInfoColumns}
                options={{
                  toolbar: false,
                  showTitle: false,
                  search: false,
                  paging: false,
                  filtering: false,
                  exportButton: false,
                }}
              />
            </Collapsible>
          );

          collapsibleLocal.push(
            <Grid item xs={12}>
              <Grid className="detail-list" container spacing={2}>
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className="details-label"></Grid>
                    <Grid item xs={12} className="details-value"></Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
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
        { title: "Part A", available: medicarePartAAvailable },
        { title: "Part B", available: medicarePartBAvailable },
        { title: "Part C", available: medicarePartCAvailable },
        { title: "Part D", available: medicarePartDAvailable },
      ];

      if (response["insurance"]["payerId"] == "CMS") {
        setNoDataAvailable(false);
        setMedicareTrigger(true);
        setMedicareAdditionalPayers(response["additionalPayers"]);

        if ("Medicare Part A" in response["No Network"]) {
          levelPartRows.push({ title: "Part A", available: "âœ”" });
        } else {
          levelPartRows.push({ title: "Part A", available: "" });
        }
        if ("Medicare Part B" in response["No Network"]) {
          levelPartRows.push({ title: "Part B", available: "âœ”" });
        } else {
          levelPartRows.push({ title: "Part B", available: "" });
        }
        if ("Medicare Part C" in response["No Network"]) {
          levelPartRows.push({ title: "Part C", available: "âœ”" });
        } else {
          levelPartRows.push({ title: "Part C", available: "" });
        }
        if ("Medicare Part D" in response["No Network"]) {
          levelPartRows.push({ title: "Part D", available: "âœ”" });
        } else {
          levelPartRows.push({ title: "Part D", available: "" });
        }

        collapsibleMedPartLocal.push(
          <MaterialTable
            // title="In-Network Individual Benefits"
            data={levelPartRows}
            columns={medicarePartTableColumns}
            options={{
              toolbar: false,
              showTitle: false,
              search: false,
              paging: false,
              filtering: false,
              exportButton: false,
            }}
          />
        );

        for (levelKey in response["No Network"]) {
          for (rows in response["No Network"][levelKey]) {
            console.log(response["No Network"][levelKey][rows]);

            levelRows.push(response["No Network"][levelKey][rows]);
          }
          var triggerNamePlus = "+ " + levelKey;
          var triggerNameMinus = "- " + levelKey;

          collapsibleLocal.push(
            <Grid item xs={12}>
              <Grid className="detail-list" container spacing={2}>
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className="details-label"></Grid>
                    <Grid item xs={12} className="details-value"></Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );

          collapsibleLocal.push(
            <Collapsible
              trigger={triggerNamePlus}
              triggerWhenOpen={triggerNameMinus}
              triggerStyle={{
                fontWeight: "bold",
                color: "gray",
                textAlign: "left",
                marginLeft: "1rem",
                cursor: "pointer",
              }}
            >
              <MaterialTable
                // title="In-Network Individual Benefits"
                data={levelRows}
                columns={medicareTableColumns}
                options={{
                  toolbar: false,
                  showTitle: false,
                  search: false,
                  paging: false,
                  filtering: false,
                  exportButton: false,
                }}
              />
            </Collapsible>
          );

          levelRows = [];
          // console.log(collapsible);
        }

        setMedicareCollapsible([]);
        setMedicareCollapsible(collapsibleLocal);

        setMedicarePartCollapsible([]);
        setMedicarePartCollapsible(collapsibleMedPartLocal);

        var collapsibleLocal = [];
        var levelRows = [];
      } else if ("In Network" in response) {
        setNoDataAvailable(false);
        setMedicareTrigger(false);
        for (levelKey in response["Not Applicable Network"]) {
          for (rows in response["Not Applicable Network"][levelKey]) {
            console.log(response["Not Applicable Network"][levelKey][rows]);

            levelRows.push(response["Not Applicable Network"][levelKey][rows]);
          }
          var triggerNamePlus = "+ " + levelKey;
          var triggerNameMinus = "- " + levelKey;
          collapsibleLocal.push(
            <Collapsible
              trigger={triggerNamePlus}
              triggerWhenOpen={triggerNameMinus}
              triggerStyle={{
                fontWeight: "bold",
                color: "gray",
                textAlign: "left",
                marginLeft: "1rem",
                cursor: "pointer",
              }}
            >
              <MaterialTable
                // title="In-Network Individual Benefits"
                data={levelRows}
                columns={benefitsTableColumns}
                options={{
                  toolbar: false,
                  showTitle: false,
                  search: false,
                  paging: false,
                  filtering: false,
                  exportButton: false,
                }}
              />
            </Collapsible>
          );

          collapsibleLocal.push(
            <Grid item xs={12}>
              <Grid className="detail-list" container spacing={2}>
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className="details-label"></Grid>
                    <Grid item xs={12} className="details-value"></Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
          levelRows = [];
          // console.log(collapsible);
        }

        setNACollapsible([]);
        setNACollapsible(collapsibleLocal);
        console.log(NACollapsible);

        var collapsibleLocal = [];
        var levelRows = [];

        for (levelKey in response["In Network"]) {
          for (rows in response["In Network"][levelKey]) {
            console.log(response["In Network"][levelKey][rows]);

            levelRows.push(response["In Network"][levelKey][rows]);
          }
          var triggerNamePlus = "+ " + levelKey;
          var triggerNameMinus = "- " + levelKey;
          collapsibleLocal.push(
            <Collapsible
              trigger={triggerNamePlus}
              triggerWhenOpen={triggerNameMinus}
              triggerStyle={{
                fontWeight: "bold",
                color: "gray",
                textAlign: "left",
                marginLeft: "1rem",
                cursor: "pointer",
              }}
            >
              <MaterialTable
                // title="In-Network Individual Benefits"
                data={levelRows}
                columns={benefitsTableColumns}
                options={{
                  toolbar: false,
                  showTitle: false,
                  search: false,
                  paging: false,
                  filtering: false,
                  exportButton: false,
                }}
              />
            </Collapsible>
          );

          collapsibleLocal.push(
            <Grid item xs={12}>
              <Grid className="detail-list" container spacing={2}>
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className="details-label"></Grid>
                    <Grid item xs={12} className="details-value"></Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
          levelRows = [];
          // console.log(collapsible);
        }

        setInCollapsible([]);
        setInCollapsible(collapsibleLocal);

        var collapsibleLocal = [];
        var levelRows = [];

        for (levelKey in response["Out of Network"]) {
          for (rows in response["Out of Network"][levelKey]) {
            console.log(response["Out of Network"][levelKey][rows]);

            levelRows.push(response["Out of Network"][levelKey][rows]);
          }
          var triggerNamePlus = "+ " + levelKey;
          var triggerNameMinus = "- " + levelKey;
          collapsibleLocal.push(
            <Collapsible
              trigger={triggerNamePlus}
              triggerWhenOpen={triggerNameMinus}
              triggerStyle={{
                fontWeight: "bold",
                color: "gray",
                textAlign: "left",
                marginLeft: "1rem",
                cursor: "pointer",
              }}
            >
              <MaterialTable
                // title="In-Network Individual Benefits"
                data={levelRows}
                columns={benefitsTableColumns}
                options={{
                  toolbar: false,
                  showTitle: false,
                  search: false,
                  paging: false,
                  filtering: false,
                  exportButton: false,
                }}
              />
            </Collapsible>
          );
          collapsibleLocal.push(
            <Grid item xs={12}>
              <Grid className="detail-list" container spacing={2}>
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className="details-label"></Grid>
                    <Grid item xs={12} className="details-value"></Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
          levelRows = [];

          // console.log(collapsible);
        }

        setOutCollapsible([]);
        setOutCollapsible(collapsibleLocal);

        var collapsibleLocal = [];
        var levelRows = [];

        for (levelKey in response["No Network"]) {
          for (rows in response["No Network"][levelKey]) {
            console.log(response["No Network"][levelKey][rows]);

            levelRows.push(response["No Network"][levelKey][rows]);
          }
          var triggerNamePlus = "+ " + levelKey;
          var triggerNameMinus = "- " + levelKey;
          collapsibleLocal.push(
            <Collapsible
              trigger={triggerNamePlus}
              triggerWhenOpen={triggerNameMinus}
              triggerStyle={{
                fontWeight: "bold",
                color: "gray",
                textAlign: "left",
                marginLeft: "1rem",
                cursor: "pointer",
              }}
            >
              <MaterialTable
                // title="In-Network Individual Benefits"
                data={levelRows}
                columns={benefitsTableColumns}
                options={{
                  toolbar: false,
                  showTitle: false,
                  search: false,
                  paging: false,
                  filtering: false,
                  exportButton: false,
                }}
              />
            </Collapsible>
          );

          collapsibleLocal.push(
            <Grid item xs={12}>
              <Grid className="detail-list" container spacing={2}>
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className="details-label"></Grid>
                    <Grid item xs={12} className="details-value"></Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
          levelRows = [];
          // console.log(collapsible);
        }

        setNoCollapsible([]);
        setNoCollapsible(collapsibleLocal);

        var collapsibleLocal = [];
        var levelRows = [];

        if ("Specialty" in response) {
          console.log(response["Specialty"]);

          for (levelKey in response["Specialty"]) {
            for (rows in response["Specialty"][levelKey]) {
              console.log(response["Specialty"][levelKey][rows]);

              levelRows.push(response["Specialty"][levelKey][rows]);
            }
            var triggerNamePlus = "+ " + levelKey;
            var triggerNameMinus = "- " + levelKey;
            collapsibleLocal.push(
              <Collapsible
                trigger={triggerNamePlus}
                triggerWhenOpen={triggerNameMinus}
                triggerStyle={{
                  fontWeight: "bold",
                  color: "gray",
                  textAlign: "left",
                  marginLeft: "1rem",
                  cursor: "pointer",
                }}
              >
                <MaterialTable
                  // title="In-Network Individual Benefits"
                  data={levelRows}
                  columns={benefitsSpecialtyTableColumns}
                  options={{
                    toolbar: false,
                    showTitle: false,
                    search: false,
                    paging: false,
                    filtering: false,
                    exportButton: false,
                  }}
                />
              </Collapsible>
            );

            collapsibleLocal.push(
              <Grid item xs={12}>
                <Grid className="detail-list" container spacing={2}>
                  <Grid item xs={6}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} className="details-label"></Grid>
                      <Grid item xs={12} className="details-value"></Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            );
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
      } else {
        setNoDataAvailable(true);
        setMedicareTrigger(false);
      }

      setOpenViewMode2(true);
    } catch {
      console.log("error");

      setNoDataAvailable(true);
      setMedicareTrigger(false);
      setOpenViewMode2(true);

      //return different component, also for medicare
    }
  };

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
    setOpenViewMode3(false);
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
    setUploadedFiles([]);
    let type = { ...documentTypeHistory };
    type["front"] = false;
    type["back"] = false;
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

  const onFileChangeNew = async (docTypeInt, event) => {
    if (event.target.files.length === 0) {
      let type = { ...documentTypeHistory };
      if (docTypeInt === "1") {
        type["front"] = false;
      } else if (docTypeInt === "2") {
        type["back"] = false;
      } else {
        type["combined"] = false;
      }
      setDocumentTypeHistory(type);
      return;
    }

    const imgPreview =
      docTypeInt === "1"
        ? document.getElementById("img1-preview")
        : document.getElementById("img2-preview");
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
    const result = await toBase64(event.target.files[0]).catch((e) => Error(e));
    if (result instanceof Error) {
      console.log("Error: ", result.message);
      return;
    }
    let filename = event.target.files[0].name;
    // convertedFile = result.replace(/^data:image\/\w+;base64,/, "")
    let convertedFile = result.split(",")[1];
    data.append("file", convertedFile);
    let fileData = {
      fileData: convertedFile,
    };
    setUploadedFiles([]);
    let config = {
      method: "post",
      url: process.env
        .REACT_APP_BEATS_MANUALOBONARDING_PATIENT_DOCUMENT_UPLOAD_API,
      headers: {
        "Content-Type": "application/json",
        filename: filename,
        patientId: parseInt(toUpdatePatientInfo["patient_id"]),
        "type-of-side": docTypeInt,
        "type-of-file": event.target.files[0].type,
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
      data: fileData,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        setEditedFlag(true);
        setLoading(false);
        let documents = { ...patientDocuments };
        let type = { ...documentTypeHistory };
        if (docTypeInt === "1") {
          type["front"] = true;
          documents["front"] = "";
          ToastSuccess("Successfully uploaded frontside image");
        } else if (docTypeInt === "2") {
          type["back"] = true;
          documents["back"] = "";
          ToastSuccess("Successfully uploaded backside image");
        } else {
          type["combined"] = true;
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

  const onUploadReport = async () => {
    const fileToBeUploaded = reportForUpld.target.files[0];
    const result = await toBase64(fileToBeUploaded).catch((e) => Error(e));
    if (result instanceof Error) {
      console.log("Error: ", result.message);
      return;
    }
    let convertedFile = result.split(",")[1];
    let fileData = {
      fileData: convertedFile,
    };

    let config = {
      method: "post",
      url: process.env
        .REACT_APP_BEATS_MANUALOBONARDING_PATIENT_REPORT_UPLOAD_API,
      headers: {
        "Content-Type": "application/json",
        filename: fileToBeUploaded.name,
        patientid: parseInt(toUpdatePatientInfo["patient_id"]),
        "type-of-file": fileToBeUploaded.type,
        providerid: parseInt(toUpdatePatientInfo["provider_id"]), //16,//,
        preparedby: labClinician,
        description: reportDesc,
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
      data: fileData,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        setEditedFlag(true);
        setLoading(false);
        ToastSuccess("Report successfully uploaded to patient record");

        // To show the uploaded report in the list.
        fetchPatientReportInfo(toUpdatePatientInfo["patient_id"]);
        onUploadDialogClose(false);
      })
      .catch(function (error) {
        setLoading(false);
        ToastError("Failed To uploaded the patient record");
        onUploadDialogClose(false);
        console.log(error);
      });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
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

  function apptmtHandler(patientId, appt_state, appt_cancelled) {
    let currentDate = new Date();
    let currentTime =
      currentDate.getFullYear() +
      "-" +
      currentDate.getMonth() +
      1 +
      "-" +
      currentDate.getDate() +
      " " +
      currentDate.getHours() +
      ":" +
      currentDate.getMinutes() +
      ":" +
      currentDate.getSeconds();

    let data = {
      patient_id: parseInt(patientId),
    };

    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_UPDATE_PATIENT_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
      data: data,
    };

    if (appt_state != "Checked In" && appt_cancelled != 1) {
      data["apptmt_state"] = "Checked In";
      data["check_in_time"] = currentTime;

      setLoading(true);
      axios(config)
        .then((response) => {
          // setApptmtState('Check Out');
          let newApptState = "Checked In";
          let patientData = gridData.filter(
            (patient) => patient.patient_id == patientId
          );
          patientData[0].appt_state = newApptState;

          setGridData(gridData);
          setLoading(false);
          ToastSuccess("Checked in successfully");
        })
        .catch((error) => {
          setLoading(false);
          ToastError("Failed to check in");
          console.log(error);
        });
    } else if (appt_state == "Checked In") {
      // On check out button click.
      data["apptmt_state"] = "Checked Out";
      data["check_out_time"] = currentTime;

      setLoading(true);
      axios(config)
        .then((response) => {
          // setApptmtState('Visit Complete');
          // setDisableCheckOutBtn(true);

          let newApptState = "Checked Out";
          let patientData = gridData.filter(
            (patient) => patient.patient_id == patientId
          );
          patientData[0].appt_state = newApptState;
          setGridData(gridData);

          setLoading(false);
          ToastSuccess("Checked out successfully");
        })
        .catch((error) => {
          setLoading(false);
          ToastError("Failed to check out");
          console.log(error);
        });
    }
  }

  const onCancelApptmt = (patientId) => {
    let patient_id = parseInt(patientId);
    setPatientId(patient_id);
    handleCancelApptmtOpen();
  };

  const apptmtCancelHandler = () => {
    let deletePaitentId = patientID;
    setConfirmCancelApptmtOpen(false);
    let data = {
      patient_id: deletePaitentId,
      apptmt_state: "Cancel",
    };

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
      .then((response) => {
        let newApptState = 1;
        let patientData = gridData.filter(
          (patient) => patient.patient_id == deletePaitentId
        );
        patientData[0].appt_cancelled = newApptState;
        setGridData(gridData);

        setLoading(false);
        setPatientId("");
        ToastSuccess("Appointment cancelled successfully");
      })
      .catch((error) => {
        setLoading(false);
        setPatientId("");
        ToastError("Failed to cancel appointment");
        console.log(error);
      });
  };

  const needToRefetchData = () => {
    fetchData();
  };

  // Handle, to display empty instead of 'null' in UI when there is no subscriber name.
  // API is returning null whether there is no subscriber name by default.
  const subscriberName =
    viewRecord.length > 0
      ? viewRecord[0].sub_first_name
        ? viewRecord[0].sub_first_name
        : "" + viewRecord[0].sub_middle_name
          ? viewRecord[0].sub_middle_name
          : "" + viewRecord[0].sub_last_name
            ? viewRecord[0].sub_last_name
            : ""
      : "";

  const getPhyName = (arr) => {
    let x = "";
    arr.forEach((n) => {
      if (n) {
        x += n.trim();
        x = x + " ";
      }
    });

    return x.trim();
  };

  // Checkes whether d1 is past date (d1<d2).
  const isPastDate = (d1, d2) => {
    return d1.getFullYear() <= d2.getFullYear() &&
      d1.getMonth() <= d2.getMonth() &&
      d1.getDate() < d2.getDate()
  }

  // Checks whether it is current date.
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() == today.getDate() &&
      date.getMonth() == today.getMonth() &&
      date.getFullYear() == today.getFullYear()
  }

  // Get formatted date and time
  const getFormattedDateAndTime = (date) => {
    const [month, day, year, hour, minutes] = [
      date.getMonth() + 1,
      date.getDate(),
      date.getFullYear(),
      date.getHours(),
      date.getMinutes(),
    ];
    const monthList = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthName = month ? monthList[month] : "";
    const dateAndTime = `${monthName} ${day} ${year} ${hour}:${minutes} ${(hour <= 12 ? "am" : "pm")}`;

    return dateAndTime;
  }

  return (
    <div className={classes.root}>
      <Dialog
        className="mainpopup2 reportspopup"
        maxWidth={"sm"}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openViewModel3}
        scroll="paper"
        style={{ margin: "auto", left: "0!important" }}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Notes / Reports
        </DialogTitle>

        <DialogContent dividers className="contoverflow">
          <Paper elevation={0}>
            <Grid container spacing={3} justify="center">
              <Grid item xs={12}>
                <Grid container spacing={1} justify="center">
                  <Grid item xs={12} className="mb20">
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
                        className="details-label redcolor"
                      >
                        Add Notes{" "}
                        <AddCircleOutlineIcon
                          className="addicon"
                          onClick={() => openNotes(true)}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={3}>
                    <Grid container className="detail-list" spacing={1}>
                      <Grid
                        item
                        xs={12}
                        justify="center"
                        className="custom-head-txt"
                      >
                        Last Updated Date/Time
                      </Grid>
                      {/* <Grid item xs={12} className="details-value">
                                <div>
                                  Nov 11, 2021
                                </div>
                              </Grid> */}
                    </Grid>
                  </Grid>
                  <Grid item xs={3}>
                    <Grid container className="detail-list" spacing={1}>
                      <Grid
                        item
                        xs={12}
                        justify="center"
                        className="custom-head-txt"
                      >
                        Doctor
                      </Grid>
                      {/* <Grid item xs={12} className="details-value">
                                <div>
                                   Dr.Rajesh Sekar
                                </div>
                              </Grid> */}
                    </Grid>
                  </Grid>

                  <Grid item xs={6}>
                    <Grid container className="detail-list" spacing={1}>
                      <Grid
                        item
                        xs={12}
                        justify="center"
                        className="custom-head-txt"
                      >
                        Notes
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* <Grid item xs={10} className="details-value notesdesc">
                               
                                 Notes description to be shown fully, instead of being cut off.Notes description to be shown fully, 
                                 instead of being cut off.Notes description to be shown fully, instead of being cut off.Notes description to be shown fully, instead of being cut off.Notes description to be shown fully,
                                   instead of being cut off.Notes description to be shown fully, instead of being cut off.
                               
                                
                              </Grid>  */}
                  <Grid container
                    style={{ flexGrow: 1, flexDirection: "column", maxHeight: "170px", minHeight: "auto", display: 'flex' }}
                  >
                    <Grid container justify="center" style={{ marginTop: "20px", marginBottom: "10px", flexGrow: 1, overflow: "auto", height: "auto" }}>
                      {
                        SortedPatientNoteDataList(patientNoteData).map((patientData) => {
                          const phyName =
                            toUpdatePatientInfo["physician_title"] +
                            "" +
                            toUpdatePatientInfo["physician_first_name"] +
                            "" +
                            toUpdatePatientInfo["physician_middle_name"] +
                            "" +
                            toUpdatePatientInfo["physician_last_name"];

                          const date = new Date(patientData.time);
                          console.log("patientData.time : ", patientData.time);
                          console.log("new Date(patientData.time); : ", date);
                          console.log("new Date(patientData.time).getTime(); : ", date.getTime());
                          const dateAndTime = getFormattedDateAndTime(date);
                          return (
                            <>
                              <Grid item xs={3} className="details-label">
                                {Date_time_format(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes())}
                              </Grid>
                              <Grid item xs={3} className="details-label">
                                {phyName}
                              </Grid>
                              <Grid item xs={5} className="details-label">
                                {patientData.desc}
                              </Grid>

                              <Grid item xs={1} className="closeicon notescloseicon">
                                <CreateSharpIcon
                                  onClick={() => {
                                    openNotes(true);
                                    setOpenViewMode3(true);
                                    setPatientNoteId(patientData?.id);

                                  }}
                                />
                                <HighlightOffIcon
                                  className="deleteicon"
                                  onClick={() => {
                                    if (patientData?.id) {
                                      setPatientDataHaveId(patientData?.id);
                                      setOpenDeleteConfirmDailogInNotes(true);
                                    }

                                    //var isAlertValue = window.confirm("Are you sure delete now ?");
                                    //if (isAlertValue) { saveNotes("", patientData?.id, "Delete"); }
                                  }}
                                />
                              </Grid>
                            </>
                          );
                        })}


                    </Grid>
                    {/* </Grid>*/}


                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Divider variant="middle" className="dividercls" />

            <Grid container spacing={3} justify="center">
              <Grid item xs={12}>
                <Grid container spacing={1} justify="center">
                  <Grid item xs={12} className="mb20">
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
                        className="details-label redcolor"
                      >
                        Upload Documents / Reports{" "}
                        <AddCircleOutlineIcon
                          className="addicon"
                          onClick={() => setOpenUploadDialog(true)}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={3}>
                    <Grid container className="detail-list" spacing={1}>
                      <Grid
                        item
                        xs={12}
                        justify="center"
                        className="custom-head-txt"
                      >
                        Uploaded Date/Time
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={3}>
                    <Grid container className="detail-list" spacing={1}>
                      <Grid
                        item
                        xs={12}
                        justify="center"
                        className="custom-head-txt"
                      >
                        Type of Report
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={4}>
                    <Grid container className="detail-list" spacing={1}>
                      <Grid
                        item
                        xs={12}
                        justify="center"
                        className="custom-head-txt"
                      >
                        Report Description
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={2}>
                    <Grid container className="detail-list" spacing={1}>
                      <Grid
                        item
                        xs={12}
                        justify="center"
                        className="custom-head-txt"
                      >
                        View Report
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container
                    style={{ flexGrow: 1, flexDirection: "column", maxHeight: "170px", minHeight: "auto", display: 'flex' }}
                  >
                    <Grid container justify="center" style={{ marginTop: "20px", marginBottom: "10px", flexGrow: 1, overflow: "auto", height: "auto" }}>


                      {patientReportData.map((reportData) => {
                        const reportUrl = reportData.fileLocation;
                        const date = new Date(reportData.createdTime);
                        const dateAndTime = getFormattedDateAndTime(date);
                        return (
                          <>
                            <Grid item xs={3} className="details-value">

                              {Date_time_format(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes())}

                            </Grid>
                            <Grid item xs={3} className="details-value">
                              {reportData.preparedBy}
                            </Grid>
                            <Grid item xs={4} className="details-value">
                              {reportData.description}
                            </Grid>
                            <Grid item xs={1} className="details-value">
                              <div
                                onClick={() => {
                                  downloadReport(reportUrl);
                                }}
                              >
                                <PictureAsPdfIcon />
                              </div>
                            </Grid>
                            <Grid item xs={1} className="closeicon closeicondelete" style={{ textAlign: "right", paddingRight: "10px" }}>
                              <HighlightOffIcon
                                className="deleteicon"
                                onClick={() => {
                                  deletePatientReport(reportData?.id);
                                }} />
                            </Grid>
                          </>
                        );
                      })}

                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

          </Paper>
        </DialogContent>
      </Dialog>

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
      <main main id="maindiv" className={classes.content + "Confirm-popup"}>
        <div className="">
          {
            openDeleteConfirmDailogInNotes && (<
              ConfirmationDialog className="cancelbox"
              description="Are you sure you want to delete this note ?"
              show={
                openDeleteConfirmDailogInNotes
              }
              onYesClick={
                () => {
                  if (openDeleteConfirmDailogInNotes) {
                    saveNotes("", patientDataHaveId, "Delete");
                    setOpenDeleteConfirmDailogInNotes(false);
                  }
                  setOpenDeleteConfirmDailogInNotes(false);
                }
              }
              onNoClick={
                () => {
                  setOpenDeleteConfirmDailogInNotes(false);
                }
              }
            />
            )
          }
          {notesCompOpen && (
            <NotesDialog
              open={notesCompOpen}
              saveNotes={saveNotes}
              data={patientNoteData}
              noteId={patientNoteId || ""}
              closeNotes={() => {
                openNotes(false);
                setPatientNoteId("");
              }}
            />
          )}
          {openUploadDialog && (
            <ReportUploadDialog
              open={openUploadDialog}
              onClose={onUploadDialogClose}
              onUploadReport={onUploadReport}
              desc={reportDesc}
              setDesc={(description) => setReportDesc(description)}
              labClinician={labClinician}
              setLabClinician={(name) => setLabClinician(name)}
              report={reportForUpld}
              setReport={(e) => setReportForUpld(e)}
            />
          )}
          {confirmOpen && (
            <ConfirmationDialog
              description="Are you sure you want to cancel this appointment?"
              show={confirmOpen}
              onYesClick={handleConfirmDelete}
              onNoClick={handleConfirmClose}
            />
          )}
          {confirmCancelApptmtOpen && (
            <ConfirmationDialog
              className="cancelbox"
              description="Are you sure you want to cancel the appointment?"
              show={confirmCancelApptmtOpen}
              onYesClick={apptmtCancelHandler}
              onNoClick={handleConfirmApptmtClose}
            />
          )}
        </div>

        <div className={classes.root}>
          <Grid container spacing={3}>
            {noDataAvailable ? (
              <Dialog
                className="mainpopup2 reportspopup"
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
                                <div>{networkType}</div>
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
                            <Grid item xs={12} className="details-label"></Grid>
                            <Grid item xs={12} className="details-value"></Grid>
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
                            <Grid item xs={12} className="details-value"></Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Divider variant="middle" className="dividercls" />
                    <Collapsible
                      trigger="+ Contact Info"
                      triggerWhenOpen="- Contact Info"
                      triggerStyle={{
                        fontWeight: "bold",
                        color: "gray",
                        textAlign: "left",
                        marginLeft: "0rem",
                        cursor: "pointer",
                      }}
                    >
                      <Grid item xs={12}>
                        <Grid className="detail-list" container spacing={2}>
                          <Grid item xs={6}>
                            <Grid container spacing={1}>
                              <Grid
                                item
                                xs={12}
                                className="details-label"
                              ></Grid>
                              <Grid
                                item
                                xs={12}
                                className="details-value"
                              ></Grid>
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
              </Dialog>
            ) : (
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
                    <DialogTitle
                      id="customized-dialog-title"
                      onClose={handleClose}
                    >
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
                                <Grid
                                  container
                                  className="detail-list"
                                  spacing={1}
                                >
                                  <Grid
                                    item
                                    xs={12}
                                    justify="center"
                                    className="details-label"
                                  >
                                    Network Type
                                  </Grid>
                                  <Grid item xs={12} className="details-value">
                                    <div>{networkType}</div>
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
                                  <Grid
                                    item
                                    xs={12}
                                    className="details-label"
                                  ></Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    className="details-value"
                                  ></Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Divider variant="middle" className="dividercls" />
                        <Collapsible
                          trigger="+ In Network"
                          triggerWhenOpen="- In Network"
                          triggerStyle={{
                            fontWeight: "bold",
                            color: "gray",
                            textAlign: "left",
                            marginLeft: "0rem",
                            cursor: "pointer",
                          }}
                        >
                          <Grid item xs={12}>
                            <Grid className="detail-list" container spacing={2}>
                              <Grid item xs={6}>
                                <Grid container spacing={1}>
                                  <Grid
                                    item
                                    xs={12}
                                    className="details-label"
                                  ></Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    className="details-value"
                                  ></Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>

                          {inCollapsible}
                        </Collapsible>

                        <Divider variant="middle" className="dividercls" />

                        <Collapsible
                          trigger="+ Out-of-Network"
                          triggerWhenOpen="- Out-of-Network"
                          triggerStyle={{
                            fontWeight: "bold",
                            color: "gray",
                            textAlign: "left",
                            marginLeft: "0rem",
                            cursor: "pointer",
                          }}
                        >
                          <Grid item xs={12}>
                            <Grid className="detail-list" container spacing={2}>
                              <Grid item xs={6}>
                                <Grid container spacing={1}>
                                  <Grid
                                    item
                                    xs={12}
                                    className="details-label"
                                  ></Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    className="details-value"
                                  ></Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>

                          {outCollapsible}
                        </Collapsible>

                        <Divider variant="middle" className="dividercls" />

                        <Collapsible
                          trigger="+ Not-Applicable-Network (common to both networks)"
                          triggerWhenOpen="- Not-Applicable-Network (common to both networks)"
                          triggerStyle={{
                            fontWeight: "bold",
                            color: "gray",
                            textAlign: "left",
                            marginLeft: "0rem",
                            cursor: "pointer",
                          }}
                        >
                          <Grid item xs={12}>
                            <Grid className="detail-list" container spacing={2}>
                              <Grid item xs={6}>
                                <Grid container spacing={1}>
                                  <Grid
                                    item
                                    xs={12}
                                    className="details-label"
                                  ></Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    className="details-value"
                                  ></Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>

                          {NACollapsible}
                        </Collapsible>
                        <Divider variant="middle" className="dividercls" />

                        <Collapsible
                          trigger="+ No Network"
                          triggerWhenOpen="- No Network"
                          triggerStyle={{
                            fontWeight: "bold",
                            color: "gray",
                            textAlign: "left",
                            marginLeft: "0rem",
                            cursor: "pointer",
                          }}
                        >
                          <Grid item xs={12}>
                            <Grid className="detail-list" container spacing={2}>
                              <Grid item xs={6}>
                                <Grid container spacing={1}>
                                  <Grid
                                    item
                                    xs={12}
                                    className="details-label"
                                  ></Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    className="details-value"
                                  ></Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>

                          {noCollapsible}
                        </Collapsible>

                        <Divider variant="middle" className="dividercls" />
                        <Collapsible
                          trigger="+ Specialty"
                          triggerWhenOpen="- Specialty"
                          triggerStyle={{
                            fontWeight: "bold",
                            color: "gray",
                            textAlign: "left",
                            marginLeft: "0rem",
                            cursor: "pointer",
                          }}
                        >
                          <Grid item xs={12}>
                            <Grid className="detail-list" container spacing={2}>
                              <Grid item xs={6}>
                                <Grid container spacing={1}>
                                  <Grid
                                    item
                                    xs={12}
                                    className="details-label"
                                  ></Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    className="details-value"
                                  ></Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>

                          {specialtyCollapsible}
                        </Collapsible>

                        <Divider variant="middle" className="dividercls" />

                        <Collapsible
                          trigger="+ Contact Info"
                          triggerWhenOpen="- Contact Info"
                          triggerStyle={{
                            fontWeight: "bold",
                            color: "gray",
                            textAlign: "left",
                            marginLeft: "0rem",
                            cursor: "pointer",
                          }}
                        >
                          <Grid item xs={12}>
                            <Grid className="detail-list" container spacing={2}>
                              <Grid item xs={6}>
                                <Grid container spacing={1}>
                                  <Grid
                                    item
                                    xs={12}
                                    className="details-label"
                                  ></Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    className="details-value"
                                  ></Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>

                          {contactInfoCollapsible}
                        </Collapsible>

                        <Divider variant="middle" className="dividercls" />

                        <Button
                          variant="contained"
                          className={
                            benefitsRefresh ? "btn-primary" : "btn-disabled"
                          }
                          disabled={!benefitsRefresh}
                          onClick={() => {
                            benefitsRefreshLambda();
                          }}
                          // onClick={benefitsRefreshLambda()}
                          style={{ marginLeft: "11rem" }}
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
                ) : (
                  <Dialog
                    className="mainpopup2"
                    maxWidth={"sm"}
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={openViewModel2}
                    scroll="paper"
                    style={{ margin: "auto", left: "0!important" }}
                  >
                    <DialogTitle
                      id="customized-dialog-title"
                      onClose={handleClose}
                    >
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
                                <Grid
                                  container
                                  className="detail-list"
                                  spacing={1}
                                >
                                  <Grid
                                    item
                                    xs={12}
                                    justify="center"
                                    className="details-label"
                                  >
                                    Network Type
                                  </Grid>
                                  <Grid item xs={12} className="details-value">
                                    <div>{networkType}</div>
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

                        <Collapsible
                          trigger="+ Medicare Parts"
                          triggerWhenOpen="- Medicare Parts"
                          triggerStyle={{
                            fontWeight: "bold",
                            color: "gray",
                            textAlign: "left",
                            marginLeft: "0rem",
                            cursor: "pointer",
                          }}
                        >
                          {medicareCollapsible}
                        </Collapsible>

                        <Divider variant="middle" className="dividercls" />

                        <Collapsible
                          trigger="+ Contact Info"
                          triggerWhenOpen="- Contact Info"
                          triggerStyle={{
                            fontWeight: "bold",
                            color: "gray",
                            textAlign: "left",
                            marginLeft: "0rem",
                            cursor: "pointer",
                          }}
                        >
                          <Grid item xs={12}>
                            <Grid className="detail-list" container spacing={2}>
                              <Grid item xs={6}>
                                <Grid container spacing={1}>
                                  <Grid
                                    item
                                    xs={12}
                                    className="details-label"
                                  ></Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    className="details-value"
                                  ></Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>

                          {contactInfoCollapsible}
                        </Collapsible>

                        <Divider variant="middle" className="dividercls" />

                        <Button
                          variant="contained"
                          className={
                            benefitsRefresh ? "btn-primary" : "btn-disabled"
                          }
                          disabled={!benefitsRefresh}
                          onClick={() => {
                            benefitsRefreshLambda();
                          }}
                          // onClick={benefitsRefreshLambda()}
                          style={{ marginLeft: "11rem" }}
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
                  </Dialog>
                )}
              </div>
            )}

            <Dialog
              className="mainpopup"
              maxWidth={"sm"}
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              // open={openViewModel}
              open={
                openViewModel3 ?
                  false : openViewModel
              }
              scroll="paper"
              style={{ margin: "auto", left: "0!important", zIndex: "1200" }}
            >
              <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Patient Details  {" "}
                {viewRecord.length > 0
                  ? "(#" + viewRecord[0].patient_id + ")"
                  : ""}
              </DialogTitle>

              <DialogContent dividers>
                <Paper elevation={0}>
                  <Grid container spacing={3} justify="star">
                    <Grid item xs={12}>
                      <Grid container spacing={1} justify="">
                        <Grid item xs={6}>
                          <Grid
                            container
                            spacing={2}
                            justify=""
                            alignItems=" "
                            className="detail-list"
                          >
                            <Grid
                              item
                              xs={12}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              <span
                                style={{
                                  display:
                                    tabState !== "view"
                                      ? "none"
                                      : "inline-block",
                                }}
                              >
                                {" "}
                                Patient Full Name{" "}
                              </span>{" "}
                              <CreateSharpIcon
                                style={{
                                  display:
                                    tabState !== "view"
                                      ? "none"
                                      : "inline-block",
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
                              <label
                                className="formlabel"
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                              >
                                First Name
                              </label>
                              <BootstrapInput
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                                className="primary-input mb20 width100p   formlabel"
                                placeholder=""
                                value={toUpdatePatientInfo.pfname}
                                onChange={(e) => {
                                  setpatientUpdatedData(
                                    "pfname",
                                    e.target.value
                                  );
                                }}
                              />
                              <label
                                className="formlabel"
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                              >
                                Middle Name
                              </label>
                              <BootstrapInput
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                                className="primary-input mb20 width100p formlabel"
                                placeholder=""
                                value={toUpdatePatientInfo.middle_name}
                                onChange={(e) => {
                                  setpatientUpdatedData(
                                    "middle_name",
                                    e.target.value
                                  );
                                }}
                              />

                              <label
                                className="formlabel"
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                              >
                                Last Name
                              </label>

                              <BootstrapInput
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                                className="primary-input mb20 width100p "
                                placeholder=""
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
                          <Grid container spacing={1} className="detail-list">
                            <Grid item xs={6} className="details-label">
                              Gender
                            </Grid>
                            <Grid
                              item
                              xs={6}
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
                                  ? viewRecord[0].gender
                                  : ""}
                              </span>
                              <BootstrapInput
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none", marginTop: "12px",
                                }}
                                className="primary-input mb20 width100p mt10"
                                placeholder=""
                                value={toUpdatePatientInfo.gender}
                                onChange={(e) => {
                                  setpatientUpdatedData(
                                    "gender",
                                    e.target.value
                                  );
                                }}
                              ></BootstrapInput>
                            </Grid>
                          </Grid>
                        </Grid>

                        {/*  <Grid item xs={6}>
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
                        </Grid> */}

                        <Grid item xs={6}>
                          <Grid container spacing={1} className="detail-list">
                            <Grid
                              item
                              xs={12}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              Date of Birth (dd/mm/yyyy)
                              <CreateSharpIcon
                                style={{
                                  display:
                                    tabState !== "view" ? "none" : "inline-block",
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
                                    toUpdatePatientInfo.dob === null ||
                                      toUpdatePatientInfo.dob ===
                                      "0000-00-00 00:00:00"
                                      ? new Date()
                                      : toUpdatePatientInfo.dob.length === 20 ||
                                        toUpdatePatientInfo.dob.length === 24
                                        ? toUpdatePatientInfo.dob.split("T")[0] +
                                        "T12:00:00Z"
                                        : toUpdatePatientInfo.dob
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

                        <Grid item xs={3}>
                          <Grid container spacing={1} className="detail-list">
                            <Grid item xs={12} className="details-label">
                              Age
                            </Grid>
                            <Grid item xs={12} className="details-value">
                              {viewRecord.length > 0
                                ? viewRecord[0].dob !== "0000-00-00 00:00:00" &&
                                  viewRecord[0].dob !== null
                                  ? calculateAge(viewRecord[0].dob)
                                  : ""
                                : ""}
                            </Grid>
                          </Grid>
                        </Grid>




                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider variant="middle" className="dividercls" />

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Grid
                        className="detail-list  "
                        container
                        spacing={1}
                        justify="center"
                      >
                        <Grid
                          item
                          xs={12}
                          className="details-label insurlabel"
                          style={{ color: "#C72C35", marginBottom: "12px" }}
                        >
                          Contact details
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Grid
                        className="detail-list  "
                        container
                        spacing={1}
                        justify="center"
                      >
                        <Grid item xs={6}>
                          <Grid container spacing={1} className="detail-list">
                            <Grid item xs={6} className="details-label">
                              Address Line1
                            </Grid>
                            <Grid
                              item
                              xs={6}
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
                                  ? viewRecord[0].address_line1
                                  : ""}
                              </span>
                              <BootstrapInput
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                                className="primary-input mb20 width100p"
                                placeholder=" "
                                value={toUpdatePatientInfo.address_line1}
                                onChange={(e) => {
                                  setpatientUpdatedData(
                                    "address_line1",
                                    e.target.value
                                  );
                                }}
                              ></BootstrapInput>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={6}>
                          <Grid container spacing={1} className="detail-list">
                            <Grid item xs={6} className="details-label">
                              Address Line2
                            </Grid>
                            <Grid
                              item
                              xs={6}
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
                                  ? viewRecord[0].address_line2
                                  : ""}
                              </span>
                              <BootstrapInput
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                                className="primary-input mb20 width100p"
                                placeholder=" "
                                value={toUpdatePatientInfo.address_line2}
                                onChange={(e) => {
                                  setpatientUpdatedData(
                                    "address_line2",
                                    e.target.value
                                  );
                                }}
                              ></BootstrapInput>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={6}>
                          <Grid container spacing={1} className="detail-list">
                            <Grid item xs={6} className="details-label">
                              City
                            </Grid>
                            <Grid
                              item
                              xs={6}
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
                                  ? viewRecord[0].city
                                  : ""}
                              </span>
                              <BootstrapInput
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                                className="primary-input mb20 width100p"
                                placeholder=" "
                                value={toUpdatePatientInfo.city}
                                onChange={(e) => {
                                  setpatientUpdatedData("city", e.target.value);
                                }}
                              ></BootstrapInput>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={6}>
                          <Grid container spacing={1} className="detail-list">
                            <Grid item xs={6} className="details-label">
                              State
                            </Grid>
                            <Grid
                              item
                              xs={6}
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
                                  ? viewRecord[0].state
                                  : ""}
                              </span>
                              <BootstrapInput
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                                className="primary-input mb20 width100p"
                                placeholder=" "
                                value={toUpdatePatientInfo.state}
                                onChange={(e) => {
                                  setpatientUpdatedData(
                                    "state",
                                    e.target.value
                                  );
                                }}
                              ></BootstrapInput>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={6}>
                          <Grid container spacing={1} className="detail-list">
                            <Grid item xs={6} className="details-label">
                              {process.env.REACT_APP_REGION == "US"
                                ? "Zip Code"
                                : "PIN Code"}
                            </Grid>
                            <Grid
                              item
                              xs={6}
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
                                {viewRecord.length > 0 ? viewRecord[0].zip : ""}
                              </span>
                              <BootstrapInput
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                                className="primary-input mb20 width100p"
                                placeholder=" "
                                value={toUpdatePatientInfo.zip}
                                onChange={(e) => {
                                  setpatientUpdatedData("zip", e.target.value);
                                }}
                              ></BootstrapInput>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={6}>
                          <Grid container spacing={1} className="detail-list">
                            <Grid
                              item
                              xs={6}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              Contact Number
                            </Grid>
                            <Grid
                              item
                              xs={6}
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
                                {viewRecord.length > 0 &&
                                  viewRecord[0].contact_number
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
                                placeholder=" "
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
                        <Grid item xs={12}>
                          <Grid container spacing={1} className="detail-list">
                            <Grid
                              item
                              xs={3}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              Email
                            </Grid>
                            <Grid
                              item
                              xs={9}
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
                                placeholder=" "
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

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Grid
                        className="detail-list  "
                        container
                        spacing={1}
                        justify="center"
                      >
                        <Grid
                          item
                          xs={12}
                          className="details-label insurlabel"
                          style={{ color: "#C72C35", marginBottom: "0px" }}
                        >
                          Visit details
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={6}>
                      <Grid container className="detail-list" spacing={1}>
                        <Grid
                          item
                          xs={6}
                          className="details-label"
                          style={{ color: "#828282" }}
                        >
                          Date of Service
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          className="details-label"
                          style={{ color: "#828282" }}
                        ></Grid>
                        <Grid item xs={12} className="details-value">
                          {viewRecord.length > 0
                            ? viewRecord[0].date_of_service !==
                              "0000-00-00 00:00:00" &&
                              viewRecord[0].date_of_service !== null
                              ? viewRecord[0].date_of_service
                                .split("T")[0]
                                .split("-")[1] +
                              "/" +
                              viewRecord[0].date_of_service
                                .split("T")[0]
                                .split("-")[2] +
                              "/" +
                              viewRecord[0].date_of_service
                                .split("T")[0]
                                .split("-")[0]
                              : ""
                            : ""}

                          <div
                            style={{
                              display: tabState !== "view" ? "none" : "none",
                            }}
                          >
                            <Datepickermod
                              style={{
                                display: tabState !== "view" ? "none" : "none",
                              }}
                              value={
                                toUpdatePatientInfo.dateOfService === null ||
                                  toUpdatePatientInfo.dateOfService ===
                                  "0000-00-00 00:00:00"
                                  ? new Date()
                                  : toUpdatePatientInfo.dateOfService.length ===
                                    20 ||
                                    toUpdatePatientInfo.dateOfService.length ===
                                    24
                                    ? toUpdatePatientInfo.dateOfService.split(
                                      "T"
                                    )[0] + "T12:00:00Z"
                                    : toUpdatePatientInfo.dateOfService
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

                    <Grid item xs={6}>
                      <Grid container className="detail-list" spacing={1}>
                        <Grid
                          item
                          xs={6}
                          className="details-label"
                          style={{ color: "#828282" }}
                        >
                          Specialty
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          className="details-label"
                          style={{ color: "#828282" }}
                        ></Grid>
                        <Grid item xs={12} className="details-value">
                          {toUpdatePatientInfo.specialties
                            ? toUpdatePatientInfo.specialties
                            : ""}

                          <div
                            style={{
                              display: tabState !== "view" ? "none" : "block",
                            }}
                          >
                            <BootstrapInput
                              style={{
                                display: tabState !== "view" ? "block" : "none",
                              }}
                              className="primary-input mb20 width100p"
                              placeholder=" "
                              value={
                                toUpdatePatientInfo.specialties
                                  ? toUpdatePatientInfo.specialties
                                  : ""
                              }
                              onChange={(e) => {
                                setpatientUpdatedData(
                                  "specialties",
                                  e.target.value
                                );
                              }}
                            />
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={6}>
                      <Grid container className="detail-list" spacing={1}>
                        <Grid
                          item
                          xs={6}
                          className="details-label"
                          style={{ color: "#828282" }}
                        >
                          Reason for Visit
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          className="details-label"
                          style={{ color: "#828282" }}
                        ></Grid>
                        <Grid item xs={12} className="details-value">
                          {toUpdatePatientInfo.visit_reason}

                          <div
                            style={{
                              display: tabState !== "view" ? "none" : "block",
                            }}
                          >
                            <BootstrapInput
                              style={{
                                display: tabState !== "view" ? "block" : "none",
                              }}
                              className="primary-input mb20 width100p"
                              placeholder=" "
                              value={toUpdatePatientInfo.visit_reason}
                              onChange={(e) => {
                                setpatientUpdatedData(
                                  "Reason for visit",
                                  e.target.value
                                );
                              }}
                            />
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={6}>
                      <Grid container className="detail-list" spacing={1}>
                        <Grid
                          item
                          xs={6}
                          className="details-label"
                          style={{ color: "#828282", textAlign: "left" }}
                        >
                          Clinician
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          className="details-label"
                          style={{ color: "#828282" }}
                        ></Grid>
                        <Grid item xs={12} className="details-value">
                          {`${toUpdatePatientInfo.physician_title
                            ? toUpdatePatientInfo.physician_title + " "
                            : ""
                            }
  ${toUpdatePatientInfo.physician_first_name
                              ? toUpdatePatientInfo.physician_first_name + " "
                              : ""
                            }
  ${toUpdatePatientInfo.physician_middle_name
                              ? toUpdatePatientInfo.physician_middle_name + " "
                              : ""
                            }
  ${toUpdatePatientInfo.physician_last_name
                              ? toUpdatePatientInfo.physician_last_name
                              : ""
                            }`}

                          <div
                            style={{
                              display: tabState !== "view" ? "none" : "block",
                            }}
                          >
                            <BootstrapInput
                              style={{
                                display: tabState !== "view" ? "block" : "none",
                              }}
                              className="primary-input mb20 width100p"
                              placeholder=" "
                              value={`${toUpdatePatientInfo.physician_title
                                ? toUpdatePatientInfo.physician_title + " "
                                : ""
                                }
  ${toUpdatePatientInfo.physician_first_name
                                  ? toUpdatePatientInfo.physician_first_name + " "
                                  : ""
                                }
  ${toUpdatePatientInfo.physician_middle_name
                                  ? toUpdatePatientInfo.physician_middle_name + " "
                                  : ""
                                }
  ${toUpdatePatientInfo.physician_last_name
                                  ? toUpdatePatientInfo.physician_last_name
                                  : ""
                                }`}
                              onChange={(e) => {
                                setpatientUpdatedData(
                                  "Clinician",
                                  e.target.value
                                );
                              }}
                            />
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={6}>
                      <Grid container className="detail-list" spacing={1}>
                        <Grid
                          item
                          xs={6}
                          className="details-label"
                          style={{ color: "#828282" }}
                        >
                          Last Visit Date
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          className="details-label"
                          style={{ color: "#828282" }}
                        ></Grid>
                        <Grid item xs={12} className="details-value">
                          {toUpdatePatientInfo.last_visit_date &&
                            toUpdatePatientInfo.last_visit_date != null &&
                            toUpdatePatientInfo.last_visit_date !=
                            "0000-00-00 00:00:00"
                            ? toUpdatePatientInfo.last_visit_date
                              .split("T")[0]
                              .split("-")[1] +
                            "/" +
                            toUpdatePatientInfo.last_visit_date
                              .split("T")[0]
                              .split("-")[2] +
                            "/" +
                            toUpdatePatientInfo.last_visit_date
                              .split("T")[0]
                              .split("-")[0]
                            : ""}
                          <div
                            style={{
                              display: tabState !== "view" ? "none" : "block",
                            }}
                          >
                            <BootstrapInput
                              style={{
                                display: tabState !== "view" ? "block" : "none",
                              }}
                              className="primary-input mb20 width100p"
                              placeholder=" "
                              value={toUpdatePatientInfo.visit_reason}
                              onChange={(e) => {
                                setpatientUpdatedData(
                                  "Reason for visit",
                                  e.target.value
                                );
                              }}
                            />
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Divider variant="middle" className="dividercls" />

                  <Grid container spacing={3} justify="center">
                    <Grid item xs={12} className=" ">
                      <Grid
                        className="detail-list  "
                        container
                        spacing={1}
                        justify="center"
                      >
                        {process.env.REACT_APP_REGION == "INDIA" && (
                          <Grid
                            item
                            xs={12}
                            className="details-label insurlabel"
                            style={{ color: "#C72C35", marginBottom: "6px" }}
                          >
                            Insurance Details
                          </Grid>
                        )}
                        <Grid
                          item
                          xs={12}
                          className="details-label"
                          style={{ color: "#828282" }}
                        >
                          {process.env.REACT_APP_REGION == "INDIA"
                            ? "Insurance company"
                            : "Payer"}
                          <CreateSharpIcon
                            style={{
                              display:
                                tabState !== "view" ? "none" : "inline-block",
                            }}
                            onClick={() => setTabState("edit")}
                          ></CreateSharpIcon>
                        </Grid>

                        <Grid item xs={12} className="details-value">
                          <div
                            style={{
                              display: tabState !== "view" ? "none" : "block",
                            }}
                          >
                            {toUpdatePatientInfo?.insurance_name ||
                              getPayer(
                                toUpdatePatientInfo["payor_external_id"]
                              )}
                          </div>
                          <div
                            style={{
                              display: tabState !== "view" ? "block" : "none",
                            }}
                          >
                            {process.env.REACT_APP_REGION == "INDIA" ? (
                              <BootstrapInput
                                style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}
                                className="primary-input mb20 width100p"
                                placeholder=" "
                                value={toUpdatePatientInfo.insurance_name}
                                onChange={(e) => {
                                  setpatientUpdatedData(
                                    "insurance_name",
                                    e.target.value
                                  );
                                }}
                              ></BootstrapInput>
                            ) : (
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
                            )}
                          </div>
                        </Grid>
                        {process.env.REACT_APP_REGION == "INDIA" && (
                          <Grid item xs={6}>
                            <Grid container spacing={1}>
                              <Grid item xs={6} className="details-label">
                                Customer No{" "}
                                <CreateSharpIcon
                                  style={{
                                    display:
                                      tabState !== "view"
                                        ? "none"
                                        : "inline-block",
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
                                    ? viewRecord[0].customer_number
                                    : ""}
                                </div>

                                <div
                                  style={{
                                    display:
                                      tabState !== "view" ? "block" : "none",
                                  }}
                                >
                                  <BootstrapInput
                                    style={{
                                      display:
                                        tabState !== "view" ? "block" : "none",
                                    }}
                                    className="primary-input mb20 width100p"
                                    placeholder=" "
                                    value={toUpdatePatientInfo.customer_number}
                                    onChange={(e) => {
                                      setpatientUpdatedData(
                                        "customer_number",
                                        e.target.value
                                      );
                                    }}
                                  ></BootstrapInput>
                                </div>
                              </Grid>
                            </Grid>
                          </Grid>
                        )}
                        {process.env.REACT_APP_REGION == "INDIA" && (
                          <Grid item xs={6}>
                            <Grid container spacing={1}>
                              <Grid item xs={12} className="details-label">
                                Policy No{" "}
                                <CreateSharpIcon
                                  style={{
                                    display:
                                      tabState !== "view"
                                        ? "none"
                                        : "inline-block",
                                  }}
                                  onClick={() => setTabState("edit")}
                                ></CreateSharpIcon>
                              </Grid>
                              <Grid
                                item
                                xs={6}
                                className="details-label"
                                style={{ color: "#828282" }}
                              ></Grid>
                              <Grid item xs={12} className="details-value">
                                <div
                                  style={{
                                    display:
                                      tabState !== "view" ? "none" : "block",
                                  }}
                                >
                                  {viewRecord.length > 0
                                    ? viewRecord[0].policy_number
                                    : ""}
                                </div>
                                <div
                                  style={{
                                    display:
                                      tabState !== "view" ? "block" : "none",
                                  }}
                                >
                                  <BootstrapInput
                                    style={{
                                      display:
                                        tabState !== "view" ? "block" : "none",
                                    }}
                                    className="primary-input mb20 width100p"
                                    placeholder=" "
                                    value={toUpdatePatientInfo.policy_number}
                                    onChange={(e) => {
                                      setpatientUpdatedData(
                                        "policy_number",
                                        e.target.value
                                      );
                                    }}
                                  ></BootstrapInput>
                                </div>
                              </Grid>
                            </Grid>
                          </Grid>
                        )}

                        {process.env.REACT_APP_REGION == "INDIA" && (
                          <Grid item xs={6}>
                            <Grid container spacing={1}>
                              <Grid item xs={12} className="details-label">
                                Valid From{" "}
                                <CreateSharpIcon
                                  style={{
                                    display:
                                      tabState !== "view"
                                        ? "none"
                                        : "inline-block",
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
                                    ? viewRecord[0].insurance_valid_from !==
                                      "0000-00-00 00:00:00" &&
                                      viewRecord[0].insurance_valid_from !==
                                      null
                                      ? viewRecord[0].insurance_valid_from
                                        .split("T")[0]
                                        .split("-")[1] +
                                      "/" +
                                      viewRecord[0].insurance_valid_from
                                        .split("T")[0]
                                        .split("-")[2] +
                                      "/" +
                                      viewRecord[0].insurance_valid_from
                                        .split("T")[0]
                                        .split("-")[0]
                                      : ""
                                    : ""}
                                </div>
                                <div div className="mrtvalid"
                                  style={{
                                    display:
                                      tabState !== "view" ? "block" : "none",
                                  }}
                                >
                                  <Datepickermod
                                    style={{
                                      display:
                                        tabState !== "view" ? "block" : "none", marginTop: "10px"
                                    }}
                                    value={
                                      toUpdatePatientInfo.insurance_valid_from
                                    }
                                    dateChanged={(val) => {
                                      setpatientUpdatedData(
                                        "insurance_valid_from",
                                        val
                                      );
                                    }}
                                  />

                                  {/*   <BootstrapInput
                                  style={{
                                    display:
                                      tabState !== "view" ? "block" : "none",
                                  }}
                                  className="primary-input mb20 width100p"
                                  placeholder=" "
                                  value={toUpdatePatientInfo.insurance_valid_from}
                                  onChange={(e) => {
                                    setpatientUpdatedData(
                                      "insurance_valid_from",
                                      e.target.value
                                    );
                                  }}
                                ></BootstrapInput> */}
                                </div>
                              </Grid>
                            </Grid>
                          </Grid>
                        )}

                        {process.env.REACT_APP_REGION == "INDIA" && (
                          <Grid item xs={6}>
                            <Grid container spacing={1}>
                              <Grid item xs={12} className="details-label">
                                Subscriber Name{" "}
                                <CreateSharpIcon
                                  style={{
                                    display:
                                      tabState !== "view"
                                        ? "none"
                                        : "inline-block",
                                  }}
                                  onClick={() => setTabState("edit")}
                                ></CreateSharpIcon>
                              </Grid>
                              <Grid
                                item
                                xs={6}
                                className="details-label"
                                style={{ color: "#828282" }}
                              ></Grid>
                              <Grid item xs={12} className="details-value">
                                <span
                                  style={{
                                    display:
                                      tabState !== "view" ? "none" : "block",
                                  }}
                                >
                                  {viewRecord.length > 0 ? subscriberName : ""}
                                </span>
                                <BootstrapInput
                                  style={{
                                    display:
                                      tabState !== "view" ? "block" : "none",
                                  }}
                                  className="primary-input mb20 width100p"
                                  placeholder=" "
                                  value={toUpdatePatientInfo.sub_first_name}
                                  onChange={(e) => {
                                    setpatientUpdatedData(
                                      "sub_first_name",
                                      e.target.value
                                    );
                                  }}
                                />
                                {/*  <BootstrapInput
                                  style={{
                                    display:
                                      tabState !== "view" ? "block" : "none",
                                  }}
                                  className="primary-input mb20 width100p"
                                  placeholder=" "
                                  value={toUpdatePatientInfo.sub_middle_name}
                                  onChange={(e) => {
                                    setpatientUpdatedData(
                                      "sub_middle_name",
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
                                  placeholder=" "
                                  value={toUpdatePatientInfo.sub_last_name}
                                  onChange={(e) => {
                                    setpatientUpdatedData(
                                      "sub_last_name",
                                      e.target.value
                                    );
                                  }}
                                ></BootstrapInput> */}
                              </Grid>
                            </Grid>
                          </Grid>
                        )}

                        {process.env.REACT_APP_REGION == "INDIA" &&
                          <Grid item xs={12}>
                            <Grid container spacing={1}>
                              <Grid item xs={12} className="details-label"  >
                                Relationship to patient{" "}
                                <CreateSharpIcon
                                  style={{
                                    display:
                                      tabState !== "view"
                                        ? "none"
                                        : "inline-block",
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
                                    ? viewRecord[0].relationship_to_subscriber
                                    : ""}
                                </span>

                                <span style={{
                                  display:
                                    tabState !== "view" ? "block" : "none",
                                }}>
                                  <FormControl FormControl label = "outlined"
                                  className = {
                                    classes.formControl + " width100p"
                                  } >
                                    
                                    <MUIselect
                                      id="attendingSpecialty"
                                      //value={patientDetails.attendingSpecialty}
                                      // value={patientDetails.emergencyContactRelationship}
                                      // onChange={(e) => {
                                      //    setPatientDetailsdata("emergencyContactRelationship",e.target.value);
                                      //setPatientDetailsdata("attendingSpecialty", e.target.value);
                                      // }}
                                        className = "selectborder width100p"
                                        fullWidth
                                    
                                      labelId="Relationship-to-Patient-label"
                                    >
                                      {
                                        ["Spouse", "Parent", "Siblings", "Partner", "Friend", "Others"].map((item) => (
                                          <MenuItem value={item}>{item}</MenuItem>
                                        ))
                                      }
                                    </MUIselect>
                                  </FormControl>

                                </span>
                                {/*   <BootstrapInput
                                  style={{
                                    display:
                                      tabState !== "view" ? "block" : "none",
                                  }}
                                  className="primary-input width100p"
                                  placeholder=" "
                                  value={
                                    toUpdatePatientInfo.relationship_to_subscriber
                                  }
                                  onChange={(e) => {
                                    setpatientUpdatedData(
                                      "relationship_to_subscriber",
                                      e.target.value
                                    );
                                  }}
                                ></BootstrapInput> */}
                              </Grid>
                            </Grid>
                          </Grid>
                        }

                      </Grid>


                      {process.env.REACT_APP_REGION == "US" &&
                        <Grid item xs={12}>
                          <Grid
                            className="detail-list"
                            container
                            spacing={1}
                            justify="center"
                          >
                            <Grid
                              item
                              xs={2}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              Member ID
                            </Grid>
                            <Grid
                              item
                              xs={10}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              <CreateSharpIcon
                                style={{
                                  display: tabState !== "view" ? "none" : "block",
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
                                  ? viewRecord[0].subscriber_id
                                  : ""}
                              </div>
                              <BootstrapInput
                                style={{
                                  display: tabState !== "view" ? "block" : "none",
                                }}
                                className="primary-input mb20 width100p"
                                placeholder="Subscriber ID"
                                value={toUpdatePatientInfo.subId}
                                onChange={(e) => {
                                  setpatientUpdatedData("subId", e.target.value);
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      }

                      <Grid item xs={12}>
                        <Grid
                          className="detail-list"
                          container
                          spacing={1}
                          justify="center"
                        >



                          {process.env.REACT_APP_REGION == 'US' &&

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
                                    placeholder=" "
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
                          }


                          {process.env.REACT_APP_REGION == "US" &&

                            <Grid item xs={6}>
                              <Grid
                                container
                                spacing={2}
                                justify="center"
                                alignItems="center"
                              >
                                <Grid
                                  item
                                  xs={5}
                                  className="details-label"
                                  style={{ color: "#828282" }}
                                >
                                  Member ID
                                </Grid>
                                <Grid
                                  item
                                  xs={7}
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
                                    placeholder=" "
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
                          }
                          {process.env.REACT_APP_REGION == "US" && (
                            <Grid item xs={6}>
                              <Grid container spacing={1}>
                                <Grid
                                  item
                                  xs={4}
                                  className="details-label"
                                  style={{ color: "#828282" }}
                                >
                                  Eligibility
                                </Grid>
                                <Grid
                                  item
                                  xs={8}
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
                                    className="details-value"
                                    style={{
                                      display:
                                        tabState !== "view" ? "none" : "block",
                                    }}
                                  >
                                    {viewRecord.length > 0
                                      ? viewRecord[0].eligibility
                                      : ""}
                                  </div>
                                  <select
                                    style={{
                                      display:
                                        tabState === "view" ? "none" : "block",
                                    }}
                                    value={toUpdatePatientInfo.eligibility}
                                    className=" custom-select"
                                    onChange={(e) => {
                                      setpatientUpdatedData(
                                        "eligibility",
                                        e.target.value
                                      );
                                    }}
                                  >
                                    <option disabled>Eligibility</option>
                                    {eligibilityArray()}
                                  </select>
                                </Grid>
                              </Grid>
                            </Grid>
                          )}
                          {process.env.REACT_APP_REGION == "US" && (
                            <Grid item xs={12}>
                              <Grid
                                container
                                spacing={1}
                                justify="left"
                                alignItems="left"
                              >
                                <Grid
                                  item
                                  xs={4}
                                  className="details-label"
                                  style={{ color: "#828282" }}
                                >
                                  Coverage Type{" "}
                                  <CreateSharpIcon
                                    style={{
                                      display:
                                        tabState !== "view"
                                          ? "none"
                                          : "inline-block",
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
                                      ? viewRecord[0].service_name
                                      : ""}
                                  </div>
                                  <div
                                    style={{
                                      display:
                                        tabState === "view" ? "none" : "block",
                                    }}
                                  >
                                    <Select
                                      isVisible={
                                        tabState === "view" ? true : false
                                      }
                                      onChange={(selectedOption) => {
                                        setpatientUpdatedData(
                                          "service_type",
                                          selectedOption.value
                                        );
                                      }}
                                      styles={customStyles}
                                      options={attributeData.servicetype}
                                      value={attributeData.servicetype.filter(
                                        (option) =>
                                          option.value ===
                                          toUpdatePatientInfo["service_type"]
                                      )}
                                      defaultValue={{
                                        value: 30,
                                        label: "HealthBenefitPlanCoverage",
                                      }}
                                    />
                                  </div>
                                </Grid>
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Divider className="dividercls" />


                  <Grid container spacing={3} justify="center">
                    <Grid item xs={12} className=" ">
                      <Grid
                        className="detail-list  "
                        container
                        spacing={1}

                      >

                        <Grid
                          item
                          xs={12}
                          className="details-label insurlabel"
                          style={{ color: "#C72C35", marginBottom: "6px" }}
                        >
                          Emergency Contact
                        </Grid>


                        <Grid item xs={6}>
                          <Grid container spacing={1}>
                            <Grid item xs={6} className="details-label">
                              Name{" "}
                              <CreateSharpIcon
                                style={{
                                  display:
                                    tabState !== "view"
                                      ? "none"
                                      : "inline-block",
                                }}
                                onClick={() => setTabState("edit")}
                              ></CreateSharpIcon>
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              className="details-label"
                              style={{ color: "#828282" }}
                            ></Grid>
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
                                placeholder=" "
                                value={toUpdatePatientInfo.sub_first_name}
                                onChange={(e) => {
                                  setpatientUpdatedData(
                                    "sub_first_name",
                                    e.target.value
                                  );
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>



                        <Grid item xs={6}>
                          <Grid container spacing={1}>
                            <Grid item xs={12} className="details-label" >
                              Relationship to patient{" "}
                              <CreateSharpIcon
                                style={{
                                  display:
                                    tabState !== "view"
                                      ? "none"
                                      : "inline-block",
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
                                  ? viewRecord[0].relationship_to_subscriber
                                  : ""}
                              </span>

                              <span style={{
                                display:
                                  tabState !== "view" ? "block" : "none",
                              }}>
                                <FormControl label="outlined"
                                  className={
                                    classes.formControl + " width100p"
                                  } >

                                  <MUIselect
                                    id="attendingSpecialty"
                                    //value={patientDetails.attendingSpecialty}
                                    // value={patientDetails.emergencyContactRelationship}
                                    // onChange={(e) => {
                                    //    setPatientDetailsdata("emergencyContactRelationship",e.target.value);
                                    //setPatientDetailsdata("attendingSpecialty", e.target.value);
                                    // }}
                                    className="selectborder width100p"
                                    fullWidth

                                    labelId="Relationship-to-Patient-label"
                                  >
                                    {
                                      ["Spouse", "Parent", "Siblings", "Partner", "Friend", "Others"].map((item) => (
                                        <MenuItem value={item}>{item}</MenuItem>
                                      ))
                                    }
                                  </MUIselect>
                                </FormControl>

                              </span>

                              {/*  <BootstrapInput
                                  style={{
                                    display:
                                      tabState !== "view" ? "block" : "none",
                                  }}
                                  className="primary-input width100p"
                                  placeholder=" "
                                  value={
                                    toUpdatePatientInfo.relationship_to_subscriber
                                  }
                                  onChange={(e) => {
                                    setpatientUpdatedData(
                                      "relationship_to_subscriber",
                                      e.target.value
                                    );
                                  }}
                                ></BootstrapInput> */}
                            </Grid>
                          </Grid>
                        </Grid>


                        <Grid item xs={6}>
                          <Grid container spacing={1} className="detail-list">
                            <Grid
                              item
                              xs={6}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              Contact Number
                            </Grid>
                            <Grid
                              item
                              xs={6}
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
                                {viewRecord.length > 0 &&
                                  viewRecord[0].contact_number
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
                                placeholder=" "
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
                          <Grid container spacing={1} className="detail-list">
                            <Grid
                              item
                              xs={3}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              Email
                            </Grid>
                            <Grid
                              item
                              xs={9}
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
                                placeholder=" "
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


                      {process.env.REACT_APP_REGION == "US" &&
                        <Grid item xs={12}>
                          <Grid
                            className="detail-list"
                            container
                            spacing={1}
                            justify="center"
                          >
                            <Grid
                              item
                              xs={2}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              Member ID
                            </Grid>
                            <Grid
                              item
                              xs={10}
                              className="details-label"
                              style={{ color: "#828282" }}
                            >
                              <CreateSharpIcon
                                style={{
                                  display: tabState !== "view" ? "none" : "block",
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
                                  ? viewRecord[0].subscriber_id
                                  : ""}
                              </div>
                              <BootstrapInput
                                style={{
                                  display: tabState !== "view" ? "block" : "none",
                                }}
                                className="primary-input mb20 width100p"
                                placeholder="Subscriber ID"
                                value={toUpdatePatientInfo.subId}
                                onChange={(e) => {
                                  setpatientUpdatedData("subId", e.target.value);
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      }

                      <Grid item xs={12}>
                        <Grid
                          className="detail-list"
                          container
                          spacing={1}
                          justify="center"
                        >



                          {process.env.REACT_APP_REGION == 'US' &&

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
                                    placeholder=" "
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
                          }


                          {process.env.REACT_APP_REGION == "US" &&

                            <Grid item xs={6}>
                              <Grid
                                container
                                spacing={2}
                                justify="center"
                                alignItems="center"
                              >
                                <Grid
                                  item
                                  xs={5}
                                  className="details-label"
                                  style={{ color: "#828282" }}
                                >
                                  Member ID
                                </Grid>
                                <Grid
                                  item
                                  xs={7}
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
                                    placeholder=" "
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
                          }
                          {process.env.REACT_APP_REGION == "US" && (
                            <Grid item xs={6}>
                              <Grid container spacing={1}>
                                <Grid
                                  item
                                  xs={4}
                                  className="details-label"
                                  style={{ color: "#828282" }}
                                >
                                  Eligibility
                                </Grid>
                                <Grid
                                  item
                                  xs={8}
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
                                    className="details-value"
                                    style={{
                                      display:
                                        tabState !== "view" ? "none" : "block",
                                    }}
                                  >
                                    {viewRecord.length > 0
                                      ? viewRecord[0].eligibility
                                      : ""}
                                  </div>
                                  <select
                                    style={{
                                      display:
                                        tabState === "view" ? "none" : "block",
                                    }}
                                    value={toUpdatePatientInfo.eligibility}
                                    className=" custom-select"
                                    onChange={(e) => {
                                      setpatientUpdatedData(
                                        "eligibility",
                                        e.target.value
                                      );
                                    }}
                                  >
                                    <option disabled>Eligibility</option>
                                    {eligibilityArray()}
                                  </select>
                                </Grid>
                              </Grid>
                            </Grid>
                          )}
                          {process.env.REACT_APP_REGION == "US" && (
                            <Grid item xs={12}>
                              <Grid
                                container
                                spacing={1}
                                justify="left"
                                alignItems="left"
                              >
                                <Grid
                                  item
                                  xs={4}
                                  className="details-label"
                                  style={{ color: "#828282" }}
                                >
                                  Coverage Type{" "}
                                  <CreateSharpIcon
                                    style={{
                                      display:
                                        tabState !== "view"
                                          ? "none"
                                          : "inline-block",
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
                                      ? viewRecord[0].service_name
                                      : ""}
                                  </div>
                                  <div
                                    style={{
                                      display:
                                        tabState === "view" ? "none" : "block",
                                    }}
                                  >
                                    <Select
                                      isVisible={
                                        tabState === "view" ? true : false
                                      }
                                      onChange={(selectedOption) => {
                                        setpatientUpdatedData(
                                          "service_type",
                                          selectedOption.value
                                        );
                                      }}
                                      styles={customStyles}
                                      options={attributeData.servicetype}
                                      value={attributeData.servicetype.filter(
                                        (option) =>
                                          option.value ===
                                          toUpdatePatientInfo["service_type"]
                                      )}
                                      defaultValue={{
                                        value: 30,
                                        label: "HealthBenefitPlanCoverage",
                                      }}
                                    />
                                  </div>
                                </Grid>
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Divider className="dividercls" />

                  <Grid
                    className="detail-list"
                    container
                    spacing={3}
                    justify="center"
                    style={{ marginTop: "2px" }}
                  >
                    <Grid item xs={6}>
                      <Grid container spacing={1} justify="center">
                        <Grid item xs={12} className="details-label">
                          Registration Status
                        </Grid>
                        <Grid item xs={12} className="details-value">
                          {viewRecord.length > 0
                            ? viewRecord[0].onboarding_status
                            : ""}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={6}>
                      <Grid container spacing={1} justify="center">
                        <Grid item xs={12} className="details-label">
                          Registration Date
                        </Grid>
                        <Grid item xs={12} className="details-value">
                          {viewRecord.length > 0
                            ? viewRecord[0].created_time_patient !==
                              "0000-00-00 00:00:00" &&
                              viewRecord[0].created_time_patient !== null
                              ? viewRecord[0].created_time_patient
                                .split("T")[0]
                                .split("-")[1] +
                              "/" +
                              viewRecord[0].created_time_patient
                                .split("T")[0]
                                .split("-")[2] +
                              "/" +
                              viewRecord[0].created_time_patient
                                .split("T")[0]
                                .split("-")[0]
                              : //+ " " + viewRecord[0].last_eligibility_verified_timestamp.split("T")[1].split(":")[0]+":"+viewRecord[0].last_eligibility_verified_timestamp.split("T")[1].split(":")[1]
                              ""
                            : ""}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider className="dividercls" />
                  <Grid container spacing={3} justify="center">
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid
                          item
                          xs={12}
                          className="details-label"
                          style={{ color: "#828282" }}
                        >
                          {process.env.REACT_APP_REGION == "INDIA"
                            ? "Uploaded Insurance Card Images"
                            : "Uploaded Documents"}

                          <CreateSharpIcon
                            style={{
                              display:
                                tabState !== "view" ? "none" : "inline-block",
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
                          display: tabState !== "view" ? "none" : "block",
                        }}
                      >
                        <Grid container spacing={2} justify="center">
                          <Grid item xs={6}>
                            <div
                              style={{
                                letterSpacing: "0.2em",
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
                                letterSpacing: "0.2em",
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
                          display: tabState === "view" ? "none" : "block",
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
                                      <Grid
                                        item
                                        xs={2}
                                        style={{
                                          display: "flex!important",
                                          alignItems: "center!important",
                                        }}
                                      >
                                        <div>
                                          <p>Front side</p>
                                        </div>
                                      </Grid>
                                      <Grid item xs={6} className="txt-right">
                                        {documentTypeHistory.front ? (
                                          <CheckCircleIcon
                                            style={{ color: "green" }}
                                          />
                                        ) : (
                                          <HighlightOffIcon
                                            style={{ color: "red" }}
                                          />
                                        )}
                                      </Grid>
                                      <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={6}
                                        className="pd20"
                                      >
                                        <input
                                          type="file"
                                          id="upload1"
                                          accept=".jpg,.jpeg.,.gif,.png"
                                          hidden
                                          onChange={(e) => {
                                            onFileChangeNew("1", e);
                                          }}
                                        />
                                        <label
                                          for="upload1"
                                          class="custom-file-input"
                                        ></label>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={6}
                                        className="pd20"
                                      >
                                        <div
                                          id="img1-preview"
                                          class="cust-select"
                                        ></div>
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
                                      <Grid
                                        item
                                        xs={2}
                                        style={{
                                          display: "flex!important",
                                          alignItems: "center!important",
                                        }}
                                      >
                                        <div>
                                          <p>Back side</p>
                                        </div>
                                      </Grid>
                                      <Grid item xs={6} className="txt-right">
                                        {documentTypeHistory.back ? (
                                          <CheckCircleIcon
                                            style={{ color: "green" }}
                                          />
                                        ) : (
                                          <HighlightOffIcon
                                            style={{ color: "red" }}
                                          />
                                        )}
                                      </Grid>
                                      <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={6}
                                        className="pd20"
                                      >
                                        <input
                                          type="file"
                                          id="upload2"
                                          accept=".jpg,.jpeg.,.gif,.png"
                                          hidden
                                          onChange={(e) => {
                                            onFileChangeNew("2", e);
                                          }}
                                        />
                                        <label
                                          for="upload2"
                                          class="custom-file-input"
                                        ></label>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={6}
                                        className="pd20"
                                      >
                                        <div
                                          id="img2-preview"
                                          class="cust-select"
                                        ></div>
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

                  {/*  <Grid container spacing={3} justify="center">
                    <Grid item xs={12}>
                      <Grid container spacing={1} style={{ color: "#828282" }}>
                        Notes:
                      </Grid>
                    </Grid>
                  </Grid>    */}

                  {/* <Grid container spacing={3} justify="center">
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
                  </Grid>   */}

                  <Grid container spacing={3} justify="center">
                    {/* <Grid item xs={12}>
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
                    </Grid>   */}
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
                </Paper>
              </DialogContent>
            </Dialog>
            <Grid item xs={12} sm={12}>
              <Paper className=" txt-center bx-shadow dbbox">
                <Box component="div" className="txt-center">
                  <h5 className="btitle pt30">
                    {process.env.REACT_APP_REGION == "INDIA"
                      ? "Patient Scheduling Dashboard"
                      : "Patient Eligibility Monitoring Dashboard"}
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
                                <TableCell>Date of Service</TableCell>
                                <TableCell>Appt. Start Time</TableCell>
                                <TableCell>Patient Full Name</TableCell>

                                {/*<TableCell>Eligibility Status</TableCell>
                              
                             <TableCell>Network Status</TableCell>
                             
                              <TableCell>Pre-Auth Required</TableCell>
                               */}
                                {/*   <TableCell>Network Status</TableCell>
                                <TableCell>Pre-Auth Required</TableCell> */}
                                {process.env.REACT_APP_REGION == "US" && (
                                  <TableCell>Coverage Type</TableCell>
                                )}
                                <TableCell>Specialty</TableCell>
                                <TableCell>Reason for Visit</TableCell>
                                <TableCell> Last Visit Date</TableCell>
                                <TableCell>
                                  {process.env.REACT_APP_REGION == "INDIA"
                                    ? "Attending Staff"
                                    : "Clinician"}
                                </TableCell>

                                {process.env.REACT_APP_REGION == "US" && (
                                  <TableCell>Date Last Verified</TableCell>
                                )}
                                {process.env.REACT_APP_REGION == "US" && (
                                  <TableCell>Payer Name</TableCell>
                                )}
                                <TableCell> </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {gridData.map((row) => (row.appt_cancelled != 1 &&
                                <TableRow
                                  key={row.patient_id}
                                  style={{ position: "relative" }}
                                >
                                  {/* <TableCell className="patientid">
                                    <FormControlLabel
                                      control={<Checkbox name="checkedA" />}
                                      label={" "}
                                    />
                                  </TableCell> */}
                                  <TableCell>
                                    {row.date_of_service !==
                                      "0000-00-00 00:00:00" &&
                                      row.date_of_service !== null
                                      ? row.date_of_service
                                        .split("T")[0]
                                        .split("-")[1] +
                                      "/" +
                                      row.date_of_service
                                        .split("T")[0]
                                        .split("-")[2] +
                                      "/" +
                                      row.date_of_service
                                        .split("T")[0]
                                        .split("-")[0]
                                      : ""}
                                  </TableCell>
                                  <TableCell
                                    onClick={() => {
                                      expand("");
                                    }}
                                  >
                                    <p>
                                      {getFormattedTime(row.appt_start_time)}
                                    </p>
                                  </TableCell>
                                  <TableCell>
                                    {row.first_name +
                                      " " +
                                      row.middle_name +
                                      " " +
                                      row.last_name}
                                  </TableCell>

                                  {/*      
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
 */}

                                  {/* <TableCell
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
                                       */}

                                  {/* <TableCell
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
                                 */}
                                  {process.env.REACT_APP_REGION == "US" && (
                                    <TableCell
                                      onClick={() => {
                                        expand("");
                                      }}
                                    >
                                      {row.service_name}
                                    </TableCell>
                                  )}
                                  <TableCell>{row.specialties}</TableCell>
                                  <TableCell>{row.visit_reason}</TableCell>
                                  <TableCell>
                                    {row.last_visit_date &&
                                      row.last_visit_date != null &&
                                      row.last_visit_date != "0000-00-00 00:00:00"
                                      ? row.last_visit_date
                                        .split("T")[0]
                                        .split("-")[1] +
                                      "/" +
                                      row.last_visit_date
                                        .split("T")[0]
                                        .split("-")[2] +
                                      "/" +
                                      row.last_visit_date
                                        .split("T")[0]
                                        .split("-")[0]
                                      : ""}
                                  </TableCell>
                                  <TableCell>
                                    {`${row.physician_title
                                      ? row.physician_title + " "
                                      : ""
                                      }
                                    ${row.physician_first_name
                                        ? row.physician_first_name + " "
                                        : ""
                                      }
                                    ${row.physician_middle_name
                                        ? row.physician_middle_name + " "
                                        : ""
                                      }
                                    ${row.physician_last_name
                                        ? row.physician_last_name
                                        : ""
                                      }`}
                                  </TableCell>

                                  {process.env.REACT_APP_REGION == "US" && (
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
                                  )}
                                  {process.env.REACT_APP_REGION == "US" && (
                                    <TableCell>{row.payor_name} </TableCell>
                                  )}
                                  <TableCell className="tbl-btn-wdith">
                                    {/* 
                                        Show checkin,
                                          If appointment is not cancelled,
                                          If appointment is in scheduled/rescheduled/schedule followup state
                                          Date of service is current date
                                        Show checkout,
                                          If appointment is not cancelled
                                          If appointment is in checked in state
                                     */}
                                    {
                                      ((isToday(new Date(row.date_of_service)) &&
                                        row.appt_cancelled != 1 &&
                                        (row.appt_state == "" ||
                                          row.appt_state == null ||
                                          row.appt_state == "Scheduled" ||
                                          row.appt_state == "Rescheduled" ||
                                          row.appt_state == "ScheduleFollowup")) ||
                                        (row.appt_cancelled != 1 &&
                                          (row.appt_state == "" ||
                                            row.appt_state == null ||
                                            row.appt_state == "Checked In"))) && (
                                        <Button
                                          variant="contained"
                                          className="btn-primary checkin-btn mr15"
                                          onClick={() =>
                                            apptmtHandler(
                                              row.patient_id,
                                              row.appt_state,
                                              row.appt_cancelled
                                            )
                                          }
                                        >
                                          {row.appt_state == "Checked In" ?
                                            "Check Out" :
                                            "Check in"
                                          }
                                        </Button>
                                      )}

                                    {/* 
                                      Show, "No Show" as disabled  
                                        If date of service is past date, 
                                        If appointment is not checked in/checked out/Cancelled,
                                        If appointment is Scheduled/Rescheduled/Schedule follow up.
                                    */}
                                    {isPastDate(
                                      new Date(row.date_of_service),
                                      new Date()
                                    ) &&
                                      row.appt_cancelled != 1 &&
                                      (row.appt_state == "" ||
                                        row.appt_state == null ||
                                        row.appt_state == "Scheduled" ||
                                        row.appt_state == "Rescheduled" ||
                                        row.appt_state == "ScheduleFollowup") && (
                                        <Button
                                          variant="contained"
                                          className="btn-primary checkin-btn mr15"
                                          // onClick={() => apptmtHandler(row.patient_id, row.appt_state, row.appt_cancelled)}
                                          disabled
                                        >
                                          No Show
                                        </Button>
                                      )}

                                    {/* 
                                        Show Reschedule,
                                          -> If appointment is not checked in/Checked out/cancelled
                                          -> If appointment in Scheduled/ Rescheduled/ schedulefollowup
                                        Show Schedule follow up
                                          -> If patient is checked out
                                          -> If date of service is past date
                                     */}
                                    {row.appt_cancelled != 1 &&
                                      (row.appt_state == "" ||
                                        row.appt_state == null ||
                                        row.appt_state == "Scheduled" ||
                                        row.appt_state == "Rescheduled" ||
                                        row.appt_state == "ScheduleFollowup" ||
                                        row.appt_state == "Checked Out") && (
                                        <Reschedule
                                          sucessMessage={
                                            (row.appt_state == "Checked Out" || isPastDate(new Date(row.date_of_service), new Date()))
                                              ? "Successfully scheduled followup appointment"
                                              : "Successfully rescheduled appointment"
                                          }
                                          patientId={row.patient_id}
                                          patientName={
                                            row.first_name +
                                            " " +
                                            row.middle_name +
                                            " " +
                                            row.last_name
                                          }
                                          dateOfBirth={
                                            row.dob !== "0000-00-00 00:00:00" &&
                                              row.dob !== null
                                              ? row.dob
                                                .split("T")[0]
                                                .split("-")[1] +
                                              "/" +
                                              row.dob
                                                .split("T")[0]
                                                .split("-")[2] +
                                              "/" +
                                              row.dob
                                                .split("T")[0]
                                                .split("-")[0]
                                              : ""
                                          }
                                          age={
                                            row.dob !== "0000-00-00 00:00:00" &&
                                              row.dob !== null
                                              ? calculateAge(row.dob)
                                              : ""
                                          }
                                          addressLine1={row.address_line1}
                                          addressLine2={row.address_line2}
                                          city={row.city}
                                          state={row.state}
                                          zip={row.zip}
                                          contactNumber={row.contact_number}
                                          email={row.email}
                                          date_of_service={row.date_of_service}
                                          refetchData={needToRefetchData}
                                          displayText={(row.appt_state == "Checked Out" || isPastDate(new Date(row.date_of_service), new Date()))
                                            ? "Schedule Follow-up"
                                            : "Reschedule"}
                                          // sucessMessage="Successfully scheduled followup appointment"
                                          appStartTime={row.appt_start_time}
                                          appEndTime={row.appt_end_time}
                                          specialty={row.specialties}
                                          // physician_name = {row.physician_first_name +" "+ row.physician_middle_name +" "+ row.physician_last_name}
                                          visitReason={row.visit_reason}
                                          physicianId={row.physician_id}
                                        />
                                      )}

                                    {row.appt_cancelled != 1 &&
                                      (row.appt_state == "Scheduled" ||
                                        row.appt_state == "Rescheduled" ||
                                        row.appt_state == "ScheduleFollowup" ||
                                        row.appt_state == "" ||
                                        row.appt_state == null) && (
                                        <Button
                                          variant="contained"
                                          className="btn-primary cancel-btn"
                                          onClick={() =>
                                            onCancelApptmt(row.patient_id)
                                          }
                                        >
                                          Cancel
                                        </Button>
                                      )}
                                  </TableCell>
                                  <TableCell
                                    style={{
                                      position: "relative",
                                      width: "60px",
                                    }}
                                  >
                                    {/*  {row.payor_name}{" "} */}
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
                                              textAlign: "right",
                                            }
                                            : { display: "none" }
                                        }
                                      >
                                        <span
                                          onClick={() =>
                                            handleClickOpen(row.patient_id)
                                          }
                                        >
                                          Patient Details
                                        </span>
                                        <span> | </span>
                                        {row.eligibility ===
                                          "Active Coverage" ? (
                                          <span
                                            onClick={() =>
                                              handleClickOpen2(row.patient_id)
                                            }
                                          >
                                            Coverage/Benefits
                                          </span>
                                        ) : (
                                          <span
                                            style={{
                                              color: "#DCDCDC",
                                              cursor: "default",
                                              textDecorationLine: "none",
                                              display: "none",
                                            }}
                                          >
                                            Coverage/Benefits
                                          </span>
                                        )}
                                        {process.env.REACT_APP_REGION ==
                                          "US" && (
                                            <span
                                              onClick={() =>
                                                handleClickOpen2(row.patient_id)
                                              }
                                            >
                                              Coverage/Benefits
                                            </span>
                                          )}
                                        {process.env.REACT_APP_REGION ===
                                          "US" && <span> | </span>}
                                        <span
                                          onClick={() =>
                                            onNotesReportClick(row.patient_id)
                                          }
                                        >
                                          Add Notes / Reports
                                        </span>
                                        {process.env.REACT_APP_REGION ==
                                          "US" && <span> | </span>}{" "}
                                        {process.env.REACT_APP_REGION ==
                                          "US" && (
                                            <span
                                              onClick={() =>
                                                sendLinkApi(row.patient_id)
                                              }
                                            >
                                              Resend
                                            </span>
                                          )}
                                        {/*   {process.env.REACT_APP_REGION == 'US' &&
                                          <span> | </span>
                                         }
                                        
                                        <span
                                          onClick={() =>
                                            patientDelete(row.patient_id)
                                          }
                                        >
                                          Cancel
                                        </span>  */}
                                        <span> &nbsp;&nbsp; </span>
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
