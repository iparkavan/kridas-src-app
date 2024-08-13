import React from "react";
import {
  Avatar,
  Box,
  Text,
  Center,
  Image,
  Flex,
  Stack,
  Button,
  useColorModeValue,
  CircularProgress,
  GridItem,
  SimpleGrid,
  Skeleton,
  VStack,
  Input,
  HStack,
} from "@chakra-ui/react";
import {
  useEvents,
  useEventsByCompanyId,
  useParticipatedEvents,
} from "../../../hooks/event-hook";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import { useRef, useCallback, useState } from "react";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import CurrentPageEventCard from "./current-page-event-card";
import { HeadingMedium } from "../../ui/heading/heading";

function PageEventList({ pageEventCount, currentPage, pageType }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pageId } = router.query;
  const [eventName, setEventName] = useState("");
  const {
    data: pageEvents = [],
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useEventsByCompanyId(pageId, eventName);
  const {
    data: participatedEvents = [],
    hasNextPage: participatedHasNextPage,
    fetchNextPage: participatedFetchNextPage,
    isFetchingNextPage: participatedIsFetchingNextPage,
    isLoading: participatedIsLoading,
    error: participatedError,
  } = useParticipatedEvents({ pageId, pageType });

  const handleChange = useCallback(
    (e) => {
      setEventName(e.target.value);
      refetch({
        refetchPage: () => {
          queryClient.invalidateQueries(["page-events", pageId, eventName]);
          return true;
        },
      });
    },
    [refetch, pageId, queryClient, eventName]
  );

  const pageEventsSearchCount =
    pageEvents?.pages && pageEvents?.pages[0]?.totalCount;

  const participatedEventsCount =
    participatedEvents?.pages && participatedEvents?.pages[0]?.totalCount;

  return (
    <Box bg="white" borderRadius={"10px"} p={5}>
      <VStack align="flex-start" spacing={5}>
        <Box>
          <HeadingMedium>Created Events</HeadingMedium>
          {pageEventCount > 0 && (
            <Input
              type="search"
              placeholder="Search Events"
              bg="#f9f9f9"
              transition="0.5s ease-out"
              borderRadius={"5px"}
              variant="outline"
              mt={4}
              _focus={{ boxShadow: "none" }}
              color="black"
              onInput={(e) => handleChange(e)}
            ></Input>
          )}
        </Box>

        <Box w="full">
          {pageEvents && isLoading ? (
            <Skeleton w="full" minH="100vh">
              Loading..
            </Skeleton>
          ) : error ? (
            "An error has occurred: " + error.message
          ) : (
            <>
              <HStack
                align={"flex-start"}
                flexWrap={"wrap"}
                spacing={0}
                gap={4}
              >
                {pageEvents?.pages?.map((page, idx) => {
                  return page?.content?.map((eventData) => {
                    return (
                      <>
                        <CurrentPageEventCard
                          eventData={eventData}
                          currentPage={currentPage}
                        />
                      </>
                    );
                  });
                })}
              </HStack>

              {hasNextPage && (
                <Button
                  mt={5}
                  variant="link"
                  colorScheme="primary"
                  fontWeight="normal"
                  isLoading={isFetchingNextPage}
                  loadingText="Loading"
                  onClick={fetchNextPage}
                >
                  Load More
                </Button>
              )}
            </>
          )}
          {pageEventCount === 0 && (
            <EmptyContentDisplay displayText="No Events to Display" p={0} />
          )}
        </Box>
      </VStack>

      <VStack mt={7} align="flex-start" spacing={5}>
        <HeadingMedium>Participated Events</HeadingMedium>

        <Box w="full">
          {participatedEvents && participatedIsLoading ? (
            <Skeleton w="full" minH="100vh">
              Loading..
            </Skeleton>
          ) : participatedError ? (
            "An error has occurred: " + error.message
          ) : (
            <>
              <HStack
                align={"flex-start"}
                flexWrap={"wrap"}
                spacing={0}
                gap={4}
              >
                {participatedEvents?.pages?.map((page, idx) => {
                  return page?.content?.map((eventData) => {
                    return (
                      <>
                        <CurrentPageEventCard
                          eventData={eventData}
                          currentPage={currentPage}
                          isParticipated={true}
                        />
                      </>
                    );
                  });
                })}
              </HStack>

              {participatedHasNextPage && (
                <Button
                  mt={4}
                  variant="link"
                  colorScheme="primary"
                  fontWeight="normal"
                  isLoading={participatedIsFetchingNextPage}
                  loadingText="Loading"
                  onClick={participatedFetchNextPage}
                >
                  Load More
                </Button>
              )}
            </>
          )}
          {participatedEventsCount === 0 && (
            <EmptyContentDisplay displayText="No Events to Display" p={0} />
          )}
        </Box>
      </VStack>
    </Box>
  );
}

export default PageEventList;
