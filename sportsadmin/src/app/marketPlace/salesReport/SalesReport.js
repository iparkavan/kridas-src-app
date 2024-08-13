import React from "react";
import PageContainer from "../../common/layout/components/PageContainer";
import { makeStyles } from "@material-ui/core";
import SalesList from "./SalesList";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "10px",
  },
}));

const SalesIndex = () => {
  const classes = useStyles();

  return (
    <PageContainer heading="Products">
      <div className={classes.root}>
        <SalesList />
      </div>
    </PageContainer>
  );
};

export default SalesIndex;
