import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import useHttp from "../../../../hooks/useHttp";
import LookupTypeConfig from "../../../master/lookupType/config/LookupTypeConfig"
import { useHistory } from 'react-router-dom';
import VisibilityIcon from "@material-ui/icons/Visibility";

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



const LookupTypeList = () => {
  let history = useHistory();
  const classes = useStyles();
  const { isLoading, sendRequest } = useHttp();
  const [, setClear] = useState({});
  const [lookupTypeList, setLookupTypeList] = useState([]);
  const columns = [
    {
      name: "lookup_type",
      label: "Type",
      options: {
        filters: false,
        sort: true,
      },
    },
    {
      name: "lookup_desc",
      label: "Description",
      options: {
        filter: false,
        sort: true,
      },
    },

    {
      name: "Options",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              <div>
                <Tooltip title="View" className={classes.iconSpace}>
                  <IconButton
                    aria-label="View"
                    size="small"
                    onClick={() => viewRowHandler(tableMeta.rowData)}
                  >
                    <VisibilityIcon style={{ fontSize: "medium" }} />
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
    const config = LookupTypeConfig.getAllLookupTypes();
    const transformDate = (data) => {
      setLookupTypeList(data);
    };
    sendRequest(config, transformDate);
    return () => {
      setClear({});
    }
  }, [sendRequest]);

  const viewRowHandler = (rowData, action) => {
    history.push(`/masters/lookupType/view/${rowData[0]}`);
  };

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
      <div>
        {/* {errorContent} */}

        <MUIDataTable
          data={lookupTypeList}
          columns={columns}
          options={options} />

      </div>

    </>
  );
};

export default LookupTypeList;
