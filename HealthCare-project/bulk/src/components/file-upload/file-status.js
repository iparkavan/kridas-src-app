import { useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Box, Button, IconButton, Stack } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";
import { ToastError } from "../../service/toast/Toast";
import { format } from "date-fns";
import Axios from "axios";
import FileStatusDialog from "./file-status-dialog";

const FileStatus = ({
  fromDate,
  handleFromDateChange,
  toDate,
  handleToDateChange,
  data,
  setData,
}) => {
  const [loading, setLoading] = useState();

  const [fileStatusOpen, setFileStatusOpen] = useState(false);
  const [stages, setStages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const formattedFromDate = format(fromDate, "yyyy-MM-dd hh:mm:aa");
      // const formattedToDate = format(toDate, "yyyy-MM-dd hh:mm:aa");
      const formattedFromDate = format(fromDate, "yyyy-MM-dd") + " 00:00:00";
      const formattedToDate = format(toDate, "yyyy-MM-dd") + " 23:59:59";

      setLoading(true);
      const res = await Axios.post(
        "https://xcgl2pp7e3.execute-api.us-east-2.amazonaws.com/dev/processedData",
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

  // const status = {
  //   P: "Processing",
  //   C: "Completed",
  //   F: "Failed",
  //   I: "Partially Completed",
  // };

  const columns = [
    { field: "no", headerName: "No", width: 150 },
    { field: "file_name", headerName: "File Name", width: 150 },
    {
      field: "stages",
      headerName: "Status",
      renderCell: (cell) => (
        <IconButton
          aria-label="View Status"
          size="medium"
          onClick={() => handleFileStatus(cell.value)}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      ),
      width: 100,
    },
    { field: "last_migration_on", headerName: "Last Migration On", width: 150 },
    { field: "created_on", headerName: "Created On", width: 170 },
    { field: "modified_on", headerName: "Modified On", width: 170 },
    { field: "modified_by", headerName: "Modified By", width: 150 },
  ];

  const rowsData = data?.processedList.map((list, i) => ({
    ...list,
    no: i + 1,
    id: list.file_process_id,
  }));

  const handleFileStatusClose = () => setFileStatusOpen(false);

  const handleFileStatus = (stages) => {
    setStages(JSON.parse(stages));
    setFileStatusOpen(true);
  };

  // const handleRowClick = (rowDetails) => {
  //   setProcessSummary(JSON.parse(rowDetails.row.process_summary));
  //   setProcessSummaryOpen(true);
  // };

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
        {loading && "Loading.."}
        {!loading && data && (
          <div style={{ height: 300, width: "100%", marginTop: "30px" }}>
            <DataGrid
              rows={rowsData}
              columns={columns}
              // onRowClick={handleRowClick}
            />
          </div>
        )}
      </Box>
      <FileStatusDialog
        stages={stages}
        fileStatusOpen={fileStatusOpen}
        handleFileStatusClose={handleFileStatusClose}
      />
    </Box>
  );
};

export default FileStatus;
