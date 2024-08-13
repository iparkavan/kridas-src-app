import { useEffect, useState } from "react";
import useHttp from "../../../../hooks/useHttp";
import { makeStyles } from "@material-ui/core/styles";
import PageContainer from "../../../common/layout/components/PageContainer";
import MUIDataTable from "mui-datatables";
import IconButton from "@material-ui/core/IconButton";
import Button from "../../../common/ui/components/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useHistory } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import sportslistConfig from "../../../master/sports/config/SportsConfig";
import ConfirmationDialog from "../../../common/ui/components/ConfirmDialog";

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    textAlign: "right",
    paddingBottom: "2%",
  },
  iconSpace: {
    width: "35px",
  },
}));

const SportsIndex = (props) => {
  const history = useHistory();
  const [sportList, setSportList] = useState([]);
  const { isLoading, sendRequest } = useHttp();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [sportsId, setSportsId] = useState(0);
  const [reload, setReload] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("Deleted Successfully");
  const [, setState] = useState({});
  const [page, setPage] = useState(
    localStorage.getItem("page") === null ? 0 : localStorage.getItem("page")
  );
  const [row, setRow] = useState(
    localStorage.getItem("row") === null ? 10 : localStorage.getItem("row")
  );

  function handleTableChange(action, tableState) {
    setPage(tableState.page);
    localStorage.setItem("page", tableState.page);
    setRow(tableState.rowsPerPage);
    localStorage.setItem("row", tableState.rowsPerPage);
    // localStorage.setItem("sport", JSON.stringify(defaultSports))
  }
  const columns = [
    {
      name: "sports_name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "sports_desc",
      label: "Desc",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              {value.length < 15 ? `${value}` : `${value.substring(0, 32)}...`}
            </>
          );
        },
      },
    },

    {
      name: "sports_id",
      label: "Sports Id",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "sports_code",
      label: "Sports Code",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "Options",
      options: {
        sort: false,
        filter: false,
        searchable: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              <div>
                <Tooltip title="Edit" className={classes.iconSpace}>
                  <IconButton
                    aria-label="Edit"
                    size="small"
                    onClick={() => editRowHandler(tableMeta.rowData, "E")}
                  >
                    <EditIcon style={{ fontSize: "medium" }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View" className={classes.iconSpace}>
                  <IconButton
                    aria-label="View"
                    size="small"
                    onClick={() => viewRowHandler(tableMeta.rowData)}
                  >
                    <VisibilityIcon style={{ fontSize: "medium" }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete" className={classes.iconSpace}>
                  <IconButton
                    aria-label="Delete"
                    size="small"
                    onClick={() => DeleteRowHandler(tableMeta.rowData)}
                  >
                    <DeleteIcon style={{ fontSize: "medium" }} />
                  </IconButton>
                </Tooltip>
              </div>
            </>
          );
        },
      },
    },
  ];

  const options = {
    elevation: 2,
    filter: true,
    search: true,
    print: false,
    download: false,
    viewColumns: false,
    selectableRows: "none",
    fixedSelectColumn: true,
    rowsPerPage: row,
    page: page,
    textLabels: {
      body: {
        noMatch: isLoading ? "Loading..." : "Sorry , No Matching Records Found",
      },
    },
    setTableProps: () => {
      return {
        size: "small",
      };
    },
    onTableChange: handleTableChange,
  };

  useEffect(() => {
    const config = sportslistConfig.getAllSports();

    const transformDate = (data) => {
      setSportList(data);
    };
    sendRequest(config, transformDate);
    return () => {
      setState({});
    };
  }, [sendRequest, reload]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const viewRowHandler = (rowData, action) => {
    history.push(`/masters/sports/view/${rowData[2]}`);
  };

  const editRowHandler = (rowData) => {
    history.push(`/masters/sports/edit/${rowData[2]}`);
  };

  const DeleteRowHandler = (rowData, action) => {
    handleOpen();
    setSportsId(rowData[2]);
  };
  const ConfirmDelete = () => {
    const config = sportslistConfig.deleteSports(sportsId);
    const deleteTransform = (data) => {
      if (data?.errString?.detail.indexOf("still referenced from table") > 0) {
        setSnackMsg(
          "Unable to delete parent Sport. Please try to delete child sport."
        );
        setSnackOpen(true);
      } else if (
        data?.message ===
        "This Sport is referenced from sports_interested column in user Table"
      ) {
        setSnackMsg(
          "Unable to delete this Sport.Because This Sport is referenced from sports_interested column in user Table"
        );
        setSnackOpen(true);
      } else {
        setSnackMsg("Deleted Successfully");
        setSnackOpen(true);
        setReload(!reload);
      }
    };
    sendRequest(config, deleteTransform);
    handleClose();
  };

  return (
    <PageContainer heading="Sports">
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={() => history.push("/masters/sports/add")}
        >
          Add
        </Button>
      </div>

      <MUIDataTable data={sportList} columns={columns} options={options} />

      <ConfirmationDialog
        open={open}
        handleClose={handleClose}
        title="Delete Sports"
        children="Are you want to delete this sports?"
        handleConfirm={ConfirmDelete}
      />

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
      >
        <MuiAlert
          elevation={6}
          onClose={() => setSnackOpen(false)}
          variant="filled"
          severity="success"
        >
          {snackMsg}
        </MuiAlert>
      </Snackbar>
    </PageContainer>
  );
};

export default SportsIndex;
