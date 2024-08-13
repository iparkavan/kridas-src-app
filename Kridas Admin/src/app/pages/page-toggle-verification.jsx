import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { VerificationSwitch } from "../UI/switch/verification-switch";
import { usePageVerification } from "../../hooks/page-hooks";
import { useState } from "react";

export const ConfirmationDialog = ({
  open,
  handleClose,
  value,
  handleActivation,
}) => {
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Page Verification</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {value ? "Unverify" : "Verify"} this page?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleActivation} autoFocus>
            {value ? "Unverify" : "Verify"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const PageToggleVerification = ({
  value,
  companyId,
}) => {
  const [open, setOpen] = useState(false);
  const { mutate: verificationMutate, isLoading: verificationIsLoading } =
    usePageVerification();

  const handleActivation = () => {
    verificationMutate({
      company_id: companyId,
      company_profile_verified: !value ? true : false,
    });
    console.log(verificationMutate);
    setOpen(false);
  };

  const toggleDialog = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="flex justify-center gap-3">
      <VerificationSwitch
        checked={value}
        onClick={toggleDialog}
        disabled={verificationIsLoading}
      />
      {value ? (
        <span style={{ color: "#65c466" }}>Verified</span>
      ) : (
        <span style={{ color: "red" }}>UnVerified</span>
      )}
      <ConfirmationDialog
        value={value}
        open={open}
        handleActivation={handleActivation}
        handleClose={handleClose}
      />
    </div>
  );
};

export default PageToggleVerification;
