import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { makeStyles } from "@material-ui/styles";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import useHttp from "../../../hooks/useHttp";
import CompanyConfig from "../../company/config/CompanyConfig";
import CategoryConfig from "../../master/category/config/CategoryConfig";
import MarketPlaceConfig from "../config/MarketPlaceConfig";
import moment from "moment/moment";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PageContainer from "../../common/layout/components/PageContainer";

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
    display: "flex",
    width: "100%",
    justifyContent: "left",
    gap: "40px",
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
  root: {
    width: "250px",
  },
  accordianDetails: {
    flexDirection: "column",
  },
}));

const ServicesView = () => {
  const history = useHistory();
  const classes = useStyles();
  const { sendRequest: productReq, isLoading: isProductLoading } = useHttp();
  const { sendRequest: sportReq, isLoading: isSportLoading } = useHttp();
  const { sendRequest: categoryReq, isLoading: isCategoryLoading } = useHttp();
  const { sendRequest: companyReq, isLoading: isCompanyLoading } = useHttp();

  let { productId } = useParams();

  const [productView, setProductView] = useState();
  const [sportsData, setSportsData] = useState();
  const [categoryData, setCategoryData] = useState();
  const [companyData, setCompanyData] = useState();

  // console.log(productView);

  const categoryId = productView?.productCategories?.[0]?.categoryId;
  const sportsId = productView?.productCategories?.[1]?.categoryId;
  const companyId = productView?.companyId;

  //=============================================================================

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
      sportReq(categoryConfig, transformCategoryData);
    }
  }, [sportReq, categoryId]);

  useEffect(() => {
    if (sportsId) {
      const sportsConfig = CategoryConfig.getCategortyById(sportsId);

      const transformSportsData = (data) => {
        setSportsData(data);
      };
      categoryReq(sportsConfig, transformSportsData);
    }
  }, [categoryReq, sportsId]);

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
    history.push(`/marketplace/services`);
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

  // CALENDAR TYPE
  const isCalendarType =
    productView?.services?.serviceWeeklySchedules.length > 0;

  let type;
  if (productView) {
    if (isCalendarType) {
      type = "Calendar Type";
    } else {
      type = "One Time Purchase";
    }
  }

  console.log(type);

  return (
    <>
      <PageContainer
        heading="Service Details"
        isBackButon={true}
        onAction={Backbtn}
      >
        <div className={classes.totalMargin}>
          <div className={classes.sectionSpace}>
            <div className={classes.flexGap}>
              <div>
                <span className={classes.boldText}>Service Name</span>
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
              <div>
                <span className={classes.boldText}>Service Type</span>
                <Divider className={classes.divider}></Divider>
                <p className={classes.spaceBottom}>
                  {type}
                </p>
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
                <span className={classes.boldText}>Terms & Conditions</span>
                <Divider className={classes.divider}></Divider>
                <p className={classes.spaceBottom}>
                  {productView.services?.serviceTerms}
                </p>
              </div>

              <div>
                <span className={classes.boldText}>Inclusions</span>
                <Divider className={classes.divider}></Divider>
                <p className={classes.spaceBottom}>
                  {productView.services?.inclusions}
                </p>
              </div>
            </div>

            {isCalendarType && (
              <div>
                <div>
                  <span className={classes.boldText}>Available Slots</span>
                  <Divider className={classes.divider}></Divider>
                  <p className={classes.spaceBottom}>
                    {productView.services.serviceWeeklySchedules.map((day) => (
                      <div className={classes.root}>
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            // aria-controls="panel1a-content"
                            // id="panel1a-header"
                          >
                            <Typography>{day.weekDay}</Typography>
                          </AccordionSummary>
                          <AccordionDetails
                            className={classes.accordianDetails}
                          >
                            {day.weeklyScheduleDetails.map((slot) => {
                              const startTime = moment(slot.startTime).format(
                                "LT"
                              );
                              const endTime = moment(slot.endTime).format("LT");

                              return (
                                <Typography>
                                  {startTime} - {endTime}
                                </Typography>
                              );
                            })}
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    ))}
                  </p>
                </div>
              </div>
            )}

            <div>
              <span className={classes.boldText}>Service Image</span>
              <Divider className={classes.divider}></Divider>
              <p className={classes.spaceBottom}>
                <img
                  className={classes.prodImg}
                  src={productView.productMediaList[0].productMediaUrl}
                  alt="productImage"
                />
              </p>
            </div>

            <div>
              <span className={classes.boldText}>Status</span>
              <Divider className={classes.divider}></Divider>
              <p className={classes.spaceBottom}>{status}</p>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default ServicesView;
