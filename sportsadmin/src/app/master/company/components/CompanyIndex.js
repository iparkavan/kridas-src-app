import React from "react";
import PageContainer from "../../../common/layout/components/PageContainer";
import CompanyList from "../../../master/company/components/CompanyList"

const CompanyIndex = () => {

  return (
    <>
      <PageContainer  heading="Company Table">
          <CompanyList />
      </PageContainer>
    </>
  )
}
export default CompanyIndex;