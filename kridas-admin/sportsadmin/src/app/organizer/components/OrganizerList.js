import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import VisibilityIcon from '@material-ui/icons/Visibility';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { useHistory } from "react-router";
import useHttp from "../../../hooks/useHttp";
import OrganizerConfig from "../config/OrganizerConfig";

const useStyles = makeStyles((theme) => ({
  error: {
    color: "red",
  },
}));

const options = {
  filter: true,
  search: true,
  print: false,
  download: false,
  viewColumns: false,
  selectableRows: "none",
  setTableProps: () => {
    return {
      // material ui v4 only
      size: "small",
    };
  },
};

const OrganizerList = () => {
  const classes = useStyles();
  const history = useHistory();
  const {  error, sendRequest } = useHttp();
  const [organizerList, setOrganizerList] = useState([]);

  const columns = [
    {
      name: "organizerId",
      label: "Organizer ID",
      options: {
        filter: false,
        sort: true,
        display: false
      },
    },
    {
      name: "organizerName",
      label: "Name",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "organizerType",
      label: "Type",
      options: {
        filter: false,
        sort: true,
        searchable: false,
      },
    },
    {
      name: "organizerStatus",
      label: "Status",
      options: {
        filter: true,
        sort: false,
        searchable: false,
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
            <Tooltip title="View">
              <IconButton
                aria-label="View"
                size="small"
                onClick={() => viewRowHandler(tableMeta.rowData)}
              >
                <VisibilityIcon style={{ fontSize: "medium" }} />
              </IconButton>
            </Tooltip>
          );
        },
      },
    },
  ];

  const viewRowHandler = (rowData) => {
    history.push(`/organizer/${rowData[0]}`);
  };

  useEffect(() => {
    const config = OrganizerConfig.getAllOrganizers();

    const transformData = (data) => {
      data.forEach(org => org.organizerType = org.user ? "User" : "Company");
      setOrganizerList(data);
    };

    sendRequest(config, transformData);
  }, [sendRequest]);

  let errorContent = "";
  if (error !== null) {
    errorContent = (
      <p className={classes.error}>Error occurred while fetching data</p>
    );
  }

  return (
    <div>
      {errorContent}
      <MUIDataTable data={organizerList} columns={columns} options={options} />
    </div>
  );
};

export default OrganizerList;
