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
  HStack,
  Heading,
  usePanGesture,
  Input,
  IconButton,
  useDisclosure,
  Spacer,
} from "@chakra-ui/react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  AvatarGroup,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import styles from "../../../../../src/components/user/user-pages/Style-EditPages.module.css";
import { MdModeEditOutline } from "react-icons/md";
import AboutPageEdit from "../edit-page-component/user-pages-about-edit";
import AboutPageView from "../edit-page-component/user-pages-about-view";
import PageViewSportsProfile from "../sports-profile-components/user-pages-view-sports-profile";
import ContactInformation from "../user-pages-about-contact-information";
import EditContactInformation from "../user-pages-edit-contact-information";
import {
  usePage,
  useUpdatePage,
  usePageFollowersData,
} from "../../../../hooks/page-hooks";
import { useRouter } from "next/router";
import Socialmediapreference from "../user-pages-view-socialmediapreference";
import UserPageEditSocial from "../user-page-edit-socialMediaPreference";
import PictureModal from "../../../common/picture-modal";
import VerifyProfileCompleteModal from "../../../common/user-pages-verification-workflow/user-pages-verify-profilecomplete";
import { EditIcon } from "../../../ui/icons";
import VerifyProfileIncompleteModal from "../../../common/user-pages-verification-workflow/user-pages-verify-profileincomplete";
import UserHomepageview from "./user-pages-homepageview";
import { BsArrowLeft } from "react-icons/bs";
import PageSponsorshipVerify from "../page-sponsorship-info/user-pages-sponsorship-verify";
import { verifyPage } from "../../../../helper/constants/page-constants";
import { usePageStatistics } from "../../../../hooks/page-statistics-hooks";
import PageSponsorshipNotVerified from "../page-sponsorship-info/user-pages-sponsorship-notverified";
import PageFollowers from "../user-pages-followers";

