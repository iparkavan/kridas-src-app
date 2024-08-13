import { makeStyles } from "@material-ui/core";
import React from "react";
import PageContainer from "../../common/layout/components/PageContainer";
import ProductsList from "../../marketPlace/products/ProductsList"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "10px",
  },
}));

const ProductsIndex = () => {
  const classes = useStyles();

  return (
    <PageContainer heading="Products">
      <div className={classes.root}>
        <ProductsList />
      </div>
    </PageContainer>
  );
};

export default ProductsIndex;
