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
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import Helper from "../../helper/helper";
import EnhancedTableHead from "../../../elements/ui/EnhancedTableHead/EnhancedTableHead";
import AuthService from "../../../service/AuthService";

const headCells = [
  {
    id: "procedureName",
    numeric: false,
    disablePadding: false,
    label: "Procedure Name",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Price (" + AuthService.getLoggedInCompanyCurrencyCode() + ")",
  },
  {
    id: "procedureNotes",
    numeric: false,
    disablePadding: false,
    label: "Procedure Notes",
  },
  { id: "taxName", numeric: false, disablePadding: false, label: "Tax" },
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

export default function ProcedureList(props) {
  const classes = useStyles();
  let history = useHistory();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("procedureName");
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    Math.min(rowsPerPage, props.dataList.length - page * rowsPerPage);

  const editDetail = (id) => {
    history.push(props.editLink + id);
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
              rowCount={props.dataList.length}
              headCells={headCells}
            />
            <TableBody>
              {Helper.stableSort(
                props.dataList,
                Helper.getComparator(order, orderBy)
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell
                        component="th"
                        id={index}
                        scope="row"
                        width="25%"
                      >
                        {row.procedureName}
                      </TableCell>
                      <TableCell align="right" width="15%">
                        {Helper.getFormattedNumber(row.price)}
                      </TableCell>
                      <TableCell width="30%">{row.procedureNotes}</TableCell>

                      <TableCell width="20%">
                        {row.taxId !== null ? row.taxDTO.taxName : ""}
                      </TableCell>

                      <TableCell width="10%">
                        <Tooltip title="Edit Procedure Details">
                          <IconButton
                            aria-label="Edit"
                            size="small"
                            onClick={() => editDetail(row.id)}
                          >
                            <EditIcon size="small" />
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
          rowsPerPageOptions={[10, 25]}
          component="div"
          count={props.dataList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
