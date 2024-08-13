import { useState, useEffect } from "react";
import { useParams } from "react-router";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import PageContainer from "../../common/layout/components/PageContainer";
import useHttp from "../../../hooks/useHttp";
import companyConfig from "../../company/config/CompanyConfig";
import VendorOnboardingView from "./VendorOnboardingView";
import { useHistory } from "react-router-dom";

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

const VendorOnboardingDetail = (props) => {
  const [value, setValue] = useState(0);
  const [, setCompanyTypes] = useState({});
  let { companyId } = useParams();
  if (!companyId) companyId = props.companyId;

  const { isLoading, sendRequest } = useHttp();
  const [, setClear] = useState({});
  let history = useHistory();

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

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const Backbtn = () => {
    history.push(`/vendor-onboarding`);
  };

  return (
    <>
      <PageContainer
        heading="Vendor Onboarding Detail"
        isBackButon={true}
        onAction={Backbtn}
      >
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
                <Tab label="Vendor Onboarding Details" {...a11yProps(0)} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              <VendorOnboardingView companyId={companyId} />
            </TabPanel>
          </>
        )}
      </PageContainer>
    </>
  );
};

export default VendorOnboardingDetail;
