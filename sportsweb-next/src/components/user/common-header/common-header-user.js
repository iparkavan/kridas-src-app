import React, { useRef, useState } from "react";
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
  CircularProgress,
  SimpleGrid,
  Progress,
  Skeleton,
  Icon,
} from "@chakra-ui/react";

import {
  useUser,
  useUpdateUser,
  useUserFollowersById,
} from "../../../hooks/user-hooks";
import { useRouter } from "next/router";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import UserProfileTab from "../profile-section/user-profile-tab";
import PictureModal from "../../common/picture-modal";
import { SamplePhotos } from "../user-photos/sampledata";
import { vd_t } from "../user-video/User-video-sample-data";
import VerifyProfileCompleteModal from "../../common/user-pages-verification-workflow/user-pages-verify-profilecomplete";
import VerifyProfileInCompleteModal from "../../common/user-pages-verification-workflow/user-pages-verify-profileincomplete";
import DetailsModal from "../sponsorship/user-sponsorship-details-modal";
import Sponsorship from "../sponsorship/user-sponsorship-notverified";
import ProfileModal from "../sponsorship/user-sponsorship-profile-modal";
import SponsorshipVerification from "../sponsorship/user-sponsorship-verification";
import { verifyUser } from "../../../../src/helper/constants/user-contants";
import {
  CategoryIcon,
  HeartIcon,
  KeyIcon,
  PersonCircleIcon,
  TrophyIcon,
  BadgeIcon,
  HandShakeIcon,
  VerifyIcon,
  CareerIcon,
  WorkIcon,
  CricketIcon,
  LocationIcon,
  BioIcon,
} from "../../ui/icons";
import UserProfileSections from "../profile-section/user-profile-sections";
import { useFeedInfiniteByUserId } from "../../../hooks/feed-hooks";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import { useEffect } from "react";
import { useUserStatistics } from "../../../hooks/user-statistics-hooks";
import { useSports } from "../../../hooks/sports-hooks";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";
import ViewUserDetails from "../profile-section/view-user-details";
import ViewSocialLinks from "../../social/view-social-links";
import ViewUserStatistics from "../profile-section/view-user-statistics";
import ViewUserInterests from "../profile-section/view-user-interests";
import UserFollow from "../user-follow";
import UserFollowersProfile from "../user-followers-profile";
import UserPhotos from "../user-photos";
import UserProfileHeading from "../profile-section/user_profile_heading";
import { HeadingMedium, HeadingSmall } from "../../ui/heading/heading";
import { TextMedium, TextSmall } from "../../ui/text/text";
import UserProfileCommonTabList from "../profile-section/user-profile-common-tab-list";
import UserFeedList from "../user-feeds/user-feed-list";
import UserVideo from "../user-videos";
import UserFollowers from "../user-followers";
import ProfilePercentage from "../../common/profile-percentage/profile-percentage";
import UserSponsorshipSpecificUser from "../sponsorship/user-sponsorship-specific-user";
import ViewUserSocial from "../profile-section/view-user-social";
import ViewUserCareer from "../profile-section/view-user-career";

