import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { HeadingMedium } from "../../ui/heading/heading";
import { EventsIcon } from "../../ui/icons";
import { TextSmall } from "../../ui/text/text";

function PageEventCreateButton() {
  const router = useRouter();
  const { pageId } = router.query;
  return (
    <Flex
      gap={10}
      alignItems="center"
      bgColor="white"
      px={5}
      py={3}
      borderRadius={10}
    >
      <Box>
        <HeadingMedium>Events</HeadingMedium>
      </Box>
      <Button
        colorScheme="primary"
        leftIcon={<EventsIcon />}
        _focus={{ boxShadow: "none" }}
        onClick={() => router?.push(`/user/create-event?pageId=${pageId}`)}
      >
        Create Event
      </Button>
    </Flex>
  );
}

export default PageEventCreateButton;
