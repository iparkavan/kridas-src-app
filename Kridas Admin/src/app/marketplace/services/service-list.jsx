import MUIDataTable from "mui-datatables";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSearchProducts } from "../../../hooks/product-hook";
import { Box, IconButton, Tooltip } from "@mui/material";
import { VisibleIcon } from "../../UI/icon/icon";

const ServiceList = () => {
  const navigate = useNavigate();

  const { data: serviceData, isLoading } = useSearchProducts({
    productType: "SER",
  });

  const columns = [
    {
      name: "productName",
      label: "Service Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "companyName",
      label: "Company Name",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "productId",
      label: "Product Id",
      options: {
        filters: true,
        sort: true,
        display: false,
      },
    },
    {
      name: "categoryName",
      label: "Sports",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          return value[0];
        },
      },
    },
    {
      name: "categoryName",
      label: "Category",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          return value[1];
        },
      },
    },
    {
      name: "productBasePrice",
      label: "Cost",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "availabilityStatus",
      label: "Status",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          let availability;
          if (value === "AVL") {
            availability = "Available";
          } else availability = "Not Available";
          return availability;
        },
      },
    },
    {
      name: "Options",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          return (
            <>
              <Box display={"flex"} justifyContent="center">
                <Tooltip
                  title="View"
                  // className="flex justify-e gap-1"
                >
                  <IconButton
                    aria-label="View"
                    size="small"
                    // onClick={() => viewRowHandler(tableMeta.rowData)}
                    onClick={() => viewRowHandler(tableMeta.rowData)}
                  >
                    <VisibleIcon className="text-xl" />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          );
        },
      },
    },
  ];

  const viewRowHandler = (rowData) => {
    navigate(`/marketplace/services/view/${rowData[2]}`);
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
        size: "small",
      };
    },
  };

  return (
    <div>
      <MUIDataTable
        title={"Products List"}
        data={serviceData}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export default ServiceList;
