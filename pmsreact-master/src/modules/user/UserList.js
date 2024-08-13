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

import Helper from "../helper/helper";
import EnhancedTableHead from "../../elements/ui/EnhancedTableHead/EnhancedTableHead";
import MasterData from "../helper/masterdata";

const headCells = [
  {
    id: "firstName",
    numeric: false,
    disablePadding: false,
    label: "First Name",
  },
  {
    id: "lastName",
    numeric: false,
    disablePadding: false,
    label: "Last Name",
  },
  {
    id: "middleName",
    numeric: false,
    disablePadding: false,
    label: "Middle Name",
  },
  { id: "userEmail", numeric: false, disablePadding: false, label: "Email" },
  { id: "userPhone", numeric: false, disablePadding: false, label: "Phone" },
  { id: "userRoles", numeric: false, disablePadding: false, label: "Roles" },
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

export default function UserList(props) {
  const classes = useStyles();
  let history = useHistory();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("firstName");
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
    Math.min(rowsPerPage, props.userList.length - page * rowsPerPage);

  const viewDetail = (id) => {
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
              rowCount={props.userList.length}
              headCells={headCells}
            />
            <TableBody>
              {Helper.stableSort(
                props.userList,
                Helper.getComparator(order, orderBy)
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell component="th" id={index} scope="row">
                        {row.firstName}
                      </TableCell>
                      <TableCell>{row.lastName}</TableCell>
                      <TableCell>{row.middleName}</TableCell>
                      <TableCell>{row.userEmail}</TableCell>
                      <TableCell>{row.userPhone}</TableCell>
                      <TableCell>
                        {row.userRolesList.length > 0
                          ? MasterData.getRolesAsString(row.userRolesList)
                          : ""}
                      </TableCell>

                      <TableCell>
                        <Tooltip title="Edit User Details">
                          <IconButton
                            aria-label="View"
                            size="small"
                            onClick={() => viewDetail(row.id)}
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
          count={props.userList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
