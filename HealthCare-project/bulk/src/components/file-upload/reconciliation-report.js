import { useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Axios from "axios";
import { ToastError } from "../../service/toast/Toast";
import { format } from "date-fns";

const ReconciliationReport = ({
  fromDate,
  handleFromDateChange,
  toDate,
  handleToDateChange,
  data,
  setData,
}) => {
  const [loading, setLoading] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const formattedFromDate = format(fromDate, "yyyy-MM-dd hh:mm:aa");
      // const formattedToDate = format(toDate, "yyyy-MM-dd hh:mm:aa");
      const formattedFromDate = format(fromDate, "yyyy-MM-dd") + " 00:00:00";
      const formattedToDate = format(toDate, "yyyy-MM-dd") + " 23:59:59";

      setLoading(true);
      const res = await Axios.post(
        "https://xcgl2pp7e3.execute-api.us-east-2.amazonaws.com/dev/processSummary",
        {
          from_date: formattedFromDate,
          to_date: formattedToDate,
        }
      );
      setData(res.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      ToastError("Failed to load report");
    }
  };

  const statusArr = [
    { key: "C", value: "Completed" },
    { key: "F", value: "Failed" },
    { key: "NP", value: "Not Processed" },
  ];

  const stages = [
    { stageCode: "S1", stageName: "Data Extraction" },
    { stageCode: "S2", stageName: "Patient Demographics" },
    { stageCode: "S3", stageName: "Patient Notes" },
    { stageCode: "S4", stageName: "Patient Problems" },
    { stageCode: "S5", stageName: "Patient Allergy" },
  ];

  const isDataEmpty = data?.processedList?.length === 0;

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Stack direction="row" spacing={5}>
            <KeyboardDatePicker
              clearable
              label="From Date"
              value={fromDate}
              // placeholder="10/10/2018"
              inputVariant="outlined"
              onChange={(date) => handleFromDateChange(date)}
              format="dd/MM/yyyy"
              required
            />
            <KeyboardDatePicker
              clearable
              label="To Date"
              value={toDate}
              // placeholder="10/10/2018"
              inputVariant="outlined"
              onChange={(date) => handleToDateChange(date)}
              format="dd/MM/yyyy"
              required
            />
            <Button
              variant="contained"
              sx={{
                bgcolor: "#c72c35",
                "&:hover": {
                  bgcolor: "#c72c35",
                },
                textTransform: "capitalize",
              }}
              type="submit"
            >
              Search
            </Button>
          </Stack>
        </MuiPickersUtilsProvider>
      </form>
      <Box mt={4}>
        {loading
          ? "Loading.."
          : data &&
            (isDataEmpty ? (
              "No files were processed for the selected dates"
            ) : (
              <Box>
                <Typography fontWeight="bold">
                  Total Records: {data.totalProcessed}
                </Typography>

                {stages.map((stage) => {
                  const processedListForStage = data.processedList.filter(
                    ({ stage_code }) => stage_code === stage.stageCode
                  );

                  return (
                    <Box my={2}>
                      <Typography fontWeight="bold" mb={1}>
                        {stage.stageName}
                      </Typography>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 250 }}>
                          <TableHead>
                            <TableRow>
                              {statusArr.map(({ value }) => (
                                <TableCell>{value}</TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              {statusArr.map(({ key }) => {
                                let count;
                                if (key === "NP") {
                                  const processedCount =
                                    processedListForStage.reduce(
                                      (a, c) => a + c.status_count,
                                      0
                                    );
                                  count = data.totalProcessed - processedCount;
                                } else {
                                  const status = processedListForStage.find(
                                    ({ stage_status }) => stage_status === key
                                  );
                                  count = status?.status_count || 0;
                                }

                                return <TableCell>{count}</TableCell>;
                              })}
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  );
                })}
              </Box>
            ))}
      </Box>
    </Box>
  );
};

export default ReconciliationReport;
