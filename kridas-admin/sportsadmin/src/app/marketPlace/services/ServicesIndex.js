import { makeStyles } from "@material-ui/core";
import React from "react";
import PageContainer from "../../common/layout/components/PageContainer";
import ServicesList from "./ServicesList";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "10px",
  },
}));

const ServicesIndex = () => {
  const classes = useStyles();

  return (
    <PageContainer heading="Services">
      <div className={classes.root}>
        <ServicesList />
      </div>
    </PageContainer>
  );
};

export default ServicesIndex;
