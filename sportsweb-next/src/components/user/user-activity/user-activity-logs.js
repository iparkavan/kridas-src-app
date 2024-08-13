import {
  Box,
  CircularProgress,
  HStack,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import helper from "../../../helper/helper";
import {
  useActivityInfiniteByType,
  useSearchActivityLogJava,
} from "../../../hooks/activity-hook";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import { useUser } from "../../../hooks/user-hooks";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";
import Button from "../../ui/button";
import Skeleton from "../../ui/skeleton";
import { TextSmall } from "../../ui/text/text";

function UserLogsActivity() {
  const route = useRouter();
  const { data: userData = {} } = useUser();
  const {
    data: activityDataNew,
    isLoading: isActivityLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useSearchActivityLogJava({
    activityGroup: "LOG",
    companyId: null,
    endDate: null,
    eventId: null,
    startDate: null,
    userId: userData.user_id,
    limit: 5,
  });

  const loadMoreRef = useRef();
  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  const updatedActivities = {};
  activityDataNew?.pages?.forEach((activity) => {
    if (activity) {
      return activity.forEach((activityData) => {
        const createdDate = helper.getJSDateObject(activityData.createdDate);
        const dateObj = updatedActivities[createdDate];
        if (dateObj) {
          updatedActivities[createdDate].push(activityData);
        } else {
          updatedActivities[createdDate] = [activityData];
        }
      });
    }
  });
  const formatDate = (date) => format(new Date(date), "dd-MM-yyyy");
  const formatTime = (date) => format(new Date(date), " h:mm aa");

  return (
    <>
      {activityDataNew && isActivityLoading ? (
        <Skeleton w="full" minH="100vh">
          Loading..
        </Skeleton>
      ) : error ? (
        "An error has occurred: " + error.message
      ) : Object.keys(updatedActivities)?.length > 0 ? (
        <VStack p={[0, 2, 3]} align={"flex-start"} w="full">
          {Object.keys(updatedActivities)?.map((activityKey) => (
            <Box key={activityKey} w="full">
              <TextSmall fontWeight="medium" color="primary.500">
                {formatDate(activityKey)}
              </TextSmall>
              <VStack alignItems="flex-start" spacing={2} width="full" mt={3}>
                {updatedActivities[activityKey]?.map(
                  (activity) =>
                    activity.activityOn === "USR" && (
                      <>
                        {activity?.activityType === "LGT" && (
                          <Box
                            w="full"
                            p={3}
                            borderRadius={2}
                            _hover={{
                              background: "gray.100",
                              // color: "teal.500",
                            }}
                          >
                            <HStack>
                              <TextSmall>
                                {userData.full_name} has logged out
                              </TextSmall>
                              <Spacer />
                              <TextSmall>
                                {formatTime(activity?.createdDate)}
                              </TextSmall>
                            </HStack>
                          </Box>
                        )}
                        {activity?.activityType === "LIN" && (
                          <Box
                            w="full"
                            p={3}
                            borderRadius={2}
                            _hover={{
                              background: "gray.100",
                              // color: "teal.500",
                            }}
                          >
                            <HStack>
                              <TextSmall>
                                {userData.full_name} has logged in
                              </TextSmall>
                              <Spacer />
                              <TextSmall>
                                {formatTime(activity?.createdDate)}
                              </TextSmall>
                            </HStack>
                          </Box>
                        )}
                      </>
                    )
                )}
              </VStack>
            </Box>
          ))}
        </VStack>
      ) : (
        <Box bgColor="white" px={5} py={3} borderRadius={10}>
          <EmptyContentDisplay displayText="No Activities to Display" />
        </Box>
      )}
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
  );
}

export default UserLogsActivity;
