import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import LeftsideMenu from './LeftsideMenu';
import "react-datepicker/dist/react-datepicker.css";
import logodb from "../img/Beats-health-logo.png";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Select from 'react-select';
import MUIselect from "@material-ui/core/Select";
import Datepickermod from "./datepicker";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import { createStyles, Theme } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import DescriptionIcon from "@material-ui/icons/Description";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastError, ToastSuccess } from "../service/toast/Toast";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import TimePicker from 'react-time-picker';
import DatePicker from "react-datepicker";
import { ContactSupport } from "@material-ui/icons";
import InputLabel from '@material-ui/core/InputLabel';
import moment from 'moment';

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
  },
  backdrop: {
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
  formControl: {
    margin: theme.spacing(1),
    width: '100%',
    /**minWidth:120 */
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function MiniDrawer() {
  const classes = useStyles();
  const history = useHistory();
  //Emergency contact block
  const [relationShipToPatient, setRelationShipToPatient] = React.useState("");
  const [emergencyContactName, setEmergencyContactName] = React.useState("");
  const [emergencyContactEmail, setEmergencyContactEmail] = React.useState("");
  const [emergencyContactNumber, setEmergencyContactNumber] = React.useState("");

  const [open] = React.useState(false);
  const [timeValue, timeOnChange] = React.useState('10:00');
  const insurance = false;
  const [isLoading, setLoading] = React.useState(false);
  const [patientId, setPatientId] = React.useState("");
  const [insuranceAvailable, setInsuranceAvailable] = React.useState(false);
  const [patientInsuranceId, setPatientInsuranceId] = React.useState("");
  const [defServiceId, setDefServiceId] = React.useState(30);
  const [showControlsUpload, setShowControlsUpload] = React.useState("none");
  const [showControlsManual, setShowControlsManual] = React.useState("block");
  const [documentTypeHistory, setDocumentTypeHistory] = React.useState({
    front: false,
    back: false,
    combined: false
  });
  const [gridData, setGridData] = React.useState({ payer: [] });
  const [serviceOptions, setServiceOptions] = React.useState([]);
  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  const [specialtiesList, setSpecialtiesList] = React.useState([]);
  const [physicianList, setPhysicianList] = React.useState([]);
  const [physicianFullDetails, setPhysicianFullDetails] = React.useState([]);
  const [visitReasonData, setVisitReasonData] = React.useState({});
  const [specialityCategory, setSpecialityCategory] = React.useState({});
  var today = new Date();
  const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)

  const [patientDetails, setPatientDetails] = React.useState({
    patient_id: "",
    patient_insurance_record_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    dob: today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) + 'T12:00:00.000Z',
    // dob:  (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) + "-" + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" + today.getFullYear() + 'T12:00:00.000Z',
    country_code_label: "US",
    country_code: "",
    contact_number: "",
    email: "",
    dateOfService: today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) + 'T12:00:00.000Z',
    serviceRequiredFor: "Self",
    payername: "",
    payor_external_id: "",
    subId: "",
    eligibility: "",
    add1: "",
    add2: "",
    city: "",
    state: "",
    country: "IN",
    zip: "",
    gender: "",
    insuranceValidDate: today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) + 'T12:00:00.000Z',
    insuranceCompany: "",
    customerNum: "",
    policyNum: "",
    payor_name: "",
    dateOfService: "",
    appointmentFromTime: "",
    appointmentToTime: "",
    attendingDoctor: "",
    attendingSpecialty: "",
    visit_reason: "",
    timeZone: "",
    service_type: defServiceId,
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactEmail: "",
    emergencyContactNumber: ""
  });

  const myRef = useRef(null)
  const executeScroll = () => scrollToRef(myRef)

  const relationshipOptions = [{ value: 'Self', label: 'Self' },
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Child', label: 'Child' },
  { value: 'Employee', label: 'Employee' },
  { value: 'Organ Donor', label: 'Organ Donor' },
  { value: 'Cadaver Donor', label: 'Cadaver Donor' },
  { value: 'Life Partner', label: 'Life Partner' },
  { value: 'Other Relationship', label: 'Other Relationship' },
  { value: 'Other Adult', label: 'Other Adult' },
  ];

  const specialty2Options = [{ value: 'Specialty1', label: 'Specialty1' },
  { value: 'Specialty2', label: 'Specialty2' },
  { value: 'Specialty3', label: 'Specialty3' },
  ];

  const specialtyOptions = [{ value: 'Specialty1', label: 'Specialty1' },
  { value: 'Specialty2', label: 'Specialty2' },
  { value: 'Specialty3', label: 'Specialty3' },
  ];


  const stateOptions = [{ value: 'State1', label: 'State1' },
  { value: 'State2', label: 'State2' },
  { value: 'State3', label: 'State3' },
  { value: 'State4', label: 'State4' },
  ];

  // const doctorOptions = [ { value: 'Doctor1', label: 'Doctor1' },
  // { value: 'Doctor1', label: 'Doctor1' },
  // { value: 'Doctor2', label: 'Doctor2' },
  // { value: 'Doctor3', label: 'Doctor3' },
  // ];
  const genderOptions = [{ value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  ];
  const Relationship = [{
    value: 'Self',
    label: 'Self'
  },
  {
    value: 'Spouse',
    label: 'Spouse'
  },
  {
    value: 'Dependent',
    label: 'Dependent'
  },
  {
    value: 'Children',
    label: 'Children'
  },
  {
    value: 'Others',
    label: 'Others'
  },
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
    // debugger;
    const data = { ...patientDetails };
    const regExNumberOnly = /^\d{0,10}$/;
    const regExNumberDash = /^(?:\d[-]?){0,10}$/;

    if (fieldName === 'contact_number' && val.length > 12) {
      ToastError("Please enter a valid cell number");
      return;
    }
    if (fieldName === 'contact_number' && val.length === 10 && regExNumberOnly.test(val)) {
      val = val.substring(0, 3) + '-' + val.substring(3, 6) + '-' + val.substring(6, 10);
    }
    if (fieldName === 'contact_number' && val.length < 10 && val.length > 0) {
      if (regExNumberDash.test(val) === false) {
        ToastError("Please enter a valid cell number");
      }
    }
    data[fieldName] = val;
    if (fieldName === "subId" && val !== "") {
      data["eligibility"] = "Check Pending"
    }
    setPatientDetails(data);
    if (fieldName === 'service_type') {
      setDefServiceId(val);
    }
    //specialityCategory[val] ? setVisitReasonData(specialityCategory[val]) : setVisitReasonData([]);
  };

  const onFileChangeNew = async (docTypeInt, event) => {
    ////debugger;
    if (event.target.files.length === 0) {
      let type = { ...documentTypeHistory };
      if (docTypeInt === "1") {
        type['front'] = false;
      } else if (docTypeInt === "2") {
        type['back'] = false;
      } else {
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
    if (result instanceof Error) {
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
        patientId: patientId,
        "type-of-side": docTypeInt,
        "type-of-file": event.target.files[0].type,
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
      data: fileData
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        setLoading(false);
        let type = { ...documentTypeHistory };
        if (docTypeInt === "1") {
          type['front'] = true;
          setDocumentTypeHistory(type);
          ToastSuccess("Successfully uploaded frontside image");
        } else if (docTypeInt === "2") {
          type['back'] = true;
          setDocumentTypeHistory(type);
          ToastSuccess("Successfully uploaded backside image");
        } else {
          type['combined'] = true;
          setDocumentTypeHistory(type);
          ToastSuccess("Successfully uploaded frontside and backside image");
        }
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
    //debugger;
    let config = {
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
    //process.env.REACT_APP_BEATS_GET_PHYSICIANS
    let physicianConfig = {
      method: "post",
      url: process.env.REACT_APP_BEATS_GET_PHYSICIANS,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
    }

    let specialtiesConfig = {
      method: "get",
      url: process.env.REACT_APP_BEATS_GET_SPECIALTIES_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
    }


    setLoading(true);

    try {
      //debugger
      const data = { ...patientDetails };
      let payer = await axios(config);
      let service = await axios(serviceConfig);
      let specialties = await axios(specialtiesConfig);
      let physicians = await axios(physicianConfig);

      const specData = specialties.data;

      const specCategory = specData.reduce((catsSoFar, { specialty_name, specialty_id, visit_reason }) => {
        if (!catsSoFar[specialty_name]) catsSoFar[specialty_name] = [];
        // catsSoFar[specialty_name].push(specialty_id);
        catsSoFar[specialty_name].push(visit_reason);
        return catsSoFar;
      }, {});

      //console.log(specialties);
      //console.log("full", physicians.data);

      setPhysicianFullDetails(physicians.data)
      // setSpecialityCategory(specCategory);
      setVisitReasonData(specCategory);

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
          visit_reason: specialties.data[i].visit_reason,
          specialty_name: specialties.data[i].specialty_name,
        };
        specialtiesData.push(obj);

      }

      //console.log("speclist:", specialtiesList);

      setSpecialtiesList(specialtiesList);
      //console.log(specialtiesData);


      let physicianList = [];
      let tempPhysicianList = [];


      for (var i = 0; i < physicians.data.length; i++) {
        let physicianObj = {
          value: physicians.data[i].physician_title + " " + physicians.data[i].first_name + " " + physicians.data[i].last_name,
          label: physicians.data[i].physician_title + " " + physicians.data[i].first_name + " " + physicians.data[i].last_name,
        };
        physicianList.push(physicianObj);
        tempPhysicianList.push(specialties.data[i].specialty_name);

        // let obj = {
        //   visit_reason : specialties.data[i].visit_reason,
        //   specialty_name: specialties.data[i].specialty_name,
        // };
        // specialtiesData.push(obj);

      }

      //console.log("PhysscList:", physicianList);
      setPhysicianList(physicianList);

      let optionsData = [...gridData.payer];
      console.log("TypeOfService: ", JSON.parse(sessionStorage.getItem("attributes")).find((x) => x.name === "custom:TypeOfService").value);
      let defaultServiceTypeId = "30";
      try {
        defaultServiceTypeId = JSON.parse(sessionStorage.getItem("attributes")).find((x) => x.name === "custom:TypeOfService").value;
      } catch (error) {
        console.log("Service Type not set for profile");
      }

      const defaultServiceTypeIdInt = parseInt(defaultServiceTypeId);
      data['service_type'] = defaultServiceTypeIdInt;
      setPatientDetails(data);
      const defaultServiceTypeName = "Reason for Appointment";
      //const defaultServiceTypeName = "Service Type (" + service.data.find(x => x.service_type_Id === defaultServiceTypeIdInt).service_name + ")";
      let options = [{ value: defaultServiceTypeIdInt, label: defaultServiceTypeName }];
      console.log("Default service type set to ", defaultServiceTypeIdInt, defaultServiceTypeName);

      for (var i = 0; i < payer.data.length; i++) {
        let obj = {
          value: payer.data[i].payor_external_id,
          label: payer.data[i].payor_external_id + " - " + payer.data[i].payor_name,
        };
        optionsData.push(obj);

      }


      for (var j = 0; j < service.data.length; j++) {
        let objval = {
          value: service.data[j].service_type_Id,
          label: service.data[j].service_name,
        };
        if (service.data[j].service_type_Id !== defaultServiceTypeIdInt) {
          options.push(objval);
        }
      }

      setGridData({ payer: optionsData });
      setServiceOptions(options);
      setDefServiceId(defaultServiceTypeIdInt);
      setLoading(false);

    } catch (error) {
      //  console.log(error);
      setLoading(false);
    }
  };
  const visitReasonMenuList = visitReasonData[patientDetails.attendingSpecialty] && visitReasonData[patientDetails.attendingSpecialty].map((visit_reason) =>
    <MenuItem value={visit_reason}> {visit_reason} </MenuItem>
  );
  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initiateOnBoarding = () => {
    // debugger;
    let data = { ...patientDetails };

    //Validations - TO BE COMPLETED
    var isError = false;
    var regExContactNumber = /^\d{3}-\d{3}-\d{4}$/;

    if (data.first_name === '') {
      ToastError("Please enter patient's first name");
      isError = true;
    }
    if (data.last_name === '') {
      ToastError("Please enter patient's last name");
      isError = true;
    }
    if (data.contact_number === '' || !regExContactNumber.test(data.contact_number)) {
      ToastError("Please enter contact number");
      isError = true;
    }
    if (data.attendingSpecialty === '') {
      ToastError("Please select speciality");
      isError = true
    }
    if (data.visit_reason === '') {
      ToastError("Please select visit reason");
      isError = true
    }
    if (data.attendingDoctor === '') {
      ToastError("Please select attending staff");
      isError = true
    }
    // if (data.email === '') {
    //   ToastError("Enter valid email");
    //   isError = true;
    // }
    if (data.dob === today.getFullYear() + "/" + today.getDate() + "/" + (today.getMonth() + 1)) {
      ToastError("Please enter your date of birth");
      isError = true;
    }

    if (data.gender === '') {
      ToastError("Please select patient's gender");
      isError = true;
    }

    if (data.dateOfService === '' || data.dateOfService === today.getFullYear() + "/" + today.getDate() + "/" + (today.getMonth() + 1)) {
      ToastError("Please enter valid date of service");
      isError = true;
    }

    // if (data.attendingSpecialty === '') {
    //   ToastError("Select specialty");
    //   isError = true;
    // }

    // if (data.attendingDoctor === '') {
    //   ToastError("Select specialty");
    //   isError = true;
    // }


    if (data.add1 === '') {
      ToastError("Please enter address line 1");
      isError = true;
    }

    /*    if (data.add2 === '') {
         ToastError("Please enter address line 1");
         isError = true;
       } */

    if (data.city === '') {
      ToastError("Please enter city");
      isError = true;
    }

    if (data.state === '') {
      ToastError("Please select state");
      isError = true;
    }

    if (data.zip === '') {
      ToastError("Please enter PIN code");
      isError = true;
    }

    if (data.appointmentFromTime === '') {
      ToastError("Please select appointment from time.");
      isError = true;

    }

    if (data.appointmentToTime === '') {
      ToastError("Please select appointment to time.");
      isError = true;
    }

    if (data.emergencyContactName == "") {
      ToastError("Please enter emergency contact name");
      isError = true;
    }
    if (data.emergencyContactRelationship == "") {
      ToastError("Please select relationship to patient");
      isError = true;
    }
    if (data.emergencyContactEmail == "") {
      ToastError("Please enter emergency email");
      isError = true;
    }
    if (data.emergencyContactNumber == "") {
      ToastError("Please enter emergency contact number");
      isError = true;
    }

    data.appointmentFromTime = moment(data.appointmentFromTime, ["h:mm A"]).format("HH:mm");
    data.appointmentToTime = moment(data.appointmentToTime, ["h:mm A"]).format("HH:mm");

    console.log(data.appointmentToTime);

    // var fromTimeCheck = data.appointmentFromTime.replace(':', '');
    // var fromTime = parseInt(fromTimeCheck);

    // var toTimeCheck = data.appointmentToTime.replace(':', '');
    // var toTime = parseInt(toTimeCheck);

    // if (fromTime >= toTime){
    //   ToastError("Please make sure appointment end time is after the start time.");
    //   isError = true;
    // }

    // if (data.dob === today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate()) {
    //   ToastError("Enter your date of birth");
    //   isError = true;
    // }


    // data['add1'] = "sample";
    // data['add2'] = "sample";
    // data['city'] = "sample";
    // data['state'] = "sample";
    // data['country'] = "IN";
    // data['zip'] = "sample";
    // data['gender'] = "male";
    // data['insuranceValidDate'] = "sample";
    // data['insuranceCompany'] = "sample";
    // data['customerNum'] = "sample";
    // data['policyNum'] = "sample";
    // data['payor_name'] = "sample";
    // data['dateOfService'] = "sample";
    // data['appointmentFromTime'] = "sample";
    // data['appointmentToTime'] = "sample";
    data['attendingDoctor'] = 1;
    // data['attendingSpecialty'] = "sample";

    console.log(data);

    if (isError) {
      return;
    }
    if (data.service_type !== "" && data.service_type !== null) {
      data['service_type'] = parseInt(data['service_type']);
    }
    data['region'] = process.env.REACT_APP_REGION;
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_MANUALOBONARDING_PATIENT_API,
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
        setPatientId(response.data.patientId);
        setPatientInsuranceId(response.data.patientInsuranceId);
        let patientdata = { ...patientDetails };
        console.log(patientdata)
        patientdata["patient_id"] = response.data.patientId;
        patientdata["patient_insurance_record_id"] = response.data.patientInsuranceId;
        setPatientDetails(patientdata);
        ToastSuccess("Patient successfully registered.");
        setLoading(false);
        history.push("/MonitoringDashboard");
        executeScroll();
      })
      .catch(function (error) {
        setLoading(false);
        setPatientDetails({
          patient_id: "",
          patient_insurance_record_id: "",
          first_name: "",
          middle_name: "",
          last_name: "",
          // dob:   (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) + "-" + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" +today.getFullYear() + 'T12:00:00.000Z',
          dob: today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) + 'T12:00:00.000Z',
          country_code: "",
          contact_number: "",
          email: "",
          dateOfService: today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) + 'T12:00:00.000Z',
          serviceRequiredFor: "Self",
          payername: "",
          subId: "",
          eligibility: "",
          service_type: defServiceId
        });

        // setPatientDetails({
        //   patient_id: "",
        //   patient_insurance_record_id: "",
        //   first_name: "",
        //   middle_name: "",
        //   last_name: "",
        //   // dob:   (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) + "-" + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" +today.getFullYear() + 'T12:00:00.000Z',
        //   dob: today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) + 'T12:00:00.000Z',
        //   country_code: "",
        //   contact_number: "",
        //   email: "",
        //   dateOfService: today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) + 'T12:00:00.000Z',
        //   // serviceRequiredFor: "Self",
        //   specialty = "",
        //   reasonForAppointment = "",
        //   payername: "",
        //   subId: "",
        //   eligibility:"",
        //   service_type: defServiceId,
        //   gender = "",
        //   add1 = "",
        //   add2 = "",
        //   city = "",
        //   state = "",
        //   pinCode = "",
        //   insuranceAvailable = "",
        //   insuranceCompany = "",
        //   insuranceCustomerNum = "",
        //   insurancePolicyNum = "",
        //   insuranceValidDate = today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) + 'T12:00:00.000Z',
        //   attendingSpecialty = "",
        //   attendingDoctor = "",
        //   appointmentFromTime = "",
        //   appointmentToTime = ""

        // });
        ToastError("Failed to register patient");
        console.log(error);
      });
  };

  const completeOnBoarding = () => {

    // If the Patient is already created but they want to upload insurance image, do nothing and exit
    if (showControlsUpload === "block") {
      history.push("/MonitoringDashboard");
      return;
    }

    //If the Patient detailed are being entered manually, revalidate all values before deleting/creating the patient again
    let data = { ...patientDetails };

    var isError = false;
    var regExContactNumber = /^\d{3}-\d{3}-\d{4}$/;

    if (data.first_name === '') {
      ToastError("Please enter patient's first name");
      isError = true;
    }
    if (data.last_name === '') {
      ToastError("Please enter patient's last name");
      isError = true;
    }
    if (data.contact_number === '' || !regExContactNumber.test(data.contact_number)) {
      ToastError("Please enter contact number");
      isError = true;
    }
    /*    if (data.email === '') {
         ToastError("Please enter valid email");
         isError = true;
       } */

    if (data.gender === '') {
      ToastError("Please select patient's gender");
      isError = true;
    }

    if (data.dos === '' || data.dos === today.getFullYear() + "/" + today.getDate() + "/" + (today.getMonth() + 1)) {
      ToastError("Please enter valid date of service");
      isError = true;
    }

    if (data.specialty === '') {
      ToastError("Please select specialty");
      isError = true;
    }

    if (data.reasonForAppointment === '') {
      ToastError("Please select reason for appointment");
      isError = true;
    }

    if (data.add1 === '') {
      ToastError("Please enter address line 1");
      isError = true;
    }

    if (data.city === '') {
      ToastError("Please enter city");
      isError = true;
    }

    if (data.state === '') {
      ToastError("Please select state");
      isError = true;
    }



    // if (data.pinCode === '') {
    //   ToastError("Please enter PIN Code");
    //   isError = true;
    // }

    // if (data.insuranceAvailable === 'Yes' &&  (data.insuranceCompany ==='' || insuranceCustomerNum === ''|| insurancePolicyNum === '' || insuranceValidDate === '' )) {
    //   ToastError("Please enter all insurance details");
    //   isError = true;
    // }


    // if (data.attendingSpecialty === '') {
    //   ToastError("Please select attending  specialty");
    //   isError = true;
    // }

    // if (data.attendingDoctor === '') {
    //   ToastError("Please select doctor");
    //   isError = true;
    // }

    // if (data.dob === '' || data.dob === today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate()) {
    //   ToastError("Enter valid date of birth");
    //   isError = true;
    // }
    if (data.dob === '' || data.dob === today.getFullYear() + "/" + today.getDate() + "/" + (today.getMonth() + 1)) {
      ToastError("Please enter valid date of birth");
      isError = true;
    }

    if (isError) {
      return;
    }
    if (data.service_type !== "" && data.service_type !== null) {
      data['service_type'] = parseInt(data['service_type']);
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
        ////debugger;
        ToastSuccess("Patient successfully registered");
        setLoading(false);
        history.push("/MonitoringDashboard");
      })
      .catch(function (error) {
        setLoading(false);
        ToastError("Failed to register patient");
        console.log(error);
      });
  };

  const showUpload = (patientId !== "" ? "block" : "none");
  const showContinue = (patientId !== "" ? "none" : "block");

  const manageShowControls = (checkValue) => {
    if (checkValue === "Upload") {
      setShowControlsUpload("block");
      setShowControlsManual("none");
      setPatientDetailsdata("subId", "");
      setPatientDetailsdata("eligibility", "");
    }
    if (checkValue === "Manually") {
      setShowControlsUpload("none");
      setShowControlsManual("block");
    }
  }


  const [specialtySelected, setSpecialtySelected] = React.useState("");

  /** Function that will set different values to state variable
   * based on which dropdown is selected
   */


  const changeSelectOptionHandler = (event) => {
    setSpecialtySelected(event.target.value);
    console.log(specialtySelected);
  };

  /** Different arrays for different dropdowns */

  const choose = [
    "Choose",
  ];
  const specialty1 = [
    "Doctor 1 for Specialty 1",
    "Doctor 2 for Specialty 1",
    "Doctor 3 for Specialty 1",
  ];
  const specialty2 = [
    "Doctor 4 for Specialty 2",
    "Doctor 5 for Specialty 2",
    "Doctor 6 for Specialty 2",
  ];

  const specialty3 = [
    "Doctor 7 for Specialty 3",
    "Doctor 8 for Specialty 3",
    "Doctor 9 for Specialty 3",
  ];


  const language = ["C++", "Java", "Python", "C#"];
  const dataStructure = ["Arrays", "LinkedList", "Stack", "Queue"];

  /** Type variable to store different array for different dropdown */
  let type = null;

  /** This will be used to create set of options that user will see */
  let doctorOptions = null;

  /** Setting Type variable according to dropdown */

  if (specialtySelected === "Specialty1") {
    type = specialty1;
  } else if (specialtySelected === "Specialty2") {
    type = specialty2;
  } else if (specialtySelected === "Specialty3") {
    type = specialty3;
  }
  else if (specialtySelected === "choose") {

    type = choose;
  }

  //   const stateOptions = [ { value: 'State1', label: 'State1' },
  // { value: 'State2', label: 'State2' },
  // { value: 'State3', label: 'State3' },
  // { value: 'State4', label: 'State4' },
  // ];

  /** If "Type" is null or undefined then options will be null,
   * otherwise it will create a options iterable based on our array
   */
  // const doctorOptions = [];
  if (type) {
    doctorOptions = type.map((el) => <option key={el}>{el}</option>);
    // doctorOptions.append({ value: el, label: el })
  }



  const [fromTime, setFromTime] = React.useState("");
  const onFromTimeChange = selectedOption => {
    setPatientDetailsdata("appointmentFromTime", selectedOption);
    setFromTime(selectedOption);
    console.log(`Option selected:`, selectedOption);
    console.log(fromTime);
  };

  const timesOptions = [{ value: "00:00", label: "00:00" }, { value: "00:30", label: "00:30" }, { value: "01:00", label: "01:00" }, { value: "01:30", label: "01:30" }, { value: "02:00", label: "02:00" }, { value: "02:30", label: "02:30" }, { value: "03:00", label: "03:00" }, { value: "03:30", label: "03:30" }, { value: "04:00", label: "04:00" },
  { value: "04:30", label: "04:30" }, { value: "05:00", label: "05:00" }, { value: "05:30", label: "05:30" }, { value: "06:00", label: "06:00" }, { value: "06:30", label: "06:30" }, { value: "07:00", label: "07:00" }, { value: "07:30", label: "07:30" }, { value: "08:00", label: "08:00" }, { value: "08:30", label: "08:30" }, { value: "09:00", label: "09:00" },
  { value: "10:00", label: "10:00" }, { value: "11:00", label: "11:00" }, { value: "12:00", label: "12:00" }, { value: "12:30", label: "12:30" }, { value: "13:00", label: "13:00" }, { value: "13:30", label: "13:30" }, { value: "14:00", label: "14:00" }, { value: "14:30", label: "14:30" }, { value: "15:00", label: "15:00" }, { value: "15:30", label: "15:30" },
  { value: "16:00", label: "16:00" }, { value: "16:30", label: "16:30" }, { value: "17:00", label: "17:00" }, { value: "17:30", label: "17:30" }, { value: "18:00", label: "18:00" }, { value: "18:30", label: "18:30" }, { value: "19:00", label: "19:00" }, { value: "19:30", label: "19:30" }, { value: "20:00", label: "20:00" }, { value: "20:30", label: "20:30" },
  { value: "21:00", label: "21:00" }, { value: "21:30", label: "21:30" }, { value: "22:00", label: "22:00" }, { value: "22:30", label: "22:30" }, { value: "23:00", label: "23:00" }, { value: "23:30", label: "23:30" },
  ];

  const time = ["12:00 AM",
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

  const getIndex = (formattedTime) => time.findIndex((ele) => ele === formattedTime);

  const getFromTime = time.map((t, index) =>
    <MenuItem value={t}> {t} </MenuItem>)

  const getToTime = time.map((t, index) =>
    <MenuItem value={t} disabled={index <= getIndex(patientDetails.appointmentFromTime)}> {t} </MenuItem>)

  const getSpeciality = specialtiesList.map((val) =>
    <MenuItem value={val.value} > {val.label} </MenuItem>)

  const getPhysician = () => {

    return physicianFullDetails.map((data) => {
      if (data.specialties === patientDetails.attendingSpecialty) {
        let fname = data.first_name ? data.first_name : "";
        let mname = data.middle_name ? data.middle_name : "";
        let lname = data.last_name ? data.last_name : ""
        return <MenuItem value={fname + " " + mname + " " + lname} > {fname + " " + mname + " " + lname} </MenuItem>
      }
    })
  }
  // const getVisitdata = () => {
  //   debugger;
  //   return visitReasonData.map((data) => {
  //     if (data.specialties === patientDetails.attendingSpecialty) {
  //       let fname = data.first_name ? data.first_name : "";
  //       let mname = data.middle_name ? data.middle_name : "";
  //       let lname = data.last_name ? data.last_name : ""
  //       return <MenuItem value={fname + " " + mname + " " + lname} > {fname + " " + mname + " " + lname} </MenuItem>
  //     }
  //   })
  // }



  const timeZoneOptions = [{ value: "(GMT -12:00) Eniwetok, Kwajalein", label: "(GMT -12:00) Eniwetok, Kwajalein" }, { value: "(GMT -11:00) Midway Island, Samoa", label: "(GMT -11:00) Midway Island, Samoa" }, { value: "(GMT -10:00) Hawaii", label: "(GMT -10:00) Hawaii" }, { value: "(GMT -9:30) Taiohae", label: "(GMT -9:30) Taiohae" }, { value: "(GMT -9:00) Alaska", label: "(GMT -9:00) Alaska" }, { value: "(GMT -8:00) Pacific Time (US & Canada)", label: "(GMT -8:00) Pacific Time (US & Canada)" }, { value: "(GMT -7:00) Mountain Time (US & Canada)", label: "(GMT -7:00) Mountain Time (US & Canada)" },
  { value: "(GMT -6:00) Central Time (US & Canada), Mexico City", label: "(GMT -6:00) Central Time (US & Canada), Mexico City" }, { value: "(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima", label: "(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima" },
  { value: "(GMT -4:30) Caracas", label: "(GMT -4:30) Caracas" }, { value: "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz", label: "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz" }, { value: "(GMT -3:30) Newfoundland", label: "(GMT -3:30) Newfoundland" },

  { value: "(GMT -3:00) Brazil, Buenos Aires, Georgetown", label: "(GMT -3:00) Brazil, Buenos Aires, Georgetown" }, { value: "(GMT -2:00) Mid-Atlantic", label: "(GMT -2:00) Mid-Atlantic" },
  { value: "(GMT -1:00) Azores, Cape Verde Islands", label: "(GMT -1:00) Azores, Cape Verde Islands" }, { value: "(GMT) Western Europe Time, London, Lisbon, Casablanca", label: "(GMT) Western Europe Time, London, Lisbon, Casablanca" },
  { value: "(GMT +1:00) Brussels, Copenhagen, Madrid, Paris", label: "(GMT +1:00) Brussels, Copenhagen, Madrid, Paris" }, { value: "(GMT +2:00) Kaliningrad, South Africa", label: "(GMT +2:00) Kaliningrad, South Africa" }, { value: "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg", label: "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg" },
  { value: "(GMT +3:30) Tehran", label: "(GMT +3:30) Tehran" }, { value: "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi", label: "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi" },
  { value: "(GMT +4:30) Kabul", label: "(GMT +4:30) Kabul" }, { value: "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent", label: "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent" },
  { value: "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi", label: "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi" }, { value: "(GMT +5:45) Kathmandu, Pokhara", label: "(GMT +5:45) Kathmandu, Pokhara" },
  { value: "(GMT +6:00) Almaty, Dhaka, Colombo", label: "(GMT +6:00) Almaty, Dhaka, Colombo" }, { value: "(GMT +6:30) Yangon, Mandalay", label: "(GMT +6:30) Yangon, Mandalay" },
  { value: "(GMT +7:00) Bangkok, Hanoi, Jakarta", label: "(GMT +7:00) Bangkok, Hanoi, Jakarta" }, { value: "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong", label: "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong" },
  { value: "(GMT +8:45) Eucla", label: "(GMT +8:45) Eucla" }, { value: "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk", label: "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk" },
  { value: "(GMT +9:30) Adelaide, Darwin", label: "(GMT +9:30) Adelaide, Darwin" }, { value: "(GMT +10:00) Eastern Australia, Guam, Vladivostok", label: "(GMT +10:00) Eastern Australia, Guam, Vladivostok" },
  { value: "(GMT +10:30) Lord Howe Island", label: "(GMT +10:30) Lord Howe Island" }, { value: "(GMT +11:00) Magadan, Solomon Islands, New Caledonia", label: "(GMT +11:00) Magadan, Solomon Islands, New Caledonia" },
  { value: "(GMT +11:30) Norfolk Island", label: "(GMT +11:30) Norfolk Island" }, { value: "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka", label: "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka" },
  { value: "(GMT +12:45) Chatham Islands", label: "(GMT +12:45) Chatham Islands" }, { value: "(GMT +13:00) Apia, Nukualofa", label: "(GMT +13:00) Apia, Nukualofa" },
  { value: "(GMT +14:00) Line Islands, Tokelau", label: "(GMT +14:00) Line Islands, Tokelau" },
  ];

  return (
    <div className={classes.root}>

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
        </div>

        <LeftsideMenu />

      </Drawer>
      <main id="maindiv" className={classes.content}>
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <h5 className="btitle">Patient Registration</h5>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Paper className="pad20 txt-center bx-shadow dbbox">

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={12} className="pd0">
                    <p className="txt-left linkprim">Patient Details</p>
                  </Grid>
                  <Grid item xs={12} sm={12} md={3} className="pd0">
                    <BootstrapInput
                      className="primary-input mb20 width100p"
                      placeholder="Patient First Name"
                      onChange={(e) => {
                        setPatientDetailsdata("first_name", e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={3} className="pd0">
                    <BootstrapInput
                      className="primary-input mb20 width100p"
                      placeholder="Patient Middle Name (Optional)"
                      onChange={(e) => {
                        setPatientDetailsdata("middle_name", e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} className="pd0">
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12} md={6} className="pd0">
                        <BootstrapInput
                          onChange={(e) => {
                            setPatientDetailsdata("last_name", e.target.value);
                          }}
                          className="primary-input mb20 width100p"
                          placeholder="Patient Last Name"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={3} className="pt0">
                    <Datepickermod
                      label={"Date of Birth (dd/mm/yyyy)"}
                      value={(patientDetails.dob.length === 20 || patientDetails.dob.length === 24) ? patientDetails.dob.split("T")[0] + "T12:00:00Z" : patientDetails.dob}
                      maxDate={Date.now()}
                      dateChanged={(val) => {
                        setPatientDetailsdata("dob", val);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} className="pd0">
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12} md={6} className="pd0">
                        <Select className="selectbox1"
                          onChange={(selectedOption) => {
                            setPatientDetailsdata("gender", selectedOption.value);
                            console.log(`Gender selected:`, selectedOption);
                          }}
                          styles={customStyles}
                          options={genderOptions}
                          defaultValue={{ value: 'self', label: 'Assigned Gender at Birth' }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sm={12} md={3} className="pt0">

                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={12}>
                    <p className="txt-left linkprim">Appointment Details</p>
                  </Grid>
                  <Grid item xs={12} sm={12} md={3} className="datepicker-cut">
                    <Datepickermod
                      label={"Date of Service (dd/mm/yyyy)"}
                      value={(patientDetails.dateOfService.length === 20 || patientDetails.dateOfService.length === 24) ? patientDetails.dateOfService.split("T")[0] + "T12:00:00Z" : patientDetails.dateOfService}
                      minDate={Date.now()}
                      dateChanged={(val) => {
                        setPatientDetailsdata("dateOfService", val);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={3} className="datepicker-cut MUIselect_cust" >
                    {/* <div>
                          <TimePicker
                            onChange={timeOnChange}
                            value={timeValue}
                            clockIcon = "From"
                          />
                        </div> 
                        
                        onChange = {(selectedOption) => {
                            setPatientDetailsdata("appointmentFromTime", selectedOption.value);
                            console.log(`Option selected:`, selectedOption);
                          }}
                        */}

                    {/* <Select className="selectbox1"
                            onChange = {(selectedOption) => {
                              setPatientDetailsdata("appointmentFromTime", selectedOption.value);
                              console.log(`From Time selected:`, selectedOption);
                            }}
                            //styles={customStyles}
                            //options={timesOptions} 
                            // defaultValue={{ value: 'self', label: 'From Time...' }}
                            value={0}
                          > </Select>*/}

                    <FormControl variant="outlined" label="outlined" className={classes.formControl}>
                      <InputLabel id="appointment-from-time-label">From Time</InputLabel>
                      <MUIselect

                        id="appointmentFromTime"
                        value={patientDetails.appointmentFromTime}
                        onChange={(e) => {
                          setPatientDetailsdata("appointmentFromTime", e.target.value);
                        }}
                        className={classes.overridemuibordercolor}
                        //className="selectborder"
                        //fullWidth
                        labelId="appointment-from-time-label"
                        label="From Time"
                      >
                        {getFromTime}
                      </MUIselect>
                    </FormControl>

                  </Grid>

                  <Grid item xs={12} sm={12} md={3} className="datepicker-cut MUIselect_cust">
                    {/* <div>
                          <TimePicker
                            onChange={timeOnChange}
                            value={timeValue}
                            clockIcon = "To"
                          />
                        </div> */}


                    {/* <Select className="selectbox1"
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
                        /> */}

                    {/* <Select className="selectbox1"
                            onChange = {(selectedOption) => {
                              setPatientDetailsdata("appointmentToTime", selectedOption.value);
                              console.log(`To Time selected:`, selectedOption);
                            }}
                            styles={customStyles}
                            options={timesOptions} 
                            defaultValue={{ value: 'self', label: 'To Time...' }}
                          >
                            {}
                          </Select> */}

                    <FormControl variant="outlined" label="outlined" className={classes.formControl}>
                      <InputLabel id="appointment-to-time-label">To Time</InputLabel>
                      <MUIselect
                        id="appointmentFromTime"
                        value={patientDetails.appointmentToTime}
                        onChange={(e) => {
                          setPatientDetailsdata("appointmentToTime", e.target.value);
                        }}
                        //className="selectborder"
                        fullWidth
                        label="To time"
                        labelId="appointment-to-time-label"
                      >
                        {getToTime}
                      </MUIselect>
                    </FormControl>

                  </Grid>
                  <Grid item xs={12} sm={12} md={3} className="datepicker-cut ">

                    <Select className="selectbox1"
                      onChange={(selectedOption) => {
                        setPatientDetailsdata("timeZone", selectedOption.value);
                        console.log(`To Time selected:`, selectedOption);
                      }}
                      styles={customStyles}
                      options={timeZoneOptions}
                      defaultValue={{ value: '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi', label: '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi' }}
                    />
                    {/* 
                        <select className="selectbox1" style = {{height: 50, width: 295}}>
                          <option value="-12:00">(GMT -12:00) Eniwetok, Kwajalein</option>
                          <option value="-11:00">(GMT -11:00) Midway Island, Samoa</option>
                          <option value="-10:00">(GMT -10:00) Hawaii</option>
                          <option value="-09:50">(GMT -9:30) Taiohae</option>
                          <option value="-09:00">(GMT -9:00) Alaska</option>
                          <option value="-08:00">(GMT -8:00) Pacific Time (US &amp; Canada)</option>
                          <option value="-07:00">(GMT -7:00) Mountain Time (US &amp; Canada)</option>
                          <option value="-06:00">(GMT -6:00) Central Time (US &amp; Canada), Mexico City</option>
                          <option value="-05:00">(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima</option>
                          <option value="-04:50">(GMT -4:30) Caracas</option>
                          <option value="-04:00">(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz</option>
                          <option value="-03:50">(GMT -3:30) Newfoundland</option>
                          <option value="-03:00">(GMT -3:00) Brazil, Buenos Aires, Georgetown</option>
                          <option value="-02:00">(GMT -2:00) Mid-Atlantic</option>
                          <option value="-01:00">(GMT -1:00) Azores, Cape Verde Islands</option>
                          <option value="+00:00" >(GMT) Western Europe Time, London, Lisbon, Casablanca</option>
                          <option value="+01:00">(GMT +1:00) Brussels, Copenhagen, Madrid, Paris</option>
                          <option value="+02:00">(GMT +2:00) Kaliningrad, South Africa</option>
                          <option value="+03:00">(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg</option>
                          <option value="+03:50">(GMT +3:30) Tehran</option>
                          <option value="+04:00">(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi</option>
                          <option value="+04:50">(GMT +4:30) Kabul</option>
                          <option value="+05:00">(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent</option>
                          <option value="+05:50" selected="selected">(GMT +5:30) Bombay, Calcutta, Madras, New Delhi</option>
                          <option value="+05:75">(GMT +5:45) Kathmandu, Pokhara</option>
                          <option value="+06:00">(GMT +6:00) Almaty, Dhaka, Colombo</option>
                          <option value="+06:50">(GMT +6:30) Yangon, Mandalay</option>
                          <option value="+07:00">(GMT +7:00) Bangkok, Hanoi, Jakarta</option>
                          <option value="+08:00">(GMT +8:00) Beijing, Perth, Singapore, Hong Kong</option>
                          <option value="+08:75">(GMT +8:45) Eucla</option>
                          <option value="+09:00">(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk</option>
                          <option value="+09:50">(GMT +9:30) Adelaide, Darwin</option>
                          <option value="+10:00">(GMT +10:00) Eastern Australia, Guam, Vladivostok</option>
                          <option value="+10:50">(GMT +10:30) Lord Howe Island</option>
                          <option value="+11:00">(GMT +11:00) Magadan, Solomon Islands, New Caledonia</option>
                          <option value="+11:50">(GMT +11:30) Norfolk Island</option>
                          <option value="+12:00">(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</option>
                          <option value="+12:75">(GMT +12:45) Chatham Islands</option>
                          <option value="+13:00">(GMT +13:00) Apia, Nukualofa</option>
                          <option value="+14:00">(GMT +14:00) Line Islands, Tokelau</option>
                        </select> */}


                  </Grid>
                  <Grid container spacing={3}>
                  </Grid>


                  <Grid container spacing={3}>
                  </Grid>

                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={4}>
                  </Grid>

                </Grid>
                <Grid container spacing={3}>

                  <Grid item xs={12} sm={12} md={4} className="txt-left form-radio MUIselect_cust" >
                    {/* <Select className="selectbox1"
                          onChange = {(selectedOption) => {
                            setPatientDetailsdata("attendingSpecialty", selectedOption.value);
                            console.log(`Option selected:`, selectedOption);
                          }}
                          styles={customStyles}
                          options={specialtiesList} 
                          defaultValue={{ value: 'self', label: 'Specialty' }}
                        /> */}

                    <FormControl variant="outlined" label="outlined" className={classes.formControl}>
                      <InputLabel id="appointment-attending-speciality-label">Specialty</InputLabel>
                      <MUIselect
                        id="attendingSpecialty"
                        value={patientDetails.attendingSpecialty}
                        onChange={(e) => {
                          setPatientDetailsdata("attendingSpecialty", e.target.value);
                        }}
                        className="selectborder"
                        fullWidth
                        label="Speciality"
                        labelId="appointment-attending-speciality-label"
                      >
                        {getSpeciality}
                      </MUIselect>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={12} md={4} className="MUIselect_cust">
                    {/* <Select className="selectbox1"
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
                        /> */}
                    <FormControl variant="outlined" label="outlined" className={classes.formControl}>
                      <InputLabel id="appointment-visit-reason-label">Visit Reason</InputLabel>
                      <MUIselect
                        id="visit_reason"
                        value={patientDetails.visit_reason}
                        onChange={(e) => {
                          setPatientDetailsdata("visit_reason", e.target.value);
                        }}
                        className="selectborder"
                        fullWidth
                        label="Speciality"
                        labelId="appointment-visit-reason-label"
                      >
                        {visitReasonMenuList}
                      </MUIselect>
                    </FormControl>
                  </Grid>

                  <Grid Grid item xs={
                    12
                  }
                    sm={
                      12
                    }
                    md={
                      4
                    }
                    className="MUIselect_cust" >
                    <Grid item xs={12} sm={12} md={12}>
                      {/* <Select className="selectbox1"
                          onChange = {(selectedOption) => {
                            setPatientDetailsdata("attendingDoctor", selectedOption.value);
                            console.log(`Option selected:`, selectedOption);
                          }}
                          styles={customStyles}
                          options={physicianList} 
                          defaultValue={{ value: 'self', label: 'Attending Clinician' }}
                        /> */}
                      <FormControl variant="outlined" label="outlined" className={classes.formControl}>
                        <InputLabel id="appointment-attending-staff-label">Attending Staff</InputLabel>
                        <MUIselect
                          id="attendingDoctor"
                          value={patientDetails.attendingDoctor}
                          onChange={(e) => {
                            setPatientDetailsdata("attendingDoctor", e.target.value);
                          }}
                          className="selectborder"
                          fullWidth
                          label="Speciality"
                          labelId="appointment-attending-staff-label"
                        >
                          {getPhysician()}
                        </MUIselect>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={12} className="pd0">
                    <p className="txt-left linkprim">Contact Details</p>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} className="pd0">
                    <BootstrapInput
                      className="primary-input mb20 width100p"
                      placeholder="Address Line 1"
                      value={patientDetails.add1}
                      onChange={(e) => {
                        setPatientDetailsdata("add1", e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} className="pd0">
                    <BootstrapInput
                      className="primary-input mb20 width100p"
                      placeholder="Address Line 2 (Optional)"
                      value={patientDetails.add2}
                      onChange={(e) => {
                        setPatientDetailsdata("add2", e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} className="pd0">
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} className="pd0">
                    <BootstrapInput
                      className="primary-input mb20 width100p"
                      placeholder="City"
                      value={patientDetails.city}
                      onChange={(e) => {
                        setPatientDetailsdata("city", e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} className="pd0">
                    {/* <Select className="selectbox1"
                          onChange = {(selectedOption) => {
                            setPatientDetailsdata("state", selectedOption.value);
                            console.log(`Option selected:`, selectedOption);
                          }}
                          styles={customStyles}
                          options={stateOptions} 
                          defaultValue={{ value: 'self', label: 'State' }}
                        /> */}
                    <BootstrapInput
                      className="primary-input mb20 width100p"
                      placeholder="State"
                      value={patientDetails.state}
                      onChange={(e) => {
                        setPatientDetailsdata("state", e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} className="pd0">
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} className="pd0">
                    <BootstrapInput
                      className="primary-input mb20 width100p"
                      placeholder="Pin Code"
                      value={patientDetails.zip}
                      onChange={(e) => {
                        setPatientDetailsdata("zip", e.target.value);
                      }}
                    />
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
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} className="pd0">
                    <BootstrapInput
                      className="primary-input mb20 width100p"
                      placeholder="Email (Optional)"
                      value={patientDetails.email}
                      onChange={(e) => {
                        setPatientDetailsdata("email", e.target.value);
                      }}
                    />
                  </Grid>



                  <Grid item xs={12} sm={12} md={4} className="pd0">
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} className="pd0">
                  </Grid>

                  {/** Emergency contact block start*/}

                  <Grid item xs={12} sm={12} md={12} className="pd0">
                    <p className="txt-left linkprim">Emergency Contact</p>
                  </Grid>
                  <Grid container spacing={3} style={{ marginLeft: 0, marginTop: 5, marginBottom: 5 }}>

                    <Grid item xs={12} sm={12} md={4} className="pd0">
                      <BootstrapInput
                        className="primary-input mb20 width100p"
                        placeholder="Name"
                        value={patientDetails.emergencyContactName}
                        onChange={(e) => {
                          setPatientDetailsdata("emergencyContactName", e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} className="txt-left form-radio MUIselect_cust" >
                      <FormControl variant="outlined" label="outlined" className={classes.formControl}>
                        <InputLabel id="Relationship-to-Patient-label">Relationship to Patient</InputLabel>
                        <MUIselect
                          id="attendingSpecialty"
                          //value={patientDetails.attendingSpecialty}
                          value={patientDetails.emergencyContactRelationship}
                          onChange={(e) => {
                            setPatientDetailsdata("emergencyContactRelationship", e.target.value);
                            //setPatientDetailsdata("attendingSpecialty", e.target.value);
                          }}
                          className="selectborder"
                          fullWidth
                          label="Relationship to Patient"
                          labelId="Relationship-to-Patient-label"
                        >
                          {
                            ["Spouse", "Parent", "Siblings", "Partner", "Friend", "Others"].map((item) => (
                              <MenuItem value={item}>{item}</MenuItem>
                            ))
                          }
                        </MUIselect>
                      </FormControl>
                    </Grid>
                  </Grid>


                  <Grid container spacing={3} style={{ marginLeft: 0, }} >
                    <Grid item xs={12} sm={12} md={4} spacing={3} className="pd0">
                      <BootstrapInput
                        className="primary-input mb20 width100p"
                        placeholder="Email"
                        value={patientDetails.emergencyContactEmail}
                        onChange={(e) => {
                          setPatientDetailsdata("emergencyContactEmail", e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} className="pd0">
                      <BootstrapInput
                        className="primary-input mb20 width100p"
                        placeholder="Contact Number"
                        value={patientDetails.emergencyContactNumber}
                        onChange={(e) => {
                          setPatientDetailsdata("emergencyContactNumber", e.target.value);
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sm={12} md={4} className="pd0" />
                  <Grid item xs={12} sm={12} md={4} className="pd0" />
                  {/** Emergency contact block end*/}



                  <Grid item xs={12} sm={12} md={12} className="pd0">
                    <p className="txt-left linkprim">Do you have healthcare insurance?</p>
                  </Grid>

                  <FormControlLabel
                    value="Upload"
                    control={<Radio
                      // checked={showControlsUpload === "block"}
                      checked={insuranceAvailable}
                      onClick={(e) => {
                        setShowControlsUpload("inline");
                        setInsuranceAvailable(true);
                      }
                      }
                      onChange={(e) => {
                        setShowControlsUpload("inline");
                        setInsuranceAvailable(true);
                      }}
                    />}
                    label="Yes"
                    style={{ marginLeft: 10 }}
                  />
                  <FormControlLabel
                    value="Upload"
                    control={<Radio
                      // checked={showControlsUpload === "block"}
                      checked={!insuranceAvailable}
                      onClick={(e) => {
                        setShowControlsUpload("none");
                        setInsuranceAvailable(false);
                      }
                      }
                      onChange={(e) => {
                        setShowControlsUpload("none");
                        setInsuranceAvailable(false);
                      }}
                    />}
                    label="No"
                  />
                  {/* <div style={{ marginLeft: 12 , marginTop: 6}}>
                      <input type="radio" value="Male" name="gender" checked ={insurance === false} /> Yes
                      {' '} 
                      {' '}
                      <input type="radio" value="Female" name="gender" checked ={insurance === true}/> No
                    </div> */}
                  {/* style={{"display":showControlsUpload }} */}

                  <Grid item xs={12} sm={12} md={4} className="pd0">
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} className="pd0">
                  </Grid>

                  <Grid item xs={12} sm={12} md={4} className="pd0" style={{ "display": showControlsUpload }}>
                    <BootstrapInput
                      className="primary-input mb20 width100p"
                      placeholder="Insurance Company"
                      value={patientDetails.insuranceCompany}
                      onChange={(e) => {
                        setPatientDetailsdata("insuranceCompany", e.target.value);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={4} className="pd0" style={{ "display": showControlsUpload }}>
                    <BootstrapInput
                      className="primary-input mb20 width100p"
                      placeholder="Customer No."
                      value={patientDetails.customerNum}
                      onChange={(e) => {
                        setPatientDetailsdata("customerNum", e.target.value);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={4} className="pd0" style={{ "display": showControlsUpload }}>
                    <BootstrapInput
                      className="primary-input mb20 width100p"
                      placeholder="Policy No."
                      value={patientDetails.policyNum}
                      onChange={(e) => {
                        setPatientDetailsdata("policyNum", e.target.value);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={4} className="pd0 marcust" style={{ "display": showControlsUpload }}>
                    <Datepickermod
                      style={{ marginTop: "0px" }}
                      label={"Valid From"}
                      value={(patientDetails.dateOfService.length === 20 || patientDetails.dateOfService.length === 24) ? patientDetails.dateOfService.split("T")[0] + "T12:00:00Z" : patientDetails.dateOfService}
                      //minDate={Date.now()}
                      dateChanged={(val) => {
                        setPatientDetailsdata("insuranceValidDate", val);
                      }}
                    />


                  </Grid>

                  <Grid item xs={12} sm={12} md={4} className="pd0" style={{ "display": showControlsUpload }}>
                    <BootstrapInput
                      className="primary-input mb20 width100p"
                      placeholder="Subscriber Name"
                    />
                  </Grid>


                  <Grid item xs={12} sm={12} md={4} className="pd0" style={{ "display": showControlsUpload }}>
                    <Select className="selectbox1"
                      onChange={(selectedOption) => {
                        setPatientDetailsdata("gender", selectedOption.value);
                      }}
                      styles={customStyles}
                      options={Relationship}
                      defaultValue={{ value: 'self', label: 'Relationship to Patient ' }}
                    />
                  </Grid>

                  {/* <Grid item xs={12} sm={12} md={4} className="datepicker-cut" style ={{"display":showControlsUpload}}>
                        <Datepickermod 
                          label={"Valid From (dd/mm/yyyy)"}
                          value={(patientDetails.insuranceValidDate.length === 20 || patientDetails.insuranceValidDate.length === 24) ? patientDetails.insuranceValidDate.split("T")[0]+"T12:00:00Z" : patientDetails.insuranceValidDate }
                          minDate={Date.now()}
                          dateChanged={(val) => {
                            setPatientDetailsdata("insuranceValidDate", val);
                          }}
                        />
                    </Grid> */}





                  {/* <input 
                      type="checkbox" 
                      checked={ this.state.checked } 
                      onChange={ this.handleChange } /> */}




                </Grid>


                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={12}>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      className="txt-left form-radio"
                    >
                      {/* <Grid container className="pb30 pt30"> */}
                      {/* <Grid item xs={12} sm={12} md={12} style={{"display":showContinue }}>
                      <a href="/Dashboard" className="btn-secondary mr30">
                        Cancel
                      </a>
                        <Button
                          disabled={patientId === "" ? false : true}
                          variant="contained"
                          className="btn-primary"
                          onClick={initiateOnBoarding}
                        >
                          Continue
                        </Button>
                      </Grid> */}
                      {/* </Grid> */}
                      {/* <FormControl component="fieldset" style={{"display":showUpload }}> */}
                      {/* <Grid item xs={12} sm={12} md={12}>
                            <p className="txt-left linkprim mb10 mt20">Attending Staff</p>
                        </Grid> */}
                      {/* <Grid container spacing={4}>
                                <Grid item xs={12} sm={12} md={3}>

                                  <select onChange = {changeSelectOptionHandler} 
                            style = {{height: 50, width: 310}} className="selectbox1">
                                    <option value = "choose">Choose Specialty...</option>
                                    <option value = "Specialty1">Specialty1</option>
                                    <option value = "Specialty2">Specialty2</option>
                                    <option value = "Specialty3">Specialty3</option>
                                  </select> */}

                      {/* 
                        <Select className="selectbox1"
                          onChange = {(selectedOption) => {
                            setPatientDetailsdata("gender", selectedOption.value);
                            console.log(`Gender selected:`, selectedOption);
                          }}
                          styles={customStyles}
                          options={genderOptions} 
                          defaultValue={{ value: 'self', label: 'Assigned Gender at Birth' }}
                        /> */}
                      {/* <Select className="selectbox1"
                                    onChange = {(selectedOption) => {
                                      setPatientDetailsdata("serviceRequiredFor", selectedOption.value);
                                      console.log(`Option selected:`, selectedOption);
                                    }}
                                    styles={customStyles}
                                    options={specialty2Options} 
                                    onChange={changeSelectOptionHandler}
                                    defaultValue={{ value: 'self', label: 'Specialty' }}
                                /> */}
                      {/* <BootstrapInput
                                    className="primary-input mb20 width100p"
                                    placeholder="Specialty"
                                    onChange={(e) => {
                                      setPatientDetailsdata("payor_external_id", e.target.value);
                                    }}
                                  /> */}
                      {/* <Select className="selectbox1"
                                    onChange = {(selectedOption) => {
                                      setPatientDetailsdata("payor_external_id", selectedOption.value);
                                    }}
                                    styles={customStyles}
                                    options={gridData.payer}
                                    value={gridData.payer.filter(option => 
                                      option.value === (patientDetails["payor_external_id"] ))}
                                  /> */}
                      {/* </Grid> */}
                      {/* <Grid item xs={12} sm={12} md={4}>

                                    <select className="selectbox1" onChange = {(selectedOption) => {
                            setPatientDetailsdata("attendingDoctor", selectedOption.value);
                            console.log(`Option selected:`, selectedOption);
                          }} style = {{height: 50, width: 310}}>

                                      {doctorOptions}

                                    </select> */}
                      {/* <Select className="selectbox1"
                                        onChange = {(selectedOption) => {
                                          setPatientDetailsdata("serviceRequiredFor", selectedOption.value);
                                          console.log(`Option selected:`, selectedOption);
                                        }}
                                        styles={customStyles}
                                        options={doctorOptions} 
                                        defaultValue={{ value: 'self', label: 'Attending Doctor' }}
                                    /> */}
                      {/* <BootstrapInput
                                    className="primary-input mb20 width100p"
                                    placeholder="Name of Attending Doctor"
                                    onChange={(e) => {
                                      setPatientDetailsdata(
                                        "subId",
                                        e.target.value
                                      );
                                    }}
                                  /> */}
                      {/* </Grid>
                          </Grid> */}
                      {/* <RadioGroup aria-label="gender" name="gender1">
                            <FormControlLabel
                              value="Upload"
                              control={<Radio  
                                checked={showControlsUpload === "block"}
                                onChange={(e) => {
                                  manageShowControls(
                                    e.target.value
                                  );
                                }}      
                              />}
                              label="Upload front and back of patient's insurance card"
                            />
                            <div style={{"display":showControlsUpload }}>
                              <Grid container spacing={3}>
                                <Grid item xs={12} sm={12} md={6}>
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
                           </div> */}

                      {/* 
                            <div style={{"display":showControlsManual }}>
                              <Grid container spacing={4}>
                                <Grid item xs={12} sm={12} md={4}>

                                <BootstrapInput
                                    className="primary-input mb20 width100p"
                                    placeholder="Specialty"
                                    onChange={(e) => {
                                      setPatientDetailsdata("payor_external_id", e.target.value);
                                    }}
                                  />
                                  {/* <Select className="selectbox1"
                                    onChange = {(selectedOption) => {
                                      setPatientDetailsdata("payor_external_id", selectedOption.value);
                                    }}
                                    styles={customStyles}
                                    options={gridData.payer}
                                    value={gridData.payer.filter(option => 
                                      option.value === (patientDetails["payor_external_id"] ))}
                                  /> */}
                      {/* </Grid> */}
                      {/* <Grid item xs={12} sm={12} md={4}>
                                  <BootstrapInput
                                    className="primary-input mb20 width100p"
                                    placeholder="Name of Attending Doctor"
                                    onChange={(e) => {
                                      setPatientDetailsdata(
                                        "subId",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </Grid> */}
                      {/* </Grid> */}
                      {/* </div>  */}
                      {/* </RadioGroup> */}
                      {/* <FormControlLabel
                              value="Manually"
                              control={<Radio 
                                checked={showControlsManual === "block"}
                                onChange={(e) => {
                                  manageShowControls(
                                    e.target.value
                                  );
                                }}      
                              />}
                              label="Manually enter patient's insurance card details"
                            /> */}
                      <Grid container className="pb30 pt30">
                        <Grid item xs={12} sm={12} md={12}>
                          <a href="/Dashboard" className="btn-secondary mr30">
                            Cancel
                          </a>
                          <Button
                            variant="contained"
                            className="btn-primary"
                            onClick={initiateOnBoarding}
                          >
                            Complete Registration
                          </Button>
                        </Grid>
                      </Grid>
                      {/* </FormControl> */}

                    </Grid>

                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </div >
        <div ref={myRef}></div>
      </main >

    </div >
  );
}
