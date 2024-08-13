import React from "react";
import UserLayout from "../../common/user-layout";
import PageLayout from "../../common/page-layout";
import ProductList from "./product-list";
import { useNavigate } from "react-router-dom";

const ProductIndex = () => {
  const navigate = useNavigate();

  const backkBtn = () => {
    navigate("/");
  };

  return (
    <UserLayout>
      <PageLayout heading="Products" isBackButton="true" onAction={backkBtn}>
        <ProductList />
      </PageLayout>
    </UserLayout>
  );
};

export default ProductIndex;
