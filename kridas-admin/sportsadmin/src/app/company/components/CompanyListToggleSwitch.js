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
import CompanyConfig from "../config/CompanyConfig";
const ConfirmationDialog = ({ open, value, handleActivation, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{value ? "Unverify" : "Verify"} Company</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to {value ? "unverify" : "verify"} this company?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleActivation} color="primary" autoFocus>
          {value ? "Unverify" : "Verify"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CompanyListToggleSwitch = ({
  value,
  companyId,
  refreshData,
  refreshDataloading,
}) => {
  const { isLoading, sendRequest } = useHttp(false);
  const [open, setOpen] = useState(false);

  const handleActivation = async () => {
    const data = {
      company_id: companyId,
      company_profile_verified: !value ? true : false,
    };
    const activeInactiveConfig = CompanyConfig.companyProfileVerification(data);
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
        <span style={{ color: "blue" }}>Verified</span>
      ) : (
        <span style={{ color: "red" }}>UnVerified</span>
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

export default CompanyListToggleSwitch;
