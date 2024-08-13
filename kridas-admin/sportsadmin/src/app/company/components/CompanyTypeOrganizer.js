import { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

import BodyText from "../../common/ui/components/BodyText";
import BodyHeading from "../../common/ui/components/BodyHeading";
import Button from "../../common/ui/components/Button";
import ConfirmDialog from "../../common/ui/components/ConfirmDialog";
import NotificationDialog from "../../common/ui/components/NotificationDialog";
import CompanyUsersList from "./CompanyUsersList";

import OrganizerConfig from "../../organizer/config/OrganizerConfig";
import LookupTableConfig from "../../master/lookupTable/config/LookupTableConfig";

import useHttp from "../../../hooks/useHttp";
import Helper from "../../../utils/helper";

const useStyles = makeStyles(() => ({
  sectionSpace: {
    margin: "20px 0 0 0",
  },
  contentSpace: {
    margin: "5px 0 0 0",
  },
  marginRightSpace: {
    marginRight: "10px",
  },
  buttonContainer: {
    display: "flex",
  },
}));

const CompanyTypeOrganizer = (props) => {
  const classes = useStyles();
  const { companyId } = props;
  const [organizerDetails, setOrganizerDetails] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState([]);
  const [askForSubmission, setAskForSubmission] = useState(false);
  const [selectedSubmissionStatus, setSelectedSubmissionStatus] = useState("");
  const [approverComments, setApproverComments] = useState("");
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [reloadData, setReloadData] = useState(true);
  const [approverCommentsError, setApproverCommentsError] = useState("");

  const { isLoading, sendRequest } = useHttp(true);
  const {
    sendRequest: fetchLookup,
  } = useHttp();

  const {
    sendRequest: sendSubmission,
  } = useHttp();

  //Get lookup details
  useEffect(() => {
    const config = LookupTableConfig.getLookupTableByType("OST");

    const transformDate = (data) => {
      setSubmissionStatus(data);
    
    };

    fetchLookup(config, transformDate);
  }, [fetchLookup]);

  //Get the organizer details by company id
  useEffect(() => {
    const config = OrganizerConfig.getOrganizerByCompanyId(companyId);

    const transformDate = (data) => {
      setOrganizerDetails(data.organizer);
      if (data.organizer !== null) {
        setApproverComments(data.organizer.approverComments);
      }
      setReloadData(false);
    };
    if (reloadData) {
      sendRequest(config, transformDate);
    }
  }, [sendRequest, companyId, reloadData]);

  //Handler for opening confirmation dialog
  const openSubmissionDialogHandler = (subType) => {
    if (approverComments === null || approverComments.trim().length === 0) {
      setApproverCommentsError("Please enter approver comments.");
    } else {
      setApproverCommentsError("");
      setSelectedSubmissionStatus(subType);
      setAskForSubmission(true);
    }
  };

  //Handler for closing confirmation dialog
  const closeSubmissionDialogHandler = () => {
    setSelectedSubmissionStatus("");
    setAskForSubmission(false);
  };

  //Handler for submitting the status
  const submitOrganizerStatusChangeHandler = () => {
    setAskForSubmission(false);

    const data = {
      organizerId: organizerDetails.organizerId,
      organizerStatus: selectedSubmissionStatus,
      organizerApprovedDate: new Date().toISOString(),
      approverComments: approverComments,
    };

    const config = OrganizerConfig.approveOrganizer(data);
    const transformDate = (data) => {
      //check if data submission is successfull
      if (data.hasOwnProperty("organizerId")) {
        setNotificationMessage("Organizer status change successful.");
        setOpenNotificationDialog(true);
        setReloadData(true);
      } else {
        setNotificationMessage("Organizer status change failed.");
        setOpenNotificationDialog(true);
      }
    };
    sendSubmission(config, transformDate);
  };

  //Handler for closing the notification dialog
  const closeNotificationDialogHandler = () => {
    setOpenNotificationDialog(false);
  };

  const onChangeHandler = (e) => {
    if ((e.target.name = "approverComments")) {
      setApproverComments(e.target.value);
    }
  };

  if (!isLoading && organizerDetails === null) {
    return <BodyText>Company not registered for Organizer</BodyText>;
  }

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div>
        <BodyText>Below are organizer details.</BodyText>
      </div>
      <div className={classes.sectionSpace}>
        <BodyHeading>Organizer Name</BodyHeading>
        <Divider></Divider>
        <div className={classes.contentSpace}>
          <BodyText>{organizerDetails.organizerName}</BodyText>
        </div>
      </div>
      {organizerDetails.company !== null ? (
        <>
          <div className={classes.sectionSpace}>
            <BodyHeading>Company Users</BodyHeading>
            <Divider></Divider>
            <div className={classes.sectionSpace}>
              <CompanyUsersList
                userList={organizerDetails.company.companyUsers}
              ></CompanyUsersList>
            </div>
          </div>
          <div className={classes.sectionSpace}>
            <BodyHeading>Submission Status</BodyHeading>
            <Divider></Divider>
            <div className={classes.contentSpace}>
              <BodyText>
                Status:{" "}
                {Helper.getLookupValueFromKey(
                  organizerDetails.organizerStatus,
                  submissionStatus
                )}
              </BodyText>
              <BodyText>
                Applied Date:{" "}
                {Helper.getFormattedDate(organizerDetails.organizerAppliedDate)}
              </BodyText>
              {organizerDetails.organizerApprovedDate !== null ? (
                <BodyText>
                  Status Change Date:{" "}
                  {Helper.getFormattedDate(
                    organizerDetails.organizerApprovedDate
                  )}
                </BodyText>
              ) : (
                ""
              )}
              <div className={classes.sectionSpace}>
                <TextField
                  id="approverComments"
                  label="Approver Comments"
                  multiline
                  fullwidth
                  rows={4}
                  variant="outlined"
                  value={approverComments}
                  onChange={(e) => onChangeHandler(e)}
                  error={approverCommentsError.trim().length > 0}
                  helperText={
                    approverCommentsError.trim().length > 0
                      ? approverCommentsError
                      : ""
                  }
                />
              </div>
              <div className={classes.sectionSpace}></div>
              <div className={classes.buttonContainer}>
                {organizerDetails.organizerStatus === "SUB" ||
                organizerDetails.organizerStatus === "REJ" ? (
                  <div className={classes.marginRightSpace}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CheckCircleOutlineRoundedIcon />}
                      onClick={() => openSubmissionDialogHandler("APR")}
                    >
                      Approve
                    </Button>
                  </div>
                ) : (
                  ""
                )}
                {organizerDetails.organizerStatus !== "REJ" ? (
                  <div>
                    <Button
                      variant="contained"
                      color="default"
                      startIcon={<CancelRoundedIcon />}
                      onClick={() => openSubmissionDialogHandler("REJ")}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <ConfirmDialog
            open={askForSubmission}
            title={"Organizer Status Change"}
            handleClose={closeSubmissionDialogHandler}
            handleConfirm={submitOrganizerStatusChangeHandler}
          >
            You are about to{" "}
            {selectedSubmissionStatus === "APR" ? "approve" : "reject"} this
            organizer. Do you want to continue?
          </ConfirmDialog>
          <NotificationDialog
            open={openNotificationDialog}
            handleClose={closeNotificationDialogHandler}
            title={"Organizer Status Change"}
          >
            {notificationMessage}
          </NotificationDialog>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CompanyTypeOrganizer;
