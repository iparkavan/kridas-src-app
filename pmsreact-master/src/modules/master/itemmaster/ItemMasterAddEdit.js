import React, { useState, useEffect, useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";

import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Link from "@material-ui/core/Link";

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
import LookupAddDialog from "../lookup/LookupAddDialog";

const initialState = ItemMasterObjects.itemMasterObject;
const initialErrorState = ItemMasterObjects.itemMasterErrorObject;
const initialPageState = ItemMasterObjects.itemMasterPageObject;
const initialMasterDataState = ItemMasterObjects.itemMasterDataObject;

const ItemMasterAddEdit = (props) => {
  let history = useHistory();
  const { itemId } = useParams();
  //const [taxList, setTaxList] = useState([]);
  //const [itemTypeList, setItemTypeList] = useState([]);
  //const [manufacturerList, setManufacturerList] = useState([]);
  //const [drugTypeList, setDrugTypeList] = useState([]);
  //const [strengthUnitList, setStrengthUnitList] = useState([]);
  const [ItemInfo, setItemInfo] = useState({});
  const [addLookup, setAddLookup] = useState(false);
  const [selectedType, setSelectedType] = useState("");
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
  const [masterDataState, masterDataDispatch] = useReducer(
    Helper.reducer,
    initialMasterDataState
  );

  const onChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "retailPrice":
        if (value > Helper.getMaxPriceAllowed()) {
          errDispatch({
            field: "retailPrice",
            value: "Price cannot be more than " + Helper.getMaxPriceAllowed(),
          });
          dispatch({ field: name, value: retailPrice });
        } else {
          errDispatch({ field: "retailPrice", value: "" });
          dispatch({
            field: name,
            value: value.toString().length === 0 ? 0 : value,
          });
        }
        break;
      case "reorderLevel":
        if (value > Helper.getMaxQuantityAllowed()) {
          dispatch({ field: name, value: reorderLevel });
        } else {
          dispatch({
            field: name,
            value: value.toString().length === 0 ? 0 : value,
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

  const checkBoxHandler = () => {
    const status = allowPrescription === "NO" ? "YS" : "NO";
    dispatch({
      field: "allowPrescription",
      value: status,
    });
  };

  const {
    avaialableStock,
    companyId,
    expiredStock,
    id,
    itemCode,
    itemName,
    itemType,
    loginId,
    manufacturerId,
    reorderLevel,
    retailPrice,
    procedureName,
    procedureNotes,
    recordStatus,
    taxId,
    stockingUnit,
    totalStock,
    allowPrescription,
    drugType,
    strength,
    strengthUnit,
    instructions,
  } = mainState;

  const {
    itemNameError,
    itemTypeError,
    stockingUnitError,
    drugTypeError,
  } = errorState;

  const {
    openSnackMessage,
    isLoading,
    errorWarning,
    disableSubmit,
    isTaxListLoading,
    isMainDataLoading,
    isLookupLoading,
    mode,
    isStockingUnitListLoading,
    isDrugTypeListLoading,
    isManufacturerListLoading,
    isStrengthUnitListLoading,
    isItemTypeListLoading,
  } = pageState;

  const {
    stockingUnitList,
    drugTypeList,
    manufacturerList,
    strengthUnitList,
    itemTypeList,
    taxList,
  } = masterDataState;

  //Set Mode to EDIT when id param is passed
  useEffect(() => {
    if (!(itemId == null) && itemId !== null) {
      pageDispatch({ field: "mode", value: MasterData.pageMode.Edit });
    }
  }, [itemId]);

  useEffect(() => {
    if (!isTaxListLoading && !isMainDataLoading && !isLookupLoading) {
      pageDispatch({ field: "isLoading", value: false });
    }
  }, [isTaxListLoading, isMainDataLoading, isLookupLoading]);

  useEffect(() => {
    if (isTaxListLoading) {
      getTaxList();
    }
  }, [isTaxListLoading]);

  const lookups = [
    {
      type: MasterData.lookupTypes.Manufacturers,
      listName: "manufacturerList",
      loadStatus: "isManufacturerListLoading",
      labels: {
        title: "Manufacturer",
        contentText: "Add new manufacturer",
        key: "Code (max 3 chars)",
        value: "Name",
      },
    },
    {
      type: MasterData.lookupTypes.StockingUnit,
      listName: "stockingUnitList",
      loadStatus: "isStockingUnitListLoading",
      labels: {
        title: "Stocking Unit",
        contentText: "Add new stocking unit",
        key: "Code (max 3 chars)",
        value: "Name",
      },
    },
    {
      type: MasterData.lookupTypes.ItemTypes,
      listName: "itemTypeList",
      loadStatus: "isItemTypeListLoading",
      labels: {},
    },
    {
      type: MasterData.lookupTypes.DrugType,
      listName: "drugTypeList",
      loadStatus: "isDrugTypeListLoading",
      labels: {
        title: "Drug Type",
        contentText: "Add new drug type",
        key: "Code (max 3 chars)",
        value: "Name",
      },
    },
    {
      type: MasterData.lookupTypes.StrengthUnit,
      listName: "strengthUnitList",
      loadStatus: "isStrengthUnitListLoading",
      labels: {
        title: "Strength Unit",
        contentText: "Add new Strength unit",
        key: "Code (max 3 chars)",
        value: "Name",
      },
    },
  ];

  useEffect(() => {
    lookups.map((item) =>
      getMasterData(item.type, item.listName, item.loadStatus)
    );
  }, []);

  const getMasterData = (lookupType, listName, loadStatus) => {
    MasterService.fetchLookupByType(
      lookupType,
      AuthService.getLoggedInUserCompanyId()
    )
      .then((response) => lookupDataCallBack(response, listName, loadStatus))
      .catch((ex) => {
        console.log(ex);
      })
      .finally(() => {
        pageDispatch({ field: loadStatus, value: false });
      });
  };

  const lookupDataCallBack = (response, listName, loadStatus) => {
    const resultArray = Array.isArray(response.data) ? response.data : [];

    masterDataDispatch({
      field: listName,
      value: resultArray,
    });
  };

  useEffect(() => {
    if (
      isLookupLoading &&
      !isItemTypeListLoading &&
      !isManufacturerListLoading &&
      !isStockingUnitListLoading &&
      !isDrugTypeListLoading &&
      !isStrengthUnitListLoading
    ) {
      pageDispatch({ field: "isLookupLoading", value: false });
    }
  }, [
    isLookupLoading,
    isItemTypeListLoading,
    isManufacturerListLoading,
    isStockingUnitListLoading,
    isDrugTypeListLoading,
    isStrengthUnitListLoading,
  ]);

  useEffect(() => {
    if (
      itemId == null &&
      isMainDataLoading &&
      mode === MasterData.pageMode.Add
    ) {
      dispatch({
        field: "companyId",
        value: AuthService.getLoggedInUserCompanyId(),
      });
      pageDispatch({ field: "isMainDataLoading", value: false });
    }
  }, [itemId, isMainDataLoading, mode]);

  //Fetch the tax list
  const getTaxList = () => {
    MasterService.fetchAllTaxesByCompanyId(
      AuthService.getLoggedInUserCompanyId()
    )
      .then((response) => {
        const taxes = Array.isArray(response.data) ? response.data : [];
        masterDataDispatch({
          field: "taxList",
          value: taxes,
        });
        //setTaxList(taxes);
      })
      .finally(() => {
        pageDispatch({ field: "isTaxListLoading", value: false });
      });
  };

  //Fetch item data when mode is edit
  useEffect(() => {
    if (mode === MasterData.pageMode.Edit && isMainDataLoading) {
      MasterService.fetchItemByItemId(itemId)
        .then((res) => {
          setItemInfo(res.data);

          Object.entries(res.data).forEach(([key, val]) => {
            dispatch({
              field: `${key}`,
              value: val,
            });
          });
        })
        .finally(() => {
          pageDispatch({ field: "isMainDataLoading", value: false });
        });
    }
  }, [mode, itemId, isMainDataLoading]);

  // Verify if all necessary fields are entered before form submission
  const isRequiredFieldsAvailable = () => {
    let submitForm = true;
    const validationState = { ...errorState };

    validationState.itemNameError =
      itemName.trim().length === 0 ? "Please enter Item Name" : "";

    validationState.itemTypeError =
      itemType === null || itemType.trim().length === 0
        ? "Please enter Item Type"
        : "";

    validationState.stockingUnitError =
      stockingUnit === null || stockingUnit.trim().length === 0
        ? "Please enter Stocking Unit"
        : "";

    if (allowPrescription === "YS") {
      validationState.drugTypeError =
        drugType === null || drugType.trim().length === 0
          ? "Please select Drug Type"
          : "";
    } else {
      validationState.drugTypeError = "";
    }

    console.log(validationState);

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

  const handleLookupDialogClose = () => {
    setAddLookup(false);
  };

  const handlePostLookupSave = (returnValue) => {
    const updatedType = lookups.find((x) => x.type === returnValue.lookupType);
    pageDispatch({ field: updatedType.loadStatus, value: true });
    setAddLookup(false);
    setReturnObject(returnValue);

    getMasterData(
      updatedType.type,
      updatedType.listName,
      updatedType.loadStatus
    );
  };

  const updateIdForDropdown = (
    loading,
    dropdownLoading,
    valueObject,
    key,
    idName
  ) => {
    if (
      !loading &&
      !dropdownLoading &&
      valueObject.hasOwnProperty("lookupKey") &&
      valueObject.lookupType === key
    ) {
      dispatch({
        field: idName,
        value: valueObject.lookupKey,
      });
    }
  };

  useEffect(() => {
    updateIdForDropdown(
      isLoading,
      isManufacturerListLoading,
      returnObject,
      MasterData.lookupTypes.Manufacturers,
      "manufacturerId"
    );
  }, [isLoading, manufacturerList, returnObject, isManufacturerListLoading]);

  useEffect(() => {
    updateIdForDropdown(
      isLoading,
      isStockingUnitListLoading,
      returnObject,
      MasterData.lookupTypes.StockingUnit,
      "stockingUnit"
    );
  }, [isLoading, stockingUnitList, returnObject, isStockingUnitListLoading]);

  useEffect(() => {
    updateIdForDropdown(
      isLoading,
      isDrugTypeListLoading,
      returnObject,
      MasterData.lookupTypes.DrugType,
      "drugType"
    );
  }, [isLoading, drugTypeList, returnObject, isDrugTypeListLoading]);

  useEffect(() => {
    updateIdForDropdown(
      isLoading,
      isStrengthUnitListLoading,
      returnObject,
      MasterData.lookupTypes.StrengthUnit,
      "strengthUnit"
    );
  }, [isLoading, strengthUnitList, returnObject, isStrengthUnitListLoading]);

  const getLookupDialogProps = (lookupType) => {
    return {
      open: addLookup,
      close: handleLookupDialogClose,
      postSave: handlePostLookupSave,
      labels: lookups.find((x) => x.type === lookupType).labels,
      companyId: AuthService.getLoggedInUserCompanyId(),
      lookupType: lookupType,
    };
  };

  const addLookupByType = (e, type) => {
    e.preventDefault();
    setSelectedType(type);
    setAddLookup(true);
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

    if (mode === MasterData.pageMode.Add) {
      submitState.companyId = AuthService.getLoggedInUserCompanyId();
    }

    //clear the fields based on item type
    if (submitState.itemType === "EQP") {
      submitState.drugType = null;
      submitState.strength = null;
      submitState.strengthUnit = null;
    } else if (submitState.itemType === "SUP") {
      submitState.drugType = null;
    }

    console.log(submitState);

    if (mode === MasterData.pageMode.Add) {
      MasterService.addItem(submitState)
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
      MasterService.updateItem(submitState)
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
            Item Master
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Please fill in item information (fields with * are mandatory)
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
                      <TextField
                        label="Item Name"
                        id="itemName"
                        name="itemName"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        required
                        inputProps={{ maxLength: 255 }}
                        value={itemName}
                        onChange={onChange}
                        error={itemNameError.length > 0 ? true : false}
                        helperText={itemNameError}
                      />
                    </div>
                    <div>
                      <TextField
                        label="Item Code"
                        id="itemCode"
                        name="itemCode"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        inputProps={{ maxLength: 50 }}
                        value={itemCode !== null ? itemCode : ""}
                        onChange={onChange}
                      />
                    </div>
                    <div>
                      <AutoCompleteSelect
                        fullWidth
                        data={itemTypeList}
                        label="Item Type *"
                        id="itemType"
                        name="itemType"
                        keyValue="lookupKey"
                        keyLabel="lookupValue"
                        initialValue={itemType}
                        callbackFunction={onChangeNameValue}
                        errorText={itemTypeError}
                      ></AutoCompleteSelect>
                    </div>
                    <div>
                      <span>
                        <AutoCompleteSelect
                          fullWidth
                          data={manufacturerList}
                          label="Manufacturer"
                          id="manufacturerId"
                          name="manufacturerId"
                          keyValue="lookupKey"
                          keyLabel="lookupValue"
                          initialValue={manufacturerId}
                          callbackFunction={onChangeNameValue}
                        ></AutoCompleteSelect>
                      </span>

                      <span>
                        <Link
                          component="button"
                          variant="body2"
                          onClick={(e) =>
                            addLookupByType(
                              e,
                              MasterData.lookupTypes.Manufacturers
                            )
                          }
                        >
                          Add Manufacturer
                        </Link>
                      </span>
                    </div>
                    <div>
                      <span>
                        <AutoCompleteSelect
                          fullWidth
                          data={stockingUnitList}
                          label="Stocking Unit *"
                          id="stockingUnit"
                          name="stockingUnit"
                          keyValue="lookupKey"
                          keyLabel="lookupValue"
                          initialValue={stockingUnit}
                          callbackFunction={onChangeNameValue}
                          errorText={stockingUnitError}
                        ></AutoCompleteSelect>
                      </span>

                      <span>
                        <Link
                          component="button"
                          variant="body2"
                          onClick={(e) =>
                            addLookupByType(
                              e,
                              MasterData.lookupTypes.StockingUnit
                            )
                          }
                        >
                          Add Stocking Unit
                        </Link>
                      </span>
                      {/*  <TextField
                        label="Stocking Unit"
                        id="stockingUnit"
                        name="stockingUnit"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        required
                        inputProps={{ maxLength: 50 }}
                        value={stockingUnit}
                        onChange={onChange}
                        error={stockingUnitError.length > 0 ? true : false}
                        helperText={stockingUnitError}
                      /> */}
                    </div>
                    <div>
                      <TextField
                        label={
                          "Retail Price (" +
                          AuthService.getLoggedInCompanyCurrencyCode() +
                          ")"
                        }
                        id="retailPrice"
                        name="retailPrice"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        value={retailPrice}
                        onChange={onChange}
                        inputProps={{ maxLength: 10 }}
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                          inputProps: Helper.getPriceInputFormatBasedOnCountry(),
                        }}
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
                        initialValue={taxId}
                        callbackFunction={onChangeNameValue}
                        variant="standard"
                      ></AutoCompleteSelect>
                    </div>
                  </div>
                </Paper>
                {/* End Basic Information */}

                {/* Additional Information */}
                <Paper style={{ padding: "15px" }} elevation={3}>
                  <div className={classes.ThreeColumnGrid}>
                    <div className={classes.CheckboxAlign}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={allowPrescription === "YS" ? true : false}
                            onChange={checkBoxHandler}
                            value="YS"
                            color="primary"
                            name="allowPrescription"
                          />
                        }
                        label="Prescribe this?"
                        labelPlacement="end"
                      />
                    </div>
                    {allowPrescription === "YS" ? (
                      <div>
                        <span>
                          <AutoCompleteSelect
                            fullWidth
                            data={drugTypeList}
                            label="Drug Type *"
                            id="drugType"
                            name="drugType"
                            keyValue="lookupKey"
                            keyLabel="lookupValue"
                            initialValue={drugType}
                            callbackFunction={onChangeNameValue}
                            errorText={drugTypeError}
                          ></AutoCompleteSelect>
                        </span>

                        <span>
                          <Link
                            component="button"
                            variant="body2"
                            onClick={(e) =>
                              addLookupByType(
                                e,
                                MasterData.lookupTypes.DrugType
                              )
                            }
                          >
                            Add Drug Type
                          </Link>
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                    {itemType === "DRG" || itemType === "SUP" ? (
                      <div className={classes.TwoColumnGrid}>
                        <div>
                          <TextField
                            label="Strength"
                            id="strength"
                            name="strength"
                            size="small"
                            margin="dense"
                            variant="standard"
                            inputProps={{ maxLength: 25 }}
                            value={strength !== null ? strength : ""}
                            onChange={onChange}
                          />
                        </div>
                        <div>
                          <span>
                            <AutoCompleteSelect
                              fullWidth
                              data={strengthUnitList}
                              label="Unit"
                              id="strengthUnit"
                              name="strengthUnit"
                              keyValue="lookupKey"
                              keyLabel="lookupValue"
                              initialValue={strengthUnit}
                              callbackFunction={onChangeNameValue}
                            ></AutoCompleteSelect>
                          </span>

                          <span>
                            <Link
                              component="button"
                              variant="body2"
                              onClick={(e) =>
                                addLookupByType(
                                  e,
                                  MasterData.lookupTypes.StrengthUnit
                                )
                              }
                            >
                              Add Unit
                            </Link>
                          </span>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    <div>
                      <TextField
                        label="Instructions"
                        id="instructions"
                        name="instructions"
                        size="small"
                        margin="dense"
                        variant="standard"
                        inputProps={{ maxLength: 255 }}
                        value={instructions !== null ? instructions : ""}
                        onChange={onChange}
                        multiline
                        fullWidth
                      />
                    </div>
                  </div>
                </Paper>
                {/* End Additional Information */}
                {/* Stock Information */}
                <Paper style={{ padding: "15px" }} elevation={3}>
                  <div className={classes.ThreeColumnGrid}>
                    <div>
                      <TextField
                        label="Available Stock"
                        id="avaialableStock"
                        name="avaialableStock"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        value={avaialableStock}
                        onChange={onChange}
                        inputProps={{ maxLength: 10 }}
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                          inputProps: Helper.integerProperties,
                          readOnly: true,
                        }}
                        style={{ background: "#f0f0f0" }}
                      />
                    </div>
                    {/* <div>
                      <TextField
                        label="Expired Stock"
                        id="expiredStock"
                        name="expiredStock"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        value={expiredStock}
                        onChange={onChange}
                        inputProps={{ maxLength: 10 }}
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                          inputProps: Helper.integerProperties,
                        }}
                      />
                    </div> */}
                    {/*  <div>
                      <TextField
                        label="Total Stock"
                        id="totalStock"
                        name="totalStock"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        value={totalStock}
                        onChange={onChange}
                        inputProps={{ maxLength: 10 }}
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                          inputProps: Helper.integerProperties,
                        }}
                      />
                    </div> */}
                    <div>
                      <TextField
                        label="Reorder Level"
                        id="reorderLevel"
                        name="reorderLevel"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        value={reorderLevel}
                        onChange={onChange}
                        inputProps={{ maxLength: 10 }}
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                          inputProps: Helper.integerProperties,
                        }}
                      />
                    </div>
                  </div>
                </Paper>
                {/* End Stock Information */}
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
        title="Inventory"
      >
        <span>
          {mode === MasterData.pageMode.Add
            ? "Item added successfully!!"
            : "Item updated successfully"}
        </span>
      </NotificationDialog>

      {selectedType.length > 0 ? (
        <LookupAddDialog
          {...getLookupDialogProps(selectedType)}
        ></LookupAddDialog>
      ) : (
        ""
      )}
    </>
  );
};

export default ItemMasterAddEdit;
