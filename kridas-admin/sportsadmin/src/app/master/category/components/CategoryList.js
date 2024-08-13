import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import useHttp from "../../../../hooks/useHttp";
import CategoryConfig from "../config/CategoryConfig";
import { useHistory } from 'react-router-dom';
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ConfirmationDialog from '../../../common/ui/components/ConfirmDialog';
import Button from "../../../common/ui/components/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";



const useStyles = makeStyles(() => ({
  error: {
    color: "red",
  },
  buttonContainer: {
    textAlign: "right",
    paddingBottom: "1%"
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
  selectContainer: {
    minWidth: "300px",
    width: "25rem",
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  selectBorder: {
    margin: "10px",
    height: '40px',
    marginLeft: '7px'
  }
}));


const CategoryList = () => {
  let history = useHistory();
  const classes = useStyles();
  const { isLoading, error, sendRequest } = useHttp();
  const [categoryList, setcategoryList] = useState([]);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [id, setId] = useState(0);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("Deleted Successfully");
  const [, setState] = useState({});

  const columns = [
    {
      name: "category_name",
      label: "Name",
      options: {
        filters: true,
        sort: true,
      },
    },
    {
      name: "category_type",
      label: "Type",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "category_desc",
      label: "Description",
      options: {
        filter: false,
        sort: false,
      },
    },

    {
      name: "category_id",
      label: "CategoryId",
      options: {
        filter: false,
        sort: false,
        display: false
      },
    },
    {
      name: "parent_category_id",
      label: "Parent Category",
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
        customBodyRender: (value, tableMeta) => {
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

    const config = CategoryConfig.getAllCategories();
    const transformDate = (data) => {
      setcategoryList(data);
    };
    sendRequest(config, transformDate);
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

  const editRowHandler = (rowData) => {
    history.push(`/masters/category/edit/${rowData[3]}`);

  };
  const viewRowHandler = (rowData) => {
    history.push(`/masters/category/view/${rowData[3]}`);

  };
  const DeleteRowHandler = (rowData) => {
    handleOpen();
    setId(rowData[3]);
  }
  /*   For Confirming the delete Action */

  const ConfirmDelete = () => {
    const config = CategoryConfig.deleteCategory(id)
    const deleteTransform = (data) => {
      if (data?.errString?.detail.indexOf("still referenced from table") > 0) {
        setSnackMsg("Unable to delete parent category. Please try to delete child category.")
        setSnackOpen(true);
      }
      else if (data?.message === "This violates foreign key constraint") {
        setSnackMsg("Unable to delete this category.Because This category is refferd from company_type in company table")
        setSnackOpen(true);
      }
      else {
        setSnackMsg("deleted successfully")
        setSnackOpen(true);
        setReload(!reload);
      }

    }

    sendRequest(config, deleteTransform);
    handleClose();
    return () => {
      setState({});
    };

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
      <div className={classes.root}>
        <div className={classes.selectContainer}>

        </div>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={() => history.push("/masters/category/add")}
          >
            Add
          </Button>
        </div>

      </div>
      <div>
        {errorContent}

        <MUIDataTable data={categoryList} columns={columns} options={options} />

      </div>
      <ConfirmationDialog
        open={open}
        handleClose={handleClose}
        title="Delete Category"
        children="Are you want to delete this Category?"
        handleConfirm={ConfirmDelete}
      />


      <Snackbar open={snackOpen}
        autoHideDuration={3000} onClose={() => setSnackOpen(false)}>
        <MuiAlert elevation={6} onClose={() => setSnackOpen(false)} variant='filled' severity="success">
          {snackMsg}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default CategoryList;
