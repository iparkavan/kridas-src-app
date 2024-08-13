import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from "@material-ui/styles";
import ApprovalConfig from "../config/ApprovalConfig";
import useHttp from "../../../../hooks/useHttp";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useHistory } from "react-router";
import UserProfile from "../../../user/components/UserProfile";
import CompanyProfile from "../../../company/components/CompanyProfile";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import InputField from "../../../common/ui/components/InputField";
import PageContainer from "../../../common/layout/components/PageContainer";
import VerificationButton from "./VerificationButton";
import * as yup from "yup";
import LinkButton from "../../../common/ui/components/LinkButton";

const useStyles = makeStyles((theme) => ({
  btn: {
    padding: "2--px",
    margin: "10px",
  },
  field: {
    width: "250px",
    margin: "5px",
  },
  button: {
    float: "right",
    marginRight: "20px",
  },
  details: {
    margin: "10px 10px 0px 30px",
  },
  heading: {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "23px",
  },
}));

const ApprovalView = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const { type, id, profileId } = useParams();
  const [dialogopen, setDialogOpen] = React.useState(false);
  const [errors, setErrors] = useState({});
  const [, setClear] = useState({});
  const [profile, setProfile] = useState({
    user_id: "",
    company_id: "",
    applied_date: "",
    applied_status: "",
    verification_comments: "",
    status_change_date: "",
    mode: "Approve",
    company_name: "",
    user_name: "",
  });
  const { sendRequest } = useHttp();
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("Approved Successfully");
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const config = ApprovalConfig.getById(profileId);
    const transformDate = (data) => {
      setProfile(data.data);
    };
    sendRequest(config, transformDate);
    return () => {
      setClear({});
    };
  }, [sendRequest, profileId]);

  const handleApproveOpen = () => {
    setMode("A");
    setDialogOpen(true);
  };

  const handleRejectOpen = () => {
    setMode("R");
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const Backbtn = () => {
    if (profile.user_id) history.push(`/profile-verification/users`);
    else history.push(`/profile-verification/company`);
  };

  let handleSave = async (e) => {
    e.preventDefault();
    setErrors({});
    const scheme = yup.object().shape({
      verification_comments: yup
        .string()
        .typeError("Please enter comments")
        .required("comments is required"),
    });
    await scheme
      .validate(profile, { abortEarly: false })
      .then(() => {
        const config = ApprovalConfig.edit({
          ...profile,
          profile_verification_id: profileId,
          applied_status: mode,
        });
        const transformDate = (data) => {
          setProfile(data);
          if (data.user_id) {
            history.push(`/profile-verification/users`);
          } else {
            history.push(`/profile-verification/company`);
          }
        };
        sendRequest(config, transformDate);
        handleClose();
        if (mode === "A") {
          setSnackMsg("Approved successfully");
          setSnackOpen(true);
        } else if (mode === "R") {
          setSnackMsg("Rejected");
          setSnackOpen(true);
        }
      })
      .catch((e) => {
        let errorObj = {};
        e.inner.map((error) => {
          return (errorObj[error.path] = error.message);
        });
        setErrors({
          ...errorObj,
        });
      });
  };

  return (
    <>
      <PageContainer>
        {type === "user" ? (
          <div>
            <VerificationButton
              profile={profile}
              handleApprove={handleApproveOpen}
              handleReject={handleRejectOpen}
            />
            <div className={classes.heading}>
              <Tooltip title="Back">
                <IconButton aria-label="Back" size="medium" onClick={Backbtn}>
                  <ArrowBackIosIcon style={{ fontSize: "large" }} />
                </IconButton>
              </Tooltip>
              User Information
            </div>
            <div className={classes.details}>
              <UserProfile userId={id} />
            </div>
          </div>
        ) : (
          <div>
            <VerificationButton
              profile={profile}
              handleApprove={handleApproveOpen}
              handleReject={handleRejectOpen}
            />
            <div className={classes.heading}>
              <Tooltip title="Back">
                <IconButton aria-label="Back" size="medium" onClick={Backbtn}>
                  <ArrowBackIosIcon style={{ fontSize: "large" }} />
                </IconButton>
              </Tooltip>
              Company Information
            </div>
            <div className={classes.details}>
              <CompanyProfile companyId={id} />
            </div>
          </div>
        )}
        <Dialog
          open={dialogopen}
          onClose={handleClose}
          aria-labelledby="form-dialog-lookup"
          maxWidth={"lg"}
        >
          <DialogTitle id="form-dialog-lookup">Comments</DialogTitle>
          <DialogContent>
            <div>
              <InputField
                className={classes.field}
                requiredfield
                label="comments"
                name="verification_comments"
                rowsMax={4}
                multiline={true}
                value={profile?.verification_comments || ""}
                onChange={(e) => handleChange(e)}
                error={Boolean(errors?.verification_comments)}
                helperText={errors?.verification_comments}
              />
            </div>
          </DialogContent>

          <DialogActions>
            <LinkButton
              cursor="pointer"
              onClick={handleClose}
              variant="contained"
            >
              {" "}
              Cancel
            </LinkButton>
            <LinkButton
              className={classes.btn}
              variant="contained"
              color="primary"
              type="button"
              onClick={(e) => handleSave(e)}
            >
              {mode === "A" ? "Approve" : "Reject"}
            </LinkButton>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackOpen}
          autoHideDuration={3000}
          onClose={() => setSnackOpen(false)}
        >
          <MuiAlert
            elevation={6}
            onClose={() => setSnackOpen(false)}
            variant="filled"
            severity="success"
          >
            {snackMsg}
          </MuiAlert>
        </Snackbar>
      </PageContainer>
    </>
  );
};

export default ApprovalView;
