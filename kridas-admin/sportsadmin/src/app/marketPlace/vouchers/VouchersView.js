import { Divider, makeStyles } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import moment from "moment/moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
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

const VouchersView = () => {
  const history = useHistory();
  const classes = useStyles();

  const { sendRequest: voucherReq, isLoading: isVoucherLoading } = useHttp();
  const { sendRequest: sportReq, isLoading: isSportLoading } = useHttp();
  const { sendRequest: companyReq, isLoading: isCompanyLoading } = useHttp();

  let { voucherId } = useParams();

  const [voucherView, setVoucherView] = useState();
  const [sportsData, setSportsData] = useState();
  const [companyData, setCompanyData] = useState();

  console.log(voucherView);

  const sportsId = voucherView?.productCategories?.[0]?.categoryId;
  const companyId = voucherView?.companyId;

  useEffect(() => {
    const config = MarketPlaceConfig.getProducts(voucherId);
    const transformvoucherViewData = (data) => {
      setVoucherView(data);
    };
    voucherReq(config, transformvoucherViewData);
  }, [voucherReq, voucherId]);

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

  let status;
  if (voucherView) {
    if (voucherView.availabilityStatus === "AVL") {
      status = "Available";
    } else {
      status = "Not Available";
    }
  }

  if (isVoucherLoading || isSportLoading || isCompanyLoading) {
    return <Skeleton className={classes.skeleton} />;
  }

  const validTill = moment(voucherView.voucher.redemptionTillDate).format("L");

  const Backbtn = () => {
    history.push(`/marketplace/vouchers`);
  };

  return (
    <>
      <PageContainer
        heading="Vouchers Details"
        isBackButon={true}
        onAction={Backbtn}
      >
        <div className={classes.totalMargin}>
          <div className={classes.sectionSpace}>
            <div className={classes.flexGap}>
              <div>
                <span className={classes.boldText}>Product Name</span>
                <Divider className={classes.divider}></Divider>
                <p className={classes.spaceBottom}>{voucherView.productName}</p>
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
              <div>
                <span className={classes.boldText}>Valid Till</span>
                <Divider className={classes.divider}></Divider>
                <p className={classes.spaceBottom}>{validTill}</p>
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
                <span className={classes.boldText}>Quantity</span>
                <Divider className={classes.divider}></Divider>
                <p className={classes.spaceBottom}>{voucherView.quantity}</p>
              </div>
              <div>
                <span className={classes.boldText}>Cost</span>
                <Divider className={classes.divider}></Divider>
                <p className={classes.spaceBottom}>
                  {voucherView.productPricing?.productBasePrice}
                </p>
              </div>
            </div>

            <div className={classes.flexGap}>
              <div>
                <span className={classes.boldText}>Terms & Conditions</span>
                <Divider className={classes.divider}></Divider>
                <p className={classes.spaceBottom}>{voucherView.productName}</p>
              </div>
              <div>
                <span className={classes.boldText}>Status</span>
                <Divider className={classes.divider}></Divider>
                <p className={classes.spaceBottom}>{status}</p>
              </div>
            </div>

            <div>
              <span className={classes.boldText}>Product Image</span>
              <Divider className={classes.divider}></Divider>
              <p className={classes.spaceBottom}>
                <img
                  className={classes.prodImg}
                  src={voucherView.productMediaList[0].productMediaUrl}
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

export default VouchersView;
