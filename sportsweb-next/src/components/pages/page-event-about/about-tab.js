import React, { useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  VStack,
  Divider,
} from "@chakra-ui/react";
import UserProfileTab from "../../user/profile-section/user-profile-tab";
import PageEventAboutView from "./page-event-about-view";
import PageEventAboutEdit from "./page-event-about-edit";
import EventSportListView from "./event-sport-list-view";
import { AboutDetail, ContactInfo } from "../../ui/icons";
import EventSportListViewOnly from "./event-sport-list-view-only";
import PageEventAboutSummary from "./page-event-about-new";
import { useRouter } from "next/router";
import { useEventByIdJava } from "../../../hooks/event-hook";
function AboutTab({
  eventData,
  isLoadingEvent,
  categories,
  countriesData,
  sports,
}) {
  const router = useRouter();
  const { eventId } = router.query;
  const [showText, setShowText] = useState(false);
  // const { data: eventData, isLoading: eventLoading } =
  //   useEventByIdJava(eventId);

  return (
    <>
      {/* <VStack
        // spacing={6}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        // p={5}
        w="full"
      > */}
      {/* <PageEventAboutView
          currentEvent={currentEvent}
          eventData={eventData}
          // setShowText={setShowText}
          type="public"
        />
        <EventSportListViewOnly
          eventData={eventData}
          currentEvent={currentEvent}
        /> */}
      <PageEventAboutSummary
        eventData={eventData}
        isLoadingEvent={isLoadingEvent}
        categories={categories}
        countriesData={countriesData}
        sports={sports}
      />
      {/* </VStack> */}
    </>
  );
}

export default AboutTab;
