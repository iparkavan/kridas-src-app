import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import PropTypes from "prop-types";
import MasterData from "../../../../utils/masterdata";
import useHttp from "../../../../hooks/useHttp";
import LookupTableConfig from "../config/LookupTableConfig";
import LinkButton from "../../../common/ui/components/LinkButton"

const LookupAddDialog = (props) => {
  const { open, close, postSave, lookup_type, labels, mode, editItem } = props;
  const [lookup_key, setLookupKey] = useState("");
  const [lookup_value, setLookupValue] = useState("");
  const [lookupKeyError, setLookupKeyError] = useState("");
  const [lookupValueError, setLookupValueError] = useState("");
  const [errorWarning, setErrorWarning] = useState("");
  const [reload] = useState(false)
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackError, setSnackError] = useState("success");
  const { isSaving, sendRequest } = useHttp();
  const [setCleanup] = useState({});



  let returnFunc = true;
  const validateKey = async (lookup_key, lookup_type) => {
    const getConfig = LookupTableConfig.getLookupTableByKeyType(lookup_key, lookup_type);
    const duplicateData = (data) => {
      if (data.lookup_key.trim().toUpperCase() === lookup_key.trim().toUpperCase() && data.lookup_type === lookup_type) {
        setLookupKeyError("already exists!");
        returnFunc = false;
      }
    }
    await sendRequest(getConfig, duplicateData)
    return () => {
      setCleanup({});
    };
  }
  useEffect(() => {
    setLookupKey(mode === MasterData.pageMode.Edit ? editItem.lookup_key : "");
    setLookupValue(
      mode === MasterData.pageMode.Edit ? editItem.lookup_value : ""
    );
    setLookupKeyError("");
    setLookupValueError("");
    setErrorWarning("");
  }, [props, reload, editItem, mode]);

  const isRequiredFieldsAvailable = () => {
    let submitForm = true;
    let keyError = "";
    let valueError = "";


    keyError =
      lookup_key.trim().length === 0 ? "Please enter " + props.labels.key : "";
    setLookupKeyError(keyError);

    valueError =
      lookup_value.trim().length === 0
        ? "Please enter " + props.labels.value
        : "";
    setLookupValueError(valueError);

    submitForm = keyError.length > 0 || valueError > 0 ? false : true;
    setErrorWarning(submitForm ? "" : "Highlighted fields must be corrected.");

    return submitForm;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!isRequiredFieldsAvailable()) {
      return;
    }

    const submitState = {
      lookup_key: lookup_key,
      lookup_type: lookup_type,
      lookup_value: lookup_value,
    };

    if (mode === MasterData.pageMode.Add) {
      await validateKey(lookup_key, lookup_type);
      if (returnFunc === false) {
        return false;
      }
      if (lookup_value !== "") {
        const config = LookupTableConfig.addNewLookupTableValue(submitState);
        const transformData = (data) => {
          postSave({ lookup_type: lookup_type, lookup_key: lookup_key });
        };
        await sendRequest(config, transformData);
        setSnackError("success");
        setSnackMsg("Lookup add sucessfully");
        setSnackOpen(true);
        return () => {
          setCleanup({});
        };
      }
      else {
        return
      }
    }

    if (mode === MasterData.pageMode.Edit) {
      if (lookup_value !== "") {
        const editconfig = LookupTableConfig.updateLookupTableValue(submitState)
        const transformEditData = (data) => {
          postSave({ lookup_type: lookup_type, lookup_key: lookup_key });
        };
        sendRequest(editconfig, transformEditData);
        setSnackError("success");
        setSnackMsg("Lookup Updated sucessfully");
        setSnackOpen(true);
      } else {
        return
      }
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
              <Typography variant="subtitle1" component={'span'} gutterBottom>

              </Typography>
            ) : (
              ""
            )}
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="lookup_key"
            name="lookup_key"
            label={labels.key}
            type="text"
            value={lookup_key || ''}
            onChange={(e) => { setLookupKey(e.target.value.toUpperCase()) }}
            inputProps={{ maxLength: 5 }}
            fullWidth
            error={lookupKeyError.length > 0 ? true : false}
            helperText={lookupKeyError}
            disabled={mode === MasterData.pageMode.Edit ? true : false}
          />
          <TextField
            required
            margin="dense"
            id="lookup_value"
            name="lookup_value"
            label={labels.value}
            type="text"
            rowsMax={4}
            multiline={true}
            value={lookup_value || ''}
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

          <LinkButton
            onClick={submitForm}
            color="primary"
            disabled={isSaving ? true : false}
          >
            Save
          </LinkButton>

          <LinkButton
            onClick={close}
            color="primary"
            disabled={isSaving ? true : false}
          >
            Cancel
          </LinkButton>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackOpen}
        autoHideDuration={3000} onClose={() => setSnackOpen(false)}>
        <MuiAlert elevation={6} onClose={() => setSnackOpen(false)} variant='filled' severity={snackError}>
          {snackMsg}
        </MuiAlert>
      </Snackbar>

    </form>
  );
};

LookupAddDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  postSave: PropTypes.func.isRequired,
  lookup_type: PropTypes.string.isRequired,
  companyId: PropTypes.number.isRequired,
  labels: PropTypes.object,
  mode: PropTypes.string,
  editItem: PropTypes.object,
};

LookupAddDialog.defaultProps = {
  labels: {
    title: "Add lookup item",
    contentText: "Add new lookup to list",
    key: "Key (max 5 chars)",
    value: "Value",
  },
};

export default LookupAddDialog;
