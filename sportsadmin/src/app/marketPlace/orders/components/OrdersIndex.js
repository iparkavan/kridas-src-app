import React from "react";
import PageContainer from "../../../common/layout/components/PageContainer";
import { makeStyles } from "@material-ui/core";
import OrdersList from "./OrdersList";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "10px",
  },
}));

const OrdersIndex = () => {
  const classes = useStyles();

  return (
    <PageContainer heading="Orders">
      <div className={classes.root}>
        <OrdersList />
      </div>
    </PageContainer>
  );
};

export default OrdersIndex;
