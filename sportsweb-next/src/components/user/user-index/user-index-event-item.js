import { Flex, Image } from "@chakra-ui/react";
import { HeadingSmall } from "../../ui/heading/heading";
import { TextSmall } from "../../ui/text/text";

function EventItem({ event_img, event_name, event_place }) {
  return (
    <Flex w='full'  direction="column" borderRadius="10px" overflow="hidden">
      <Image
        src={event_img}
        alt="event"
        w="full"
        height="190"
        objectFit="cover"
      />
      <Flex
        p={3}
        align="center"
        justify="center"
        bg="white"
        w="full"
        direction="column"
        fontWeight="500"
      >
        <TextSmall isTruncated color="#262638">{event_name}</TextSmall>
        <HeadingSmall isTruncated color="#f16d75">{event_place}</HeadingSmall>
      </Flex>
    </Flex>
  );
}

export default EventItem;
