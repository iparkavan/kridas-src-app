import React from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import "react-datepicker/dist/react-datepicker.css";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
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
}));

export default function MiniDrawer() {
  const classes = useStyles();
  const [isLoading, setLoading] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  const [patientId, setPatientId] = React.useState("");
  const [organisation, setOrganisation] = React.useState("");
  const [providerid, setproviderid] = React.useState("");
  const history = useHistory();
  const { code } = useParams();
  const [documentTypeHistory, setDocumentTypeHistory] = React.useState({
    front:false,
    back:false,
    sec_front:false,
    sec_back:false,
    ter_front:false,
    ter_back:false,
    dl_front:false,
    dl_back:false
  });
  const [isError, setError] = React.useState("");
  
  const [patientDetails, setPatientDetails] = React.useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    dob: "",
    country_code: "",
    contact_number: "",
    email: "",
    dateOfService: "",
    serviceRequiredFor: "self",
    payername: "",
    payor_external_id: "",
    subId: "",
    sub_first_name: "",
    sub_middle_name: "",
    sub_last_name: "",
    sub_dob: "",
  });

  const setPatientDetailsdata = (fieldName, val) => {
    ////debugger;
    const data = { ...patientDetails };
    data[fieldName] = val;
    setPatientDetails(data);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onFileChangeNew = async(docTypeInt, event) => {
    ////debugger;
    if (event.target.files.length === 0) {
      let type = {...documentTypeHistory};  
      if(docTypeInt==="1") {
        type['front'] = false;
      }else if(docTypeInt==="2"){
        type['back'] = false;
      }else if(docTypeInt==="3"){
        type['sec_front'] = false;
      }else if(docTypeInt==="4"){
        type['sec_back'] = false;
      }else if(docTypeInt==="5"){
        type['ter_front'] = false;
      }else if(docTypeInt==="6"){
        type['ter_back'] = false;
      }else if(docTypeInt==="7"){
        type['dl_front'] = false;
      }else{
        type['dl_back'] = false;
      }
      setDocumentTypeHistory(type);
      return;
    }

    let imgPreview = document.getElementById("img1-preview");
    switch (docTypeInt) {
      case "1": 
        imgPreview = document.getElementById("img1-preview");
        break;
      case "2": 
        imgPreview = document.getElementById("img2-preview");
        break;
      case "3": 
        imgPreview = document.getElementById("img3-preview");
        break;
      case "4": 
        imgPreview = document.getElementById("img4-preview");
        break;
      case "5": 
        imgPreview = document.getElementById("img5-preview");
        break;
      case "6": 
        imgPreview = document.getElementById("img6-preview");
        break;
      case "7": 
        imgPreview = document.getElementById("img7-preview");
        break;
      default:
        imgPreview = document.getElementById("img8-preview");
        break;
    }
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
      url: process.env.REACT_APP_BEATS_REMOTE_FILE_UPLOAD_API,
      headers: {
        "Content-Type": "application/json",
        providerid: providerid,
        filename: filename,
        patientId: patientId,
        "type-of-side": docTypeInt,
        code: code.split("=")[1],
        "type-of-file": event.target.files[0].type,
        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
      },
      data: fileData,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        setLoading(false);
        let type = {...documentTypeHistory};
        if(docTypeInt==="1"){
          type['front'] = true;
          setDocumentTypeHistory(type);
          ToastSuccess("Successfully uploaded frontside image");
        }else if(docTypeInt==="2"){
          type['back'] = true;
          setDocumentTypeHistory(type);
          ToastSuccess("Successfully uploaded backside image");
        }else if(docTypeInt==="3"){
          type['sec_front'] = true;
          setDocumentTypeHistory(type);
          ToastSuccess("Successfully uploaded secondary frontside image");
        }else if(docTypeInt==="4"){
          type['sec_back'] = true;
          setDocumentTypeHistory(type);
          ToastSuccess("Successfully uploaded secondary backside image");
        }else if(docTypeInt==="5"){
          type['ter_front'] = true;
          setDocumentTypeHistory(type);
          ToastSuccess("Successfully uploaded tertiary frontside image");
        }else if(docTypeInt==="6"){
          type['ter_back'] = true;
          setDocumentTypeHistory(type);
          ToastSuccess("Successfully uploaded tertiary backside image");
        }else if(docTypeInt==="7"){
          type['dl_front'] = true;
          setDocumentTypeHistory(type);
          ToastSuccess("Successfully uploaded licence frontside image");
        }else{
          type['dl_back'] = true;
          setDocumentTypeHistory(type);
          ToastSuccess("Successfully uploaded licence backside image");
        }
    })
    .catch(function (error) {
      setLoading(false);
      ToastError("Failed To upload document!");
      console.log(error);
    });
    setUploadedFiles(filedata);
  };

  const fetchData = () => {
    let data = {
      code: code.split("=")[1],
    };

    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_REMOTE_FETCH_PATIENT_DETAILS_API,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        ////debugger;
        setLoading(false);
        let data = { ...patientDetails };
        data["first_name"] = response.data[0].first_name;
        data["middle_name"] = response.data[0].middle_name;
        data["last_name"] = response.data[0].last_name;
        data["dob"] = response.data[0].dob;
        setOrganisation(response.data[0].organisation);
        sessionStorage.setItem("organisation", response.data[0].organisation);
        setPatientDetails(data);
        setPatientId(response.data[0].patient_id);
        setproviderid(response.data[0].cognitoid);
      })
      .catch(function (error) {
        //debugger;
        setLoading(false);
        ToastError(error.response.data.error);
        setError(error.response.data.error);
        console.log(error);
      });
  };

  React.useEffect(() => {
    fetchData();
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshPage = ()=>{
    window.location.reload();
  }

 const initiateOnBoarding = () => {
    ////debugger;
    let patientData = { ...patientDetails };
    patientData["code"] = code.split("=")[1];
    let config = {
      method: "post",
      url: process.env.REACT_APP_BEATS_MANUAL_MOBILE_PATIENT_UPDATE_API,
      headers: {
        "Content-Type": "application/json",
      },
      data: patientData,
    };
    setLoading(true);
    axios(config)
      .then(function (response) {
        ////debugger;
        ToastSuccess("Insurance details successfully submitted");
        setLoading(false);
        history.push("/SubmittedSuccessfully");
      })
      .catch(function (error) {
        setLoading(false);
        ToastError(error.response.data.error);
        console.log(error);
      });
  };
  return (
    <div className={classes.root}>
      <CssBaseline />
      <ToastContainer />
      <main id="maindiv" className={classes.content}>
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <div
          className={classes.root}
          style={{
            display:
              isError === "link Has Expired" || isError === "link is Already Used"
                ? "none"
                : "block",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <h5 className="btitle">{organisation}</h5>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Paper className="pad20 txt-center bx-shadow dbbox">
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={12} className="pd0">
                    <p className="txt-left linkprim">
                      Please confirm your details/ update if necessary{" "}
                    </p>
                  </Grid>
                  <Grid item xs={12} sm={12} md={3} className="pd0">
                    <BootstrapInput
                      className="primary-input mb20 width100p"
                      placeholder="Patient First Name"
                      value={patientDetails.first_name}
                      onChange={(e) => {
                        setPatientDetailsdata("first_name", e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={3} className="pd0">
                    <BootstrapInput
                      className="primary-input mb20 width100p"
                      placeholder="Patient Middle Name"
                      value={patientDetails.middle_name}
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
                          value={patientDetails.last_name}
                          className="primary-input mb20 width100p"
                          placeholder="Patient Last Name"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={3} className="pt0">
                    <Datepickermod
                      label={"DOB"}
                      value={(patientDetails.dob.length === 20 || patientDetails.dob.length === 24) ? patientDetails.dob.split("T")[0]+"T12:00:00Z" : patientDetails.dob}
                      maxDate={Date.now()}
                      dateChanged={(val) => {
                        setPatientDetailsdata("dob", val);
                      }}
                    />
                  </Grid>
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
                      <FormControl component="fieldset">
                        <RadioGroup aria-label="gender" name="gender1">
                          <FormControlLabel
                            value="Upload"
                            control={<Radio  checked={true} />}
                            label="Upload front and back of patient's insurance card(s)"
                          />
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
                                            <p>Secondary Front side</p>
                                          </div>
                                        </Grid>
                                        <Grid item xs={6} className="txt-right">
                                        {
                                          documentTypeHistory.sec_front?
                                          <CheckCircleIcon style={{ color: "green" }} />:<HighlightOffIcon style={{ color: "red" }} />
                                        } 
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} className="pd20">
                                          <input type="file" id="upload3" accept=".jpg,.jpeg.,.gif,.png" hidden onChange={(e) => {
                                            onFileChangeNew("3", e);
                                          }}
                                          />
                                          <label for="upload3" class="custom-file-input"></label>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} className="pd20">
                                          <div id="img3-preview" class="cust-select"></div>
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
                                            <p>Secondary Back side</p>
                                          </div>
                                        </Grid>
                                        <Grid item xs={6} className="txt-right">
                                        {
                                          documentTypeHistory.sec_back?
                                          <CheckCircleIcon style={{ color: "green" }} />:<HighlightOffIcon style={{ color: "red" }} />
                                        } 
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} className="pd20">
                                          <input type="file" id="upload4" accept=".jpg,.jpeg.,.gif,.png" hidden onChange={(e) => {
                                            onFileChangeNew("4", e);
                                          }}
                                          />
                                          <label for="upload4" class="custom-file-input"></label>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} className="pd20">
                                          <div id="img4-preview" class="cust-select"></div>
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Grid>
                          </Grid>
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
                                            <p>Tertiary Front side</p>
                                          </div>
                                        </Grid>
                                        <Grid item xs={6} className="txt-right">
                                        {
                                          documentTypeHistory.ter_front?
                                          <CheckCircleIcon style={{ color: "green" }} />:<HighlightOffIcon style={{ color: "red" }} />
                                        } 
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} className="pd20">
                                          <input type="file" id="upload5" accept=".jpg,.jpeg.,.gif,.png" hidden onChange={(e) => {
                                            onFileChangeNew("5", e);
                                          }}
                                          />
                                          <label for="upload5" class="custom-file-input"></label>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} className="pd20">
                                          <div id="img5-preview" class="cust-select"></div>
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
                                            <p>Tertiary Back side</p>
                                          </div>
                                        </Grid>
                                        <Grid item xs={6} className="txt-right">
                                        {
                                          documentTypeHistory.ter_back?
                                          <CheckCircleIcon style={{ color: "green" }} />:<HighlightOffIcon style={{ color: "red" }} />
                                        } 
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} className="pd20">
                                          <input type="file" id="upload6" accept=".jpg,.jpeg.,.gif,.png" hidden onChange={(e) => {
                                            onFileChangeNew("6", e);
                                          }}
                                          />
                                          <label for="upload6" class="custom-file-input"></label>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} className="pd20">
                                          <div id="img6-preview" class="cust-select"></div>
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Grid>
                          </Grid>
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
                                            <p>Driver Licence Front side</p>
                                          </div>
                                        </Grid>
                                        <Grid item xs={6} className="txt-right">
                                        {
                                          documentTypeHistory.dl_front?
                                          <CheckCircleIcon style={{ color: "green" }} />:<HighlightOffIcon style={{ color: "red" }} />
                                        } 
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} className="pd20">
                                          <input type="file" id="upload7" accept=".jpg,.jpeg.,.gif,.png" hidden onChange={(e) => {
                                            onFileChangeNew("7", e);
                                          }}
                                          />
                                          <label for="upload7" class="custom-file-input"></label>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} className="pd20">
                                          <div id="img7-preview" class="cust-select"></div>
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
                                            <p>Driver Licence Back side</p>
                                          </div>
                                        </Grid>
                                        <Grid item xs={6} className="txt-right">
                                        {
                                          documentTypeHistory.dl_back?
                                          <CheckCircleIcon style={{ color: "green" }} />:<HighlightOffIcon style={{ color: "red" }} />
                                        } 
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} className="pd20">
                                          <input type="file" id="upload8" accept=".jpg,.jpeg.,.gif,.png" hidden onChange={(e) => {
                                            onFileChangeNew("8", e);
                                          }}
                                          />
                                          <label for="upload8" class="custom-file-input"></label>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} className="pd20">
                                          <div id="img8-preview" class="cust-select"></div>
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Grid>
                          </Grid>
                         </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <p className="termstxt">
                  By submitting, I agree to Beats Health's {" "}
                   <a
                   href = {process.env.REACT_APP_REGION == 'INDIA' ? "https://b9137071-9ec2-4f99-8a27-84ba40c770a8.usrfiles.com/ugd/b91370_62f94f573a2b482ea01df13afccfa38d.pdf" : "https://95c241c3-f72d-4075-8a74-2e51b42fb168.filesusr.com/ugd/b91370_61edc289b5734e008f8dadd088b6dbf8.pdf"} 
                  target="_blank"
                  rel="noreferrer"
                  className="linkprim"
                >
                  Privacy Policy
                </a>{" "}
                  and{" "}
                  <a href = {
                  process.env.REACT_APP_REGION == 'INDIA' ? "https://b9137071-9ec2-4f99-8a27-84ba40c770a8.usrfiles.com/ugd/b91370_5eb62d82034544f8af76303559534897.pdf" : "https://95c241c3-f72d-4075-8a74-2e51b42fb168.filesusr.com/ugd/b91370_23cc2539c189446e98b2eca2d7f2b1e1.pdf"
                }
                  
                  target="_blank"
                  rel="noreferrer"
                  className="linkprim"
                >
                  Terms of Service.
                </a>{" "}
                </p>

                <Grid container className="pb30 pt30 buttonmfw">
                  <Grid item xs={12} sm={12} md={3} className="pb30">
                    <div className="btn-secondary mr30" onClick={refreshPage}>
                      Cancel
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={3} className="pb30">
                    <div className="btn-primary mr30" onClick={initiateOnBoarding}>
                      Submit
                    </div>
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
