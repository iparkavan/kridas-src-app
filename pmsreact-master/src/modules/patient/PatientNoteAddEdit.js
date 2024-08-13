import React, { useState, useEffect, useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";

import AuthService from "../../service/AuthService";
import PatientService from "../../service/PatientService";
import UserService from "../../service/UserService";

import MasterData from "../helper/masterdata";
import classes from "./patient.module.css";
import Helper from "../helper/helper";
import * as PatientConstants from "./PatientConstants";
import * as moment from "moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import NotificationDialog from "../../elements/ui/Dialog/NotificationDialog";
import AutoCompleteSelect from "../../elements/ui/AutoComplete/AutoCompleteSelect";

const initialState = PatientConstants.patientNoteObject;
const initialErrorState = PatientConstants.patientNoteErrorObject;

function reducer(state, { field, value }) {
  return {
    ...state,
    [field]: value,
  };
}

const PatientNoteAddEdit = (props) => {
  let history = useHistory();
  const { patientIdParam, idParam } = useParams();
  const [open, setOpen] = React.useState(false);
  const [patientNoteInfo, setPatientNoteInfo] = useState({});
  const [mode, setMode] = useState("ADD");

  const [patientName, setPatientName] = useState("");
  const [userName, setUserName] = useState("");
  const [errorWarning, setErrorWarning] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(false);
  //const [appointmentDateError, setAppointmentDateError] = useState("");
  const [doctorList, setDoctorList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDoctorListLoading, setIsDoctorListLoading] = useState(true);
  const [isMainDataLoading, setIsMainDataLoading] = useState(true);

  const [patientNoteState, dispatch] = useReducer(reducer, initialState);
  const [errorState, errDispatch] = useReducer(reducer, initialErrorState);

  const onChange = (e) => {
    dispatch({ field: e.target.name, value: e.target.value });
  };

  const onChangeNameValue = (name, value) => {
    dispatch({ field: name, value: value });
  };

  const handleDateChange = (date) => {
    dispatch({
      field: "followupAppointmentDate",
      value: date,
    });
  };

  const handleDateError = (error, date) => {
    if (error !== appointmentDateError) {
      errDispatch({ field: "appointmentDateError", value: error });
    }
  };

  const handleCreatedDateChange = (date) => {
    if (date === null || date.length === 0) {
      errDispatch({
        field: "noteDateError",
        value: "Please enter Note Created Date",
      });
    }

    dispatch({
      field: "noteDate",
      value: date,
    });
  };

  const handleCreatedDateError = (error, date) => {
    if (date !== null && error !== noteDateError) {
      errDispatch({ field: "noteDateError", value: error });
    }
  };

  const {
    clinicalNote,
    followupAppointmentDate,
    id,
    loginId,
    noteCreatedBy,
    noteDate,
    patientId,
  } = patientNoteState;

  const {
    clinicalNoteError,
    appointmentDateError,
    noteCreatedByError,
    noteDateError,
  } = errorState;

  useEffect(() => {
    if (!isMainDataLoading && !isDoctorListLoading) {
      setIsLoading(false);
    }
  }, [isMainDataLoading, isDoctorListLoading]);

  useEffect(() => {
    dispatch({ field: "patientId", value: patientIdParam });
  }, [patientIdParam]);

  useEffect(() => {
    if (!(idParam == null) && idParam !== null) {
      setMode("EDIT");
    }
  }, [idParam]);

  useEffect(() => {
    if (idParam == null && isMainDataLoading && mode === "ADD") {
      dispatch({
        field: "noteCreatedBy",
        value: AuthService.getLoggedInUserId(),
      });
      dispatch({
        field: "noteDate",
        value: Helper.getCreatedModifiedDateTime(),
      });

      UserService.fetchUserById(AuthService.getLoggedInUserId()).then((res) => {
        setUserName(res.data.firstName + " " + res.data.lastName);

        setIsMainDataLoading(false);
      });
    }
  }, [idParam, mode, isMainDataLoading]);

  useEffect(() => {
    PatientService.fetchPatientById(patientIdParam).then((res) => {
      setPatientName(res.data.patientName);
    });
  }, [patientIdParam]);

  useEffect(() => {
    if (isMainDataLoading && mode === MasterData.pageMode.Edit) {
      PatientService.fetchPatientClinicalNotesById(idParam).then((res) => {
        setPatientNoteInfo(res.data);
        setUserName(res.data.userName);
        Object.entries(res.data).forEach(([key, val]) => {
          dispatch({
            field: `${key}`,
            value: val,
          });
        });

        dispatch({
          field: "followupAppointmentDate",
          value: Helper.getFormattedDate(
            res.data.followupAppointmentDate,
            "YYYY-MM-DD"
          ),
        });

        setIsMainDataLoading(false);
      });
    }
  }, [isMainDataLoading, mode, idParam]);

  useEffect(() => {
    if (isDoctorListLoading) {
      getDoctorList();
    }
  }, [isDoctorListLoading]);

  //Fetch the doctors list
  const getDoctorList = () => {
    UserService.fetchAllDoctors(AuthService.getLoggedInUserCompanyId())
      .then((response) => {
        const doctors = Array.isArray(response.data) ? response.data : [];
        setDoctorList(doctors);
      })
      .finally(() => {
        setIsDoctorListLoading(false);
      });
  };

  /* const isRequiredFieldsAvailable = () => {
    let submitForm = true;
    let errorMessage = "";

    if (clinicalNote.trim().length === 0) {
      submitForm = false;
      errorMessage = "Ensure clinical notes are entered.";
    } else if (appointmentDateError.trim().length > 0) {
      submitForm = false;
      errorMessage = "Ensure higlighted fields are entered.";
    } else if (noteCreatedBy === null || noteCreatedBy.length === 0)
      setErrorWarning(submitForm ? "" : errorMessage);
    return submitForm;
  }; */

  // Verify if all necessary fields are entered before form submission
  const isRequiredFieldsAvailable = () => {
    let submitForm = true;
    const validationState = { ...errorState };

    validationState.clinicalNoteError =
      clinicalNote.trim().length === 0
        ? "Ensure clinical notes are entered."
        : "";

    validationState.noteCreatedByError =
      noteCreatedBy === null || noteCreatedBy.toString().trim().length === 0
        ? "Ensure entered by selected"
        : "";

    //Check if there is any form errors
    Object.entries(validationState).forEach(([key, value]) => {
      if (value.length > 0) {
        submitForm = false;
        errDispatch({
          field: `${key}`,
          value: `${value}`,
        });
      } else {
        errDispatch({
          field: `${key}`,
          value: "",
        });
      }
    });

    setErrorWarning(submitForm ? "" : "Ensure higlighted fields are entered.");
    return submitForm;
  };

  const handleClose = (event, reason) => {
    setOpen(false);
    history.goBack();
  };

  const handleCancel = () => {
    history.goBack();
  };

  const handleEditorChange = (e) => {
    dispatch({
      field: "clinicalNote",
      value: e.target.getContent(),
    });
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (!isRequiredFieldsAvailable()) {
      return;
    }
    //disable the submit button
    setDisableSubmit(true);

    const submitState = { ...patientNoteState };
    submitState.followupAppointmentDate =
      submitState.followupAppointmentDate !== null
        ? moment(submitState.followupAppointmentDate, "YYYY-MM-DD HH:mm")
        : null;

    submitState.loginId = AuthService.getLoggedInUserId();

    if (mode === "ADD") {
      submitState.noteDate = moment(submitState.noteDate, "YYYY-MM-DD HH:mm");
    }

    console.log(submitState);
    if (mode === "ADD") {
      PatientService.addPatientClinicalNote(submitState)
        .then((response) => {
          setOpen(true);
        })
        .catch((ex) => {
          console.log(ex);
          setDisableSubmit(false);
        });
    } else {
      PatientService.updatePatientClinicalNote(submitState)
        .then((response) => {
          setOpen(true);
        })
        .catch((ex) => {
          console.log(ex);
          setDisableSubmit(false);
        });
    }
  };

  return (
    <>
      {isLoading === false ? (
        <div>
          <Typography variant="h5" gutterBottom>
            <span>{patientName}</span>
            <span style={{ fontSize: "1rem", marginLeft: "5px" }}>
              (#{patientIdParam})
            </span>
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Please fill in patient clinical notes
          </Typography>
          {errorWarning.length > 0 ? (
            <Typography variant="subtitle1" gutterBottom>
              <span className={`${classes.LeftMargin5} ${classes.ErrorText}`}>
                {errorWarning}
              </span>
            </Typography>
          ) : (
            ""
          )}
          <form onSubmit={submitForm} noValidate>
            <div className={classes.PatientNoteAddEditLayout}>
              <div className={classes.PatientNoteAddEditFormSection}>
                <Paper style={{ padding: "15px" }} elevation={3}>
                  <div className={classes.TwoColumnGrid}>
                    <div className={classes.TwoColumnOverride}>
                      <Editor
                        id="clinicalNote"
                        name="clinicalNote"
                        apiKey="5ysx6wo7zdyx6ebhttmctd4vis62qjniejjd9y1qyl217v6g"
                        initialValue={clinicalNote}
                        init={{
                          height: 400,
                          menubar: false,
                          plugins: [
                            "advlist autolink lists link image media",
                            "charmap print preview anchor help",
                            "searchreplace visualblocks code",
                            "insertdatetime media table paste wordcount",
                          ],
                          toolbar:
                            "undo redo | formatselect | bold italic | \
            alignleft aligncenter alignright | \
			bullist numlist outdent indent ",
                          /* enable automatic uploads of images represented by blob or data URIs*/
                          automatic_uploads: false,
                          /* enable title field in the Image dialog*/
                          image_title: true,
                          paste_data_images: true,
                          paste_as_text: true,

                          file_picker_types: "file image media",
                          media_live_embeds: true,
                        }}
                        onChange={handleEditorChange}
                      />
                      {clinicalNoteError.length > 0 ? (
                        <Typography variant="subtitle1" gutterBottom>
                          <span
                            className={`${classes.LeftMargin5} ${classes.ErrorText}`}
                          >
                            {clinicalNoteError}
                          </span>
                        </Typography>
                      ) : (
                        ""
                      )}
                    </div>
                    <div>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          style={{ marginTop: "5px" }}
                          disablePast={mode === "EDIT" ? false : true}
                          minDate={noteDate}
                          clearable
                          fullWidth
                          label={"Next Appointment Date"}
                          invalidDateMessage={
                            "Enter date in format " +
                            Helper.getInputDateFormat().toLowerCase()
                          }
                          minDateMessage="Date should'nt be before note creation date."
                          id="followupAppointmentDate"
                          name="followupAppointmentDate"
                          value={followupAppointmentDate}
                          onChange={(date) => handleDateChange(date)}
                          format={Helper.getInputDateFormat()}
                          onError={handleDateError}
                          helperText={
                            appointmentDateError.length > 0
                              ? appointmentDateError
                              : Helper.getInputDateFormat().toLowerCase()
                          }
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                    {mode === MasterData.pageMode.Add ? (
                      <>
                        <div>
                          <AutoCompleteSelect
                            fullWidth
                            data={doctorList}
                            label="Entered By *"
                            id="noteCreatedBy"
                            name="noteCreatedBy"
                            keyValue="id"
                            keyLabel="firstName"
                            initialValue={
                              noteCreatedBy === null
                                ? AuthService.getLoggedInUserId()
                                : noteCreatedBy
                            }
                            callbackFunction={onChangeNameValue}
                            variant="standard"
                            errorText={noteCreatedByError}
                          ></AutoCompleteSelect>
                        </div>

                        <div>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              disableFuture
                              fullWidth
                              size="small"
                              margin="dense"
                              inputVariant="standard"
                              required
                              label={"Notes Date"}
                              invalidDateMessage={
                                "Enter date in format " +
                                Helper.getInputDateFormat().toLowerCase()
                              }
                              maxDateMessage={
                                "Date should not be a future date"
                              }
                              minDateMessage={
                                "Date should not be before minimal date (01-01-1900)"
                              }
                              id="noteDate"
                              name="noteDate"
                              value={noteDate}
                              onChange={(date) => handleCreatedDateChange(date)}
                              format={Helper.getInputDateFormat()}
                              onError={(error, date) =>
                                handleCreatedDateError(error, date)
                              }
                              helperText={
                                noteDateError.length > 0
                                  ? noteDateError
                                  : Helper.getInputDateFormat().toLowerCase()
                              }
                              error={noteDateError.length > 0 ? true : false}
                            />
                          </MuiPickersUtilsProvider>
                        </div>
                      </>
                    ) : (
                      <div style={{ marginTop: "10px" }}>
                        <Typography variant="body2" gutterBottom>
                          Notes entered by:{" "}
                          <span style={{ fontWeight: "bold" }}>{userName}</span>
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Created at:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {/*  {Helper.getFormattedDate(
                              Helper.getDateTimeFromUTC(noteDate),
                              "LL"
                            )} */}
                            {Helper.getDateTimeFromUTC(noteDate, "LL")}
                          </span>
                        </Typography>
                      </div>
                    )}
                  </div>
                </Paper>
              </div>
              <div className={classes.PatientNoteAddEditButtonSection}>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    type="submit"
                    fullWidth
                    startIcon={<SaveIcon />}
                    disabled={disableSubmit ? true : false}
                  >
                    Save
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="default"
                    size="small"
                    fullWidth
                    onClick={handleCancel}
                    startIcon={<CancelIcon />}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        "Loading..."
      )}

      <NotificationDialog
        open={open}
        handleClose={handleClose}
        title="Clinical Notes"
      >
        <span>
          {mode === MasterData.pageMode.Add
            ? "Patient clinical notes added successfully!!!"
            : "Patient clinical notes updated successfully!!!"}
        </span>
      </NotificationDialog>
    </>
  );
};

export default PatientNoteAddEdit;
