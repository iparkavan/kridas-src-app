import {
  Box,
  Checkbox,
  HStack,
  Image,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { HeadingXtraSmall } from "../../ui/heading/heading";
import { TextSmall } from "../../ui/text/text";
import { useEventFollowersData } from "../../../hooks/event-hook";

const EventDataWithCheckBox = ({ eventData, onCheckBoxHandler }) => {
  const {
    event_banner,
    event_name,
    event_id,
    event_status,
    event_startdate,
    event_enddate,
  } = eventData;

  const { data: eventFollowersData } = useEventFollowersData(event_id);

  return (
    <HStack w={"full"} alignContent={"center"} justifyContent={"flex-start"}>
      <Box position={"relative"} w={"20"}>
        <Image
          h="16"
          w="16"
          rounded={"full"}
          src={event_banner ? event_banner : "/images/no-banner-image-page.jpg"}
          objectFit={"cover"}
          alt="No-Banner"
        />
      </Box>
      <HStack
        w={"full"}
        alignContent={"center"}
        justifyContent={"space-between"}
      >
        <VStack alignContent={"center"} justifyContent={"center"}>
          <HeadingXtraSmall
          // wordBreak="break-word"
          // textOverflow="ellipsis"
          // maxWidth={"95%"}
          // isTruncated
          >
            <Tooltip label={event_name} fontSize="md">
              {event_name}
            </Tooltip>
          </HeadingXtraSmall>
          <TextSmall color="primary.500" fontWeight="500">
            {eventFollowersData?.event?.category_name}
          </TextSmall>
        </VStack>
        <Box>
          <Checkbox
            // isChecked={selectedVoucher.voucherId}
            onChange={(e) => onCheckBoxHandler(event_id, e.target.checked)}
            size="lg"
          />
        </Box>
      </HStack>
    </HStack>
  );
};

export default EventDataWithCheckBox;
