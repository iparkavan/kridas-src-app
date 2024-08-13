import { useEffect, useState } from "react";
import { MenuItem, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router";
import PageContainer from "../../common/layout/components/PageContainer";
import Button from "../../common/ui/components/Button";
import OrganizerConfig from "../config/OrganizerConfig";
import LookupTableConfig from "../../master/lookupTable/config/LookupTableConfig";
import useHttp from "../../../hooks/useHttp";
import ErrorLabel from "../../common/ui/components/ErrorLabel";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "30px",
  },
  button: {
    alignSelf: "flex-start"
  }
}));

const OrganizerIndex = () => {
  const classes = useStyles();
  const [organizer, setOrganizer] = useState();
  const [allOrganizerStatus, setAllOrganizerStatus] = useState([]);
  const [organizerStatus, setOrganizerStatus] = useState("");
  const [approverComments, setApproverComments] = useState("");
  const [approverCommentsError, setApproverCommentsError] = useState("");
  const [organizerStatusError, setOrganizerStatusError] = useState("");

  const { organizerId } = useParams();
  const { error, sendRequest } = useHttp();

  useEffect(() => {
    const organizerConfig = OrganizerConfig.getOrganizer(organizerId);
    const lookupConfig = LookupTableConfig.getLookupTableByType("OST");

    const transformOrganizerData = (data) => {
      const actualData = data.data;
      setOrganizer(actualData);
      setOrganizerStatus(actualData.organizerStatus);
      if (actualData.approverComments) {
        setApproverComments(actualData.approverComments);
      }
    };

    const transformLookupData = (data) => {
      setAllOrganizerStatus(data);
    };

    sendRequest(organizerConfig, transformOrganizerData);
    sendRequest(lookupConfig, transformLookupData);
  }, [sendRequest, organizerId]);

  const handleChange = (e) => {
    setApproverComments(e.target.value);
  };

  const handleSelectChange = (e) => {
    setOrganizerStatus(e.target.value);
  };

  const validateFields = () => {
    let submitForm = true;

    if (approverComments.trim().length === 0) {
      setApproverCommentsError("Approver comment is required");
      submitForm = false;
    } else {
      setApproverCommentsError("");
    }

    if (organizerStatus.trim().length === 0) {
      setOrganizerStatusError("Organizer status is required");
      submitForm = false;
    } else {
      setOrganizerStatusError("");
    }

    return submitForm;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    const organizerConfig = OrganizerConfig.approveOrganizer({
      organizerId: organizer.organizerId,
      organizerStatus,
      organizerApprovedDate: new Date().toISOString(),
      approverComments
    });

    const transformData = (data) => { };

    await sendRequest(organizerConfig, transformData);
  }

  return (
    <PageContainer heading="Organizer Details">
      <div className={classes.root}>
        <Typography> Organizer Details</Typography>
        <TextField variant="outlined" label="Add comment" value={approverComments} onChange={handleChange} multiline rows={2} fullWidth
          error={approverCommentsError.length > 0} helperText={approverCommentsError}
        />
        <TextField variant="outlined" label="Organizer Status" value={organizerStatus} onChange={handleSelectChange} select fullWidth
          error={organizerStatusError.length > 0} helperText={organizerStatusError}
        >
          {allOrganizerStatus.map(orgStatus => (
            <MenuItem key={orgStatus.lookupKey} value={orgStatus.lookupKey}>{orgStatus.lookupValue}</MenuItem>
          ))}
        </TextField>
        <Button className={classes.button} color="secondary" onClick={handleUpdate}>
          Update
        </Button>
        {error && <ErrorLabel>Unable to update organizer status - {error}</ErrorLabel>}
      </div>
    </PageContainer>
  );
};

export default OrganizerIndex;
