import React from "react";
import { Tab, TabList, Tabs, useBreakpointValue } from "@chakra-ui/react";

function PageEventTab(props) {
  const {
    tabIndex,
    setTabIndex,
    currentEvent,
    // eventWithFixtures,
    // eventWithStandings,
    ...otherProps
  } = props;
  const UserProfileTab = (tabProps) => (
    <Tab
      _selected={{ color: "primary.500", fontWeight: "bold" }}
      _focus={{ boxShadow: "none", outline: "transparent" }}
      _active={{ bg: "none" }}
      fontSize="sm"
      fontWeight="medium"
      {...tabProps}
    />
  );

  const tabOrientation = useBreakpointValue({
    base: "vertical",
    md: "horizontal",
  });

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };
  return (
    <Tabs
      orientation={tabOrientation}
      index={tabIndex}
      onChange={handleTabsChange}
      isLazy
      {...otherProps}
    >
      <TabList
        bg="#eaeafb"
        py={2}
        border="none"
        w="full"
        alignItems="flex-start"
      >
        {currentEvent && <UserProfileTab>Home</UserProfileTab>}
        <UserProfileTab>Posts</UserProfileTab>
        <UserProfileTab>About</UserProfileTab>
        <UserProfileTab>Media</UserProfileTab>
        {/* <UserProfileTab>Videos</UserProfileTab> */}
        <UserProfileTab>Sponsors</UserProfileTab>
        <UserProfileTab>Teams</UserProfileTab>
        <UserProfileTab>Matches</UserProfileTab>
        <UserProfileTab>Points Table</UserProfileTab>
        <UserProfileTab>Market Place</UserProfileTab>
        {/* {eventWithFixtures && <UserProfileTab>Fixtures</UserProfileTab>}
        {eventWithStandings && <UserProfileTab>Standings</UserProfileTab>} */}
        <UserProfileTab>Live</UserProfileTab>
      </TabList>
    </Tabs>
  );
}

export default PageEventTab;
