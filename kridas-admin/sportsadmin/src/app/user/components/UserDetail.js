import { useState } from "react";
import { useParams } from "react-router";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import PageContainer from "../../common/layout/components/PageContainer";
import UserProfile from "./UserProfile";
import UserTypeServiceProvider from "./UserTypeServiceProvider";
import UserTypeSponsorProvider from "./UserTypeSponsorProvider";
import UserSponsorSeeker from "./UserSponsorSeeker";
import { useHistory } from 'react-router-dom';
import UserStatisticsView from "./userStatistics/userStatisticsView";

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


const UserDetail = (props) => {
  const [value, setValue] = useState(0);
  let history = useHistory();

  let { userId } = useParams();
  if (userId === undefined) {
    userId = props.userId
  }
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
    history.push(`/user`);
  }

  return (
    <>
      <PageContainer heading="User Details" isBackButon={true} onAction={Backbtn}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="User Information" {...a11yProps(0)} />
            <Tab label="User Statistics" {...a11yProps(1)} />
            {/* <TabPanel value={value} index={0}>
              <UserStatisticsView userId={userId} />
            </TabPanel> */}
            {/* <Tab label="Organizer" {...a11yProps(1)} key={1} />
            <Tab label="Service Provider" {...a11yProps(2)} key={2} />
            <Tab label="Sponsor" {...a11yProps(2)} key={3} />
            <Tab label="Sponsor - Player" {...a11yProps(2)} key={4} /> */}
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <UserProfile userId={userId} />
        </TabPanel>

        {/* <TabPanel value={value} index={1}>
          <UserTypeOrganizer userId={userId} />
        </TabPanel> */}
        <TabPanel value={value} index={1}>
          <UserStatisticsView userId={userId} />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <UserTypeServiceProvider userId={userId} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <UserTypeSponsorProvider userId={userId} />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <UserSponsorSeeker userId={userId}></UserSponsorSeeker>
        </TabPanel>
      </PageContainer>
    </>
  );
};

export default UserDetail;
