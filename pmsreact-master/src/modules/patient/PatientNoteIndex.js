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
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import Button from "@material-ui/core/Button";

import PatientService from "../../service/PatientService";
import Helper from "../helper/helper";
import cssClass from "./patient.module.css";
import EnhancedTableHead from "../../elements/ui/EnhancedTableHead/EnhancedTableHead";

const headCells = [
  {
    id: "noteDate",
    numeric: false,
    disablePadding: false,
    label: "Notes Date",
  },
  {
    id: "noteCreatedBy",
    numeric: false,
    disablePadding: false,
    label: "Entered By",
  },
  {
    id: "clinicalNote",
    numeric: false,
    disablePadding: false,
    label: "Clinical Notes",
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

export default function PatientNoteIndex(props) {
  const classes = useStyles();
  let history = useHistory();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("noteDate");
  const [page, setPage] = useState(0);
  const [notesList, setNotesList] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isNotesLoading, setIsNotesLoading] = useState(true);
  const { patientId } = props;

  useEffect(() => {
    if (isNotesLoading) {
      getClininalNotesByPatientId(patientId);
    }
  }, [isNotesLoading, patientId]);

  const getClininalNotesByPatientId = (id) => {
    PatientService.fetchPatientClinicalNotes(id)
      .then((response) => {
        const resultArray = Array.isArray(response.data) ? response.data : [];
        setNotesList(resultArray);
      })
      .finally(() => {
        setIsNotesLoading(false);
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
    rowsPerPage - Math.min(rowsPerPage, notesList.length - page * rowsPerPage);

  const addPatientNote = () => {
    history.push("/patient/notes/add/" + patientId);
  };

  const editPatientNote = (id) => {
    history.push("/patient/notes/edit/" + patientId + "/" + id);
  };

  return isNotesLoading === false ? (
    <div className={classes.root}>
      <div className={`${cssClass.RightAlign} ${cssClass.BottomMargin5}`}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={addPatientNote}
        >
          + Add Clinical Note
        </Button>
      </div>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableNotes"
            size={"small"}
            aria-label="Patient Notes Table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={notesList.length}
              headCells={headCells}
            />
            <TableBody>
              {notesList.length > 0 ? (
                Helper.stableSort(
                  notesList,
                  Helper.getComparator(order, orderBy)
                )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow hover tabIndex={-1} key={index}>
                        <TableCell width="15%">
                          {/*  {Helper.getFormattedDate(
                            Helper.getDateTimeFromUTC(row.noteDate),
                            "ll"
                          )} */}
                          {Helper.getDateTimeFromUTC(row.noteDate, "ll")}
                        </TableCell>
                        <TableCell
                          component="th"
                          id={index}
                          scope="row"
                          width="15%"
                        >
                          {row.userName}
                        </TableCell>
                        <TableCell width="60%">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: row.clinicalNote,
                            }}
                          />
                        </TableCell>
                        <TableCell width="10%">
                          <Tooltip title="Edit">
                            <IconButton
                              aria-label="Edit"
                              size="small"
                              onClick={() => editPatientNote(row.id)}
                            >
                              <EditIcon size="small" />
                            </IconButton>
                          </Tooltip>
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
