import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import userConfig from "../../config/userConfig";
import useHttp from "../../../../hooks/useHttp";
import moment from "moment";
import { Tooltip } from "@mui/material";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  iconSpace: {
    width: "35px",
  },
}));

const UserAccountDeletion = () => {
  const { isLoading, sendRequest } = useHttp();
  const classes = useStyles();

  const [userAccountDeletion, setUserAccountDeletion] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const config = userConfig.userAccountDeletion();

    const transformData = (data) => {
      setUserAccountDeletion(data);
    };

    // eslint-disable-next-line no-undef
    sendRequest(config, transformData);
  }, [sendRequest]);

  // useEffect(() => {
  //   const config = userConfig.getUserById(userAccountDeletion?.user_id);

  //   const transformData = (data) => {
  //     setUser(data);
  //   };

  //   sendRequest(config, transformData);
  // }, [sendRequest, userAccountDeletion?.user_id]);

  // console.log(user);

  console.log(userAccountDeletion);

  const columns = [
    {
      name: "first_name",
      label: "User Name",
      options: {
        filters: true,
        sort: true,
      },
    },
    {
      name: "user_email",
      label: "Email ID",
      options: {
        filters: true,
        sort: true,
      },
    },
    {
      name: "request_date",
      label: "Requested Date",
      options: {
        filters: true,
        sort: true,
        // display: false,
        customBodyRender: (value) => {
          return <>{moment(new Date(value)).format("YYYY-MM-DD")}</>;
        },
      },
    },
    {
      name: "is_deleted",
      label: "Status",
      options: {
        filters: true,
        sort: true,
        customBodyRender: (value) => {
          let status;
          if (value === true) {
            status = "Deleted";
          } else {
            status = "In Progress";
          }
          return status;
        },
      },
    },
    {
      name: "deletion_date",
      label: "Deleted Date",
      options: {
        filters: true,
        sort: true,
        // customBodyRender: (value) => {
        //   return "kign"
        // },
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
                <Tooltip title="View" className={classes.iconSpace}>
                  <IconButton
                    aria-label="View"
                    size="small"
                    // onClick={() => viewRowHandler(tableMeta.rowData)}
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

  const options = {
    filter: true,
    search: true,
    print: false,
    download: false,
    viewColumns: false,
    selectableRows: "none",
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
  };

  return (
    <div>
      <MUIDataTable
        data={userAccountDeletion}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export default UserAccountDeletion;
