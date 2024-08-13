import { Tab, TabList, Tabs, useBreakpointValue } from "@chakra-ui/react";

const UserProfileTabs = (props) => {
  const { tabIndex, setTabIndex, ...otherProps } = props;

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
        <UserProfileTab>Posts</UserProfileTab>
        <UserProfileTab>About</UserProfileTab>
        {/* <UserProfileTab>Followers</UserProfileTab> */}
        <UserProfileTab>Media</UserProfileTab>
        {/* <UserProfileTab>Videos</UserProfileTab> */}
      </TabList>
    </Tabs>
  );
};

export default UserProfileTabs;
