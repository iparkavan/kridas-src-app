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
  Spacer,
  HStack,
  Divider,
  CircularProgress,
  SimpleGrid,
  Progress,
  Skeleton,
  Link,
  StackDivider,
} from "@chakra-ui/react";
import UserHomepageview from "../../user/user-pages/edit-page-component/user-pages-homepageview";
import {
  HeadingLarge,
  HeadingMedium,
  HeadingSmall,
} from "../../ui/heading/heading";
import { usePageFollowersData } from "../../../hooks/page-hooks";
import PageProfileHeading from "../page_profile_heading";
import { BsArrowLeft } from "react-icons/bs";
import PageFollow from "./PageFollow";
import VerifyProfileCompleteModal from "../../common/user-pages-verification-workflow/user-pages-verify-profilecomplete";
import VerifyProfileIncompleteModal from "../../common/user-pages-verification-workflow/user-pages-verify-profileincomplete";
import PageSponsorshipVerify from "../../user/user-pages/page-sponsorship-info/user-pages-sponsorship-verify";
import PageSponsorshipNotVerified from "../../user/user-pages/page-sponsorship-info/user-pages-sponsorship-notverified";
import UserProfileTab from "../../user/profile-section/user-profile-tab";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import PageFollowers from "../../user/user-pages/user-pages-followers";
import {
  AboutDetail,
  ContactInfo,
  SocialMedia,
  SportsProfile,
  HandShakeIcon,
  ThumpsUpIcon,
  ArrowLeftIcon,
  EditIcon,
  WorkIcon,
  ArrowBarLeftIcon,
  VerifyIcon,
  CheckCircleIcon,
} from "../../ui/icons";
import { usePageStatistics } from "../../../hooks/page-statistics-hooks";
import AboutPageView from "../../user/user-pages/edit-page-component/user-pages-about-view";
import ContactInformation from "../../user/user-pages/user-pages-about-contact-information";
import Socialmediapreference from "../../user/user-pages/user-pages-view-socialmediapreference";
import PageViewSportsProfile from "../../user/user-pages/sports-profile-components/user-pages-view-sports-profile";
import FeedPost from "../../feed/feed-post";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import { useFeedInfiniteByCompanyId } from "../../../hooks/feed-hooks";
import PageFeedList from "../page-feed/PageFeedList";
import { useRouter } from "next/router";
import {
  getPageType,
  verifyPage,
} from "../../../helper/constants/page-constants";
import EditContactInformation from "../../user/user-pages/user-pages-edit-contact-information";
import UserPageEditSocial from "../../user/user-pages/user-page-edit-socialMediaPreference";
import routes from "../../../helper/constants/route-constants";
import PagePhotos from "../../user/user-pages/user-pages-photos";
import PageVideos from "../../user/user-pages/user-pages-video";
import PageEventDisplay from "../page-event/page-event-display";
import { Icon } from "@chakra-ui/icons";
import { TextMedium, TextSmall } from "../../ui/text/text";
import UserPageAbout from "../../user/user-pages/edit-page-component/user-page-about";
import SocialMediaShareButtons from "../../common/social-media-share-buttons";
import Button from "../../ui/button";
import VerificationModal from "../../common/verification/verification-modal";

import ProductsList from "../products";
import EventPlayerList from "../page-event/event-player-list-modal";
import PageMedia from "../../user/user-pages/user-page-photos/page-media";
import SponsorsTab from "../../common/sponsors/sponsors-tab";
import TeamPages from "../team-page/team-pages";
import VenuePages from "../venue-page/venue-pages";
import AcademyPages from "../academy-page/academy-pages";
import PlayersTab from "../players/players-tab";
import ProductsTab from "../products/products-tab";
import ServicesTab from "../services/services-tab";
import VouchersTab from "../vouchers/vouchers-tab";
import { useSports } from "../../../hooks/sports-hooks";

