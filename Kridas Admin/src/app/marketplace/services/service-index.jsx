import React from "react";
import PageLayout from "../../common/page-layout";
import { useNavigate } from "react-router-dom";
import ServiceList from "./service-list";
import UserLayout from "../../common/user-layout";

const ServiceIndex = () => {
  const navigate = useNavigate();
  const backkBtn = () => {
    navigate("/");
  };

  return (
    <UserLayout>
      <PageLayout heading="Services" isBackButton="true" onAction={backkBtn}>
        <ServiceList />
      </PageLayout>
    </UserLayout>
  );
};

export default ServiceIndex;
