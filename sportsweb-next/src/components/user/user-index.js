import { useRef } from "react";
import {
  Box,
  Flex,
  VStack,
  CircularProgress,
  Skeleton,
  useDisclosure,
  HStack,
  Avatar,
  Input,
} from "@chakra-ui/react";

import UserLayout from "../layout/user-layout/user-layout";
import { useUserStatistics } from "../../hooks/user-statistics-hooks";
import FeedPost from "../feed/feed-post";
// import RequestItem from "./user-index/user-index-request-item";
// import { requests } from "./user-index/user-index-sample-data";
import { useUser } from "../../hooks/user-hooks";
import {
  useInfiniteUserPhoto,
  useInfiniteUserVideo,
} from "../../hooks/media-hooks";
import { useInfiniteFeed } from "../../hooks/feed-hooks";
import { useIntersectionObserver } from "../../hooks/common-hooks";
import { verifyUser } from "../../../src/helper/constants/user-contants";
import { TextHighlight } from "../ui/text/text";
import PromotedEventsAd from "../advertisements/promoted-events-ad";
import CreatePageAd from "../advertisements/create-page-ad";
// import SponsorAd from "../advertisements/sponsor-ad";
import ProfilePercentage from "../common/profile-percentage/profile-percentage";
import LatestPhotos from "../common/latest-photos";
import LatestVideos from "../common/latest-videos";
import UserReferralCode from "./user-referral-code";
import PostModal from "../feed/post-modal";
import { HeadingMedium } from "../ui/heading/heading";
import PromotedArticles from "../advertisements/promoted-articles";

const UserIndex = (props) => {
  const { data: userData = {} } = useUser();
  const loadMoreRef = useRef();
  const { data: userPhoto = [] } = useInfiniteUserPhoto(userData?.user_id);
  const { data: userVideo = [] } = useInfiniteUserVideo(userData?.user_id);
  const latestVideosCount = userVideo?.pages && userVideo?.pages[0]?.totalCount;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    data: feedData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    isLoading,
  } = useInfiniteFeed("user", userData["user_id"]);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  const { percentage } = verifyUser(userData);

  return (
    <UserLayout>
      <Flex gap={3} mt="0">
        <Box p={0} w={{ base: "full", lg: "65%" }}>
          <HeadingMedium color="#4a4d51" fontWeight="500">
            Welcome to{" "}
            <Box
              as="span"
              display="inline-block"
              color="primary.600"
              fontWeight="bold"
            >
              KRIDAS
            </Box>
          </HeadingMedium>
          <CreatePageAd />
          {/*      <PromotedEventsAd></PromotedEventsAd> */}
          <PromotedArticles />
          <VStack display={{ lg: "none" }} spacing={3}>
            <ProfilePercentage percentage={percentage} type="user" />
            <UserReferralCode />
          </VStack>
          <Box my={3}>
            <VStack align="flex-start">
              <TextHighlight>Post Something</TextHighlight>
              <HStack w="full" bg="white" p={5} borderRadius="10px" spacing={4}>
                <Avatar
                  size="sm"
                  name={userData["full_name"]}
                  src={userData["user_profile_img"]}
                />
                <Input
                  variant="filled"
                  borderRadius="10px"
                  placeholder={`What's on your mind, ${userData["first_name"]}?`}
                  readOnly
                  cursor="pointer"
                  onClick={onOpen}
                  _focus={{ bg: "gray.100", borderColor: "primary.500" }}
                />
              </HStack>
              <PostModal
                isOpen={isOpen}
                onClose={onClose}
                type="user"
                id={userData["user_id"]}
              />
            </VStack>
          </Box>

          <TextHighlight>Your Feed</TextHighlight>
          <VStack my={3} align="flex-start" gap={4}>
            {isLoading ? (
              <Skeleton width="full" />
            ) : error ? (
              "An error has occurred: " + error.message
            ) : (
              feedData?.pages?.map((page) => {
                return page?.content?.map((feed) => (
                  <FeedPost
                    key={feed["feed_id"]}
                    feed={feed}
                    queryKey={["user-feeds"]}
                    type="user"
                    id={userData["user_id"]}
                  />
                ));
              })
            )}

            <span ref={loadMoreRef} />
            {isFetchingNextPage && (
              <CircularProgress
                alignSelf="center"
                isIndeterminate
                size="24px"
              />
            )}
          </VStack>
        </Box>
        <Flex
          gap={7}
          direction="column"
          w="35%"
          display={{ base: "none", lg: "flex" }}
        >
          <Box mt={10}>
            <ProfilePercentage percentage={percentage} type="user" />
          </Box>

          <UserReferralCode />

          {/* Commented by Mani - Sponsor related will be in Phase 2 */}
          {/* <SponsorAd></SponsorAd> */}
          {/* <VStack
            bg="white"
            w="full"
            h="min-content"
            p={4}
            align="flex-start"
            borderRadius={10}
          >
            <Text fontWeight="500" fontSize="14px">
              Connection Requests
            </Text>
            {requests.map(({ name, mutual, user_image }, idx) => (
              <RequestItem
                name={name}
                mutual={mutual}
                user_image={user_image}
                key={idx}
              />
            ))}
          </VStack> */}

          <LatestPhotos media={userPhoto} type="user" />
          {latestVideosCount > 0 && (
            <LatestVideos media={userVideo} type="user" />
          )}
        </Flex>
      </Flex>
    </UserLayout>
  );
};

export default UserIndex;
