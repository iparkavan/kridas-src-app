import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";

const FileStatusDialog = (props) => {
  const { stages, fileStatusOpen, handleFileStatusClose } = props;

  const stageStatuses = {
    C: "Completed",
    F: "Failed",
    NP: "Not Processed",
  };

  const stagesArr = [
    { stageCode: "S1", stageName: "Data Extraction" },
    { stageCode: "S2", stageName: "Patient Demographics" },
    { stageCode: "S3", stageName: "Patient Notes" },
    { stageCode: "S4", stageName: "Patient Problems" },
    { stageCode: "S5", stageName: "Patient Allergy" },
  ];

  return (
    <Dialog
      fullWidth={true}
      maxWidth="sm"
      onClose={handleFileStatusClose}
      open={fileStatusOpen}
    >
      <DialogTitle>Status</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          {stagesArr.map((stage) => {
            const currentStage = stages.find(
              (s) => s.stage_code === stage.stageCode
            );

            let severity, isError, stageStatus;
            if (currentStage) {
              severity =
                currentStage.stage_status === "C" ? "success" : "error";
              isError =
                currentStage.stage_status === "F" &&
                Boolean(currentStage.stage_error);
              stageStatus = stageStatuses[currentStage.stage_status];
            } else {
              severity = "error";
              isError = false;
              stageStatus = stageStatuses.NP;
            }

            return (
              <Alert severity={severity}>
                <AlertTitle>
                  {stage.stageName} - {stageStatus}
                </AlertTitle>
                {isError && currentStage.stage_error}
              </Alert>
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleFileStatusClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileStatusDialog;
