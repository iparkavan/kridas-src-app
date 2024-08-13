import { useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  Icon,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Tabs, TabPanels, TabPanel } from "@chakra-ui/react";
import { isBefore, isAfter, format } from "date-fns";
import { HeadingMedium, HeadingSmall } from "../../ui/heading/heading";

import PictureModal from "../../common/picture-modal";
import { EditIcon, LocationIcon } from "../../ui/icons";

import EventFeed from "../../events/event-feed";
import AboutTab from "../page-event-about/about-tab";

import { useEventFollowersData } from "../../../hooks/event-hook";
import { useRouter } from "next/router";

import EventInterestedUserList from "./event-interested-user-list";
import Button from "../../ui/button";
import PageEventTab from "./page-event-tab";

import SocialMediaShareButtons from "../../common/social-media-share-buttons";

import CoverImage from "../../common/cover-image";
import EmptyCoverImage from "../../common/empty-cover-image";

import EventTeams from "./event-teams";
import LiveStream from "./event-live-stream";

import EventHome from "./event-home";
import EventMedia from "./event-media";
import SponsorsTab from "../../common/sponsors/sponsors-tab";

// import EventPointTable from "../page-event-point-table/event-point-table";
import EventMarketPlace from "../../market-place/event-market-place";
import { useCategoriesByType } from "../../../hooks/category-hooks";
import { useCountries } from "../../../hooks/country-hooks";
import { TextSmall } from "../../ui/text/text";

import Tooltip from "../../ui/tooltip";
import Skeleton from "../../ui/skeleton";
import routes from "../../../helper/constants/route-constants";
import { useSports } from "../../../hooks/sports-hooks";
import { SportIcons } from "../../../helper/constants/sports-icons-constant";
import EventInterest from "./event-interest";
import EventFixtures from "../../events/event-fixtures";
import EventStandings from "../../events/event-standings";

