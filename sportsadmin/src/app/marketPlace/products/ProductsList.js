import React, { useEffect, useState } from "react";
import Button from "../../common/ui/components/Button";
import { IconButton, makeStyles, Tooltip } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import MUIDataTable from "mui-datatables";
import VisibilityIcon from "@material-ui/icons/Visibility";
import useHttp from "../../../hooks/useHttp";
import MarketPlaceConfig from "../config/MarketPlaceConfig";

const useStyles = makeStyles(() => ({
  error: {
    color: "red",
  },
  buttonContainer: {
    textAlign: "right",
    paddingBottom: "1%",
  },
  iconSpace: {
    width: "35px",
  },
  dialog: {
    padding: "20px",
  },
  dialogbtn: {
    paddingRight: "30px",
  },
  selectContainer: {
    minWidth: "300px",
    width: "25rem",
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  selectBorder: {
    margin: "10px",
    height: "40px",
    marginLeft: "7px",
  },
}));

const ProductsList = () => {
  const history = useHistory();
  const classes = useStyles();
  const { isLoading, sendRequest } = useHttp();

  // useState;
  const [productList, setProductList] = useState([]);

  console.log(productList);

  const columns = [
    {
      name: "productName",
      label: "Product Name",
      options: {
        filters: true,
        sort: true,
      },
    },
    {
      name: "companyName",
      label: "Page Name",
      options: {
        filters: true,
        sort: true,
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
        filters: true,
        sort: true,
        customBodyRender: (value) => {
          return value[0];
        },
      },
    },
    {
      name: "categoryName",
      label: "Category",
      options: {
        filters: true,
        sort: true,
        customBodyRender: (value) => {
          return value[1];
        },
      },
    },
    {
      name: "productBasePrice",
      label: "Cost",
      options: {
        filters: true,
        sort: true,
      },
    },
    {
      name: "availabilityStatus",
      label: "Status",
      options: {
        filters: true,
        sort: true,
        customBodyRender: (value) => {
          let availability;
          if (value === "AVL") {
            availability = "Available";
          } else {
            availability = "Not Available";
          }
          return availability;
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

  const viewRowHandler = (rowData) => {
    history.push(`/marketplace/products/view/${rowData[2]}`);
  };

  useEffect(() => {
    const config = MarketPlaceConfig.postSearchProducts({
      productType: "VCH",
      // availability: "AVL",
    });

    const transformData = (data) => {
      setProductList(data);
    };
    sendRequest(config, transformData);
  }, [sendRequest]);

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
    <>
      <div className={classes.root}>
        <div className={classes.selectContainer}></div>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
          >
            Add
          </Button>
        </div>
      </div>

      <div>
        <MUIDataTable data={productList} columns={columns} options={options} />
      </div>
    </>
  );
};

export default ProductsList;
