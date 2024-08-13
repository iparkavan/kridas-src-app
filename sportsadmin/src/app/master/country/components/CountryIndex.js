import { makeStyles } from "@material-ui/core";
import React from "react";
import PageContainer from "../../../common/layout/components/PageContainer";
import CountryList from "../../../master/country/components/CountryList"

const useStyles = makeStyles((theme) => ({
  overNone: {
    overflow: "none"
  }
}));

const CountryIndex = () => {
  const Classes = useStyles();
  return (
    <>
      <PageContainer className={Classes.overNone} heading="Country ">
           <CountryList />       
      </PageContainer>
    </>
  )
}
export default CountryIndex;