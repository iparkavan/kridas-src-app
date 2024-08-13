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
import SportsNameList from "../../master/sports/components/SportsNameList";
import CategoryNameList from "../../master/category/components/CategoryNameList";
import ServiceProviderConfig from "../../serviceProvider/config/ServiceProviderConfig";
import LookupTableConfig from "../../master/lookupTable/config/LookupTableConfig";
import SportsConfig from "../../master/sports/config/SportsConfig";
import CategoryConfig from "../../master/category/config/CategoryConfig";
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

const UserTypeSponsorProvider = (props) => {
  const classes = useStyles();
  const { userId } = props;
  const [sponsorProviderDetails, setSponsorProviderDetails] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState([]);
  const [askForSubmission, setAskForSubmission] = useState(false);
  const [selectedSubmissionStatus, setSelectedSubmissionStatus] = useState("");
  const [approverComments, setApproverComments] = useState("");
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [reloadData, setReloadData] = useState(true);
  const [approverCommentsError, setApproverCommentsError] = useState("");
  const [sportsList, setSportsList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const { isLoading, sendRequest } = useHttp(true);
  const {
    sendRequest: fetchLookup,
  } = useHttp();

  const {
    sendRequest: fetchSports,
  } = useHttp();

  const {
    isLoading: isCategoryLoading,
    sendRequest: fetchCategory,
  } = useHttp();

  const {
    sendRequest: sendSubmission,
  } = useHttp();

  //Get lookup details
  useEffect(() => {
    const config = LookupTableConfig.getLookupTableByType("OST");

    const transformDate = (data) => {
      setSubmissionStatus(data);
      console.log(data);
    };

    fetchLookup(config, transformDate);
  }, [fetchLookup]);

  //Fetch Sports
  useEffect(() => {
    const config = SportsConfig.getAllSports();

    const transformDate = (data) => {
      setSportsList(data);
      console.log(data);
    };

    fetchSports(config, transformDate);
  }, [fetchSports]);

  //Fetch category list
  useEffect(() => {
    const config = CategoryConfig.getAllCategories();

    const transformDate = (data) => {
      setCategoryList(data);
      console.log(data);
    };

    fetchCategory(config, transformDate);
  }, [fetchCategory]);

  //Get the sponsor provider details by user id
  useEffect(() => {
    const config = ServiceProviderConfig.getSponsorProviderByUserId(userId);

    const transformDate = (data) => {
      setSponsorProviderDetails(data.sponsorProvider);
      if (data.sponsorProvider !== null) {
        setApproverComments(data.sponsorProvider.approverComments);
      }
      setReloadData(false);
      console.log(data);
    };
    if (reloadData) {
      sendRequest(config, transformDate);
    }
  }, [sendRequest, userId, reloadData]);

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
  const submitStatusChangeHandler = () => {
    setAskForSubmission(false);

    const data = {
      sponsorProviderId: sponsorProviderDetails.sponsorProviderId,
      sponsorProviderStatus: selectedSubmissionStatus,
      sponsorProviderApprovedDate: new Date().toISOString(),
      approverComments: approverComments,
    };

    const config = ServiceProviderConfig.approveSponsorProvider(data);
    const transformDate = (data) => {
      console.log(data);
      //check if data submission is successfull
      if (data.hasOwnProperty("sponsorProviderId")) {
        setNotificationMessage("Sponsor Provider status change successful.");
        setOpenNotificationDialog(true);
        setReloadData(true);
      } else {
        setNotificationMessage("Sponsor Provider status change failed.");
        setOpenNotificationDialog(true);
      }
      console.log(data);
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

  if (!isLoading && sponsorProviderDetails === null) {
    return <BodyText>User not registered for sponsor Provider</BodyText>;
  }

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div>
        <BodyText>Below are sponsor Provider details.</BodyText>
      </div>

      {sponsorProviderDetails.user !== null ? (
        <>
          <div className={classes.sectionSpace}>
            <BodyHeading>Sports Associated</BodyHeading>
            <Divider></Divider>
            <div className={classes.contentSpace}>
              <SportsNameList
                selectedSports={sponsorProviderDetails.sportsAssociated}
                sportsList={sportsList}
              ></SportsNameList>
            </div>
          </div>
          <div className={classes.sectionSpace}>
            <BodyHeading>Sponsor Offered</BodyHeading>
            <Divider></Divider>
            <div className={classes.contentSpace}>
              {isCategoryLoading ? (
                ""
              ) : (
                <CategoryNameList
                  selectedCategories={sponsorProviderDetails.sponsorOffered}
                  categoryList={categoryList}
                ></CategoryNameList>
              )}
            </div>
          </div>

          <div className={classes.sectionSpace}>
            <BodyHeading>Submission Status</BodyHeading>
            <Divider></Divider>
            <div className={classes.contentSpace}>
              <BodyText>
                Status:{" "}
                {Helper.getLookupValueFromKey(
                  sponsorProviderDetails.sponsorProviderStatus,
                  submissionStatus
                )}
              </BodyText>
              <BodyText>
                Applied Date:{" "}
                {Helper.getFormattedDate(
                  sponsorProviderDetails.sponsorProviderAppliedDate
                )}
              </BodyText>
              {sponsorProviderDetails.sponsorProviderApprovedDate !== null ? (
                <BodyText>
                  Status Change Date:{" "}
                  {Helper.getFormattedDate(
                    sponsorProviderDetails.sponsorProviderApprovedDate
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
                {sponsorProviderDetails.sponsorProviderStatus === "SUB" ||
                  sponsorProviderDetails.sponsorProviderStatus === "REJ" ? (
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
                {sponsorProviderDetails.sponsorProviderStatus !== "REJ" ? (
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
            title={"Sponsor provider Status Change"}
            handleClose={closeSubmissionDialogHandler}
            handleConfirm={submitStatusChangeHandler}
          >
            You are about to{" "}
            {selectedSubmissionStatus === "APR" ? "approve" : "reject"} this
            sponsor provider. Do you want to continue?
          </ConfirmDialog>
          <NotificationDialog
            open={openNotificationDialog}
            handleClose={closeNotificationDialogHandler}
            title={"Sponsor provider Status Change"}
          >
            {notificationMessage}
          </NotificationDialog>
        </>
      ) : (
        <>
          <div className={classes.sectionSpace}>
            <BodyHeading>
              Associated Company Sponsor Provider Status
            </BodyHeading>
            <Divider></Divider>
            <div className={classes.contentSpace}>
              <BodyText>
                Status:{" "}
                {Helper.getLookupValueFromKey(
                  sponsorProviderDetails.sponsorProviderStatus,
                  submissionStatus
                )}
              </BodyText>
              <BodyText>
                Applied Date:{" "}
                {Helper.getFormattedDate(
                  sponsorProviderDetails.sponsorProviderAppliedDate
                )}
              </BodyText>
              {sponsorProviderDetails.sponsorProviderApprovedDate !== null ? (
                <BodyText>
                  Status Change Date:{" "}
                  {Helper.getFormattedDate(
                    sponsorProviderDetails.sponsorProviderApprovedDate
                  )}
                </BodyText>
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserTypeSponsorProvider;
