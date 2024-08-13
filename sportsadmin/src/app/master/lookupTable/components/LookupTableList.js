import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import useHttp from "../../../../hooks/useHttp";
import LookupTableConfig from "../config/LookupTableConfig";
import MasterData from "../../../../utils/masterdata";

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
      // material ui v4 only
      size: "small",
    };
  },
};

const LookupTableList = (props) => {

  const classes = useStyles();
  const { lookup_type, reload } = props;
  const { error, sendRequest } = useHttp();
  const [lookupList, setLookupList] = useState([]);
  const [, setCleanup] = useState({});
  const columns = [
    {
      name: "lookup_key",
      label: "Key",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "lookup_value",
      label: "Value",
      options: {
        sort: true,
        filter: true
      },
    },
    {
      name: "lookup_type",
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

  const editRowHandler = (rowData, action) => {
    let data = {
      lookup_key: rowData[0],
      lookup_type: rowData[2],
      lookup_value: rowData[1],
    }
    props.setEditItem(data)
    props.getPageMode(MasterData.pageMode.Edit);
    props.getIsAddLookup(true);
  };

  useEffect(() => {
    if (lookup_type.trim().length > 0) {
      const config = LookupTableConfig.getLookupTableByType(lookup_type);
      const transformDate = (data) => {
        setLookupList(data);
      };
      sendRequest(config, transformDate);
      return () => {
        setCleanup({});
      };
    } else {
      setLookupList([]);
    }
  }, [sendRequest, lookup_type, reload]);

  let errorContent = "";
  if (error !== null) {
    errorContent = (
      <p className={classes.error}>Error occurred while fetching data</p>
    );
  }

  return (
    <div>
      {errorContent}
      <MUIDataTable data={lookupList} columns={columns} options={options} />
    </div>
  );
};

export default LookupTableList;
