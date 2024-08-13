import {
  AspectRatio,
  Box,
  Center,
  Divider,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdLiveTv } from "react-icons/md";
import { HeadingMedium } from "../../ui/heading/heading";
import Skeleton from "../../ui/skeleton";
import { TextMedium } from "../../ui/text/text";

function LiveStream({ eventData, isLoadingEvent }) {
  if (isLoadingEvent) {
    return <Skeleton minH={"100vh"} w="full" />;
  }
  return (
    <VStack alignItems="flex-start" gap={10}>
      {/* <HStack gap={4}>
        <MdLiveTv size={30} />
        <HeadingMedium>Event Live Stream</HeadingMedium>
      </HStack> */}
      <HStack gap={4}>
        <MdLiveTv size={30} />
        <HeadingMedium>No Live Stream at the moment</HeadingMedium>
      </HStack>
    </VStack>
  );

  // eventData?.stream_url?.length > 0 ?
}

export default LiveStream;
