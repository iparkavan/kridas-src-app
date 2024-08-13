import React, { useEffect, useState } from "react";
import { Box, IconButton, makeStyles } from "@material-ui/core";

import MUIDataTable from "mui-datatables";
import useHttp from "../../../hooks/useHttp";
import InputField from "../../../app/common/ui/components/InputField";
import OrdersConfig from "../orders/config/OrdersConfig";
import moment from "moment";
import ClearIcon from "@mui/icons-material/Clear";

const useStyles = makeStyles(() => ({
  error: {
    color: "red",
  },
  inputContainer: {
    textAlign: "left",
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
  field: {
    width: "250px",
    margin: "16px",
  },
}));

const SalesList = () => {
  // const history = useHistory();
  const classes = useStyles();
  const { isLoading, sendRequest } = useHttp();

  const [vendorList, setVendorList] = useState([]);
  const [filterDate, setFilterDate] = useState();


  const formattedVendorList = vendorList?.map((vendor) => ({
    ...vendor,
    orderDate: moment(new Date(vendor.orderDate)).format("YYYY-MM-DD"),
  }));


  const columns = [
    {
      name: "orderDate",
      label: "Date",
      options: {
        filters: true,
        sort: true,
      },
    },
    {
      name: "vendorName",
      label: "Vendor Name",
      options: {
        filters: true,
        sort: true,
      },
    },
    {
      name: "productName",
      label: "Product Name",
      options: {
        filters: true,
        sort: true,
      },
    },
    {
      name: "productBasePrice",
      label: "Actual Price",
      options: {
        filters: true,
        sort: true,
      },
    },
    {
      name: "productSplPrice",
      label: "Special Price",
      options: {
        filters: true,
        sort: true,
      },
    },
    {
      name: "itemTotalTaxAmt",
      label: "Tax",
      options: {
        filters: true,
        sort: true,
      },
    },
    {
      name: "itemSaleAmt",
      label: "Net",
      options: {
        filters: true,
        sort: true,
      },
    },
    {
      name: "payToVendor",
      label: "Pay to Vendor",
      options: {
        filters: true,
        sort: true,
      },
    },
  ];

  useEffect(() => {
    const data = filterDate ? { orderDate: filterDate } : {};
    const config = OrdersConfig.postVendorReport(data);

    const transformData = (data) => {
      if (data) {
        setVendorList(data);
      } else {
        setVendorList([]);
      }
    };

    sendRequest(config, transformData);
  }, [sendRequest, filterDate]);

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
        size: "small",
      };
    },
    downloadOptions: {
      filename: "Sales_Report.csv",
    },
  };

  return (
    <>
      <div className={classes.root}>
        {/* <div className={classes.selectContainer}></div> */}
        <Box display="flex">
          <InputField
            className={classes.field}
            label="Date"
            type="Date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            name="from_date"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={
              {
                // inputProps: {
                //   min: "2023-08-21",
                //   max: "2023-08-30",
                // },
              }
            }
          />
          {filterDate && (
            <IconButton onClick={() => setFilterDate("")}>
              <ClearIcon />
            </IconButton>
          )}
        </Box>
      </div>

      <div>
        <MUIDataTable
          data={formattedVendorList}
          columns={columns}
          options={options}
        />
      </div>
    </>
  );
};

export default SalesList;