function EventHeader({ currentEvent, eventData, isLoadingEvent }) {
  const formatDate = (date) => format(new Date(date), "dd-MMM-yyyy  h:mm aa");

  const address = eventData && JSON.parse(eventData.eventAddress);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isIntrestOpen,
    onOpen: onIntrestOpen,
    onClose: onIntrestClose,
  } = useDisclosure();

  const router = useRouter();
  const { eventId } = router.query;

  // const profilePicRef = useRef();
  // const coverPicRef = useRef();
  // const [showText, setShowText] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const { data: categories } = useCategoriesByType("EVT");
  const { data: countriesData = [] } = useCountries();
  const { data: eventFollowersData } = useEventFollowersData(eventId);
  const { data: sports = [], isSuccess: isSportsSuccess } = useSports();

  const sportId = eventData?.tournaments?.map((id) => id.sportsRefid);

  const sportType = sportId?.map(
    (id) => sports?.find((type) => type?.sports_id === id)?.sports_code
  );

  const IntrestedCount = eventFollowersData?.followerList?.length;
  const UserProfileTabPanel = (tabpanelProps) => (
    <TabPanel p={0} {...tabpanelProps} />
  );

  const isRegistrationEnabled =
    isAfter(new Date(), new Date(eventData?.eventRegStartdate)) &&
    isBefore(new Date(), new Date(eventData?.eventRegLastdate));

  if (isLoadingEvent) return <Skeleton>Loading..</Skeleton>;
  else
    return (
      <>
        <Box p={6} borderRadius="xl" position="relative" bg="white">
          {eventData?.eventBanner ? (
            <>
              <CoverImage
                modalOpen={onOpen}
                coverimage={eventData?.eventBanner}
              />
              <PictureModal
                isOpen={isOpen}
                onClose={onClose}
                src={eventData?.eventBanner}
                alt="Event cover image"
              />
            </>
          ) : (
            <EmptyCoverImage
              coverimage={"url('/images/no-banner-image-page.jpg')"}
            />
          )}

          <Flex
            direction={{ base: "column", md: "row" }}
            mt="-50px"
            px={{ md: 7 }}
            justifyContent="space-between"
          >
            <Box>
              <Avatar
                size={"xl"}
                name={eventData?.eventName}
                src={eventData?.eventLogo}
                alt={"Event profile"}
                css={{
                  border: "2px solid white",
                }}
                position="relative"
              >
                {/* {currentEvent ? (
                <>
                  <Input
                    type="file"
                    id="profilePic"
                    display="none"
                    ref={profilePicRef}
                    onChange={(e) => handleFile(e, "eventProfileImage")}
                  />
                  <IconButton
                    aria-label="upload picture"
                    icon={<EditIcon color="white" />}
                    isRound
                    size="xs"
                    variant="solid"
                    tooltipLabel="Edit event Logo"
                    colorScheme="primary"
                    border="2px solid white"
                    position="absolute"
                    top="5px"
                    right="0px"
                    onClick={() => profilePicRef.current.click()}
                  />
                </>
              ) : null} */}
              </Avatar>
              <VStack align="flex-start" mt={1}>
                <HeadingMedium fontWeight="medium">
                  {eventData?.eventName}
                </HeadingMedium>
                <HStack>
                  <HeadingSmall fontWeight="normal">
                    {
                      categories?.find(
                        (a) => a.category_id === eventData?.eventCategoryId
                      )?.category_name
                    }
                  </HeadingSmall>
                  <HeadingSmall fontWeight="normal">
                    {" "}
                    {"Organized By"}{" "}
                  </HeadingSmall>
                  <HeadingSmall
                    fontWeight="normal"
                    color="blue"
                    cursor="pointer"
                    onClick={() => {
                      router.push(
                        routes.page(eventData?.eventOrganizers?.[0]?.companyId)
                      );
                    }}
                  >
                    {eventData?.eventOrganizers?.[0]?.organizerName}
                  </HeadingSmall>
                </HStack>
                <TextSmall fontWeight="normal">
                  {eventData && formatDate(eventData?.eventStartdate)} --{" "}
                  {eventData && formatDate(eventData?.eventEnddate)}
                </TextSmall>
                <HStack>
                  <LocationIcon color="gray.500" />
                  <TextSmall color="gray.500">
                    {address?.city}{" "}
                    {
                      countriesData
                        ?.find((c) => c["country_code"] == address?.country)
                        ?.country_states?.find(
                          (s) => s["state_code"] == address?.state
                        )?.["state_name"]
                    }{" "}
                    {
                      countriesData?.find(
                        (c) => c["country_code"] == address?.country
                      )?.["country_name"]
                    }{" "}
                  </TextSmall>
                </HStack>
              </VStack>
            </Box>

            <VStack alignItems="flex-start" spacing={6}>
              <Flex
                mt={{ base: 2, md: "90px" }}
                ml={{ md: "auto" }}
                gap={{ base: 5, lg: 10 }}
                direction={{ base: "column", md: "row" }}
                alignItems="flex-start"
              >
                <EventInterest type="card" eventData={eventData} />
                {isRegistrationEnabled && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/register/${eventData?.eventId}`)
                    }
                  >
                    REGISTER
                  </Button>
                )}
                <HStack spacing={{ base: 5, lg: 10 }}>
                  {currentEvent && (
                    <>
                      <Flex gap={5}>
                        <Button
                          leftIcon={<EditIcon />}
                          minW="none"
                          alignSelf={{ base: "center", md: "flex-start" }}
                          onClick={() =>
                            router.push(`/edit-event/${eventData?.eventId}`)
                          }
                        >
                          Edit Event
                        </Button>
                      </Flex>
                    </>
                  )}

                  <SocialMediaShareButtons
                    content={`Event - ${eventData?.eventName}`}
                    twitterHashtags={["kridas", "events", "social_media"]}
                    fbHashtag={"#kridas"}
                    twitterMention="kridas_sports"
                  />
                </HStack>
              </Flex>

              <Flex
                mt={{ base: 2, md: "90px" }}
                ml={{ md: "auto" }}
                gap={{ base: 5, lg: 10 }}
                direction={{ base: "column", md: "row" }}
                justifyContent="space-between"
                w="full"
              >
                <HStack gap={1}>
                  {sportType?.map((ids) => {
                    const SportName = sports?.find(
                      (sport) => sport?.sports_code === ids
                    )?.sports_name;
                    const SportIcon = SportIcons(ids);
                    return (
                      <Tooltip key={ids} label={SportName}>
                        <span>
                          <Icon boxSize={6} as={SportIcon} />
                        </span>
                      </Tooltip>
                    );
                  })}
                </HStack>
                {/* <Spacer /> */}
                <VStack align="center" onClick={onIntrestOpen} cursor="pointer">
                  <HeadingMedium>{IntrestedCount}</HeadingMedium>
                  <HeadingMedium>Interested</HeadingMedium>
                </VStack>
              </Flex>
            </VStack>
          </Flex>
          <EventInterestedUserList
            eventFollowersData={eventFollowersData}
            onIntrestOpen={onIntrestOpen}
            isIntrestOpen={isIntrestOpen}
            onIntrestClose={onIntrestClose}
          />
          <PageEventTab
            tabIndex={tabIndex}
            setTabIndex={setTabIndex}
            currentEvent={currentEvent}
            mt={4}
            // eventSponsors={eventSponsors}
            // eventWithFixtures={eventWithFixtures}
            // eventWithStandings={eventWithStandings}
          />
        </Box>
        <Box mt={4} p={6} bg="white" borderRadius="xl">
          <Tabs index={tabIndex} isLazy>
            <TabPanels>
              {currentEvent && (
                <UserProfileTabPanel>
                  <EventHome
                    eventData={eventData}
                    currentEvent={currentEvent}
                    sportType={sportType}
                  />
                </UserProfileTabPanel>
              )}
              <UserProfileTabPanel>
                <EventFeed
                  eventData={eventData}
                  currentEvent={currentEvent}
                  setTabIndex={setTabIndex}
                  sportType={sportType}
                  // eventSponsors={eventSponsors}
                />
              </UserProfileTabPanel>
              <UserProfileTabPanel>
                <AboutTab
                  categories={categories}
                  eventData={eventData}
                  isLoadingEvent={isLoadingEvent}
                  countriesData={countriesData}
                  sports={sports}
                />
              </UserProfileTabPanel>

              <UserProfileTabPanel>
                <EventMedia currentEvent={currentEvent} eventData={eventData} />
              </UserProfileTabPanel>

              <UserProfileTabPanel m={-6}>
                <SponsorsTab
                  isCreator={currentEvent}
                  type="event"
                  id={eventData?.eventId}
                  sports={sports}
                />
              </UserProfileTabPanel>
              <UserProfileTabPanel>
                <EventTeams
                  eventData={eventData}
                  sports={sports}
                  currentEvent={currentEvent}
                />
              </UserProfileTabPanel>
              <UserProfileTabPanel>
                <EventFixtures
                  currentEvent={currentEvent}
                  eventData={eventData}
                  sports={sports}
                />
              </UserProfileTabPanel>
              <UserProfileTabPanel>
                <EventStandings
                  currentEvent={currentEvent}
                  eventData={eventData}
                  sports={sports}
                />
                {/* <EventPointTable
                  eventData={eventData}
                  isLoadingEvent={isLoadingEvent}
                  sports={sports}
                  isSportsSuccess={isSportsSuccess}
                /> */}
              </UserProfileTabPanel>
              <UserProfileTabPanel>
                <EventMarketPlace sportType={sportType} />
              </UserProfileTabPanel>
              <UserProfileTabPanel>
                <LiveStream
                  eventData={eventData}
                  isLoadingEvent={isLoadingEvent}
                />
              </UserProfileTabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </>
    );
}

export default EventHeader;
