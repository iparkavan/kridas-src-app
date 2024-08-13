import React, { useState, useEffect, useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import ReceiptIcon from "@material-ui/icons/Receipt";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import AuthService from "../../service/AuthService";
import PatientService from "../../service/PatientService";
import UserService from "../../service/UserService";
import MasterService from "../../service/MasterService";

import NumberFormatCustom from "../../elements/ui/numberformatcustom";

import classes from "./patient.module.css";
import Helper from "../helper/helper";
import * as PatientConstants from "./PatientConstants";
import * as moment from "moment";

import AutoCompleteSelect from "../../elements/ui/AutoComplete/AutoCompleteSelect";
import BackdropLoader from "../../elements/ui/BackdropLoader/BackdropLoader";
import NotificationDialog from "../../elements/ui/Dialog/NotificationDialog";

const initialState = PatientConstants.patientTreatmentObject;
const intialMasterDataState = PatientConstants.patientProcedureMasterDataObject;
const intialPageState = PatientConstants.pageStateObject;

const useStyles = makeStyles((theme) => ({
  readOnlyColor: {
    background: "#f0f0f0",
  },
}));

const PatientProcedureAdd = (props) => {
  const localClasses = useStyles();
  let history = useHistory();
  const { patientIdParam } = useParams();
  const [patientName, setPatientName] = useState("");
  const [userName, setUserName] = useState("");
  const [savedTreatmentId, setSavedTreatmentId] = useState("");

  const [mainState, dispatch] = useReducer(Helper.reducer, initialState);
  const [masterDataState, dispatchMasterData] = useReducer(
    Helper.reducer,
    intialMasterDataState
  );
  const [pageState, dispatchPageState] = useReducer(
    Helper.reducer,
    intialPageState
  );

  const onChangeIndex = (e, index) => {
    onChangeNameValue(e.target.name, e.target.value, index);
  };

  //Onchange event handler
  const onChangeNameValue = (name, value, index) => {
    const procedureArray = [...treatmentProcedures];
    const procedure = { ...procedureArray[index] };
    const formErrors = { ...procedure.formErrors };

    switch (name) {
      case "procedureId":
        //Check if the procedure is already added in the list
        if (checkIsSameProcedureSelected(value, procedureArray, index)) {
          formErrors.procedureIdError = "Procedure exists already";
          break;
        }
        const previousValue = procedure.procedureId;
        procedure.procedureId = value;

        if (value !== null && previousValue !== value) {
          procedure.quantity = 1;
          procedure.price = procedureList.find((x) => x.id === value).price;
          procedure.discountBy = "P";
          procedure.discount = 0;
        }

        /*   //get the default price for that procedure
        if (value !== null) {
          procedure.price =
            procedure.price === 0
              ? procedureList.find((x) => x.id === value).price
              : procedure.price;
        } */

        formErrors.procedureIdError = value === null ? "Select Procedure" : "";

        break;
      case "quantity":
        const prev = procedure.quantity;
        procedure.quantity = parseInt(value);

        if (value.toString().length === 0 || procedure.quantity === 0) {
          procedure.quantity = 1;
        }

        if (procedure.quantity > Helper.getMaxQuantityAllowed()) {
          procedure.quantity = prev;
        }

        break;
      case "price":
        const prevPrice = procedure.price;
        procedure.price = parseFloat(value);

        if (value.toString().length === 0 || value.toString() === "0.00") {
          procedure.price = 0;
        } else if (procedure.price > Helper.getMaxPriceAllowed()) {
          procedure.price = prevPrice;
        } else {
          formErrors.priceError = "";
        }

        break;
      case "discountBy":
        procedure.discountBy = value;
        procedure.discount = 0;
        break;

      case "discount":
        procedure.discount = parseFloat(value);

        if (value.toString().length === 0) {
          procedure.discount = 0.0;
        }

        if (procedure.discountBy === "P" && procedure.discount > 100) {
          procedure.discount = 0;
        }

        if (
          procedure.discountBy === "A" &&
          procedure.discount > procedure.quantity * procedure.price
        ) {
          procedure.discount = 0;
        }

        break;
      case "procedureNotes":
        procedure.procedureNotes = value;
        break;
      case "treatmentCompletedBy":
        procedure.treatmentCompletedBy = value;
        break;
      case "treatmentCompletionDate":
        procedure.treatmentCompletionDate = value;
        break;
      default:
        break;
    }

    procedure.discountPercentage =
      procedure.discountBy === "P" ? procedure.discount : 0;

    procedure.discountAmount =
      procedure.discountBy === "P"
        ? procedure.quantity * procedure.price * (procedure.discount / 100)
        : procedure.discount;

    procedure.amount =
      procedure.quantity * procedure.price - procedure.discountAmount;

    procedure.formErrors = formErrors;
    procedureArray[index] = procedure;
    dispatch({ field: "treatmentProcedures", value: procedureArray });

    updateOverallTotal(procedureArray);
  };

  //Updates the header records with sum of the cost, discount and amount
  const updateOverallTotal = (procedureArray) => {
    let subTotalAmt = 0.0;
    let totalDiscountAmt = 0.0;
    let totalAmt = 0.0;

    procedureArray.map((proc) => {
      subTotalAmt = subTotalAmt + proc.quantity * proc.price;
      totalDiscountAmt = totalDiscountAmt + proc.discountAmount;
      totalAmt = totalAmt + proc.amount;
      return "";
    });

    dispatch({ field: "subTotal", value: subTotalAmt });
    dispatch({ field: "totalDiscount", value: totalDiscountAmt });
    dispatch({ field: "totalAmount", value: totalAmt });
  };

  //Check if procedure is already selected
  const checkIsSameProcedureSelected = (procedureId, procArray, index) => {
    let isExists = false;
    const indexPtr = procArray.findIndex((x) => x.procedureId === procedureId);
    if (indexPtr > -1 && index !== indexPtr) {
      isExists = true;
    }

    return isExists;
  };

  const handleDateChangeIndex = (date, index) => {
    const procedureArray = [...treatmentProcedures];
    const procedure = { ...procedureArray[index] };
    const formErrors = { ...procedure.formErrors };
    if (date === null || date.length === 0) {
      formErrors.treatmentCompletionDateError = "Please enter Completed Date";
    }
    procedure.treatmentCompletionDate = date;

    procedure.formErrors = formErrors;
    procedureArray[index] = procedure;
    dispatch({ field: "treatmentProcedures", value: procedureArray });
  };

  const handleDateErrorIndex = (error, date, index) => {
    const procedureArray = [...treatmentProcedures];
    const procedure = { ...procedureArray[index] };
    const formErrors = { ...procedure.formErrors };
    if (date !== null && error !== formErrors.treatmentCompletionDateError) {
      formErrors.treatmentCompletionDateError = error;

      procedure.formErrors = formErrors;
      procedureArray[index] = procedure;
      dispatch({ field: "treatmentProcedures", value: procedureArray });
    }
  };

  const {
    enteredBy,
    loginId,
    patientId,
    subTotal,
    totalAmount,
    totalDiscount,
    treatmentDate,
    treatmentProcedures,
  } = mainState;

  const {
    openSnackMessage,
    isLoading,
    errorWarning,
    disableSubmit,
    isDoctorListLoading,
    isProcedureListLoading,
    submitType,
  } = pageState;

  const { procedureList, doctorList } = masterDataState;

  useEffect(() => {
    dispatch({
      field: "enteredBy",
      value: AuthService.getLoggedInUserId(),
    });
    dispatch({
      field: "treatmentDate",
      value: Helper.getCreatedModifiedDateTime(),
    });
    dispatch({ field: "patientId", value: patientIdParam });

    //Get logged in user name
    UserService.fetchUserById(AuthService.getLoggedInUserId()).then((res) => {
      setUserName(res.data.firstName + " " + res.data.lastName);
    });

    PatientService.fetchPatientById(patientIdParam).then((res) => {
      setPatientName(res.data.patientName);
    });
  }, [patientIdParam]);

  //Load the page only when doctor list and procedure list are fetched.
  useEffect(() => {
    if (!isDoctorListLoading && !isProcedureListLoading) {
      dispatchPageState({ field: "isLoading", value: false });
    }
  }, [isDoctorListLoading, isProcedureListLoading]);

  useEffect(() => {
    if (isDoctorListLoading) {
      getDoctorList();
    }
  }, [isDoctorListLoading]);

  useEffect(() => {
    if (isProcedureListLoading) {
      getProcedureList();
    }
  }, [isProcedureListLoading]);

  //Fetch the doctors list
  const getDoctorList = () => {
    UserService.fetchAllDoctors(AuthService.getLoggedInUserCompanyId())
      .then((response) => {
        const doctors = Array.isArray(response.data) ? response.data : [];
        dispatchMasterData({ field: "doctorList", value: doctors });
      })
      .finally(() => {
        dispatchPageState({ field: "isDoctorListLoading", value: false });
      });
  };

  //fetch procedures list
  const getProcedureList = () => {
    MasterService.fetchAllProceduresByCompanyId(
      AuthService.getLoggedInUserCompanyId()
    )
      .then((response) => {
        const procedures = Array.isArray(response.data) ? response.data : [];
        dispatchMasterData({ field: "procedureList", value: procedures });
      })
      .finally(() => {
        dispatchPageState({ field: "isProcedureListLoading", value: false });
      });
  };

  //Verify whether all required fields are filled in before submitting data to server
  const isRequiredFieldsAvailable = () => {
    let submitForm = true;

    const procedureArray = [...treatmentProcedures];

    if (procedureArray.length === 0) {
      submitForm = false;

      dispatchPageState({
        field: "errorWarning",
        value: submitForm
          ? ""
          : "Ensure atleast one completed procedure is entered.",
      });
      return submitForm;
    }

    procedureArray.map((proc, index) => {
      const formErrors = { ...proc.formErrors };

      if (formErrors.procedureIdError.trim().length === 0) {
        formErrors.procedureIdError =
          proc.procedureId === null ? "Select Procedure" : "";
      }

      if (formErrors.quantityError.trim().length === 0) {
        formErrors.quantityError =
          proc.quantity.toString().length === 0 || proc.quantity < 1
            ? "Enter Quantity"
            : "";
      }

      //Ensure Completed By is filled in
      formErrors.treatmentCompletedByError =
        proc.treatmentCompletedBy === null ? "Select Completed By" : "";

      //discount amout should not be greated than amount
      formErrors.discountError =
        proc.discountAmount > proc.amount
          ? "Discount cannot be greater than total cost (quantity * price)."
          : "";

      proc.formErrors = formErrors;
      return "";
    });

    dispatch({ field: "treatmentProcedures", value: procedureArray });

    procedureArray.map((proc) => {
      //Check if there is any form errors
      Object.values(proc.formErrors).forEach((val) => {
        if (val.length > 0 && submitForm) {
          submitForm = false;
        }
      });
    });

    dispatchPageState({
      field: "errorWarning",
      value: submitForm ? "" : "Ensure higlighted fields are corrected.",
    });
    return submitForm;
  };

  const handleClose = (event, reason) => {
    dispatchPageState({
      field: "openSnackMessage",
      value: false,
    });
    if (submitType === "INV") {
      history.push(
        "/patient/invoice/add/" + patientIdParam + "/" + savedTreatmentId
      );
    } else {
      history.goBack();
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  const handleAddProcedure = () => {
    const procedureArray = [...treatmentProcedures];
    const newProcedure = {
      ...PatientConstants.patientTreatmentProcedureObject,
    };

    newProcedure.treatmentCompletedBy = AuthService.getLoggedInUserId();
    procedureArray.push(newProcedure);

    dispatch({ field: "treatmentProcedures", value: procedureArray });
  };

  const handleDeleteProcedure = (index) => {
    const procedureArray = [...treatmentProcedures];
    procedureArray.splice(index, 1);

    dispatch({ field: "treatmentProcedures", value: procedureArray });
    updateOverallTotal(procedureArray);
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (!isRequiredFieldsAvailable()) {
      return;
    }
    //disable the submit button
    dispatchPageState({
      field: "disableSubmit",
      value: true,
    });

    const submitState = { ...mainState };
    submitState.loginId = AuthService.getLoggedInUserId();
    submitState.treatmentDate = moment(
      submitState.treatmentDate,
      "YYYY-MM-DD HH:mm"
    );

    const procedures = [...submitState.treatmentProcedures];
    procedures.map((proc, index) => {
      const procedure = { ...proc };

      procedure.treatmentCompletionDate = moment(
        procedure.treatmentCompletionDate,
        "YYYY-MM-DD HH:mm"
      );
      procedures[index] = procedure;
      return "";
    });

    submitState.treatmentProcedures = procedures;
    console.log(submitState);

    PatientService.addPatientTreatment(submitState)
      .then((response) => {
        if (response.status === 200) {
          setSavedTreatmentId(
            Helper.getNumberFromString(response.data.message)
          );
          dispatchPageState({
            field: "openSnackMessage",
            value: true,
          });
        } else {
          console.log(response);
          dispatchPageState({
            field: "disableSubmit",
            value: false,
          });
        }
      })
      .catch((ex) => {
        console.log(ex);
        dispatchPageState({
          field: "disableSubmit",
          value: false,
        });
      });
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
            Please fill in patient completed procedure(s)
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
            <div className={classes.PatientProcedureAddEditLayout}>
              <div className={classes.PatientProcedureAddEditFormSection}>
                <Paper
                  style={{ padding: "15px", backgroundColor: "#f0f0f0" }}
                  elevation={3}
                >
                  <div>
                    {treatmentProcedures.map((proc, index) => (
                      <Paper
                        key={index}
                        className={classes.SevenColumnGrid}
                        style={{ marginBottom: "10px", padding: "5px" }}
                      >
                        <div>
                          <AutoCompleteSelect
                            fullWidth
                            data={procedureList}
                            label="Procedure *"
                            id="procedureId"
                            name="procedureId"
                            keyValue="id"
                            keyLabel="procedureName"
                            initialValue={proc.procedureId}
                            callbackFunction={onChangeNameValue}
                            index={index}
                            errorText={proc.formErrors.procedureIdError}
                            variant="outlined"
                          ></AutoCompleteSelect>
                        </div>
                        <div>
                          <TextField
                            label="Quantity"
                            id="quantity"
                            name="quantity"
                            size="small"
                            margin="dense"
                            fullWidth
                            variant="outlined"
                            value={proc.quantity}
                            onChange={(e) => onChangeIndex(e, index)}
                            required
                            inputProps={{ maxLength: 3 }}
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                              inputProps: Helper.integerProperties,
                            }}
                            error={
                              proc.formErrors.quantityError.length > 0
                                ? true
                                : false
                            }
                            helperText={proc.formErrors.quantityError}
                          />
                        </div>
                        <div>
                          <TextField
                            label={
                              "Price (" +
                              AuthService.getLoggedInCompanyCurrencyCode() +
                              ")"
                            }
                            id="price"
                            name="price"
                            size="small"
                            margin="dense"
                            fullWidth
                            variant="outlined"
                            value={proc.price}
                            onChange={(e) => onChangeIndex(e, index)}
                            required
                            inputProps={{ maxLength: 10 }}
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                              inputProps: Helper.getPriceInputFormatBasedOnCountry(),
                            }}
                            error={
                              proc.formErrors.priceError.length > 0
                                ? true
                                : false
                            }
                            helperText={proc.formErrors.priceError}
                          />
                        </div>
                        <div>
                          <TextField
                            id="discountBy"
                            select
                            label="Discount By"
                            name="discountBy"
                            fullWidth
                            size="small"
                            margin="dense"
                            value={proc.discountBy}
                            onChange={(e) => onChangeIndex(e, index)}
                            variant="outlined"
                          >
                            <MenuItem key="P" value="P">
                              %
                            </MenuItem>
                            <MenuItem key="A" value="A">
                              {AuthService.getLoggedInCompanyCurrencyCode()}
                            </MenuItem>
                          </TextField>
                        </div>
                        <div>
                          <TextField
                            label="Discount"
                            id="discount"
                            name="discount"
                            size="small"
                            margin="dense"
                            fullWidth
                            variant="outlined"
                            value={proc.discount}
                            onChange={(e) => onChangeIndex(e, index)}
                            inputProps={{ maxLength: 10 }}
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                              inputProps:
                                proc.discountBy === "P"
                                  ? Helper.amountProperties
                                  : Helper.getPriceInputFormatBasedOnCountry(),
                            }}
                            error={
                              proc.formErrors.discountError.length > 0
                                ? true
                                : false
                            }
                            helperText={proc.formErrors.discountError}
                          />
                        </div>
                        <div>
                          <TextField
                            className={localClasses.readOnlyColor}
                            label={
                              "Amount (" +
                              AuthService.getLoggedInCompanyCurrencyCode() +
                              ")"
                            }
                            id="amount"
                            name="amount"
                            size="small"
                            margin="dense"
                            fullWidth
                            variant="outlined"
                            value={proc.amount}
                            onChange={(e) => onChangeIndex(e, index)}
                            required
                            inputProps={{
                              maxLength: 10,
                            }}
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                              inputProps: Helper.getPriceInputFormatBasedOnCountry(),
                              readOnly: true,
                            }}
                          />
                        </div>
                        <div style={{ marginTop: "10px" }}>
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleDeleteProcedure(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                        <div className={classes.TwoColumnOverride}>
                          <TextField
                            label="Procedure Notes"
                            id="procedureNotes"
                            name="procedureNotes"
                            size="small"
                            margin="dense"
                            fullWidth
                            variant="outlined"
                            inputProps={{ maxLength: 255 }}
                            value={
                              proc.procedureNotes !== null
                                ? proc.procedureNotes
                                : ""
                            }
                            onChange={(e) => onChangeIndex(e, index)}
                            multiline
                          />
                        </div>
                        <div className={classes.ThreeTwoColumnOverride}>
                          <AutoCompleteSelect
                            fullWidth
                            data={doctorList}
                            label="Completed By *"
                            id="treatmentCompletedBy"
                            name="treatmentCompletedBy"
                            keyValue="id"
                            keyLabel="firstName"
                            initialValue={
                              proc.treatmentCompletedBy === null
                                ? AuthService.getLoggedInUserId()
                                : proc.treatmentCompletedBy
                            }
                            callbackFunction={onChangeNameValue}
                            index={index}
                            variant="outlined"
                            errorText={
                              proc.formErrors.treatmentCompletedByError
                            }
                          ></AutoCompleteSelect>
                        </div>
                        <div className={classes.FiveTwoColumnOverride}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              disableFuture
                              fullWidth
                              size="small"
                              margin="dense"
                              inputVariant="outlined"
                              label={
                                "Completed Date (" +
                                Helper.getInputDateFormat().toLowerCase() +
                                ")*"
                              }
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
                              id="treatmentCompletionDate"
                              name="treatmentCompletionDate"
                              value={proc.treatmentCompletionDate}
                              onChange={(date) =>
                                handleDateChangeIndex(date, index)
                              }
                              format={Helper.getInputDateFormat()}
                              onError={(error, date) =>
                                handleDateErrorIndex(error, date, index)
                              }
                              helperText={
                                proc.formErrors.treatmentCompletionDateError
                              }
                              error={
                                proc.formErrors.treatmentCompletionDateError
                                  .length > 0
                                  ? true
                                  : false
                              }
                            />
                          </MuiPickersUtilsProvider>
                        </div>
                        {/* <div className={classes.FiveTwoColumnOverride}>
                          <TextField
                            id="treatmentCompletionDate"
                            name="treatmentCompletionDate"
                            label="Completed Date"
                            type="date"
                            size="small"
                            margin="dense"
                            fullWidth
                            required
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={
                              proc.treatmentCompletionDate !== null
                                ? proc.treatmentCompletionDate
                                : ""
                            }
                            onChange={(e) => onChangeIndex(e, index)}
                          />
                        </div> */}
                      </Paper>
                    ))}
                  </div>
                </Paper>
                <div>
                  <Button
                    variant="contained"
                    color="default"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddProcedure}
                  >
                    Add Procedure
                  </Button>
                </div>
                <Paper style={{ padding: "10px" }} elevation={3}>
                  <div className={classes.ThreeColumnGrid}>
                    <div>
                      <Typography variant="body2" gutterBottom>
                        Total Cost:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {Helper.getFormattedNumber(subTotal)}
                        </span>
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body2" gutterBottom>
                        Total Discount:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {Helper.getFormattedNumber(totalDiscount)}
                        </span>
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body2" gutterBottom>
                        Total Amount:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {Helper.getFormattedNumber(totalAmount)}
                        </span>
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body2" gutterBottom>
                        Entered by:{" "}
                        <span style={{ fontWeight: "bold" }}>{userName}</span>
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body2" gutterBottom>
                        Created at:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {Helper.getFormattedDate(treatmentDate, "ll")}
                        </span>
                      </Typography>
                    </div>
                  </div>
                </Paper>
              </div>
              <div className={classes.PatientProcedureAddEditButtonSection}>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    type="submit"
                    fullWidth
                    startIcon={<ReceiptIcon />}
                    disabled={disableSubmit ? true : false}
                    onClick={() => {
                      dispatchPageState({
                        field: "submitType",
                        value: "INV",
                      });
                    }}
                  >
                    {"Save & Invoice"}
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    type="submit"
                    fullWidth
                    startIcon={<SaveIcon />}
                    disabled={disableSubmit ? true : false}
                    onClick={() => {
                      dispatchPageState({
                        field: "submitType",
                        value: "SAVE",
                      });
                    }}
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
        <BackdropLoader></BackdropLoader>
      )}

      <NotificationDialog
        open={openSnackMessage}
        handleClose={handleClose}
        title="Completed Procedures"
      >
        Patient completed procedure(s) added successfully!!
      </NotificationDialog>
    </>
  );
};

export default PatientProcedureAdd;
