import React from "react";
import PageLayout from "../../common/page-layout";
import { useNavigate, useParams } from "react-router-dom";
import { useProductById } from "../../../hooks/product-hook";
import LabelText from "../../UI/text/label-text";
import { TextMedium } from "../../UI/text/text";
import { usePage } from "../../../hooks/page-hooks";
import { useCategoryById } from "../../../hooks/category-hooks";
import { Skeleton } from "@mui/material";
import UserLayout from "../../common/user-layout";

const ServiceView = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const { data: serviceData, isLoading: isServiceLoading } =
    useProductById(serviceId);

  const pageId = serviceData?.companyId;
  const { data: pageData, isLoading: isPageDataLoading } = usePage(pageId);

  const productCategoryId = serviceData?.productCategories[0].categoryId;
  const { data: productCategoryData, isLoading: productCategoryLoading } =
    useCategoryById(productCategoryId);

  const sportCategotyId = serviceData?.productCategories[1].categoryId;
  const { data: sportCategoryData, isLoading: sportCategoryLoading } =
    useCategoryById(sportCategotyId);

  const backkBtn = () => {
    navigate("/marketplace/services");
  };

  let status;

  if (serviceData?.availabilityStatus === "AVL") {
    status = "Available";
  } else {
    status = "Not Available";
  }

  return (
    <UserLayout>
      <PageLayout
        heading="Service Details"
        isBackButton={true}
        onAction={backkBtn}
      >
        {isServiceLoading ||
        isPageDataLoading ||
        sportCategoryLoading ||
        productCategoryLoading ? (
          <Skeleton />
        ) : (
          <div className="flex gap-10 justify-start">
            <img
              className="w-[300px] h-[150px] object-cover rounded-xl"
              src={serviceData.productMediaList[0].productMediaUrl}
              alt="Product Image"
            />

            <div className="flex gap-20 justify-center">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <LabelText>Product Name :</LabelText>
                  <TextMedium>{serviceData.productName}</TextMedium>
                </div>
                <div className="flex gap-3 ml-[60px]">
                  <LabelText>Status :</LabelText>
                  <TextMedium>{status}</TextMedium>
                </div>
                <div className="flex gap-3 ml-[38px]">
                  <LabelText>Category :</LabelText>
                  <TextMedium>{productCategoryData.category_name}</TextMedium>
                </div>
                <div className="flex gap-3 ml-[42px]">
                  <LabelText>Quantity :</LabelText>
                  <TextMedium>{serviceData.quantity}</TextMedium>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <LabelText>Page Name :</LabelText>
                  <TextMedium>{pageData.company_name}</TextMedium>
                </div>
                <div className="flex gap-3 ">
                  <LabelText>Sports :</LabelText>
                  <TextMedium>{sportCategoryData.category_name}</TextMedium>
                </div>
                <div className="flex gap-3 ">
                  <LabelText>Cost :</LabelText>
                  <TextMedium>
                    {serviceData.productPricing.productBasePrice}
                  </TextMedium>
                </div>
                <div className="flex gap-3 ">
                  <LabelText>Terms & Conditions :</LabelText>
                  <TextMedium>{serviceData.productName}</TextMedium>
                </div>
              </div>
            </div>
          </div>
        )}
      </PageLayout>
    </UserLayout>
  );
};

export default ServiceView;
