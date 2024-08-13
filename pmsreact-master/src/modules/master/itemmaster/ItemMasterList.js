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
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";

import Helper from "../../helper/helper";
import MasterData from "../../helper/masterdata";
import EnhancedTableHead from "../../../elements/ui/EnhancedTableHead/EnhancedTableHead";
import AuthService from "../../../service/AuthService";
import cssClasses from "../master.module.css";

const headCells = [
  {
    id: "itemName",
    numeric: false,
    disablePadding: false,
    label: "Item Name",
  },
  {
    id: "itemCode",
    numeric: false,
    disablePadding: false,
    label: "Item Code",
  },
  {
    id: "itemType",
    numeric: false,
    disablePadding: false,
    label: "Type",
  },
  {
    id: "retailPrice",
    numeric: true,
    disablePadding: false,
    label: "Price (" + AuthService.getLoggedInCompanyCurrencyCode() + ")",
  },
  /*  {
    id: "totalStock",
    numeric: false,
    disablePadding: false,
    label: "Total Stock",
  }, */
  {
    id: "avaialableStock",
    numeric: false,
    disablePadding: false,
    label: "Available Stock",
  },
  /*  {
    id: "expiredStock",
    numeric: false,
    disablePadding: false,
    label: "Expired Stock",
  }, */
  {
    id: "reorderLevel",
    numeric: false,
    disablePadding: false,
    label: "Reorder Level",
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

export default function ItemMasterList(props) {
  const classes = useStyles();
  let history = useHistory();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemName");
  const [page, setPage] = useState(0);
  const { stockingUnitList } = props;

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
    Math.min(rowsPerPage, props.dataList.length - page * rowsPerPage);

  const editDetail = (id) => {
    history.push(props.editLink + id);
  };

  const handleAction = (id, action) => {
    switch (action) {
      case "E":
        history.push(props.editLink + id);
        break;
      case "A":
        history.push("/item/addstock/" + id);
        break;
      case "C":
        history.push("/item/consume/" + id);
        break;
      default:
        break;
    }
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
                        width="20%"
                      >
                        {row.itemName}
                      </TableCell>
                      <TableCell width="15%">{row.itemCode}</TableCell>
                      <TableCell width="10%">
                        {row.itemTypeDesc}
                        {/*  {MasterData.getLookupValueFromKey(
                          row.itemType,
                          MasterData.lookupTypes.ItemTypes
                        )} */}
                      </TableCell>
                      <TableCell align="right" width="15%">
                        {Helper.getFormattedNumber(row.retailPrice)}
                      </TableCell>

                      <TableCell width="15%">
                        <span className={cssClasses.RightMargin5}>
                          {row.avaialableStock}
                        </span>
                        <span>
                          {MasterData.getValueFromLookupList(
                            stockingUnitList,
                            row.stockingUnit
                          )}
                        </span>
                      </TableCell>
                      {/* <TableCell width="30%">{row.expiredStock}</TableCell> */}
                      <TableCell width="15%">{row.reorderLevel}</TableCell>

                      <TableCell width="10%">
                        <Tooltip title="Edit Item Details">
                          <IconButton
                            aria-label="Edit"
                            size="small"
                            onClick={() => handleAction(row.id, "E")}
                          >
                            <EditIcon size="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Add Stock">
                          <IconButton
                            aria-label="Edit"
                            size="small"
                            onClick={() => handleAction(row.id, "A")}
                          >
                            <AddCircleOutlineIcon size="small" />
                          </IconButton>
                        </Tooltip>
                        {row.avaialableStock > 0 ? (
                          <Tooltip title="Consume Stock">
                            <IconButton
                              aria-label="Edit"
                              size="small"
                              onClick={() => handleAction(row.id, "C")}
                            >
                              <RemoveCircleOutlineIcon size="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          ""
                        )}
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
          rowsPerPageOptions={[10, 25, 50, 100]}
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
