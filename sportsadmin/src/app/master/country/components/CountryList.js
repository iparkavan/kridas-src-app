import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "../../../common/ui/components/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import useHttp from "../../../../hooks/useHttp";
import CountryTableConfig from "../config/CountryConfig";
import { useHistory } from 'react-router-dom';
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from '@material-ui/icons/Delete';
import CountryConfig from "../config/CountryConfig";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert'
import ConfirmationDialog from '../../../common/ui/components/ConfirmDialog'
const useStyles = makeStyles((theme) => ({
  error: {
    color: "red",
  },
  buttonContainer: {
    textAlign: "right",
    paddingBottom: "2%"
  },
  iconSpace: {
    width: "35px"
  },
  dialog: {
    padding: "20px"
  },
  dialogbtn: {
    paddingRight: "30px"
  },

}));


const CountryList = () => {
  let history = useHistory();
  const classes = useStyles();
  const { isLoading, error, sendRequest } = useHttp();
  const [countryList, setcountryList] = useState([]);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [id, setId] = useState(0);
  const [snackOpen, setSnackOpen] = useState(false);
  const [, setClear] = useState({});
  const columns = [
    {
      name: "country_name",
      label: "Name",
      options: {
        filters: true,
        sort: true,
      },
    },
    {
      name: "country_code",
      label: "Code",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "country_currency",
      label: " Currency",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "country_id",
      label: "CountryID",
      options: {
        filter: false,
        sort: false,
        display: false,
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

  useEffect(() => {
    const config = CountryTableConfig.getAllCountry();
    const transformDate = (data) => {
      setcountryList(data);
    };
    sendRequest(config, transformDate);
    return () => {
      setClear({});
    }
  }, [sendRequest, reload]);

  let errorContent = "";
  if (error !== null) {
    errorContent = (
      <p className={classes.error}>Error occurred while fetching data</p>
    );
  }
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const AddData = () => {
    history.push(`/master/country/add`);
  };
  const editRowHandler = (rowData, action) => {
    history.push(`/master/country/edit/${rowData[3]}`);
  };
  const viewRowHandler = (rowData, action) => {
    history.push(`/master/country/view/${rowData[3]}`);
  };
  const DeleteRowHandler = (rowData, action) => {
    handleOpen();
    setId(rowData[3]);
  }
  const ConfirmDelete = () => {
    const config = CountryConfig.deleteCountryById(id)
    const deleteTransform = () => {
      setReload(!reload);
    }
    sendRequest(config, deleteTransform);
    handleClose();
    setSnackOpen(true);
  }

  const options = {
    filter: true,
    search: true,
    print: false,
    download: false,
    viewColumns: false,
    selectableRows: "none",
    textLabels: {
      body: {
        noMatch: isLoading ? 'Loading...' : "Sorry , No Matching Records Found",
      }
    },
    setTableProps: () => {
      return {
        size: "small",
      };
    },
  };


  return (
    <>
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={AddData}
        >
          Add
        </Button>
      </div>
      <div>
        {errorContent}

        <MUIDataTable data={countryList} columns={columns} options={options} />

      </div>

      <ConfirmationDialog
        open={open}
        handleClose={handleClose}
        title="Delete Country"
        children="Are you want to delete this country?"
        handleConfirm={ConfirmDelete}
      />
      <Snackbar open={snackOpen}
        autoHideDuration={3000} onClose={() => setSnackOpen(false)}>
        <MuiAlert elevation={6} onClose={() => setSnackOpen(false)} variant='filled' severity="success">
          Deleted sucessfully
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default CountryList;
