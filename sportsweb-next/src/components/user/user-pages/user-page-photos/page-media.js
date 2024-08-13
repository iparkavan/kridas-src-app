import { Flex, VStack } from "@chakra-ui/react";
import { HeadingMedium } from "../../../ui/heading/heading";
import { VideoIcon } from "../../../ui/icons";
import PagePhotos from "../user-pages-photos";
import PageVideos from "../user-pages-video";

function PageMedia({ pageData, currentPage }) {
  return (
    <VStack spacing={4} align="stretch">
      <PagePhotos pageData={pageData} currentPage={currentPage} />
      <Flex
        bg="#ffffff"
        p={4}
        w="full"
        h="max-content"
        align="center"
        justify="flex-start"
        gap="3"
        border="1px solid #e6ecf5"
        borderRadius="5px"
        direction={{ base: "column", md: "row" }}
      >
        <VideoIcon size={25} />
        <HeadingMedium>VIDEOS</HeadingMedium>
      </Flex>
      <PageVideos pageData={pageData} currentPage={currentPage} />
    </VStack>
  );
}

export default PageMedia;
