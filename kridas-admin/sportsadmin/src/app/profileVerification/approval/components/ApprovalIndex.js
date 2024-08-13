import { makeStyles } from "@material-ui/core";
import React from "react";
import PageContainer from "../../../common/layout/components/PageContainer";
import ApprovalList from "../../approval/components/ApprovalList"

const useStyles = makeStyles((theme) => ({
  overNone: {
    overflow: "none"
  }
}));

const ApprovalIndex = () => {
  const Classes = useStyles();
  return (
    <>
      <PageContainer className={Classes.overNone} heading="Approval">
           <ApprovalList />       
      </PageContainer>
    </>
  )
}
export default ApprovalIndex;