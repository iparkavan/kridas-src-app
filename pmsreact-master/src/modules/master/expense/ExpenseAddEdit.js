import React, { useState, useEffect, useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import AuthService from "../../../service/AuthService";
import MasterService from "../../../service/MasterService";
import MasterData from "../../helper/masterdata";
import classes from "../master.module.css";
import Helper from "../../helper/helper";
import * as ExpenseObjects from "./ExpenseObjects";
import BackdropLoader from "../../../elements/ui/BackdropLoader/BackdropLoader";
import AutoCompleteSelect from "../../../elements/ui/AutoComplete/AutoCompleteSelect";
import NumberFormatCustom from "../../../elements/ui/numberformatcustom";
import NotificationDialog from "../../../elements/ui/Dialog/NotificationDialog";
import LookupAddDialog from "../lookup/LookupAddDialog";

import * as moment from "moment";
import Link from "@material-ui/core/Link";
import {
  DatePicker,
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const initialState = ExpenseObjects.expenseObject;
const initialErrorState = ExpenseObjects.expenseErrorObject;
const initialPageState = ExpenseObjects.expensePageObject;

const ExpenseAddEdit = (props) => {
  let history = useHistory();
  const { expenseIdParam } = useParams();
  const [vendorList, setVendorList] = useState([]);
  const [expenseTypeList, setExpenseTypeList] = useState([]);
  const [paymentModeList, setPaymentModeList] = useState([]);

  const [expenseInfo, setExpenseInfo] = useState({});
  const [addVendorError, setAddVendorError] = useState("");
  const [addExpense, setAddExpense] = useState(false);
  const [returnObject, setReturnObject] = useState({});

  const [mainState, dispatch] = useReducer(Helper.reducer, initialState);
  const [errorState, errDispatch] = useReducer(
    Helper.reducer,
    initialErrorState
  );
  const [pageState, pageDispatch] = useReducer(
    Helper.reducer,
    initialPageState
  );

  const onChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "expenseAmount":
        if (value > Helper.getMaxPriceAllowed()) {
          dispatch({ field: name, value: expenseAmount });
        } else {
          dispatch({
            field: name,
            value: value.toString().length === 0 ? 1 : value,
          });
        }

        break;

      default:
        dispatch({ field: name, value: value });
        break;
    }
  };

  const onChangeNameValue = (name, value) => {
    dispatch({ field: name, value: value });
  };

  const handleDateChange = (date) => {
    if (date === null || date.length === 0) {
      errDispatch({
        field: "expenseDateError",
        value: "Please enter Expense Date",
      });
    }
    dispatch({
      field: "expenseDate",
      value: date,
    });
  };

  const handleDateError = (error, date) => {
    if (date !== null && error !== expenseDateError) {
      errDispatch({
        field: "expenseDateError",
        value: error,
      });
    }
  };

  const {
    bankName,
    companyId,
    expenseAmount,
    expenseDate,
    expenseNotes,
    expenseType,
    id,
    paymentModeId,
    paymentRefNo,
    vendorId,
  } = mainState;

  const {
    expenseTypeError,
    expenseAmountError,
    expenseDateError,
    paymentModeIdError,
  } = errorState;

  const {
    openSnackMessage,
    isLoading,
    errorWarning,
    disableSubmit,
    isVendorListLoading,
    isExpenseTypeLoading,
    isMainDataLoading,
    isPaymentModeLoading,
    mode,
    fetchAdditionalPaymentDetails,
    showAddVendorScreen,
    vendorName,
  } = pageState;

  //Once all required data loaded, load the page
  useEffect(() => {
    if (
      !isVendorListLoading &&
      !isMainDataLoading &&
      !isExpenseTypeLoading &&
      !isPaymentModeLoading
    ) {
      pageDispatch({ field: "isLoading", value: false });
    }
  }, [
    isVendorListLoading,
    isMainDataLoading,
    isExpenseTypeLoading,
    isPaymentModeLoading,
  ]);

  //Set Mode to EDIT when id param is passed
  useEffect(() => {
    if (!(expenseIdParam == null) && expenseIdParam !== null) {
      pageDispatch({ field: "mode", value: MasterData.pageMode.Edit });
    }
  }, [expenseIdParam]);

  useEffect(() => {
    if (isVendorListLoading) {
      getVendorList();
    }
  }, [isVendorListLoading]);

  useEffect(() => {
    if (isPaymentModeLoading) {
      getPaymentModeList();
    }
  }, [isPaymentModeLoading]);

  useEffect(() => {
    if (isExpenseTypeLoading) {
      getExpenseTypeList();
    }
  }, [isExpenseTypeLoading]);

  useEffect(() => {
    if (
      !(paymentModeId == null) &&
      paymentModeId !== null &&
      !isPaymentModeLoading
    ) {
      //get payment type
      const paymentType = paymentModeList.find((x) => x.id === paymentModeId)
        .paymentType;
      pageDispatch({
        field: "fetchAdditionalPaymentDetails",
        value: paymentType === "CQE" || paymentType === "NET" ? true : false,
      });

      //Clear out the values if its no cheque or net banking
      if (paymentType !== "CQE" && paymentType !== "NET") {
        dispatch({ field: "bankName", value: null });
        dispatch({ field: "paymentRefNo", value: null });
      }
    }
  }, [paymentModeId, paymentModeList, isPaymentModeLoading]);

  useEffect(() => {
    if (
      expenseIdParam == null &&
      isMainDataLoading &&
      mode === MasterData.pageMode.Add
    ) {
      dispatch({
        field: "companyId",
        value: AuthService.getLoggedInUserCompanyId(),
      });
      dispatch({
        field: "expenseDate",
        value: Helper.getFormattedDate(moment().format("L"), "YYYY-MM-DD"),
      });

      pageDispatch({ field: "isMainDataLoading", value: false });
    }
  }, [isMainDataLoading, mode, expenseIdParam]);

  //Fetch expense type from lookups
  const getExpenseTypeList = () => {
    /* const resultArray = MasterData.getLookupDataFromType(
      MasterData.lookupTypes.ExpenseTypes
    );
    setExpenseTypeList(resultArray);
    pageDispatch({ field: "isExpenseTypeLoading", value: false }); */

    MasterService.fetchLookupByType(
      MasterData.lookupTypes.ExpenseTypes,
      AuthService.getLoggedInUserCompanyId()
    )
      .then((response) => {
        const resultArray = Array.isArray(response.data) ? response.data : [];
        setExpenseTypeList(resultArray);
      })
      .finally(() => {
        pageDispatch({ field: "isExpenseTypeLoading", value: false });
      });
  };

  //Fetch the Payment Mode list
  const getPaymentModeList = () => {
    MasterService.fetchAllPaymentModesByCompanyId(
      AuthService.getLoggedInUserCompanyId()
    )
      .then((response) => {
        const modes = Array.isArray(response.data) ? response.data : [];
        setPaymentModeList(modes);
      })
      .finally(() => {
        pageDispatch({ field: "isPaymentModeLoading", value: false });
      });
  };

  //Fetch the vendor list
  const getVendorList = () => {
    MasterService.fetchAllVendorsByCompanyId(
      AuthService.getLoggedInUserCompanyId()
    )
      .then((response) => {
        const vendors = Array.isArray(response.data) ? response.data : [];
        setVendorList(vendors);
      })
      .finally(() => {
        pageDispatch({ field: "isVendorListLoading", value: false });
      });
  };

  //Retreive data during edit mode
  useEffect(() => {
    if (mode === MasterData.pageMode.Edit && isMainDataLoading) {
      MasterService.fetchExpenseById(expenseIdParam)
        .then((res) => {
          setExpenseInfo(res.data);

          Object.entries(res.data).forEach(([key, val]) => {
            dispatch({
              field: `${key}`,
              value: val,
            });
          });

          dispatch({
            field: "expenseDate",
            value: Helper.getDateTimeFromUTC(
              res.data.expenseDate,
              "YYYY-MM-DD"
            ),
          });
        })
        .finally(() => {
          pageDispatch({ field: "isMainDataLoading", value: false });
        });
    }
  }, [mode, expenseIdParam, isMainDataLoading]);

  // Verify if all necessary fields are entered before form submission
  const isRequiredFieldsAvailable = () => {
    let submitForm = true;
    const validationState = { ...errorState };

    validationState.expenseTypeError =
      expenseType === null || expenseType.trim().length === 0
        ? "Please select Expense Type"
        : "";

    validationState.paymentModeIdError =
      paymentModeId === null || paymentModeId == null
        ? "Please select Payment Mode"
        : "";

    validationState.expenseAmountError =
      expenseAmount == null ||
      expenseAmount.toString().length === 0 ||
      !(expenseAmount > 0)
        ? "Expense Amount must be great than 0"
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

    pageDispatch({
      field: "errorWarning",
      value: submitForm ? "" : "Highlighted fields must be corrected.",
    });
    return submitForm;
  };

  const handleClose = (event, reason) => {
    pageDispatch({
      field: "openSnackMessage",
      value: false,
    });
    history.goBack();
  };

  const handleCancel = () => {
    history.goBack();
  };

  const handleVendorAddClose = () => {
    pageDispatch({
      field: "showAddVendorScreen",
      value: false,
    });
    pageDispatch({
      field: "vendorName",
      value: "",
    });
    setAddVendorError("");
  };

  const handleAddNewVendor = () => {
    const vendorObject = {
      companyId: AuthService.getLoggedInUserCompanyId(),
      id: null,
      isActive: "YS",
      loginId: AuthService.getLoggedInUserId(),
      vendorName: vendorName,
    };

    MasterService.addVendor(vendorObject)
      .then((response) => {
        getVendorList();
        pageDispatch({
          field: "showAddVendorScreen",
          value: false,
        });
        pageDispatch({
          field: "vendorName",
          value: "",
        });
        setAddVendorError("");
      })
      .catch((response) => {
        console.log(response);
        setAddVendorError("Vendor already exists!!!");
      });
  };

  const handleExpenseDialogClose = () => {
    setAddExpense(false);
  };

  const handlePostExpenseTypeSave = (returnValue) => {
    setAddExpense(false);
    pageDispatch({ field: "isExpenseTypeLoading", value: true });
    setReturnObject(returnValue);
    getExpenseTypeList();
  };

  useEffect(() => {
    if (
      !isLoading &&
      !isExpenseTypeLoading &&
      returnObject.hasOwnProperty("lookupKey") &&
      returnObject.lookupType === MasterData.lookupTypes.ExpenseTypes
    ) {
      dispatch({
        field: "expenseType",
        value: returnObject.lookupKey,
      });
    }
  }, [isLoading, expenseTypeList, returnObject, isExpenseTypeLoading]);

  const addExpenseDialogProps = {
    open: addExpense,
    close: handleExpenseDialogClose,
    postSave: handlePostExpenseTypeSave,
    labels: {
      title: "Expense Type",
      contentText: "Add new expense type",
      key: "Code (max 3 chars)",
      value: "Name",
    },
    companyId: AuthService.getLoggedInUserCompanyId(),
    lookupType: MasterData.lookupTypes.ExpenseTypes,
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (!isRequiredFieldsAvailable()) {
      return;
    }

    //disable the submit button
    pageDispatch({
      field: "disableSubmit",
      value: true,
    });

    const submitState = { ...mainState };
    submitState.loginId = AuthService.getLoggedInUserId();
    submitState.expenseDate = moment(
      submitState.expenseDate,
      "YYYY-MM-DD HH:mm"
    );

    console.log(submitState);

    if (mode === MasterData.pageMode.Add) {
      MasterService.addExpense(submitState)
        .then((response) => {
          pageDispatch({
            field: "openSnackMessage",
            value: true,
          });
        })
        .catch((ex) => {
          console.log(ex);
          pageDispatch({
            field: "disableSubmit",
            value: false,
          });
        });
    } else {
      MasterService.updateExpense(submitState)
        .then((response) => {
          pageDispatch({
            field: "openSnackMessage",
            value: true,
          });
        })
        .catch((ex) => {
          console.log(ex);
          pageDispatch({
            field: "disableSubmit",
            value: false,
          });
        });
    }
  };

  return (
    <>
      {isLoading === false ? (
        <div>
          <Typography variant="h5" gutterBottom>
            Expenses
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Please fill in expense information (fields with * are mandatory)
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
            <div className={classes.AddEditLayout}>
              <div className={classes.AddEditFormSection}>
                {/* Basic Information */}
                <Paper style={{ padding: "15px" }} elevation={3}>
                  <div className={classes.ThreeColumnGrid}>
                    <div>
                      <span>
                        <AutoCompleteSelect
                          fullWidth
                          data={expenseTypeList}
                          label="Expense Type *"
                          id="expenseType"
                          name="expenseType"
                          keyValue="lookupKey"
                          keyLabel="lookupValue"
                          initialValue={expenseType}
                          callbackFunction={onChangeNameValue}
                          errorText={expenseTypeError}
                        ></AutoCompleteSelect>
                      </span>

                      <span>
                        <Link
                          component="button"
                          variant="body2"
                          onClick={(e) => {
                            e.preventDefault();
                            setAddExpense(true);
                          }}
                        >
                          Add Expense Type
                        </Link>
                      </span>
                    </div>
                    <div>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          disableFuture
                          size="small"
                          margin="dense"
                          fullWidth
                          label={"Expense Date"}
                          invalidDateMessage={
                            "Enter date in format " +
                            Helper.getInputDateFormat().toLowerCase()
                          }
                          maxDateMessage={"Date should not be in future"}
                          minDateMessage={
                            "Date should not be before minimal date (01-01-1900)"
                          }
                          id="expenseDate"
                          name="expenseDate"
                          value={expenseDate}
                          onChange={(date) => handleDateChange(date)}
                          format={Helper.getInputDateFormat()}
                          onError={handleDateError}
                          helperText={
                            expenseDateError.length > 0
                              ? expenseDateError
                              : Helper.getInputDateFormat().toLowerCase()
                          }
                          required
                          error={expenseDateError.length > 0 ? true : false}
                        />
                      </MuiPickersUtilsProvider>
                    </div>

                    <div>
                      <span>
                        <AutoCompleteSelect
                          data={vendorList}
                          label="Vendor"
                          id="vendorId"
                          name="vendorId"
                          keyValue="id"
                          keyLabel="vendorName"
                          initialValue={vendorId}
                          callbackFunction={onChangeNameValue}
                        ></AutoCompleteSelect>
                      </span>
                      <span>
                        <Link
                          component="button"
                          variant="body2"
                          onClick={(e) => {
                            e.preventDefault();
                            pageDispatch({
                              field: "showAddVendorScreen",
                              value: true,
                            });
                          }}
                        >
                          Add Vendor
                        </Link>
                      </span>
                    </div>
                    <div>
                      <AutoCompleteSelect
                        fullWidth
                        data={paymentModeList}
                        label="Payment Mode *"
                        id="paymentModeId"
                        name="paymentModeId"
                        keyValue="id"
                        keyLabel="paymentModeName"
                        initialValue={paymentModeId}
                        callbackFunction={onChangeNameValue}
                        errorText={paymentModeIdError}
                      ></AutoCompleteSelect>
                    </div>
                    <div>
                      <TextField
                        label={
                          "Expense Amount (" +
                          AuthService.getLoggedInCompanyCurrencyCode() +
                          ")"
                        }
                        id="expenseAmount"
                        name="expenseAmount"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        value={expenseAmount}
                        onChange={onChange}
                        required
                        inputProps={{ maxLength: 10 }}
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                          inputProps: Helper.getPriceInputFormatBasedOnCountry(),
                        }}
                        error={expenseAmountError.length > 0 ? true : false}
                        helperText={expenseAmountError}
                      />
                    </div>
                    <div>
                      <TextField
                        label="Notes"
                        id="expenseNotes"
                        name="expenseNotes"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        inputProps={{ maxLength: 255 }}
                        value={expenseNotes !== null ? expenseNotes : ""}
                        onChange={onChange}
                        multiline
                      />
                    </div>
                    {fetchAdditionalPaymentDetails ? (
                      <>
                        <div>
                          <TextField
                            label="Bank Name"
                            id="bankName"
                            name="bankName"
                            size="small"
                            margin="dense"
                            fullWidth
                            variant="standard"
                            inputProps={{ maxLength: 50 }}
                            value={bankName !== null ? bankName : ""}
                            onChange={onChange}
                          />
                        </div>
                        <div>
                          <TextField
                            label="Ref No"
                            id="paymentRefNo"
                            name="paymentRefNo"
                            size="small"
                            margin="dense"
                            fullWidth
                            variant="standard"
                            inputProps={{ maxLength: 50 }}
                            value={paymentRefNo !== null ? paymentRefNo : ""}
                            onChange={onChange}
                          />
                        </div>{" "}
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </Paper>
                {/* End Basic Information */}
              </div>
              <div className={classes.AddEditButtonSection}>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    type="submit"
                    disabled={disableSubmit ? true : false}
                    fullWidth
                    startIcon={<SaveIcon />}
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
        <BackdropLoader open={true}></BackdropLoader>
      )}
      <NotificationDialog
        open={openSnackMessage}
        handleClose={handleClose}
        title="Expenses"
      >
        <span>
          {mode === MasterData.pageMode.Add
            ? "Expense added successfully!!"
            : "Expense updated successfully!!"}
        </span>
      </NotificationDialog>

      <Dialog
        open={showAddVendorScreen}
        onClose={handleVendorAddClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Vendor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a new vendor to the vendor list.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="vendorName"
            name="vendorName"
            label="Vendor Name"
            type="text"
            value={vendorName}
            onChange={(e) => {
              pageDispatch({
                field: "vendorName",
                value: e.target.value,
              });
            }}
            fullWidth
            error={addVendorError.length > 0 ? true : false}
            helperText={addVendorError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleVendorAddClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddNewVendor} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <LookupAddDialog {...addExpenseDialogProps}></LookupAddDialog>
    </>
  );
};

export default ExpenseAddEdit;
