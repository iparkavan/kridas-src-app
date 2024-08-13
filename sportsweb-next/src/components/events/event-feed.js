import {
  Avatar,
  Box,
  Center,
  CircularProgress,
  Flex,
  HStack,
  Input,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";

import { useIntersectionObserver } from "../../hooks/common-hooks";
import {
  useInfiniteEventPhoto,
  useInfiniteEventVideo,
} from "../../hooks/event-hook";
import { useInfiniteEventFeed } from "../../hooks/feed-hooks";

import { useUser } from "../../hooks/user-hooks";
import LatestPhotos from "../common/latest-photos";
import LatestVideos from "../common/latest-videos";
import FeedPost from "../feed/feed-post";
import PostModal from "../feed/post-modal";
import EventSponsorsCarousel from "./event-sponsors-carousel";
import EmptyContentDisplay from "../common/empty-content/empty-content-display";
import EventProductsCarousel from "../pages/page-event/event-products-carousel";

const EventFeed = ({ eventData, currentEvent, setTabIndex, sportType }) => {
  const { data: userData = {} } = useUser();
  const pageId = eventData?.eventOrganizers?.[0]?.companyId;

  // const { data: pageData = {} } = usePage(pageId);
  const loadMoreRef = useRef();

  // Show event photos and videos instead of page?
  const { data: userPhoto = [] } = useInfiniteEventPhoto(eventData?.eventId);
  const latestPhotosCount = userPhoto?.pages && userPhoto?.pages[0]?.totalCount;
  const { data: userVideo = [] } = useInfiniteEventVideo(eventData?.eventId);
  const latestVideosCount = userVideo?.pages && userVideo?.pages[0]?.totalCount;

  const {
    data: feedData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    isLoading,
  } = useInfiniteEventFeed({
    company_id: pageId,
    event_id: eventData?.eventId,
    type: currentEvent ? "E" : "U",
    login_id: currentEvent ? eventData?.eventId : userData["user_id"],
  });

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  return (
    <Center m={-6} bg="gray.100">
      <Flex gap={2} w="100%">
        <Box w={{ base: "full", lg: "65%" }}>
          {/* {currentEvent && (
            <>
              <HStack
                w="full"
                bg="white"
                p={5}
                borderRadius="10px"
                spacing={4}
                mb={3}
              >
                <Avatar
                  size="sm"
                  name={eventData["event_name"]}
                  src={eventData["event_logo"]}
                />
                <Input
                  variant="filled"
                  borderRadius="10px"
                  placeholder={`What's on your mind, ${eventData["event_name"]}?`}
                  readOnly
                  cursor="pointer"
                  onClick={onOpen}
                  _focus={{ bg: "gray.100", borderColor: "primary.500" }}
                />
              </HStack>
              <PostModal
                isOpen={isOpen}
                onClose={onClose}
                type="event"
                id={eventData?.["event_id"]}
                pageId={pageId}
                data={eventData}
              />
            </>
          )} */}

          <VStack spacing={5}>
            {isLoading
              ? "Loading..."
              : error
              ? "An error has occurred: " + error.message
              : feedData?.pages?.map((page) => {
                  return page?.content?.map((feed) => (
                    <FeedPost
                      key={feed["feed_id"]}
                      feed={feed}
                      queryKey={["event-posts", eventData?.eventId]}
                      type={currentEvent ? "event" : "user"}
                      id={
                        currentEvent ? eventData?.eventId : userData["user_id"]
                      }
                      pageId={pageId}
                      data={eventData}
                    />
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
          </VStack>
          {feedData?.pages[0]?.totalCount === 0 && (
            <EmptyContentDisplay displayText="No posts to display" />
          )}
        </Box>
        <Flex
          gap={3}
          direction="column"
          w="35%"
          display={{ base: "none", lg: "flex" }}
        >
          <EventSponsorsCarousel eventId={eventData?.eventId} />
          <EventProductsCarousel sportType={sportType} />
          {latestPhotosCount > 0 && (
            <LatestPhotos
              setTabIndex={setTabIndex}
              media={userPhoto}
              eventId={eventData?.eventId}
            />
          )}
          {latestVideosCount > 0 && (
            <LatestVideos
              setTabIndex={setTabIndex}
              media={userVideo}
              eventId={eventData?.eventId}
            />
          )}
        </Flex>
      </Flex>
    </Center>
  );
};

export default EventFeed;
