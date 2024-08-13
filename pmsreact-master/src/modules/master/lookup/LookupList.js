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
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import AuthService from "../../../service/AuthService";
import MasterData from "../../helper/masterdata";
import Helper from "../../helper/helper";

import cssClass from "../master.module.css";
import EnhancedTableHead from "../../../elements/ui/EnhancedTableHead/EnhancedTableHead";
import AutoCompleteSelect from "../../../elements/ui/AutoComplete/AutoCompleteSelect";
import LookupAddDialog from "./LookupAddDialog";

const headCells = [
  {
    id: "lookupKey",
    numeric: false,
    disablePadding: false,
    label: "Key",
  },

  {
    id: "lookupValue",
    numeric: false,
    disablePadding: false,
    label: "Value",
  },
  {
    id: "lookupTypeDesc",
    numeric: false,
    disablePadding: false,
    label: "Type",
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
    marginTop: "10px",
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
  button: {
    marginTop: "25px",
  },
  loadingMessage: {
    marginTop: "28px",
  },
}));

export default function LookupList(props) {
  const classes = useStyles();
  let history = useHistory();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("lookupValue");
  const [page, setPage] = useState(0);
  const [lookupList, setLookupList] = useState([]);
  const [selectedLookupType, setSelectedLookupType] = useState("");

  const [addLookup, setAddLookup] = useState(false);
  const [mode, setMode] = useState(MasterData.pageMode.Add);
  const [returnObject, setReturnObject] = useState({});
  const [editItem, setEditItem] = useState({});

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLookupListLoading, setIsLookupListLoading] = useState(false);

  const onChangeNameValue = (name, value) => {
    setSelectedLookupType(value === null ? "" : value);
  };

  useEffect(() => {
    if (selectedLookupType.length > 0) {
      getDataBasedOnType(selectedLookupType);
    } else {
      setLookupList([]);
    }
  }, [selectedLookupType]);

  const getDataBasedOnType = (type) => {
    setIsLookupListLoading(true);
    MasterData.getLookupList(
      AuthService.getLoggedInUserCompanyId(),
      type,
      (res) => {
        setLookupList(Array.isArray(res.data) ? res.data : []);
        setIsLookupListLoading(false);
      },
      () => {}
    );
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
    rowsPerPage - Math.min(rowsPerPage, lookupList.length - page * rowsPerPage);

  const handleAddLookup = () => {
    setMode(MasterData.pageMode.Add);
    setAddLookup(true);
  };

  const handleAction = (row, action) => {
    setEditItem(row);
    setMode(MasterData.pageMode.Edit);
    setAddLookup(true);
  };

  const handleLookupDialogClose = () => {
    setEditItem({});
    setAddLookup(false);
  };

  const handlePostLookupSave = (returnValue) => {
    handleLookupDialogClose();
    setReturnObject(returnValue);

    getDataBasedOnType(selectedLookupType);
  };

  const getLookupDialogProps = (lookupType) => {
    return {
      open: addLookup,
      close: handleLookupDialogClose,
      postSave: handlePostLookupSave,
      companyId: AuthService.getLoggedInUserCompanyId(),
      lookupType: lookupType,
      mode: mode,
      editItem: editItem,
    };
  };

  return (
    <div className={classes.root}>
      <div className={cssClass.ThreeColumnGrid}>
        <div>
          <AutoCompleteSelect
            fullWidth
            data={MasterData.settingLookupListArr}
            label="Select Type *"
            id="lookupType"
            name="lookupType"
            keyValue="lookupType"
            keyLabel="lookupTypeDesc"
            initialValue={selectedLookupType}
            callbackFunction={onChangeNameValue}
          ></AutoCompleteSelect>
        </div>
        <div className={classes.loadingMessage}>
          <span style={{ color: "green" }}>
            {isLookupListLoading ? "Loading..." : ""}
          </span>
        </div>

        <div className={cssClass.RightAlign}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddLookup}
            className={classes.button}
            disabled={selectedLookupType.length === 0 ? true : false}
          >
            Add
          </Button>
        </div>
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
              rowCount={lookupList.length}
              headCells={headCells}
            />
            <TableBody>
              {lookupList.length > 0 ? (
                Helper.stableSort(
                  lookupList,
                  Helper.getComparator(order, orderBy)
                )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow hover tabIndex={-1} key={index}>
                        <TableCell component="th" id={index} scope="row">
                          {row.lookupKey}
                        </TableCell>
                        <TableCell> {row.lookupValue}</TableCell>
                        <TableCell>{row.lookupTypeDesc}</TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              aria-label="Edit"
                              size="small"
                              onClick={() => handleAction(row, "E")}
                            >
                              <EditIcon style={{ fontSize: "medium" }} />
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
          count={lookupList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      {selectedLookupType.length > 0 ? (
        <LookupAddDialog
          {...getLookupDialogProps(selectedLookupType)}
        ></LookupAddDialog>
      ) : (
        ""
      )}
    </div>
  );
}
