import { Box, Flex } from "@chakra-ui/react";
import { TextHighlight, TextMedium } from "../ui/text/text";
import { events } from "../user/user-index/user-index-sample-data";
import EventItem from "../user/user-index/user-index-event-item";

const PromotedEventsAd = (props) => {
  return (
    <Box my={2}>
      <TextHighlight>Promoted Events</TextHighlight>
      <Flex gap={4} my={3} align="center"  direction={{base:"column",sm:"row"}}>
        {events.map(({ event_img, event_name, event_place }, idx) => (
          <EventItem
            key={idx}
            event_img={event_img}
            event_name={event_name}
            event_place={event_place}
          />
        ))}
      </Flex>
    </Box>
  );
};

export default PromotedEventsAd;
