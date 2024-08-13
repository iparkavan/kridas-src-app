import React from "react";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Switch,
} from "@material-ui/core";
import useHttp from "../../../hooks/useHttp";
import userConfig from "../config/userConfig";

const ConfirmationDialog = ({ open, value, handleActivation, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{value ? "Deactivate" : "Activate"} User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to {value ? "deactivate" : "activate"} this
          user?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleActivation} color="primary" autoFocus>
          {value ? "Deactivate" : "Activate"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const UserListToggleSwitch = ({
  value,
  userId,
  refreshData,
  refreshDataloading,
}) => {
  const { isLoading, sendRequest } = useHttp(false);
  // const [activelist, SetActive] = useState(value);
  const [open, setOpen] = useState(false);

  const handleActivation = async () => {
    // activelist ? SetActive(false) : SetActive(true);
    const data = {
      user_id: userId,
      status: !value ? "AC" : "IN",
    };
    const activeInactiveConfig = userConfig.activeInactiveUser(data);
    await sendRequest(activeInactiveConfig);
    await refreshData();
    setOpen(false);
  };

  const handleClose = () => setOpen(false);
  const toggleDialog = () => setOpen(!open);

  return (
    <div>
      <Switch
        checked={value}
        onClick={toggleDialog}
        disabled={isLoading || refreshDataloading}
      />
      {value ? (
        <span style={{ color: "blue" }}>Active</span>
      ) : (
        <span style={{ color: "red" }}>Inactive</span>
      )}
      <ConfirmationDialog
        open={open}
        value={value}
        handleActivation={handleActivation}
        handleClose={handleClose}
      />
    </div>
  );
};

export default UserListToggleSwitch;
