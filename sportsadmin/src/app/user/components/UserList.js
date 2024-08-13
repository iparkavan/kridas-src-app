import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import EditIcon from "@material-ui/icons/Edit";
import useHttp from "../../../hooks/useHttp";
import MUIDataTable from "mui-datatables";
import userConfig from "../config/userConfig";
import VisibilityIcon from "@material-ui/icons/Visibility";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";
import UserListToggleSwitch from "./userListtoggleSwitch";
import UserProfileVerificationSwitch from "./userProfileVerificationSwitch";

const useStyles = makeStyles((theme) => ({
  listIcon: {
    width: "35px",
  },
  approveColor: {
    color: "white",
    background: "green",
    padding: "4px 8px 3px 3px",
  },
  pendingColor: {
    color: "white",
    background: "red",
    padding: "4px 5px 3px 3px",
  },
}));

const UserList = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [userList, setUserList] = useState([]);
  const { isLoading, sendRequest } = useHttp();
  const [, setClear] = useState({});

  const columns = [
    {
      name: "user_id",
      label: "User ID",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "first_name",
      label: "First Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "last_name",
      label: "Last Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "user_email",
      label: "Email",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "user_phone",
      label: "Phone No.",
      options: {
        filter: true,
      },
    },
    {
      name: "user_status",
      label: "Account Status",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          // return value === "AC" ? "Active" : "Inactive";
          return (
            <UserListToggleSwitch
              value={value === "AC" ? "AC" : false}
              userId={tableMeta.rowData[0]}
              refreshData={getAllData}
              refreshDataloading={isLoading}
            />
          );
        },
      },
    },
    // {
    //   name: "user_profile_verified",
    //   label: "Profile Status",
    //   options: {
    //     filter: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return (
    //         <span
    //           className={
    //             value === "Verified"
    //               ? classes.approveColor
    //               : classes.pendingColor
    //           }
    //         >
    //           {value === "Verified" ? "Verified" : "UnVerified"}
    //         </span>
    //       );
    //     },
    //   },
    // },
    {
      name: "user_profile_verified",
      label: "Profile Status",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <UserProfileVerificationSwitch
              value={value === "Verified" ? "Verified" : false}
              userId={tableMeta.rowData[0]}
              refreshData={getAllData}
              refreshDataloading={isLoading}
            />
          );
        },
      },
    },

    {
      name: "created_date",
      label: "Created Date",
      options: {
        filter: true,
      },
    },
    {
      name: "referral_code",
      label: "Referral Code",
      options: {
        filter: true,
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
              <Tooltip title="View" className={classes.listIcon}>
                <IconButton
                  aria-label="View"
                  size="small"
                  onClick={() => viewRowHandler(tableMeta.rowData)}
                >
                  <VisibilityIcon style={{ fontSize: "medium" }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Edit" className={classes.listIcon}>
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
    getAllData();
    return () => {
      setClear({});
    };
  }, [sendRequest]);

  // Get All Data
  const getAllData = () => {
    const config = userConfig.getUserListConfig();
    const transformDate = (data) => {
      let resultDataArray = [];
      let resultData = data;
      resultData.map((r) => {
        var obj = {};
        obj["user_id"] = r.user_id;
        obj["first_name"] = r.first_name;
        obj["last_name"] = r.last_name;
        obj["user_email"] = r.user_email;
        obj["user_phone"] = r.user_phone;
        obj["user_status"] = r.user_status;
        obj["user_profile_verified"] = r.user_profile_verified;
        obj["created_date"] = formateDate(r.created_date);
        obj["referral_code"] = r.referral_code;
        let status;
        if (
          r.user_profile_verified === true &&
          r.user_profile_verified !== undefined
        ) {
          status = "Verified";
        } else {
          status = "UnVerified";
        }

        obj["user_profile_verified"] = status;
        resultDataArray.push(obj);
        return null;
      });
      setUserList(resultDataArray);
    };
    sendRequest(config, transformDate);
  };

  /*   Date Formation */
  const formateDate = (date) => {
    return moment(new Date(date)).format("DD-MMM-YYYY");
  };

  const viewRowHandler = (rowData) => {
    history.push(`/user/${rowData[0]}`);
  };

  const editRowHandler = (rowData, action) => {
    history.push(`/user/edit/${rowData[0]}`);
  };

  const options = {
    filter: true,
    search: true,
    print: false,
    download: true,
    viewColumns: false,
    selectableRows: "none",
    textLabels: {
      body: {
        noMatch: isLoading ? "Loading..." : "Sorry , No Matching Records Found",
      },
    },
    setTableProps: () => {
      return {
        // material ui v4 only
        size: "small",
      };
    },
  };

  return (
    <div>
      <MUIDataTable data={userList} columns={columns} options={options} />
    </div>
  );
};

export default UserList;
