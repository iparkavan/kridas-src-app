import React from "react";
import PageLayout from "../../common/page-layout";
import { useNavigate, useParams } from "react-router-dom";
import { useProductById } from "../../../hooks/product-hook";
import { Divider, Skeleton } from "@mui/material";
import LabelValue from "../../UI/text/label-value";
import LabelText from "../../UI/text/label-text";
import { TextMedium } from "../../UI/text/text";
import { usePage } from "../../../hooks/page-hooks";
import { useCategoryById } from "../../../hooks/category-hooks";
import UserLayout from "../../common/user-layout";

const productData = () => {
  const navigate = useNavigate();
  const { productId } = useParams();

  // const productId = "517eab7e-0b6c-4886-a788-1b95bdfc18f6";

  const { data: productData, isLoading: isProductLoading } =
    useProductById(productId);

  const pageId = productData?.companyId;
  const { data: pageData, isLoading: isPageDataLoading } = usePage(pageId);

  const productCategoryId = productData?.productCategories[0].categoryId;
  const { data: productCategoryData, isLoading: productCategoryLoading } =
    useCategoryById(productCategoryId);

  const sportCategotyId = productData?.productCategories[1].categoryId;
  const { data: sportCategoryData, isLoading: sportCategoryLoading } =
    useCategoryById(sportCategotyId);

  const backBtn = () => {
    navigate("/marketplace/products");
  };

  let status;

  if (productData?.availabilityStatus === "AVL") {
    status = "Available";
  } else {
    status = "Not Available";
  }

  return (
    <UserLayout>
      <PageLayout
        heading="Product Details"
        isBackButton={true}
        onAction={backBtn}
      >
        {isProductLoading ||
        isPageDataLoading ||
        sportCategoryLoading ||
        productCategoryLoading ? (
          <Skeleton />
        ) : (
          <div className="flex gap-10 justify-start">
            <img
              className="w-[300px] h-[150px] object-cover rounded-xl"
              src={productData.productMediaList[0].productMediaUrl}
              alt="Product Image"
            />

            <div className="flex gap-20 justify-center">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <LabelText>Product Name :</LabelText>
                  <TextMedium>{productData.productName}</TextMedium>
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
                  <TextMedium>{productData.quantity}</TextMedium>
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
                    {productData.productPricing.productBasePrice}
                  </TextMedium>
                </div>
                <div className="flex gap-3 ">
                  <LabelText>Terms & Conditions :</LabelText>
                  <TextMedium>{productData.productName}</TextMedium>
                </div>
              </div>
            </div>
          </div>
        )}
      </PageLayout>
    </UserLayout>
  );
};

export default productData;
