import React from "react";
import { useHistory } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import classes from "./patient.module.css";
import MasterData from "../helper/masterdata";
import Helper from "../helper/helper";
import ChipArray from "../../elements/ui/ChipArray/ChipArray";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import PatientService from "../../service/PatientService";
import NotificationDialog from "../../elements/ui/Dialog/NotificationDialog";

const PatientProfile = (props) => {
  let history = useHistory();
  const {
    nationalityList,
    referralList,
    ethnicityList,
    occupationList,
  } = props;
  const [open, setOpen] = React.useState(false);
  const [openNotification, setOpenNotification] = React.useState(false);

  const {
    patientName,
    gender,
    mobileNo,
    email,
    addressDTO,
    relationshipCode,
    relationshipContactNo,
    relationshipName,
    dob,
    idPassportNo,
    bloodGroup,
    ethnicity,
    nationality,
    occupation,
    referredBy,
    alternateContactNo,
  } = props.patientInfo;
  const {
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    state,
    country,
    postalCode,
  } = {
    ...addressDTO,
  };

  const addressDetails = () => {
    let returnAddress = "";
    if (addressLine1 !== null) {
      returnAddress = (
        <>
          <span className={classes.RightMargin5}>{addressLine1}</span>
          <span className={classes.RightMargin5}>{addressLine2}</span>
          <span>{addressLine3}</span>
          <br></br>
          <span className={classes.RightMargin5}>{city}</span>
          <span className={classes.RightMargin5}>
            {MasterData.getLookupValueFromKey(state, country)}
          </span>
          <span className={classes.RightMargin5}>
            {MasterData.getLookupValueFromKey(
              country,
              MasterData.lookupTypes.Country
            )}
          </span>
          <span>{postalCode}</span>
        </>
      );
    }
    return returnAddress;
  };

  const handleEditProfile = () => {
    history.push("/patient/edit/" + props.patientInfo.id);
  };

  //Delete patinet handler. Called when user confirms deletions
  const handlePatientDelete = () => {
    setOpen(false);
    deletePatient(props.patientInfo.id);
  };

  const deletePatient = (id) => {
    PatientService.deletePatient(id)
      .then((response) => {
        setOpenNotification(true);
      })
      .catch((ex) => {
        console.log(ex);
      });
  };

  //Close handler for delete notification
  const handleDeleteConfirmationClose = (event) => {
    setOpen(false);
  };

  //handler for opening delete notification
  const handleDeleteConfirmationOpen = (event) => {
    setOpen(true);
  };

  //Close handler for delete notification complete
  const handleNotificationClose = (event) => {
    setOpenNotification(false);
    history.push("/patient/index");
  };

  return (
    <>
      <div className={classes.PatientProfileBlock}>
        <div className={`${classes.ThreeColumnOverride} ${classes.RightAlign}`}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleEditProfile}
            startIcon={<EditIcon />}
            style={{ marginRight: "5px" }}
          >
            Edit Profile
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={handleDeleteConfirmationOpen}
            startIcon={<DeleteIcon />}
          >
            Delete Patient
          </Button>
        </div>
        <div className={classes.PatientProfileLeftSection}>
          <div>
            <Paper style={{ padding: "10px" }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                style={{
                  marginTop: "10px",
                  marginBottom: "20px",
                  color: "#434e52",
                  fontWeight: "bold",
                }}
              >
                {patientName}
              </Typography>

              <div className={classes.PatientProfileContactInfo}>
                <div>
                  <Typography variant="body2" gutterBottom>
                    Gender:
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    {Helper.getGenderName(gender)}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    Birthday:
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    {Helper.getFormattedDate(dob, "ll")}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    NRIC/ID:
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    {idPassportNo}
                  </Typography>
                </div>
              </div>
            </Paper>
          </div>
          <div>
            <Paper style={{ padding: "10px" }}>
              <Typography
                variant="body2"
                gutterBottom
                style={{
                  marginTop: "10px",
                  marginBottom: "20px",
                  color: "#434e52",
                }}
              >
                Contact Information
              </Typography>
              <div className={classes.PatientProfileContactInfo}>
                <div>
                  <Typography variant="body2" gutterBottom>
                    Phone:
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant="body2"
                    gutterBottom
                    style={{ color: "#323edd" }}
                  >
                    {mobileNo}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    Email:
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    {email}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    Address:
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    {addressDetails()}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    Alt Contact:
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    {alternateContactNo}
                  </Typography>
                </div>
              </div>
            </Paper>
          </div>
        </div>
        {/* Middle Section */}
        <div className={classes.PatientProfileMiddleSection}>
          <div>
            <Paper style={{ padding: "10px" }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                style={{
                  marginTop: "10px",
                  marginBottom: "20px",
                  color: "#434e52",
                }}
              >
                Emergency Information
              </Typography>
              <div className={classes.PatientProfileContactInfo}>
                <div>
                  <Typography variant="body2" gutterBottom>
                    Relation:
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    {MasterData.getLookupValueFromKey(
                      relationshipCode,
                      MasterData.lookupTypes.PatientRelationship
                    )}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    Relation Name:
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    {relationshipName}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    Contact No:
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    {relationshipContactNo}
                  </Typography>
                </div>
              </div>
            </Paper>
          </div>
          <div>
            <Paper style={{ padding: "10px" }}>
              <Typography
                variant="body2"
                gutterBottom
                style={{
                  marginTop: "10px",
                  marginBottom: "20px",
                  color: "#434e52",
                }}
              >
                Other Information
              </Typography>
              <div className={classes.PatientProfileContactInfo}>
                <div>
                  <Typography variant="body2" gutterBottom>
                    Referred By:
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    {/* {MasterData.getLookupValueFromKey(
                      referredBy,
                      MasterData.lookupTypes.PatientReferral
                    )} */}

                    {MasterData.getValueFromLookupList(
                      referralList,
                      referredBy
                    )}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    Blood Group:
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    {MasterData.getLookupValueFromKey(
                      bloodGroup,
                      MasterData.lookupTypes.BloodGroup
                    )}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    Occupation:
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    {/* {MasterData.getLookupValueFromKey(
                      occupation,
                      MasterData.lookupTypes.Occupation
                    )} */}
                    {MasterData.getValueFromLookupList(
                      occupationList,
                      occupation
                    )}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    Nationality:
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    {/*  {MasterData.getLookupValueFromKey(
                      nationality,
                      MasterData.lookupTypes.Nationality
                    )} */}
                    {MasterData.getValueFromLookupList(
                      nationalityList,
                      nationality
                    )}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    Ethnicity:
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    {/*  {MasterData.getLookupValueFromKey(
                      ethnicity,
                      MasterData.lookupTypes.Ethnicity
                    )} */}
                    {MasterData.getValueFromLookupList(
                      ethnicityList,
                      ethnicity
                    )}
                  </Typography>
                </div>
              </div>
            </Paper>
          </div>
        </div>
        {/* Right section */}
        <div className={classes.PatientProfileRightSection}>
          <div>
            <Paper style={{ padding: "10px" }}>
              <Typography
                variant="body2"
                gutterBottom
                style={{
                  marginTop: "10px",
                  marginBottom: "20px",
                  color: "#434e52",
                }}
              >
                MEDICAL HISTORY
              </Typography>
              <div>
                <ChipArray
                  arrayData={props.patientInfo.patientMedicalHistories}
                  keyName="id"
                  valueName="medicalHistoryDesc"
                ></ChipArray>
              </div>
            </Paper>
          </div>
          <div>
            <Paper style={{ padding: "10px" }}>
              <Typography
                variant="body2"
                gutterBottom
                style={{
                  marginTop: "10px",
                  marginBottom: "20px",
                  color: "#434e52",
                }}
              >
                MEDICAL GROUP
              </Typography>
              <div>
                <ChipArray
                  arrayData={props.patientInfo.patientMedicalGroups}
                  keyName="id"
                  valueName="groupDesc"
                ></ChipArray>
              </div>
            </Paper>
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleDeleteConfirmationClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Patient Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are about to delete patient with name {patientName}. Do you wish
            to go ahead?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose} color="primary">
            No
          </Button>
          <Button onClick={handlePatientDelete} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <NotificationDialog
        open={openNotification}
        handleClose={handleNotificationClose}
        title="Patients"
      >
        <span>Patient deleted successfully !!!</span>
      </NotificationDialog>
    </>
  );
};

export default PatientProfile;
