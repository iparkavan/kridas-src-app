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
import * as ItemMasterObjects from "./ItemMasterObjects";
import BackdropLoader from "../../../elements/ui/BackdropLoader/BackdropLoader";
import AutoCompleteSelect from "../../../elements/ui/AutoComplete/AutoCompleteSelect";
import NumberFormatCustom from "../../../elements/ui/numberformatcustom";
import NotificationDialog from "../../../elements/ui/Dialog/NotificationDialog";

import * as moment from "moment";
import Link from "@material-ui/core/Link";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const initialState = ItemMasterObjects.itemAddStockObject;
const initialErrorState = ItemMasterObjects.itemAddStockErrorObject;
const initialPageState = ItemMasterObjects.itemAddStockPageObject;

const ItemAddStock = (props) => {
  let history = useHistory();
  const { itemIdParam } = useParams();
  const [vendorList, setVendorList] = useState([]);
  const [itemInfo, setItemInfo] = useState({});
  const [addVendorError, setAddVendorError] = useState("");
  const [stockingUnitList, setStockingUnitList] = useState([]);

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
      case "costPrice":
        if (value > Helper.getMaxPriceAllowed()) {
          dispatch({ field: name, value: costPrice });
        } else {
          dispatch({
            field: name,
            value: value.toString().length === 0 ? 1 : value,
          });
        }

        break;
      case "orderStock":
        if (value > Helper.getMaxQuantityAllowed()) {
          dispatch({ field: name, value: orderStock });
        } else {
          dispatch({
            field: name,
            value:
              value.toString().length === 0
                ? 1
                : value === "0"
                ? 1
                : parseInt(value),
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

  const {
    batchNumber,
    companyId,
    costPrice,
    expiryDate,
    itemId,
    itemType,
    loginId,
    orderStock,
    stockingUnit,
    vendorId,
    totalAmount,
  } = mainState;

  const { costPriceError, orderStockError, expiryDateError } = errorState;

  const {
    openSnackMessage,
    isLoading,
    errorWarning,
    disableSubmit,
    isVendorListLoading,
    isMainDataLoading,
    showAddVendorScreen,
    vendorName,
    isStockingUnitListLoading,
  } = pageState;

  //Once all required data loaded, load the page
  useEffect(() => {
    if (
      !isVendorListLoading &&
      !isMainDataLoading &&
      !isStockingUnitListLoading
    ) {
      pageDispatch({ field: "isLoading", value: false });
    }
  }, [isVendorListLoading, isMainDataLoading, isStockingUnitListLoading]);

  useEffect(() => {
    if (isVendorListLoading) {
      getVendorList();
    }
  }, [isVendorListLoading]);

  useEffect(() => {
    getDataBasedOnType(MasterData.lookupTypes.StockingUnit);
  }, []);

  const getDataBasedOnType = (type) => {
    MasterData.getLookupList(
      AuthService.getLoggedInUserCompanyId(),
      type,
      (res) => {
        setStockingUnitList(Array.isArray(res.data) ? res.data : []);
      },
      () => {
        pageDispatch({ field: "isStockingUnitListLoading", value: false });
      }
    );
  };

  useEffect(() => {
    dispatch({
      field: "companyId",
      value: AuthService.getLoggedInUserCompanyId(),
    });
    dispatch({
      field: "loginId",
      value: AuthService.getLoggedInUserId(),
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      dispatch({
        field: "totalAmount",
        value: orderStock * costPrice,
      });
    }
  }, [orderStock, costPrice, isLoading]);

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
    if (isMainDataLoading) {
      MasterService.fetchItemByItemId(itemIdParam)
        .then((res) => {
          setItemInfo(res.data);
        })
        .finally(() => {
          pageDispatch({ field: "isMainDataLoading", value: false });
        });
    }
  }, [itemIdParam, isMainDataLoading]);

  // Verify if all necessary fields are entered before form submission
  const isRequiredFieldsAvailable = () => {
    let submitForm = true;
    const validationState = { ...errorState };

    validationState.orderStockError =
      orderStock == null || orderStock.toString().length === 0 || orderStock < 1
        ? "Quantity must be greater than 0"
        : "";

    validationState.costPriceError =
      costPrice == null || costPrice.toString().length === 0 || !(costPrice > 0)
        ? "Cost price must be great than 0"
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

  const handleDateChange = (date) => {
    dispatch({
      field: "expiryDate",
      value: date,
    });
  };

  const handleDateError = (error, date) => {
    if (error !== expiryDateError) {
      errDispatch({
        field: "expiryDateError",
        value: error,
      });
    }
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
    submitState.expiryDate =
      submitState.expiryDate !== null
        ? moment(submitState.expiryDate, "YYYY-MM-DD HH:mm")
        : null;
    submitState.itemId = itemIdParam;
    submitState.itemType = itemInfo.itemType;
    submitState.stockingUnit = itemInfo.stockingUnit;

    console.log(submitState);

    MasterService.addItemStock(submitState)
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
  };

  return (
    <>
      {isLoading === false ? (
        <div>
          <Typography variant="h5" gutterBottom>
            Inventory - Add Stock
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Please fill in stock information (fields with * are mandatory)
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
                      <Typography variant="body2" gutterBottom>
                        Item Name:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {itemInfo.itemName}
                        </span>
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body2" gutterBottom>
                        Item Type:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {MasterData.getLookupValueFromKey(
                            itemInfo.itemType,
                            MasterData.lookupTypes.ItemTypes
                          )}
                        </span>
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body2" gutterBottom>
                        Stocking Unit:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {MasterData.getValueFromLookupList(
                            stockingUnitList,
                            itemInfo.stockingUnit
                          )}
                        </span>
                      </Typography>
                    </div>
                    <div>
                      <TextField
                        label="Quantity"
                        id="orderStock"
                        name="orderStock"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        value={orderStock}
                        onChange={onChange}
                        required
                        inputProps={{ maxLength: 10 }}
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                          inputProps: Helper.integerProperties,
                        }}
                        error={orderStockError > 0 ? true : false}
                        helperText={orderStockError}
                      />
                    </div>
                    <div>
                      <TextField
                        label={
                          "Unit Price (" +
                          AuthService.getLoggedInCompanyCurrencyCode() +
                          ")"
                        }
                        id="costPrice"
                        name="costPrice"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        value={costPrice}
                        onChange={onChange}
                        required
                        inputProps={{ maxLength: 10 }}
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                          inputProps: Helper.getPriceInputFormatBasedOnCountry(),
                        }}
                        error={costPriceError.length > 0 ? true : false}
                        helperText={costPriceError}
                      />
                    </div>
                    <div>
                      <TextField
                        label={
                          "Amount (" +
                          AuthService.getLoggedInCompanyCurrencyCode() +
                          ")"
                        }
                        id="totalAmount"
                        name="totalAmount"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        value={totalAmount}
                        onChange={onChange}
                        required
                        inputProps={{
                          maxLength: 10,
                        }}
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                          inputProps: Helper.getPriceInputFormatBasedOnCountry(),
                          readOnly: true,
                        }}
                        style={{ background: "#f0f0f0" }}
                      />
                    </div>
                    <div>
                      <TextField
                        label="Batch No."
                        id="batchNumber"
                        name="batchNumber"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        inputProps={{ maxLength: 50 }}
                        value={batchNumber !== null ? batchNumber : ""}
                        onChange={onChange}
                      />
                    </div>
                    <div>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          disablePast
                          clearable
                          fullWidth
                          size="small"
                          margin="dense"
                          label={"Expiry Date"}
                          invalidDateMessage={
                            "Enter date in format " +
                            Helper.getInputDateFormat().toLowerCase()
                          }
                          id="expiryDate"
                          name="expiryDate"
                          value={expiryDate}
                          onChange={(date) => handleDateChange(date)}
                          format={Helper.getInputDateFormat()}
                          onError={handleDateError}
                          helperText={
                            expiryDateError.length > 0
                              ? expiryDateError
                              : Helper.getInputDateFormat().toLowerCase()
                          }
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                    {/* <div>
                      <TextField
                        id="expiryDate"
                        name="expiryDate"
                        label="Expiry Date"
                        type="date"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={expiryDate !== null ? expiryDate : ""}
                        onChange={onChange}
                      />
                    </div> */}
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
        title="Add Stock"
      >
        <span>Stock added successfully!!</span>
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
    </>
  );
};

export default ItemAddStock;
