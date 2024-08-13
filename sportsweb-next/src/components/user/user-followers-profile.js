import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  Skeleton,
} from "@chakra-ui/react";
import UserFollowerList from "./user-followers/user-follower-list";
import UserFollowingList from "./user-followers/user-following-list";

const UserFollowersProfile = ({ userFollowersData, userId }) => {
  const selectedTab = {
    borderBottom: "solid",
    borderColor: "primary.500",
    color: "white",
    bg: "#3182CE",
    borderRadius: "5px",
  };
  const totalFollowingCount =
    userFollowersData?.following?.length + userFollowersData?.events?.length;

  return (
    <Box>
      <Tabs defaultIndex={0} w="full" bgColor="white" borderRadius={10} p={3}>
        <TabList gap={[2, 6, 12]}>
          <Tab gap={5} _focus={{ boxShadow: "none" }} _selected={selectedTab}>
            Followers{" "} ({userFollowersData?.follower?.length})
          </Tab>
          <Tab gap={5} _focus={{ boxShadow: "none" }} _selected={selectedTab}>
            Following ({totalFollowingCount})
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel py={5} px={0}>
            <UserFollowerList
              userFollowersData={userFollowersData?.follower}
            ></UserFollowerList>
          </TabPanel>
          <TabPanel py={5} px={0}>
            <UserFollowingList userId={userId} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default UserFollowersProfile;
