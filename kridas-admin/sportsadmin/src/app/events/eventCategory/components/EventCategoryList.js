import { useState } from "react";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import useHttp from "../../../../hooks/useHttp";

const useStyles = makeStyles((theme) => ({
  error: {
    color: "red",
  },
}));

const options = {
  filter: false,
  search: false,
  print: false,
  download: false,
  viewColumns: false,
  selectableRows: "none",
  setTableProps: () => {
    return {
      size: "small",
    };
  },
};

const EventCategoryList = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const { error } = useHttp();
  const [eventCategoryList] = useState([]);
  const editRowHandler = (rowData) => {
    history.push(`/category/edit/${rowData[0]}`);
  };
  const columns = [
    {
      name: "categoryId",
      label: "Category ID",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "categoryName",
      label: "categoryName",
      options: {
        sort: true,
      },
    },
    {
      name: "categoryDesc",
      label: "Type",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Options",
      options: {
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Tooltip title="Edit">
              <IconButton
                aria-label="Edit"
                size="small"
                onClick={() => editRowHandler(tableMeta.rowData, "E")}
              >
                <EditIcon style={{ fontSize: "medium" }} />
              </IconButton>
            </Tooltip>
          );
        },
      },
    },
  ];

  let errorContent = "";
  if (error !== null) {
    errorContent = (
      <p className={classes.error}>Error occurred while fetching data</p>
    );
  }

  return (
    <div>
      {errorContent}
      <MUIDataTable
        data={eventCategoryList}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export default EventCategoryList;
