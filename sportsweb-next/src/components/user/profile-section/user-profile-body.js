import { Box, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import UserFeedList from "../user-feeds/user-feed-list";
import UserProfileAbout from "./user-profile-about";
import UserFollowersProfile from "../user-followers-profile";
import UserPhotos from "../user-photos";
import UserVideos from "../user-videos";
import { useUserFollowersById } from "../../../hooks/user-hooks";
import UserMedia from "./user-profile-edit/user-profile-media";

const UserProfileBody = (props) => {
  const { currentUser, userData, tabIndex } = props;
  // Show loading state somewhere?
  const { data: userFollowersData = {}, isLoading: isFollowersLoading } =
    useUserFollowersById(userData?.user_id);

  const UserProfileTabPanel = (tabpanelProps) => (
    <TabPanel
      // border="1px solid"
      // borderColor="gray.200"
      // borderRadius="lg"
      // p={6}
      p={0}
      {...tabpanelProps}
    />
  );

  return (
    <Box mt={6} p={6} bg="white" borderRadius="xl">
      <Tabs index={tabIndex} isLazy>
        <TabPanels>
          <UserProfileTabPanel>
            <UserFeedList userData={userData} />
          </UserProfileTabPanel>
          <UserProfileTabPanel
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            p={6}
          >
            <UserProfileAbout userData={userData} currentUser={currentUser} />
          </UserProfileTabPanel>
          {/* <UserProfileTabPanel>
            <UserFollowersProfile
              userFollowersData={userFollowersData}
              userId={userData.user_id}
            />
          </UserProfileTabPanel> */}
          <UserProfileTabPanel>
            <UserMedia userData={userData} currentUser={currentUser} />
            {/* <UserPhotos userData={userData} currentUser={currentUser} /> */}
          </UserProfileTabPanel>
          {/* <UserProfileTabPanel>
            <UserVideos userData={userData} />
          </UserProfileTabPanel> */}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default UserProfileBody;