function UserCommonHeader({ currentUser, userData }) {
  const verifyStatus = userData.user_profile_verified;

  const router = useRouter();
  const [mode, setMode] = useState("view");
  // const [isFollowClicked, setIsFollowClicked] = useState(false);
  const { tab } = router.query;
  /*   const [tabIndex, setTabIndex] = useState(0); */
  /*   const [isPhotosClicked, setIsPhotosClicked] = useState(false);
  const [isVideosClicked, setIsVideosClicked] = useState(false); */
  // const [isAboutClicked, setIsAboutClicked] = useState(false);
  const bioDetailsRef = useRef({});
  const [truncateBioDesc, setTruncateBioDesc] = useState(true);
  const [tabIndex, setTabIndex] = useState();

  useEffect(() => {
    bioDetailsRef.current = {};
  }, [userData]);

  // useEffect(() => {
  //   if (tab === "photos") setTabIndex(3);
  //   if (tab === "videos") setTabIndex(4);
  //   if (tab === "about") setTabIndex(1);
  //   // if (tab === "about") setIsAboutClicked(true);
  // }, [tab]);

  // useEffect(() => {
  //   if (tab === "photos") photosRef.current.click();
  //   if (tab === "videos") videosRef.current.click();
  //   if (tab === "about") aboutRef.current.click();
  //   // if (tab === "about") setIsAboutClicked(true);
  // }, [tab]);

  // const photosRef = useRef();
  // const videosRef = useRef();
  // const aboutRef = useRef();
  const {
    isOpen: isVerifyModalOpen,
    onOpen: onVerifyModalOpen,
    onClose: onVerifyModalClose,
  } = useDisclosure();
  const {
    isOpen: isVerifyOpen,
    onOpen: onVerifyOpen,
    onClose: onVerifyClose,
  } = useDisclosure();

  const { data: statisticsData = [] } = useUserStatistics(userData["user_id"]);

  const { mutate } = useUpdateUser();

  const loadMoreRef = useRef();
  const profilePicRef = useRef();
  const coverPicRef = useRef();

  const {
    data: feedData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    isLoading,
  } = useFeedInfiniteByUserId(userData?.["user_id"]);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  const { data: sportsData = [] } = useSports({}, true);
  const { data: userStatisticsData = [] } = useUserStatistics(
    userData?.["user_id"]
  );
  const { data: professionData = [] } = useLookupTable("PRF");
  const { percentage } = verifyUser(userData, userStatisticsData);
  const [isProfileDetailsFilled, setIsProfileDetailsFilled] = useState(false);
  const isUserDetailFilled = true;

  const sportnamearray = [];
  const sportsname = statisticsData?.map((statistic) => statistic?.sports_name);
  sportnamearray.push({ sportsnamedata: sportsname });

  const handleVerification = (userData, userStatisticsData) => {
    const { isProfileComplete, percentage } = verifyUser(
      userData,
      userStatisticsData
    );
    setIsProfileDetailsFilled(isProfileComplete);
    onVerifyModalOpen();
  };
  const { data: userFollowersData = {}, isLoading: isFollowersLoading } =
    useUserFollowersById(userData?.user_id);

  const profileAlertModals = () => {
    return (
      <>
        {isProfileDetailsFilled ? (
          <VerifyProfileCompleteModal
            isOpen={isVerifyModalOpen}
            onClose={onVerifyModalClose}
            type="user"
          />
        ) : (
          <VerifyProfileInCompleteModal
            isOpen={isVerifyModalOpen}
            onClose={onVerifyModalClose}
            name={userData?.full_name}
          />
        )}
      </>
    );
  };
  const sponsorModals = () => {
    return (
      <>
        {isUserDetailFilled ? (
          <SponsorshipVerification
            isOpen={isVerifyOpen}
            onClose={onVerifyClose}
          />
        ) : (
          <Sponsorship
            isOpen={isVerifyOpen}
            onClose={onVerifyClose}
            name={userData.full_name}
          />
        )}
      </>
    );
  };

  return (
    <>
      <Box w="100%">
        <Grid>
          <GridItem
            colSpan={6}
            h="48"
            w={["100%", "100%", "100%"]}
            position="relative"
          >
            <UserProfileHeading userData={userData} currentUser={currentUser} />
          </GridItem>
          <GridItem colSpan={6} w={["100%", "100%", "100%"]} bg="white" pb={3}>
            <HStack
              mt={3}
              pl={[5, 10, 127]}
              pr={5}
              alignItems="flex-start"
              gap={5}
              justify="space-between"
            >
              <Box>
                {verifyStatus ? (
                  <Flex gap={3}>
                    <HeadingMedium
                      wordBreak="break-word"
                      textOverflow="ellipsis"
                    >
                      {userData?.["full_name"]}
                    </HeadingMedium>
                    <VerifyIcon color="blue" />
                  </Flex>
                ) : (
                  <HeadingMedium wordBreak="break-word" textOverflow="ellipsis">
                    {userData?.["full_name"]}
                  </HeadingMedium>
                )}
                <HStack my={2} spacing={5}>
                  {userData?.address?.city && userData?.["countryData"] && (
                    <HStack>
                      <Icon as={LocationIcon} w={5} h={5} />
                      <TextMedium>
                        {userData?.address?.city &&
                          `${userData.address.city}, `}
                        {userData["countryData"] &&
                          JSON.parse(userData["countryData"])["country_name"]}
                      </TextMedium>
                    </HStack>
                  )}
                  {userData?.["bio_details"]?.["sports_id"] && (
                    <HStack>
                      <Icon as={CricketIcon} w={5} h={5} />
                      <TextMedium>
                        {
                          sportsData.find(
                            (sport) =>
                              sport["sports_id"] ==
                              userData["bio_details"]["sports_id"]
                          )?.["sports_name"]
                        }
                      </TextMedium>
                    </HStack>
                  )}
                  {userData?.["bio_details"]?.["profession"] && (
                    <HStack>
                      <Icon as={WorkIcon} w={5} h={5} />
                      <TextMedium>
                        {
                          professionData.find(
                            (profession) =>
                              profession["lookup_key"] ===
                              userData["bio_details"]["profession"]
                          )?.["lookup_value"]
                        }
                      </TextMedium>
                    </HStack>
                  )}
                </HStack>

                {userData?.["bio_details"]?.["description"] && (
                  <HStack align="flex-start">
                    <Icon as={BioIcon} w={5} h={5} />
                    <Box>
                      <Text
                        mt="-3px"
                        noOfLines={truncateBioDesc && 2}
                        ref={(newRef) => {
                          if (newRef && !bioDetailsRef.current?.offsetHeight) {
                            bioDetailsRef.current.offsetHeight =
                              newRef.offsetHeight;
                            bioDetailsRef.current.scrollHeight =
                              newRef.scrollHeight;
                          }
                        }}
                      >
                        {userData["bio_details"].description}
                      </Text>
                      {bioDetailsRef.current?.offsetHeight <
                        bioDetailsRef.current?.scrollHeight && (
                        <Button
                          variant="link"
                          fontWeight="normal"
                          colorScheme="primary"
                          onClick={() => setTruncateBioDesc(!truncateBioDesc)}
                        >
                          {truncateBioDesc ? "Show More" : "Show Less"}
                        </Button>
                      )}
                    </Box>
                  </HStack>
                )}
              </Box>
              <HStack align="flex-start" gap={10}>
                <VStack height="full" spacing={1}>
                  <HeadingSmall>
                    {userFollowersData?.follower?.length}
                  </HeadingSmall>
                  <HeadingSmall>Followers</HeadingSmall>
                  {isFollowersLoading ? (
                    <Skeleton>
                      <div>Loading...</div>
                    </Skeleton>
                  ) : (
                    <AvatarGroup
                      size="sm"
                      max={3}
                      onClick={() => {
                        // setIsFollowClicked(true);
                        setTabIndex(2);
                      }}
                      cursor="pointer"
                    >
                      {userFollowersData?.follower?.map(
                        ({ id, name, avatar }) => (
                          <Avatar name={name} src={avatar} key={id} />
                        )
                      )}
                    </AvatarGroup>
                  )}
                </VStack>

                <VStack height="full" spacing={1}>
                  <HeadingSmall>
                    {userFollowersData?.following?.length}
                  </HeadingSmall>
                  <HeadingSmall>Following</HeadingSmall>
                  {isFollowersLoading ? (
                    <Skeleton>
                      <div>Loading...</div>
                    </Skeleton>
                  ) : (
                    <AvatarGroup
                      size="sm"
                      max={3}
                      onClick={() => {
                        // setIsFollowClicked(true);
                        setTabIndex(2);
                      }}
                      cursor="pointer"
                    >
                      {userFollowersData?.following?.map(
                        ({ id, name, avatar }) => (
                          <Avatar name={name} src={avatar} key={id} />
                        )
                      )}
                    </AvatarGroup>
                  )}
                </VStack>

                <VStack alignItems="flex-end">
                  {currentUser ? (
                    <>
                      {/* Commented by Mani - Sponsor related will be in Phase 2 */}
                      {/* <Box ml={2}>
                      <Button
                        colorScheme="primary"
                        onClick={(onVerifyModalOpen) =>
                          handleVerification(userData, userStatisticsData)
                        }
                        leftIcon={<BadgeIcon />}
                      >
                        Get ”Verified” Badge
                      </Button>
                    </Box>

                    <Button
                      colorScheme="gray"
                      onClick={onVerifyOpen}
                      leftIcon={<HandShakeIcon />}
                    >
                      Get Sponsorship
                    </Button> */}
                    </>
                  ) : (
                    <Box>
                      <UserFollow userData={userData} />
                    </Box>
                  )}
                </VStack>
              </HStack>
            </HStack>
            {profileAlertModals()}
            {sponsorModals()}
          </GridItem>

          <GridItem colSpan={6} w="full">
            <Box>
              <Tabs
                index={tabIndex}
                defaultIndex={
                  tab === "photos"
                    ? 3
                    : tab === "videos"
                    ? 4
                    : tab === "about"
                    ? 1
                    : 0
                }
                variant="unstyled"
                onChange={(index) => setTabIndex(index)}
                isLazy
              >
                <UserProfileCommonTabList
                // isFollowClicked={isFollowClicked}
                // isAboutClicked={isAboutClicked}
                // setIsAboutClicked={setIsAboutClicked}
                />
                <Flex mt="4" gap={5}>
                  <TabPanels width="full">
                    <TabPanel p={0}>
                      <Flex gap={3}>
                        <Box width="65%">
                          <UserFeedList userData={userData} />
                        </Box>

                        <Box width="35%">
                          {currentUser ? (
                            <ProfilePercentage
                              percentage={percentage}
                              type="user"
                              setTabIndex={setTabIndex}
                            />
                          ) : (
                            <>
                              {/* Commented by Mani - Sponsor related will be in Phase 2 */}
                              {/* <UserSponsorshipSpecificUser userData={userData} /> */}
                            </>
                          )}
                        </Box>
                      </Flex>
                    </TabPanel>
                    <TabPanel p={0}>
                      {currentUser ? (
                        <UserProfileSections type="private" />
                      ) : (
                        <Tabs
                          padding={0}
                          orientation="vertical"
                          variant="unstyled"
                          onChange={() => setMode("view")}
                          isLazy
                        >
                          <TabList w="30%">
                            <UserProfileTab tabIcon={PersonCircleIcon}>
                              Profile
                            </UserProfileTab>
                            <UserProfileTab tabIcon={HeartIcon}>
                              Social Presence
                            </UserProfileTab>
                            <UserProfileTab tabIcon={CareerIcon}>
                              Sports Career
                            </UserProfileTab>
                            <UserProfileTab tabIcon={TrophyIcon}>
                              Sports Statistics
                            </UserProfileTab>
                            <UserProfileTab tabIcon={CategoryIcon}>
                              Interests
                            </UserProfileTab>
                          </TabList>

                          <TabPanels bg="white" width="full" px={3}>
                            <TabPanel>
                              <VStack gap={3} mt={5}>
                                <ViewUserDetails
                                  userData={userData}
                                  type="public"
                                />
                              </VStack>
                            </TabPanel>
                            <TabPanel>
                              <VStack gap={3} mt={5}>
                                <ViewUserSocial
                                  socials={userData?.["social"]}
                                />
                              </VStack>
                            </TabPanel>
                            <TabPanel>
                              <VStack gap={3} mt={5}>
                                <ViewUserCareer
                                  statisticsData={statisticsData}
                                  type="public"
                                />
                              </VStack>
                            </TabPanel>
                            <TabPanel>
                              <VStack gap={3} mt={5}>
                                <ViewUserStatistics
                                  statisticsData={statisticsData}
                                  type="public"
                                />
                              </VStack>
                            </TabPanel>
                            <TabPanel>
                              <VStack gap={3} mt={5}>
                                <ViewUserInterests
                                  sportsInterested={
                                    userData["sports_interested"]
                                  }
                                />
                              </VStack>
                            </TabPanel>
                          </TabPanels>
                        </Tabs>
                      )}
                    </TabPanel>
                    <TabPanel p={0}>
                      <UserFollowersProfile
                        userFollowersData={userFollowersData}
                      />
                    </TabPanel>
                    {/* <TabPanel p={0} ref={photosRef}> */}
                    <TabPanel p={0}>
                      <UserPhotos
                        userData={userData}
                        currentUser={currentUser}
                      />
                    </TabPanel>
                    {/* <TabPanel p={0} ref={videosRef}> */}
                    <TabPanel p={0}>
                      {/* <p>Videos</p> */}
                      <UserVideo userData={userData} />
                    </TabPanel>
                  </TabPanels>

                  {/* <VStack w="35%">
                    <VStack
                      bg="white"
                      w="full"
                      h="max-content"
                      align="flex-start"
                      p={8}
                      borderRadius={10}
                    >
                      {currentUser ? (
                        <VStack
                          bg="white"
                          w="full"
                          h="max-content"
                          align="flex-start"
                          p={2}
                          borderRadius={10}
                        >
                          <Box>
                            <Text fontWeight="bold" fontSize={16}>
                              Profile Completion Status
                            </Text>

                            {percentage == 100 ? (
                              <Progress
                                colorScheme={"green"}
                                size="sm"
                                value={percentage}
                                mt={5}
                              />
                            ) : (
                              <Progress
                                colorScheme={"yellow"}
                                size="sm"
                                value={percentage}
                                mt={5}
                              />
                            )}
                            <Text>{percentage}%</Text>
                            {percentage != 100 ? (
                              <Button
                                colorScheme="blue"
                                variant="outline"
                                borderRadius="none"
                                mt={5}
                                w="32"
                              >
                                Complete Now
                              </Button>
                            ) : null}
                          </Box>
                        </VStack>
                      ) : (
                        <Box>
                          <VStack spacing={4} align="stretch">
                            <Box>
                              <VStack>
                                <Button
                                  colorScheme="blue"
                                  w="44"
                                  borderRadius="none"
                                >
                                  Sponsor {userData["full_name"]}
                                </Button>
                              </VStack>
                            </Box>
                          </VStack>
                        </Box>
                      )}
                    </VStack>
                    <Box
                      mt={10}
                      bg="white"
                      borderRadius={10}
                      h="72"
                      w="100%"
                      p={3}
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
                    </Box>
                    <Box
                      mt={10}
                      bg="white"
                      borderRadius={10}
                      h={400}
                      w="100%"
                      p={3}
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
                    </Box>
                  </VStack> */}
                </Flex>
              </Tabs>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}

export default UserCommonHeader;