// function PageCommonHeader({ currentPage, pageData, products }) {
function PageCommonHeader({ currentPage, pageData }) {
  // const [showText, setShowText] = useState(false);

  const selectedTab = {
    // borderBottom: "solid",
    // borderColor: "primary.500",
    color: "primary.600",
    fontWeight: "bold",
  };
  const isPageVerified = pageData?.company_profile_verified;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { pageId, tab } = router.query;

  const [tabIndex, setTabIndex] = useState();
  const {
    isOpen: isVerifyOpen,
    onOpen: onVerifyOpen,
    onClose: onVerifyClose,
  } = useDisclosure();
  const {
    isOpen: isSponsorInfoModalOpen,
    onOpen: onSponsorInfoModalOpen,
    onClose: onSponsorInfoModalClose,
  } = useDisclosure();
  const [truncateDesc, setTruncateDesc] = useState(true);
  const companyDescRef = useRef({});

  const { data: sports = [] } = useSports();

  const subcat = pageData?.category_arr?.map(
    ({ category_name }) => category_name
  );
  //   const { data: pageFollowersData = {}, isLoading: isFollowersLoading } =
  //     usePageFollowersData(pageId);

  const { data: pageStatisticsData = [] } = usePageStatistics(pageId);

  // const handleVerification = (pageData, pageStatisticsData) => {
  //   const { isProfileComplete, percentage } = verifyPage(
  //     pageData,
  //     pageStatisticsData
  //   );
  //   setIsProfileDetailsFilled(isProfileComplete);
  //   onVerifyModalOpen();
  // };
  const {
    isOpen: isFollowPageOpen,
    onOpen: onFollowPageOpen,
    onClose: onFollowPageClose,
  } = useDisclosure();
  const { data: pageFollowersData = {}, isLoading: isFollowersLoading } =
    usePageFollowersData(pageId);
  const [isProfileDetailsFilled, setIsProfileDetailsFilled] = useState(false);
  const photosRef = useRef();
  const videosRef = useRef();
  const aboutRef = useRef();
  /*  const [isAboutClicked, setIsAboutClicked] = useState(false);
  useEffect(() => {
    if (tab === "photos") photosRef.current.click();
    if (tab === "videos") videosRef.current.click();
    if (tab === "about") {
      setIsAboutClicked(true);
      aboutRef.current.click();
    }
  }, [tab]);
   if (isAboutClicked) aboutRef.current.click(); */
  const [aboutTabIndex, setAboutTabIndex] = useState(0);

  const getMode = (index) => {
    switch (index) {
      case 1:
        return !(
          pageData?.address?.pincode &&
          pageData?.address?.country &&
          pageData?.address?.state &&
          pageData?.address?.city
        );
      case 2:
        return !Boolean(pageData?.social?.length > 0);
      default:
        return false;
    }
  };

  const { isParentPage, isChildPage, isSubTeamPage, pageType } =
    getPageType(pageData);

  const isCatVenue = Boolean(pageData?.["parent_category_type"] === "VEN");
  const isCatAcademy = Boolean(pageData?.["parent_category_type"] === "ACD");

  const isSubCatTeam = Boolean(
    pageData?.["category_arr"]?.find(
      (category) => category["category_type"] === "TEA"
    )
  );

  const isSubCatVenue = Boolean(
    pageData?.["category_arr"]?.find(
      (category) => category["category_type"] === "VEN"
    )
  );

  const isSubCatAcademy = Boolean(
    pageData?.["category_arr"]?.find(
      (category) => category["category_type"] === "ACD"
    )
  );

  const isSubCatProduct = Boolean(
    pageData?.["category_arr"]?.find(
      (category) => category["category_type"] === "PRD"
    )
  );

  const isSubCatService = Boolean(
    pageData?.["category_arr"]?.find(
      (service) => service["category_type"] === "SER"
    )
  );

  useEffect(() => {
    companyDescRef.current = {};
    setTabIndex(0);
  }, [pageData]);

  const isCatAndSubCatSame =
    pageData?.["category_arr"]?.length === 1 &&
    pageData["category_arr"][0]["category_type"] ===
      pageData?.["parent_category_type"];

  const isNonSportingPage = pageData?.category_id === 1;

  return (
    <>
      <Box>
        <Grid>
          <GridItem
            colSpan={6}
            position="relative"
            p={5}
            bg="white"
            borderTopLeftRadius="lg"
            borderTopRightRadius="lg"
          >
            <PageProfileHeading currentPage={currentPage} pageData={pageData} />
            <Grid templateColumns="repeat(6, 1fr)">
              <GridItem w="100%" colSpan={5}>
                <VStack align="start" pl={3} pt={5}>
                  <HeadingMedium
                    wordBreak="break-word"
                    fontWeight="medium"
                    textOverflow="ellipsis"
                  >
                    {pageData["company_name"]}
                    {pageData["company_profile_verified"] && (
                      <Icon
                        as={VerifyIcon}
                        color="primary.500"
                        h={6}
                        w={6}
                        ml={2}
                        verticalAlign="bottom"
                      />
                    )}
                  </HeadingMedium>
                  <Flex gap={2}>
                    {isCatAndSubCatSame ? (
                      <TextMedium>
                        {pageData?.["parent_category_name"]}
                      </TextMedium>
                    ) : (
                      (isParentPage && (
                        <>
                          <TextMedium>
                            {pageData?.["parent_category_name"]}
                          </TextMedium>
                          <TextMedium>
                            {subcat?.length > 0 && (
                              <>
                                (
                                {subcat?.map((subCategory, index) => {
                                  const str = subCategory;
                                  if (index !== subcat?.length - 1) {
                                    str += ", ";
                                  }
                                  return str;
                                })}
                                )
                              </>
                            )}
                          </TextMedium>
                        </>
                      )) ||
                      ((isChildPage || isSubTeamPage) && (
                        <>
                          <TextMedium>
                            {subcat?.length > 0 && (
                              <>
                                {subcat?.map((subCategory, index) => {
                                  const str = subCategory;
                                  if (index !== subcat?.length - 1) {
                                    str += ", ";
                                  }
                                  return str;
                                })}
                              </>
                            )}
                          </TextMedium>
                          <TextMedium>
                            ({pageData?.["parent_category_name"]})
                          </TextMedium>
                        </>
                      ))
                    )}
                  </Flex>
                  {pageData?.["company_desc"] && (
                    <Box>
                      <Text
                        noOfLines={truncateDesc && 2}
                        ref={(newRef) => {
                          if (newRef && !companyDescRef.current?.offsetHeight) {
                            companyDescRef.current.offsetHeight =
                              newRef.offsetHeight;
                            companyDescRef.current.scrollHeight =
                              newRef.scrollHeight;
                          }
                        }}
                      >
                        {pageData["company_desc"]}
                      </Text>
                      {companyDescRef.current?.offsetHeight <
                        companyDescRef.current?.scrollHeight && (
                        <Button
                          variant="link"
                          colorScheme="primary"
                          onClick={() => setTruncateDesc(!truncateDesc)}
                        >
                          {truncateDesc ? "Read More" : "Read Less"}
                        </Button>
                      )}
                    </Box>
                  )}
                </VStack>
              </GridItem>
              <GridItem w="100%" mt="-6" px={5}>
                <VStack gap={5} align="flex-end">
                  <VStack cursor="pointer" onClick={onFollowPageOpen}>
                    <HeadingLarge color="primary.500">
                      {pageFollowersData?.companyFollower?.length}
                    </HeadingLarge>
                    <HeadingMedium fontWeight="medium">FOLLOWERS</HeadingMedium>
                    <PageFollowers
                      isOpen={isFollowPageOpen}
                      onClose={onFollowPageClose}
                      pageFollowersData={pageFollowersData}
                    />
                  </VStack>
                  {currentPage ? (
                    <HStack gap={3}>
                      {/* {!pageData?.["company_profile_verified"] && (
                        <>
                          <Button
                            leftIcon={<CheckCircleIcon />}
                            onClick={onVerifyOpen}
                          >
                            Get &ldquo;Verified&rdquo; Badge
                          </Button>
                          <VerificationModal
                            isOpen={isVerifyOpen}
                            onClose={onVerifyClose}
                            type="company"
                            pageData={pageData}
                          />
                        </>
                      )} */}
                      <Button
                        leftIcon={<EditIcon />}
                        onClick={() =>
                          router.push(`/edit-page/${pageData?.["company_id"]}`)
                        }
                      >
                        Edit page
                      </Button>
                      <SocialMediaShareButtons
                        content={`Page - ${pageData?.company_name}`}
                        twitterHashtags={["kridas", "page", "social_media"]}
                        fbHashtag={"#kridas"}
                        twitterMention="kridas_sports"
                      />
                      {(isChildPage || isSubTeamPage) && (
                        <Button
                          ml="auto"
                          mr={5}
                          variant="outline"
                          onClick={() =>
                            router.push(
                              pageData?.company_type_name?.parent_page_id
                            )
                          }
                        >
                          Go to parent page
                        </Button>
                      )}
                      {/* <Button
                        fontWeight="normal"
                        colorScheme="primary"
                        leftIcon={<ArrowLeftIcon />}
                        onClick={() => router.push(routes.userPages)}
                      >
                        Go to Pages List
                      </Button> */}
                    </HStack>
                  ) : (
                    <HStack gap={5}>
                      <PageFollow pageId={pageData?.company_id} />
                      <SocialMediaShareButtons
                        content={`Page - ${pageData?.company_name}`}
                        twitterHashtags={["kridas", "page", "social_media"]}
                        fbHashtag={"#kridas"}
                        twitterMention="kridas_sports"
                      />
                      {(isChildPage || isSubTeamPage) && (
                        <Button
                          ml="auto"
                          mr={5}
                          variant="outline"
                          onClick={() =>
                            router.push(
                              pageData?.company_type_name?.parent_page_id
                            )
                          }
                        >
                          Go to parent page
                        </Button>
                      )}
                    </HStack>
                  )}
                </VStack>
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem colSpan={6}>
            <Box>
              <Tabs
                index={tabIndex}
                defaultIndex={
                  tab === "home"
                    ? 0
                    : tab === "about"
                    ? 2
                    : tab === "photos"
                    ? 3
                    : tab === "videos"
                    ? 4
                    : tab === "events"
                    ? 6
                    : 0
                }
                variant="unstyled"
                onChange={(index) => setTabIndex(index)}
                isLazy
              >
                <Box
                  bg="white"
                  h={20}
                  borderBottomLeftRadius="lg"
                  borderBottomRightRadius="lg"
                >
                  <TabList
                    color="gray.800"
                    bg="#eaeafb"
                    // w="7xl"
                    ml={5}
                    mr={5}
                    p={3}
                    pt={2}
                  >
                    {currentPage ? (
                      <Tab
                        _selected={selectedTab}
                        _focus={{ boxShadow: "none" }}
                      >
                        Home
                      </Tab>
                    ) : null}

                    <Tab _selected={selectedTab} _focus={{ boxShadow: "none" }}>
                      Posts
                    </Tab>
                    <Tab _selected={selectedTab} _focus={{ boxShadow: "none" }}>
                      About
                    </Tab>
                    <Tab
                      _selected={selectedTab}
                      _focus={{ boxShadow: "none" }}
                      /* ref={photosRef} */
                    >
                      Media
                    </Tab>
                    {/* <Tab _selected={selectedTab} _focus={{ boxShadow: "none" }}>
                      Videos
                    </Tab> */}

                    {/*  <Tab _selected={selectedTab} _focus={{ boxShadow: "none" }}>
                    Events
                  </Tab> */}
                    {/* <Tab _selected={selectedTab} _focus={{ boxShadow: "none" }}>
                      Followers
                    </Tab> */}
                    <Tab _selected={selectedTab} _focus={{ boxShadow: "none" }}>
                      Events
                    </Tab>
                    {isSubCatTeam && (
                      <Tab
                        _selected={selectedTab}
                        _focus={{ boxShadow: "none" }}
                      >
                        Players
                      </Tab>
                    )}
                    {isSubCatTeam && !isSubTeamPage && (
                      <Tab
                        _selected={selectedTab}
                        _focus={{ boxShadow: "none" }}
                      >
                        Teams
                      </Tab>
                    )}
                    {(isCatVenue || isSubCatVenue) && isParentPage && (
                      <Tab
                        _selected={selectedTab}
                        _focus={{ boxShadow: "none" }}
                      >
                        Venue
                      </Tab>
                    )}
                    {(isCatAcademy || isSubCatAcademy) && isParentPage && (
                      <Tab
                        _selected={selectedTab}
                        _focus={{ boxShadow: "none" }}
                      >
                        Academy
                      </Tab>
                    )}

                    <Tab _selected={selectedTab} _focus={{ boxShadow: "none" }}>
                      Sponsors
                    </Tab>

                    {isSubCatProduct && !isNonSportingPage && (
                      <Tab
                        _selected={selectedTab}
                        _focus={{ boxShadow: "none" }}
                      >
                        Products
                      </Tab>
                    )}

                    {isSubCatService && !isNonSportingPage && (
                      <Tab
                        _selected={selectedTab}
                        _focus={{ boxShadow: "none" }}
                      >
                        Services
                      </Tab>
                    )}

                    {(isPageVerified || isNonSportingPage) && (
                      <Tab
                        _selected={selectedTab}
                        _focus={{ boxShadow: "none" }}
                      >
                        Vouchers
                      </Tab>
                    )}

                    {/* <Tab _selected={selectedTab} _focus={{ boxShadow: "none" }}>
                      Vouchers
                    </Tab> */}
                  </TabList>
                </Box>

                <TabPanels py={4}>
                  {currentPage && (
                    <TabPanel p={0}>
                      <UserHomepageview setTabIndex={setTabIndex} />
                    </TabPanel>
                  )}

                  <TabPanel p={0}>
                    <Flex gap={3}>
                      <Box width="65%">
                        <PageFeedList pageData={pageData} />
                      </Box>
                      <Box w="35%">
                        {/* <VStack
                          bg="white"
                          w="full"
                          h="max-content"
                          align="flex-start"
                          p={4}
                          borderRadius={10}
                        >
                          <Text
                            fontWeight="500"
                            fontSize="14px"
                            textAlign="left"
                          >
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
                                    <Heading size={10}>
                                      Description Goes Here
                                    </Heading>
                                    <Text fontSize={14}>
                                      09:00 AM to 03:00 PM
                                    </Text>
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
                                    <Heading size={10}>
                                      Description Goes Here
                                    </Heading>
                                    <Text fontSize={14}>
                                      09:00 AM to 03:00 PM
                                    </Text>
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
                        </VStack> */}
                      </Box>
                    </Flex>
                  </TabPanel>
                  <TabPanel
                    // p={0}

                    p={6}
                    bg="white"
                  >
                    <UserPageAbout
                      currentPage={currentPage}
                      pageData={pageData}
                    />
                  </TabPanel>
                  <TabPanel mt={2} p={6} bg="white" borderRadius="xl">
                    <PageMedia pageData={pageData} currentPage={currentPage} />
                    {/* <PagePhotos pageData={pageData} currentPage={currentPage} /> */}
                  </TabPanel>
                  {/* <TabPanel p={0}>
                    <PageVideos pageData={pageData} />
                  </TabPanel> */}

                  {/* <TabPanel p={0}>
                    <PageFollowers />
                  </TabPanel> */}
                  <TabPanel p={0}>
                    <PageEventDisplay
                      currentPage={currentPage}
                      pageType={pageType}
                    />
                  </TabPanel>
                  {isSubCatTeam && (
                    <TabPanel p={0}>
                      {/* <EventPlayerList /> */}
                      <PlayersTab
                        pageData={pageData}
                        currentPage={currentPage}
                        isParentPage={isParentPage}
                        isChildPage={isChildPage}
                        isSubTeamPage={isSubTeamPage}
                      />
                    </TabPanel>
                  )}
                  {isSubCatTeam && !isSubTeamPage && (
                    <TabPanel p={0}>
                      <TeamPages
                        pageData={pageData}
                        currentPage={currentPage}
                        isChildPage={isChildPage}
                      />
                    </TabPanel>
                  )}
                  {(isCatVenue || isSubCatVenue) && isParentPage && (
                    <TabPanel p={0}>
                      <VenuePages
                        pageData={pageData}
                        currentPage={currentPage}
                        isChildPage={isChildPage}
                      />
                    </TabPanel>
                  )}
                  {(isCatAcademy || isSubCatAcademy) && isParentPage && (
                    <TabPanel p={0}>
                      <AcademyPages
                        pageData={pageData}
                        currentPage={currentPage}
                        isChildPage={isChildPage}
                      />
                    </TabPanel>
                  )}
                  <TabPanel p={0}>
                    <SponsorsTab
                      isCreator={currentPage}
                      type="company"
                      id={pageData?.["company_id"]}
                      sports={sports}
                    />
                  </TabPanel>
                  {isSubCatProduct && !isNonSportingPage && (
                    <TabPanel p={0}>
                      <ProductsTab
                        currentPage={currentPage}
                        pageId={pageData?.company_id}
                        isPageVerified={isPageVerified}
                      />
                    </TabPanel>
                  )}

                  {isSubCatService && !isNonSportingPage && (
                    <TabPanel p={0}>
                      <ServicesTab
                        currentPage={currentPage}
                        pageId={pageData?.company_id}
                        isPageVerified={isPageVerified}
                      />
                    </TabPanel>
                  )}

                  {(isPageVerified || isNonSportingPage) && (
                    <TabPanel p={0}>
                      <VouchersTab
                        currentPage={currentPage}
                        pageData={pageData}
                        isNonSportingPage={isNonSportingPage}
                      />
                    </TabPanel>
                  )}

                  {/* <TabPanel p={0}>
                    <ProductsList products={products} />
                  </TabPanel> */}
                </TabPanels>
              </Tabs>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}
// export const getStaticProps = async () => {
//   const wooCommerceProducts = await fetchWooCommerceProducts().catch((error) =>
//     console.error(error)
//   );

//   if (!wooCommerceProducts) {
//     return {
//       props: {},
//     };
//   }

//   return {
//     props: {
//       products: wooCommerceProducts.data,
//     },
//   };
// };
export default PageCommonHeader;
