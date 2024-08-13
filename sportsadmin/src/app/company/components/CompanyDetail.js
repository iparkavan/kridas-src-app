import { useState, useEffect } from "react";
import { useParams } from "react-router";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import PageContainer from "../../common/layout/components/PageContainer";
import useHttp from "../../../hooks/useHttp";
import companyConfig from "../config/CompanyConfig";
import CompanyProfile from "./CompanyProfile";
import { useHistory } from "react-router-dom";

import CompanyPageVerificationView from "./CompanyPageVerificationView";
import CompanyBankDetailsView from "./CompanyBankDetailsView";

import BottomRightRectangleImage from "../../../../src/assets/bottom-right-rectangle.png";
import style from "./CompanyPageBorder.module.css";
import CompanyConfig from "../config/CompanyConfig";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
}

const CompanyDetail = (props) => {
  const [value, setValue] = useState(0);
  const [, setCompanyTypes] = useState({});
  let { companyId } = useParams();
  if (!companyId) companyId = props.companyId;
  // const [companyInfo, setCompanyInfo] = useState({});


  const { isLoading, sendRequest } = useHttp();
  const [, setClear] = useState({});
  let history = useHistory();

  // useEffect(() => {
  //   const config = CompanyConfig.getCompanyById(companyId);

  //   const transformDate = (data) => {
  //     setCompanyInfo(data.data);
  //   };

  //   sendRequest(config, transformDate);
  // }, [sendRequest, companyId]);

  
  useEffect(() => {
    const config = companyConfig.getCompanyTypesById(companyId);
    const transformDate = (data) => {
      setCompanyTypes(data);
    };
    sendRequest(config, transformDate);
    return () => {
      setClear({});
    };
  }, [sendRequest, companyId]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log(value)
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const Backbtn = () => {
    history.push(`/pages`);
  };

  return (
    <>
      <PageContainer
        heading="Company Details"
        isBackButon={true}
        onAction={Backbtn}
      >
        <img
          className={style.stripe_1}
          src={BottomRightRectangleImage}
          alt="#borderImage"
        />
        {isLoading ? (
          <>Loading...</>
        ) : (
          <>
            <AppBar position="static">
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example"
              >
                <Tab label="COMPANY INFORMATION" {...a11yProps(0)} />
                <Tab label="PAGE VERFICATION" {...a11yProps(1)} />
                {/* <Tab label="TERMS & CONDITION" {...a11yProps(2)}/> */}

                {/* <Tab label="Organizer" {...a11yProps(1)} key={1} />
                <Tab label="Service Provider" {...a11yProps(2)} key={2} />
                <Tab label="Sponsor" {...a11yProps(2)} key={3} /> */}

                <Tab label="BANK DETAILS" />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              <CompanyProfile companyId={companyId} />
            </TabPanel>

            <TabPanel value={value} index={1}>
              <CompanyPageVerificationView companyId={companyId} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <CompanyBankDetailsView companyId={companyId} />
              {/* <CompanyTypeSponsor companyId={companyId} /> */}
            </TabPanel>
          </>
        )}
      </PageContainer>
    </>
  );
};

export default CompanyDetail;
