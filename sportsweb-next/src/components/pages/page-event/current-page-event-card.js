import {
  Box,
  Image,
  Flex,
  Avatar,
  Stack,
  Button,
  useColorModeValue,
  Center,
  Tooltip,
  HStack,
  LinkOverlay,
  LinkBox,
  Text,
} from "@chakra-ui/react";
import { HeadingXtraSmall } from "../../ui/heading/heading";
import { useRouter } from "next/router";
import { TextSmall, TextXtraSmall } from "../../ui/text/text";
import { differenceInCalendarDays, format } from "date-fns";
import { useEventFollowersData } from "../../../hooks/event-hook";
// import EventInterest from "./event-interest";

function CurrentPageEventCard(props) {
  const { eventData, currentPage, isParticipated = false } = props;
  const router = useRouter();
  const {
    event_banner,
    event_name,
    event_id,
    event_status,
    event_startdate,
    event_enddate,
  } = eventData;
  const { data: eventFollowersData } = useEventFollowersData(event_id);
  const diffInDays =
    differenceInCalendarDays(
      new Date(event_enddate),
      new Date(event_startdate)
    ) + 1;
  if (event_status === "PUB" || currentPage)
    return (
      <Center
        onClick={() => {
          if (event_status === "PUB") router.push(`/events/${event_id}`);
          else if (currentPage) {
            if (event_status === "DRT")
              router.push(`/user/create-event?eventId=${event_id}`);
          }
        }}
        cursor={"pointer"}
      >
        <Box
          maxW={["190px", "200px", "220px"]}
          w={["190px", "200px", "220px"]}
          bg={"white"}
          boxShadow={"xl"}
          borderRadius={"10px"}
          overflow={"hidden"}
        >
          <Box position="relative">
            <Image
              h="48"
              w={"full"}
              src={
                event_banner ? event_banner : "/images/no-banner-image-page.jpg"
              }
              objectFit={"cover"}
              alt="No-Banner"
            />
            <Box
              px={1}
              position="absolute"
              bottom="0px"
              color="#ffffff"
              bg="linear-gradient(92.33deg, #C50000 10.7%, #980000 93.27%)"
              h={"min-content"}
              w="full"
            >
              <TextXtraSmall color="inherit">
                {" "}
                {format(new Date(event_startdate), "d MMM yyyy")}
                {" - "}
                {format(new Date(event_enddate), "d MMM yyyy")}
              </TextXtraSmall>
              <TextXtraSmall>
                {" "}
                ({diffInDays === 1 ? `${diffInDays} day` : `${diffInDays} days`}
                )
              </TextXtraSmall>
            </Box>
          </Box>

          <Box p={6}>
            <Stack spacing={2} align={"flex-start"} mb={5}>
              <HeadingXtraSmall
                wordBreak="break-word"
                textOverflow="ellipsis"
                maxWidth={"95%"}
                isTruncated
              >
                <Tooltip label={event_name} fontSize="md">
                  {event_name}
                </Tooltip>
              </HeadingXtraSmall>
              <TextSmall color="primary.500" fontWeight="500">
                {eventFollowersData?.event?.category_name}
              </TextSmall>
              {currentPage && !isParticipated && (
                <Box maxWidth={"95%"}>
                  <TextSmall>
                    Status: {event_status === "PUB" ? "Published" : "Draft"}
                  </TextSmall>
                </Box>
              )}
            </Stack>
          </Box>
        </Box>
      </Center>
    );
  else return <></>;
}

export default CurrentPageEventCard;
