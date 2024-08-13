import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useUserFollowersById } from "../../../hooks/user-hooks";
import UserFollowingSpecificList from "./user-following-specific-list";

const UserFollowingList = ({ userId }) => {
  const {
    data: userFollowingUsersList = {},
    isLoading: isUsersFollowingLoading,
  } = useUserFollowersById(userId, "U");
  const {
    data: userFollowingPagesList = {},
    isLoading: isPageFollowersLoading,
  } = useUserFollowersById(userId, "C");

  const selectedTab = {
    borderBottom: "solid",
    borderColor: "primary.500",
    color: "white",
    bg: "#3182CE",
    borderRadius: "5px",
  };
  // const tabOrientation = useBreakpointValue({
  //   base: "horizontal",
  //   md: "vertical",
  // });
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Tabs
      // orientation={tabOrientation}
      index={tabIndex}
      onChange={(index) => setTabIndex(index)}
      w="full"
      bgColor="white"
      size="md"
      variant={"solid-rounded"}
      borderRadius={10}
      isLazy
      minH="100vh"
    >
      <TabList
        gap={[4, 5]}
        my={3}
        justifyContent={{ base: "center", md: "flex-start" }}
      >
        <Tab
          gap={5}
          _focus={{ boxShadow: "none" }}
          p={2}
          _selected={selectedTab}
        >
          Users({userFollowingUsersList?.following?.length})
        </Tab>
        <Tab
          gap={5}
          _focus={{ boxShadow: "none" }}
          p={2}
          _selected={selectedTab}
        >
          Pages({userFollowingPagesList?.following?.length})
        </Tab>
        <Tab
          gap={5}
          _focus={{ boxShadow: "none" }}
          p={2}
          _selected={selectedTab}
        >
          Events({userFollowingUsersList?.events?.length})
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel p={0}>
          <UserFollowingSpecificList
            userFollowingData={userFollowingUsersList?.following}
          />{" "}
        </TabPanel>
        <TabPanel p={0}>
          <UserFollowingSpecificList
            userFollowingData={userFollowingPagesList?.following}
          />
        </TabPanel>
        <TabPanel p={0}>
          <UserFollowingSpecificList
            userFollowingData={userFollowingUsersList?.events}
            type="event"
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default UserFollowingList;
