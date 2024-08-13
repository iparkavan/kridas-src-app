import React from "react";
import PageLayout from "../common/page-layout";
import PageList from "./page-list";
import { useNavigate } from "react-router-dom";
import UserLayout from "../common/user-layout";

const PageIndex = () => {
  const navigate = useNavigate();
  const backBtn = () => {
    navigate("/");
  };
  return (
    <UserLayout>
      <PageLayout heading="Page List" isBackButton="true" onAction={backBtn}>
        <PageList />
      </PageLayout>
    </UserLayout>
  );
};

export default PageIndex;
