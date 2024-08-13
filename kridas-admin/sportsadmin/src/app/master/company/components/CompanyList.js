import React, { useState,useEffect } from "react";
import useHttp from "../../../../hooks/useHttp";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import CompanyTableConfig from "../../../master/company/config/CompanyConfig";

const options = {
    filter: true,
    search: true,
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

const CompanyList = () => {
    const useStyles = makeStyles((theme) => ({
        error: {
            color: "red",
        },
    }));
    const classes = useStyles();
    const [companyList , setCompanyList] = useState([]);
    const { isLoading, error, sendRequest } = useHttp();
    const columns = [
        {
            name: "company_name",
            label: "Name",
            options: {
                filters: false,
                sort: false,
            },
        },

        {
            name: "company_email",
            label: "Email",
            options: {
                filter: false,
                sort: false,
            },
        },

        {
            name: "company_contact_no",
            label: "Contact No",
            options: {
                filters: true,
                sort: true,
               
            },
        },

        {
            name: "company_website",
            label: "Website",
            options: {
                filters: true,
                sort: true,
                display:false
                
            },
        },
        {
            name: "company_id",
            label: "ID",
            options: {
                filters: true,
                sort: true,
                display: false,
            },
        },

        {
            name: "Options",
            options: {
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>
                            <div>
                                <Tooltip title="Edit">
                                    <IconButton
                                        aria-label="Edit"
                                        size="small"

                                    >
                                        <EditIcon style={{ fontSize: "medium" }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="View">
                                    <IconButton
                                        aria-label="View"
                                        size="small"
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
        const config = CompanyTableConfig.getAllCompany();
        const transformDate = (data) => {
          setCompanyList(data);
        };
        sendRequest(config, transformDate);
      }, [sendRequest]);

    let errorContent = "";
    if (error !== null) {
        errorContent = (
            <p className={classes.error}>Error occurred while fetching data</p>
        );
    }

    return (
        <>
            <div>
                {errorContent}
                <MUIDataTable data={companyList} columns={columns} options={options} />
            </div>
        </>
    )

}

export default CompanyList;