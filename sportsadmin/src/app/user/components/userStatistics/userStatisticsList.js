import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import EditIcon from "@material-ui/icons/Edit";
import useHttp from "../../../../hooks/useHttp";
import MUIDataTable from "mui-datatables";
import userConfig from "../../config/userConfig";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/styles";


const useStyles = makeStyles((theme) => ({

  listIcon: {
    width: "35px"
  },
  table: {
    width: "100%",
  }

}))


const UserStatistics = (props) => {
  const { userId } = props
  const first_name = props.userDetails.first_name;
  const classes = useStyles();
  const history = useHistory();
  const [userStatistics, setUserStatistics] = useState([]);
  const { isLoading, sendRequest } = useHttp();
  const [, setClear] = useState({});

  const editRowHandler = (rowData) => {
    history.push(`/user/userStatisticsEdit/${rowData[4]}`);
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
        // material ui v4 only
        size: "small",
      };
    },
  };
  const columns = [
    {
      name: "user_id",
      label: "User Name",
      options: {
        filter: false,
        sort: false,
        display: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value = first_name;
        },
      },
    },
    {
      name: "sports_name",
      label: "Sports Name",
      options: {
        filter: false,
        sort: true,
        display: true,
      },
    },
    {
      name: "category_name",
      label: "Skill Level",
      options: {
        filter: false,
        sort: false,
        display: true,
      },
    },
    {
      name: "playing_status",
      label: "Status",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value === "AC" ? "Active" : "InActive";
        },
      },
    },
    {
      name: "user_statistics_id",
      label: "UserStatisticsId",
      options: {
        filter: false,
        display: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value === "A" ? "Active" : "Inactive";
        },
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
              <Tooltip title="Edit" className={classes.listIcon} >
                <IconButton
                  aria-label="Edit"
                  size="small"
                  onClick={() => editRowHandler(tableMeta.rowData, "E")}
                >
                  <EditIcon style={{ fontSize: "medium" }} />
                </IconButton>
              </Tooltip>
            </>
          );
        },
      },
    },
  ];


  useEffect(() => {
    const userstatsconfig = userConfig.getUserStatistics(userId)
    const transformDate = (data) => {
      setUserStatistics(data.data);
    };
    sendRequest(userstatsconfig, transformDate);

    return () => {
      setClear({});
    };

  }, [sendRequest, userId])

  return (
    <div className={classes.table}>
      <MUIDataTable data={userStatistics} columns={columns} options={options} />
    </div>
  )
}

export default UserStatistics;