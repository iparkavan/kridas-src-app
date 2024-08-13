import React, { useState } from "react";
import { commonHeaderPageData } from "../../data/common-header-page-data";
import PageInformationEdit from "./page-information-edit";
import PageVerificationEdit from "./page-verification-edit";
import PageBankDetailsEdit from "./page-bank-details-edit";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../common/page-layout";
import UserLayout from "../../common/user-layout";
import { useGetCompanyId } from "../../../hooks/page-hooks";

const EditCommonHeaderPage = () => {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const { companyId } = useParams();

  const { data: companyDetails, isLoading: isCompanyDetailsLoading } = useGetCompanyId(companyId);
  const pageDetails = companyDetails?.data?.data;

  const backBtn = () => {
    navigate("/pages/allpages/");
  };

  const tabHandler = (index) => {
    setTab(index);
  };

  return (
    <UserLayout>
      <PageLayout heading="Edit Page" isBackButton onAction={backBtn}>
        <div className="flex flex-wrap gap-4 bg-[#2f80ed] dark:bg-main-dark-bg first-letter: p-2 rounded-xl">
          {commonHeaderPageData.map((item, index) => {
            return (
              <div
                key={item.id}
                className={
                  tab === index
                    ? "text-[#2f80ed] cursor-pointer bg-[#edf2f7] p-2 rounded-xl text-xl font-semibold"
                    : "text-white text-xl font-semibold p-2 cursor-pointer"
                }
                onClick={() => tabHandler(index)}
              >
                {item.name}
              </div>
            );
          })}
        </div>
        <div>
          {tab === 0 && (
            <div>
              <PageInformationEdit companyDetails={pageDetails} />
            </div>
          )}
          {tab === 1 && (
            <div>
              <PageVerificationEdit />
            </div>
          )}
          {tab === 2 && (
            <div>
              <PageBankDetailsEdit />
            </div>
          )}
        </div>
      </PageLayout>
    </UserLayout>
  );
};

export default EditCommonHeaderPage;
