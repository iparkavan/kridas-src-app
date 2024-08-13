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
import AuthService from "../../service/AuthService";
import PatientService from "../../service/PatientService";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

import MasterData from "../helper/masterdata";
import Helper from "../helper/helper";

import cssClass from "./patient.module.css";
import EnhancedTableHead from "../../elements/ui/EnhancedTableHead/EnhancedTableHead";

const headCells = [
  {
    id: "appointmentStarttime",
    numeric: false,
    disablePadding: false,
    label: "Appointment Date & Time",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Doctor Name",
  },
  {
    id: "notes",
    numeric: false,
    disablePadding: false,
    label: "Appointment Notes",
  },

  { id: "status", numeric: false, disablePadding: false, label: "Status" },
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

export default function PatientAppointent(props) {
  const classes = useStyles();
  let history = useHistory();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("appointmentStarttime");
  const [page, setPage] = useState(0);
  const [appointmentList, setAppointmentList] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAppointmentsLoading, setIsAppointmentsLoading] = useState(true);
  const { patientId } = props;

  useEffect(() => {
    if (isAppointmentsLoading) {
      getAppointmentsByPatientId(patientId);
    }
  }, [isAppointmentsLoading, patientId]);

  const getAppointmentsByPatientId = (id) => {
    const formObject = {
      companyId: AuthService.getUserInfo().companyDTO.id,
      startDate: null,
      endDate: null,
      userId: null,
      patientId: id,
    };

    PatientService.fetchAppointmentsByPatientId(formObject)
      .then((response) => {
        const resultArray = Array.isArray(response.data) ? response.data : [];
        setAppointmentList(resultArray);
      })
      .finally(() => setIsAppointmentsLoading(false));
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
    rowsPerPage -
    Math.min(rowsPerPage, appointmentList.length - page * rowsPerPage);

  const handleAddAppointment = () => {
    history.push("/dash-admin");
  };

  return isAppointmentsLoading === false ? (
    <div className={classes.root}>
      <div className={`${cssClass.RightAlign} ${cssClass.BottomMargin5}`}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAddAppointment}
        >
          Add Appointment
        </Button>
      </div>
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
              rowCount={appointmentList.length}
              headCells={headCells}
            />
            <TableBody>
              {appointmentList.length > 0 ? (
                Helper.stableSort(
                  appointmentList,
                  Helper.getComparator(order, orderBy)
                )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow hover tabIndex={-1} key={index}>
                        <TableCell>
                          {/*  {Helper.getFormattedDate(
                            Helper.getDateTimeFromUTC(row.appointmentStarttime),
                            Helper.getDateTimeFormat()
                          )} */}
                          {Helper.getDateTimeFromUTC(
                            row.appointmentStarttime,
                            Helper.getDateTimeFormat()
                          )}
                        </TableCell>
                        <TableCell component="th" id={index} scope="row">
                          <span className={cssClass.RightMargin5}>
                            {row.user.firstName}
                          </span>
                          <span className={cssClass.RightMargin5}>
                            {row.user.lastName}
                          </span>
                        </TableCell>
                        <TableCell>{row.appointmentNotes}</TableCell>

                        <TableCell>
                          {row.checkoutTime !== null
                            ? "Completed"
                            : MasterData.getLookupValueFromKey(
                                row.appointmentStatus,
                                MasterData.lookupTypes.AppointmentStatus
                              )}
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No data available!!!
                  </TableCell>
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
          count={appointmentList.length}
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
