import React, { useRef, useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  AvatarGroup,
  Box,
  VStack,
  Heading,
  Divider,
  Text,
  Flex,
} from "@chakra-ui/react";
import UserProfileTab from "../profile-section/user-profile-tab";
import {
  CategoryIcon,
  HeartIcon,
  KeyIcon,
  PersonCircleIcon,
  TrophyIcon,
  CircularProgress,
} from "../../ui/icons";

import { useUser } from "../../../hooks/user-hooks";
import { useRouter } from "next/router";
import UserProfileSections from "../profile-section/user-profile-sections";
import ViewUserInterests from "../profile-section/view-user-interests";
import ViewUserDetails from "../profile-section/view-user-details";
import ViewSocialLinks from "../../social/view-social-links";
import ViewUserStatistics from "../profile-section/view-user-statistics";

import { useFeedInfiniteByUserId } from "../../../hooks/feed-hooks";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import FeedPost from "../../feed/feed-post";
import { useUserStatistics } from "../../../hooks/user-statistics-hooks";

function UserCommonTab({ userData }) {
  const [mode, setMode] = useState("view");
  const loadMoreRef = useRef();
  const {
    data: feedData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    isLoading,
  } = useFeedInfiniteByUserId(userData?.["user_id"]);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });
  console.log(feedData, "feed data");

  const { data: statisticsData = [] } = useUserStatistics(userData["user_id"]);

  return (
    <>
      <Tabs defaultIndex={Tab ? 0 : 2} variant="unstyled">
        <TabList gap={5} color="#2F80ED" bg="white" fontSize={10} h={10}>
          <Tab _selected={{ borderBottom: "solid black" }}>Posts</Tab>
          <Tab _selected={{ borderBottom: "solid black" }}>About</Tab>
          <Tab _selected={{ borderBottom: "solid black" }}>Followers</Tab>
          <Tab _selected={{ borderBottom: "solid black" }}>Photos</Tab>
          <Tab _selected={{ borderBottom: "solid black" }}>Videos</Tab>
        </TabList>

        <Flex gap={5} mt="2">
          <TabPanels>
            <TabPanel p={0}>
              <Box>
                {isLoading
                  ? "Loading..."
                  : error
                  ? "An error has occurred: " + error.message
                  : feedData?.pages?.map((page) => {
                      return page?.content?.map((feed) => (
                        <FeedPost key={feed["feed_id"]} feed={feed} />
                      ));
                    })}
                <span ref={loadMoreRef} />
                {isFetchingNextPage && (
                  <CircularProgress
                    alignSelf="center"
                    isIndeterminate
                    size="24px"
                  />
                )}
              </Box>
            </TabPanel>
            <TabPanel p={0}>
              <Tabs
                padding={2}
                orientation="vertical"
                variant="unstyled"
                onChange={() => setMode("view")}
                isLazy
                w="70%"
              >
                <TabList w="50%">
                  <UserProfileTab tabIcon={PersonCircleIcon}>
                    Profile
                  </UserProfileTab>
                  <UserProfileTab tabIcon={HeartIcon}>
                    Social Presence
                  </UserProfileTab>
                  <UserProfileTab tabIcon={TrophyIcon}>
                    Sports Statistics
                  </UserProfileTab>
                  <UserProfileTab tabIcon={CategoryIcon}>
                    Interests
                  </UserProfileTab>
                </TabList>
                <TabPanels bg="white">
                  <TabPanel>
                    <VStack gap={3} mt={5}>
                      <ViewUserDetails userData={userData} />
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <VStack gap={3} mt={5}>
                      <ViewSocialLinks socials={userData?.["social"]} />
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <VStack gap={3} mt={5}>
                      <ViewUserStatistics
                        statisticsData={statisticsData}
                        type="public"
                      />
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <VStack gap={3} mt={5}>
                      <ViewUserInterests
                        sportsInterested={userData["sports_interested"]}
                      />
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </TabPanel>
            <TabPanel p={0}>follower</TabPanel>
            <TabPanel p={0}>
              <p>Photos</p>
            </TabPanel>
            <TabPanel p={0}>
              <p>Videos</p>
            </TabPanel>
          </TabPanels>
        </Flex>
      </Tabs>
    </>
  );
}

export default UserCommonTab;
