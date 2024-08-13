import { makeStyles } from "@material-ui/core";
import React from "react";
import PageContainer from "../../../common/layout/components/PageContainer";
import LookupTypeList from "./LookupTypeList";

const useStyles = makeStyles((theme) => ({
  overNone: {
    overflow: "none"
  }
}));

const LookupTypeIndex = () => {
  const Classes = useStyles();
  return (
    <>
      <PageContainer className={Classes.overNone} heading="Lookup Type">
           <LookupTypeList />       
      </PageContainer>
    </>
  )
}
export default LookupTypeIndex;