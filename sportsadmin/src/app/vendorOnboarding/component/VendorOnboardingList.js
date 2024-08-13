import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import MUIDataTable from "mui-datatables";
import VisibilityIcon from "@material-ui/icons/Visibility";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import useHttp from "../../../hooks/useHttp";
import companyConfig from "../../company/config/CompanyConfig";
import EditIcon from "@material-ui/icons/Edit";
import CompanyListToggleSwitch from "../../company/components/CompanyListToggleSwitch";

const useStyles = makeStyles(() => ({
  iconSpace: {
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

const VendorOnboardingList = () => {
  const classes = useStyles();
  const history = useHistory();
  const { isLoading, sendRequest } = useHttp();
  const [, setClear] = useState({});
  const [companyList, setCompanyList] = useState([]);
  const columns = [
    {
      name: "company_id",
      label: "Company ID",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "company_name",
      label: "Page Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "company_email",
      label: "Email",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "company_contact_no",
      label: "Phone",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "name",
      label: "Created By",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "company_status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          return value === "AC" ? "Active" : "Inactive";
        },
      },
    },
    // {
    //   name: "company_profile_verified",
    //   label: "Profile Status",
    //   options: {
    //     filter: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return (
    //         <CompanyListToggleSwitch
    //           value={value === "Verified" ? true : false}
    //           companyId={tableMeta.rowData[0]}
    //           refreshData={getAllData}
    //           refreshDataloading={isLoading}
    //         />
    //       );
    //     },
    //   },
    // },

    {
      name: "company_profile_verified",
      label: "Profile Status",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <span
              className={
                value === "Verified"
                  ? classes.approveColor
                  : classes.pendingColor
              }
            >
              {value === "Verified" ? "Verified" : "UnVerified"}
            </span>
          );
        },
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
              <Tooltip title="View">
                <IconButton
                  aria-label="View"
                  size="small"
                  onClick={() => viewRowHandler(tableMeta.rowData)}
                >
                  <VisibilityIcon style={{ fontSize: "medium" }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Edit" className={classes.iconSpace}>
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

  /*   To Get All Data */

  const getAllData = () => {
    const config = companyConfig.getAllCompanies();
    const transformDate = (data) => {
      let resultDataArray = [];
      let resultData = data;
      resultData.map((r) => {
        var obj = {};
        obj["company_id"] = r.company_id;
        obj["company_name"] = r.company_name;
        obj["company_email"] = r.company_email;
        obj["company_contact_no"] = r.company_contact_no;
        obj["name"] = r.name;
        obj["company_status"] = r.company_status;
        obj["company_profile_verified"] = r.company_profile_verified;
        let status;
        if (r.company_profile_verified === true) {
          status = "Verified";
        } else {
          status = "Pending";
        }
        obj["company_profile_verified"] = status;
        resultDataArray.push(obj);
        return null;
      });
      setCompanyList(resultDataArray);
    };
    sendRequest(config, transformDate);
    // return () => {
    //   setClear({});
    // };
  };

  const viewRowHandler = (rowData) => {
    history.push(`/vendor-onboarding/${rowData[0]}`);
  };
  const editRowHandler = (rowData) => {
    history.push(`/vendor-onboarding/edit/${rowData[0]}`);
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
      <MUIDataTable data={companyList} columns={columns} options={options} />
    </div>
  );
};

export default VendorOnboardingList;
