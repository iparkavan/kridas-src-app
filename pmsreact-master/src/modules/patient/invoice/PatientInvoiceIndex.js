import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";

import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

import PatientService from "../../../service/PatientService";
import AuthService from "../../../service/AuthService";
import Helper from "../../helper/helper";
import MasterData from "../../helper/masterdata";
import cssClass from "../patient.module.css";
import InvoiceSummary from "./InvoiceSummary";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import NotificationDialog from "../../../elements/ui/Dialog/NotificationDialog";
import * as moment from "moment";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default function PatientInvoiceIndex(props) {
  const classes = useStyles();
  let history = useHistory();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("invoiceDate");
  const [page, setPage] = useState(0);
  const [invoiceList, setInvoiceList] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isInvoicesLoading, setIsInvoicesLoading] = useState(true);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedInvoiceForCancel, setSelectedInvoiceForCancel] = useState({});
  const [openCancelDoneDialog, setOpenCancelDoneDialog] = useState(false);
  const [cancellationDate, setCancellationDate] = useState(
    Helper.getFormattedDate(moment().format("L"), "YYYY-MM-DD")
  );
  const [cancellationDateError, setCancellationDateError] = useState("");
  const { patientId } = props;

  useEffect(() => {
    if (isInvoicesLoading) {
      getPatientInvoicesByPatientId(patientId);
    }
  }, [isInvoicesLoading, patientId]);

  const getPatientInvoicesByPatientId = (id) => {
    PatientService.fetchPatientInvoicesByPatientId(id)
      .then((response) => {
        const resultArray = Array.isArray(response.data) ? response.data : [];
        setInvoiceList(resultArray);
      })
      .finally(() => {
        setIsInvoicesLoading(false);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, invoiceList.length - page * rowsPerPage);

  const addPatientInvoice = () => {
    history.push("/patient/invoice/add/" + patientId);
  };

  const editPatientInvoice = (id) => {
    history.push("/patient/invoice/edit/" + patientId + "/" + id);
  };

  const payInvoice = (id) => {
    history.push("/patient/payment/add/" + patientId + "/" + id);
  };

  const invoiceMenuHandler = (action, inv) => {
    switch (action) {
      case MasterData.invoiceMenuActions.cancel:
        cancelPatientInvoice(inv);
        break;
      case MasterData.invoiceMenuActions.print:
        getInvoiceReport(inv);
        break;
      case MasterData.invoiceMenuActions.edit:
        editPatientInvoice(inv.id);
        break;
      case MasterData.invoiceMenuActions.pay:
        payInvoice(inv.id);
        break;
      default:
        break;
    }
  };

  const getInvoiceReport = (inv) => {
    PatientService.fetchInvoiceReportById(inv.id).then((response) => {
      //Create a Blob from the PDF Stream
      const file = new Blob([response.data], { type: "application/pdf" });
      //Build a URL from the file
      const fileURL = URL.createObjectURL(file);
      //Open the URL on new Window
      window.open(fileURL);
    });
  };

  //Cancel Invoice Reference
  const cancelPatientInvoice = (inv) => {
    setSelectedInvoiceForCancel(inv);
    setOpenCancelDialog(true);
  };

  const HandleCancelInvoice = () => {
    const cancellationObject = {
      companyId: selectedInvoiceForCancel.companyId,
      patientId: selectedInvoiceForCancel.patientId,
      totalAmount: selectedInvoiceForCancel.totalAmount,
      isCancelled: "YS",
      cancelledDate: moment(cancellationDate, "YYYY-MM-DD HH:mm"),
      id: selectedInvoiceForCancel.id,
      loginId: AuthService.getLoggedInUserId(),
    };

    //Call the update invoice to set the invoice as cancelled
    PatientService.updatePatientInvoice(cancellationObject)
      .then((response) => {
        setOpenCancelDialog(false);
        setOpenCancelDoneDialog(true);
      })
      .catch((ex) => console.log(ex));
  };

  const handleClose = (event, reason) => {
    setOpenCancelDoneDialog(false);
    setIsInvoicesLoading(true);
  };

  const handleCancelClose = () => {
    setOpenCancelDialog(false);
  };

  const handleDateChange = (date) => {
    if (date === null || date.length === 0) {
      setCancellationDateError("Please select Cancellation Date");
    }
    setCancellationDate(date);
  };

  const handleDateError = (error, date) => {
    if (date !== null && error !== cancellationDateError) {
      setCancellationDateError(error);
    }
  };

  return !isInvoicesLoading ? (
    <div className={classes.root}>
      <div className={`${cssClass.RightAlign} ${cssClass.BottomMargin5}`}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={addPatientInvoice}
          startIcon={<AddIcon />}
        >
          Add Invoice
        </Button>
      </div>
      <Paper className={classes.paper}>
        <TableContainer style={{ backgroundColor: "#f0f0f0" }}>
          <Table
            className={classes.table}
            aria-labelledby="tableInvoices"
            size={"small"}
            aria-label="Patient Invoice Table"
          >
            <TableBody>
              {invoiceList.length > 0 ? (
                Helper.stableSort(
                  invoiceList,
                  Helper.getComparator(order, orderBy)
                )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={index}
                        style={{ marginBotton: "10px" }}
                      >
                        <TableCell component="th" id={index} scope="row">
                          <InvoiceSummary
                            invoiceSummary={row}
                            invoiceMenuHandler={invoiceMenuHandler}
                          ></InvoiceSummary>
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell align="center">No data available!!!</TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={4} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25]}
          component="div"
          count={invoiceList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog
        open={openCancelDialog}
        onClose={handleCancelClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Invoice Cancellation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedInvoiceForCancel.paidAmount === null ||
            selectedInvoiceForCancel.paidAmount === 0
              ? "Are you sure you want to cancel the selected invoice? If so, select the cancellation date below:"
              : "There is a payment associated for this invoice. Please cancel the payment before cancelling the invoice."}
          </DialogContentText>
          <div>
            {selectedInvoiceForCancel.paidAmount === null ||
            selectedInvoiceForCancel.paidAmount === 0 ? (
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableFuture
                  fullWidth
                  label={"Cancellation Date *"}
                  invalidDateMessage={
                    "Enter date in format " +
                    Helper.getInputDateFormat().toLowerCase()
                  }
                  maxDateMessage={"Date should not be in future"}
                  minDateMessage={
                    "Date should not be before minimal date (01-01-1900)"
                  }
                  id="cancellationDate"
                  name="cancellationDate"
                  value={cancellationDate}
                  onChange={(date) => handleDateChange(date)}
                  format={Helper.getInputDateFormat()}
                  onError={handleDateError}
                  helperText={
                    cancellationDateError.length > 0
                      ? cancellationDateError
                      : Helper.getInputDateFormat().toLowerCase()
                  }
                  error={cancellationDateError.length > 0 ? true : false}
                />
              </MuiPickersUtilsProvider>
            ) : (
              ""
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose} color="primary">
            Close
          </Button>
          {selectedInvoiceForCancel.paidAmount === null ||
          selectedInvoiceForCancel.paidAmount === 0 ? (
            <Button
              onClick={HandleCancelInvoice}
              color="primary"
              disabled={cancellationDateError.length > 0 ? true : false}
            >
              Cancel Invoice
            </Button>
          ) : (
            ""
          )}
        </DialogActions>
      </Dialog>
      <NotificationDialog
        open={openCancelDoneDialog}
        handleClose={handleClose}
        title="Invoices"
      >
        <span>Invoice cancelled successfully !!!</span>
      </NotificationDialog>
    </div>
  ) : (
    "Loading..."
  );
}
