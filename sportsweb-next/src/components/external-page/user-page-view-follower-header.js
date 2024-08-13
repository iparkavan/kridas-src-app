import React, { useRef, useState, useEffect } from "react";
import {
  Flex,
  Box,
  Text,
  Grid,
  GridItem,
  Circle,
  Image,
  Avatar,
  VStack,
  Link,
  Wrap,
  WrapItem,
  Center,
  Heading,
  usePanGesture,
  Input,
  IconButton,
  useDisclosure,
  Stack,
  AvatarGroup,
  Button,
  Spacer,
  HStack,
  Divider,
  SimpleGrid,
  StackDivider,
  CircularProgress,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import {
  AboutDetail,
  ContactInfo,
  SocialMedia,
  SportsProfile,
} from "../ui/icons";
import { MdModeEditOutline } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
// import { useUser } from "../../hooks/user-hooks";

import { usePage } from "../../hooks/page-hooks";
import { useRouter } from "next/router";
import PictureModal from "../common/picture-modal";
import UserProfileTab from "../user/profile-section/user-profile-tab";
import { SamplePhotos } from "../user/user-photos/sampledata";
import { vd_t } from "../user/user-video/User-video-sample-data";

import { useCreateFollower } from "../../hooks/follower-hook";
import { useUser } from "../../hooks/user-hooks";
import FeedPost from "../feed/feed-post";
import AboutPageView from "../../components/user/user-pages/edit-page-component/user-pages-about-view";
import ContactInformation from "../../components/user/user-pages/user-pages-about-contact-information";
import Socialmediapreference from "../user/user-pages/user-pages-view-socialmediapreference";
import PageViewSportsProfile from "../user/user-pages/sports-profile-components/user-pages-view-sports-profile";
import { usePageFollowersData } from "../../hooks/page-hooks";
import { usePageStatistics } from "../../hooks/page-statistics-hooks";
import { useFeedInfiniteByCompanyId } from "../../hooks/feed-hooks";
import { useIntersectionObserver } from "../../hooks/common-hooks";

function UserPageViewFollowerHeader() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mode, setMode] = useState("view");
  const router = useRouter();
  const { pageId } = router.query;

  const { data: pageData = {} } = usePage(pageId);
  const { data: userIdData = {} } = useUser();
  const { mutate } = useCreateFollower();
  const { data: pageStatisticsData = [] } = usePageStatistics(pageId);
  const { data: pageFollowersData = {} } = usePageFollowersData(pageId);
  const followerRef = useRef();

  // console.log(pageFollowersData, "follower page data by there id");
  // console.log(userIdData, " current USER data");

  const subcat = pageData?.category_arr?.map(
    ({ category_name }) => category_name
  );

  //TeamStatistics
  const pageTeamStatisticsData = pageStatisticsData
    .filter(
      ({ categorywise_statistics }) =>
        categorywise_statistics.category === "team"
    )
    .sort((a, b) => Date.parse(a.created_date) - Date.parse(b.created_date));
  console.log(pageTeamStatisticsData);
  //VenueStatistics
  const pageVenueStatisticsData = pageStatisticsData
    .filter(
      ({ categorywise_statistics }) =>
        categorywise_statistics.category === "venue"
    )
    .sort((a, b) => Date.parse(a.created_date) - Date.parse(b.created_date));
  //AcademyStatistics
  const pageAcademyStatisticsData = pageStatisticsData
    .filter(
      ({ categorywise_statistics }) =>
        categorywise_statistics.category === "academy"
    )
    .sort((a, b) => Date.parse(a.created_date) - Date.parse(b.created_date));
  const [view, setView] = useState(false);
  const loadMoreRef = useRef();
  const [following, setFollowing] = useState();
  useEffect(() => {
    let isFollowing = pageFollowersData?.companyFollower?.find(
      (page) => page.id === userIdData?.user_id
    );
    setFollowing(isFollowing);
  }, [userIdData, pageFollowersData?.companyFollower]);
  // console.log(following, "from use effect values");
  const {
    data: feedData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    isLoading,
  } = useFeedInfiniteByCompanyId(pageData?.["company_id"]);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });
  console.log(feedData, "FEED DATA HERE");

  function handleSubmit() {
    const following_companyid = pageData["company_id"];
    const follower_userid = userIdData["user_id"];
    mutate(
      {
        following_companyid,
        follower_userid,
        type: "page-follower",
      },
      {
        onSuccess: () => {
          setFollowing(true);
        },
      }
    );
  }

  return (
    <>
      <Box w="100%" pb={5}>
        <Grid>
          <GridItem
            colSpan={6}
            h="48"
            w={["100%", "100%", "100%"]}
            position="relative"
          >
            {pageData?.["company_img"] ? (
              <>
                <Image
                  h="48"
                  w="full"
                  src={pageData?.["company_img"]}
                  objectFit="cover"
                  alt="Cover image"
                  cursor="pointer"
                  onClick={onOpen}
                />
                <PictureModal
                  isOpen={isOpen}
                  onClose={onClose}
                  src={pageData?.["company_img"]}
                  alt="Page cover image"
                />
              </>
            ) : (
              <Box
                h="48"
                w="full"
                display="flex"
                justifyContent="center"
                alignItems="center"
                bgColor="gray.300"
              >
                <Text fontSize="lg">Add your banner image</Text>
              </Box>
            )}
            <Flex justifyContent={"flex-start"} mt={-9} px={6}>
              <HStack>
                <Avatar
                  size={"xl"}
                  name={pageData?.["company_name"]}
                  src={pageData?.["company_profile_img"]}
                  alt={"User"}
                  css={{
                    border: "2px solid white",
                  }}
                  position="relative"
                ></Avatar>
              </HStack>
            </Flex>
          </GridItem>
          <GridItem colSpan={6} h="24" w={["100%", "100%", "100%"]} bg="white">
            <Flex mt={3}>
              <Box>
                <VStack spacing={-1.2} align="stretch" ml={[5, 10, 127]}>
                  <Box w={80}>
                    <Heading
                      color="black"
                      fontSize={"2xl"}
                      fontWeight={500}
                      fontFamily={"body"}
                      wordBreak="break-word"
                      textOverflow="ellipsis"
                    >
                      {pageData["company_name"]}
                    </Heading>
                  </Box>
                  <VStack align="flex-start" spacing={1.5}>
                    <Text color="black">
                      <b>{pageData?.["parent_category_name"]}</b>(
                      {subcat?.map((subCategory, index) => {
                        const str = subCategory;
                        if (index !== subcat?.length - 1) {
                          str += ", ";
                        }
                        return str;
                      })}
                      )
                      <br />{" "}
                    </Text>
                    <Text
                      maxW={300}
                      h={view ? "min-content" : 6}
                      overflow={view ? "visible" : "hidden"}
                      wordBreak="break-word"
                      textOverflow="ellipsis"
                      isTruncated={view ? false : true}
                    >
                      {pageData["company_desc"]}{" "}
                    </Text>
                    {pageData["company_desc"]?.length > 37 && (
                      <>
                        <Link color="#2F80ED" onClick={() => setView(!view)}>
                          {view ? "Read Less" : "Read More"}
                        </Link>
                      </>
                    )}
                  </VStack>
                </VStack>
              </Box>
              <Flex>
                <Box>
                  <VStack spacing={1} align="center">
                    <Box>
                      <Text fontSize="15px">
                        {pageFollowersData?.companyFollower?.length} Followers
                      </Text>
                    </Box>
                    <Box>
                      <AvatarGroup size="sm" max={3} cursor="pointer">
                        {pageFollowersData?.companyFollower?.map(
                          ({ name, id, avatar }) => (
                            <Avatar key={id} name={name} src={avatar} />
                          )
                        )}
                      </AvatarGroup>
                    </Box>
                  </VStack>
                </Box>

                <Box mt="2" ml="80">
                  <Flex align="center" justify="center" gap={7}>
                    {following ? (
                      <Button
                        colorScheme="blue"
                        variant="outline"
                        w="28"
                        p={5}
                        borderRadius="none"
                        leftIcon={<AiOutlinePlus />}
                      >
                        Following
                      </Button>
                    ) : (
                      <Button
                        colorScheme="blue"
                        variant="outline"
                        w="28"
                        p={5}
                        borderRadius="none"
                        leftIcon={<AiOutlinePlus />}
                        onClick={() => {
                          handleSubmit();
                        }}
                      >
                        Follow
                      </Button>
                    )}
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      w="28"
                      p={5}
                      borderRadius="none"
                      leftIcon={<AiOutlinePlus />}
                    >
                      Like
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </GridItem>

          <GridItem colSpan={6} w="full">
            <Tabs defaultIndex={Tab ? 0 : 2} variant="unstyled">
              <TabList
                gap={5}
                color="#2F80ED"
                bg="white"
                fontSize={10}
                h={20}
                pt={10}
              >
                <Tab _selected={{ borderBottom: "solid black" }}>Posts</Tab>
                <Tab _selected={{ borderBottom: "solid black" }}>About</Tab>
                <Tab _selected={{ borderBottom: "solid black" }}>Photos</Tab>
                <Tab _selected={{ borderBottom: "solid black" }}>Videos</Tab>
                <Tab _selected={{ borderBottom: "solid black" }}>Polls</Tab>
                <Tab _selected={{ borderBottom: "solid black" }}>Events</Tab>
                <Tab _selected={{ borderBottom: "solid black" }}>Followers</Tab>
              </TabList>

              <Flex gap={2} mt="1">
                <TabPanels>
                  <TabPanel p={0}>
                    {isLoading
                      ? "Loading..."
                      : error
                      ? "An error has occurred: " + error.message
                      : feedData?.pages?.map((page) => {
                          return page?.content?.map((feed) => (
                            <FeedPost
                              key={feed["feed_id"]}
                              feed={feed}
                              queryKey={["company-posts"]}
                              type="company"
                              id={pageData?.["company_id"]}
                            />
                          ));
                        })}

                    <span ref={loadMoreRef} />
                    {isFetchingNextPage && (
                      <CircularProgress
                        alignSelf="center"
                        isIndeterminate
                        size="24px"
                      />
                    )}
                  </TabPanel>
                  <TabPanel p={0}>
                    <Box w="100%" rounded={"md"} overflow={"hidden"}>
                      <Tabs
                        padding={2}
                        orientation="vertical"
                        variant="unstyled"
                        onChange={() => setMode("view")}
                        isLazy
                      >
                        <TabList width="60%">
                          <UserProfileTab tabIcon={AboutDetail}>
                            About This Page
                          </UserProfileTab>
                          <UserProfileTab tabIcon={ContactInfo}>
                            Contact Information
                          </UserProfileTab>
                          <UserProfileTab tabIcon={SocialMedia}>
                            Social Media Presence
                          </UserProfileTab>
                          <UserProfileTab tabIcon={SportsProfile}>
                            Sports Profile
                          </UserProfileTab>
                        </TabList>
                        <TabPanels width="full" px={3} bg="white">
                          <TabPanel>
                            <VStack gap={3} mt={5}>
                              <Heading as="h4" size="md" text-align="left">
                                About {pageData["company_name"]}
                              </Heading>
                              <Divider />
                            </VStack>
                            <AboutPageView type="public" />
                          </TabPanel>
                          <TabPanel>
                            <VStack gap={3} mt={5}>
                              <Heading as="h4" size="md" text-align="left">
                                About {pageData["company_name"]}
                              </Heading>
                              <Divider />
                            </VStack>
                            <ContactInformation type="public" />
                          </TabPanel>
                          <TabPanel>
                            <VStack gap={3} mt={5}>
                              <Heading as="h4" size="md" text-align="left">
                                About {pageData["company_name"]}
                              </Heading>
                              <Divider />
                            </VStack>
                            <Socialmediapreference type="public" />
                          </TabPanel>
                          <TabPanel>
                            <VStack gap={3} mt={5}>
                              <Heading as="h4" size="md" text-align="left">
                                About {pageData["company_name"]}
                              </Heading>
                              <Divider />
                            </VStack>
                            <PageViewSportsProfile
                              pageTeamStatisticsData={pageTeamStatisticsData}
                              pageVenueStatisticsData={pageVenueStatisticsData}
                              pageAcademyStatisticsData={
                                pageAcademyStatisticsData
                              }
                              type="public"
                            />
                          </TabPanel>
                        </TabPanels>
                      </Tabs>
                    </Box>
                  </TabPanel>
                  <TabPanel p={0}>follower</TabPanel>
                  <TabPanel p={0}>
                    <p>Photos</p>
                  </TabPanel>
                  <TabPanel p={0}>
                    <p>Videos</p>
                  </TabPanel>
                </TabPanels>
                <Flex
                  gap={3}
                  direction="column"
                  w="50%"
                  display={{ base: "none", lg: "flex" }}
                  mt={5}
                >
                  <VStack
                    bg="white"
                    w="full"
                    h="max-content"
                    align="flex-start"
                    p={4}
                    borderRadius={10}
                  >
                    <Text fontWeight="500" fontSize="14px" textAlign="left">
                      Upcoming Events
                    </Text>
                    <Box>
                      <VStack
                        divider={<StackDivider borderColor="gray.200" />}
                        spacing={4}
                        align="stretch"
                      >
                        <Box>
                          <Flex gap={10}>
                            <Image
                              boxSize="80px"
                              objectFit="cover"
                              src="https://bit.ly/dan-abramov"
                              alt="Dan Abramov"
                              borderRadius={10}
                            />
                            <VStack>
                              <Heading size={10}>Description Goes Here</Heading>
                              <Text fontSize={14}>09:00 AM to 03:00 PM</Text>
                              <Button
                                colorScheme="blue"
                                w="32"
                                borderRadius="none"
                              >
                                Enroll
                              </Button>
                            </VStack>
                          </Flex>
                        </Box>

                        <Box>
                          <Flex gap={10}>
                            <Image
                              boxSize="80px"
                              objectFit="cover"
                              src="https://bit.ly/dan-abramov"
                              alt="Dan Abramov"
                              borderRadius={10}
                            />
                            <VStack>
                              <Heading size={10}>Description Goes Here</Heading>
                              <Text fontSize={14}>09:00 AM to 03:00 PM</Text>
                              <Button
                                colorScheme="blue"
                                w="32"
                                borderRadius="none"
                              >
                                Enroll
                              </Button>
                            </VStack>
                          </Flex>
                        </Box>
                      </VStack>
                    </Box>
                  </VStack>
                  <VStack
                    bg="white"
                    align="flex-start"
                    h="min-content"
                    p={3}
                    borderRadius={10}
                  >
                    <Text>Latest Photos</Text>
                    <Text>{SamplePhotos.length} Photos</Text>
                    <Flex w="full">
                      <SimpleGrid columns={3}>
                        {SamplePhotos.map(({ image }, idx) => (
                          <GridItem colSpan={1} key={idx}>
                            <Image
                              src={image}
                              boxSize={110}
                              alt="user_photo"
                              objectFit="fill"
                            />
                          </GridItem>
                        ))}
                      </SimpleGrid>
                    </Flex>
                  </VStack>
                  <VStack
                    bg="white"
                    align="flex-start"
                    h="min-content"
                    p={4}
                    w="full"
                    borderRadius={10}
                  >
                    <Text>Latest Videos</Text>
                    <Text>{vd_t.length} Videos</Text>
                    <Flex w="full">
                      <SimpleGrid columns={3}>
                        {vd_t.map(({ tumbnail }, idx) => (
                          <GridItem colSpan={1} key={idx}>
                            <Box>
                              <Image
                                src={tumbnail}
                                boxSize={110}
                                alt="user_photo"
                                objectFit="fill"
                              />
                            </Box>
                          </GridItem>
                        ))}
                      </SimpleGrid>
                    </Flex>
                  </VStack>
                </Flex>
              </Flex>
            </Tabs>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}

export default UserPageViewFollowerHeader;
