import MUIDataTable from "mui-datatables";
import React from "react";
import { useProductById, useSearchProducts } from "../../../hooks/product-hook";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { VisibleIcon } from "../../UI/icon/icon";

const ProductList = () => {
  // const productId = "517eab7e-0b6c-4886-a788-1b95bdfc18f6";

  const navigate = useNavigate();

  const { data: productsData, isLoading } = useSearchProducts({
    productType: "VCH",
  });

  const columns = [
    {
      name: "productName",
      label: "Product Name",
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
    navigate(`/marketplace/products/view/${rowData[2]}`);
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
        className="dark:bg-main-dark-bg dark:text-white"
        title={"Products List"}
        data={productsData}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export default ProductList;
