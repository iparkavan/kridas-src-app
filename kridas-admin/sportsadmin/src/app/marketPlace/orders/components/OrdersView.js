import { Button, Divider, colors } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { Skeleton } from "@material-ui/lab";
import { makeStyles } from "@material-ui/styles";
import { display } from "@mui/system";
import moment from "moment/moment";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useHttp from "../../../../hooks/useHttp";
import PageContainer from "../../../common/layout/components/PageContainer";
import userConfig from "../../../user/config/userConfig";
import OrdersConfig from "../config/OrdersConfig";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
const useStyles = makeStyles((theme) => ({
  value: {
    fontFamily: "Calibri",
    fontSize: "16pt",
    fontWeight: "bold",
  },

  dateInfo: {
    textAlign: "justify",
    lineHeight: "45pt",
    color: "green",
  },

  userInfo: {
    marginTop: "3.2pt",
    marginLeft: "71.95pt",
    textAlign: "justify",
    lineHeight: "12.2pt",
  },

  span: {
    fontFamily: "Calibri",
    fontSize: "10pt",
  },

  label: {
    fontSize: "20px",
    color: "green",
    fontWeight: "500",
  },
  containerFull: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },
  left: {
    backgroundColor: "#cbf2dd",
    marginTop: "20px",
    width: "450px",
    height: "auto",
    padding: "20px",
  },
}));

//   container: {
//     Width: "1350px",
//     height: "825px",
//     boxShadow: "3px 3px 15px gray",
//     borderRadius: "10px",
//   },
//   innerContent: {
//     padding: "15px",
//     display: "flex",
//     justifyContent: "left",
//     gap: "12rem",
//     margin: "0 0px 0 90px",
//   },
//   details: {
//     margin: "20px 0px 0 90px",
//   },
//   orderDetails: {
//     gap: "1px",
//   },

//   itemSpace: {
//     // color: "red"
//     paddingRight: "400px",
//     display: "flex",
//     alignItems: "center",
//   },
//   columnSpaced: {
//     margin: "0 0 0 684px",
//     display: "flex",
//     columnGap: "158px",
//   },
//   columnSpace: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "0 300px 0 15px",
//   },

//   orderListPadding: {
//     padding: "10px 10px 10px 0px",
//   },
//   sessionDetails: {
//     display: "flex",
//     flexDirection: "column",
//     width: "450px",
//     border: "1px solid gray",
//     // backgroundColor: "lightblue",
//     paddingLeft: "25px",
//     paddingBottom: "15px",
//     borderRadius: "20px",
//   },
//   quantity: {
//     marginLeft: "25px",
//   },
//   cost: {
//     marginRight: "25px",
//   },
//   title: {},
//   desc: {
//     marginTop: "-15px",
//     color: "gray",
//   },
//   orderQuantity: {
//     marginLeft: "-5px",
//   },
//   skeleton: {
//     margin: "50px",
//     height: "200px",
//   },
// }));

