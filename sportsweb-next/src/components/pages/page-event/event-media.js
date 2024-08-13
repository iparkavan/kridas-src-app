import { Flex, VStack } from "@chakra-ui/react";
import { HeadingMedium } from "../../ui/heading/heading";
import { VideoIcon } from "../../ui/icons";
import EventPhotos from "./page-event-photos";
import EventVideos from "./page-event-videos";

function EventMedia({ currentEvent, eventData }) {
  return (
    <VStack spacing={4} align="stretch">
      <EventPhotos eventData={eventData} currentEvent={currentEvent} />
      <Flex
        bg="#ffffff"
        p={4}
        w="full"
        h="max-content"
        align="center"
        justify="flex-start"
        gap="3"
        direction={{ base: "column", md: "row" }}
        border="1px solid #e6ecf5"
        borderRadius="5px"
      >
        <VideoIcon size={25} />
        <HeadingMedium>VIDEOS</HeadingMedium>
      </Flex>
      <EventVideos eventData={eventData} currentEvent={currentEvent} />
    </VStack>
  );
}

export default EventMedia;
