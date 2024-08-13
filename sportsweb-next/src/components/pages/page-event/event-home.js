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
import React, { useRef } from "react";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import { useInfiniteFeed } from "../../../hooks/feed-hooks";
import { useUser } from "../../../hooks/user-hooks";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";
import EventSponsorsCarousel from "../../events/event-sponsors-carousel";
import FeedPost from "../../feed/feed-post";
import PostModal from "../../feed/post-modal";
import EventProductsCarousel from "./event-products-carousel";

function EventHome({ eventData, currentEvent, sportType }) {
  const pageId = eventData?.eventOrganizers?.[0]?.companyId;

  const { data: userData = {} } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const loadMoreRef = useRef();
  const {
    data: feedData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    isLoading,
  } = useInfiniteFeed("event", eventData?.eventId);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });
  return (
    <Center m={-6} bg="gray.100">
      <Flex gap={2} w="100%">
        <Box w={{ base: "full", lg: "65%" }}>
          {currentEvent && (
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
                  name={eventData.eventName}
                  src={eventData.eventLogo}
                />
                <Input
                  variant="filled"
                  borderRadius="10px"
                  placeholder={`What's on your mind, ${eventData?.eventName}?`}
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
                id={eventData?.eventId}
                pageId={pageId}
                data={eventData}
              />
            </>
          )}

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
                      queryKey={["event-feeds"]}
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
        </Flex>
      </Flex>
    </Center>
  );
}

export default EventHome;
