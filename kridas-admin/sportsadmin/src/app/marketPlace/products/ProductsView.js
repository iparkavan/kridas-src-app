import { Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Skeleton } from "@material-ui/lab";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import useHttp from "../../../hooks/useHttp";
import PageContainer from "../../common/layout/components/PageContainer";
import CompanyConfig from "../../company/config/CompanyConfig";
import CategoryConfig from "../../master/category/config/CategoryConfig";
import MarketPlaceConfig from "../config/MarketPlaceConfig";

const useStyles = makeStyles((theme) => ({
  sectionSpace: {
    margin: "20px 0 0px 0",
  },
  flexGap: {
    display: "flex",
    justifyContent: "space-between",
    margin: "0 18rem 0 0",
  },
  divider: {
    width: "30rem",
    height: "2px",
  },
  spaceBottom: {
    margin: "10px 0px 3rem 0",
  },
  totalMargin: {
    margin: "3%",
  },
  boldText: {
    fontWeight: "700",
  },
  prodImg: {
    width: "300px",
    height: "150px",
    borderRadius: "10px",
    objectFit: "cover",
  },
  skeleton: {
    margin: "50px",
    height: "200px",
  },
}));

const ProductsView = () => {
  const history = useHistory();
  const classes = useStyles();
  const { sendRequest: productReq, isLoading: isProductLoading } = useHttp();
  const { sendRequest: sportReq, isLoading: isSportLoading } = useHttp();
  const { sendRequest: categoryReq, isLoading: isCategoryLoading } = useHttp();
  const { sendRequest: companyReq, isLoading: isCompanyLoading } = useHttp();

  let { productId } = useParams();
  console.log(productId)

  const [productView, setProductView] = useState();
  const [sportsData, setSportsData] = useState();
  const [categoryData, setCategoryData] = useState();
  const [companyData, setCompanyData] = useState();

  const categoryId = productView?.productCategories?.[0]?.categoryId;
  const sportsId = productView?.productCategories?.[1]?.categoryId;
  const companyId = productView?.companyId;

  useEffect(() => {
    const config = MarketPlaceConfig.getProducts(productId);
    const transformProductViewData = (data) => {
      setProductView(data);
    };
    productReq(config, transformProductViewData);
  }, [productReq, productId]);

  useEffect(() => {
    if (categoryId) {
      const categoryConfig = CategoryConfig.getCategortyById(categoryId);
      const transformCategoryData = (data) => {
        setCategoryData(data);
      };
      categoryReq(categoryConfig, transformCategoryData);
    }
  }, [categoryReq, categoryId]);

  useEffect(() => {
    if (sportsId) {
      const sportsConfig = CategoryConfig.getCategortyById(sportsId);
      const transformSportsData = (data) => {
        setSportsData(data);
      };
      sportReq(sportsConfig, transformSportsData);
    }
  }, [sportReq, sportsId]);

  useEffect(() => {
    if (companyId) {
      const companyConfig = CompanyConfig.getCompanyById(companyId);
      const transformCompanyData = (data) => {
        setCompanyData(data);
      };
      companyReq(companyConfig, transformCompanyData);
    }
  }, [companyReq, companyId]);

  const Backbtn = () => {
    history.push(`/marketplace/products`);
  };

  let status;
  if (productView) {
    if (productView.availabilityStatus === "AVL") {
      status = "Available";
    } else {
      status = "Not Available";
    }
  }

  if (
    isProductLoading ||
    isSportLoading ||
    isCategoryLoading ||
    isCompanyLoading
  ) {
    return <Skeleton className={classes.skeleton} />;
  }

  return (
    <>
      <PageContainer
        heading="Product Details"
        isBackButon={true}
        onAction={Backbtn}
      >
        <div className={classes.totalMargin}>
          <div className={classes.sectionSpace}>
            <div className={classes.flexGap}>
              <div>
                <span className={classes.boldText}>Product Name</span>
                <Divider className={classes.divider}></Divider>
                <p className={classes.spaceBottom}>{productView.productName}</p>
              </div>
              <div>
                <span className={classes.boldText}>Page Name</span>
                <Divider className={classes.divider}></Divider>
                <p className={classes.spaceBottom}>
                  {companyData.data.company_name}
                </p>
              </div>
            </div>

            <div className={classes.flexGap}>
              {/* <div>
                <span className={classes.boldText}>Product Type</span>
                <Divider className={classes.divider}></Divider>
                <p className={classes.spaceBottom}>
                  {productView.productTypeId}
                </p>
              </div> */}
              <div>
                <span className={classes.boldText}>Status</span>
                <Divider className={classes.divider}></Divider>
                <p className={classes.spaceBottom}>{status}</p>
              </div>
              <div>
                <span className={classes.boldText}>Sports</span>
                <Divider className={classes.divider}></Divider>
                <p className={classes.spaceBottom}>
                  {sportsData.data.category_name}
                </p>
              </div>
            </div>

            <div className={classes.flexGap}>
              <div>
                <span className={classes.boldText}>Category</span>
                <Divider className={classes.divider}></Divider>
                <p className={classes.spaceBottom}>
                  {categoryData.data.category_name}
                </p>
              </div>
              <div>
                <span className={classes.boldText}>Cost</span>
                <Divider className={classes.divider}></Divider>
                <p className={classes.spaceBottom}>
                  {productView.productPricing?.productBasePrice}
                </p>
              </div>
            </div>

            <div className={classes.flexGap}>
              <div>
                <span className={classes.boldText}>Quantity</span>
                <Divider className={classes.divider}></Divider>
                <p className={classes.spaceBottom}>{productView.quantity}</p>
              </div>
              <div>
                <span className={classes.boldText}>Terms & Conditions</span>
                <Divider className={classes.divider}></Divider>
                <p className={classes.spaceBottom}>{productView.productName}</p>
              </div>
            </div>

            <div>
              <span className={classes.boldText}>Product Image</span>
              <Divider className={classes.divider}></Divider>
              <p className={classes.spaceBottom}>
                <img
                  className={classes.prodImg}
                  src={productView.productMediaList[0].productMediaUrl}
                  alt="productImage"
                />
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default ProductsView;
