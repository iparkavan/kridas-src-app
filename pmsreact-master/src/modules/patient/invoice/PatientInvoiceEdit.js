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
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import AuthService from "../../../service/AuthService";
import PatientService from "../../../service/PatientService";
import UserService from "../../../service/UserService";
import MasterService from "../../../service/MasterService";

import NumberFormatCustom from "../../../elements/ui/numberformatcustom";

import MasterData from "../../helper/masterdata";
import classes from "../patient.module.css";
import Helper from "../../helper/helper";
import * as PatientConstants from "../PatientConstants";
import * as moment from "moment";

import AutoCompleteSelect from "../../../elements/ui/AutoComplete/AutoCompleteSelect";
import BackdropLoader from "../../../elements/ui/BackdropLoader/BackdropLoader";
import NotificationDialog from "../../../elements/ui/Dialog/NotificationDialog";

const initialState = PatientConstants.patientInvoiceObject;
const intialMasterDataState = PatientConstants.patientInvoiceMasterDataObject;
const intialPageState = PatientConstants.invoicePageObject;

const useStyles = makeStyles((theme) => ({
  readOnlyColor: {
    background: "#f0f0f0",
  },
}));

const PatientInvoiceEdit = (props) => {
  const localClasses = useStyles();
  let history = useHistory();
  const { patientIdParam, idParam } = useParams();
  const [patientName, setPatientName] = useState("");
  const [userName, setUserName] = useState("");
  const [deletedList, setDeletedList] = useState([]);
  const [invoiceDateError, setInvoiceDateError] = useState("");

  const [mainState, dispatch] = useReducer(Helper.reducer, initialState);
  const [masterDataState, dispatchMasterData] = useReducer(
    Helper.reducer,
    intialMasterDataState
  );
  const [pageState, dispatchPageState] = useReducer(
    Helper.reducer,
    intialPageState
  );

  const onChange = (e) => {
    dispatch({ field: e.target.name, value: e.target.value });
  };

  const onChangeIndex = (e, index) => {
    onChangeNameValue(e.target.name, e.target.value, index);
  };

  //Onchange event handler
  const onChangeNameValue = (name, value, index) => {
    const procedureArray = [...invoiceDetails];
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
          procedure.taxId = procedureList.find((x) => x.id === value).taxId;
          procedure.taxAmount = 0;
        }

        formErrors.procedureIdError = value === null ? "Select Procedure" : "";

        break;
      case "itemId":
        if (checkIsSameItemSelected(value, procedureArray, index)) {
          formErrors.itemIdError = "Product exists already";
          break;
        }
        const prevValue = procedure.itemId;
        procedure.itemId = value;

        if (value !== null && prevValue !== value) {
          const itemObject = itemList.find((x) => x.id === value);
          if (itemObject.avaialableStock > 0) {
            procedure.stockAvailability = itemObject.avaialableStock;
            procedure.quantity = 1;
            procedure.price = itemObject.retailPrice;
            procedure.discountBy = "P";
            procedure.discount = 0;
            procedure.taxId = itemObject.taxId;
            procedure.taxAmount = 0;
            procedure.stockingUnit = itemObject.stockingUnit;
            procedure.reorderLevel = itemObject.reorderLevel;
            formErrors.itemIdError = "";
          } else {
            formErrors.itemIdError = "No stock available!!";
            procedure.stockAvailability = 0;
          }
        } else {
          formErrors.itemIdError = value === null ? "Select Product" : "";
        }

        break;
      case "quantity":
        const prevQuantity = procedure.quantity;
        procedure.quantity = parseInt(value);

        if (value.toString().length === 0 || procedure.quantity === 0) {
          procedure.quantity = 1;
        }

        //check if the added row is inventory and quantity exceeds the available stock. In case of edit, they can reduce and if
        //increase it should be initial quantity + existing
        if (procedure.detailType === "I") {
          if (
            procedure.quantity >
            procedure.stockAvailability + procedure.initialQuantity
          ) {
            procedure.quantity =
              procedure.stockAvailability + procedure.initialQuantity;
          }
        } else if (procedure.detailType === "P") {
          if (procedure.quantity > Helper.getMaxQuantityAllowed()) {
            procedure.quantity = prevQuantity;
          }
        }

        break;
      case "price":
        const prevPrice = procedure.price;
        procedure.price = parseFloat(value);

        if (value.toString().length === 0 || value.toString() === "0.00") {
          procedure.price = 0.0;
        } else if (procedure.price > Helper.getMaxPriceAllowed()) {
          procedure.price = parseFloat(prevPrice);
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
      case "taxId":
        procedure.taxId = value;

        break;
      case "notes":
        procedure.notes = value;
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

    if (!(procedure.taxId == null) && procedure.taxId !== null) {
      const taxPercent = taxList.find((x) => x.id === procedure.taxId)
        .taxPercent;
      procedure.taxAmount =
        (procedure.quantity * procedure.price - procedure.discountAmount) *
        (taxPercent / 100);
    } else {
      procedure.taxAmount = 0;
    }

    procedure.amount =
      procedure.quantity * procedure.price -
      procedure.discountAmount +
      procedure.taxAmount;

    procedure.formErrors = formErrors;
    procedureArray[index] = procedure;
    dispatch({ field: "invoiceDetails", value: procedureArray });

    updateOverallTotal(procedureArray);
  };

  //Updates the header records with sum of the cost, discount and amount
  const updateOverallTotal = (procedureArray) => {
    let subTotalAmt = 0.0;
    let totalDiscountAmt = 0.0;
    let totalTaxAmount = 0.0;
    let totalAmt = 0.0;

    procedureArray.map((proc) => {
      subTotalAmt = subTotalAmt + proc.quantity * proc.price;
      totalDiscountAmt = totalDiscountAmt + proc.discountAmount;
      totalTaxAmount = totalTaxAmount + proc.taxAmount;
      totalAmt = totalAmt + proc.amount;
      return "";
    });

    dispatch({ field: "subTotal", value: subTotalAmt });
    dispatch({ field: "totalDiscount", value: totalDiscountAmt });
    dispatch({ field: "totalTax", value: totalTaxAmount });
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

  //Check if product is already selected
  const checkIsSameItemSelected = (itemId, procArray, index) => {
    let isExists = false;
    const indexPtr = procArray.findIndex((x) => x.itemId === itemId);
    if (indexPtr > -1 && index !== indexPtr) {
      isExists = true;
    }

    return isExists;
  };

  const handleDateChangeIndex = (date, index) => {
    const procedureArray = [...invoiceDetails];
    const procedure = { ...procedureArray[index] };
    const formErrors = { ...procedure.formErrors };

    if (date === null || date.length === 0) {
      formErrors.treatmentCompletionDateError = "Please enter Completed Date";
    }
    procedure.treatmentCompletionDate = date;

    procedure.formErrors = formErrors;
    procedureArray[index] = procedure;
    dispatch({ field: "invoiceDetails", value: procedureArray });
  };

  const handleDateErrorIndex = (error, date, index) => {
    const procedureArray = [...invoiceDetails];
    const procedure = { ...procedureArray[index] };
    const formErrors = { ...procedure.formErrors };

    if (date !== null && error !== formErrors.treatmentCompletionDateError) {
      formErrors.treatmentCompletionDateError = error;

      procedure.formErrors = formErrors;
      procedureArray[index] = procedure;
      dispatch({ field: "invoiceDetails", value: procedureArray });
    }
  };

  const handleCreatedDateChange = (date) => {
    if (date === null || date.length === 0) {
      setInvoiceDateError("Please enter Invoice Date");
    }

    dispatch({
      field: "invoiceDate",
      value: date,
    });
  };

  const handleCreatedDateError = (error, date) => {
    if (date !== null && error !== invoiceDateError) {
      setInvoiceDateError(error);
    }
  };

  const {
    enteredBy,
    loginId,
    patientId,
    subTotal,
    totalAmount,
    totalDiscount,
    totalTax,
    invoiceDate,
    invoiceDetails,
    invoiceComments,
  } = mainState;

  const {
    openSnackMessage,
    isLoading,
    errorWarning,
    disableSubmit,
    isDoctorListLoading,
    isProcedureListLoading,
    isItemListLoading,
    isTaxListLoading,
    isMainDataLoading,
    isStockingUnitListLoading,
  } = pageState;

  const {
    procedureList,
    doctorList,
    itemList,
    taxList,
    stockingUnitList,
  } = masterDataState;

  useEffect(() => {
    if (
      !isDoctorListLoading &&
      !isProcedureListLoading &&
      !isTaxListLoading &&
      !isItemListLoading &&
      !isStockingUnitListLoading
    ) {
      dispatchPageState({ field: "isLoading", value: false });
    }
  }, [
    isDoctorListLoading,
    isProcedureListLoading,
    isTaxListLoading,
    isItemListLoading,
    isStockingUnitListLoading,
  ]);

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

  useEffect(() => {
    if (isTaxListLoading) {
      getTaxList();
    }
  }, [isTaxListLoading]);

  useEffect(() => {
    if (isItemListLoading) {
      getItemList();
    }
  }, [isItemListLoading]);

  useEffect(() => {
    getDataBasedOnType(MasterData.lookupTypes.StockingUnit);
  }, []);

  const getDataBasedOnType = (type) => {
    MasterData.getLookupList(
      AuthService.getLoggedInUserCompanyId(),
      type,
      (res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        dispatchMasterData({ field: "stockingUnitList", value: data });
      },
      () => {
        dispatchPageState({ field: "isStockingUnitListLoading", value: false });
      }
    );
  };

  //Fetch the items(products) list
  const getItemList = () => {
    MasterService.fetchAllItemsByCompanyId(
      AuthService.getLoggedInUserCompanyId()
    )
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        dispatchMasterData({ field: "itemList", value: data });
      })
      .finally(() => {
        dispatchPageState({ field: "isItemListLoading", value: false });
      });
  };

  //Fetch the tax list
  const getTaxList = () => {
    MasterService.fetchAllTaxesByCompanyId(
      AuthService.getLoggedInUserCompanyId()
    )
      .then((response) => {
        const taxes = Array.isArray(response.data) ? response.data : [];
        dispatchMasterData({ field: "taxList", value: taxes });
      })
      .finally(() => {
        dispatchPageState({ field: "isTaxListLoading", value: false });
      });
  };

  useEffect(() => {
    if (isMainDataLoading) {
      PatientService.fetchPatientInvoiceByInvoiceId(idParam)
        .then((response) => {
          const invoiceInfo = response.data;
          console.log(invoiceInfo);
          //Update the fields in the header table to state object except the child table.
          Object.entries(invoiceInfo).forEach(([key, val]) => {
            if (key !== "invoiceDetails") {
              dispatch({
                field: `${key}`,
                value: val,
              });
            }
          });

          let procedureList = [];
          //Loop through the procedures list and format to ui objects
          invoiceInfo.invoiceDetails.map((proc) => {
            const procedure = {
              ...PatientConstants.patientInvoiceDetailObject,
            };
            procedure.amount = proc.amount;
            Object.entries(proc).forEach(([key, val]) => {
              procedure[`${key}`] = val;
            });

            procedure.detailType = proc.itemId === null ? "P" : "I";

            procedure.discountBy =
              proc.discountAmount === 0
                ? "P"
                : proc.discountPercentage > 0
                ? "P"
                : "A";
            procedure.discount =
              proc.discountAmount === 0
                ? proc.discountAmount
                : proc.discountPercentage > 0
                ? proc.discountPercentage
                : proc.discountAmount;

            if (proc.treatmentCompletionDate != null) {
              procedure.treatmentCompletionDate = Helper.getDateTimeFromUTC(
                proc.treatmentCompletionDate,
                "YYYY-MM-DD"
              );
            }

            procedure.initialQuantity = procedure.quantity;
            if (procedure.detailType === "I") {
              procedure.stockAvailability = proc.itemMasterDTO.avaialableStock;
              procedure.reorderLevel = proc.itemMasterDTO.reorderLevel;
              procedure.stockingUnit = proc.itemMasterDTO.stockingUnit;
            }
            procedure.recordStatus = MasterData.recordStatus.update;
            procedureList.push(procedure);
          });
          dispatch({ field: "invoiceDetails", value: procedureList });

          //Get logged in user name
          UserService.fetchUserById(invoiceInfo.enteredBy).then((res) => {
            setUserName(res.data.firstName + " " + res.data.lastName);
          });
        })
        .finally(() => {
          dispatchPageState({ field: "isMainDataLoading", value: false });
        });
    }
  }, [isMainDataLoading, idParam]);

  useEffect(() => {
    dispatch({ field: "patientId", value: patientIdParam });

    PatientService.fetchPatientById(patientIdParam).then((res) => {
      setPatientName(res.data.patientName);
    });
  }, [patientIdParam]);

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

  const isRequiredFieldsAvailable = () => {
    let submitForm = true;

    const procedureArray = [...invoiceDetails];
    if (procedureArray.length === 0) {
      submitForm = false;

      dispatchPageState({
        field: "errorWarning",
        value: submitForm
          ? ""
          : "Ensure atleast one procedure/product is entered.",
      });
      return submitForm;
    }

    if (invoiceDateError.length > 0) {
      submitForm = false;

      dispatchPageState({
        field: "errorWarning",
        value: submitForm ? "" : "Ensure higlighted fields are corrected.",
      });
      return submitForm;
    }

    procedureArray.map((proc, index) => {
      const formErrors = { ...proc.formErrors };

      if (proc.detailType === "P") {
        if (formErrors.procedureIdError.trim().length === 0) {
          formErrors.procedureIdError =
            proc.procedureId === null ? "Select Procedure" : "";
        }

        formErrors.treatmentCompletedByError =
          proc.treatmentCompletedBy === null ||
          proc.treatmentCompletedBy.toString().length === 0
            ? "Enter Completed User"
            : "";

        /* formErrors.treatmentCompletionDateError =
          proc.treatmentCompletionDate === null ||
          proc.treatmentCompletionDate.toString().length === 0
            ? "Enter Completed Date"
            : ""; */
      } else {
        if (formErrors.itemIdError.trim().length === 0) {
          formErrors.itemIdError = proc.itemId === null ? "Select Product" : "";
        }
      }

      if (formErrors.quantityError.trim().length === 0) {
        formErrors.quantityError =
          proc.quantity.toString().length === 0 || proc.quantity < 1
            ? "Enter Quantity"
            : "";
      }

      //discount amout should not be greated than amount
      formErrors.discountError =
        proc.discountAmount > proc.quantity * proc.price
          ? "Discount cannot be greater than total cost (quantity * price)."
          : "";

      proc.formErrors = formErrors;
      return "";
    });

    dispatch({ field: "invoiceDetails", value: procedureArray });

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
    history.goBack();
  };

  const handleCancel = () => {
    history.goBack();
  };

  const handleAddProcedure = (addType) => {
    const procedureArray = [...invoiceDetails];
    const newProcedure = {
      ...PatientConstants.patientInvoiceDetailObject,
    };

    newProcedure.detailType = addType;
    newProcedure.treatmentCompletionDate =
      addType === "P"
        ? Helper.getFormattedDate(moment().format("L"), "YYYY-MM-DD")
        : null;
    newProcedure.treatmentCompletedBy =
      addType === "P" ? AuthService.getLoggedInUserId() : null;
    procedureArray.push(newProcedure);

    dispatch({ field: "invoiceDetails", value: procedureArray });
  };

  //Handle delete procedure
  const handleDeleteProcedure = (index) => {
    const procedureArray = [...invoiceDetails];
    const procedure = { ...procedureArray[index] };
    const deleteList = [...deletedList];

    //If the data came from db, then mark as delete and add it to delete list.
    //Else no need to add into delete list
    if (procedure.recordStatus === MasterData.recordStatus.update) {
      procedure.recordStatus = MasterData.recordStatus.delete;
      deleteList.push(procedure);
      setDeletedList(deleteList);
    }
    procedureArray.splice(index, 1);

    dispatch({ field: "invoiceDetails", value: procedureArray });
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
    //Format the date
    const procedures = [...submitState.invoiceDetails];
    procedures.map((proc, index) => {
      const procedure = { ...proc };

      if (procedure.detailType === "P") {
        procedure.treatmentCompletionDate = moment(
          procedure.treatmentCompletionDate,
          "YYYY-MM-DD HH:mm"
        );
      }

      procedures[index] = procedure;
    });

    //append the deleted list so that same is removed in the server
    deletedList.map((del) => {
      const deletedItem = { ...del };
      if (deletedItem.detailType === "P") {
        deletedItem.treatmentCompletionDate = moment(
          deletedItem.treatmentCompletionDate,
          "YYYY-MM-DD HH:mm"
        );

        //check if deleted item is in the updated list. If so, dont add the item again
        const procedure = procedures.find(
          (x) => x.procedureId === deletedItem.procedureId
        );

        if (!(procedure == null) && procedure !== null) {
          procedure.id = del.id;
          procedure.invoiceId = del.invoiceId;
          procedure.recordStatus = MasterData.recordStatus.update;
        } else {
          procedures.push(deletedItem);
        }
      } else {
        const procedure = procedures.find(
          (x) => x.itemId === deletedItem.itemId
        );

        if (!(procedure == null) && procedure !== null) {
          procedure.id = del.id;
          procedure.invoiceId = del.invoiceId;
          procedure.recordStatus = MasterData.recordStatus.update;
        } else {
          procedures.push(deletedItem);
        }
      }

      return "";
    });
    submitState.invoiceDetails = procedures;
    console.log(submitState);

    PatientService.updatePatientInvoice(submitState)
      .then((response) => {
        dispatchPageState({
          field: "openSnackMessage",
          value: true,
        });
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
              (Patient #{patientIdParam})
            </span>
          </Typography>

          <form onSubmit={submitForm} noValidate>
            <div className={classes.PatientInvoiceAddEditLayout}>
              <div className={classes.TwoColumnGrid}>
                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Please fill in patient invoice details
                  </Typography>
                  {errorWarning.length > 0 ? (
                    <Typography variant="subtitle1" gutterBottom>
                      <span
                        className={`${classes.LeftMargin5} ${classes.ErrorText}`}
                      >
                        {errorWarning}
                      </span>
                    </Typography>
                  ) : (
                    ""
                  )}
                </div>
                <div className={classes.RightAlign}>
                  <span className={classes.RightMargin5}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      type="submit"
                      startIcon={<SaveIcon />}
                      disabled={disableSubmit ? true : false}
                    >
                      Save
                    </Button>
                  </span>
                  <span>
                    <Button
                      variant="contained"
                      color="default"
                      size="small"
                      onClick={handleCancel}
                      startIcon={<CancelIcon />}
                    >
                      Cancel
                    </Button>
                  </span>
                </div>
              </div>
              <div className={classes.PatientProcedureAddEditFormSection}>
                <Paper
                  style={{ padding: "15px", backgroundColor: "#f0f0f0" }}
                  elevation={3}
                >
                  <div>
                    {invoiceDetails.map((proc, index) => (
                      <Paper
                        key={index}
                        className={classes.NineColumnGrid}
                        style={{ marginBottom: "10px", padding: "5px" }}
                      >
                        <div>
                          {proc.detailType === "P" ? (
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
                              variant="outlined"
                              errorText={proc.formErrors.procedureIdError}
                            ></AutoCompleteSelect>
                          ) : (
                            <AutoCompleteSelect
                              fullWidth
                              data={itemList}
                              label="Product *"
                              id="itemId"
                              name="itemId"
                              keyValue="id"
                              keyLabel="itemName"
                              initialValue={proc.itemId}
                              callbackFunction={onChangeNameValue}
                              index={index}
                              variant="outlined"
                              errorText={proc.formErrors.itemIdError}
                            ></AutoCompleteSelect>
                          )}
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
                            inputProps={{ maxLength: 10 }}
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
                            variant="outlined"
                            value={proc.discountBy}
                            onChange={(e) => onChangeIndex(e, index)}
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
                          <AutoCompleteSelect
                            fullWidth
                            data={taxList}
                            label="Tax"
                            id="taxId"
                            name="taxId"
                            keyValue="id"
                            keyLabel="taxName"
                            initialValue={proc.taxId}
                            callbackFunction={onChangeNameValue}
                            index={index}
                            variant="outlined"
                          ></AutoCompleteSelect>
                        </div>
                        <div>
                          <TextField
                            className={localClasses.readOnlyColor}
                            label={
                              "Tax Amount (" +
                              AuthService.getLoggedInCompanyCurrencyCode() +
                              ")"
                            }
                            id="taxAmount"
                            name="taxAmount"
                            size="small"
                            margin="dense"
                            fullWidth
                            variant="outlined"
                            value={proc.taxAmount}
                            onChange={(e) => onChangeIndex(e, index)}
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
                        <div>
                          <TextField
                            label="Notes"
                            id="notes"
                            name="notes"
                            size="small"
                            margin="dense"
                            fullWidth
                            variant="outlined"
                            inputProps={{ maxLength: 255 }}
                            value={proc.notes !== null ? proc.notes : ""}
                            onChange={(e) => onChangeIndex(e, index)}
                            multiline
                          />
                        </div>
                        <div className={classes.TwoThreeColumnOverride}>
                          <AutoCompleteSelect
                            fullWidth
                            data={doctorList}
                            label={
                              "Completed By" +
                              (proc.detailType === "P" ? " *" : "")
                            }
                            id="treatmentCompletedBy"
                            name="treatmentCompletedBy"
                            keyValue="id"
                            keyLabel="firstName"
                            initialValue={proc.treatmentCompletedBy}
                            callbackFunction={onChangeNameValue}
                            index={index}
                            variant="outlined"
                            errorText={
                              proc.formErrors.treatmentCompletedByError
                            }
                          ></AutoCompleteSelect>
                        </div>
                        {proc.detailType === "P" ? (
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
                        ) : (
                          ""
                        )}
                        {proc.detailType === "I" && proc.itemId != null ? (
                          proc.stockAvailability > 0 ? (
                            <div
                              className={classes.FiveTwoColumnOverride}
                              style={{ marginTop: "20px", color: "blue" }}
                            >
                              <span>
                                Available Stock{" "}
                                {proc.stockAvailability < proc.reorderLevel
                                  ? "(low)"
                                  : ""}
                                :
                              </span>{" "}
                              <span>{proc.stockAvailability}</span>{" "}
                              <span>
                                {/* {proc.stockingUnit} */}
                                {MasterData.getValueFromLookupList(
                                  stockingUnitList,
                                  proc.stockingUnit
                                )}
                              </span>
                            </div>
                          ) : (
                            <div
                              className={classes.FiveTwoColumnOverride}
                              style={{ marginTop: "20px", color: "red" }}
                            >
                              <span>No Stock</span>
                            </div>
                          )
                        ) : (
                          ""
                        )}
                      </Paper>
                    ))}
                  </div>
                </Paper>
                <div>
                  <span className={classes.RightMargin5}>
                    <Button
                      variant="contained"
                      color="default"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddProcedure("P")}
                    >
                      Add Procedure
                    </Button>
                  </span>
                  <span>
                    <Button
                      variant="contained"
                      color="default"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddProcedure("I")}
                    >
                      Add Product
                    </Button>
                  </span>
                </div>
                <Paper style={{ padding: "10px" }} elevation={3}>
                  <div className={classes.FourColumnGrid}>
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
                        Total Tax:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {Helper.getFormattedNumber(totalTax)}
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
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          disableFuture
                          fullWidth
                          size="small"
                          margin="dense"
                          inputVariant="standard"
                          required
                          label={"Invoice Date"}
                          invalidDateMessage={
                            "Enter date in format " +
                            Helper.getInputDateFormat().toLowerCase()
                          }
                          maxDateMessage={"Date should not be a future date"}
                          minDateMessage={
                            "Date should not be before minimal date (01-01-1900)"
                          }
                          id="invoiceDate"
                          name="invoiceDate"
                          value={invoiceDate}
                          onChange={(date) => handleCreatedDateChange(date)}
                          format={Helper.getInputDateFormat()}
                          onError={(error, date) =>
                            handleCreatedDateError(error, date)
                          }
                          helperText={
                            invoiceDateError.length > 0
                              ? invoiceDateError
                              : Helper.getInputDateFormat().toLowerCase()
                          }
                          error={invoiceDateError.length > 0 ? true : false}
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                    <div>
                      <TextField
                        label="Invoice Notes"
                        id="invoiceComments"
                        name="invoiceComments"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        inputProps={{ maxLength: 255 }}
                        value={invoiceComments !== null ? invoiceComments : ""}
                        onChange={onChange}
                        multiline
                      />
                    </div>
                    <div>
                      <Typography
                        variant="body2"
                        gutterBottom
                        style={{ marginTop: "35px" }}
                      >
                        Entered by:{" "}
                        <span style={{ fontWeight: "bold" }}>{userName}</span>
                      </Typography>
                    </div>
                    {/* <div>
                      <Typography
                        variant="body2"
                        gutterBottom
                        style={{ marginTop: "35px" }}
                      >
                        Created at:{" "}
                        <span style={{ fontWeight: "bold" }}>
                         
                          {Helper.getDateTimeFromUTC(invoiceDate, "ll")}
                        </span>
                      </Typography>
                    </div> */}
                  </div>
                </Paper>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <BackdropLoader></BackdropLoader>
      )}
      {/* <Snackbar
        open={openSnackMessage}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          Patient invoice updated successfully!!
        </Alert>
      </Snackbar> */}
      <NotificationDialog
        open={openSnackMessage}
        handleClose={handleClose}
        title="Invoices"
      >
        Patient invoice added successfully!!
      </NotificationDialog>
    </>
  );
};

export default PatientInvoiceEdit;
