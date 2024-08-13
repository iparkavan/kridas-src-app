import React, { useState, useEffect, useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import MenuItem from "@material-ui/core/MenuItem";

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

const initialState = ItemMasterObjects.itemConsumeStockObject;
const initialErrorState = ItemMasterObjects.itemConsumeStockErrorObject;
const initialPageState = ItemMasterObjects.itemConsumeStockPageObject;

const ItemConsumeStock = (props) => {
  let history = useHistory();
  const { itemIdParam } = useParams();
  const [itemInfo, setItemInfo] = useState({});
  const [consumptionList, setConsumptionList] = useState([]);
  const [batchList, setBatchList] = useState([]);
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
      case "orderStock":
        if (value > Helper.getMaxQuantityAllowed()) {
          dispatch({ field: name, value: orderStock });
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

  const {
    batchNumber,
    companyId,
    id,
    itemId,
    itemType,
    loginId,
    orderStock,
    stockingUnit,
    actionType,
  } = mainState;

  const { actionTypeError, orderStockError } = errorState;

  const {
    openSnackMessage,
    isLoading,
    errorWarning,
    disableSubmit,
    isMainDataLoading,
    isConsumptionTypeLoading,
    isBatchesLoading,
    isStockingUnitListLoading,
  } = pageState;

  //Once all required data loaded, load the page
  useEffect(() => {
    if (
      !isConsumptionTypeLoading &&
      !isMainDataLoading &&
      !isBatchesLoading &&
      !isStockingUnitListLoading
    ) {
      pageDispatch({ field: "isLoading", value: false });
    }
  }, [
    isConsumptionTypeLoading,
    isMainDataLoading,
    isBatchesLoading,
    isStockingUnitListLoading,
  ]);

  useEffect(() => {
    if (isConsumptionTypeLoading) {
      getConsumptionList();
    }
  }, [isConsumptionTypeLoading]);

  useEffect(() => {
    if (isBatchesLoading) {
      getBatches(itemIdParam);
    }
  }, [isBatchesLoading, itemIdParam]);

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

  //Fetch the batches list
  const getBatches = (id) => {
    MasterService.fetchAllBatchesByItemId(id)
      .then((response) => {
        const batches = Array.isArray(response.data) ? response.data : [];
        setBatchList(batches);
      })
      .finally(() => {
        pageDispatch({ field: "isBatchesLoading", value: false });
      });
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

  //Fetch the consumption type list
  const getConsumptionList = () => {
    const resultArray = MasterData.getLookupDataFromType(
      MasterData.lookupTypes.ConsumptionType
    );
    setConsumptionList(resultArray);
    pageDispatch({ field: "isConsumptionTypeLoading", value: false });
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

    validationState.actionTypeError =
      actionType == null || actionType.toString().length === 0
        ? "Please select Consumption Type"
        : "";

    if (
      orderStock == null ||
      orderStock.toString().length === 0 ||
      orderStock < 1
    ) {
      validationState.orderStockError = "Quantity must be greater than 0";
    } else if (orderStock > itemInfo.avaialableStock) {
      validationState.orderStockError =
        "Consumption cannot be greater than available stock";
    } else {
      validationState.orderStockError = "";
    }

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
    submitState.itemId = itemIdParam;
    submitState.itemType = itemInfo.itemType;
    submitState.stockingUnit = itemInfo.stockingUnit;
    submitState.costPrice = 0;

    console.log(submitState);

    MasterService.consumeItemStock(submitState)
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
            Inventory - Consume Stock
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Please fill in inventory consumption information (fields with * are
            mandatory)
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
                        Available Stock:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          <span className={classes.RightMargin5}>
                            {itemInfo.avaialableStock}
                          </span>

                          {MasterData.getValueFromLookupList(
                            stockingUnitList,
                            itemInfo.stockingUnit
                          )}
                        </span>
                      </Typography>
                    </div>
                    <div>
                      <AutoCompleteSelect
                        fullWidth
                        data={consumptionList}
                        label="Consumption Type *"
                        id="actionType"
                        name="actionType"
                        keyValue="lookupKey"
                        keyLabel="lookupValue"
                        initialValue={actionType}
                        callbackFunction={onChangeNameValue}
                        errorText={actionTypeError}
                      ></AutoCompleteSelect>
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
                        error={orderStockError.length > 0 ? true : false}
                        helperText={orderStockError}
                      />
                    </div>
                    <div>
                      <TextField
                        id="batchNumber"
                        select
                        label="Batch No"
                        name="batchNumber"
                        fullWidth
                        margin="dense"
                        value={batchNumber}
                        onChange={onChange}
                      >
                        {batchList.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
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
        title="Consume Stock"
      >
        <span>Stock consumption completed!!</span>
      </NotificationDialog>
    </>
  );
};

export default ItemConsumeStock;
