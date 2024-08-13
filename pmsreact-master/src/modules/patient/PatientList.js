import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import VisibilityIcon from "@material-ui/icons/Visibility";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import Helper from "../helper/helper";
import EnhancedTableHead from "../../elements/ui/EnhancedTableHead/EnhancedTableHead";

const headCells = [
  { id: "id", numeric: false, disablePadding: false, label: "Patient Id" },
  {
    id: "patientName",
    numeric: false,
    disablePadding: false,
    label: "Patient Name",
  },
  { id: "gender", numeric: false, disablePadding: false, label: "Gender" },
  { id: "dob", numeric: false, disablePadding: false, label: "DOB" },
  { id: "mobileNo", numeric: false, disablePadding: false, label: "Mobile" },
  {
    id: "createdDate",
    numeric: false,
    disablePadding: false,
    label: "Patient Since",
  },
  {
    id: "lastVisitDate",
    numeric: false,
    disablePadding: false,
    label: "Last Visit",
  },
  { id: "action", numeric: false, disablePadding: false, label: "Action" },
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

export default function PatientList(props) {
  const classes = useStyles();
  let history = useHistory();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("patientName");
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(100);

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
    rowsPerPage -
    Math.min(rowsPerPage, props.patientList.length - page * rowsPerPage);

  const viewPatientDetail = (id) => {
    history.push(props.viewLink + id);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"small"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={props.patientList.length}
              headCells={headCells}
            />
            <TableBody>
              {Helper.stableSort(
                props.patientList,
                Helper.getComparator(order, orderBy)
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell component="th" id={index} scope="row">
                        {row.patientName}
                      </TableCell>
                      <TableCell>{Helper.getGenderName(row.gender)}</TableCell>
                      <TableCell>
                        {Helper.getFormattedDate(row.dob, "ll")}
                      </TableCell>
                      <TableCell>{row.mobileNo}</TableCell>
                      <TableCell>
                        {/* {Helper.getFormattedDate(
                          Helper.getDateTimeFromUTC(row.createdDate),
                          "ll"
                        )} */}
                        {Helper.getDateTimeFromUTC(row.createdDate, "ll")}
                      </TableCell>
                      <TableCell>
                        {/*  {Helper.getFormattedDate(
                          Helper.getDateTimeFromUTC(row.lastVisitDate),
                          "ll"
                        )} */}
                        {Helper.getDateTimeFromUTC(row.lastVisitDate, "ll")}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Patient Details">
                          <IconButton
                            aria-label="View"
                            size="small"
                            onClick={() => viewPatientDetail(row.id)}
                          >
                            <VisibilityIcon size="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={props.patientList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
