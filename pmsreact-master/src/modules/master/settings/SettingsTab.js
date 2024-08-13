import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import LookupList from "../lookup/LookupList";

const useStyles = makeStyles((theme) => ({
  tabContainer: {
    marginRight: "auto",
  },
  tab: {
    textTransform: "none",

    minWidth: 15,
    marginRight: "25px",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={0}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const SettingsTab = (props) => {
  const localClasses = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <AppBar position="static" color="transparent">
        <Tabs
          className={localClasses.tabContainer}
          indicatorColor="primary"
          scrollButtons="auto"
          variant="scrollable"
          value={value}
          onChange={handleChange}
        >
          <Tab className={localClasses.tab} label="Master Data"></Tab>
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} style={{ marginTop: "15px" }}>
        <LookupList />
      </TabPanel>
    </>
  );
};

export default SettingsTab;