function Header(props) {
  const [showText, setShowText] = useState(false);
  const [show, setShow] = useState(false);

  const router = useRouter();
  const { pageId } = router.query;
  let tab = router.query?.tab;

  const { data: pageStatisticsData = [] } = usePageStatistics(pageId);

  // const isProfileDetailsFilled = false;
  const [isProfileDetailsFilled, setIsProfileDetailsFilled] = useState(false);
  const { data: pageData = {} } = usePage(pageId);
  //TeamStatistics
  const pageTeamStatisticsData = pageStatisticsData.filter(
    ({ categorywise_statistics }) => categorywise_statistics.category === "team"
  ).sort((a, b) => Date.parse(a.created_date) - Date.parse(b.created_date));
  console.log(pageTeamStatisticsData);
  //VenueStatistics
  const pageVenueStatisticsData = pageStatisticsData.filter(
    ({ categorywise_statistics }) =>
      categorywise_statistics.category === "venue"
  ).sort((a, b) => Date.parse(a.created_date) - Date.parse(b.created_date));
  //AcademyStatistics
  const pageAcademyStatisticsData = pageStatisticsData.filter(
    ({ categorywise_statistics }) =>
      categorywise_statistics.category === "academy"
  ).sort((a, b) => Date.parse(a.created_date) - Date.parse(b.created_date));
  const isProfileVerified = pageData?.company_profile_verified;
  const profilePicRef = useRef();
  const coverPicRef = useRef();
  const [view, setView] = useState(false);
  const { mutate } = useUpdatePage();
  const [following, setFollowing] = useState(false);
  const handleFile = (e, type) => {
    mutate({
      pageData,
      values: { [type]: e.target.files[0] },
      type: "image",
    });
  };
  const [tabIndex, setTabIndex] = useState(tab ? 0 : 2);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isVerifyModalOpen,
    onOpen: onVerifyModalOpen,
    onClose: onVerifyModalClose,
  } = useDisclosure();
  const {
    isOpen: isSponsorInfoModalOpen,
    onOpen: onSponsorInfoModalOpen,
    onClose: onSponsorInfoModalClose,
  } = useDisclosure();
  const subcat = pageData?.category_arr?.map(
    ({ category_name }) => category_name
  );

  const handleVerification = (pageData, pageStatisticsData) => {
    const { isProfileComplete, percentage } = verifyPage(
      pageData,
      pageStatisticsData
    );
    setIsProfileDetailsFilled(isProfileComplete);
    onVerifyModalOpen();
  };

  const { data: pageFollowersData = {} } = usePageFollowersData(pageId);
  const followerRef = useRef();

  return (
    <>
      <Box w="7xl" mt={5}>
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
            <Input
              type="file"
              id="coverPic"
              display="none"
              ref={coverPicRef}
              onChange={(e) => handleFile(e, "pageCoverImage")}
            />
            <IconButton
              aria-label="upload picture"
              icon={<EditIcon color="white" />}
              isRound
              size="xs"
              colorScheme="primary"
              border="2px solid white"
              position="absolute"
              top="10px"
              right="10px"
              onClick={() => coverPicRef.current.click()}
            />

            <Flex
              justifyContent={"flex-start"}
              position="relative"
              mt={-9}
              px={6}
            >
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
                >
                  <Input
                    type="file"
                    id="profilePic"
                    display="none"
                    ref={profilePicRef}
                    onChange={(e) => handleFile(e, "pageProfileImage")}
                  />
                  <IconButton
                    aria-label="upload picture"
                    icon={<EditIcon color="white" />}
                    isRound
                    size="xs"
                    colorScheme="primary"
                    border="2px solid white"
                    position="absolute"
                    top="5px"
                    right="0px"
                    onClick={() => profilePicRef.current.click()}
                  />
                </Avatar>
              </HStack>
            </Flex>
          </GridItem>
          <GridItem
            colSpan={6}
            h="min-content"
            w={["100%", "100%", "100%"]}
            bg="white"
          >
            <Flex gap={44} mt={3}>
              <Box>
                <VStack spacing={1.5} align="stretch" ml={[5, 10, 127]}>
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
              <Flex gap={7}>
                <Box>
                  <VStack spacing={1} align="center">
                    <Box>
                      <Text fontSize="15px">
                        <b>
                          {pageFollowersData?.companyFollower?.length} Followers
                        </b>
                      </Text>
                    </Box>
                    <Box>
                      <AvatarGroup
                        size="sm"
                        max={3}
                        cursor="pointer"
                        onClick={() => {
                          router.push(`/page/${pageId}`);
                          followerRef.current.click();
                        }}
                      >
                        {pageFollowersData?.companyFollower?.map(
                          ({ name, id, avatar }) => (
                            <Avatar key={id} name={name} src={avatar} />
                          )
                        )}
                      </AvatarGroup>
                    </Box>
                  </VStack>
                </Box>
                <Box>
                  <VStack spacing={1} align="center">
                    <Box>
                      <Text fontSize="15px">
                        <b>
                          {pageFollowersData?.companyFollowing?.length}{" "}
                          Following
                        </b>
                      </Text>
                    </Box>
                    <Box>
                      <AvatarGroup
                        size="sm"
                        max={3}
                        cursor="pointer"
                        onClick={() => {
                          router.push(`/user/pages/${pageId}?tab=following`);
                          followerRef.current.click();
                        }}
                      >
                        {pageFollowersData?.companyFollowing?.map(
                          ({ name, id, avatar }) => (
                            <Avatar key={id} name={name} src={avatar} />
                          )
                        )}
                      </AvatarGroup>
                    </Box>
                  </VStack>
                </Box>
                <Box mt="2">
                  <Flex gap={7} align="center" justify="center">
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      w="44"
                      p={5}
                      borderRadius="none"
                      // onClick={onVerifyModalOpen}
                      onClick={() =>
                        handleVerification(pageData, pageStatisticsData)
                      }
                    >
                      Get ”Verified” Badge
                    </Button>
                    {isProfileDetailsFilled ? (
                      <VerifyProfileCompleteModal
                        isOpen={isVerifyModalOpen}
                        onClose={onVerifyModalClose}
                        type="page"
                      />
                    ) : (
                      <VerifyProfileIncompleteModal
                        isOpen={isVerifyModalOpen}
                        onClose={onVerifyModalClose}
                        name={pageData?.company_name}
                      />
                    )}

                    <Button
                      colorScheme="blue"
                      variant="outline"
                      w="44"
                      p={5}
                      borderRadius="none"
                      onClick={onSponsorInfoModalOpen}
                    >
                      Get Sponsorship
                    </Button>
                    {isProfileVerified ? (
                      <PageSponsorshipVerify
                        isOpen={isSponsorInfoModalOpen}
                        onClose={onSponsorInfoModalClose}
                      />
                    ) : (
                      <PageSponsorshipNotVerified
                        pagename={pageData?.company_name}
                        isOpen={isSponsorInfoModalOpen}
                        onClose={onSponsorInfoModalClose}
                      />
                    )}
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </GridItem>

          <GridItem colSpan={6} w="full" bg="white">
            <Flex justify="flex-start" alignItems="center" gap={3} pr={2}>
              <Spacer />
              <BsArrowLeft color="#2F80ED" />
              <Link
                color="#2F80ED"
                textDecoration="none"
                onClick={() => router.push("/user/pages")}
              >
                Go to Pages List
              </Link>
            </Flex>
          </GridItem>
          <GridItem colSpan={6} w="full">
            <Tabs
              defaultIndex={tab ? 0 : 2}
              variant="unstyled"
              onChange={(index) => setTabIndex(index)}
            >
              <TabList gap={5} color="#2F80ED" bg="white" fontSize="16px">
                <Tab _selected={{ borderBottom: "solid black" }}>Home</Tab>
                <Tab _selected={{ borderBottom: "solid black" }}>Posts</Tab>
                <Tab _selected={{ borderBottom: "solid black" }}>About</Tab>
                <Tab _selected={{ borderBottom: "solid black" }}>Photos</Tab>
                <Tab _selected={{ borderBottom: "solid black" }}>Videos</Tab>
                <Tab _selected={{ borderBottom: "solid black" }}>Polls</Tab>
                <Tab _selected={{ borderBottom: "solid black" }}>Events</Tab>
                <Tab
                  _selected={{ borderBottom: "solid black" }}
                  ref={followerRef}
                >
                  Followers
                </Tab>
              </TabList>
              <TabPanels py={3}>
                <TabPanel p={0}>
                  <UserHomepageview />
                </TabPanel>
                <TabPanel p={0}>
                  <p>Posts</p>
                </TabPanel>
                <TabPanel p={0}>
                  <Box h="100%" w="7xl" textAlign="left">
                    <Tabs
                      variant="unstyled"
                      orientation="vertical"
                      h="100%"
                      w={["7xl", "7xl", "7xl"]}
                      align="start"
                      onChange={() => setShowText(false)}
                    >
                      <TabList gap={4}>
                        <Tab
                          _selected={{ color: "black", bg: "white" }}
                          w={["32", "32", "48"]}
                        >
                          About This Page
                        </Tab>
                        <Tab _selected={{ color: "black", bg: "white" }}>
                          Contact Information
                        </Tab>
                        <Tab _selected={{ color: "black", bg: "white" }}>
                          Social Media Presence{" "}
                        </Tab>
                        <Tab _selected={{ color: "black", bg: "white" }}>
                          Sports Profile
                        </Tab>
                      </TabList>
                      <TabPanels>
                        <TabPanel bg="white" h="2xl">
                          <VStack
                            // divider={<StackDivider borderColor='gray.200' />}
                            spacing={4}
                            align="stretch"
                          >
                            {showText ? (
                              <AboutPageEdit setShowText={setShowText} />
                            ) : (
                              <AboutPageView setShowText={setShowText} type="private" />
                            )}
                          </VStack>
                        </TabPanel>
                        <TabPanel bg="white" h="min-content">
                          {showText ? (
                            <EditContactInformation setShowText={setShowText} />
                          ) : (
                            <ContactInformation setShowText={setShowText} type="private" />
                          )}
                        </TabPanel>
                        <TabPanel bg="white" h="2xl">
                          {showText ? (
                            <UserPageEditSocial setShowText={setShowText} />
                          ) : (
                            <Socialmediapreference setShowText={setShowText} type="private"/>
                          )}
                        </TabPanel>
                        <TabPanel bg="white" h="max-content">
                          {showText === false && (
                            <PageViewSportsProfile
                              pageTeamStatisticsData={pageTeamStatisticsData}
                              pageVenueStatisticsData={pageVenueStatisticsData}
                              pageAcademyStatisticsData={
                                pageAcademyStatisticsData
                              }
                              type="private"
                            />
                          )}
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </Box>
                </TabPanel>
                <TabPanel p={0}>
                  <p>Photos</p>
                </TabPanel>
                <TabPanel p={0}>
                  <p>Videos</p>
                </TabPanel>
                <TabPanel p={0}>
                  <p>Polls</p>
                </TabPanel>
                <TabPanel p={0}>
                  <p>Events</p>
                </TabPanel>
                <TabPanel p={0}>
                  <PageFollowers />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}
export default Header;
