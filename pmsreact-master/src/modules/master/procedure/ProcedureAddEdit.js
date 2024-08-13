import React, { useState, useEffect, useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";

import AuthService from "../../../service/AuthService";
import MasterService from "../../../service/MasterService";
import MasterData from "../../helper/masterdata";
import classes from "../master.module.css";
import Helper from "../../helper/helper";
import * as ProcedureObjects from "./ProcedureObjects";
import BackdropLoader from "../../../elements/ui/BackdropLoader/BackdropLoader";
import AutoCompleteSelect from "../../../elements/ui/AutoComplete/AutoCompleteSelect";
import NumberFormatCustom from "../../../elements/ui/numberformatcustom";
import NotificationDialog from "../../../elements/ui/Dialog/NotificationDialog";

const initialState = ProcedureObjects.procedureObject;
const initialErrorState = ProcedureObjects.procedureErrorObject;
const initialPageState = ProcedureObjects.procedurePageObject;

const ProcedureAddEdit = (props) => {
  let history = useHistory();
  const { procedureId } = useParams();
  const [taxList, setTaxList] = useState([]);
  const [parentProcedureList, setParentProcedureList] = useState([]);
  const [procedureInfo, setProcedureInfo] = useState({});

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
      case "price":
        if (value > Helper.getMaxPriceAllowed()) {
          errDispatch({
            field: "price",
            value: "Price cannot be more than " + Helper.getMaxPriceAllowed(),
          });
          dispatch({ field: name, value: price });
        } else {
          errDispatch({ field: "price", value: "" });
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

  const {
    id,
    parentProcedureId,
    price,
    procedureName,
    procedureNotes,
    taxId,
  } = mainState;

  const { procedureNameError, priceError } = errorState;

  const {
    openSnackMessage,
    isLoading,
    errorWarning,
    disableSubmit,
    isTaxListLoading,
    isParentProcedureLoading,
    isMainDataLoading,
    mode,
  } = pageState;

  //Once all required data loaded, load the page
  useEffect(() => {
    if (!isTaxListLoading && !isMainDataLoading && !isParentProcedureLoading) {
      pageDispatch({ field: "isLoading", value: false });
    }
  }, [isTaxListLoading, isMainDataLoading, isParentProcedureLoading]);

  //Set Mode to EDIT when id param is passed
  useEffect(() => {
    if (!(procedureId == null) && procedureId !== null) {
      pageDispatch({ field: "mode", value: MasterData.pageMode.Edit });
    }
  }, [procedureId]);

  useEffect(() => {
    if (isTaxListLoading) {
      getTaxList();
    }
  }, [isTaxListLoading]);

  useEffect(() => {
    if (isParentProcedureLoading) {
      getProcedureList();
    }
  }, [isParentProcedureLoading]);

  useEffect(() => {
    if (
      procedureId == null &&
      isMainDataLoading &&
      mode === MasterData.pageMode.Add
    ) {
      dispatch({
        field: "companyId",
        value: AuthService.getLoggedInUserCompanyId(),
      });
      pageDispatch({ field: "isMainDataLoading", value: false });
    }
  }, [isMainDataLoading, mode]);

  //Fetch the tax list
  const getTaxList = () => {
    MasterService.fetchAllTaxesByCompanyId(
      AuthService.getLoggedInUserCompanyId()
    )
      .then((response) => {
        const taxes = Array.isArray(response.data) ? response.data : [];
        setTaxList(taxes);
      })
      .finally(() => {
        pageDispatch({ field: "isTaxListLoading", value: false });
      });
  };

  useEffect(() => {
    if (mode === MasterData.pageMode.Edit && isMainDataLoading) {
      MasterService.fetchProcedureByProcedureId(procedureId)
        .then((res) => {
          setProcedureInfo(res.data);

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
  }, [mode, procedureId, isMainDataLoading]);

  const getProcedureList = () => {
    MasterService.fetchAllProceduresByCompanyId(
      AuthService.getLoggedInUserCompanyId()
    )
      .then((response) => {
        const procedures = Array.isArray(response.data) ? response.data : [];
        setParentProcedureList(procedures);
      })
      .finally(() => {
        pageDispatch({ field: "isParentProcedureLoading", value: false });
      });
  };

  // Verify if all necessary fields are entered before form submission
  const isRequiredFieldsAvailable = () => {
    let submitForm = true;
    const validationState = { ...errorState };

    validationState.procedureNameError =
      procedureName.trim().length === 0 ? "Please enter Procedure Name" : "";

    validationState.priceError =
      price == null || price.toString().length === 0
        ? "Please enter Price"
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

    //console.log(submitState);

    if (mode === MasterData.pageMode.Add) {
      MasterService.addProcedure(submitState)
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
      MasterService.updateProcedure(submitState)
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
            Procedure
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Please fill in procedure information (fields with * are mandatory)
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
                    <div className={classes.TwoColumnOverride}>
                      <TextField
                        label="Procedure Name"
                        id="procedureName"
                        name="procedureName"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        required
                        inputProps={{ maxLength: 255 }}
                        value={procedureName}
                        onChange={onChange}
                        error={procedureNameError.length > 0 ? true : false}
                        helperText={procedureNameError}
                      />
                    </div>
                    <div>
                      <AutoCompleteSelect
                        fullWidth
                        data={parentProcedureList}
                        label="Parent Procedure"
                        id="parentProcedureId"
                        name="parentProcedureId"
                        keyValue="id"
                        keyLabel="procedureName"
                        initialValue={parentProcedureId}
                        callbackFunction={onChangeNameValue}
                      ></AutoCompleteSelect>
                    </div>
                    <div className={classes.TwoColumnOverride}>
                      <TextField
                        label="Procedure Notes"
                        id="procedureNotes"
                        name="procedureNotes"
                        size="small"
                        margin="dense"
                        fullWidth
                        variant="standard"
                        inputProps={{ maxLength: 255 }}
                        value={procedureNotes !== null ? procedureNotes : ""}
                        onChange={onChange}
                        multiline
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
                        variant="standard"
                        value={price}
                        onChange={onChange}
                        required
                        inputProps={{ maxLength: 10 }}
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                          inputProps: Helper.getPriceInputFormatBasedOnCountry(),
                        }}
                        error={priceError.length > 0 ? true : false}
                        helperText={priceError}
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
                      ></AutoCompleteSelect>
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
        title="Procedure"
      >
        <span>
          {mode === MasterData.pageMode.Add
            ? "Procedure added successfully!!"
            : "Procedure updated successfully"}
        </span>
      </NotificationDialog>
    </>
  );
};

export default ProcedureAddEdit;
