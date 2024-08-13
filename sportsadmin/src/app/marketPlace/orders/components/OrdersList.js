import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { IconButton, makeStyles, Tooltip } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import MUIDataTable from "mui-datatables";
import VisibilityIcon from "@material-ui/icons/Visibility";
import OrdersConfig from "../config/OrdersConfig";
import useHttp from "../../../../hooks/useHttp";
import moment from "moment";

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

const OrdersList = () => {
  const history = useHistory();
  const classes = useStyles();
  const { isLoading, error, sendRequest } = useHttp();

  const [orderList, setOrderList] = useState([]);

  console.log(orderList);

  const columns = [
    {
      name: "orderId",
      label: "Order Id",
      options: {
        filters: true,
        sort: true,
      },
    },
    {
      name: "userId",
      label: "User Id",
      options: {
        filters: true,
        sort: true,
      },
    },
    {
      name: "billingFirstName",
      label: "User Name",
      options: {
        filters: true,
        sort: true,
      },
    },

    {
      name: "orderDate",
      label: "Date",
      options: {
        filters: true,
        sort: true,
        customBodyRender: (value) => {
          return <>{moment(new Date(value)).format("YYYY-MM-DD")}</>;
        },
      },
    },
    {
      name: "orderItem",
      label: "Type",
      options: {
        filters: true,
        sort: true,
        customBodyRender: (value) => {
          const types = value[0]?.productTypeId;
          let type;
          if (types === "EPRD") {
            type = "Event";
          } else if (types === "VCH") {
            type = "Product";
          } else if (types === "CVCH") {
            type = "Cash Voucher";
          } else {
            type = "Service";
          }
          return type;
        },
      },
    },
    {
      name: "itemTotalAmt",
      label: "Cost",
      options: {
        filters: true,
        sort: true,
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
    history.push(`/marketplace/orders/view/${rowData[0]}`);
  };

  useEffect(() => {
    const config = OrdersConfig.postSearchOrders({});

    const transformData = (data) => {
      setOrderList(data);
    };
    sendRequest(config, transformData);
  }, [sendRequest]);

  // console.log(orderList);

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
        <MUIDataTable data={orderList} columns={columns} options={options} />
      </div>
    </>
  );
};

export default OrdersList;
