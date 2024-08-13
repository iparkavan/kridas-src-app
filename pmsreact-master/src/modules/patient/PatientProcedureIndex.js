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

import PatientService from "../../service/PatientService";
import Helper from "../helper/helper";
import cssClass from "./patient.module.css";
import CompletedProcedureSummary from "./CompletedProcedureSummary";

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

export default function PatientProcedureIndex(props) {
  const classes = useStyles();
  let history = useHistory();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("treatmentDate");
  const [page, setPage] = useState(0);
  const [notesList, setNotesList] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isProcedureLoading, setIsProcedureLoading] = useState(true);
  const { patientId } = props;

  useEffect(() => {
    if (isProcedureLoading) {
      getPatientProceduresByPatientId(patientId);
    }
  }, [isProcedureLoading, patientId]);

  const getPatientProceduresByPatientId = (id) => {
    PatientService.fetchPatientProceduresByPatientId(id)
      .then((response) => {
        const resultArray = Array.isArray(response.data) ? response.data : [];
        setNotesList(resultArray);
      })
      .finally(() => {
        setIsProcedureLoading(false);
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
    rowsPerPage - Math.min(rowsPerPage, notesList.length - page * rowsPerPage);

  const addPatientProcedure = () => {
    history.push("/patient/procedure/add/" + patientId);
  };

  const editPatientProcedure = (id) => {
    history.push("/patient/procedure/edit/" + patientId + "/" + id);
  };

  return isProcedureLoading === false ? (
    <div className={classes.root}>
      <div className={`${cssClass.RightAlign} ${cssClass.BottomMargin5}`}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={addPatientProcedure}
          startIcon={<AddIcon />}
        >
          Add Completed Procedures
        </Button>
      </div>
      <Paper className={classes.paper}>
        <TableContainer style={{ backgroundColor: "#f0f0f0" }}>
          <Table
            className={classes.table}
            aria-labelledby="tableNotes"
            size={"small"}
            aria-label="Patient Notes Table"
          >
            <TableBody>
              {notesList.length > 0 ? (
                Helper.stableSort(
                  notesList,
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
                          <CompletedProcedureSummary
                            procedureSummary={row}
                            editFunctionReference={editPatientProcedure}
                          ></CompletedProcedureSummary>
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
          count={notesList.length}
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
