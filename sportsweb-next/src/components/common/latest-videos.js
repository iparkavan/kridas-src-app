import {
  VStack,
  Text,
  Flex,
  SimpleGrid,
  GridItem,
  Button,
  AspectRatio,
  Stack,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { HeadingSmall } from "../ui/heading/heading";
import { useEffect, useState } from "react";
import { AddIcon, ViewMoreIcon } from "../ui/icons";
import { TextXtraSmall } from "../ui/text/text";
import { useUser } from "../../hooks/user-hooks";
import routes from "../../helper/constants/route-constants";

const LatestVideos = ({ media, type, setTabIndex,eventId }) => {
  const { data: userData = {} } = useUser();
  const router = useRouter();
  const count = 0;
  const latestVideosCount = media?.pages && media?.pages[0]?.totalCount;
  const handleClick = () => {
    if (type === "user") {
      router.push(`${routes.profile(userData?.["user_name"])}?tab=videos`);
    } else if (type === "page") {
      const url = `/page/[pageId]`;
      const isSameUrl = router.pathname === url;
      /*   console.log(router.pathname); */
      isSameUrl
        ? setTabIndex(4)
        : router.push(
            `/page/${media?.pages[0]?.content[0]?.media_creator_company_id}?tab=videos`
          );
    }
    else if(eventId)
    setTabIndex(3)
  };
  return (
    <VStack
      bg="white"
      align="flex-start"
      h="min-content"
      p={4}
      w="full"
      borderRadius={10}
    >
      <Flex w="full">
        <HeadingSmall>Latest Videos</HeadingSmall>
        <Spacer />
        {latestVideosCount > 0 && (
          <Button
            color={"primary.500"}
            fontSize="sm"
            fontWeight={"550"}
            variant={"link"}
            onClick={handleClick}
          >
            View Videos
          </Button>
        )}
      </Flex>
      {latestVideosCount > 0 && (
        <Text>
          {latestVideosCount}
          {""}
          {latestVideosCount > 1 ? " Videos" : " Video"}
        </Text>
      )}
      <Flex w="full">
        <SimpleGrid columns={3} w="full" gap={0}>
          {media?.pages?.map((page, idx) => {
            return page?.content?.length > 0 ? (
              page?.content?.map((media, index) => {
                if (media?.media_url_meta?.resource_type === "video") {
                  count++;
                  if (count <= 5) {
                    return (
                      <GridItem colSpan={1} gap={0} key={index}>
                        <AspectRatio maxW="350px" maxH="350px" ratio={1}>
                          <video src={media.media_url} />
                        </AspectRatio>
                      </GridItem>
                    );
                  } else if (count === 6) {
                    return (
                      <GridItem colSpan={1} key={index}>
                        <VStack
                          spacing={1}
                          w="full"
                          h="full"
                          bg={"#f0f8ff"}
                          align="center"
                          justify="center"
                          onClick={handleClick}
                          color={"ActiveBorder"}
                          cursor="pointer"
                          fontWeight="500"
                        >
                          <HStack
                            w="80%"
                            bg="primary.500"
                            p={1}
                            borderRadius={"10px"}
                            opacity={0.8}
                            spacing={0}
                            justify="center"
                            _hover={{ transform: "scale(1.1)" }}
                          >
                            <ViewMoreIcon />
                            <TextXtraSmall>View more..</TextXtraSmall>
                          </HStack>
                        </VStack>
                      </GridItem>
                    );
                  } else return;
                }
              })
            ) : (
              <GridItem colSpan={1}>
                <VStack
                  w="100px"
                  h="100px"
                  bg="#f0f8ff"
                  justify="center"
                  color={"primary.500"}
                  cursor="pointer"
                  onClick={handleClick}
                  spacing={0}
                >
                  <AddIcon fontSize="25" />
                  <TextXtraSmall fontWeight="500">Add Videos</TextXtraSmall>
                </VStack>
              </GridItem>
            );
          })}
        </SimpleGrid>
      </Flex>
    </VStack>
  );
};

export default LatestVideos;