const OrdersView = () => {
  const classes = useStyles();
  const [orderView, setOrderView] = useState();
  const [userName, setUserName] = useState();

  console.log(orderView);
  // console.log(userName);

  const { sendRequest: orderRequest, isLoading: isOrderViewLoading } =
    useHttp();
  const { sendRequest: userRequest, isLoading: isUserLoading } = useHttp();
  const { orderId } = useParams();

  // let orderId = "fa9e761b-c524-43a8-b55d-921c7791e05f";

  useEffect(() => {
    const orderViewConfig = OrdersConfig.getOrder(orderId);
    const transformOrdersViewData = (data) => {
      setOrderView(data);
    };
    orderRequest(orderViewConfig, transformOrdersViewData);
  }, [orderRequest, orderId]);

  const userId = orderView?.userId;

  const name = userName?.data?.first_name + " " + userName?.data?.last_name;

  const dateOfOrder = moment(orderView?.orderDate).format("L");

  // const user = userName?.data?.user_name
  // console.log(user)

  // Order Quantity
  const totalItemprice = orderView?.orderItem.reduce(
    (total, item) => total + item.itemTotalAmt,
    0
  );

  const totalItemsTax = orderView?.orderItem.reduce(
    (total, item) => total + item.itemTaxAmt * item.quantity,
    0
  );

  const totalQuantity = orderView?.orderItem.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const history = useHistory();
  useEffect(() => {
    const userconfig = userConfig.getUserById(userId);
    const transformUserData = (data) => {
      setUserName(data);
    };
    userRequest(userconfig, transformUserData);
  }, [userRequest, userId]);

  const getProductType = (productTypeId) => {
    switch (productTypeId) {
      case "VCH":
        return "Product";
      case "CVCH":
        return "Cash Voucher";
      case "SER":
        return "Service";
      case "EPRD":
        return "Event";
      default:
        return "";
    }
  };

  if (isOrderViewLoading) {
    return <Skeleton className={classes.skeleton} />;
  }

  return (
    <PageContainer>
      <Button
        color="primary"
        fullWidth
        type="submit"
        onClick={() => history.push("/marketplace/orders")}
        style={{ marginLeft: "-620px" }}
      >
        <span style={{ color: "gray" }}>
          <ArrowBackIosIcon></ArrowBackIosIcon>
        </span>
        <p style={{ color: "black", fontSize: "20px" }}> Order Details</p>
      </Button>
      <div className={classes.containerFull}>
        <div className={classes.right}>
          {orderView?.orderItem.map((order) => (
            <div className={classes.con}>
              <span className={classes.label}>Order ID:</span>

              <span className={classes.value} style={{ marginLeft: "10px" }}>
                {orderView.orderItem[0].orderId}
              </span>

              <div className={classes.dateInfo}>
                <span>
                  <CalendarMonthIcon></CalendarMonthIcon> {dateOfOrder}
                </span>

                <span> | User Name:</span>
                <span style={{ marginLeft: "10px" }}>{name} </span>
              </div>

              <p style={{ fontWeight: "bold" }}>
                <span>{order.productName}</span>
              </p>

              <p>
                Vendor:{" "}
                <span style={{ color: "green" }}>
                  {" "}
                  Products &amp; Services Page
                </span>
                | {getProductType(order.productTypeId)}
                <span style={{ marginLeft: "60px", fontWeight: "bold" }}>
                  {order.itemPrice} {order.itemCurrency}
                </span>
                <br></br>
                <br></br>
                <span>Quantity: </span>
                <span style={{ marginLeft: "10px" }}>{order.quantity}</span>
              </p>
            </div>
          ))}
        </div>
        <div className={classes.left}>
          <div
            className={classes.value}
            style={{ marginLeft: "150px", marginTop: "-20px" }}
          >
            Order Summary
          </div>
          <div style={{ marginTop: "40px" }}>
            <span>Total Value</span>
            <span style={{ marginLeft: "300px" }}>
              {totalItemprice} {orderView.orderCurrency}
            </span>
          </div>
          <div style={{ marginTop: "40px" }}>
            <span>Tax</span>
            <span style={{ marginLeft: "360px" }}>
              {totalItemsTax} {orderView.orderCurrency}
            </span>
          </div>
          <br></br>
          <Divider></Divider>
          <div style={{ marginTop: "40px" }}>
            <span>Total Payment</span>
            <span style={{ marginLeft: "280px", fontWeight: "bold" }}>
              {orderView?.orderFinalAmt} {orderView.orderCurrency}
            </span>
          </div>
        </div>
      </div>

      {/* <div className={classes.orderDetails}>
            <span>Order ID: {orderView.orderItem[0].orderId}</span>
            <span style={{ marginLeft: "10px" }}>{dateOfOrder}</span>
            <span>User Name:{name}</span>
          </div>

          <div className={classes.orderDetails}>
            <h3>No.Of Items </h3>
            <span style={{ marginLeft: "40px" }}>
              {orderView.orderItem.length}
            </span>
          </div>

          <div className={classes.orderDetails}>
            <h3 style={{ marginLeft: "85px" }}>Order Id </h3>
            <span>{orderView.orderItem[0].orderId}</span>
          </div>

          <div className={classes.orderDetails}>
            <h3>Date of Order</h3>
            <span style={{ marginLeft: "10px" }}>{dateOfOrder}</span>
          </div> */}

      {/* <div className={classes.orderDetails}>
            <h3>Total</h3>
            <span>{orderView?.orderFinalAmt}</span>
          </div>

          <div className={classes.orderDetails}>
            <h3>Tax</h3>
            <span>{totalItemsTax}</span>
          </div> */}

      {/* <div className={classes.details}>
          <div className={classes.columnSpace}>
            <h3 className={classes.itemSpace}>Items</h3>
            <h3 className={classes.quantity}> Quantity</h3>
            <h3 className={classes.cost}>Cost</h3>
          </div>
          <Divider></Divider>

          {orderView?.orderItem.map((order) => (
            <div className={classes.orderListPadding}>
              <div className={classes.columnSpace}>
                <div className={classes.sessionDetails}>
                  <h4 className={classes.title}>{order.productName}</h4>
                  <li className={classes.desc}> {order.productDesc}</li>
                </div>

                <div className={classes.orderQuantity}>
                  <p>{order.quantity}</p>
                </div>

                <div>
                  <p>
                    {order.itemPrice} {order.itemCurrency}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <Divider></Divider>
          <div className={classes.columnSpace}>
            <h3 className={classes.itemSpace}>Item Total</h3>
            <h3>{totalQuantity}</h3>
            <h3>
              {totalItemprice} {orderView.orderCurrency}
            </h3>
          </div>
          <div className={classes.columnSpaced}>
            <h3 style={{ marginLeft: "20px" }}>Tax</h3>

            <h3 style={{ marginLeft: "50px" }}>
              {totalItemsTax} {orderView.orderCurrency}
            </h3>
          </div>
          <div className={classes.columnSpaced}>
            <h3>Total Cost</h3>

            <h3>
              {orderView?.orderFinalAmt} {orderView.orderCurrency}
            </h3>
          </div> */}
    </PageContainer>
  );
};

export default OrdersView;
