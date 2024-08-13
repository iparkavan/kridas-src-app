import {
  VStack,
  Text,
  Flex,
  SimpleGrid,
  GridItem,
  Image,
  Button,
  Box,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { HeadingSmall } from "../ui/heading/heading";
import { TextSmall, TextXtraSmall } from "../ui/text/text";
import { useEffect, useState } from "react";
import { AddIcon, ViewMoreIcon } from "../ui/icons";
import { useUser } from "../../hooks/user-hooks";
import routes from "../../helper/constants/route-constants";

const LatestPhotos = ({ media, type, setTabIndex = null,eventId=null }) => {
  const { data: userData = {} } = useUser();
  const router = useRouter();
  const count = 0;
  /*   const [view, setView] = useState(false); */
  const handleClick = () => {
    if (type === "user") {
      router.push(`${routes.profile(userData?.["user_name"])}?tab=photos`);
    } else if (type === "page") {
      const url = `/page/[pageId]`;
      const isSameUrl = router.pathname === url;
      /*   console.log(router.pathname); */
      isSameUrl
        ? setTabIndex(3)
        : router.push(
            `/page/${media?.pages[0]?.content[0]?.media_creator_company_id}?tab=photos`
          );
    }
    else if(eventId)
    setTabIndex(2)
 
    /*   else if(type==="event"){
      const url = `/events/[eventId]`;
      const isSameUrl = router.pathname === url;
      isSameUrl
        ? setTabIndex(3)
        : router.push(
            `/events/${media?.pages[0]?.content[0]?.media_creator_event_id}?tab=photos`
          );
    } */
  };
  const latestPhotosCount = media?.pages && media?.pages[0]?.totalCount;
  /*   useEffect(() => {
    if (latestPhotosCount > 5) setView(true);
  }, [latestPhotosCount]) */ return (
    <VStack
      bg="white"
      align="flex-start"
      h="min-content"
      p={4}
      borderRadius={10}
    >
      <Flex w="full">
        <HeadingSmall>Latest Photos</HeadingSmall>
        <Spacer />
        {latestPhotosCount > 0 && (
          <Button
            color={"primary.500"}
            fontSize="sm"
            fontWeight={"550"}
            variant={"link"}
            onClick={handleClick}
          >
            View Photos
          </Button>
        )}
      </Flex>
      {latestPhotosCount > 0 && (
        <Text>
          {" "}
          {latestPhotosCount}
          {""}
          {latestPhotosCount > 1 ? " Photos" : " Photo"}{" "}
        </Text>
      )}
      <Flex w="full">
        <SimpleGrid columns={3} w="full" gap={0}>
          {media?.pages?.map((page, idx) => {
            return page?.content?.length > 0 ? (
              page?.content?.map((media, index) => {
                if (media?.media_url_meta?.resource_type === "image") {
                  count++;
                  if (count <= 5) {
                    return (
                      <GridItem colSpan={1} gap={0} key={index}>
                        <Image
                          src={media.media_url}
                          boxSize={150}
                          alt="user_photo"
                          objectFit="cover"
                        />
                      </GridItem>
                    );
                  } else if (count === 6) {
                    return (
                      <GridItem colSpan={1} key={index}>
                        {" "}
                        <VStack
                          spacing={1}
                          w="full"
                          h="full"
                          bg={`url(${media.media_url})`}
                          align="center"
                          justify="center"
                          onClick={handleClick}
                          bgPosition="center"
                          bgSize="cover"
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
                  <TextXtraSmall fontWeight="500">Add Photos</TextXtraSmall>
                </VStack>
              </GridItem>
            );
          })}
        </SimpleGrid>
      </Flex>
    </VStack>
  );
};

export default LatestPhotos;
