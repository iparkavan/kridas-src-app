import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import { useAllPages } from "../../hooks/page-hooks";
import { IconButton, Skeleton, Tooltip } from "@mui/material";
import { EditIcon, VisibleIcon } from "../UI/icon/icon";
import { VerificationSwitch } from "../UI/switch/verification-switch";
import PageToggleVerification from "./page-toggle-verification";
import { useNavigate } from "react-router-dom";

const PageList = () => {
  const navigate = useNavigate();
  const [pagesList, setPagesList] = useState();
  const { data: companiesList, isLoading: isPagesLoading } = useAllPages();

  useEffect(() => {
    let arrayOfCompaniesdata = [];
    companiesList?.map((page) => {
      let objOfCompaniesData = {};
      objOfCompaniesData["company_id"] = page.company_id;
      objOfCompaniesData["company_name"] = page.company_name;
      objOfCompaniesData["company_email"] = page.company_email;
      objOfCompaniesData["company_contact_no"] = page.company_contact_no;
      objOfCompaniesData["name"] = page.name;
      objOfCompaniesData["company_status"] = page.company_status;
      objOfCompaniesData["company_profile_verified"] =
        page.company_profile_verified;
      let status;
      if (page.company_profile_verified === true) {
        status = "Verified";
      } else {
        status = "UnVerified";
      }
      objOfCompaniesData["company_profile_verified"] = status;
      arrayOfCompaniesdata.push(objOfCompaniesData);
      // return null;
    });
    setPagesList(arrayOfCompaniesdata);
  }, [companiesList]);

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
    {
      name: "company_profile_verified",
      label: "Profile Status",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <PageToggleVerification
                value={value === "Verified" ? "Verified" : false}
                companyId={tableMeta.rowData[0]}
              />
            </div>
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
                  // onClick={() => viewRowHandler(tableMeta.rowData)}
                >
                  <VisibleIcon className="text-xl" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Edit">
                <IconButton
                  aria-label="Edit"
                  size="small"
                  onClick={() => editRowHandler(tableMeta.rowData)}
                >
                  <EditIcon className="text-xl" />
                </IconButton>
              </Tooltip>
            </>
          );
        },
      },
    },
  ];

  const editRowHandler = (rowData) => {
    navigate(`/pages/allpages/${rowData[0]}`);
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
        noMatch: isPagesLoading
          ? "Loading..."
          : "Sorry , No Matching Records Found",
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
      <MUIDataTable data={pagesList} columns={columns} options={options} />
    </div>
  );
};

export default PageList;
