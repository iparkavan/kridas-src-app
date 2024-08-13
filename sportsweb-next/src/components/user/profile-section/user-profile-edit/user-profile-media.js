import { Flex, StackDivider, VStack } from "@chakra-ui/react";
import React from "react";
import { HeadingMedium } from "../../../ui/heading/heading";
import { VideoIcon } from "../../../ui/icons";
import UserPhotos from "../../user-photos";
import UserVideos from "../../user-videos";

function UserMedia({ userData, currentUser }) {
  return (
    <VStack spacing={4} align="stretch">
      <UserPhotos userData={userData} currentUser={currentUser} />
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
      <UserVideos userData={userData} currentUser={currentUser} />
    </VStack>
  );
}

export default UserMedia;
