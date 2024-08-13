import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import PropTypes from "prop-types";

import MasterData from "../../helper/masterdata";
import MasterService from "../../../service/MasterService";
import classes from "../master.module.css";

const LookupAddDialog = (props) => {
  const {
    open,
    close,
    postSave,
    lookupType,
    companyId,
    labels,
    mode,
    editItem,
  } = props;
  const [lookupKey, setLookupKey] = useState("");
  const [lookupValue, setLookupValue] = useState("");
  const [lookupKeyError, setLookupKeyError] = useState("");
  const [lookupValueError, setLookupValueError] = useState("");
  const [errorWarning, setErrorWarning] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLookupKey(
      props.mode === MasterData.pageMode.Edit ? props.editItem.lookupKey : ""
    );
    setLookupValue(
      props.mode === MasterData.pageMode.Edit ? props.editItem.lookupValue : ""
    );
    setLookupKeyError("");
    setLookupValueError("");
    setErrorWarning("");
    setIsSaving(false);
  }, [props]);

  // Verify if all necessary fields are entered before form submission
  const isRequiredFieldsAvailable = () => {
    let submitForm = true;
    let keyError = "";
    let valueError = "";

    keyError =
      lookupKey.trim().length === 0 ? "Please enter " + props.labels.key : "";
    setLookupKeyError(keyError);

    valueError =
      lookupValue.trim().length === 0
        ? "Please enter " + props.labels.value
        : "";
    setLookupValueError(valueError);

    submitForm = keyError.length > 0 || valueError > 0 ? false : true;
    setErrorWarning(submitForm ? "" : "Highlighted fields must be corrected.");

    return submitForm;
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (!isRequiredFieldsAvailable()) {
      return;
    }

    //disable the submit button
    setIsSaving(true);

    const submitState = {
      companyId: companyId,
      lookupKey: lookupKey,
      lookupType: lookupType,
      lookupValue: lookupValue,
    };

    console.log(submitState);

    if (mode === MasterData.pageMode.Edit) {
      MasterService.updateLookupTableValue(submitState)
        .then((response) => {
          postSave({ lookupType: lookupType, lookupKey: lookupKey });
        })
        .catch((response) => {
          console.log(response);
        })
        .finally(() => {
          setIsSaving(false);
        });
    } else {
      MasterService.addLookupTableValue(submitState)
        .then((response) => {
          postSave({ lookupType: lookupType, lookupKey: lookupKey });
        })
        .catch((response) => {
          console.log(response);
          setErrorWarning(props.labels.key + " already exists!!!");
        })
        .finally(() => {
          setIsSaving(false);
        });
    }
  };

  return (
    <form noValidate>
      <Dialog
        open={open}
        onClose={close}
        aria-labelledby="form-dialog-lookup"
        maxWidth={"lg"}
      >
        <DialogTitle id="form-dialog-lookup">
          {mode === MasterData.pageMode.Edit ? "Edit list item" : labels.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {mode === MasterData.pageMode.Edit ? "" : labels.contentText}
            {errorWarning.length > 0 ? (
              <Typography variant="subtitle1" gutterBottom>
                <span className={`${classes.LeftMargin5} ${classes.ErrorText}`}>
                  {errorWarning}
                </span>
              </Typography>
            ) : (
              ""
            )}
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="lookupKey"
            name="lookupKey"
            label={labels.key}
            type="text"
            value={lookupKey}
            onChange={(e) => {
              setLookupKey(e.target.value);
            }}
            inputProps={{ maxLength: 3 }}
            fullWidth
            error={lookupKeyError.length > 0 ? true : false}
            helperText={lookupKeyError}
            disabled={mode === MasterData.pageMode.Edit ? true : false}
          />
          <TextField
            required
            margin="dense"
            id="lookupValue"
            name="lookupValue"
            label={labels.value}
            type="text"
            value={lookupValue}
            onChange={(e) => {
              setLookupValue(e.target.value);
            }}
            fullWidth
            inputProps={{ maxLength: 255 }}
            error={lookupValueError.length > 0 ? true : false}
            helperText={lookupValueError}
          />
          {isSaving ? (
            <Typography variant="body2" gutterBottom>
              <span style={{ color: "green" }}>Saving...</span>
            </Typography>
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={close}
            color="primary"
            disabled={isSaving ? true : false}
          >
            Cancel
          </Button>
          <Button
            onClick={submitForm}
            color="primary"
            disabled={isSaving ? true : false}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

LookupAddDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  postSave: PropTypes.func.isRequired,
  lookupType: PropTypes.string.isRequired,
  companyId: PropTypes.number.isRequired,
  labels: PropTypes.object,
  mode: PropTypes.string,
  editItem: PropTypes.object,
};

LookupAddDialog.defaultProps = {
  labels: {
    title: "Add list item",
    contentText: "Add new item to list",
    key: "Key (max 3 chars)",
    value: "Value",
  },
  mode: "ADD",
};

export default LookupAddDialog;
