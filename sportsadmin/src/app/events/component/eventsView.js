import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import useHttp from "../../../hooks/useHttp";
import PageContainer from "../../common/layout/components/PageContainer";
import { useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import EventConfig from "../config/EventConfig";
import SportsEvents from "./SportsEvents";
import EventInformations from "./EventInformations";

const useStyles = makeStyles(() => ({
  sectionSpace: {
    margin: "20px 0 0px 0",
  },
  contentSpace: {
    margin: "5px 0 0 0",
  },
  tableAlign: {
    marginTop: "20px",
  },
}));

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

const EventsView = (props) => {
  let history = useHistory();
  const [value, setValue] = useState(0);
  const { eventId } = props.match.params;
  const [, setEventDetails] = useState({});
  const { isLoading, sendRequest } = useHttp(true);

  useEffect(async () => {
    const config = await EventConfig.getEventById(eventId);
    const transformData = (data) => {
      setEventDetails(data.data);
    };
    sendRequest(config, transformData);
  }, [sendRequest, eventId]);

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
    history.push(`/events`);
  };

  return isLoading ? (
    <PageContainer
      heading="Event Details"
      isBackButon={true}
      onAction={Backbtn}
    >
      <div>Loading...</div>
    </PageContainer>
  ) : (
    <PageContainer
      heading="Event Details"
      isBackButon={true}
      onAction={Backbtn}
    >
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Event Information" {...a11yProps(0)} />
          <Tab label="Sports" {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <EventInformations eventId={eventId} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <SportsEvents eventId={eventId} />
      </TabPanel>
    </PageContainer>
  );
};

export default EventsView;
