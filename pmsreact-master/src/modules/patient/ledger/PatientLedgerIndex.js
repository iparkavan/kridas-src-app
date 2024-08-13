import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import AuthService from "../../../service/AuthService";
import PatientService from "../../../service/PatientService";

import Helper from "../../helper/helper";

import cssClass from "../patient.module.css";
import EnhancedTableHead from "../../../elements/ui/EnhancedTableHead/EnhancedTableHead";

const headCells = [
  {
    id: "ledgerDate",
    numeric: false,
    disablePadding: false,
    label: "Ledger Date",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Invoice No / Payment No",
  },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "Type",
  },
  {
    id: "ledgerDetail",
    numeric: false,
    disablePadding: false,
    label: "Details",
  },
  {
    id: "creditAmount",
    numeric: true,
    disablePadding: false,
    label:
      "Credit Amount (" +
      `${AuthService.getLoggedInCompanyCurrencyCode()}` +
      ")",
  },
  {
    id: "debitAmount",
    numeric: true,
    disablePadding: false,
    label:
      "Debit Amount (" +
      `${AuthService.getLoggedInCompanyCurrencyCode()}` +
      ")",
  },
  {
    id: "balanceAmount",
    numeric: true,
    disablePadding: false,
    label:
      "Balance Amount (" +
      `${AuthService.getLoggedInCompanyCurrencyCode()}` +
      ")",
  },
];

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

export default function PatientLedgerIndex(props) {
  const classes = useStyles();
  let history = useHistory();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("ledgerDate");
  const [page, setPage] = useState(0);
  const [ledgerList, setLedgerList] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [isLedgerLoading, setIsLedgerLoading] = useState(true);
  const { patientId } = props;

  useEffect(() => {
    if (isLedgerLoading) {
      getPatientLedgerByPatientId(patientId);
    }
  }, [isLedgerLoading, patientId]);

  const getPatientLedgerByPatientId = (id) => {
    PatientService.fetchPatientLedgerByPatientId(id)
      .then((response) => {
        const resultArray = Array.isArray(response.data) ? response.data : [];
        setLedgerList(resultArray);
      })
      .finally(() => {
        setIsLedgerLoading(false);
      });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, ledgerList.length - page * rowsPerPage);

  return !isLedgerLoading ? (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"small"}
            aria-label="enhanced table"
          >
            {/*  <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              //onRequestSort={handleRequestSort}
              rowCount={ledgerList.length}
              headCells={headCells}
            /> */}
            <TableHead>
              <TableRow>
                <TableCell>Ledger Date</TableCell>
                <TableCell>Invoice No / Payment No</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Details</TableCell>
                <TableCell align="right">
                  {"Credit Amount (" +
                    `${AuthService.getLoggedInCompanyCurrencyCode()}` +
                    ")"}
                </TableCell>
                <TableCell align="right">
                  {"Debit Amount (" +
                    `${AuthService.getLoggedInCompanyCurrencyCode()}` +
                    ")"}
                </TableCell>
                <TableCell align="right">
                  {"Balance Amount (" +
                    `${AuthService.getLoggedInCompanyCurrencyCode()}` +
                    ")"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ledgerList.length > 0 ? (
                Helper.stableSort(
                  ledgerList,
                  Helper.getComparator(order, orderBy)
                )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow hover tabIndex={-1} key={index}>
                        <TableCell>
                          {/*  {Helper.getFormattedDate(
                            Helper.getDateTimeFromUTC(row.ledgerDate),
                            "ll"
                          )} */}
                          {Helper.getDateTimeFromUTC(row.ledgerDate, "ll")}
                        </TableCell>
                        <TableCell>
                          {row.invoiceId !== null
                            ? row.invoiceNo
                            : row.paymentNo}
                        </TableCell>
                        <TableCell>
                          {row.invoiceId !== null ? "Invoice" : "Payment"}
                        </TableCell>
                        <TableCell>{row.ledgerDetail}</TableCell>
                        <TableCell align="right">
                          {Helper.getFormattedNumber(row.creditAmount)}
                        </TableCell>
                        <TableCell align="right">
                          {Helper.getFormattedNumber(row.debitAmount)}
                        </TableCell>
                        <TableCell align="right">
                          {Helper.getFormattedNumber(row.balanceAmount)}
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell align="center" colspan="6">
                    No data available!!!
                  </TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[50, 100]}
          component="div"
          count={ledgerList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  ) : (
    "Loading..."
  );
}
