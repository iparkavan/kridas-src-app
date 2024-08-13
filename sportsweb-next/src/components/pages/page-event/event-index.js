import React from "react";
import { useUser } from "../../../hooks/user-hooks";
import EventHeader from "./common-header-event";
import PageLayout from "../../layout/page-layout/page-layout";
import { useRouter } from "next/router";
import { useEventById, useEventByIdNew } from "../../../hooks/event-hook";
import { Box, Flex, HStack } from "@chakra-ui/react";
import Button from "../../ui/button";
import { ArrowLeftIcon } from "../../ui/icons";

function EventIndex() {
  const router = useRouter();
  const { eventId } = router.query;
  const { data: userData } = useUser();
  // const { data: eventData = [], isLoading } = useEventById(
  //   eventId,
  //   userData?.["user_id"]
  // );

  const { data: eventData, isLoading: isLoadingEvent } =
    useEventByIdNew(eventId);
  const currentEvent = userData?.["user_id"] === eventData?.createdBy;

  return (
    <Box>
      <HStack w="full" justify="flex-end" pb={2}>
        <Button
          variant="link"
          leftIcon={<ArrowLeftIcon />}
          onClick={() => router.back()}
        >
          Back
        </Button>
      </HStack>
      <EventHeader
        currentEvent={currentEvent}
        eventData={eventData}
        isLoadingEvent={isLoadingEvent}
      />
    </Box>
  );
}

export default EventIndex;
